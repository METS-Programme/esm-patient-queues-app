import { openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWR from 'swr';
import { type PatientQueueConfig } from '../config-schema';

export interface QueueRoomsResponse {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: string;
  address2: string;
  cityvillage: string;
  stateprovince: string;
  country: string;
  postalcode: string;
  latitude: string;
  longitude: string;
  countydistrict: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  tags: Tags[];
  parentLocation: ParentLocation;
  childLocations: string[];
  retired: boolean;
  auditinfo: Auditinfo;
  attributes: string[];
  address7: string;
  address8: string;
  address9: string;
  address10: string;
  address11: string;
  address12: string;
  address13: string;
  address14: string;
  address15: string;
  links: Links[];
  resourceVersion: string;
}

export interface Auditinfo {
  creator: Creator;
  dateCreated: string;
  changedby: Changedby;
  dateChanged: string;
}

export interface Changedby {
  uuid: string;
  display: string;
  links: Links[];
}

export interface Creator {
  uuid: string;
  display: string;
  links: Links[];
}

export interface ParentLocation {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: string;
  address2: string;
  cityVillage: string;
  stateProvince: string;
  country: string;
  postalcode: string;
  latitude: string;
  longitude: string;
  countydistrict: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  tags: Tags[];
  parentLocation: ParentLocation;
  childLocations: ChildLocations[];
  retired: boolean;
  attributes: string[];
  address7: string;
  address8: string;
  address9: string;
  address10: string;
  address11: string;
  address12: string;
  address13: string;
  address14: string;
  address15: string;
  links: Links[];
  resourceversion: string;
}

export interface ChildLocations {
  uuid: string;
  display: string;
  links: Links[];
}

export interface ParentLocation {
  uuid: string;
  display: string;
  links: Links[];
}

export interface Tags {
  uuid: string;
  display: string;
  links: Links[];
}

export interface Tags {
  uuid: string;
  display: string;
  name: string;
  description: string;
  retired: boolean;
  links: Links[];
  resourceversion: string;
}

export interface Links {
  rel: string;
  uri: string;
  resourcealias: string;
}

interface QueueRoomLocationNode {
  uuid: string;
  display: string;
  retired: boolean;
  tags: Array<{
    uuid: string;
    display: string;
  }>;
  childLocations?: QueueRoomLocationNode[];
}

export interface QueueRoomOption {
  uuid: string;
  display: string;
  /** false when the item is only an organizer for selectable descendants */
  selectable: boolean;
  /** nesting level, used for indenting organizers under their parents */
  depth: number;
}

/** number of childLocations levels nested in the custom rep beyond the first */
const CHILD_LOCATION_LEVELS = 2;

const childLocationsRep = (level: number): string =>
  level <= 0
    ? 'childLocations:(uuid,display,retired,tags:(uuid,display))'
    : `childLocations:(uuid,display,retired,tags:(uuid,display),${childLocationsRep(level - 1)})`;

const isQueueRoom = (location: QueueRoomLocationNode, queueRoomTag: string) =>
  location.tags?.some(
    (tag) => tag?.uuid === queueRoomTag || tag?.display?.toLowerCase() === queueRoomTag?.toLowerCase(),
  ) ?? false;

/** returns the node as an option followed by its selectable descendants, or null when the subtree has none */
function collectQueueRoomOptions(
  node: QueueRoomLocationNode,
  queueRoomTag: string,
  depth: number,
): QueueRoomOption[] | null {
  if (node.retired) {
    return null;
  }
  const childOptions = (node.childLocations ?? [])
    .map((child) => collectQueueRoomOptions(child, queueRoomTag, depth + 1))
    .filter((options): options is QueueRoomOption[] => options != null)
    .flat();
  if (isQueueRoom(node, queueRoomTag) || childOptions.length > 0) {
    return [{ uuid: node.uuid, display: node.display, selectable: isQueueRoom(node, queueRoomTag), depth }, ...childOptions];
  }
  return null;
}

/**
 * Session location representation shared by every consumer of the session
 * location: a single fetch warms the SWR cache for all of them (queue rooms,
 * page header, metrics). One URL = one SWR key = one request.
 */
export const getSessionLocationApiUrl = (sessionLocationUuid: string) =>
  sessionLocationUuid
    ? `${restBaseUrl}/location/${sessionLocationUuid}?v=custom:(uuid,display,parentLocation:(uuid,display,${childLocationsRep(
        CHILD_LOCATION_LEVELS,
      )}),${childLocationsRep(CHILD_LOCATION_LEVELS)})`
    : null;

/** locations barely change during a session; skip focus revalidation and dedupe repeat calls */
const locationSwrConfig = { revalidateOnFocus: false, dedupingInterval: 60_000 } as const;

export function useQueueRoomLocations(currentQueueLocation: string) {
  const { queueRoomTag } = useConfig<PatientQueueConfig>();
  const apiUrl = getSessionLocationApiUrl(currentQueueLocation);
  const { data, error, isLoading, mutate } = useSWR<{
    data: { parentLocation?: QueueRoomLocationNode; childLocations?: QueueRoomLocationNode[] };
  }>(apiUrl, openmrsFetch, locationSwrConfig);

  const queueRoomLocations = useMemo(() => {
    // sibling service points live under the session location's parent; when the
    // session location is the facility root itself, its own children are used
    const siblingLocations = data?.data?.parentLocation?.childLocations ?? data?.data?.childLocations ?? [];
    return siblingLocations
      .map((location) => collectQueueRoomOptions(location, queueRoomTag, 0))
      .filter((options): options is QueueRoomOption[] => options != null)
      .flat();
  }, [data?.data?.parentLocation?.childLocations, data?.data?.childLocations, queueRoomTag]);
  return {
    queueRoomLocations,
    isLoading,
    error,
    mutate,
  };
}
