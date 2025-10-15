import { PrivatePlayerProfile } from "../../models/player-profile/private-player-profile";
import { GameTableId, PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { useP2pGame, ConnectionEvent } from "./use-p2p-game";
// import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
type BfgGameSpecificGameStateTypedJson = any; // Temporary stub
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { matchPlayerToSeat } from "../../ops/game-table-ops/player-seat-utils";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";


interface IPlayerP2pGame {
  connectionStatus: string;
  connectionEvents: ConnectionEvent[];
  
  gameTable: GameTable | null;
  gameActions: DbGameTableAction[];

  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  myPlayerSeat: GameTableSeat | undefined;

  sendPlayerMove: (move: BfgGameSpecificGameStateTypedJson) => void
  getPlayerMove: (callback: (move: BfgGameSpecificGameStateTypedJson, peer: string) => void) => void
  
  refreshConnection: () => void
}


export const usePlayerP2pGame = (gameTableId: GameTableId, playerProfile: PrivatePlayerProfile): IPlayerP2pGame | null => {

  const p2pGame = useP2pGame(gameTableId, playerProfile);

  const { gameTable } = p2pGame;

  const myPlayerSeat = matchPlayerToSeat(playerProfile.id, gameTable);

  return {
    ...p2pGame,
    myPlayerSeat,
  };
}
