import { PlayerProfileId } from "~/models/types/bfg-branded-ids";
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile";
import { useP2pGame, ConnectionEvent } from "./use-p2p-game";
import { GameTable } from "~/models/game-table/game-table";
import { Room } from "trystero";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { P2P_GAME_TABLE_ACTION_KEY, P2P_GAME_ACTIONS_ACTION_KEY } from "~/ui/components/constants";


interface IHostedP2pGameData {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]
  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  sendGameTableData: (gameTable: GameTable) => void
  sendGameActionsData: (gameActions: DbGameTableAction[]) => void

  getPlayerMove: (callback: (move: unknown, peer: string) => void) => void
  
  refreshConnection: () => void
}

export const useHostedP2pGame = (
  gameTable: GameTable | null,
  hostPlayerProfile: PublicPlayerProfile | null,
): IHostedP2pGameData => {

  if (!gameTable) {
    throw new Error('Game table is required');
  }

  if (!hostPlayerProfile) {
    throw new Error('Host player profile is required');
  }

  const p2pGame = useP2pGame(gameTable.id, hostPlayerProfile);
  const { room } = p2pGame;

  const [sendGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
  const [sendGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);

  const retVal = {
    ...p2pGame,
    sendGameTableData,
    sendGameActionsData,
  } satisfies IHostedP2pGameData;
  
  return retVal;
}
