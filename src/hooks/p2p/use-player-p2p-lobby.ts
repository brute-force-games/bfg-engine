import { GameLobbyId } from "../../models/types/bfg-branded-ids";
import { useP2pLobby } from "./use-p2p-lobby";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { HostP2pLobbyDetails } from "../../models/p2p-details";
import { PeerId } from "./p2p-types";
import { PrivatePlayerProfile } from "~/models/player-profile/private-player-profile";


interface IPlayerP2pLobbyData {
  lobbyDetails: HostP2pLobbyDetails | null
  connectionStatus: string
  peerProfiles: Map<PeerId, PublicPlayerProfile>
}


export const usePlayerP2pLobby = (
  lobbyId: GameLobbyId,
  myPlayerProfile: PrivatePlayerProfile,
): IPlayerP2pLobbyData => {

  const lobby = useP2pLobby(lobbyId, myPlayerProfile);
  const { lobbyDetails, connectionStatus, peerProfiles } = lobby;
  
  const retVal: IPlayerP2pLobbyData = {
    lobbyDetails,
    connectionStatus,
    peerProfiles,
  };
  
  return retVal;
}
