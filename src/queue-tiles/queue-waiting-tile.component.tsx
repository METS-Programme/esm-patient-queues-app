import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from '@openmrs/esm-framework';

import SummaryTile, { type SummaryTileValue } from '../summary-tiles/summary-tile.component';
import { usePatientQueuePages } from '../active-visits/patient-queues.resource';
import { QueueEnumStatus } from '../utils/utils';

const QueueWaitingTile: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();

  const locationUuid = session?.sessionLocation?.uuid ?? '';

  const { items = [] } = usePatientQueuePages(locationUuid, '');

  const waitingPatientsCount = useMemo(() => {
    return items.filter((item) => item.status === QueueEnumStatus.PENDING).length;
  }, [items]);

  const values = useMemo<SummaryTileValue[]>(
    () => [
      {
        label: t('patientsWaiting', 'Patients Waiting'),
        value: locationUuid ? waitingPatientsCount : '—',
        status: !locationUuid
          ? [
              {
                label: t('noSessionLocation', 'No session location'),
                value: '',
                color: 'orange',
              },
            ]
          : undefined,
      },
    ],
    [locationUuid, t, waitingPatientsCount],
  );

  return <SummaryTile values={values} headerLabel={t('inQueue', 'In Queue')} />;
};

export default QueueWaitingTile;
