import { Box, PlayersRow, Stack } from "@bfg-engine/ui/bfg-ui";
import { BfgBasicGameTitleBox } from "./BfgBasicGameTitleBox";
import { VerticalBfgGameSpine } from "./VerticalBfgGameSpine";
import { BfgGameSpineProps } from "./types";
import type { BfgGameStateForWatcher } from "../../../../game-metadata/metadata-types/game-state-types";


export const BfgGameSpine = <GSW extends BfgGameStateForWatcher>(props: BfgGameSpineProps<GSW>) => {
  const { gameTitle, gameSourceUrl, orientation, gameRoom, allPlayerProfiles, nextToActPlayers, gameState, playerDetailsLineFn } = props;

  if (orientation === 'vertical') {
    return (
      <VerticalBfgGameSpine
        gameTitle={gameTitle}
        gameSourceUrl={gameSourceUrl}
        orientation={orientation}
        gameRoom={gameRoom}
        allPlayerProfiles={allPlayerProfiles}
        nextToActPlayers={nextToActPlayers}
        gameState={gameState}
        playerDetailsLineFn={playerDetailsLineFn}
      />
    )
  }

  return (
    <Box>
      <Stack spacing={3} direction="row" style={{ width: '100%', height: 68, backgroundColor: 'lightgray' }}>
        <BfgBasicGameTitleBox
          gameTitle={gameTitle}
          gameSourceUrl={gameSourceUrl}
          orientation={orientation}
        />
        <Box style={{ flex: 1, minWidth: 0 }}>
          <PlayersRow
            allPlayerProfiles={allPlayerProfiles}
            nextToActPlayers={nextToActPlayers}
            gameState={gameState}
            gameRoom={gameRoom}
            playerDetailsLineFn={playerDetailsLineFn}
          />
        </Box>
      </Stack>
    </Box>
  );
};
