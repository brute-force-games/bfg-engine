import { useState } from 'react';
import { Table, TableColumn } from '../bfg-ui/components/Table';
import { Card } from '../bfg-ui/components/Card';
import { Typography } from '../bfg-ui/components/Typography';
import { Checkbox } from '../bfg-ui/components/Checkbox';
import { ActionTypeChip, SourceChip } from './game-action-formatters';
import { BfgGameEngineMetadata } from '@bfg-engine/game-metadata/metadata-types';
import type { GameTableEventWithTransition } from '../../models/game-table/game-table-event';


interface IGameActionHistoryComponentProps {
  gameMetadata: BfgGameEngineMetadata;
  gameActions: GameTableEventWithTransition[];
}

export const GameActionHistoryComponent = ({ gameMetadata, gameActions }: IGameActionHistoryComponentProps) => {
  const [showActionDetailsColumn, setShowActionDetailsColumn] = useState(false);

  const gameProcessor = gameMetadata.gameProcessor;
  const summarizeGameEvent = gameProcessor.summarizeGameEvent;

  const coreColumns: TableColumn<GameTableEventWithTransition>[] = [
    {
      key: 'createdAt',
      label: 'Timestamp',
      sortable: true,
      width: '120px',
      render: (timestamp) => {
        const date = new Date(timestamp);
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" color="secondary" style={{ fontWeight: 'bold' }}>
              {dateStr}
            </Typography>
            <Typography variant="caption" color="secondary">
              {timeStr}
            </Typography>
          </div>
        );
      }
    },
    {
      key: 'source',
      label: 'Source',
      sortable: true,
      width: '100px',
      render: (source) => <SourceChip source={source} />
    },
    {
      key: 'actionType',
      label: 'Action Type',
      sortable: true,
      width: '150px',
      render: (actionType) => <ActionTypeChip actionType={actionType} />
    }
  ];

  const actionSummaryColumn: TableColumn<GameTableEventWithTransition> = {
    key: 'actionStr',
    label: 'Action Summary',
    sortable: false,
    width: '250px',
    render: (actionStr, row) => {
      console.log("ACTION STR", actionStr);
      if (!actionStr) {
        return null;
      }

      const summary = summarizeGameEvent(row);

      return (
        <Typography
          variant="body2"
          style={{
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            maxWidth: '250px'
          }}
        >
          {summary}
        </Typography>
      )
    }
  };

  const actionDetailsColumn: TableColumn<GameTableEventWithTransition> = {
    key: 'actionStr',
    label: 'Action Details',
    sortable: false,
    width: '250px',
    render: (actionStr) => {
      console.log("ACTION STR", actionStr);
      
      return (
        <Typography
          variant="body2"
          style={{
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            maxWidth: '250px'
          }}
        >
          {actionStr}
        </Typography>
      );
    }
  };

  const columns = showActionDetailsColumn
    ? [...coreColumns, actionDetailsColumn]
    : [...coreColumns, actionSummaryColumn];

  return (
    <Card>
      <div style={{ padding: '16px' }}>
        {/* <Typography variant="h6" gutterBottom>
          Game Action History
        </Typography> */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <Typography variant="body2" color="secondary">
            {gameActions.length} action{gameActions.length !== 1 ? 's' : ''} recorded
          </Typography>
          <Checkbox
            label="Show action details"
            checked={showActionDetailsColumn}
            onChange={(e) => setShowActionDetailsColumn(e.target.checked)}
          />
        </div>
        <Table
          columns={columns}
          data={gameActions}
          defaultSort={{ column: 'createdAt', direction: 'desc' }}
          emptyMessage="No game actions recorded yet"
        />
      </div>
    </Card>
  );
};