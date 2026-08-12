import React, { useEffect, useRef } from 'react';
import { ActionableNotification, Button, Column, Grid } from '@carbon/react';
import { FitToScreen, ShrinkScreen } from '@carbon/react/icons';
import styles from './queue-board.scss';
import BaseBoardComponent from './base-board/base-board.component';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { usePatientQueueBoard } from './queue-board.resource';
import { BoardSkeleton } from './board-skeleton.component';
import { getPatientQueueWaitingList, updatePatientQueueWaitingList } from '../../helpers/helpers';
import { readTickets } from './voice.utils';
import { useTranslation } from 'react-i18next';

const QueueBoardComponent: React.FC = () => {
  const { t } = useTranslation();
  const handle = useFullScreenHandle();
  const { isError, isLoading, pending, picked, refresh } = usePatientQueueBoard();
  const announcedTicketIds = useRef(new Set<string>());

  useEffect(() => {
    const waitingListIds = new Set(getPatientQueueWaitingList().getState().queue.map((entry) => entry.uuid));
    const newlyPicked = picked.filter(
      (queue) => waitingListIds.has(queue.uuid) && !announcedTicketIds.current.has(queue.uuid),
    );

    newlyPicked.forEach((queue) => announcedTicketIds.current.add(queue.uuid));
    updatePatientQueueWaitingList(pending);
    void readTickets(newlyPicked);

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [pending, picked]);

  if (isLoading) {
    return (
      <Grid>
        <Column sm={8} md={8} lg={8}>
          <BoardSkeleton tiles={5} />
        </Column>
        <Column sm={8} md={8} lg={8}>
          <BoardSkeleton tiles={1} />
        </Column>
      </Grid>
    );
  }

  if (isError) {
    return (
      <ActionableNotification
        kind="error"
        title={t('queueBoardLoadError', 'Unable to load the queue board')}
        subtitle={t('checkConnectionAndRetry', 'Check the connection and try again.')}
        actionButtonLabel={t('retry', 'Retry')}
        onActionButtonClick={() => void refresh()}
      />
    );
  }

  return (
    <FullScreen handle={handle}>
      <div className={`${styles.boardBody} ${styles.expandContractButton}`}>
        <Button
          renderIcon={(props) =>
            handle.active ? <ShrinkScreen size={32} {...props} /> : <FitToScreen size={32} {...props} />
          }
          hasIconOnly
          kind={'ghost'}
          onClick={handle.active ? handle.exit : handle.enter}
          iconDescription={
            handle.active ? t('exitFullScreen', 'Exit full screen') : t('enterFullScreen', 'Enter full screen')
          }
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        />
        <Grid>
          <Column sm={8} md={8} lg={8}>
            <BaseBoardComponent
              title={t('waiting', 'Waiting')}
              data={pending}
              hasBorder={true}
              isFullScreen={handle.active}
            />
          </Column>
          <Column sm={8} md={8} lg={8}>
            <BaseBoardComponent title={t('serving', 'Serving')} data={picked} isFullScreen={handle.active} />
          </Column>
        </Grid>
      </div>
    </FullScreen>
  );
};

export default QueueBoardComponent;
