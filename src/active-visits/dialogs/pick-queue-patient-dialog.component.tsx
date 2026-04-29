import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, InlineLoading, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import {
  formatDate,
  navigate,
  parseDate,
  restBaseUrl,
  showNotification,
  showSnackbar,
  useSession,
} from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

import { trimVisitNumber } from '../../helpers/functions';
import { extractErrorMessagesFromResponse, handleMutate } from '../../utils/utils';
import { type PatientQueue } from '../../types/patient-queues';
import { getCareProvider, updateQueueEntry } from '../resources/patient-queues.resource';

import styles from './pick-queue-patient-dialog.scss';

interface PickQueuePatientDialogProps {
  queueEntry?: PatientQueue;
  closeModal: () => void;
}

const QUEUE_STATUS_PICKED = 'Picked';

function getOpenmrsPatientChartUrl(patientUuid?: string) {
  if (!patientUuid) {
    return '#';
  }

  const spaBase = window.getOpenmrsSpaBase?.() ?? '/openmrs/spa';

  return `${spaBase}/patient/${patientUuid}/chart`;
}

const PickQueuePatientDialog: React.FC<PickQueuePatientDialogProps> = ({ queueEntry, closeModal }) => {
  const { t } = useTranslation();
  const session = useSession();

  const [isLoadingProvider, setIsLoadingProvider] = useState(false);
  const [providerUuid, setProviderUuid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionUserUuid = session?.user?.uuid;

  const hasQueueEntry = Boolean(queueEntry?.uuid);

  const patientName = queueEntry?.patient?.person?.display ?? t('unknownPatient', 'Unknown patient');

  const visitNumber = useMemo(() => {
    return trimVisitNumber(queueEntry?.visitNumber ?? '') || '—';
  }, [queueEntry?.visitNumber]);

  const createdDate = useMemo(() => {
    if (!queueEntry?.dateCreated) {
      return '—';
    }

    return formatDate(parseDate(queueEntry.dateCreated), {
      time: true,
    });
  }, [queueEntry?.dateCreated]);

  const fetchProvider = useCallback(async () => {
    if (!sessionUserUuid) {
      return;
    }

    setIsLoadingProvider(true);

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
      setIsLoadingProvider(false);
    }
  }, [sessionUserUuid, t]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  const pickPatientQueueStatus = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!queueEntry?.uuid) {
        showNotification({
          title: t('patientNotInQueue', 'The patient is not in the queue'),
          kind: 'error',
          description: t('patientNotInQueueDescription', 'This patient does not have an active queue entry.'),
          millis: 3000,
        });
        return;
      }

      if (!providerUuid) {
        showNotification({
          title: t('missingProvider', 'Missing provider'),
          kind: 'error',
          description: t(
            'missingProviderDescription',
            'Unable to pick this patient because no provider was found for the current user.',
          ),
          millis: 3000,
        });
        return;
      }

      setIsSubmitting(true);

      try {
        await updateQueueEntry(QUEUE_STATUS_PICKED, providerUuid, queueEntry.uuid, 0, '', '');

        showSnackbar({
          title: t('updateEntry', 'Update entry'),
          kind: 'success',
          subtitle: t('queueEntryUpdateSuccessfully', 'Queue entry updated successfully.'),
          autoClose: true,
        });

        handleMutate(`${restBaseUrl}/patientqueue`);

        closeModal();

        navigate({
          to: getOpenmrsPatientChartUrl(queueEntry.patient?.uuid),
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : t('unexpectedError', 'An unexpected error occurred');

        showNotification({
          title: t('queueEntryUpdateFailed', 'Error updating queue entry status'),
          kind: 'error',
          critical: true,
          description: errorMessage,
          millis: 3000,
        });

        handleMutate(`${restBaseUrl}/patientqueue`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [closeModal, providerUuid, queueEntry, t],
  );

  if (!hasQueueEntry) {
    return (
      <>
        <ModalHeader closeModal={closeModal} title={t('patientNotInQueue', 'The patient is not in the queue')} />

        <ModalBody>
          <p className={styles.emptyMessage}>
            {t('patientNotInQueueDescription', 'This patient does not have an active queue entry.')}
          </p>
        </ModalBody>

        <ModalFooter>
          <Button kind="primary" onClick={closeModal}>
            {t('close', 'Close')}
          </Button>
        </ModalFooter>
      </>
    );
  }

  return (
    <Form className={styles.form} onSubmit={pickPatientQueueStatus}>
      <ModalHeader closeModal={closeModal} title={t('pickPatient', 'Pick Patient')} />

      <ModalBody className={styles.modalBody}>
        {isLoadingProvider ? (
          <InlineLoading
            className={styles.inlineLoading}
            description={`${t('fetchingProvider', 'Fetching provider')}...`}
          />
        ) : null}

        <div className={styles.patientSummary}>
          <h4 className={styles.patientName}>{patientName}</h4>

          <dl className={styles.detailsList}>
            <div className={styles.detailItem}>
              <dt>{t('visitNumber', 'Visit number')}</dt>
              <dd>{visitNumber}</dd>
            </div>

            <div className={styles.detailItem}>
              <dt>{t('dateCreated', 'Date created')}</dt>
              <dd>{createdDate}</dd>
            </div>
          </dl>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button kind="secondary" onClick={closeModal} disabled={isSubmitting} type="button">
          {t('cancel', 'Cancel')}
        </Button>

        <Button disabled={isLoadingProvider || isSubmitting || !providerUuid} type="submit">
          {isSubmitting ? (
            <InlineLoading description={`${t('submitting', 'Submitting')}...`} />
          ) : (
            t('pickPatient', 'Pick Patient')
          )}
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default PickQueuePatientDialog;
