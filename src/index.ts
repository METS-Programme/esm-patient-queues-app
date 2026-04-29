import { defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardLink } from './hooks/createDashboardLink';
import { ClinicalRoomMeta, ReceptionMeta, TriageMeta } from './dashboard.meta';
import moveToNextServicePointActionComponent from './active-visits/action-buttons/move-to-next-service-point-patient-action.component';
import pickPatientEntryQueueComponent from './active-visits/active-visit-modals/pick-patient/pick-queue-patient-modal.component';
import queueScreenComponent from './components/queue-board/queue-board.component';
import rootComponent from './root.component';
import triageRoomComponent from './pages/queue-triage-home.component';
import receptionRoomComponent from './pages/queue-reception-home.component';
import clinicalRoomComponent from './pages/queue-clinical-home.component';
import startVisitFormComponent from './active-visits/visit-form/start-a-visit-form.workspace';
import startVisitFormButtonComponent from './active-visits/action-buttons/start-visit-form-button.component';
import checkedInTileComponent from './components/queue-tiles/checked-in-tile.component';
import queueCompletedTileComponent from './components/queue-tiles/queue-completed-tile.component';
import queueInQueueTileComponent from './components/queue-tiles/queue-in-queue-tile.component';
import queueWaitingTileComponent from './components/queue-tiles/queue-waiting-tile.component';
import moveToNextServicePointWorkspace from './active-visits/workspace/move-to-next-service-point.workspace';

// modal
import endVisitConfirmationModalComponent from './active-visits/active-visit-modals/end-visit/end-visit-modal.component';

import endVisitActionButtonComponent from './active-visits/action-buttons/end-visit-action-button.component';

import deathNotificationActionsButtonComponent from './active-visits/action-buttons/death-notification-actions-button.component';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: 'patient queues',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

// pages
export const root = getSyncLifecycle(rootComponent, options);

export const triageRoom = getSyncLifecycle(triageRoomComponent, options);

export const receptionRoom = getSyncLifecycle(receptionRoomComponent, options);

export const clinicalRoom = getSyncLifecycle(clinicalRoomComponent, options);

// extensions

// reception side nav item
export const queueReceptionDashboardLink = getSyncLifecycle(createDashboardLink(ReceptionMeta), options);

// triage side nav item
export const queueTriageDashboardLink = getSyncLifecycle(createDashboardLink(TriageMeta), options);

// clinical room side nav item
export const queueClinicalRoomDashboardLink = getSyncLifecycle(createDashboardLink(ClinicalRoomMeta), options);

export const moveToNextServicePointFormWorkspace = getSyncLifecycle(moveToNextServicePointWorkspace, options);

export const moveToNextServicePointPatientAction = getSyncLifecycle(moveToNextServicePointActionComponent, options);

export const pickPatientEntryQueue = getSyncLifecycle(pickPatientEntryQueueComponent, options);

export const queueScreen = getSyncLifecycle(queueScreenComponent, options);

export const startVisitFormWorkspace = getSyncLifecycle(startVisitFormComponent, options);

export const startVisitFormButton = getSyncLifecycle(startVisitFormButtonComponent, options);

export const deathNotificationActionsButton = getSyncLifecycle(deathNotificationActionsButtonComponent, options);

// summary tiles

export const checkInTile = getSyncLifecycle(checkedInTileComponent, options);

export const queueCompletedTile = getSyncLifecycle(queueCompletedTileComponent, options);

export const queueInQueueTile = getSyncLifecycle(queueInQueueTileComponent, options);

export const queueWaitingTile = getSyncLifecycle(queueWaitingTileComponent, options);

// end visit
export const endVisitModal = getSyncLifecycle(endVisitConfirmationModalComponent, options);

export const endVisitActionButton = getSyncLifecycle(endVisitActionButtonComponent, options);
