import { Box, PlayersRow, Stack } from "@bfg-engine/ui/bfg-ui";
import { BfgBasicGameTitleBoxVertical } from "./BfgBasicGameTitleBoxVertical";
import { BfgGameSpineProps } from "./types";
import type { BfgGameStateForWatcher } from "../../../../game-metadata/metadata-types/game-state-types";


export const VerticalBfgGameSpine = <GSW extends BfgGameStateForWatcher>(props: BfgGameSpineProps<GSW>) => {
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
