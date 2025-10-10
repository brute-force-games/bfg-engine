import { GameLobbyId } from "~/models/types/bfg-branded-ids";
import { useP2pLobby } from "./use-p2p-lobby";
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile";
import { HostP2pLobbyDetails } from "~/models/p2p-details";


interface IPlayerP2pLobbyData {
  lobbyDetails: HostP2pLobbyDetails | null
  connectionStatus: string
  peerProfiles: Map<string, PublicPlayerProfile>
}


export const usePlayerP2pLobby = (lobbyId: GameLobbyId, playerProfile: PublicPlayerProfile): IPlayerP2pLobbyData => {

  const lobby = useP2pLobby(lobbyId, playerProfile);
  const { lobbyDetails, connectionStatus, peerProfiles } = lobby;
  
  const retVal: IPlayerP2pLobbyData = {
    lobbyDetails,
    connectionStatus,
    peerProfiles,
  };
  
  return retVal;
}
