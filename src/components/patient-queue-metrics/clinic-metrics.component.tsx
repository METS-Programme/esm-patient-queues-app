import React, { useMemo } from 'react';
import { UserHasAccess, useSession } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { PRIVILEGE_RECEPTION_METRIC, PRIVILIGE_TRIAGE_METRIC } from '../../constants';
import { useParentLocation } from '../../active-visits/resources/patient-queues.resource';
import SummaryTile, { type SummaryTileValue } from '../../summary-tiles/summary-tile.component';
import { useServicePointCount } from './clinic-metrics.resource';

import styles from './clinic-metrics.scss';

type PatientServicePointStat = {
  locationTag?: {
    display?: string;
  };
  pending?: number;
  serving?: number;
  completed?: number;
};

const DEFAULT_METRIC_VALUE = 0;

const ClinicMetrics: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();

  const sessionLocationUuid = session?.sessionLocation?.uuid ?? '';
  const { location } = useParentLocation(sessionLocationUuid);

  const parentLocationUuid = location?.parentLocation?.uuid ?? sessionLocationUuid;

  const today = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  const { stats = [] } = useServicePointCount(parentLocationUuid, today, today);

  const receptionMetrics = useMemo<SummaryTileValue[]>(
    () => [
      {
        label: t('patients', 'Patients'),
        value: DEFAULT_METRIC_VALUE,
      },
    ],
    [t],
  );

  const expectedAppointmentsMetrics = useMemo<SummaryTileValue[]>(
    () => [
      {
        label: t('expectedAppointments', 'Expected Appointments'),
        value: DEFAULT_METRIC_VALUE,
      },
    ],
    [t],
  );

  const triageInQueueMetrics = useMemo<SummaryTileValue[]>(
    () => [
      {
        label: t('inQueue', 'In Queue'),
        value: DEFAULT_METRIC_VALUE,
      },
    ],
    [t],
  );

  const triageWaitingMetrics = useMemo<SummaryTileValue[]>(
    () => [
      {
        label: t('byTriage', 'By you'),
        value: DEFAULT_METRIC_VALUE,
      },
    ],
    [t],
  );

  const triageServedMetrics = useMemo<SummaryTileValue[]>(
    () => [
      {
        label: t('patientsServed', 'Patients Served'),
        value: DEFAULT_METRIC_VALUE,
      },
    ],
    [t],
  );

  return (
    <section className={styles.cardContainer} aria-label={t('clinicMetrics', 'Clinic metrics')}>
      <UserHasAccess privilege={PRIVILEGE_RECEPTION_METRIC}>
        <SummaryTile values={receptionMetrics} headerLabel={t('checkedInPatients', 'Checked in patients')} />

        <SummaryTile
          values={expectedAppointmentsMetrics}
          headerLabel={t('noOfExpectedAppointments', 'No. of Expected Appointments')}
        />

        <SummaryTile values={stats} headerLabel={t('currentlyServing', 'No. of Currently being Served')} />
      </UserHasAccess>

      <UserHasAccess privilege={PRIVILIGE_TRIAGE_METRIC}>
        <SummaryTile values={triageInQueueMetrics} headerLabel={t('inQueueTriage', 'Patients Waiting')} />

        <SummaryTile
          values={triageWaitingMetrics}
          headerLabel={t('pendingTriageServing', 'Patients waiting to be Served')}
        />

        <SummaryTile values={triageServedMetrics} headerLabel={t('noOfPatientsServed', 'No. of Patients Served')} />
      </UserHasAccess>
    </section>
  );
};

export function getMetrics(locationTag: string, patientStats?: PatientServicePointStat[]): SummaryTileValue {
  const stats = patientStats?.find((item) => item.locationTag?.display === locationTag);

  const pending = stats?.pending ?? 0;
  const serving = stats?.serving ?? 0;
  const completed = stats?.completed ?? 0;

  return {
    label: locationTag,
    value: pending + serving + completed,
    status: [
      {
        label: 'Pending',
        value: pending,
        color: 'orange',
      },
      {
        label: 'Serving',
        value: serving,
        color: 'blue',
      },
      {
        label: 'Completed',
        value: completed,
        color: 'green',
      },
    ],
  };
}

export default ClinicMetrics;
