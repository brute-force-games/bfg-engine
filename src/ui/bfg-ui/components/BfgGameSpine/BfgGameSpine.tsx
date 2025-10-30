import { Box, PlayersRow, Stack } from "@bfg-engine/ui/bfg-ui";
import { BfgSupportedGameTitle } from "@bfg-engine/models/game-box-definition";
import { GameTable } from '~/models/game-table/game-table';
import { GameTableSeat } from '~/models/game-table/game-table';
import { PlayerProfileId } from '~/models/types/bfg-branded-ids';
import { PublicPlayerProfile } from '~/models/player-profile/public-player-profile';
import { BfgGameTitleBox } from "./BfgGameTitleBox";
import { BfgPublicGameImplState } from "~/models/game-engine/bfg-game-engine-types";


interface BfgGameSpineProps<GIS extends BfgPublicGameImplState> {
  gameTitle: BfgSupportedGameTitle;
  gameSourceUrl: string;
  orientation: 'horizontal' | 'vertical';
  gameTable: GameTable;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  nextToActPlayers: GameTableSeat[];
  gameState: GIS;
  playerDetailsLineFn: (gameState: GIS, playerSeat: GameTableSeat) => React.ReactNode;
}

export const BfgGameSpine = <GIS extends BfgPublicGameImplState>(props: BfgGameSpineProps<GIS>) => {
  const { gameTitle, gameSourceUrl, orientation, gameTable, allPlayerProfiles, nextToActPlayers, gameState, playerDetailsLineFn } = props;

  if (orientation !== 'horizontal') {
    throw new Error('BfgGameSpine: non-horizontal orientation is not implemented');
  }

  return (
    <Box>
      <Stack spacing={3} direction="row" style={{ width: '100%', height: 68, backgroundColor: 'lightgray' }}>
        {/* <Stack spacing={3} style={{ width: '100%', height: '100%' }}> */}
        <BfgGameTitleBox
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
