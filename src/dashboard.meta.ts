export const ReceptionMeta = {
  name: 'reception-patient-queues',
  slot: 'patient-queues-reception-room-dashboard-slot',
  title: 'Reception',
  privilegeConfigKey: 'receptionDashboardPrivilege',
} as const;

export const TriageMeta = {
  name: 'triage-patient-queues',
  slot: 'patient-queues-triage-room-dashboard-slot',
  title: 'Triage',
  privilegeConfigKey: 'triageDashboardPrivilege',
} as const;

export const ClinicalRoomMeta = {
  name: 'clinical-room-patient-queues',
  slot: 'patient-queues-clinical-room-dashboard-slot',
  title: 'Clinical Room',
  privilegeConfigKey: 'clinicianDashboardPrivilege',
} as const;
