import React, { useMemo } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useSession, userHasAccess } from '@openmrs/esm-framework';

import PatientQueueHeader from '../components/patient-queue-header/patient-queue-header.component';
import QueueSummaryTiles from '../summary-tiles/queue-summary-tiles.component';
import ActiveClinicalVisitsTable from '../active-visits/queue-patients-clinical/queue-clinical-table.component';
import { APP_PATIENTQUEUE_CLINICIAN_DASHBOARD } from '../config/privileges';
import { QueueStatus } from '../utils/utils';

import styles from './queue-clinical-home.scss';

const ClinicalRoomHome: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();

  const canViewDashboard = useMemo(() => {
    return Boolean(session?.user && userHasAccess(APP_PATIENTQUEUE_CLINICIAN_DASHBOARD, session.user));
  }, [session?.user]);

  return (
    <main className={styles.page}>
      <PatientQueueHeader title={t('clinicalRoom', 'Clinical Room')} />

      <QueueSummaryTiles />

      {canViewDashboard ? (
        <section className={styles.container} aria-label={t('clinicalDashboard', 'Clinical dashboard')}>
          <Tabs>
            <TabList
              className={styles.tabList}
              aria-label={t('clinicalOutpatientTabs', 'Clinical outpatient tabs')}
              contained
            >
              <Tab className={styles.tab}>{t('pending', 'In Queue')}</Tab>
              <Tab className={styles.tab}>{t('completed', 'Completed')}</Tab>
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
      ) : (
        <Tile className={styles.noAccessTile}>
          <h4 className={styles.noAccessTitle}>{t('accessRestricted', 'Access restricted')}</h4>
          <p className={styles.noAccessMessage}>
            {t('clinicalDashboardAccessRestricted', 'You do not have permission to view the clinical dashboard.')}
          </p>
        </Tile>
      )}
    </main>
  );
};

export default ClinicalRoomHome;
