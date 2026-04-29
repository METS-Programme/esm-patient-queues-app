import React, { useCallback } from 'react';
import { Button, Tooltip } from '@carbon/react';
import { Send } from '@carbon/react/icons';
import { launchWorkspace2 } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

type MoveToNextServicePointReassignActionProps = {
  patientUuid?: string;
  disabled?: boolean;
};

const MoveToNextServicePointReassignAction: React.FC<MoveToNextServicePointReassignActionProps> = ({
  patientUuid,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    if (!patientUuid || disabled) {
      return;
    }

    launchWorkspace2('move-to-next-service-point-form-workspace', {
      workspaceTitle: t('moveToNextServicePoint', 'Move to next service point'),
      patientUuid,
      showPatientHeader: true,
    });
  }, [disabled, patientUuid, t]);

  return (
    <Tooltip align="bottom" label={t('reassignPatient', 'Re-assign patient')}>
      <Button
        kind="ghost"
        size="sm"
        hasIconOnly
        disabled={disabled || !patientUuid}
        onClick={handleClick}
        iconDescription={t('reassignPatient', 'Re-assign patient')}
        renderIcon={Send}
      />
    </Tooltip>
  );
};

export default MoveToNextServicePointReassignAction;
