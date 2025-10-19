import { GameLobbyId } from "../../models/types/bfg-branded-ids";
import { useP2pLobby } from "./use-p2p-lobby";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { HostP2pLobbyDetails } from "../../models/p2p-details";
import { P2P_LOBBY_DETAILS_ACTION_KEY } from "../../ui/components/constants";
import { IP2pLobby } from "./use-p2p-lobby";
import { ConnectionEvent, PeerId, PeerIdSchema } from "./p2p-types";


interface IHostedP2pLobbyData {
  p2pLobby: IP2pLobby
  
  lobbyDetails: HostP2pLobbyDetails | null
  connectionStatus: string
  connectionEvents: ConnectionEvent[]
  peerProfiles: Map<PeerId, PublicPlayerProfile>

  sendLobbyData: (lobbyData: HostP2pLobbyDetails) => void
  getPlayerProfile: (callback: (playerProfile: PublicPlayerProfile, peer: PeerId) => void) => void
  refreshConnection: () => void
}

export const useHostedP2pLobby = (lobbyId: GameLobbyId, hostPlayerProfile: PublicPlayerProfile): IHostedP2pLobbyData => {

  const lobby = useP2pLobby(lobbyId, hostPlayerProfile);
  const { room, peerProfiles, getPlayerProfile, connectionEvents, refreshConnection } = lobby;

  const [sendLobbyData] = room.makeAction<HostP2pLobbyDetails>(P2P_LOBBY_DETAILS_ACTION_KEY)

  const retVal: IHostedP2pLobbyData = {
    p2pLobby: lobby,
    lobbyDetails: lobby.lobbyDetails,
    connectionStatus: lobby.connectionStatus,
    connectionEvents,
    peerProfiles,
    sendLobbyData,
    getPlayerProfile: (callback: (playerProfile: PublicPlayerProfile, peer: PeerId) => void) => {
      getPlayerProfile((playerProfile: PublicPlayerProfile, peer: string) => {
        const peerId = PeerIdSchema.parse(peer);
        callback(playerProfile, peerId);
      });
    },
    refreshConnection,
  }
  
  return retVal;
}
