import { Stack } from "../bfg-ui/components/Stack";
import { Typography } from "../bfg-ui/components/Typography";
import type { GameTableEventWithTransition } from "../../models/game-table/game-table-event";


interface GameLogPanelProps {
  boardEvents: GameTableEventWithTransition[];
}

const GameLogItem = (props: { boardEvent: GameTableEventWithTransition }) => {
  const { boardEvent } = props;

  return (
    <Stack direction="row">
      <Typography variant="body2">{boardEvent.createdAt}</Typography>
      <Typography variant="body2">{boardEvent.source}</Typography>
      <Typography variant="body2">{boardEvent.eventType}</Typography>
    </Stack>
  )
}

export const GameLogPanel = (props: GameLogPanelProps) => {
  const { boardEvents } = props;

  return (
    <Stack direction="column">
      {boardEvents.map((boardEvent, index) => (
        <GameLogItem
          key={index}
          boardEvent={boardEvent}
        />
      ))}
    </Stack>
  )
}