import React from 'react';
import { APP_PATIENTQUEUE_CLINICIAN_DASHBOARD } from '../config/privileges';
import QueueRoomHome from './queue-room-home.component';

const ClinicalRoomHome: React.FC = () => (
  <QueueRoomHome
    title="Clinical Room"
    roomType="clinical"
    privilege={APP_PATIENTQUEUE_CLINICIAN_DASHBOARD}
  />
);

export default ClinicalRoomHome;
