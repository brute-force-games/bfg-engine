import { z } from "zod";
import { BfgSupportedGameTitle } from "@bfg-engine/models/game-box-definition";
import { GameTableSeat, } from "@bfg-engine/models/internal/game-room-base";
import { type GameRoomP2p } from "@bfg-engine/models/p2p/game-room-p2p";
import { PublicPlayerProfile } from   "@bfg-engine/models/internal/player-profile/public-player-profile";
import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-uuids";


export interface BfgGameSpineProps<WatcherGamePerspectiveSchema extends z.ZodType = z.ZodType> {
  gameTitle: BfgSupportedGameTitle;
  gameSourceUrl?: string;
  orientation: 'horizontal' | 'vertical';
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  nextToActPlayers: GameTableSeat[];
  gameState: z.infer<WatcherGamePerspectiveSchema>;
  playerDetailsLineFn: (gameRoom: GameRoomP2p, gameState: z.infer<WatcherGamePerspectiveSchema>, playerSeat: GameTableSeat) => React.ReactNode;
}

export interface BfgBasicGameTitleBoxProps {
  gameTitle: BfgSupportedGameTitle;
  gameSourceUrl?: string;
  orientation: 'horizontal' | 'vertical';
}
