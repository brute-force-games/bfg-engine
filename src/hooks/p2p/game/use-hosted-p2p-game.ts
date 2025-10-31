import { PlayerProfileId } from "../../../models/types/bfg-branded-ids";
import { PublicPlayerProfile } from "../../../models/player-profile/public-player-profile";
import { useP2pGame } from "./use-p2p-game";
import { GameTable } from "../../../models/game-table/game-table";
import { Room } from "trystero";
import { DbGameTableAction } from "../../../models/game-table/game-table-action";
import { P2P_GAME_TABLE_ACTION_KEY, P2P_GAME_ACTIONS_ACTION_KEY } from "../../../ui/components/constants";
import { ConnectionEvent, PeerId, PlayerP2pActionStr } from "../p2p-types";


interface IHostedP2pGameData {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  peers: PeerId[]
  peerPlayers: Map<PeerId, PublicPlayerProfile>
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  txGameTableData: (gameTable: GameTable) => void
  txGameActionsData: (gameActions: DbGameTableAction[]) => void

  rxPlayerActionStr: (callback: (actionStr: PlayerP2pActionStr, peer: PeerId) => void) => void
  
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

  const p2pGame = useP2pGame({
    gameTableId: gameTable.id,
    myPlayerProfile: hostPlayerProfile,
    requestedRole: 'host',
  });
  const { room, allPlayerProfiles } = p2pGame;

  const [txGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
  const [txGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);

  const retVal: IHostedP2pGameData = {
    ...p2pGame,
    allPlayerProfiles,
    txGameTableData,
    txGameActionsData,
  };
  
  return retVal;
}
