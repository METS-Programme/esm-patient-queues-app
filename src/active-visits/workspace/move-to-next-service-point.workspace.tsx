import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  ButtonSet,
  ContentSwitcher,
  InlineLoading,
  InlineNotification,
  Layer,
  Select,
  SelectItem,
  Switch,
  TextArea,
} from '@carbon/react';
import {
  getSessionStore,
  navigate,
  restBaseUrl,
  showNotification,
  showSnackbar,
  type Workspace2DefinitionProps,
  useLayoutType,
  useSession,
} from '@openmrs/esm-framework';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { QueueStatus, extractErrorMessagesFromResponse, handleMutate } from '../../utils/utils';
import {
  type NewQueuePayload,
  addQueueEntry,
  getCareProvider,
  getCurrentPatientQueueByPatientUuid,
  getPatientQueueUuid,
  updateQueueEntry,
  useProviders,
  useQueueRoomLocations,
} from '../resources/patient-queues.resource';
import {
  type CreateQueueEntryFormData,
  createQueueEntrySchema,
} from '../resources/patient-queue-validation-schema.resource';
import { getSelectedPatientQueueUuid } from '../../helpers/helpers';
import { type PatientQueue } from '../../types/patient-queues';

import styles from './move-to-next-service-point.scss';

type MoveToNextServicePointFormProps = {
  patientUuid: string;
};

type ResponsiveWrapperProps = {
  children: React.ReactNode;
  isTablet: boolean;
};

const PRIORITY_LABELS = ['Not Urgent', 'Urgent', 'Emergency'] as const;

const STATUS_OPTIONS = [
  {
    status: QueueStatus.Pending,
    label: 'Move to Pending',
  },
  {
    status: QueueStatus.Completed,
    label: 'Move to Completed',
  },
] as const;

function getOpenmrsSpaBase() {
  return window.getOpenmrsSpaBase?.() ?? '/openmrs/spa/';
}

function getPostMoveRoute() {
  const spaBase = getOpenmrsSpaBase();
  const roles = getSessionStore().getState().session?.user?.roles ?? [];

  const hasClinicianRole = roles.some((role) => role?.display === 'Organizational: Clinician');
  const hasTriageRole = roles.some((role) => role?.display === 'Triage');

  if (hasClinicianRole) {
    return `${spaBase}home/clinical-room-patient-queues`;
  }

  if (hasTriageRole) {
    return `${spaBase}home/triage-patient-queues`;
  }

  return `${spaBase}home`;
}

const MoveToNextServicePointForm: React.FC<
  Workspace2DefinitionProps<
    MoveToNextServicePointFormProps,
    {
      startVisitWorkspaceName: string;
    }
  >
> = ({ closeWorkspace, workspaceProps: { patientUuid } }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const session = useSession();

  const selectedQueueState = getSelectedPatientQueueUuid().getState();

  const sessionLocationUuid = session?.sessionLocation?.uuid ?? '';
  const sessionUserUuid = session?.user?.uuid;

  const [queueEntry, setQueueEntry] = useState<PatientQueue | null>(null);
  const [providerUuid, setProviderUuid] = useState('');
  const [priorityIndex, setPriorityIndex] = useState(1);
  const [statusIndex, setStatusIndex] = useState(1);
  const [isFetchingProvider, setIsFetchingProvider] = useState(false);
  const [isFetchingQueueEntry, setIsFetchingQueueEntry] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { queueRoomLocations = [], error: errorLoadingQueueRooms } = useQueueRoomLocations(sessionLocationUuid);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateQueueEntryFormData>({
    mode: 'all',
    resolver: zodResolver(createQueueEntrySchema),
    defaultValues: {
      priorityComment: PRIORITY_LABELS[priorityIndex],
      priority: priorityIndex,
      status: STATUS_OPTIONS[statusIndex].status,
      locationTo: '',
      provider: '',
      comment: '',
    },
  });

  const selectedStatus = watch('status');
  const selectedNextQueueLocation = watch('locationTo');

  const {
    providers = [],
    error: errorLoadingProviders,
    isLoading: isLoadingProviders,
  } = useProviders(selectedNextQueueLocation);

  const shouldShowNextServicePointFields = selectedStatus === QueueStatus.Completed;

  const fetchProvider = useCallback(async () => {
    if (!sessionUserUuid) {
      return;
    }

    setIsFetchingProvider(true);

    try {
      const response = await getCareProvider(sessionUserUuid);
      const provider = response?.data?.results?.[0];

      if (!provider?.uuid) {
        showNotification({
          title: t('providerNotFound', 'Provider not found'),
          kind: 'warning',
          description: t('providerNotFoundDescription', 'No provider account is linked to the current user.'),
          millis: 3000,
        });
        return;
      }

      setProviderUuid(provider.uuid);
    } catch (error) {
      const errorMessages = extractErrorMessagesFromResponse(error);

      showNotification({
        title: t('couldNotGetProvider', "Couldn't get provider"),
        kind: 'error',
        critical: true,
        description:
          errorMessages.length > 0 ? errorMessages.join(', ') : t('unexpectedError', 'An unexpected error occurred'),
        millis: 3000,
      });
    } finally {
      setIsFetchingProvider(false);
    }
  }, [sessionUserUuid, t]);

  const fetchQueueEntry = useCallback(async () => {
    const selectedQueueUuid = selectedQueueState?.patientQueueUuid;

    if (!selectedQueueUuid) {
      return;
    }

    setIsFetchingQueueEntry(true);

    try {
      const response = await getPatientQueueUuid(selectedQueueUuid);

      if (response?.status === 200 && response?.data) {
        setQueueEntry(response.data);
        return;
      }

      showNotification({
        title: t('queueEntryNotFound', 'Queue entry not found'),
        kind: 'warning',
        description: t('queueEntryNotFoundDescription', 'The server did not return a valid queue entry.'),
        critical: true,
        millis: 3000,
      });
    } catch (error) {
      const errorMessages = extractErrorMessagesFromResponse(error);

      showNotification({
        title: t('couldNotGetQueueEntry', "Couldn't get queue entry"),
        kind: 'error',
        critical: true,
        description:
          errorMessages.length > 0 ? errorMessages.join(', ') : t('unexpectedError', 'An unexpected error occurred'),
        millis: 3000,
      });
    } finally {
      setIsFetchingQueueEntry(false);
    }
  }, [selectedQueueState?.patientQueueUuid, t]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  useEffect(() => {
    fetchQueueEntry();
  }, [fetchQueueEntry]);

  useEffect(() => {
    setValue('priorityComment', PRIORITY_LABELS[priorityIndex], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue('priority', priorityIndex, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [priorityIndex, setValue]);

  useEffect(() => {
    setValue('status', STATUS_OPTIONS[statusIndex].status, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [setValue, statusIndex]);

  useEffect(() => {
    const defaultQueueRoom = queueRoomLocations?.[0]?.uuid;

    if (defaultQueueRoom && !selectedNextQueueLocation) {
      setValue('locationTo', defaultQueueRoom, {
        shouldValidate: true,
      });
    }
  }, [queueRoomLocations, selectedNextQueueLocation, setValue]);

  useEffect(() => {
    const defaultProvider = providers?.[0]?.uuid ?? session?.currentProvider?.uuid;

    if (defaultProvider) {
      setValue('provider', defaultProvider, {
        shouldValidate: true,
      });
    }
  }, [providers, session?.currentProvider?.uuid, setValue]);

  const getCurrentQueueEntry = useCallback(async () => {
    const response = await getCurrentPatientQueueByPatientUuid(patientUuid, sessionLocationUuid);
    const queues = response?.data?.results?.[0]?.patientQueues ?? [];

    return queues.find((item) => item?.patient?.uuid === patientUuid);
  }, [patientUuid, sessionLocationUuid]);

  const handleSave = useCallback(
    async (formValues: CreateQueueEntryFormData) => {
      if (!providerUuid) {
        showNotification({
          title: t('missingProvider', 'Missing provider'),
          kind: 'error',
          description: t(
            'missingProviderDescription',
            'Unable to move this patient because no provider was found for the current user.',
          ),
          millis: 3000,
        });
        return;
      }

      setIsSubmitting(true);

      try {
        const currentQueueEntry = queueEntry?.uuid ? queueEntry : await getCurrentQueueEntry();

        if (!currentQueueEntry?.uuid) {
          showNotification({
            title: t('queueEntryNotFound', 'Queue entry not found'),
            kind: 'error',
            description: t('queueEntryNotFoundDescription', 'No active queue entry was found for this patient.'),
            millis: 3000,
          });
          return;
        }

        if (formValues.status === QueueStatus.Pending) {
          await updateQueueEntry(
            QueueStatus.Pending,
            providerUuid,
            currentQueueEntry.uuid,
            formValues.priority,
            formValues.priorityComment,
            formValues.comment ?? '',
          );

          showSnackbar({
            title: t('moveToNextServicePoint', 'Move back to your service point'),
            kind: 'success',
            subtitle: t('backToQueue', 'Successfully moved patient back to your service point.'),
            autoClose: true,
          });
        }

        if (formValues.status === QueueStatus.Completed) {
          if (!formValues.locationTo) {
            showNotification({
              title: t('missingServicePoint', 'Missing service point'),
              kind: 'error',
              description: t('selectNextServicePointDescription', 'Please choose the next service point.'),
              millis: 3000,
            });
            return;
          }

          await updateQueueEntry(
            QueueStatus.Completed,
            providerUuid,
            currentQueueEntry.uuid,
            formValues.priority,
            formValues.priorityComment,
            formValues.comment ?? '',
          );

          const request: NewQueuePayload = {
            patient: patientUuid,
            provider: formValues.provider ?? '',
            locationFrom: sessionLocationUuid,
            locationTo: formValues.locationTo,
            status: QueueStatus.Pending,
            priority: formValues.priority,
            priorityComment: formValues.priorityComment,
            comment: formValues.comment ?? '',
            queueRoom: formValues.locationTo,
          };

          const createQueueResponse = await addQueueEntry(request);

          await updateQueueEntry(
            QueueStatus.Pending,
            providerUuid,
            createQueueResponse.data?.uuid,
            formValues.priority,
            formValues.priorityComment,
            formValues.comment ?? '',
          );

          showSnackbar({
            title: t('moveToNextServicePoint', 'Move to next service point'),
            kind: 'success',
            subtitle: t('moveToNextServicePointSuccessfully', 'Moved to next service point successfully.'),
            autoClose: true,
          });
        }

        handleMutate(`${restBaseUrl}/patientqueue`);
        handleMutate(`${restBaseUrl}/queuestatistics`);

        closeWorkspace();

        navigate({
          to: getPostMoveRoute(),
        });
      } catch (error) {
        const errorMessages = extractErrorMessagesFromResponse(error);

        showNotification({
          title: t('moveToNextServicePointError', 'Error moving to next service point'),
          kind: 'error',
          critical: true,
          description:
            errorMessages.length > 0 ? errorMessages.join(', ') : t('unexpectedError', 'An unexpected error occurred'),
          millis: 3000,
        });

        handleMutate(`${restBaseUrl}/patientqueue`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [closeWorkspace, getCurrentQueueEntry, patientUuid, providerUuid, queueEntry, sessionLocationUuid, t],
  );

  const isInitialLoading = isFetchingProvider || isFetchingQueueEntry;

  const disableSubmit =
    isInitialLoading ||
    isSubmitting ||
    !providerUuid ||
    !isValid ||
    (shouldShowNextServicePointFields && (!selectedNextQueueLocation || Boolean(errorLoadingQueueRooms)));

  return (
    <div className={styles.container}>
      {isInitialLoading ? (
        <InlineLoading
          className={styles.inlineLoading}
          description={t('loadingMoveDetails', 'Loading move details...')}
        />
      ) : null}

      <div className={styles.body}>
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
                  selectedIndex={priorityIndex}
                  className={styles.contentSwitcher}
                  onChange={({ index }) => {
                    const selectedIndex = Number(index ?? 0);
                    setPriorityIndex(selectedIndex);
                    field.onChange(PRIORITY_LABELS[selectedIndex]);
                  }}
                >
                  {PRIORITY_LABELS.map((label) => (
                    <Switch
                      key={label}
                      name={label.toLowerCase().replace(/\s+/g, '-')}
                      text={t(label.toLowerCase().replace(/\s+/g, ''), label)}
                    />
                  ))}
                </ContentSwitcher>

                {errors.priorityComment ? (
                  <p className={styles.errorMessage}>{errors.priorityComment.message}</p>
                ) : null}
              </>
            )}
          />
        </section>

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('status', 'Status')}</h4>

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <>
                <ContentSwitcher
                  size="md"
                  selectedIndex={statusIndex}
                  className={styles.contentSwitcher}
                  onChange={({ index }) => {
                    const selectedIndex = Number(index ?? 0);
                    setStatusIndex(selectedIndex);
                    field.onChange(STATUS_OPTIONS[selectedIndex].status);
                  }}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <Switch
                      key={option.status}
                      name={option.label.toLowerCase().replace(/\s+/g, '-')}
                      text={t(option.label.toLowerCase().replace(/\s+/g, ''), option.label)}
                    />
                  ))}
                </ContentSwitcher>

                {errors.status ? <p className={styles.errorMessage}>{errors.status.message}</p> : null}
              </>
            )}
          />
        </section>

        {shouldShowNextServicePointFields ? (
          <>
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
                      disabled={Boolean(errorLoadingQueueRooms)}
                      invalid={!!errors.locationTo}
                      invalidText={errors.locationTo?.message}
                      value={field.value ?? ''}
                      onChange={(event) => field.onChange(event.target.value)}
                    >
                      <SelectItem value="" text={t('selectNextServicePoint', 'Choose next service point')} />

                      {queueRoomLocations.map(({ uuid, display }) => (
                        <SelectItem key={uuid} value={uuid} text={display} />
                      ))}
                    </Select>
                  )}
                />

                {errorLoadingQueueRooms ? (
                  <InlineNotification
                    className={styles.errorNotification}
                    kind="error"
                    lowContrast
                    title={t('errorFetchingQueueRooms', 'Error fetching queue rooms')}
                    subtitle={
                      typeof errorLoadingQueueRooms === 'string'
                        ? errorLoadingQueueRooms
                        : t('errorFetchingQueueRoomsDescription', 'Unable to fetch queue rooms.')
                    }
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
                      disabled={isLoadingProviders || !selectedNextQueueLocation}
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
                    title={t('errorFetchingProviders', 'Error fetching providers')}
                    subtitle={t(
                      'errorLoadingProvidersDescription',
                      'Unable to fetch providers for the selected service point.',
                    )}
                  />
                ) : null}
              </ResponsiveWrapper>
            </section>

            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>{t('notes', 'Notes')}</h4>

              <ResponsiveWrapper isTablet={isTablet}>
                <Controller
                  name="comment"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      aria-label={t('comment', 'Comment')}
                      id="comment"
                      labelText=""
                      invalid={!!errors.comment}
                      invalidText={errors.comment?.message}
                      maxCount={500}
                      enableCounter
                    />
                  )}
                />
              </ResponsiveWrapper>
            </section>
          </>
        ) : null}
      </div>

      <ButtonSet className={styles.buttonSet}>
        <Button kind="secondary" onClick={closeWorkspace} className={styles.button} disabled={isSubmitting}>
          {t('cancel', 'Cancel')}
        </Button>

        <Button disabled={disableSubmit} type="button" onClick={handleSubmit(handleSave)} className={styles.button}>
          {isSubmitting ? (
            <InlineLoading description={`${t('submitting', 'Submitting')}...`} />
          ) : selectedStatus === QueueStatus.Pending ? (
            t('save', 'Save')
          ) : (
            t('moveToNextQueueRoom', 'Move to the next queue room')
          )}
        </Button>
      </ButtonSet>
    </div>
  );
};

function ResponsiveWrapper({ children, isTablet }: ResponsiveWrapperProps) {
  return isTablet ? (
    <Layer className={styles.responsiveLayer}>{children}</Layer>
  ) : (
    <div className={styles.responsiveWrapper}>{children}</div>
  );
}

export default MoveToNextServicePointForm;
