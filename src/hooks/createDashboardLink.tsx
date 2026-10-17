import { ConfigurableLink, useConfig, useSession, userHasAccess } from '@openmrs/esm-framework';
import React, { useMemo } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { type PatientQueueConfig } from '../config-schema';

export interface DashboardLinkConfig {
  name: string;
  title: string;
  /** key of the PatientQueueConfig entry holding the privilege this link requires */
  privilegeConfigKey: 'receptionDashboardPrivilege' | 'triageDashboardPrivilege' | 'clinicianDashboardPrivilege';
}

function DashboardExtension({ dashboardLinkConfig }: { dashboardLinkConfig: DashboardLinkConfig }) {
  const { name, title } = dashboardLinkConfig;
  const location = useLocation();
  const config = useConfig<PatientQueueConfig>();
  const session = useSession();
  const spaBasePath = `${window.spaBase}/home`;

  const navLink = useMemo(() => {
    const pathArray = location.pathname.split('/home');
    const lastElement = pathArray[pathArray.length - 1];
    return decodeURIComponent(lastElement);
  }, [location.pathname]);

  if (!session) {
    return null;
  }

  const privilege = config[dashboardLinkConfig.privilegeConfigKey];
  if (!privilege || !(session.user && userHasAccess(privilege, session.user))) {
    return null;
  }

  return (
    <ConfigurableLink
      to={`${spaBasePath}/${name}`}
      className={`cds--side-nav__link ${navLink.match(name) && 'active-left-nav-link'}`}
    >
      {title}
    </ConfigurableLink>
  );
}

export const createDashboardLink = (dashboardLinkConfig: DashboardLinkConfig) => () => (
  <BrowserRouter>
    <DashboardExtension dashboardLinkConfig={dashboardLinkConfig} />
  </BrowserRouter>
);
