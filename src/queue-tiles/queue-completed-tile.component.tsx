import React from 'react';
import { useTranslation } from 'react-i18next';
import SummaryTile from '../summary-tiles/summary-tile.component';
import { usePatientQueueCount } from '../active-visits/patient-queues.resource';
import { useSession } from '@openmrs/esm-framework';
import { QueueStatus } from '../utils/utils';

const QueueCompletedTile: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();

  const { count } = usePatientQueueCount({
    room: session?.sessionLocation?.uuid,
    status: QueueStatus.Completed,
  });
  return (
    <SummaryTile
      values={[
        {
          label: t('noOfPatientsServed', 'No. of Patients Served'),
          value: count,
        },
      ]}
      headerLabel={t('finished', 'Finished')}
    />
  );
};

export default QueueCompletedTile;
