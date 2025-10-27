import React from 'react';
import { Typography } from '../bfg-ui/components/Typography';
import { Chip } from '../bfg-ui/components/Chip';
import { DbGameTableAction } from '~/models/game-table/game-table-action';

interface ActionTypeChipProps {
  actionType: DbGameTableAction['actionType'];
}

export const ActionTypeChip = ({ actionType }: ActionTypeChipProps) => {
  const getChipColor = (type: string) => {
    if (type.includes('host')) return 'primary';
    if (type.includes('player')) return 'secondary';
    return 'default';
  };

  const getDisplayText = (type: string) => {
    // Convert kebab-case to readable text
    return type
      .replace(/^game-table-action-/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Chip 
      label={getDisplayText(actionType)} 
      color={getChipColor(actionType)}
      size="small"
    />
  );
};

interface SourceChipProps {
  source: DbGameTableAction['source'];
}

export const SourceChip = ({ source }: SourceChipProps) => {
  const getChipColor = (src: string) => {
    if (src === 'game-table-action-source-host') return 'primary';
    if (src.includes('player')) return 'secondary';
    return 'default';
  };

  const getDisplayText = (src: string) => {
    if (src === 'game-table-action-source-host') return 'Host';
    if (src.includes('player')) {
      const playerMatch = src.match(/player-p(\d+)/);
      return playerMatch ? `Player ${playerMatch[1]}` : 'Player';
    }
    return src;
  };

  return (
    <Chip 
      label={getDisplayText(source)} 
      color={getChipColor(source)}
      size="small"
    />
  );
};

interface TimestampDisplayProps {
  timestamp: number;
}

export const TimestampDisplay = ({ timestamp }: TimestampDisplayProps) => {
  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleString();
  };

  return (
    <Typography variant="caption" color="secondary">
      {formatTimestamp(timestamp)}
    </Typography>
  );
};
