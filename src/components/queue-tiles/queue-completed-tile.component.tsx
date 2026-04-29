import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from '@openmrs/esm-framework';

import SummaryTile, { type SummaryTileValue } from '../summary-tiles/summary-tile.component';
import { usePatientQueuePages } from '../../active-visits/resources/patient-queues.resource';
import { QueueEnumStatus } from '../../utils/utils';

const QueueCompletedTile: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();

  const locationUuid = session?.sessionLocation?.uuid ?? '';

  const { items = [], isLoading, error } = usePatientQueuePages(locationUuid, '');

  const completedPatientsCount = useMemo(() => {
    return items.filter((item) => item.status === QueueEnumStatus.COMPLETED).length;
  }, [items]);

  const values = useMemo<SummaryTileValue[]>(() => {
    if (!locationUuid) {
      return [
        {
          label: t('noOfPatientsServed', 'No. of Patients Served'),
          value: '—',
          status: [
            {
              label: t('noSessionLocation', 'No session location'),
              value: '',
              color: 'orange',
            },
          ],
        },
      ];
    }

    if (isLoading) {
      return [
        {
          label: t('noOfPatientsServed', 'No. of Patients Served'),
          value: t('loading', 'Loading...'),
        },
      ];
    }

    if (error) {
      return [
        {
          label: t('noOfPatientsServed', 'No. of Patients Served'),
          value: '—',
          status: [
            {
              label: t('failedToLoad', 'Failed to load'),
              value: '',
              color: 'red',
            },
          ],
        },
      ];
    }

    return [
      {
        label: t('noOfPatientsServed', 'No. of Patients Served'),
        value: completedPatientsCount ?? 0,
      },
    ];
  }, [completedPatientsCount, error, isLoading, locationUuid, t]);

  return <SummaryTile values={values} headerLabel={t('finished', 'Finished')} />;
};

export default QueueCompletedTile;
