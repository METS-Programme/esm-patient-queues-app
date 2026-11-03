import { Button, InlineLoading, Popover, PopoverContent } from '@carbon/react';
import { Notification, NotificationNew } from '@carbon/react/icons';
import { formatDate, parseDate } from '@openmrs/esm-framework';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResultsReadyQueues } from '../../active-visits/patient-queues.resource';
import PickPatientActionMenu from '../../active-visits/pick-queue-patient-action-action.component';
import ViewQueuePatientActionMenu from '../../active-visits/view-queue-patient-action-menu.component';
import { trimVisitNumber } from '../../helpers/functions';
import styles from './results-ready-notification.scss';

interface ResultsReadyNotificationProps {
  queueRoomUuid?: string;
}

const ResultsReadyNotification: React.FC<ResultsReadyNotificationProps> = ({ queueRoomUuid }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { items, count, error, isLoading, isValidating } = useResultsReadyQueues(queueRoomUuid);
  const fromPage = useMemo(() => window.location.pathname.split('/').filter(Boolean).pop() ?? 'clinical-room', []);
  const closePopover = useCallback(() => setOpen(false), []);
  const countLabel = count > 99 ? '99+' : count.toString();

  return (
    <Popover align="bottom-end" autoAlign open={open} onRequestClose={closePopover}>
      <Button
        className={styles.trigger}
        kind="ghost"
        size="md"
        data-count={countLabel}
        data-has-results={count > 0}
        onClick={() => setOpen((isOpen) => !isOpen)}
        iconDescription={t('resultsReady', 'Results ready')}
        aria-label={t('resultsReadyCount', '{{count}} patients have results ready', { count })}
        aria-expanded={open}
        renderIcon={(props) =>
          count > 0 ? <NotificationNew size={20} {...props} /> : <Notification size={20} {...props} />
        }
      />

      <PopoverContent className={styles.popoverContent}>
        <div className={styles.heading}>
          <div>
            <h4>{t('resultsReady', 'Results ready')}</h4>
            <p>{t('resultsReadyHelper', 'Patients waiting for clinical review')}</p>
          </div>
          {isValidating && !isLoading && <InlineLoading status="active" />}
        </div>

        {isLoading ? (
          <div className={styles.stateContainer}>
            <InlineLoading description={t('loadingResultsReady', 'Loading results-ready patients')} />
          </div>
        ) : error ? (
          <div className={styles.stateContainer} role="alert">
            <p>{t('resultsReadyLoadError', 'Results-ready patients could not be loaded.')}</p>
          </div>
        ) : items.length === 0 ? (
          <div className={styles.stateContainer}>
            <p>{t('noResultsReady', 'No patients currently have results ready.')}</p>
          </div>
        ) : (
          <ul className={styles.patientList} aria-label={t('resultsReadyPatients', 'Patients with results ready')}>
            {items.map((queueEntry) => (
              <li className={styles.patientItem} key={queueEntry.uuid}>
                <div className={styles.patientDetails}>
                  <strong>{queueEntry.patient?.person?.display}</strong>
                  <span>
                    {t('visitNumberWithValue', 'Visit {{visitNumber}}', {
                      visitNumber: trimVisitNumber(queueEntry.visitNumber) ?? queueEntry.visitNumber,
                    })}
                  </span>
                  <span>
                    {t('resultsReadySince', 'Ready since {{time}}', {
                      time: formatDate(parseDate(queueEntry.dateCreated), { mode: 'standard', time: true }),
                    })}
                  </span>
                </div>
                <div className={styles.actions}>
                  <PickPatientActionMenu queueEntry={queueEntry} closeModal={closePopover} />
                  <ViewQueuePatientActionMenu
                    to={`\${openmrsSpaBase}/patient/${queueEntry.patient?.uuid}/chart`}
                    from={fromPage}
                    queueUuid={queueEntry.uuid}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ResultsReadyNotification;
