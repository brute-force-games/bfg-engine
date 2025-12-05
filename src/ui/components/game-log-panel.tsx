import { z } from "zod";
import { Stack } from "../bfg-ui/components/Stack";
import { Typography } from "../bfg-ui/components/Typography";


// Define a display info interface for log entries
interface GameLogDisplayInfo {
  timestamp: string | number;
  source?: string;
  eventType?: string;
  summary?: string;
}

interface GameLogPanelProps<WatcherGameEventPerspectiveSchema extends z.ZodType = z.ZodType> {
  boardEvents: z.infer<WatcherGameEventPerspectiveSchema>[];
  formatEventForDisplay?: (event: z.infer<WatcherGameEventPerspectiveSchema>) => GameLogDisplayInfo;
}

const GameLogItem = (props: { displayInfo: GameLogDisplayInfo }) => {
  const { displayInfo } = props;

  return (
    <Stack direction="row">
      <Typography variant="body2">{displayInfo.timestamp}</Typography>
      {displayInfo.source && <Typography variant="body2">{displayInfo.source}</Typography>}
      {displayInfo.eventType && <Typography variant="body2">{displayInfo.eventType}</Typography>}
      {displayInfo.summary && <Typography variant="body2">{displayInfo.summary}</Typography>}
    </Stack>
  )
}

// Default formatter that extracts common properties
const defaultEventFormatter = <T,>(event: T): GameLogDisplayInfo => {
  const eventRecord = event as Record<string, unknown>;
  return {
    timestamp: (eventRecord.createdAt ?? eventRecord.stepIndex ?? 'unknown') as string | number,
    source: eventRecord.source as string | undefined,
    eventType: eventRecord.eventType as string | undefined,
    summary: JSON.stringify(event),
  };
};

export const GameLogPanel = <WatcherGameEventPerspectiveSchema extends z.ZodType = z.ZodType>(
  props: GameLogPanelProps<WatcherGameEventPerspectiveSchema>
) => {
  const { boardEvents, formatEventForDisplay = defaultEventFormatter } = props;

  return (
    <Stack direction="column">
      {boardEvents.map((boardEvent, index) => (
        <GameLogItem
          key={index}
          displayInfo={formatEventForDisplay(boardEvent)}
        />
      ))}
    </Stack>
  )
}