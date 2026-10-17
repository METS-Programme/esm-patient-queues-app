import { InlineNotification } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSession, userHasAccess } from '@openmrs/esm-framework';

interface PrivilegeGateProps {
  /** privilege the session user must hold to see the children */
  privilege: string;
  children: React.ReactNode;
}

/**
 * Renders children only when the session user holds the given privilege;
 * otherwise shows an access-denied notification. Also renders nothing while
 * the session is still loading, to avoid a denied flash on page open.
 */
const PrivilegeGate: React.FC<PrivilegeGateProps> = ({ privilege, children }) => {
  const { t } = useTranslation();
  const session = useSession();

  if (!session) {
    return null;
  }

  if (session.user && userHasAccess(privilege, session.user)) {
    return <>{children}</>;
  }

  return (
    <InlineNotification
      hideCloseButton
      kind="error"
      lowContrast
      title={t('accessDenied', 'Access denied')}
      subtitle={t(
        'missingPrivilege',
        'You do not have the privilege required to view this page: {{privilege}}',
        { privilege },
      )}
    />
  );
};

export default PrivilegeGate;
