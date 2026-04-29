import React, { useCallback } from 'react';
import { Button, Tooltip } from '@carbon/react';
import { Dashboard } from '@carbon/react/icons';
import { navigate } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

import { updateSelectedPatientQueueUuid } from '../../helpers/helpers';

interface ViewQueuePatientActionMenuProps {
  to?: string;
  from?: string;
  queueUuid?: string;
  disabled?: boolean;
}

const ViewQueuePatientActionMenu: React.FC<ViewQueuePatientActionMenuProps> = ({
  from,
  to,
  queueUuid,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const handleViewPatient = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (!to || disabled) {
        return;
      }

      if (queueUuid) {
        updateSelectedPatientQueueUuid(queueUuid);
      }

      if (from) {
        localStorage.setItem('fromPage', from);
      }

      navigate({ to });
    },
    [disabled, from, queueUuid, to],
  );

  return (
    <Tooltip align="bottom" label={t('viewPatient', 'View patient')}>
      <Button
        kind="ghost"
        size="sm"
        hasIconOnly
        disabled={disabled || !to}
        onClick={handleViewPatient}
        iconDescription={t('viewPatient', 'View patient')}
        renderIcon={Dashboard}
      />
    </Tooltip>
  );
};

export default ViewQueuePatientActionMenu;
