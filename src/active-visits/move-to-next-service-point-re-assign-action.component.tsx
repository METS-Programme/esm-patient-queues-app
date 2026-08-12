import React, { useCallback } from 'react';

import { Button } from '@carbon/react';
import { Send } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { launchWorkspace2 } from '@openmrs/esm-framework';

type MovetoNextServicePointReassignPatientActionProps = {
  patientUuid: string;
  queueUuid: string;
};

const MovetoNextServicePointReassignAction: React.FC<MovetoNextServicePointReassignPatientActionProps> = ({
  patientUuid,
  queueUuid,
}) => {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    launchWorkspace2('move-to-next-service-point-form-workspace', {
      workspaceTitle: t('moveToNextServicePoint', 'Move to next service point'),
      patientUuid,
      queueUuid,
    });
  }, [t, patientUuid, queueUuid]);

  return (
    <Button
      kind="ghost"
      onClick={handleClick}
      iconDescription={t('reassignPatient', 'Re-assign patient')}
      renderIcon={(props) => <Send size={16} {...props} />}
    />
  );
};
export default MovetoNextServicePointReassignAction;
