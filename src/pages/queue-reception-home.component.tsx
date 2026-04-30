import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DataTable,
  DataTableSkeleton,
  Dropdown,
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
} from '@carbon/react';
import { useSession } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import EditActionsMenu from '../active-visits/action-buttons/edit-action-menu.components';
import {
  getOriginFromPathName,
  useParentLocation,
  usePatientQueuePages,
} from '../active-visits/resources/patient-queues.resource';
import CheckInLauncher from '../components/check-in/check-in.component';
import PatientQueueHeader from '../components/patient-queue-header/patient-queue-header.component';
import { useServicePointCount } from '../components/patient-queue-metrics/clinic-metrics.resource';
import QueueLauncher from '../components/queue-launcher/queue-launcher.component';
import SummaryTile, { type SummaryTileValue } from '../components/summary-tiles/summary-tile.component';
import {
  buildStatusString,
  formatWaitTime,
  getTagColor,
  getWaitTimeInMinutes,
  trimVisitNumber,
} from '../helpers/functions';
import type { PatientQueue } from '../types/patient-queues';
import StatusIcon from '../utils/utils';

import styles from './queue-reception-home.scss';

const WAIT_TIME_REFRESH_INTERVAL_MS = 60_000;
const ALL_FILTER_VALUE = 'all';

type FilterOption = {
  id: string;
  text: string;
};

const WAIT_TIME_FILTERS: FilterOption[] = [
  {
    id: ALL_FILTER_VALUE,
    text: 'All wait times',
  },
  {
    id: 'under-30',
    text: 'Under 30 min',
  },
  {
    id: '30-to-60',
    text: '30–60 min',
  },
  {
    id: 'over-60',
    text: 'Over 60 min',
  },
];

function getOpenmrsPatientEditUrl(patientUuid?: string) {
  if (!patientUuid) {
    return '#';
  }

  const spaBase = window.getOpenmrsSpaBase?.() ?? '/openmrs/spa';

  return `${spaBase}/patient/${patientUuid}/edit`;
}

function normalizeSearchValue(value?: string) {
  return value?.trim().toLowerCase() ?? '';
}

function sortQueueEntriesByCreatedDate(a: PatientQueue, b: PatientQueue) {
  return new Date(a.dateCreated ?? 0).getTime() - new Date(b.dateCreated ?? 0).getTime();
}

function matchesSearchFilter(entry: PatientQueue, normalizedSearchTerm: string) {
  if (!normalizedSearchTerm) {
    return true;
  }

  const searchableValues = [entry.patient?.person?.display, entry.visitNumber, entry.locationTo?.display, entry.status];

  return searchableValues.some((value) => normalizeSearchValue(value).includes(normalizedSearchTerm));
}

function matchesStatusFilter(entry: PatientQueue, selectedStatus: FilterOption | null) {
  if (!selectedStatus || selectedStatus.id === ALL_FILTER_VALUE) {
    return true;
  }

  return entry.status === selectedStatus.id;
}

function matchesLocationFilter(entry: PatientQueue, selectedLocation: FilterOption | null) {
  if (!selectedLocation || selectedLocation.id === ALL_FILTER_VALUE) {
    return true;
  }

  return entry.locationTo?.uuid === selectedLocation.id;
}

function matchesWaitTimeFilter(entry: PatientQueue, selectedWaitTime: FilterOption) {
  const waitTimeInMinutes = getWaitTimeInMinutes(entry) ?? 0;

  switch (selectedWaitTime.id) {
    case 'under-30':
      return waitTimeInMinutes < 30;
    case '30-to-60':
      return waitTimeInMinutes >= 30 && waitTimeInMinutes <= 60;
    case 'over-60':
      return waitTimeInMinutes > 60;
    case ALL_FILTER_VALUE:
    default:
      return true;
  }
}

const ReceptionHome: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<FilterOption | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<FilterOption | null>(null);
  const [selectedWaitTime, setSelectedWaitTime] = useState<FilterOption>(WAIT_TIME_FILTERS[0]);
  const [waitTimeRefreshTick, setWaitTimeRefreshTick] = useState(0);

  const sessionLocationUuid = session?.sessionLocation?.uuid ?? '';
  const { location } = useParentLocation(sessionLocationUuid);

  const parentLocationUuid = location?.parentLocation?.uuid ?? sessionLocationUuid;
  const today = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  const { stats = [] } = useServicePointCount(parentLocationUuid, today, today);

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

  const fromPage = useMemo(() => {
    return getOriginFromPathName(window.location.pathname);
  }, []);

  const normalizedSearchTerm = useMemo(() => {
    return normalizeSearchValue(searchTerm);
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
        header: t('currentLocation', 'Current Location'),
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

  const statusFilterOptions = useMemo<FilterOption[]>(() => {
    const statuses = new Set<string>();

    items.forEach((entry: PatientQueue) => {
      if (entry.status) {
        statuses.add(entry.status);
      }
    });

    return [
      {
        id: ALL_FILTER_VALUE,
        text: t('allStatuses', 'All statuses'),
      },
      ...Array.from(statuses).map((status) => ({
        id: status,
        text: buildStatusString(status.toLowerCase()),
      })),
    ];
  }, [items, t]);

  const locationFilterOptions = useMemo<FilterOption[]>(() => {
    const locations = new Map<string, string>();

    items.forEach((entry: PatientQueue) => {
      const locationUuid = entry.locationTo?.uuid;
      const locationName = entry.locationTo?.display;

      if (locationUuid && locationName) {
        locations.set(locationUuid, locationName);
      }
    });

    return [
      {
        id: ALL_FILTER_VALUE,
        text: t('allLocations', 'All locations'),
      },
      ...Array.from(locations.entries()).map(([id, text]) => ({
        id,
        text,
      })),
    ];
  }, [items, t]);

  const filteredPatientQueueEntries = useMemo(() => {
    return [...items]
      .filter((entry: PatientQueue) => {
        return (
          matchesSearchFilter(entry, normalizedSearchTerm) &&
          matchesStatusFilter(entry, selectedStatus) &&
          matchesLocationFilter(entry, selectedLocation) &&
          matchesWaitTimeFilter(entry, selectedWaitTime)
        );
      })
      .sort(sortQueueEntriesByCreatedDate);
  }, [items, normalizedSearchTerm, selectedLocation, selectedStatus, selectedWaitTime]);

  const tableRows = useMemo(() => {
    return filteredPatientQueueEntries.map((queueEntry: PatientQueue) => {
      const normalizedStatus = queueEntry.status?.toLowerCase() ?? 'pending';
      const waitTimeInMinutes = getWaitTimeInMinutes(queueEntry);

      return {
        ...queueEntry,
        id: queueEntry.uuid,

        visitNumber: {
          content: <span className={styles.visitNumber}>{trimVisitNumber(queueEntry.visitNumber ?? '') || '—'}</span>,
        },

        name: {
          content: <span className={styles.patientName}>{queueEntry.patient?.person?.display ?? '—'}</span>,
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
              <EditActionsMenu to={getOpenmrsPatientEditUrl(queueEntry.patient?.uuid)} from={fromPage} />
            </div>
          ),
        },
      };
    });
  }, [filteredPatientQueueEntries, fromPage, t]);

  const handleSearchInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setCurrentPage(1);
    },
    [setCurrentPage],
  );

  const handleStatusFilterChange = useCallback(
    ({ selectedItem }: { selectedItem: FilterOption | null }) => {
      setSelectedStatus(selectedItem);
      setCurrentPage(1);
    },
    [setCurrentPage],
  );

  const handleLocationFilterChange = useCallback(
    ({ selectedItem }: { selectedItem: FilterOption | null }) => {
      setSelectedLocation(selectedItem);
      setCurrentPage(1);
    },
    [setCurrentPage],
  );

  const handleWaitTimeFilterChange = useCallback(
    ({ selectedItem }: { selectedItem: FilterOption | null }) => {
      setSelectedWaitTime(selectedItem ?? WAIT_TIME_FILTERS[0]);
      setCurrentPage(1);
    },
    [setCurrentPage],
  );

  const handlePaginationChange = useCallback(
    ({ page, pageSize }: { page: number; pageSize: number }) => {
      setCurrentPage(page);
      setPageSize(pageSize);
    },
    [setCurrentPage, setPageSize],
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setWaitTimeRefreshTick((previousTick) => previousTick + 1);
    }, WAIT_TIME_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

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
      <main className={styles.page}>
        <PatientQueueHeader title={t('reception', 'Reception')} />

        <div className={styles.tableShell}>
          <DataTableSkeleton role="progressbar" />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <PatientQueueHeader title={t('reception', 'Reception')} />

      <section className={styles.summarySection} aria-label={t('receptionMetrics', 'Reception metrics')}>
        <SummaryTile values={summaryValues} headerLabel={t('checkedInPatients', 'Checked in patients')} />
        <SummaryTile values={stats} headerLabel={t('currentlyServing', 'Currently being served')} />
      </section>

      <section className={styles.container} aria-label={t('receptionQueue', 'Reception queue')}>
        <div className={styles.headerContainer}>
          <div className={styles.headerTitleGroup}>
            <h4 className={styles.sectionTitle}>{t('receptionActions', 'Reception actions')}</h4>
            <p className={styles.sectionSubtitle}>
              {t('receptionActionsHelper', 'Check in patients or move them into the service queue.')}
            </p>
          </div>

          <div className={styles.headerButtons}>
            <QueueLauncher />
            <CheckInLauncher />
          </div>
        </div>

        <div className={styles.tableControls}>
          <div className={styles.tableTitleGroup}>
            <h4 className={styles.tableTitle}>{t('checkedInPatients', 'Checked in patients')}</h4>

            <p className={styles.tableSubtitle}>
              {t('patientsCount', '{{count}} patient(s)', {
                count: filteredPatientQueueEntries.length,
              })}
            </p>
          </div>

          <div className={styles.tableActions}>
            <Dropdown
              id="reception-status-filter"
              className={styles.filter}
              items={statusFilterOptions}
              itemToString={(item) => item?.text ?? ''}
              label={t('status', 'Status')}
              selectedItem={selectedStatus ?? statusFilterOptions[0]}
              size="sm"
              titleText=""
              onChange={handleStatusFilterChange}
            />

            <Dropdown
              id="reception-location-filter"
              className={styles.filter}
              items={locationFilterOptions}
              itemToString={(item) => item?.text ?? ''}
              label={t('location', 'Location')}
              selectedItem={selectedLocation ?? locationFilterOptions[0]}
              size="sm"
              titleText=""
              onChange={handleLocationFilterChange}
            />

            <Dropdown
              id="reception-wait-time-filter"
              className={styles.filter}
              items={WAIT_TIME_FILTERS}
              itemToString={(item) => item?.text ?? ''}
              label={t('waitTime', 'Wait time')}
              selectedItem={selectedWaitTime}
              size="sm"
              titleText=""
              onChange={handleWaitTimeFilterChange}
            />

            <TableToolbarSearch
              expanded
              className={styles.search}
              onChange={() => handleSearchInputChange}
              placeholder={t('searchThisList', 'Search this list')}
              size="sm"
              value={searchTerm}
            />
          </div>
        </div>

        <DataTable data-floating-menu-container headers={tableHeaders} rows={tableRows} useZebraStyles>
          {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getTableContainerProps }) => (
            <TableContainer className={styles.tableContainer} {...getTableContainerProps()}>
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
          onChange={handlePaginationChange}
        />
      </section>
    </main>
  );
};

export default ReceptionHome;
