import React from 'react';
import styles from './queue-summary-tiles.scss';
import {
  type AssignedExtension,
  ComponentContext,
  Extension,
  useConnectedExtensions,
} from '@openmrs/esm-framework';

const QueueSummaryTiles: React.FC = () => {
  const queueTileSlot = 'queue-tiles-slot';

  const tilesExtensions = useConnectedExtensions(queueTileSlot) as AssignedExtension[];

  return (
    <div className={styles.cardContainer}>
      {tilesExtensions
        .filter((extension) => Object.keys(extension).length > 0)
        .map((extension) => {
          return (
            <ComponentContext.Provider
              key={extension.id}
              value={{
                featureName: 'QueueTiles',
                moduleName: extension.moduleName,
                extension: {
                  extensionId: extension.id,
                  extensionSlotName: queueTileSlot,
                  extensionSlotModuleName: extension.moduleName,
                },
              }}
            >
              <Extension />
            </ComponentContext.Provider>
          );
        })}
    </div>
  );
};

export default QueueSummaryTiles;
