import React from 'react';
import SummaryTile from '../summary-tiles/summary-tile.component';
import { useTranslation } from 'react-i18next';
import { usePatientQueueCount } from '../active-visits/patient-queues.resource';

const CheckedInTile: React.FC = () => {
  const { t } = useTranslation();

  const { count } = usePatientQueueCount({});

  return (
    <SummaryTile
      values={[{ label: t('checkedInPatients', 'Checked In Patients'), value: count }]}
      headerLabel={t('pending', 'Pending')}
    />
  );
};

export default CheckedInTile;
