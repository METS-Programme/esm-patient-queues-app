import React, { useCallback } from 'react';
import { Button, Tooltip } from '@carbon/react';
import { Edit } from '@carbon/react/icons';
import { navigate } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

interface EditActionsMenuProps {
  to?: string;
  from?: string;
  disabled?: boolean;
}

const EditActionsMenu: React.FC<EditActionsMenuProps> = ({ from, to, disabled = false }) => {
  const { t } = useTranslation();

  const handleEditPatient = useCallback(() => {
    if (!to) {
      return;
    }

    if (from) {
      localStorage.setItem('fromPage', from);
    }

    navigate({ to });
  }, [from, to]);

  return (
    <Tooltip align="bottom-start" label={t('editPatientDetails', 'Edit patient details')}>
      <Button
        kind="ghost"
        size="sm"
        hasIconOnly
        disabled={disabled || !to}
        onClick={handleEditPatient}
        iconDescription={t('editPatient', 'Edit patient')}
        renderIcon={Edit}
      />
    </Tooltip>
  );
};

export default EditActionsMenu;
