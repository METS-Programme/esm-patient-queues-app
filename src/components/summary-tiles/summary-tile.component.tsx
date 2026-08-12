import React from 'react';
import { Layer, Tile } from '@carbon/react';

import styles from './summary-tile.scss';

export type SummaryStatusColor = 'orange' | 'green' | 'blue' | 'red' | 'gray';

export interface SummaryStatus {
  label: string;
  value: number | string;
  color?: SummaryStatusColor;
}

export interface SummaryTileValue {
  label: string;
  value: number | string;
  status?: SummaryStatus[];
}

interface SummaryTileProps {
  values?: SummaryTileValue[];
  headerLabel: string;
  emptyText?: string;
  className?: string;
}

const statusColorClassMap: Record<SummaryStatusColor, string> = {
  orange: styles.statusOrange,
  green: styles.statusGreen,
  blue: styles.statusBlue,
  red: styles.statusRed,
  gray: styles.statusGray,
};

function getStatusColorClass(color?: SummaryStatusColor) {
  if (!color) {
    return styles.statusBlue;
  }

  return statusColorClassMap[color] ?? styles.statusBlue;
}

export const SummaryTile: React.FC<SummaryTileProps> = ({
  values = [],
  headerLabel,
  emptyText = 'No summary data available',
  className,
}) => {
  const hasValues = values.length > 0;

  return (
    <Layer className={`${styles.container} ${className ?? ''}`}>
      <Tile className={styles.tileContainer}>
        <div className={styles.tileHeader}>
          <div className={styles.headerLabelContainer}>
            <h3 className={styles.headerLabel}>{headerLabel}</h3>
          </div>
        </div>

        {!hasValues ? (
          <p className={styles.emptyText}>{emptyText}</p>
        ) : (
          <div className={styles.valueContainer}>
            {values.map((item) => (
              <div key={item.label} className={styles.valueInnerContainer}>
                <div className={styles.valueSummary}>
                  <p className={styles.totalsLabel}>{item.label}</p>
                  <p className={styles.totalsValue}>{item.value}</p>
                </div>

                {item.status && item.status.length > 0 && (
                  <div className={styles.valueStatus}>
                    {item.status.map((status) => (
                      <div key={`${item.label}-${status.label}`} className={styles.status}>
                        <span className={styles.statusValue}>{status.value}</span>

                        <span className={`${styles.statusLabel} ${getStatusColorClass(status.color)}`}>
                          {status.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Tile>
    </Layer>
  );
};

export default SummaryTile;
