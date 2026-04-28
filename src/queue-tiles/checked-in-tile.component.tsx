import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { usePatientQueuePages } from '../active-visits/resources/patient-queues.resource';
import SummaryTile, { type SummaryTileValue } from '../summary-tiles/summary-tile.component';

const CheckedInTile: React.FC = () => {
  const { t } = useTranslation();

  const { totalCount = 0, isLoading, error } = usePatientQueuePages('', '');

  const values = useMemo<SummaryTileValue[]>(() => {
    if (isLoading) {
      return [
        {
          label: t('checkedInPatients', 'Checked In Patients'),
          value: t('loading', 'Loading...'),
        },
      ];
    }

    if (error) {
      return [
        {
          label: t('checkedInPatients', 'Checked In Patients'),
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
        label: t('checkedInPatients', 'Checked In Patients'),
        value: totalCount ?? 0,
      },
    ];
  }, [error, isLoading, t, totalCount]);

  return <SummaryTile values={values} headerLabel={t('pending', 'Pending')} />;
};

export default CheckedInTile;
