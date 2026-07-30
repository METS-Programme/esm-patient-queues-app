import React from 'react';
import styles from './base-board.scss';
import { TicketCard } from './ticket-card.component';
import { type PatientQueue } from '../../../types/patient-queues';

interface BaseBoardProps {
  title: string;
  data: PatientQueue[];
  hasBorder?: boolean;
  isFullScreen: boolean;
}

const BaseBoardComponent: React.FC<BaseBoardProps> = ({ title, data, hasBorder, isFullScreen }) => {
  return (
    <div
      style={{
        borderRight: hasBorder ? '1px solid grey' : '',
        height: isFullScreen ? '100vh' : 'calc(100vh - 50px)',
        overflow: 'scroll',
        paddingRight: hasBorder ? '20px' : '',
      }}
    >
      <h1 className={styles.heading}>{title}</h1>
      <div className={styles.gridFlow}>
        {[...data]
          .sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime())
          .map((queueEntry) => {
            return <TicketCard key={queueEntry.uuid} queue={queueEntry} />;
          })}
      </div>
    </div>
  );
};

export default BaseBoardComponent;
