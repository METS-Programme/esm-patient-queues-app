import React, { useMemo } from 'react';
import { Extension, type AssignedExtension, useConnectedExtensions } from '@openmrs/esm-framework';
import { ComponentContext } from '@openmrs/esm-framework/src/internal';

import styles from './queue-summary-tiles.scss';

const QUEUE_TILE_SLOT = 'queue-tiles-slot';

const QueueSummaryTiles: React.FC = () => {
  const tileExtensions = useConnectedExtensions(QUEUE_TILE_SLOT) as AssignedExtension[];

  const validExtensions = useMemo(() => tileExtensions.filter((extension) => extension?.id), [tileExtensions]);

  if (!validExtensions.length) {
    return null;
  }

  return (
    <section className={styles.cardContainer} aria-label="Queue summary tiles">
      {validExtensions.map((extension) => (
        <div key={extension.id} className={styles.tileWrapper}>
          <ComponentContext.Provider
            value={{
              featureName: 'QueueTiles',
              moduleName: extension.moduleName,
              extension: {
                extensionId: extension.id,
                extensionSlotName: QUEUE_TILE_SLOT,
                extensionSlotModuleName: extension.moduleName,
              },
            }}
          >
            <Extension />
          </ComponentContext.Provider>
        </div>
      ))}
    </section>
  );
};

export default QueueSummaryTiles;
