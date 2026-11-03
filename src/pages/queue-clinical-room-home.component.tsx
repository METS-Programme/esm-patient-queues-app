import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from '../active-visits/active-visits-table.scss';
import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@carbon/react';
import { useConfig } from '@openmrs/esm-framework';
import PatientQueueHeader from '../components/patient-queue-header/patient-queue-header.component';
import PrivilegeGate from '../components/privilege-gate/privilege-gate.component';
import QueueSummaryTiles from '../summary-tiles/queue-summary-tiles.component';
import ActiveClinicalVisitsTable from '../active-visits/queue-patients-clinical/queue-clinical-table.component';
import { type PatientQueueConfig } from '../config-schema';
import { QueueStatus } from '../utils/utils';

const ClinicalRoomHome: React.FC = () => {
  const { t } = useTranslation();
  const config = useConfig<PatientQueueConfig>();

  return (
    <PrivilegeGate privilege={config.clinicianDashboardPrivilege}>
      <div>
        <PatientQueueHeader title="Clinical Room" showResultsReady />
        <QueueSummaryTiles />

        {/* table data */}

        <div className={styles.container}>
          <Tabs>
            <TabList style={{ paddingLeft: '1rem' }} aria-label="clinical outpatient tabs" contained>
              <Tab style={{ width: '150px' }}>{t('pending', 'In Queue')}</Tab>
              <Tab style={{ width: '150px' }}>{t('completed', 'Completed')}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel style={{ padding: 0 }}>
                <ActiveClinicalVisitsTable status={QueueStatus.Pending} />
              </TabPanel>
              <TabPanel style={{ padding: 0 }}>
                <ActiveClinicalVisitsTable status={QueueStatus.Completed} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </PrivilegeGate>
  );
};

export default ClinicalRoomHome;
