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

type FilterOption = {
  id: string;
  text: string;
};

const REFRESH_WAIT_TIME_INTERVAL_MS = 60_000;
const ALL_FILTER_VALUE = 'all';
const UNASSIGNED_PROVIDER_VALUE = 'unassigned';

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

function normalizeSearchValue(value?: string) {
  return value?.trim().toLowerCase() ?? '';
}

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

function matchesSearchFilter(entry: PatientQueue, normalizedSearchTerm: string) {
  if (!normalizedSearchTerm) {
    return true;
  }

  const searchableValues = [
    entry.patient?.person?.display,
    entry.visitNumber,
    entry.provider?.display,
    entry.locationTo?.display,
    entry.status,
  ];

  return searchableValues.some((value) => normalizeSearchValue(value).includes(normalizedSearchTerm));
}

function matchesProviderFilter(entry: PatientQueue, selectedProvider: FilterOption | null) {
  if (!selectedProvider || selectedProvider.id === ALL_FILTER_VALUE) {
    return true;
  }

  if (selectedProvider.id === UNASSIGNED_PROVIDER_VALUE) {
    return !entry.provider?.uuid && !entry.provider?.identifier;
  }

  return entry.provider?.uuid === selectedProvider.id || entry.provider?.identifier === selectedProvider.id;
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

function sortTriageQueueEntries(a: PatientQueue, b: PatientQueue) {
  const aIsPicked = a.status === 'PICKED';
  const bIsPicked = b.status === 'PICKED';

  if (aIsPicked && !bIsPicked) {
    return -1;
  }

  if (!aIsPicked && bIsPicked) {
    return 1;
  }

  return new Date(a.dateCreated ?? 0).getTime() - new Date(b.dateCreated ?? 0).getTime();
}

const ActiveTriageVisitsTable: React.FC<ActiveVisitsTableProps> = ({ status }) => {
  const { t } = useTranslation();
  const session = useSession();
  const layout = useLayoutType();
  const { triageRoomTag } = useConfig<PatientQueueConfig>();

  const [tick, setTick] = useState(0);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<FilterOption | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<FilterOption | null>(null);
  const [selectedWaitTime, setSelectedWaitTime] = useState<FilterOption>(WAIT_TIME_FILTERS[0]);

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

  const normalizedSearchTerm = useMemo(() => {
    return normalizeSearchValue(searchTerm);
  }, [searchTerm]);

  const tableHeaders = useMemo(
    () => [
      { header: t('visitNumber', 'Visit Number'), key: 'visitNumber' },
      { header: t('name', 'Name'), key: 'name' },
      { header: t('provider', 'Provider'), key: 'provider' },
      { header: t('currentLocation', 'Current Location'), key: 'location' },
      { header: t('status', 'Status'), key: 'status' },
      { header: t('waitTime', 'Wait time'), key: 'waitTime' },
      { header: t('actions', 'Actions'), key: 'actions' },
    ],
    [t],
  );

  const visibleHeaders = useMemo(() => {
    return tableHeaders.filter((header) => showAllLocations || header.key !== 'provider');
  }, [showAllLocations, tableHeaders]);

  const providerFilterOptions = useMemo<FilterOption[]>(() => {
    const providers = new Map<string, string>();
    let hasUnassignedProvider = false;

    items.forEach((entry: PatientQueue) => {
      const providerId = entry.provider?.uuid ?? entry.provider?.identifier;
      const providerName = entry.provider?.display;

      if (providerId && providerName) {
        providers.set(providerId, providerName);
        return;
      }

      hasUnassignedProvider = true;
    });

    return [
      {
        id: ALL_FILTER_VALUE,
        text: t('allProviders', 'All providers'),
      },
      ...(hasUnassignedProvider
        ? [
            {
              id: UNASSIGNED_PROVIDER_VALUE,
              text: t('unassigned', 'Unassigned'),
            },
          ]
        : []),
      ...Array.from(providers.entries()).map(([id, text]) => ({
        id,
        text,
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
        return (
          matchesSearchFilter(entry, normalizedSearchTerm) &&
          matchesProviderFilter(entry, selectedProvider) &&
          matchesLocationFilter(entry, selectedLocation) &&
          matchesWaitTimeFilter(entry, selectedWaitTime)
        );
      })
      .sort(sortTriageQueueEntries);
  }, [items, normalizedSearchTerm, selectedLocation, selectedProvider, selectedWaitTime, status, triageRoomTag]);

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

  const handleToggleChange = useCallback(
    (checked: boolean) => {
      setShowAllLocations(checked);
      setCurrentPage(1);
    },
    [setCurrentPage],
  );

  const handleSearchInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setCurrentPage(1);
    },
    [setCurrentPage],
  );

  const handleProviderFilterChange = useCallback(
    ({ selectedItem }: { selectedItem: FilterOption | null }) => {
      setSelectedProvider(selectedItem);
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
          {showAllLocations ? (
            <Dropdown
              id={`triage-provider-filter-${status}`}
              className={styles.filter}
              items={providerFilterOptions}
              itemToString={(item) => item?.text ?? ''}
              label={t('provider', 'Provider')}
              selectedItem={selectedProvider ?? providerFilterOptions[0]}
              size="sm"
              titleText=""
              onChange={handleProviderFilterChange}
            />
          ) : null}

          <Dropdown
            id={`triage-location-filter-${status}`}
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
            id={`triage-wait-time-filter-${status}`}
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
    </div>
  );
};

export default ActiveTriageVisitsTable;
