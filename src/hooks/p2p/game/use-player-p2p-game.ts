import { PrivatePlayerProfile } from "../../../models/player-profile/private-player-profile";
import { GameTableId, PlayerProfileId } from "../../../models/types/bfg-branded-ids";
import { DbGameTableAction } from "../../../models/game-table/game-table-action";
import { GameTable, GameTableSeat } from "../../../models/game-table/game-table";
import { matchPlayerToSeat } from "../../../ops/game-table-ops/player-seat-utils";
import { PublicPlayerProfile } from "../../../models/player-profile/public-player-profile";
import { ConnectionEvent, PeerId, PlayerP2pActionStr } from "../p2p-types";
import { useP2pGameContext } from "./p2p-game-context";


interface IPlayerP2pGame {
  connectionStatus: string;
  connectionEvents: ConnectionEvent[];
  
  gameTable: GameTable | null;
  gameActions: DbGameTableAction[];

  peers: PeerId[];
  peerPlayers: Map<PeerId, PublicPlayerProfile>
  // otherPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  myPlayerSeat: GameTableSeat | undefined;

  txPlayerActionStr: (actionStr: PlayerP2pActionStr) => void
  rxPlayerActionStr: (callback: (actionStr: PlayerP2pActionStr, peer: PeerId) => void) => void
  
  refreshConnection: () => void
}


export const usePlayerP2pGame = (
  gameTableId: GameTableId,
  myPlayerProfile: PrivatePlayerProfile,
): IPlayerP2pGame | null => {

  // const p2pGame = useP2pGame(gameTableId, myPlayerProfile);
  const p2pGame = useP2pGameContext();

  const { gameTable } = p2pGame;
  
  if (!gameTable) {
    return null;
  }

  const p2pGameTable = p2pGame.gameTable;

  if (p2pGameTable?.id !== gameTableId) {
    throw new Error('P2P game table ID does not match the game table ID: ' + p2pGameTable?.id + ' !== ' + gameTableId);
  }


  const myPlayerSeat = matchPlayerToSeat(myPlayerProfile.id, gameTable);

  return {
    ...p2pGame,
    myPlayerSeat,
  };
}
