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
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tag,
  Tile,
  Toggle,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { isDesktop, useConfig, useLayoutType, useSession } from '@openmrs/esm-framework';

import { getOriginFromPathName, useParentLocation, usePatientQueuePages } from '../patient-queues.resource';
import {
  buildStatusString,
  formatWaitTime,
  getProviderTagColor,
  getTagColor,
  getWaitTimeInMinutes,
  trimVisitNumber,
} from '../../helpers/functions';
import PickQueuePatientActionMenu from '../pick-queue-patient-action-action.component';
import NotesActionsMenu from '../notes/notes-action-menu.components';
import MovetoNextServicePointReassignAction from '../move-to-next-service-point-re-assign-action.component';
import ViewQueuePatientActionMenu from '../view-queue-patient-action-menu.component';
import StatusIcon, { QueueStatus } from '../../utils/utils';
import { type PatientQueueConfig } from '../../config-schema';

import styles from './queue-triage-table.scss';

interface ActiveVisitsTableProps {
  status: string;
}

type QueueEntry = {
  uuid: string;
  visitNumber?: string;
  status?: string;
  dateCreated?: string;
  patient?: {
    uuid: string;
    person?: {
      display?: string;
    };
  };
  provider?: {
    identifier?: string;
    display?: string;
  };
  locationTo?: {
    display?: string;
  };
  queueRoom?: {
    tags?: Array<{
      uuid: string;
    }>;
  };
};

const REFRESH_WAIT_TIME_INTERVAL_MS = 60_000;

const getVisibleStatusMatcher = (status: string) => {
  switch (status) {
    case QueueStatus.Completed:
      return (entry: QueueEntry) => entry.status === 'COMPLETED';

    case QueueStatus.Pending:
      return (entry: QueueEntry) => entry.status === 'PENDING' || entry.status === 'PICKED';

    default:
      return (entry: QueueEntry) => entry.status === status;
  }
};

const ActiveTriageVisitsTable: React.FC<ActiveVisitsTableProps> = ({ status }) => {
  const { t } = useTranslation();
  const session = useSession();
  const layout = useLayoutType();
  const { triageRoomTag } = useConfig<PatientQueueConfig>();

  const [tick, setTick] = useState(0);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const sessionLocationUuid = session?.sessionLocation?.uuid ?? '';
  const sessionUserSystemId = session?.user?.systemId;

  const { location } = useParentLocation(sessionLocationUuid);

  const activeLocationUuid = showAllLocations
    ? (location?.parentLocation?.uuid ?? sessionLocationUuid)
    : sessionLocationUuid;

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
      {
        header: t('visitNumber', 'Visit Number'),
        key: 'visitNumber',
      },
      {
        header: t('name', 'Name'),
        key: 'name',
      },
      {
        header: t('provider', 'Provider'),
        key: 'provider',
      },
      {
        header: t('currentlocation', 'Current Location'),
        key: 'location',
      },
      {
        header: t('status', 'Status'),
        key: 'status',
      },
      {
        header: t('waitTime', 'Wait time'),
        key: 'waitTime',
      },
      {
        header: t('actions', 'Actions'),
        key: 'actions',
      },
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
      .filter((entry) => {
        if (!triageRoomTag) {
          return true;
        }

        return entry?.queueRoom?.tags?.some((tag) => tag.uuid === triageRoomTag);
      })
      .filter((entry) => {
        if (!normalizedSearchTerm) {
          return true;
        }

        const patientName = entry.patient?.person?.display?.toLowerCase() ?? '';
        const visitNumber = entry.visitNumber?.toLowerCase() ?? '';
        const providerName = entry.provider?.display?.toLowerCase() ?? '';

        return (
          patientName.includes(normalizedSearchTerm) ||
          visitNumber.includes(normalizedSearchTerm) ||
          providerName.includes(normalizedSearchTerm)
        );
      })
      .sort((a, b) => {
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
    return filteredPatientQueueEntries.map((queueEntry) => {
      const waitTimeInMinutes = getWaitTimeInMinutes(queueEntry);
      const normalizedStatus = queueEntry.status?.toLowerCase() ?? '';

      return {
        ...queueEntry,
        id: queueEntry.uuid,

        visitNumber: {
          content: <span>{trimVisitNumber(queueEntry.visitNumber ?? '') || '—'}</span>,
        },

        name: {
          content: queueEntry.patient?.person?.display ?? '—',
        },

        provider: {
          content: (
            <Tag>
              <span
                style={{
                  color: getProviderTagColor(queueEntry.provider?.identifier, sessionUserSystemId ?? ''),
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
            <Tag>
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
              {queueEntry.status === 'PENDING' && (
                <PickQueuePatientActionMenu queueEntry={queueEntry} closeModal={() => true} />
              )}

              {(queueEntry.status === 'COMPLETED' || queueEntry.status === 'PICKED') && (
                <ViewQueuePatientActionMenu
                  to={`${window.getOpenmrsSpaBase?.() ?? '/openmrs/spa'}/patient/${queueEntry.patient?.uuid}/chart`}
                  from={fromPage ?? ''}
                  queueUuid={queueEntry.uuid}
                />
              )}

              <NotesActionsMenu note={queueEntry} />

              {queueEntry.status === 'PENDING' && showAllLocations && queueEntry.patient?.uuid && (
                <MovetoNextServicePointReassignAction patientUuid={queueEntry.patient.uuid} />
              )}
            </div>
          ),
        },
      };
    });

    /**
     * tick intentionally refreshes wait-time rendering every minute.
     */
  }, [filteredPatientQueueEntries, fromPage, sessionUserSystemId, showAllLocations, t]);

  const renderEmptyState = () => (
    <div className={styles.tileContainer}>
      <Tile className={styles.tile}>
        <div className={styles.tileContent}>
          <p className={styles.content}>{t('noPatientsToDisplay', 'No patients to display')}</p>
          <p className={styles.helper}>{t('checkFilters', 'Check the filters above')}</p>
        </div>
      </Tile>
    </div>
  );

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
    <div className={styles.container}>
      <DataTable
        data-floating-menu-container
        headers={visibleHeaders}
        overflowMenuOnHover={isDesktop(layout)}
        rows={tableRows}
        useZebraStyles
      >
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer className={styles.tableContainer}>
            <TableToolbar className={styles.tableToolbar}>
              <TableToolbarContent className={styles.toolbarContent}>
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
                  id="all-queue-locations-toggle"
                  labelA={t('myLocation', 'My Location')}
                  labelB={t('allLocations', 'All Locations')}
                  toggled={showAllLocations}
                  onToggle={handleToggleChange}
                />
              </TableToolbarContent>
            </TableToolbar>

            <Table {...getTableProps()} className={styles.activeVisitsTable}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                  ))}
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
