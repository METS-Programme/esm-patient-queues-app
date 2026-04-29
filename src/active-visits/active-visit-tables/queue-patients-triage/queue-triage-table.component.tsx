import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DataTable,
  DataTableSkeleton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbarSearch,
  Tag,
  Tile,
  Toggle,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { isDesktop, useConfig, useLayoutType, useSession } from '@openmrs/esm-framework';

import styles from './queue-triage-table.scss';
import { type PatientQueueConfig } from '../../../config-schema';
import {
  getWaitTimeInMinutes,
  trimVisitNumber,
  getProviderTagColor,
  buildStatusString,
  getTagColor,
  formatWaitTime,
} from '../../../helpers/functions';
import StatusIcon, { QueueStatus } from '../../../utils/utils';
import MovetoNextServicePointReassignAction from '../../action-buttons/move-to-next-service-point-re-assign-action.component';
import ViewQueuePatientActionMenu from '../../action-buttons/view-queue-patient-action-menu.component';
import {
  useParentLocation,
  getOriginFromPathName,
  usePatientQueuePages,
} from '../../resources/patient-queues.resource';
import PickQueuePatientActionButton from '../../action-buttons/pick-queue-patient-action.component';
import { type PatientQueue } from '../../../types/patient-queues';

interface ActiveVisitsTableProps {
  status: string;
}

const REFRESH_WAIT_TIME_INTERVAL_MS = 60_000;

function getVisibleStatusMatcher(status: string) {
  switch (status) {
    case QueueStatus.Completed:
      return (entry: PatientQueue) => entry.status === 'COMPLETED';

    case QueueStatus.Pending:
      return (entry: PatientQueue) => entry.status === 'PENDING' || entry.status === 'PICKED';

    default:
      return (entry: PatientQueue) => !status || entry.status === status;
  }
}

function getOpenmrsPatientChartUrl(patientUuid?: string) {
  if (!patientUuid) {
    return '#';
  }

  const spaBase = window.getOpenmrsSpaBase?.() ?? '/openmrs/spa';

  return `${spaBase}/patient/${patientUuid}/chart`;
}

const ActiveTriageVisitsTable: React.FC<ActiveVisitsTableProps> = ({ status }) => {
  const { t } = useTranslation();
  const session = useSession();
  const layout = useLayoutType();
  const { triageRoomTag } = useConfig<PatientQueueConfig>();

  const [tick, setTick] = useState(0);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const sessionLocationUuid = session?.sessionLocation?.uuid ?? '';
  const sessionUserSystemId = session?.user?.systemId ?? '';

  const { location } = useParentLocation(sessionLocationUuid);

  const activeLocationUuid = useMemo(() => {
    if (!showAllLocations) {
      return sessionLocationUuid;
    }

    return location?.parentLocation?.uuid ?? sessionLocationUuid;
  }, [location?.parentLocation?.uuid, sessionLocationUuid, showAllLocations]);

  const fromPage = useMemo(() => {
    return getOriginFromPathName(window.location.pathname);
  }, []);

  const {
    isLoading,
    items = [],
    totalCount = 0,
    currentPageSize,
    setPageSize,
    pageSizes,
    currentPage,
    setCurrentPage,
  } = usePatientQueuePages(activeLocationUuid, status, showAllLocations, false);

  const handleToggleChange = useCallback((checked: boolean) => {
    setShowAllLocations(checked);
  }, []);

  const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const normalizedSearchTerm = useMemo(() => {
    return searchTerm.trim().toLowerCase();
  }, [searchTerm]);

  const tableHeaders = useMemo(
    () => [
      { header: t('visitNumber', 'Visit Number'), key: 'visitNumber' },
      { header: t('name', 'Name'), key: 'name' },
      { header: t('provider', 'Provider'), key: 'provider' },
      { header: t('currentlocation', 'Current Location'), key: 'location' },
      { header: t('status', 'Status'), key: 'status' },
      { header: t('waitTime', 'Wait time'), key: 'waitTime' },
      { header: t('actions', 'Actions'), key: 'actions' },
    ],
    [t],
  );

  const visibleHeaders = useMemo(() => {
    return tableHeaders.filter((header) => showAllLocations || header.key !== 'provider');
  }, [showAllLocations, tableHeaders]);

  const filteredPatientQueueEntries = useMemo(() => {
    const matchesStatus = getVisibleStatusMatcher(status);

    return [...items]
      .filter(matchesStatus)
      .filter((entry: PatientQueue) => {
        if (!triageRoomTag) {
          return true;
        }

        return entry.queueRoom?.tags?.some((tag) => tag.uuid === triageRoomTag);
      })
      .filter((entry: PatientQueue) => {
        if (!normalizedSearchTerm) {
          return true;
        }

        const patientName = entry.patient?.person?.display?.toLowerCase() ?? '';
        const visitNumber = entry.visitNumber?.toLowerCase() ?? '';
        const providerName = entry.provider?.display?.toLowerCase() ?? '';
        const locationName = entry.locationTo?.display?.toLowerCase() ?? '';
        const statusName = entry.status?.toLowerCase() ?? '';

        return (
          patientName.includes(normalizedSearchTerm) ||
          visitNumber.includes(normalizedSearchTerm) ||
          providerName.includes(normalizedSearchTerm) ||
          locationName.includes(normalizedSearchTerm) ||
          statusName.includes(normalizedSearchTerm)
        );
      })
      .sort((a: PatientQueue, b: PatientQueue) => {
        const aIsPicked = a.status === 'PICKED';
        const bIsPicked = b.status === 'PICKED';

        if (aIsPicked && !bIsPicked) {
          return -1;
        }

        if (!aIsPicked && bIsPicked) {
          return 1;
        }

        return new Date(a.dateCreated ?? 0).getTime() - new Date(b.dateCreated ?? 0).getTime();
      });
  }, [items, normalizedSearchTerm, status, triageRoomTag]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTick((previousTick) => previousTick + 1);
    }, REFRESH_WAIT_TIME_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const tableRows = useMemo(() => {
    return filteredPatientQueueEntries.map((queueEntry: PatientQueue) => {
      const waitTimeInMinutes = getWaitTimeInMinutes(queueEntry);
      const normalizedStatus = queueEntry.status?.toLowerCase() ?? '';

      return {
        ...queueEntry,
        id: queueEntry.uuid,

        visitNumber: {
          content: <span className={styles.visitNumber}>{trimVisitNumber(queueEntry.visitNumber ?? '') || '—'}</span>,
        },

        name: {
          content: <span className={styles.patientName}>{queueEntry.patient?.person?.display ?? '—'}</span>,
        },

        provider: {
          content: (
            <Tag type="gray">
              <span
                style={{
                  color: getProviderTagColor(queueEntry.provider?.identifier, sessionUserSystemId),
                }}
              >
                {queueEntry.provider?.display ?? t('unassigned', 'Unassigned')}
              </span>
            </Tag>
          ),
        },

        location: {
          content: <span>{queueEntry.locationTo?.display ?? '—'}</span>,
        },

        status: {
          content: (
            <span className={styles.statusContainer}>
              <StatusIcon status={normalizedStatus} />
              <span>{buildStatusString(normalizedStatus)}</span>
            </span>
          ),
        },

        waitTime: {
          content: (
            <Tag type="blue">
              <span
                className={styles.statusContainer}
                style={{
                  color: getTagColor((waitTimeInMinutes ?? 0).toString()),
                }}
              >
                {formatWaitTime(waitTimeInMinutes, t)}
              </span>
            </Tag>
          ),
        },

        actions: {
          content: (
            <div className={styles.actionsContainer}>
              {queueEntry.status === 'PENDING' ? (
                <PickQueuePatientActionButton queueEntry={queueEntry} closeModal={() => true} />
              ) : null}

              {queueEntry.status === 'COMPLETED' || queueEntry.status === 'PICKED' ? (
                <ViewQueuePatientActionMenu
                  to={getOpenmrsPatientChartUrl(queueEntry.patient?.uuid)}
                  from={fromPage ?? ''}
                  queueUuid={queueEntry.uuid}
                />
              ) : null}

              {queueEntry.status === 'PENDING' && showAllLocations && queueEntry.patient?.uuid ? (
                <MovetoNextServicePointReassignAction patientUuid={queueEntry.patient.uuid} />
              ) : null}
            </div>
          ),
        },
      };
    });
  }, [filteredPatientQueueEntries, fromPage, sessionUserSystemId, showAllLocations, t]);

  const renderEmptyState = () => (
    <div className={styles.tileContainer}>
      <Tile className={styles.tile}>
        <div className={styles.tileContent}>
          <p className={styles.content}>{t('noPatientsToDisplay', 'No patients to display')}</p>
          <p className={styles.helper}>{t('checkFilters', 'Try changing the filters or search term')}</p>
        </div>
      </Tile>
    </div>
  );

  if (isLoading) {
    return (
      <div className={styles.tableShell}>
        <DataTableSkeleton role="progressbar" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableControls}>
        <div className={styles.tableTitleGroup}>
          <h4 className={styles.tableTitle}>
            {status === QueueStatus.Completed
              ? t('completedPatients', 'Completed patients')
              : t('patientsInQueue', 'Patients in queue')}
          </h4>

          <p className={styles.tableSubtitle}>
            {t('patientsCount', '{{count}} patient(s)', {
              count: filteredPatientQueueEntries.length,
            })}
          </p>
        </div>

        <div className={styles.tableActions}>
          <TableToolbarSearch
            expanded
            className={styles.search}
            onChange={() => handleSearchInputChange}
            placeholder={t('searchThisList', 'Search this list')}
            size="sm"
            value={searchTerm}
          />

          <Toggle
            className={styles.toggle}
            id={`all-queue-locations-toggle-${status}`}
            labelA={t('myLocation', 'My Location')}
            labelB={t('allLocations', 'All Locations')}
            toggled={showAllLocations}
            onToggle={handleToggleChange}
          />
        </div>
      </div>

      <DataTable
        data-floating-menu-container
        headers={visibleHeaders}
        overflowMenuOnHover={isDesktop(layout)}
        rows={tableRows}
        useZebraStyles
      >
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer className={styles.tableContainer}>
            <Table {...getTableProps()} className={styles.activeVisitsTable}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => {
                    const headerProps = getHeaderProps({ header });

                    return <TableHeader {...headerProps}>{header.header}</TableHeader>;
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {rows.length === 0 ? renderEmptyState() : null}
          </TableContainer>
        )}
      </DataTable>

      <Pagination
        className={styles.paginationOverride}
        page={currentPage}
        pageSize={currentPageSize}
        pageSizes={pageSizes}
        totalItems={totalCount ?? 0}
        onChange={({ page, pageSize }) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
};

export default ActiveTriageVisitsTable;
