import React, { useEffect, useId } from 'react';
import { Button, Header } from '@carbon/react';
import { ArrowLeft, Close } from '@carbon/react/icons';
import { isDesktop, useLayoutType } from '@openmrs/esm-framework';

import styles from './overlay.scss';

interface OverlayProps {
  closePanel: () => void;
  header: string;
  children?: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({ closePanel, children, header }) => {
  const layout = useLayoutType();
  const isDesktopLayout = isDesktop(layout);
  const titleId = useId();

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [closePanel]);

  return (
    <aside
      className={isDesktopLayout ? styles.desktopOverlay : styles.tabletOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {isDesktopLayout ? (
        <div className={styles.desktopHeader}>
          <h2 id={titleId} className={styles.headerContent}>
            {header}
          </h2>

          <Button
            className={styles.closePanelButton}
            onClick={closePanel}
            kind="ghost"
            hasIconOnly
            renderIcon={Close}
            iconDescription="Close overlay"
          />
        </div>
      ) : (
        <Header aria-label="Tablet overlay" className={styles.tabletOverlayHeader}>
          <Button
            onClick={closePanel}
            kind="ghost"
            hasIconOnly
            renderIcon={ArrowLeft}
            iconDescription="Close overlay"
          />

          <h2 id={titleId} className={styles.headerContent}>
            {header}
          </h2>
        </Header>
      )}

      <div className={styles.overlayContent}>{children}</div>
    </aside>
  );
};

export default Overlay;
