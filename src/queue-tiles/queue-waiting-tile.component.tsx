import React from 'react';
import { useTranslation } from 'react-i18next';
import SummaryTile from '../summary-tiles/summary-tile.component';
import { useSession } from '@openmrs/esm-framework';
import { usePatientQueueCount } from '../active-visits/patient-queues.resource';
import { QueueStatus } from '../utils/utils';
const QueueWaitingTile: React.FC = () => {
  const { t } = useTranslation();

  const session = useSession();

  const { count } = usePatientQueueCount({
    room: session?.sessionLocation?.uuid,
    status: QueueStatus.Pending,
  });

  return (
    <SummaryTile
      values={[
        { label: t('patientsWaiting', 'Patients Waiting'), value: count },
      ]}
      headerLabel={t('inQueue', 'In Queue')}
    />
  );
};

export default QueueWaitingTile;
