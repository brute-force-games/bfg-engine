import { GameLobbyId } from "~/models/types/bfg-branded-ids";
import { useP2pLobby } from "~/hooks/p2p/lobby/use-p2p-lobby";
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile";
import { HostP2pLobbyDetails } from "~/models/p2p-details";
import { PeerId } from "~/hooks/p2p/p2p-types";
import { PrivatePlayerProfile } from "~/models/player-profile/private-player-profile";


interface IPlayerP2pLobbyData {
  lobbyDetails: HostP2pLobbyDetails | null
  connectionStatus: string
  peerPlayers: Map<PeerId, PublicPlayerProfile>
}


export const usePlayerP2pLobby = (
  lobbyId: GameLobbyId,
  myPlayerProfile: PrivatePlayerProfile,
): IPlayerP2pLobbyData => {

  const lobby = useP2pLobby(lobbyId, myPlayerProfile);
  const { lobbyDetails, connectionStatus, peerPlayers } = lobby;
  
  const retVal: IPlayerP2pLobbyData = {
    lobbyDetails,
    connectionStatus,
    peerPlayers,
  };
  
  return retVal;
}
