import { Button } from '@carbon/react';
import { Notification } from '@carbon/react/icons';
import { showModal, showSnackbar } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type PatientQueue } from '../types/patient-queues';
import { QueueEnumStatus } from '../utils/utils';

interface PickPatientActionMenuProps {
  queueEntry: PatientQueue;
  closeModal: () => void;
  hasPickedPatient: boolean;
}

const PickQueuePatientActionButton: React.FC<PickPatientActionMenuProps> = ({
  queueEntry,
  closeModal,
  hasPickedPatient,
}) => {
  const { t } = useTranslation();

  const launchPickPatientQueueModal = useCallback(() => {
    if (hasPickedPatient) {
      showSnackbar({
        title: t('alreadyPickedPatient', 'You have already picked a patient'),
        subtitle: t('completeCurrentPatient', 'Please complete the current one before picking another'),
        kind: 'error',
        autoClose: true,
      });
      return;
    }

    if (queueEntry.status !== QueueEnumStatus.PENDING) {
      showSnackbar({
        title: t('invalidStatus', 'Patient cannot be picked'),
        subtitle: t('onlyPendingAllowed', 'Only patients in PENDING status can be picked'),
        kind: 'error',
        autoClose: true,
      });
      return;
    }

    const dispose = showModal('pick-patient-queue-entry', {
      queueEntry,
      closeModal: () => {
        dispose();
        closeModal?.();
      },
    });
  }, [hasPickedPatient, queueEntry, t, closeModal]);

  return (
    <Button
      kind="ghost"
      onClick={launchPickPatientQueueModal}
      iconDescription={t('pickPatient', 'Pick Patient')}
      renderIcon={(props) => <Notification size={16} {...props} />}
    />
  );
};

export default PickQueuePatientActionButton;
