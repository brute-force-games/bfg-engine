import { useState, useEffect } from "react";
import { joinRoom, Room } from "trystero";
import { HostP2pLobbyDetails, PlayerP2pLobbyMove } from "../../../models/p2p-details";  
import { PublicPlayerProfile } from "../../../models/player-profile/public-player-profile";
import { PrivatePlayerProfile, privateToPublicProfile } from "../../../models/player-profile/private-player-profile";
import { GameLobbyId, PlayerProfileId } from "../../../models/types/bfg-branded-ids"
import { P2P_LOBBY_DETAILS_ACTION_KEY, P2P_LOBBY_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_LOBBY_PLAYER_MOVE_DATA_ACTION_KEY } from "../../../ui/components/constants";
import { useGameHosting } from "../../games-registry/game-hosting";
import { ConnectionEvent, PeerId, PeerIdSchema } from "../p2p-types";


export interface IP2pLobbyRoomEventHandlers {
  onPeerJoin?: (peer: PeerId) => void
  onPeerLeave?: (peer: PeerId) => void
}

export interface IP2pLobby {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  peers: PeerId[]
  peerPlayers: Map<PeerId, PublicPlayerProfile>

  myPlayerProfile: PublicPlayerProfile
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  lobbyDetails: HostP2pLobbyDetails | null

  txPlayerProfile: (playerProfile: PublicPlayerProfile) => void
  rxPlayerProfile: (callback: (playerProfile: PublicPlayerProfile, peer: PeerId) => void) => void

  txPlayerMove: (move: PlayerP2pLobbyMove) => void
  rxPlayerMove: (callback: (move: PlayerP2pLobbyMove, peer: PeerId) => void) => void
  
  refreshConnection: () => void
}


export const useP2pLobby = (
  lobbyId: GameLobbyId,
  myPlayerProfile: PrivatePlayerProfile,
  roomEventHandlers: IP2pLobbyRoomEventHandlers = {}
): IP2pLobby => {
  
  const [lobbyDetails, setLobbyDetails] = useState<HostP2pLobbyDetails | null>(null)
  const [peers, setPeers] = useState<PeerId[]>([])
  const [peerPlayers, setPeerPlayers] = useState<Map<PeerId, PublicPlayerProfile>>(new Map())
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

  const [_, rxPublicHostData] = room.makeAction<HostP2pLobbyDetails>(P2P_LOBBY_DETAILS_ACTION_KEY);
  const [txPlayerProfile, rxPlayerProfile] = room.makeAction<PublicPlayerProfile>(P2P_LOBBY_PLAYER_PROFILE_DATA_ACTION_KEY)
  const [txPlayerMove, rxPlayerMove] = room.makeAction<PlayerP2pLobbyMove>(P2P_LOBBY_PLAYER_MOVE_DATA_ACTION_KEY)

  const connectionStatus = `Connected to ${peers.length} peers. Connected to ${peerPlayers.size} players.`;

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
    console.log('Peer joined:', peerId);
    addConnectionEvent('peer-joined', `Peer joined (total: ${peers.length + 1})`, peers.length + 1);

    if (!peers.includes(peerId)) {
      setPeers(prev => [...prev, peerId]);
    }

    txPlayerProfile(myPlayerProfile, peerId);

    if (roomEventHandlers.onPeerJoin) {
      roomEventHandlers.onPeerJoin(peerId);
    }
  })

  room.onPeerLeave(peer => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('Peer left:', peerId)
    // setPeerProfiles(prev => {
    //   const updated = new Map(prev)
    //   updated.delete(peerId)
    //   const newCount = updated.size;
    //   addConnectionEvent('peer-left', `Peer left (total: ${newCount})`, newCount);
    //   return updated;
    // })
    addConnectionEvent('peer-left', `Peer left (total: ${peers.length})`, peers.length);
    setPeers(prev => prev.filter(p => p !== peerId));
    setPeerPlayers(prev => {
      const updated = new Map(prev);
      updated.delete(peerId);
      return updated;
    });

    if (roomEventHandlers.onPeerLeave) {
      roomEventHandlers.onPeerLeave(peerId);
    }
  })

  rxPublicHostData((publicHostData: HostP2pLobbyDetails, peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('getPublicHostData - ', peerId, publicHostData)
    setLobbyDetails(publicHostData)
    const hostPlayerProfile = publicHostData.hostPlayerProfile;
    if (hostPlayerProfile) {
      setPeerPlayers(prev => new Map(prev).set(peerId, hostPlayerProfile));
    }
  })

  rxPlayerProfile((playerProfile: PublicPlayerProfile, peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    setPeerPlayers(prev => new Map(prev).set(peerId, playerProfile))
  })

  // const playerProfiles = new Map<PlayerProfileId, PublicPlayerProfile>(
  //   Array.from(peerProfiles.values()).map(profile => [profile.id, profile])
  // );

  const refreshConnection = () => {
    addConnectionEvent('auto-refresh', 'Connection refreshed manually', peerPlayers.size);
    setPeerPlayers(new Map());
    setLobbyDetails(null);
    // Room will be recreated on next render automatically
  };

  const myPublicPlayerProfile = privateToPublicProfile(myPlayerProfile);
  const allPlayerProfiles = new Map<PlayerProfileId, PublicPlayerProfile>([
    ...Array.from(peerPlayers.values()).map(profile => [profile.id, profile] as const),
  ]);
  allPlayerProfiles.set(myPlayerProfile.id, myPublicPlayerProfile);

  
  const retVal: IP2pLobby = {
    room,
    lobbyDetails,
    connectionStatus: connectionStatus,
    connectionEvents,

    myPlayerProfile: myPublicPlayerProfile,
    peers,
    peerPlayers,
    allPlayerProfiles,
    
    txPlayerProfile,
    rxPlayerProfile: (callback: (playerProfile: PublicPlayerProfile, peer: PeerId) => void) => {
      rxPlayerProfile((playerProfile: PublicPlayerProfile, peer: string) => {
        const peerId = PeerIdSchema.parse(peer);
        callback(playerProfile, peerId);
      });
    },

    txPlayerMove,
    rxPlayerMove: (callback: (move: PlayerP2pLobbyMove, peer: PeerId) => void) => {
      rxPlayerMove((move: PlayerP2pLobbyMove, peer: string) => {
        const peerId = PeerIdSchema.parse(peer);
        callback(move, peerId);
      });
    },

    refreshConnection,
  };

  return retVal;
}
