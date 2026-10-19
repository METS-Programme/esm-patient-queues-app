import { SelectItem, SelectItemGroup } from '@carbon/react';
import React from 'react';
import { type QueueRoomOption } from '../hooks/useQueueRooms';

/**
 * Renders queue room options in a native select: tagged locations as plain
 * selectable items, top-level non-selectable organizers as optgroups around
 * their descendants. A native select cannot nest optgroups and collapses
 * regular spaces, so levels below the organizer are indented with
 * non-breaking spaces, and untagged locations in between are rendered
 * disabled (greyed out).
 */
const NBSP = ' ';

const indentedLabel = (option: QueueRoomOption) => NBSP.repeat(option.depth * 2) + option.display;

export const QueueRoomSelectOptions: React.FC<{ options: QueueRoomOption[] }> = ({ options }) => {
  // options arrive depth-first, so each depth-0 entry starts a new chunk
  const chunks: QueueRoomOption[][] = [];
  options.forEach((option) => {
    if (option.depth === 0 || chunks.length === 0) {
      chunks.push([option]);
    } else {
      chunks[chunks.length - 1].push(option);
    }
  });

  return (
    <>
      {chunks.map((chunk) =>
        chunk[0].selectable ? (
          chunk.map((option) => (
            <SelectItem
              key={option.uuid}
              value={option.uuid}
              text={indentedLabel(option)}
              disabled={!option.selectable}
            />
          ))
        ) : (
          <SelectItemGroup key={chunk[0].uuid} label={chunk[0].display}>
            {chunk.slice(1).map((option) => (
              <SelectItem
                key={option.uuid}
                value={option.uuid}
                text={indentedLabel(option)}
                disabled={!option.selectable}
              />
            ))}
          </SelectItemGroup>
        ),
      )}
    </>
  );
};
