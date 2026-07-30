import React, { type AnchorHTMLAttributes, useCallback } from 'react';

import { Button } from '@carbon/react';
import { Dashboard } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { navigate } from '@openmrs/esm-framework';

interface NameLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  from: string;
}

const ViewQueuePatientActionMenu: React.FC<NameLinkProps> = ({ from, to }) => {
  const { t } = useTranslation();

  const handleNameClick = useCallback(
    (event: any) => {
      event.preventDefault();
      localStorage.setItem('fromPage', from);
      navigate({ to });
    },
    [from, to],
  );

  return (
    <div>
      <Button
        kind="ghost"
        onClick={handleNameClick}
        iconDescription={t('viewPatient', 'View Patient')}
        renderIcon={(props) => <Dashboard size={16} {...props} />}
      />
    </div>
  );
};

export default ViewQueuePatientActionMenu;
