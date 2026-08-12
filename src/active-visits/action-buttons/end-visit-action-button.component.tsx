import React, { useCallback } from 'react';
import { showModal } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

import styles from './end-visit-action-button.scss';

interface EndVisitActionButtonProps {
  patientUuid?: string;
  disabled?: boolean;
}

const EndVisitActionButton: React.FC<EndVisitActionButtonProps> = ({ patientUuid, disabled = false }) => {
  const { t } = useTranslation();

  const launchEndVisitModal = useCallback(() => {
    if (!patientUuid || disabled) {
      return;
    }

    const dispose = showModal('end-visit-modal', {
      patientUuid,
      closeModal: () => dispose(),
    });
  }, [disabled, patientUuid]);

  return (
    <li className="cds--overflow-menu-options__option">
      <button
        className={`cds--overflow-menu-options__btn max-width: 100vw`}
        role="menuitem"
        type="button"
        title={t('endAVisit', 'End a visit')}
        disabled={disabled || !patientUuid}
        data-floating-menu-primary-focus
        onClick={launchEndVisitModal}
      >
        <span className="cds--overflow-menu-options__option-content">{t('endAVisit', 'End a visit')}</span>
      </button>
    </li>
  );
};

export default EndVisitActionButton;
