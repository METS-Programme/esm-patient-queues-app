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
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useSession } from '@openmrs/esm-framework';
import dayjs from 'dayjs';

import {
  getOriginFromPathName,
  useParentLocation,
  usePatientQueuePages,
} from '../active-visits/patient-queues.resource';
import { useServicePointCount } from '../components/patient-queue-metrics/clinic-metrics.resource';
import {
  buildStatusString,
  formatWaitTime,
  getTagColor,
  getWaitTimeInMinutes,
  trimVisitNumber,
} from '../helpers/functions';
import StatusIcon from '../utils/utils';
import EditActionsMenu from '../active-visits/action-buttons/edit-action-menu.components';
import PrintActionsMenu from '../active-visits/action-buttons/print-action-menu.components';
import CheckInLauncher from '../components/check-in/check-in.component';
import PatientQueueHeader from '../components/patient-queue-header/patient-queue-header.component';
import QueueLauncher from '../components/queue-launcher/queue-launcher.component';
import SummaryTile, { type SummaryTileValue } from '../summary-tiles/summary-tile.component';

import styles from './queue-reception-home.scss';

type QueueEntry = {
  uuid: string;
  visitNumber?: string;
  status?: string;
  dateCreated?: string;
  patient?: {
    uuid?: string;
    person?: {
      display?: string;
    };
  };
  locationTo?: {
    display?: string;
  };
};

const WAIT_TIME_REFRESH_INTERVAL_MS = 60_000;

function getOpenmrsPatientEditUrl(patientUuid?: string) {
  if (!patientUuid) {
    return '#';
  }

  const spaBase = window.getOpenmrsSpaBase?.() ?? '/openmrs/spa';

  return `${spaBase}/patient/${patientUuid}/edit`;
}

const ReceptionHome: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();

  const [searchTerm, setSearchTerm] = useState('');
  const [waitTimeRefreshTick, setWaitTimeRefreshTick] = useState(0);

  const sessionLocationUuid = session?.sessionLocation?.uuid ?? '';
  const { location } = useParentLocation(sessionLocationUuid);

  const parentLocationUuid = location?.parentLocation?.uuid ?? sessionLocationUuid;

  const today = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  const { stats = [] } = useServicePointCount(parentLocationUuid, today, today);

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
  } = usePatientQueuePages('', '');

  const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const normalizedSearchTerm = useMemo(() => {
    return searchTerm.trim().toLowerCase();
  }, [searchTerm]);

  const summaryValues = useMemo<SummaryTileValue[]>(
    () => [
      {
        label: t('patients', 'Patients'),
        value: totalCount ?? 0,
      },
    ],
    [t, totalCount],
  );

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

  const filteredPatientQueueEntries = useMemo(() => {
    return [...items]
      .filter((entry: QueueEntry) => {
        if (!normalizedSearchTerm) {
          return true;
        }

        const patientName = entry.patient?.person?.display?.toLowerCase() ?? '';
        const visitNumber = entry.visitNumber?.toLowerCase() ?? '';
        const locationName = entry.locationTo?.display?.toLowerCase() ?? '';
        const status = entry.status?.toLowerCase() ?? '';

        return (
          patientName.includes(normalizedSearchTerm) ||
          visitNumber.includes(normalizedSearchTerm) ||
          locationName.includes(normalizedSearchTerm) ||
          status.includes(normalizedSearchTerm)
        );
      })
      .sort((a: QueueEntry, b: QueueEntry) => {
        return new Date(a.dateCreated ?? 0).getTime() - new Date(b.dateCreated ?? 0).getTime();
      });
  }, [items, normalizedSearchTerm]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setWaitTimeRefreshTick((previousTick) => previousTick + 1);
    }, WAIT_TIME_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const tableRows = useMemo(() => {
    return filteredPatientQueueEntries.map((queueEntry: QueueEntry) => {
      const normalizedStatus = (queueEntry.status?.toLowerCase() ?? 'pending') as 'pending' | 'picked' | 'completed';
      const waitTimeInMinutes = getWaitTimeInMinutes(queueEntry);

      return {
        ...queueEntry,
        id: queueEntry.uuid,

        visitNumber: {
          content: <span>{trimVisitNumber(queueEntry.visitNumber ?? '') || '—'}</span>,
        },

        name: {
          content: <span>{queueEntry.patient?.person?.display ?? '—'}</span>,
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
              <EditActionsMenu to={getOpenmrsPatientEditUrl(queueEntry.patient?.uuid)} from={fromPage ?? ''} />

              {/* <PrintActionsMenu patient={queueEntry} /> */}
            </div>
          ),
        },
      };
    });

    /**
     * waitTimeRefreshTick intentionally refreshes wait-time rendering every minute.
     */
  }, [filteredPatientQueueEntries, fromPage, t]);

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
    <main className={styles.page}>
      <PatientQueueHeader title={t('reception', 'Reception')} />

      <section className={styles.cardContainer} aria-label={t('receptionMetrics', 'Reception metrics')}>
        <SummaryTile values={summaryValues} headerLabel={t('checkedInPatients', 'Checked in patients')} />

        <SummaryTile values={stats} headerLabel={t('currentlyServing', 'No. of Currently being Served')} />
      </section>

      <section className={styles.container} aria-label={t('receptionQueue', 'Reception queue')}>
        <div className={styles.headerContainer}>
          <QueueLauncher />

          <div className={styles.headerButtons}>
            <CheckInLauncher />
          </div>
        </div>

        <DataTable data-floating-menu-container headers={tableHeaders} rows={tableRows} useZebraStyles>
          {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getToolbarProps, getTableContainerProps }) => (
            <TableContainer className={styles.tableContainer} {...getTableContainerProps()}>
              <TableToolbar {...getToolbarProps()} className={styles.tableToolbar}>
                <TableToolbarContent className={styles.toolbarContent}>
                  <h4 className={styles.tableTitle}>{t('checkedInPatients', 'Checked in patients')}</h4>

                  <TableToolbarSearch
                    expanded
                    className={styles.search}
                    onChange={() => handleSearchInputChange}
                    placeholder={t('searchThisList', 'Search this list')}
                    size="sm"
                    value={searchTerm}
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
                    <TableRow {...getRowProps({ row })}>
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
      </section>
    </main>
  );
};

export default ReceptionHome;
