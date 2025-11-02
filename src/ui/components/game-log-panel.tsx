import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { Stack } from "../bfg-ui/components/Stack";
import { Typography } from "../bfg-ui/components/Typography";


interface GameLogPanelProps {
  gameActions: DbGameTableAction[];
}

const GameLogItem = (props: { gameAction: DbGameTableAction }) => {
  const { gameAction } = props;

  return (
    <Stack direction="row">
      <Typography variant="body2">{gameAction.createdAt}</Typography>
      <Typography variant="body2">{gameAction.actionType}</Typography>
      <Typography variant="body2">{gameAction.actionStr}</Typography>
    </Stack>
  )
}

export const GameLogPanel = (props: GameLogPanelProps) => {
  const { gameActions } = props;

  return (
    <Stack direction="column">
      {gameActions.map((gameAction, index) => (
        <GameLogItem
          key={index}
          gameAction={gameAction}
        />
      ))}
    </Stack>
  )
}