import React, { useCallback, useMemo } from 'react';
import { Button, Tooltip } from '@carbon/react';
import { Notification } from '@carbon/react/icons';
import { showModal, showSnackbar, useSession } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

import { updateSelectedPatientQueueUuid } from '../../helpers/helpers';
import { type PatientQueue } from '../../types/patient-queues';
import { QueueEnumStatus, QueueStatus } from '../../utils/utils';
import { usePatientQueuePages } from '../resources/patient-queues.resource';

interface PickQueuePatientActionButtonProps {
  queueEntry?: PatientQueue;
  closeModal?: () => void;
  disabled?: boolean;
}

const PickQueuePatientActionButton: React.FC<PickQueuePatientActionButtonProps> = ({
  queueEntry,
  closeModal,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const session = useSession();

  const sessionLocationUuid = session?.sessionLocation?.uuid ?? '';
  const providerIdentifier = session?.user?.systemId ?? '';

  const { items: pickedQueueItems = [] } = usePatientQueuePages(sessionLocationUuid, QueueStatus.Picked);

  const hasPickedPatient = useMemo(() => {
    if (!providerIdentifier) {
      return false;
    }

    return pickedQueueItems.some(
      (item) => item?.provider?.identifier === providerIdentifier && item?.status === QueueEnumStatus.PICKED,
    );
  }, [pickedQueueItems, providerIdentifier]);

  const launchPickPatientQueueModal = useCallback(() => {
    if (disabled) {
      return;
    }

    if (!queueEntry?.uuid) {
      showSnackbar({
        title: t('missingQueueEntry', 'Missing queue entry'),
        subtitle: t('missingQueueEntryDescription', 'Unable to pick this patient because the queue entry is missing.'),
        kind: 'error',
        autoClose: true,
      });
      return;
    }

    if (hasPickedPatient) {
      showSnackbar({
        title: t('alreadyPickedPatient', 'You have already picked a patient'),
        subtitle: t('completeCurrentPatient', 'Please complete the current one before picking another.'),
        kind: 'error',
        autoClose: true,
      });
      return;
    }

    if (queueEntry.status !== QueueEnumStatus.PENDING) {
      showSnackbar({
        title: t('invalidStatus', 'Patient cannot be picked'),
        subtitle: t('onlyPendingAllowed', 'Only patients in pending status can be picked.'),
        kind: 'error',
        autoClose: true,
      });
      return;
    }

    updateSelectedPatientQueueUuid(queueEntry.uuid);

    const dispose = showModal('pick-patient-queue-entry', {
      queueEntry,
      closeModal: () => {
        dispose();
        closeModal?.();
      },
    });
  }, [closeModal, disabled, hasPickedPatient, queueEntry, t]);

  const isDisabled = disabled || !queueEntry?.uuid || queueEntry?.status !== QueueEnumStatus.PENDING;

  return (
    <Tooltip align="bottom" label={t('pickPatient', 'Pick patient')}>
      <Button
        kind="ghost"
        size="sm"
        hasIconOnly
        disabled={isDisabled}
        onClick={launchPickPatientQueueModal}
        iconDescription={t('pickPatient', 'Pick patient')}
        renderIcon={Notification}
      />
    </Tooltip>
  );
};

export default PickQueuePatientActionButton;
