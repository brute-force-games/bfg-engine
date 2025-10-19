import { useState, useEffect } from "react";
import { joinRoom, Room } from "trystero";
import { HostP2pLobbyDetails, PlayerP2pLobbyMove } from "../../models/p2p-details";  
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { GameLobbyId, PlayerProfileId } from "../../models/types/bfg-branded-ids"
import { P2P_LOBBY_DETAILS_ACTION_KEY, P2P_LOBBY_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_LOBBY_PLAYER_MOVE_DATA_ACTION_KEY } from "../../ui/components/constants";
import { useGameHosting } from "../games-registry/game-hosting";
import { ConnectionEvent, PeerId, PeerIdSchema } from "./p2p-types";


export interface IP2pLobby {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  peerProfiles: Map<PeerId, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  lobbyDetails: HostP2pLobbyDetails | null

  getPlayerProfile: (callback: (playerProfile: PublicPlayerProfile, peer: string) => void) => void

  sendPlayerMove: (move: PlayerP2pLobbyMove) => void
  getPlayerMove: (callback: (move: PlayerP2pLobbyMove, peer: PeerId) => void) => void
  
  refreshConnection: () => void
}


export const useP2pLobby = (lobbyId: GameLobbyId, myPlayerProfile: PublicPlayerProfile): IP2pLobby => {
  
  const [lobbyDetails, setLobbyDetails] = useState<HostP2pLobbyDetails | null>(null)
  const [peerProfiles, setPeerProfiles] = useState<Map<PeerId, PublicPlayerProfile>>(new Map())
  const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([]);

  const gameHosting = useGameHosting();
  const trysteroConfig = gameHosting.getTrysteroConfig();

  // Create room - gets recreated on every render
  const room = joinRoom(trysteroConfig, lobbyId, (error: {
    error: string;
    appId: string;
    roomId: string;
    peerId: string;
  }) => {
    console.error('Join error:', error)
    addConnectionEvent('join-error', `Join error: ${error.error}`, 0);
  });
  console.log('joined p2p lobby room', room)

  const addConnectionEvent = (type: ConnectionEvent['type'], message: string, peerCount: number) => {
    const event: ConnectionEvent = {
      type,
      timestamp: new Date(),
      peerCount,
      message
    };
    console.log(`📡 [${event.timestamp.toLocaleTimeString()}] ${event.message}`);
    setConnectionEvents(prev => [...prev, event]);
  };

  const [_, getPublicHostData] = room.makeAction<HostP2pLobbyDetails>(P2P_LOBBY_DETAILS_ACTION_KEY);
  const [sendPlayerProfile, getPlayerProfile] = room.makeAction<PublicPlayerProfile>(P2P_LOBBY_PLAYER_PROFILE_DATA_ACTION_KEY)
  const [sendPlayerMove, getPlayerMove] = room.makeAction<PlayerP2pLobbyMove>(P2P_LOBBY_PLAYER_MOVE_DATA_ACTION_KEY)

  const connectionStatus = `Connected to ${peerProfiles.size} peers`;

  // Initialize connection event on mount
  useEffect(() => {
    console.log('🚀 P2P lobby connection initialized');
    addConnectionEvent('initialized', 'P2P lobby connection initialized', 0);

    return () => {
      console.log('🔌 Leaving P2P lobby room');
      // room.leave();
    }
  }, []);

  
  room.onPeerJoin(peer => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('Peer joined:', peerId)
    sendPlayerProfile(myPlayerProfile, peerId);
    setPeerProfiles(prev => {
      const updated = new Map(prev).set(peerId, myPlayerProfile);
      const newCount = updated.size;
      const peerHandle = peerProfiles.get(peerId)?.handle ?? peerId;
      const eventMessage = `Peer ${peerHandle} joined (total: ${newCount})`;
      addConnectionEvent('peer-joined', eventMessage, newCount);
      return updated;
    });
  })

  room.onPeerLeave(peer => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('Peer left:', peerId)
    setPeerProfiles(prev => {
      const updated = new Map(prev)
      updated.delete(peerId)
      const newCount = updated.size;
      addConnectionEvent('peer-left', `Peer left (total: ${newCount})`, newCount);
      return updated;
    })
  })

  getPublicHostData((publicHostData: HostP2pLobbyDetails, peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('getPublicHostData - ', peerId, publicHostData)
    setLobbyDetails(publicHostData)
    const hostPlayerProfile = publicHostData.hostPlayerProfile;
    if (hostPlayerProfile) {
      setPeerProfiles(prev => new Map(prev).set(peerId, hostPlayerProfile));
    }
  })

  getPlayerProfile((playerProfile: PublicPlayerProfile, peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    setPeerProfiles(prev => new Map(prev).set(peerId, playerProfile))
  })

  const playerProfiles = new Map<PlayerProfileId, PublicPlayerProfile>(
    Array.from(peerProfiles.values()).map(profile => [profile.id, profile])
  );

  const refreshConnection = () => {
    addConnectionEvent('auto-refresh', 'Connection refreshed manually', peerProfiles.size);
    setPeerProfiles(new Map());
    setLobbyDetails(null);
    // Room will be recreated on next render automatically
  };

  
  return {
    room,
    lobbyDetails,
    connectionStatus: connectionStatus,
    connectionEvents,
    peerProfiles,
    playerProfiles,
    getPlayerProfile,
    sendPlayerMove,
    getPlayerMove: (callback: (move: PlayerP2pLobbyMove, peer: PeerId) => void) => {
      getPlayerMove((move: PlayerP2pLobbyMove, peer: string) => {
        const peerId = PeerIdSchema.parse(peer);
        callback(move, peerId);
      });
    },
    refreshConnection,
  }
}
