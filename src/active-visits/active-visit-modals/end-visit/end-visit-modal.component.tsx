import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Form,
  InlineLoading,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@carbon/react';
import {
  getCoreTranslation,
  getSessionStore,
  navigate,
  parseDate,
  restBaseUrl,
  showNotification,
  showSnackbar,
  useSession,
  useVisit,
} from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

import {
  getCareProvider,
  getCurrentPatientQueueByPatientUuid,
  updateQueueEntry,
  updateVisit,
} from '../resources/patient-queues.resource';
import {
  QueueStatus,
  extractErrorMessagesFromResponse,
  handleMutate,
} from '../../utils/utils';

import styles from './end-visit-modal.scss';

interface EndVisitConfirmationProps {
  patientUuid: string;
  closeModal: () => void;
}

const DEFAULT_PRIORITY_COMMENT = 'Not Urgent';

function getOpenmrsSpaBase() {
  return window.getOpenmrsSpaBase?.() ?? '/openmrs/spa/';
}

function getPostEndVisitRoute(hasQueueEntry: boolean) {
  const spaBase = getOpenmrsSpaBase();
  const roles = getSessionStore().getState().session?.user?.roles ?? [];

  if (!hasQueueEntry) {
    return `${spaBase}home`;
  }

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

const EndVisitConfirmation: React.FC<EndVisitConfirmationProps> = ({
  closeModal,
  patientUuid,
}) => {
  const { t } = useTranslation();
  const session = useSession();
  const { activeVisit } = useVisit(patientUuid);

  const [providerUuid, setProviderUuid] = useState('');
  const [isFetchingProvider, setIsFetchingProvider] = useState(false);
  const [isEndingVisit, setIsEndingVisit] = useState(false);

  const sessionUserUuid = session?.user?.uuid;
  const sessionLocationUuid = session?.sessionLocation?.uuid;

  const canSubmit = useMemo(() => {
    return !isEndingVisit && !isFetchingProvider;
  }, [isEndingVisit, isFetchingProvider]);

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
          description: t(
            'providerNotFoundDescription',
            'No provider account is linked to the current user.',
          ),
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
          errorMessages.length > 0
            ? errorMessages.join(', ')
            : t('unexpectedError', 'An unexpected error occurred'),
      });
    } finally {
      setIsFetchingProvider(false);
    }
  }, [sessionUserUuid, t]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  const handleEndVisit = useCallback(async () => {
    setIsEndingVisit(true);

    try {
      let hasEndedVisit = false;
      let hasEndedQueue = false;

      if (activeVisit?.uuid) {
        const endVisitPayload = {
          location: activeVisit.location?.uuid,
          startDatetime: activeVisit.startDatetime
            ? parseDate(activeVisit.startDatetime)
            : undefined,
          visitType: activeVisit.visitType?.uuid,
          stopDatetime: new Date(),
        };

        const visitResponse = await updateVisit(activeVisit.uuid, endVisitPayload);

        if (visitResponse.status === 200) {
          hasEndedVisit = true;
        }
      }

      const queueResponse = await getCurrentPatientQueueByPatientUuid(
        patientUuid,
        sessionLocationUuid,
      );

      const queues = queueResponse?.data?.results?.[0]?.patientQueues ?? [];
      const queueEntry = queues.find((item) => item?.patient?.uuid === patientUuid);

      if (queueEntry?.uuid) {
        await updateQueueEntry(
          QueueStatus.Completed,
          providerUuid,
          queueEntry.uuid,
          0,
          DEFAULT_PRIORITY_COMMENT,
          'visit-ended',
        );

        hasEndedQueue = true;
      }

      handleMutate(`${restBaseUrl}/patientqueue`);
      handleMutate(`${restBaseUrl}/queuestatistics`);

      if (!hasEndedVisit && !hasEndedQueue) {
        showSnackbar({
          title: t('noActionTaken', 'No action taken'),
          subtitle: t('noVisitOrQueueToEnd', 'No active visit or queue found to end.'),
          kind: 'info',
        });

        closeModal();
        return;
      }

      showSnackbar({
        title: hasEndedVisit
          ? t('visitEnded', 'Visit ended')
          : t('queueCompleted', 'Queue completed'),
        subtitle: t(
          hasEndedVisit && hasEndedQueue
            ? 'visitAndQueueEndedSuccessfully'
            : hasEndedVisit
              ? 'visitEndedSuccessfully'
              : 'queueEndedSuccessfully',
          hasEndedVisit && hasEndedQueue
            ? 'Visit and queue ended successfully.'
            : hasEndedVisit
              ? 'Visit ended successfully.'
              : 'Queue ended successfully.',
        ),
        kind: 'success',
      });

      closeModal();

      navigate({
        to: getPostEndVisitRoute(Boolean(queueEntry)),
      });
    } catch (error) {
      const errorMessages = extractErrorMessagesFromResponse(error);

      showNotification({
        title: t('endVisitError', 'Error ending visit'),
        kind: 'error',
        critical: true,
        description:
          errorMessages.length > 0
            ? errorMessages.join(', ')
            : t('unexpectedError', 'An unexpected error occurred'),
      });
    } finally {
      setIsEndingVisit(false);
    }
  }, [
    activeVisit,
    closeModal,
    patientUuid,
    providerUuid,
    sessionLocationUuid,
    t,
  ]);

  return (
    <Form className={styles.form}>
      <ModalHeader closeModal={closeModal} className={styles.modalHeader}>
        {t('endVisit', 'End visit')}?
      </ModalHeader>

      <ModalBody className={styles.modalBody}>
        {isFetchingProvider ? (
          <InlineLoading
            className={styles.inlineLoading}
            status="active"
            description={t('fetchingProvider', 'Fetching provider...')}
          />
        ) : null}

        <p className={styles.bodyText}>
          {t(
            'endVisitText',
            "Are you sure you want to end this visit? This action can't be undone.",
          )}
        </p>
      </ModalBody>

      <ModalFooter className={styles.modalFooter}>
        <Button
          size="lg"
          kind="secondary"
          onClick={closeModal}
          disabled={isEndingVisit}
          type="button"
        >
          {getCoreTranslation('cancel')}
        </Button>

        <Button
          autoFocus
          kind="danger"
          onClick={handleEndVisit}
          size="lg"
          disabled={!canSubmit}
          type="button"
        >
          {isEndingVisit ? (
            <InlineLoading description={t('endingVisit', 'Ending visit...')} />
          ) : (
            t('endAVisit', 'End a visit')
          )}
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default EndVisitConfirmation;