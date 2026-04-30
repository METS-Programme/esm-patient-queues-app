import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  ButtonSet,
  ContentSwitcher,
  Dropdown,
  InlineLoading,
  InlineNotification,
  Layer,
  Select,
  SelectItem,
  Switch,
  TextArea,
} from '@carbon/react';
import {
  ExtensionSlot,
  type Workspace2DefinitionProps,
  restBaseUrl,
  showNotification,
  showSnackbar,
  useConfig,
  useLayoutType,
  usePatient,
  useSession,
} from '@openmrs/esm-framework';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { type PatientQueueConfig } from '../../config-schema';
import { QueueStatus, handleMutate } from '../../utils/utils';
import {
  checkCurrentVisit,
  checkInQueue,
  useProviders,
  useQueueRoomLocations,
} from '../resources/patient-queues.resource';
import {
  type CreateQueueEntryFormData,
  createQueueEntrySchema,
} from '../resources/patient-queue-validation-schema.resource';

import styles from './start-a-visit-form.scss';
import { type NewCheckInPayload } from '../../types';

type VisitFormProps = {
  patientUuid: string;
};

type ExtraVisitInfo = {
  handleCreateExtraVisitInfo?: () => void;
  attributes?: unknown;
};

type ResponsiveWrapperProps = {
  children: React.ReactNode;
  isTablet: boolean;
};

const PRIORITY_LEVELS = [1, 2, 3] as const;

const StartVisitForm: React.FC<
  Workspace2DefinitionProps<
    VisitFormProps,
    {
      startVisitWorkspaceName: string;
    }
  >
> = ({ closeWorkspace, workspaceProps }) => {
  const patientUuid = workspaceProps?.patientUuid;
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const session = useSession();
  const config = useConfig<PatientQueueConfig>();
  const { patient } = usePatient(patientUuid);

  const sessionLocationUuid = session?.sessionLocation?.uuid ?? '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(0);
  const [extraVisitInfo, setExtraVisitInfo] = useState<ExtraVisitInfo | null>(null);

  const priorityLabels = useMemo(
    () => [t('notUrgent', 'Not Urgent'), t('urgent', 'Urgent'), t('emergency', 'Emergency')],
    [t],
  );

  const { queueRoomLocations = [], error: errorLoadingQueueRooms } = useQueueRoomLocations(sessionLocationUuid);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateQueueEntryFormData>({
    mode: 'onChange',
    resolver: zodResolver(createQueueEntrySchema),
    defaultValues: {
      status: QueueStatus.Pending,
      priority: PRIORITY_LEVELS[0],
      priorityComment: priorityLabels[0],
      locationTo: '',
      provider: '',
      comment: '',
    },
  });

  const selectedNextQueueLocation = useWatch({
    control,
    name: 'locationTo',
  });

  const selectedProvider = useWatch({
    control,
    name: 'provider',
  });

  const {
    providers = [],
    error: errorLoadingProviders,
    isLoading: isLoadingProviders,
  } = useProviders(selectedNextQueueLocation);

  useEffect(() => {
    const nextPriority = PRIORITY_LEVELS[contentSwitcherIndex] ?? PRIORITY_LEVELS[0];
    const nextPriorityComment = priorityLabels[contentSwitcherIndex] ?? priorityLabels[0];

    setValue('priority', nextPriority, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue('priorityComment', nextPriorityComment, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [contentSwitcherIndex, priorityLabels, setValue]);

  useEffect(() => {
    const defaultQueueRoom = queueRoomLocations?.[0]?.uuid;

    if (!defaultQueueRoom || selectedNextQueueLocation) {
      return;
    }

    setValue('locationTo', defaultQueueRoom, {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [queueRoomLocations, selectedNextQueueLocation, setValue]);

  useEffect(() => {
    if (!selectedNextQueueLocation) {
      setValue('provider', '', {
        shouldValidate: true,
        shouldDirty: false,
      });
      return;
    }

    const providerStillExists = providers.some((provider) => provider.uuid === selectedProvider);

    if (selectedProvider && providerStillExists) {
      return;
    }

    const defaultProvider = providers?.[0]?.uuid ?? '';

    setValue('provider', defaultProvider, {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [providers, selectedNextQueueLocation, selectedProvider, setValue]);

  const onSubmit = useCallback(
    async (formValues: CreateQueueEntryFormData) => {
      if (!patientUuid) {
        showNotification({
          title: t('missingPatient', 'Missing patient'),
          kind: 'error',
          critical: true,
          description: t('missingPatientDescription', 'Unable to start a visit because the patient is missing.'),
        });
        return;
      }

      if (!sessionLocationUuid) {
        showNotification({
          title: t('missingSessionLocation', 'Missing session location'),
          kind: 'error',
          critical: true,
          description: t(
            'missingSessionLocationDescription',
            'Please select a session location before starting a visit.',
          ),
        });
        return;
      }

      setIsSubmitting(true);

      try {
        const existingVisit = await checkCurrentVisit(patientUuid);

        if (existingVisit) {
          showNotification({
            title: t('visitExists', 'Visit already exists'),
            kind: 'info',
            description: t('activeVisitExists', 'An active visit already exists for this patient.'),
          });
          return;
        }

        const { handleCreateExtraVisitInfo, attributes: extraAttributes } = extraVisitInfo ?? {};

        const request: NewCheckInPayload = {
          patient: patientUuid,
          provider: formValues.provider,
          currentLocation: sessionLocationUuid,
          locationTo: formValues.locationTo,
          patientStatus: QueueStatus.Pending,
          priority: formValues.priority ?? PRIORITY_LEVELS[0],
          priorityComment: formValues.priorityComment ?? priorityLabels[0],
          visitComment: formValues.comment ?? '',
          queueRoom: formValues.locationTo,
          visitType: formValues.visitType ?? '',
          ...(config.showExtraVisitAttributesSlot && Array.isArray(extraAttributes)
            ? { attributes: extraAttributes }
            : {}),
        };

        const createQueueResponse = await checkInQueue(request);

        if (createQueueResponse.status !== 201) {
          throw new Error(t('failedToStartVisit', 'Failed to start visit'));
        }

        if (config.showExtraVisitAttributesSlot) {
          handleCreateExtraVisitInfo?.();
        }

        handleMutate(`${restBaseUrl}/patientqueue`);
        handleMutate(`${restBaseUrl}/queuestatistics`);

        showSnackbar({
          kind: 'success',
          title: t('startVisit', 'Start a visit'),
          subtitle: t('startVisitQueueSuccessfully', 'Patient has been added to active visits list and queue.'),
        });

        closeWorkspace();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : t('unexpectedError', 'An unexpected error occurred');

        showNotification({
          title: t('startVisitError', 'Error starting visit'),
          kind: 'error',
          critical: true,
          description: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      closeWorkspace,
      config.showExtraVisitAttributesSlot,
      extraVisitInfo,
      patientUuid,
      priorityLabels,
      sessionLocationUuid,
      t,
    ],
  );

  const hasQueueRooms = queueRoomLocations.length > 0;
  const hasProviders = providers.length > 0;

  const disableSubmit =
    isSubmitting ||
    !isValid ||
    !sessionLocationUuid ||
    !hasQueueRooms ||
    !hasProviders ||
    Boolean(errorLoadingQueueRooms) ||
    Boolean(errorLoadingProviders);

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.body}>
        {patient ? (
          <ExtensionSlot
            name="patient-header-slot"
            state={{
              patient,
              patientUuid,
              hideActionsOverflow: true,
            }}
          />
        ) : null}

        {Object.keys(errors).length > 0 ? (
          <InlineNotification
            className={styles.errorNotification}
            kind="error"
            lowContrast
            title={t('formValidationError', 'Please review the form')}
            subtitle={t('formValidationErrorDescription', 'Some required information is missing or invalid.')}
          />
        ) : null}

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('priority', 'Priority')}</h4>

          <Controller
            name="priorityComment"
            control={control}
            render={({ field }) => (
              <>
                <ContentSwitcher
                  size="md"
                  selectedIndex={contentSwitcherIndex}
                  className={styles.contentSwitcher}
                  onChange={({ index }) => {
                    const selectedIndex = Number(index ?? 0);

                    setContentSwitcherIndex(selectedIndex);
                    field.onChange(priorityLabels[selectedIndex] ?? priorityLabels[0]);
                  }}
                >
                  {priorityLabels.map((label) => (
                    <Switch key={label} name={label.toLowerCase().replace(/\s+/g, '-')} text={label} />
                  ))}
                </ContentSwitcher>

                {errors.priorityComment ? <p className={styles.error}>{errors.priorityComment.message}</p> : null}
              </>
            )}
          />
        </section>

        {contentSwitcherIndex !== 0 ? (
          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>{t('priorityLevel', 'Priority Levels')}</h4>

            <ResponsiveWrapper isTablet={isTablet}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id="priority-levels"
                    aria-label={t('prioritylevels', 'Priority Levels')}
                    label={t('choosePriorityLevel', 'Choose a priority level')}
                    titleText={t('choosePriorityLevel', 'Choose a priority level')}
                    items={[...PRIORITY_LEVELS]}
                    selectedItem={field.value ?? PRIORITY_LEVELS[0]}
                    itemToString={(item) => (item ? String(item) : '')}
                    onChange={({ selectedItem }) => {
                      field.onChange(selectedItem ?? PRIORITY_LEVELS[0]);
                    }}
                    invalid={!!errors.priority}
                    invalidText={errors.priority?.message}
                  />
                )}
              />
            </ResponsiveWrapper>
          </section>
        ) : null}

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('nextServicePoint', 'Next service point')}</h4>

          <ResponsiveWrapper isTablet={isTablet}>
            <Controller
              name="locationTo"
              control={control}
              render={({ field }) => (
                <Select
                  id="nextQueueLocation"
                  labelText=""
                  disabled={Boolean(errorLoadingQueueRooms) || !hasQueueRooms}
                  invalid={!!errors.locationTo}
                  invalidText={errors.locationTo?.message}
                  value={field.value ?? ''}
                  onChange={(event) => {
                    field.onChange(event.target.value);

                    setValue('provider', '', {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                >
                  <SelectItem text={t('selectNextServicePoint', 'Choose next service point')} value="" />

                  {queueRoomLocations.map((location) => (
                    <SelectItem key={location.uuid} text={location.display} value={location.uuid} />
                  ))}
                </Select>
              )}
            />

            {errorLoadingQueueRooms ? (
              <InlineNotification
                className={styles.errorNotification}
                kind="error"
                lowContrast
                subtitle={
                  typeof errorLoadingQueueRooms === 'string'
                    ? errorLoadingQueueRooms
                    : t('errorFetchingQueueRoomsDescription', 'Unable to fetch queue rooms.')
                }
                title={t('errorFetchingQueueRooms', 'Error fetching queue rooms')}
              />
            ) : null}
          </ResponsiveWrapper>
        </section>

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('selectAProvider', 'Select a provider')}</h4>

          <ResponsiveWrapper isTablet={isTablet}>
            <Controller
              name="provider"
              control={control}
              render={({ field }) => (
                <Select
                  id="providers-list"
                  labelText=""
                  disabled={isLoadingProviders || Boolean(errorLoadingProviders) || !selectedNextQueueLocation}
                  invalid={!!errors.provider}
                  invalidText={errors.provider?.message}
                  value={field.value ?? ''}
                  onChange={(event) => field.onChange(event.target.value)}
                >
                  <SelectItem text={t('selectProvider', 'Choose a provider')} value="" />

                  {providers.map((provider) => (
                    <SelectItem key={provider.uuid} text={provider.display} value={provider.uuid} />
                  ))}
                </Select>
              )}
            />

            {isLoadingProviders ? (
              <InlineLoading
                className={styles.inlineLoading}
                description={t('loadingProviders', 'Loading providers...')}
              />
            ) : null}

            {errorLoadingProviders ? (
              <InlineNotification
                className={styles.errorNotification}
                kind="error"
                lowContrast
                subtitle={t(
                  'errorLoadingProvidersDescription',
                  'Unable to fetch providers for the selected service point.',
                )}
                title={t('errorFetchingProviders', 'Error fetching providers')}
              />
            ) : null}
          </ResponsiveWrapper>
        </section>

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('visitNotes', 'Visit Notes')}</h4>

          <ResponsiveWrapper isTablet={isTablet}>
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  aria-label={t('comment', 'Comment')}
                  invalid={!!errors.comment}
                  invalidText={errors.comment?.message}
                  labelText=""
                  id="comment"
                  maxCount={500}
                  enableCounter
                />
              )}
            />
          </ResponsiveWrapper>
        </section>

        {config.showExtraVisitAttributesSlot ? (
          <section className={styles.section}>
            <ResponsiveWrapper isTablet={isTablet}>
              <ExtensionSlot
                name="extra-visit-attribute-slot"
                state={{
                  patientUuid,
                  setExtraVisitInfo,
                }}
              />
            </ResponsiveWrapper>
          </section>
        ) : null}
      </div>

      <ButtonSet className={styles.buttonSet}>
        <Button className={styles.button} kind="secondary" onClick={() => closeWorkspace()} disabled={isSubmitting}>
          {t('discard', 'Discard')}
        </Button>

        <Button className={styles.button} disabled={disableSubmit} kind="primary" type="submit">
          {isSubmitting ? (
            <InlineLoading description={`${t('saving', 'Saving')}...`} />
          ) : (
            <span>{t('startVisit', 'Start visit')}</span>
          )}
        </Button>
      </ButtonSet>
    </form>
  );
};

function ResponsiveWrapper({ children, isTablet }: ResponsiveWrapperProps) {
  return isTablet ? (
    <Layer className={styles.responsiveLayer}>{children}</Layer>
  ) : (
    <div className={styles.responsiveWrapper}>{children}</div>
  );
}

export default StartVisitForm;
