import { GameTableId, PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { useP2pGame } from "./use-p2p-game";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { GameTable } from "../../models/game-table/game-table";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { ConnectionEvent, PeerId } from "./p2p-types";


interface IObserverP2pGame {
  connectionStatus: string;
  connectionEvents: ConnectionEvent[];
  
  gameTable: GameTable | null;
  gameActions: DbGameTableAction[];

  peerProfiles: Map<PeerId, PublicPlayerProfile>
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  // getPlayerMove: (callback: (move: unknown, peer: string) => void) => void
  
  refreshConnection: () => void
}


export const useObserverP2pGame = (gameTableId: GameTableId): IObserverP2pGame | null => {

  const p2pGame = useP2pGame(gameTableId, null);

  return {
    ...p2pGame,
  } as IObserverP2pGame;
}
