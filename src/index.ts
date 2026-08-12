import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardLink } from './hooks/createDashboardLink';
import { ClinicalRoomMeta, ReceptionMeta, TriageMeta } from './dashboard.meta';
export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: 'patient queues',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

// pages
export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const triageRoom = getAsyncLifecycle(() => import('./pages/queue-triage-home.component'), options);

export const receptionRoom = getAsyncLifecycle(() => import('./pages/queue-reception-home.component'), options);

export const clinicalRoom = getAsyncLifecycle(() => import('./pages/queue-clinical-room-home.component'), options);

export const homeDashboard = getAsyncLifecycle(() => import('./pages/home.component'), options);

// extensions

// reception side nav item
export const queueReceptionDashboardLink = getSyncLifecycle(createDashboardLink(ReceptionMeta), options);

// triage side nav item
export const queueTriageDashboardLink = getSyncLifecycle(createDashboardLink(TriageMeta), options);

// clinical room side nav item
export const queueClinicalRoomDashboardLink = getSyncLifecycle(createDashboardLink(ClinicalRoomMeta), options);

export const moveToNextServicePointFormWorkspace = getAsyncLifecycle(
  () => import('./active-visits/move-to-next-service-point.workspace'),
  options,
);

export const moveToNextServicePointPatientAction = getAsyncLifecycle(
  () => import('./active-visits/move-to-next-service-point-patient-action.component'),
  options,
);

export const pickPatientEntryQueue = getAsyncLifecycle(
  () => import('./active-visits/pick-patient-dialog.component'),
  options,
);

export const queueScreen = getAsyncLifecycle(() => import('./components/queue-board/queue-board.component'), options);

export const startVisitFormWorkspace = getAsyncLifecycle(
  () => import('./components/visit-form/start-a-visit-form.workspace'),
  options,
);

export const startVisitFormButton = getAsyncLifecycle(
  () => import('./active-visits/start-visit-form-button.component'),
  options,
);

export const deathNotificationActionsButton = getAsyncLifecycle(
  () => import('./components/actions/death/death-notification-actions-button.component'),
  options,
);

export const notesModal = getAsyncLifecycle(() => import('./active-visits/notes/notes-dialog.component'), options);

// summary tiles

export const checkInTile = getAsyncLifecycle(() => import('./queue-tiles/checked-in-tile.component'), options);

export const queueCompletedTile = getAsyncLifecycle(
  () => import('./queue-tiles/queue-completed-tile.component'),
  options,
);

export const queueInQueueTile = getAsyncLifecycle(() => import('./queue-tiles/queue-in-queue-tile.component'), options);

export const queueWaitingTile = getAsyncLifecycle(() => import('./queue-tiles/queue-waiting-tile.component'), options);

// end visit
export const endVisitModal = getAsyncLifecycle(
  () => import('./active-visits/end-visit/end-visit-modal.component'),
  options,
);

export const endVisitActionButton = getAsyncLifecycle(
  () => import('./active-visits/end-visit/end-visit-action-button.component'),
  options,
);
