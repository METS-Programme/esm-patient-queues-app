import React, { useMemo } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useSession, userHasAccess } from '@openmrs/esm-framework';

import ActiveTriageVisitsTable from '../active-visits/active-visit-tables/queue-patients-triage/queue-triage-table.component';
import PatientQueueHeader from '../components/patient-queue-header/patient-queue-header.component';
import QueueSummaryTiles from '../components/summary-tiles/queue-summary-tiles.component';
import { APP_PATIENTQUEUE_TRIAGE_DASHBOARD } from '../constants';
import { QueueStatus } from '../utils/utils';

import styles from './queue-triage-home.scss';

const TriageHome: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();

  const canViewDashboard = useMemo(() => {
    const user = session?.user;

    if (!user) {
      return false;
    }

    return userHasAccess(APP_PATIENTQUEUE_TRIAGE_DASHBOARD, user);
  }, [session?.user]);

  if (!canViewDashboard) {
    return (
      <main className={styles.page}>
        <PatientQueueHeader title={t('triage', 'Triage')} />

        <Tile className={styles.noAccessTile}>
          <h4 className={styles.noAccessTitle}>{t('accessRestricted', 'Access restricted')}</h4>
          <p className={styles.noAccessMessage}>
            {t('triageDashboardAccessRestricted', 'You do not have permission to view the triage dashboard.')}
          </p>
        </Tile>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <PatientQueueHeader title={t('triage', 'Triage')} />

      <section className={styles.summarySection} aria-label={t('triageSummary', 'Triage summary')}>
        <QueueSummaryTiles />
      </section>

      <section className={styles.container} aria-label={t('triageDashboard', 'Triage dashboard')}>
        <Tabs>
          <TabList className={styles.tabList} aria-label={t('triageQueueTabs', 'Triage queue tabs')} contained>
            <Tab className={styles.tab}>{t('patientsInQueue', 'Patients in queue')}</Tab>
            <Tab className={styles.tab}>{t('completedTriage', 'Completed triage')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel className={styles.tabPanel}>
              <ActiveTriageVisitsTable status={QueueStatus.Pending} />
            </TabPanel>

            <TabPanel className={styles.tabPanel}>
              <ActiveTriageVisitsTable status={QueueStatus.Completed} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>
    </main>
  );
};

export default TriageHome;
