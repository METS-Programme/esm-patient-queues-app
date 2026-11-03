import { isResultsReadyQueue } from './patient-queues.resource';

describe('isResultsReadyQueue', () => {
  it('recognizes a pending queue marked as having results', () => {
    expect(isResultsReadyQueue({ status: 'PENDING', comment: 'has results' } as any)).toBe(true);
  });

  it('normalizes the backend status and marker', () => {
    expect(isResultsReadyQueue({ status: 'pending', comment: '  HAS RESULTS  ' } as any)).toBe(true);
  });

  it('does not include completed or ordinary pending queues', () => {
    expect(isResultsReadyQueue({ status: 'COMPLETED', comment: 'has results' } as any)).toBe(false);
    expect(isResultsReadyQueue({ status: 'PENDING', comment: 'routine queue' } as any)).toBe(false);
  });
});
