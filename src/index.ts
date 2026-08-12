import { defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';

import { configSchema } from './config-schema';
import { ClinicalRoomMeta, ReceptionMeta, TriageMeta } from './dashboard.meta';
import { createDashboardLink } from './hooks/createDashboardLink';
import { moduleName } from './constants';

import rootComponent from './root.component';

import clinicalRoomComponent from './pages/queue-clinical-home.component';
import receptionRoomComponent from './pages/queue-reception-home.component';
import triageRoomComponent from './pages/queue-triage-home.component';

import queueScreenComponent from './components/queue-board/queue-board.component';

import checkedInTileComponent from './components/queue-tiles/checked-in-tile.component';
import queueCompletedTileComponent from './components/queue-tiles/queue-completed-tile.component';
import queueInQueueTileComponent from './components/queue-tiles/queue-in-queue-tile.component';
import queueWaitingTileComponent from './components/queue-tiles/queue-waiting-tile.component';

import deathNotificationActionsButtonComponent from './active-visits/action-buttons/death-notification-actions-button.component';
import endVisitActionButtonComponent from './active-visits/action-buttons/end-visit-action-button.component';
import moveToNextServicePointActionComponent from './active-visits/action-buttons/move-to-next-service-point-patient-action.component';
import startVisitFormButtonComponent from './active-visits/action-buttons/start-visit-form-button.component';

import endVisitConfirmationModalComponent from './active-visits/active-visit-modals/end-visit/end-visit-modal.component';
import pickPatientEntryQueueComponent from './active-visits/active-visit-modals/pick-patient/pick-queue-patient-modal.component';

import startVisitFormComponent from './active-visits/visit-form/start-a-visit-form.workspace';
import moveToNextServicePointWorkspace from './active-visits/workspace/move-to-next-service-point.workspace';

const options = {
  featureName: 'patient queues',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

/**
 * Root app
 */
export const root = getSyncLifecycle(rootComponent, options);

/**
 * Pages
 */
export const receptionRoom = getSyncLifecycle(receptionRoomComponent, options);
export const triageRoom = getSyncLifecycle(triageRoomComponent, options);
export const clinicalRoom = getSyncLifecycle(clinicalRoomComponent, options);

/**
 * Dashboard side navigation links
 */
export const queueReceptionDashboardLink = getSyncLifecycle(createDashboardLink(ReceptionMeta), options);
export const queueTriageDashboardLink = getSyncLifecycle(createDashboardLink(TriageMeta), options);
export const queueClinicalRoomDashboardLink = getSyncLifecycle(createDashboardLink(ClinicalRoomMeta), options);

/**
 * Queue board / public screen
 */
export const queueScreen = getSyncLifecycle(queueScreenComponent, options);

/**
 * Summary tiles
 */
export const checkInTile = getSyncLifecycle(checkedInTileComponent, options);
export const queueCompletedTile = getSyncLifecycle(queueCompletedTileComponent, options);
export const queueInQueueTile = getSyncLifecycle(queueInQueueTileComponent, options);
export const queueWaitingTile = getSyncLifecycle(queueWaitingTileComponent, options);

/**
 * Patient action buttons
 */
export const startVisitFormButton = getSyncLifecycle(startVisitFormButtonComponent, options);
export const moveToNextServicePointPatientAction = getSyncLifecycle(moveToNextServicePointActionComponent, options);
export const endVisitActionButton = getSyncLifecycle(endVisitActionButtonComponent, options);
export const deathNotificationActionsButton = getSyncLifecycle(deathNotificationActionsButtonComponent, options);

/**
 * Workspaces
 */
export const startVisitFormWorkspace = getSyncLifecycle(startVisitFormComponent, options);
export const moveToNextServicePointFormWorkspace = getSyncLifecycle(moveToNextServicePointWorkspace, options);

/**
 * Modals
 */
export const pickPatientEntryQueue = getSyncLifecycle(pickPatientEntryQueueComponent, options);
export const endVisitModal = getSyncLifecycle(endVisitConfirmationModalComponent, options);
