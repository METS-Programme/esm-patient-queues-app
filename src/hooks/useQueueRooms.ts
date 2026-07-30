import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWR from 'swr';
import { type QueueLocation } from '../types/location';

export type QueueRoomsResponse = QueueLocation;

export function useQueueRoomLocations(currentQueueLocation?: string) {
  const apiUrl = currentQueueLocation
    ? `${restBaseUrl}/location/${currentQueueLocation}?v=custom:(uuid,display,parentLocation:(uuid,display,childLocations:(uuid,display)))`
    : null;
  const { data, error, isLoading, mutate } = useSWR<{ data: QueueRoomsResponse }>(apiUrl, openmrsFetch, {
    dedupingInterval: 60_000,
    errorRetryCount: 3,
  });

  const queueRoomLocations = useMemo(
    () => data?.data?.parentLocation?.childLocations ?? [],
    [data?.data?.parentLocation?.childLocations],
  );
  return {
    queueRoomLocations: queueRoomLocations.filter((location) => Boolean(location?.uuid)),
    isLoading,
    error,
    mutate,
  };
}
