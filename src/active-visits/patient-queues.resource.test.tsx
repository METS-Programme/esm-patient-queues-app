import { act, renderHook } from '@testing-library/react';
import useSWR from 'swr';
import { usePatientQueuePages } from './patient-queues.resource';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedUseSWR = jest.mocked(useSWR);

describe('usePatientQueuePages', () => {
  beforeEach(() => {
    mockedUseSWR.mockReturnValue({
      data: {
        data: {
          results: [{ uuid: 'queue-11' }, { uuid: 'queue-12' }],
          totalCount: 12,
        },
      },
      error: undefined,
      isLoading: false,
    } as ReturnType<typeof useSWR>);
  });

  it('keeps server-paginated results intact when navigating to another page', () => {
    const { result } = renderHook(() => usePatientQueuePages('room-uuid', 'pending'));

    act(() => result.current.setCurrentPage(2));

    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalCount).toBe(12);
    expect(mockedUseSWR).toHaveBeenLastCalledWith(
      expect.stringContaining('startIndex=10'),
      expect.any(Function),
    );
  });

  it('debounces search and resets the current page', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => usePatientQueuePages('room-uuid', 'pending'));

    act(() => result.current.setCurrentPage(2));
    act(() => result.current.setSearchString('Jane Doe'));
    act(() => jest.advanceTimersByTime(300));

    expect(result.current.currentPage).toBe(1);
    expect(mockedUseSWR).toHaveBeenLastCalledWith(
      expect.stringContaining('q=Jane%20Doe'),
      expect.any(Function),
    );
    jest.useRealTimers();
  });
});
