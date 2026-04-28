import { Group, InProgress } from '@carbon/react/icons';
import React from 'react';
import { restBaseUrl } from '@openmrs/esm-framework';
import debounce from 'lodash-es/debounce';
import { mutate } from 'swr';

interface FieldError {
  message: string;
  [key: string]: unknown;
}

interface ErrorResponse {
  message?: string;
  fieldErrors?: Record<string, FieldError[]>;
}

interface ResponseBody {
  error?: ErrorResponse;
}

export interface ErrorObject {
  message?: string;
  responseBody?: ResponseBody;
}

export interface StatusIconProps {
  status: 'pending' | 'picked' | 'completed';
}

export interface QueueStatusOptions {
  Completed: 'completed';
  Pending: 'pending';
  Picked: 'picked';
}

export const QueueStatus: QueueStatusOptions = {
  Completed: 'completed',
  Pending: 'pending',
  Picked: 'picked',
};

export enum QueueEnumStatus {
  COMPLETED = 'COMPLETED',
  PICKED = 'PICKED',
  PENDING = 'PENDING',
}

const refreshDashboardMetrics = debounce(
  () =>
    mutate((key) => typeof key === 'string' && key.startsWith(`${restBaseUrl}/patientqueue`), undefined, {
      revalidate: true,
    }),
  300,
);

export const handleMutate = (url: string): void => {
  mutate((key) => typeof key === 'string' && key.startsWith(url), undefined, {
    revalidate: true,
  });
  refreshDashboardMetrics();
};

export function extractErrorMessagesFromResponse(errorObject: ErrorObject): string[] {
  const fieldErrors = errorObject?.responseBody?.error?.fieldErrors;
  if (!fieldErrors) {
    const message = errorObject?.responseBody?.error?.message ?? errorObject?.message;
    return message ? [message] : [];
  }
  return Object.values(fieldErrors).flatMap((errors: FieldError[]) => errors.map((error) => error.message));
}

function StatusIcon({ status }: StatusIconProps): JSX.Element | null {
  switch (status) {
    case 'pending':
      return <InProgress size={16} />;
    case 'picked':
      return <Group size={16} />;
    case 'completed':
      return <Group size={16} />;
    default:
      return null;
  }
}

export default StatusIcon;
