import { getWaitTimeInMinutes } from './functions';

describe('getWaitTimeInMinutes', () => {
  it('uses the supplied clock value for active queues', () => {
    expect(
      getWaitTimeInMinutes(
        {
          status: 'PENDING',
          dateCreated: '2026-07-30T08:00:00.000Z',
        },
        new Date('2026-07-30T08:45:00.000Z'),
      ),
    ).toBe(45);
  });

  it('uses the completion timestamp for completed queues', () => {
    expect(
      getWaitTimeInMinutes({
        status: 'COMPLETED',
        dateCreated: '2026-07-30T08:00:00.000Z',
        dateChanged: '2026-07-30T09:15:00.000Z',
      }),
    ).toBe(75);
  });
});
