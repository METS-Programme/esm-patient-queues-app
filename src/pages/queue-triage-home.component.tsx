import React, { useMemo } from 'react';
import { Tabs, TabPanel, TabList, Tab, TabPanels, Tile } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useSession, userHasAccess } from '@openmrs/esm-framework';

import PatientQueueHeader from '../components/patient-queue-header/patient-queue-header.component';
import QueueSummaryTiles from '../components/summary-tiles/queue-summary-tiles.component';
import { QueueStatus } from '../utils/utils';

import styles from './queue-triage-home.scss';
import ActiveTriageVisitsTable from '../active-visits/active-visit-tables/queue-patients-triage/queue-triage-table.component';
import { APP_PATIENTQUEUE_TRIAGE_DASHBOARD } from '../constants';

const TriageHome: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();

  const canViewDashboard = useMemo(() => {
    return Boolean(session?.user && userHasAccess(APP_PATIENTQUEUE_TRIAGE_DASHBOARD, session.user));
  }, [session?.user]);

  return (
    <main className={styles.page}>
      <PatientQueueHeader title={t('triage', 'Triage')} />

      <section className={styles.summarySection} aria-label={t('triageSummary', 'Triage summary')}>
        <QueueSummaryTiles />
      </section>

      {canViewDashboard ? (
        <section className={styles.container} aria-label={t('triageDashboard', 'Triage dashboard')}>
          <Tabs>
            <TabList
              className={styles.tabList}
              aria-label={t('triageOutpatientTabs', 'Triage outpatient tabs')}
              contained
            >
              <Tab className={styles.tab}>{t('pending', 'In Queue')}</Tab>
              <Tab className={styles.tab}>{t('completed', 'Completed')}</Tab>
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
      ) : (
        <Tile className={styles.noAccessTile}>
          <h4 className={styles.noAccessTitle}>{t('accessRestricted', 'Access restricted')}</h4>
          <p className={styles.noAccessMessage}>
            {t('triageDashboardAccessRestricted', 'You do not have permission to view the triage dashboard.')}
          </p>
        </Tile>
      )}
    </main>
  );
};

export default TriageHome;
