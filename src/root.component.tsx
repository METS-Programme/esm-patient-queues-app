import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SWRConfig } from 'swr';

import QueueBoardComponent from './components/queue-board/queue-board.component';
import TriageHome from './pages/queue-triage-home.component';
import ReceptionHome from './pages/queue-reception-home.component';
import ClinicalRoomHome from './pages/queue-clinical-home.component';

import styles from './root.scss';

const swrConfiguration = {
  errorRetryCount: 3,
};

const Root: React.FC = () => {
  return (
    <SWRConfig value={swrConfiguration}>
      <BrowserRouter basename={`${window.getOpenmrsSpaBase()}home`}>
        <main className={styles.container}>
          <Routes>
            <Route path="/" element={<Navigate to="/reception" replace />} />
            <Route path="/triage" element={<TriageHome />} />
            <Route path="/reception" element={<ReceptionHome />} />
            <Route path="/clinical-room" element={<ClinicalRoomHome />} />
            <Route path="/screen" element={<QueueBoardComponent />} />
          </Routes>
        </main>
      </BrowserRouter>
    </SWRConfig>
  );
};

export default Root;
