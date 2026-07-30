import React from 'react';
import { APP_PATIENTQUEUE_TRIAGE_DASHBOARD } from '../config/privileges';
import QueueRoomHome from './queue-room-home.component';

const TriageHome: React.FC = () => (
  <QueueRoomHome title="Triage" roomType="triage" privilege={APP_PATIENTQUEUE_TRIAGE_DASHBOARD} />
);

export default TriageHome;
