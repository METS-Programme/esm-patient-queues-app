import React, { useMemo } from 'react';
import { Calendar, Location } from '@carbon/react/icons';
import { formatDate, useSession } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

import { useParentLocation } from '../../active-visits/resources/patient-queues.resource';
import PatientQueueIllustration from './patient-queue-illustration.component';

import styles from './patient-queue-header.scss';

interface PatientQueueHeaderProps {
  title?: string;
}

const PatientQueueHeader: React.FC<PatientQueueHeaderProps> = ({ title }) => {
  const { t } = useTranslation();
  const session = useSession();

  const sessionLocationUuid = session?.sessionLocation?.uuid ?? '';
  const sessionLocationName = session?.sessionLocation?.display ?? t('unknownLocation', 'Unknown location');

  const { location, isLoading } = useParentLocation(sessionLocationUuid);

  const parentLocationName = useMemo(() => {
    if (isLoading) {
      return t('loadingClinic', 'Loading clinic...');
    }

    return location?.parentLocation?.display ?? t('unknownClinic', 'Unknown clinic');
  }, [isLoading, location?.parentLocation?.display, t]);

  const currentDate = useMemo(() => {
    return formatDate(new Date(), { mode: 'standard' });
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.leftJustifiedItems}>
        <PatientQueueIllustration />

        <div className={styles.pageLabels}>
          <p className={styles.sectionLabel}>{title ?? t('home', 'Home')}</p>
          <h1 className={styles.pageName}>{t('queues', 'Patient Queues')}</h1>
        </div>
      </div>

      <div className={styles.rightJustifiedItems}>
        <div className={styles.dateAndLocation}>
          <span className={styles.metaItem}>
            <Location size={16} aria-hidden="true" />
            <span className={styles.value}>{sessionLocationName}</span>
          </span>

          <span className={styles.middot} aria-hidden="true">
            &middot;
          </span>

          <span className={styles.metaItem}>
            <Calendar size={16} aria-hidden="true" />
            <span className={styles.value}>{currentDate}</span>
          </span>
        </div>

        <div className={styles.clinic}>
          <span>{parentLocationName}</span>
        </div>
      </div>
    </header>
  );
};

export default PatientQueueHeader;
