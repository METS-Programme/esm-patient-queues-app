import React, { useMemo } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useSession, userHasAccess } from '@openmrs/esm-framework';

import ActiveClinicalVisitsTable from '../active-visits/active-visit-tables/queue-patients-clinical/queue-clinical-table.component';
import PatientQueueHeader from '../components/patient-queue-header/patient-queue-header.component';
import QueueSummaryTiles from '../components/summary-tiles/queue-summary-tiles.component';
import { APP_PATIENTQUEUE_CLINICIAN_DASHBOARD } from '../constants';
import { QueueStatus } from '../utils/utils';

import styles from './queue-clinical-home.scss';

const ClinicalRoomHome: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();

  const canViewDashboard = useMemo(() => {
    const user = session?.user;

    if (!user) {
      return false;
    }

    return userHasAccess(APP_PATIENTQUEUE_CLINICIAN_DASHBOARD, user);
  }, [session?.user]);

  if (!canViewDashboard) {
    return (
      <main className={styles.page}>
        <PatientQueueHeader title={t('clinicalRoom', 'Clinical Room')} />

        <Tile className={styles.noAccessTile}>
          <h4 className={styles.noAccessTitle}>{t('accessRestricted', 'Access restricted')}</h4>
          <p className={styles.noAccessMessage}>
            {t('clinicalDashboardAccessRestricted', 'You do not have permission to view the clinical dashboard.')}
          </p>
        </Tile>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <PatientQueueHeader title={t('clinicalRoom', 'Clinical Room')} />

      <section className={styles.summarySection} aria-label={t('clinicalSummary', 'Clinical summary')}>
        <QueueSummaryTiles />
      </section>

      <section className={styles.container} aria-label={t('clinicalDashboard', 'Clinical dashboard')}>
        <Tabs>
          <TabList className={styles.tabList} aria-label={t('clinicalQueueTabs', 'Clinical queue tabs')} contained>
            <Tab className={styles.tab}>{t('patientsInQueue', 'Patients in queue')}</Tab>
            <Tab className={styles.tab}>{t('completedClinicalVisits', 'Completed clinical visits')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel className={styles.tabPanel}>
              <ActiveClinicalVisitsTable status={QueueStatus.Pending} />
            </TabPanel>

            <TabPanel className={styles.tabPanel}>
              <ActiveClinicalVisitsTable status={QueueStatus.Completed} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>
    </main>
  );
};

export default ClinicalRoomHome;
