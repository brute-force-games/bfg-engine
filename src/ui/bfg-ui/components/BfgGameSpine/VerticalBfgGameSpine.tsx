import { Box, PlayersRow, Stack } from "@bfg-engine/ui/bfg-ui";
import { BfgBasicGameTitleBox } from "./BfgBasicGameTitleBox";
import { BfgPublicGameImplState } from "~/models/game-engine/bfg-game-engine-types";
import { BfgGameSpineProps } from "./types";


export const VerticalBfgGameSpine = <GIS extends BfgPublicGameImplState>(props: BfgGameSpineProps<GIS>) => {
  const { gameTitle, gameSourceUrl, gameTable, allPlayerProfiles, nextToActPlayers, gameState, playerDetailsLineFn } = props;

  return (
    <Box>
      <Stack spacing={3} direction="column" style={{ width: '200', height: 68, backgroundColor: 'lightgray' }}>
        <BfgBasicGameTitleBox
          gameTitle={gameTitle}
          gameSourceUrl={gameSourceUrl}
        />
        <Box style={{ flex: 1, minWidth: 0 }}>
          <PlayersRow
            gameTable={gameTable}
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
