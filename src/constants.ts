import dayjs from 'dayjs';

export const moduleName = '@ugandaemr/esm-patient-queues-app';

export const basePath = '/outpatient';
export const omrsDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

export const spaBasePath = `${window.spaBase}/home`;

export const getOpenmrsSpaBase = (): string => {
  return window.getOpenmrsSpaBase?.() ?? '/openmrs/spa/';
};

export const getSpaHomePath = (): string => {
  return `${getOpenmrsSpaBase()}home`;
};

export const startOfDay = (): string => {
  return dayjs(new Date().setUTCHours(0, 0, 0, 0)).format(omrsDateFormat);
};

export const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Privileges
 */
export const PRIVILEGE_CHECKIN = 'App: ugandaemrpoc.findPatient';

export const PRIVILEGE_RECEPTION_METRIC = 'View Reception Metrics';
export const PRIVILEGE_TRIAGE_METRIC = 'View Triage Metrics';
export const PRIVILIGE_TRIAGE_METRIC = PRIVILEGE_TRIAGE_METRIC; // Backward-compatible alias.

export const PRIVILEGE_CLINICIAN_METRIC = 'View Clinician Metrics';

export const PRIVILEGE_RECEPTION_QUEUE_LIST = 'View Reception Queuelist';
export const PRIVILEGE_TRIAGE_QUEUE_LIST = 'View Triage Queuelist';
export const PRIVILEGE_CLINICIAN_QUEUE_LIST = 'View Clinician Queuelist';

export const PRIVILEGE_ENABLE_EDIT_DEMOGRAPHICS = 'Edit Patient Demographics';

export const MANAGE_GLOBAL_PROPERTIES = 'Manage Global Properties';

export const APP_PATIENTQUEUE_TRIAGE_DASHBOARD = 'App: patientQueue.triage.dashboard';
export const APP_PATIENTQUEUE_CLINICIAN_DASHBOARD = 'App: patientQueue.clinician.dashboard';
