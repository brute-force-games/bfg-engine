import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { Table, TableColumn } from '../bfg-ui/components/Table';
import { Card } from '../bfg-ui/components/Card';
import { Typography } from '../bfg-ui/components/Typography';
import { ActionTypeChip, SourceChip, TimestampDisplay } from './game-action-formatters';


interface IGameActionHistoryComponentProps {
  gameActions: DbGameTableAction[];
}

export const GameActionHistoryComponent = ({ gameActions }: IGameActionHistoryComponentProps) => {
  const columns: TableColumn<DbGameTableAction>[] = [
    {
      key: 'createdAt',
      label: 'Timestamp',
      sortable: true,
      width: '180px',
      render: (timestamp) => <TimestampDisplay timestamp={timestamp} />
    },
    {
      key: 'source',
      label: 'Source',
      sortable: true,
      width: '120px',
      render: (source) => <SourceChip source={source} />
    },
    {
      key: 'actionType',
      label: 'Action Type',
      sortable: true,
      width: '200px',
      render: (actionType) => <ActionTypeChip actionType={actionType} />
    },
    {
      key: 'actionStr',
      label: 'Action Details',
      sortable: false,
      render: (actionStr) => (
        <Typography 
          variant="body2" 
          style={{ 
            wordBreak: 'break-word', 
            whiteSpace: 'pre-wrap',
            maxWidth: '400px'
          }}
        >
          {actionStr}
        </Typography>
      )
    }
  ];

  return (
    <Card>
      <div style={{ padding: '16px' }}>
        {/* <Typography variant="h6" gutterBottom>
          Game Action History
        </Typography> */}
        <Typography variant="body2" color="secondary" style={{ marginBottom: '16px' }}>
          {gameActions.length} action{gameActions.length !== 1 ? 's' : ''} recorded
        </Typography>
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