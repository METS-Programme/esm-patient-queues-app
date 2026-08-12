import React, { useCallback } from 'react';
import { launchWorkspace2 } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

import styles from './move-to-next-service-point-action-button.scss';

interface MoveToNextServicePointPatientActionButtonProps {
  patientUuid?: string;
  disabled?: boolean;
}

const MoveToNextServicePointPatientActionButton: React.FC<MoveToNextServicePointPatientActionButtonProps> = ({
  patientUuid,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    if (!patientUuid || disabled) {
      return;
    }

    launchWorkspace2('move-to-next-service-point-form-workspace', {
      patientUuid,
      showPatientHeader: true,
    });
  }, [disabled, patientUuid]);

  return (
    <li className="cds--overflow-menu-options__option">
      <button
        className={`cds--overflow-menu-options__btn max-width: 100vw`}
        role="menuitem"
        type="button"
        title={t('moveToNext', 'Move to Next Service Point')}
        disabled={disabled || !patientUuid}
        data-floating-menu-primary-focus
        onClick={handleClick}
      >
        <span className="cds--overflow-menu-options__option-content">
          {t('moveToNext', 'Move to Next Service Point')}
        </span>
      </button>
    </li>
  );
};

export default MoveToNextServicePointPatientActionButton;
