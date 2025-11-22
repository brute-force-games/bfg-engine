import { BfgSupportedGameTitle } from "@bfg-engine/models/game-box-definition";
import type { BfgGameStateForWatcher } from "@bfg-engine/game-metadata/metadata-types/game-state-types";
import { GameTableSeat, } from "@bfg-engine/models/internal/game-room-base";
import { type GameRoomP2p } from "@bfg-engine/models/p2p/game-room-p2p";
import { PublicPlayerProfile } from   "@bfg-engine/models/internal/player-profile/public-player-profile";
import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-uuids";


export interface BfgGameSpineProps<GSW extends BfgGameStateForWatcher> {
  gameTitle: BfgSupportedGameTitle;
  gameSourceUrl?: string;
  orientation: 'horizontal' | 'vertical';
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  nextToActPlayers: GameTableSeat[];
  gameState: GSW;
  playerDetailsLineFn: (gameRoom: GameRoomP2p, gameState: GSW, playerSeat: GameTableSeat) => React.ReactNode;
}

export interface BfgBasicGameTitleBoxProps {
  gameTitle: BfgSupportedGameTitle;
  gameSourceUrl?: string;
  orientation: 'horizontal' | 'vertical';
}
