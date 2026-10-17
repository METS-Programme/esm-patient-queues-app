import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@carbon/react';
import styles from './queue-triage-home.scss';
import { useConfig } from '@openmrs/esm-framework';
import ActiveTriageVisitsTable from '../active-visits/queue-patients-triage/queue-triage-table.component';
import PatientQueueHeader from '../components/patient-queue-header/patient-queue-header.component';
import PrivilegeGate from '../components/privilege-gate/privilege-gate.component';
import QueueSummaryTiles from '../summary-tiles/queue-summary-tiles.component';
import { type PatientQueueConfig } from '../config-schema';
import { QueueStatus } from '../utils/utils';

const TriageHome: React.FC = () => {
  const { t } = useTranslation();
  const config = useConfig<PatientQueueConfig>();

  return (
    <PrivilegeGate privilege={config.triageDashboardPrivilege}>
      <div>
        <PatientQueueHeader title="Triage" />
        <QueueSummaryTiles />

        {/* table data */}

        <div className={styles.container}>
          <Tabs>
            <TabList style={{ paddingLeft: '1rem' }} aria-label="triage outpatient tabs" contained>
              <Tab style={{ width: '150px' }}>{t('pending', 'In Queue')}</Tab>
              <Tab style={{ width: '150px' }}>{t('completed', 'Completed')}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel style={{ padding: 0 }}>
                <ActiveTriageVisitsTable status={QueueStatus.Pending} />
              </TabPanel>
              <TabPanel style={{ padding: 0 }}>
                <ActiveTriageVisitsTable status={QueueStatus.Completed} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </PrivilegeGate>
  );
};

export default TriageHome;
