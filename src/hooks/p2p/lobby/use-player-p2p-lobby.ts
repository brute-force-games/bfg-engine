import { GameLobbyId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { useP2pLobby } from "@bfg-engine/hooks/p2p/lobby/use-p2p-lobby";
import { PublicPlayerProfile } from "@bfg-engine/models/player-profile/public-player-profile";
import { HostP2pLobbyDetails } from "@bfg-engine/models/p2p-details";
import { PeerId } from "@bfg-engine/hooks/p2p/p2p-types";
import { PrivatePlayerProfile } from "@bfg-engine/models/player-profile/private-player-profile";


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
