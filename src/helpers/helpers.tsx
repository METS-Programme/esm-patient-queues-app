import { getGlobalStore } from '@openmrs/esm-framework';
import { type PatientQueue } from '../types/patient-queues';

// Patient Queue stores
export function getPatientQueueWaitingList() {
  return getGlobalStore<{ queue: PatientQueue[] }>('patientQueueWaitingList', { queue: [] });
}
export const updatePatientQueueWaitingList = (queue: PatientQueue[]) => {
  const store = getPatientQueueWaitingList();
  store.setState({ queue });
};
