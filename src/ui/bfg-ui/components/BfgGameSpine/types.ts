import { BfgSupportedGameTitle } from "~/models/game-box-definition";
import { BfgPublicGameImplState } from "~/models/game-engine/bfg-game-engine-types";
import { GameTable, GameTableSeat } from "~/models/game-table/game-table";
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile";
import { PlayerProfileId } from "~/models/types/bfg-branded-ids";


export interface BfgGameSpineProps<GIS extends BfgPublicGameImplState> {
  gameTitle: BfgSupportedGameTitle;
  gameSourceUrl?: string;
  orientation: 'horizontal' | 'vertical';
  gameTable: GameTable;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  nextToActPlayers: GameTableSeat[];
  gameState: GIS;
  playerDetailsLineFn: (gameState: GIS, playerSeat: GameTableSeat) => React.ReactNode;
}
