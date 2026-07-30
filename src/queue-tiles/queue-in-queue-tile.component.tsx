import React from 'react';
import { useTranslation } from 'react-i18next';
import SummaryTile from '../summary-tiles/summary-tile.component';
import { useSession } from '@openmrs/esm-framework';
import { usePatientQueueCount } from '../active-visits/patient-queues.resource';
import { QueueStatus } from '../utils/utils';
const QueueInQueueTile: React.FC = () => {
  const { t } = useTranslation();

  const session = useSession();

  const { count: pendingCount } = usePatientQueueCount({
    room: session?.sessionLocation?.uuid,
    status: QueueStatus.Pending,
  });
  const { count: pickedCount } = usePatientQueueCount({
    room: session?.sessionLocation?.uuid,
    status: QueueStatus.Picked,
  });

  return (
    <SummaryTile
      values={[
        {
          label: t('patientsWaitingToBeServed', 'Patients waiting to be Served'),
          value: pendingCount + pickedCount,
        },
      ]}
      headerLabel={t('byYou', 'By You')}
    />
  );
};

export default QueueInQueueTile;
