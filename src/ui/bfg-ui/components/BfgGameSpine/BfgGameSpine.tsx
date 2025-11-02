import { Box, PlayersRow, Stack } from "@bfg-engine/ui/bfg-ui";
import { BfgBasicGameTitleBox } from "./BfgBasicGameTitleBox";
import { BfgPublicGameImplState } from "~/models/game-engine/bfg-game-engine-types";
import { VerticalBfgGameSpine } from "./VerticalBfgGameSpine";
import { BfgGameSpineProps } from "./types";


export const BfgGameSpine = <GIS extends BfgPublicGameImplState>(props: BfgGameSpineProps<GIS>) => {
  const { gameTitle, gameSourceUrl, orientation, gameTable, allPlayerProfiles, nextToActPlayers, gameState, playerDetailsLineFn } = props;

  if (orientation === 'vertical') {
    return (
      <VerticalBfgGameSpine
        gameTitle={gameTitle}
        gameSourceUrl={gameSourceUrl}
        orientation={orientation}
        gameTable={gameTable}
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
