import dayjs from 'dayjs';
import { type TFunction } from 'react-i18next';

export const buildStatusString = (status: string) => {
  if (!status) {
    return '';
  }
  if (status === 'pending') {
    return `${status}`;
  } else if (status === 'picked') {
    return `Attending`;
  } else if (status === 'completed') {
    return `Finished`;
  }
};

export const trimVisitNumber = (visitNumber: string) => {
  if (!visitNumber) {
    return '';
  }
  return visitNumber.substring(15);
};

export const formatWaitTime = (minutes: number | null, t: TFunction) => {
  if (minutes === null || isNaN(minutes)) return t('unknown', 'Unknown');

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours} ${t('hoursAnd', 'hours and')} ${remainingMinutes} ${t('minutes', 'minutes')}`;
  } else {
    return `${remainingMinutes} ${t('minutes', 'minutes')}`;
  }
};

export const getTagColor = (waitTime: string) => {
  const num = parseInt(waitTime);
  if (num <= 30) {
    return 'green';
  } else if (num > 30 && num <= 45) {
    return 'orange';
  } else {
    return 'red';
  }
};

export const getProviderTagColor = (entryProvider?: string, loggedInProviderName?: string) => {
  if (entryProvider === loggedInProviderName) {
    return '#07a862';
  } else {
    return '#942509';
  }
};

export type amPm = 'AM' | 'PM';

export const convertTime12to24 = (time12h: string, timeFormat: amPm) => {
  let [hours] = time12h.split(':');

  if (hours === '12' && timeFormat === 'AM') {
    hours = '00';
  }

  if (timeFormat === 'PM') {
    hours = hours === '12' ? hours : String(parseInt(hours, 10) + 12);
  }

  return [hours];
};

interface QueueTiming {
  status: string;
  dateCreated?: string;
  dateChanged?: string;
}

export const getWaitTimeInMinutes = (queue: QueueTiming | null | undefined, now: number | Date = Date.now()) => {
  if (!queue) return null;

  if (queue.status === 'COMPLETED') {
    if (queue.dateCreated && queue.dateChanged) {
      return dayjs(queue.dateChanged).diff(dayjs(queue.dateCreated), 'minutes');
    }
  } else if (queue.dateCreated) {
    return dayjs(now).diff(dayjs(queue.dateCreated), 'minutes');
  }

  return null;
};
