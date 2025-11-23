import { Typography } from '../bfg-ui/components/Typography';
import { Chip } from '../bfg-ui/components/Chip';
import type { GameTableActionSource } from '../../models/game-table/game-table-event';
// import { DbGameTableAction } from '../../models/game-table/game-table-event';


interface ActionTypeChipProps {
  actionType: GameTableActionSource;
}

export const ActionTypeChip = ({ actionType }: ActionTypeChipProps) => {
  const getChipColor = () => {
    if (actionType.includes('host')) return 'primary';
    if (actionType.includes('player')) return 'secondary';
    return 'default';
  };

  const getDisplayText = () => {
    // if (!type) {
    //   return 'Unknown';
    // }
    // Convert kebab-case to readable text
    return actionType
      .replace(/^game-table-action-/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // if (!actionType) {
  //   return <Chip label="Unknown" color="default" size="small" />;
  // }

  return (
    <Chip 
      label={getDisplayText()} 
      color={getChipColor()}
      size="small"
    />
  );
};


interface SourceChipProps {
  source: GameTableActionSource;
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
