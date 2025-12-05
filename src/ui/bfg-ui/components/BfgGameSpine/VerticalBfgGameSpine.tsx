import { z } from "zod";
import { Box, PlayersRow, Stack } from "@bfg-engine/ui/bfg-ui";
import { BfgBasicGameTitleBoxVertical } from "./BfgBasicGameTitleBoxVertical";
import { BfgGameSpineProps } from "./types";


export const VerticalBfgGameSpine = <WatcherGamePerspectiveSchema extends z.ZodType = z.ZodType>(
  props: BfgGameSpineProps<WatcherGamePerspectiveSchema>
) => {
  const { gameRoom, allPlayerProfiles, nextToActPlayers, gameState, playerDetailsLineFn } = props;

  return (
    <Box>
      <Stack spacing={3} direction="column" style={{ width: '200', height: 68, backgroundColor: 'lightgray' }}>
        <BfgBasicGameTitleBoxVertical
          {...props}
        />
        <Box style={{ flex: 1, minWidth: 0 }}>
          <PlayersRow
            gameRoom={gameRoom}
            allPlayerProfiles={allPlayerProfiles}
            nextToActPlayers={nextToActPlayers}
            gameState={gameState}
            playerDetailsLineFn={playerDetailsLineFn}
          />
        </Box>
      </Stack>
    </Box>
  );
};
