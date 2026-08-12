import React from 'react';
import { Group, InProgress, CheckmarkOutline } from '@carbon/react/icons';
import { restBaseUrl } from '@openmrs/esm-framework';
import debounce from 'lodash-es/debounce';
import { mutate } from 'swr';

interface FieldError {
  message?: string;
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
  status?: 'pending' | 'picked' | 'completed' | string;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getErrorObject(error: unknown): ErrorObject {
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  if (!isRecord(error)) {
    return {
      message: String(error),
    };
  }

  const message = typeof error.message === 'string' ? error.message : undefined;

  const responseBody = isRecord(error.responseBody) ? (error.responseBody as ResponseBody) : undefined;

  return {
    message,
    responseBody,
  };
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

export function extractErrorMessagesFromResponse(error: unknown): string[] {
  const errorObject = getErrorObject(error);

  const fieldErrors = errorObject.responseBody?.error?.fieldErrors;

  if (fieldErrors) {
    const messages = Object.values(fieldErrors)
      .flatMap((errors) => errors.map((fieldError) => fieldError.message))
      .filter((message): message is string => Boolean(message));

    if (messages.length > 0) {
      return messages;
    }
  }

  const message = errorObject.responseBody?.error?.message ?? errorObject.message;

  return message ? [message] : [];
}

function StatusIcon({ status }: StatusIconProps): JSX.Element | null {
  switch (status?.toLowerCase()) {
    case QueueStatus.Pending:
      return <InProgress size={16} />;

    case QueueStatus.Picked:
      return <Group size={16} />;

    case QueueStatus.Completed:
      return <CheckmarkOutline size={16} />;

    default:
      return null;
  }
}

export default StatusIcon;
