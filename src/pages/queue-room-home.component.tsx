import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import { useSession, userHasAccess } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import PatientQueueTable from '../active-visits/queue-patients/queue-patients-table.component';
import PatientQueueHeader from '../components/patient-queue-header/patient-queue-header.component';
import QueueSummaryTiles from '../summary-tiles/queue-summary-tiles.component';
import { QueueStatus } from '../utils/utils';
import styles from '../active-visits/active-visits-table.scss';

interface QueueRoomHomeProps {
  title: string;
  roomType: 'triage' | 'clinical';
  privilege: string;
}

const QueueRoomHome: React.FC<QueueRoomHomeProps> = ({ title, roomType, privilege }) => {
  const { t } = useTranslation();
  const session = useSession();
  const canViewDashboard = Boolean(session?.user && userHasAccess(privilege, session.user));

  return (
    <div>
      <PatientQueueHeader title={title} />
      <QueueSummaryTiles />
      {canViewDashboard && (
        <div className={styles.container}>
          <Tabs>
            <TabList
              style={{ paddingLeft: '1rem' }}
              aria-label={t('queueRoomTabs', '{{room}} queue tabs', { room: title })}
              contained
            >
              <Tab style={{ width: '150px' }}>{t('pending', 'In Queue')}</Tab>
              <Tab style={{ width: '150px' }}>{t('completed', 'Completed')}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel style={{ padding: 0 }}>
                <PatientQueueTable roomType={roomType} status={QueueStatus.Pending} />
              </TabPanel>
              <TabPanel style={{ padding: 0 }}>
                <PatientQueueTable roomType={roomType} status={QueueStatus.Completed} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default QueueRoomHome;
