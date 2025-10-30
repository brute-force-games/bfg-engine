import { useState, useEffect } from "react";
import { joinRoom, Room, selfId } from "trystero";
import { P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_GAME_PLAYER_ACTION_DATA_ACTION_KEY, P2P_GAME_TABLE_ACTION_KEY, P2P_GAME_ACTIONS_ACTION_KEY } from "../../../ui/components/constants"; 
import { GameTable } from "../../../models/game-table/game-table";
import { DbGameTableAction } from "../../../models/game-table/game-table-action";
import { PublicPlayerProfile } from "../../../models/player-profile/public-player-profile";
import { GameTableId, PlayerProfileId } from "../../../models/types/bfg-branded-ids"
import { useGameHosting } from "../../../index";
import { ConnectionEvent, PeerId, PeerIdSchema, PlayerP2pActionStr } from "../p2p-types";


export interface IP2pGameRoomEventHandlers {
  onPeerJoin?: (peer: PeerId) => void
  onPeerLeave?: (peer: PeerId) => void
}

export interface IP2pGame {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  peers: PeerId[];
  peerPlayers: Map<PeerId, PublicPlayerProfile>
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  gameTable: GameTable | null;
  gameActions: DbGameTableAction[];

  txPlayerActionStr: (actionStr: PlayerP2pActionStr) => void
  rxPlayerActionStr: (callback: (actionStr: PlayerP2pActionStr, peer: PeerId) => void) => void
  
  refreshConnection: () => void
}


export const useP2pGame = (
  gameTableId: GameTableId,
  myPlayerProfile: PublicPlayerProfile | null,
  roomEventHandlers: IP2pGameRoomEventHandlers = {}
): IP2pGame => {
  
  const [gameTable, setGameTable] = useState<GameTable | null>(null)
  const [gameActions, setGameActions] = useState<DbGameTableAction[]>([])
  const [peers, setPeers] = useState<PeerId[]>([])
  const [peerPlayers, setPeerPlayers] = useState<Map<PeerId, PublicPlayerProfile>>(new Map())
  const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([]);

  // Create room - gets recreated on every render
  const gameHosting = useGameHosting();
  const trysteroConfig = gameHosting.getTrysteroConfig();
  
  const room = joinRoom(trysteroConfig, gameTableId, (error: {
    error: string;
    appId: string;
    roomId: string;
    peerId: string;
  }) => {
    console.error('Join error:', error)
    addConnectionEvent('join-error', `Join error: ${error.error}`, 0);
  });
  console.log('joined p2p game room', room);

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

  const [, rxPublicGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
  const [, rxPublicGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);
  const [txPlayerProfile, rxPlayerProfile] = room.makeAction<PublicPlayerProfile>(P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY)
  const [txPlayerActionStr, rxPlayerActionStr] = room.makeAction<PlayerP2pActionStr>(P2P_GAME_PLAYER_ACTION_DATA_ACTION_KEY)

  const connectionStatus = `Connected to ${peers.length} peers; Connected to ${peerPlayers.size} players`;

  // Initialize connection event on mount
  useEffect(() => {
    addConnectionEvent('initialized', 'P2P game connection initialized', 0);

    return () => {
      console.log('🔌 Leaving P2P game room');
      // room.leave();
    }
  }, []);


  room.onPeerJoin(peer => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('Peer joined:', peerId)

    if (!peers.includes(peerId)) {
      setPeers(prev => [...prev, peerId]);
      addConnectionEvent('peer-joined', `Peer joined (total: ${peers.length})`, peers.length);
    }

    // Only send player profile if we have one (observers don't send profiles)
    if (myPlayerProfile) {
      console.log('Sending my player profile to peer:', peerId, myPlayerProfile)
      txPlayerProfile(myPlayerProfile, peerId);
    //   setPeerPlayers(prev => {
    //     const updated = new Map(prev).set(peerId, myPlayerProfile);
    //     const newCount = updated.size;
    //     addConnectionEvent('peer-joined', `Peer joined (total: ${newCount})`, newCount);
    //     return updated;
    //   });
    // } else {
    //   // Observer mode - just track peer count
    //   // setPeerProfiles(prev => {
    //   //   const updated = new Map(prev);
    //   //   const newCount = updated.size + 1;
    //   //   addConnectionEvent('peer-joined', `Peer joined (total: ${newCount})`, newCount);
    //   //   return updated;
    //   // });
    }

    if (roomEventHandlers.onPeerJoin) {
      roomEventHandlers.onPeerJoin(peerId);
    }
  })

  room.onPeerLeave(peer => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('Peer left:', peerId)
    setPeerPlayers(prev => {
      const updated = new Map(prev);
      updated.delete(peerId);
      return updated;
    });
    if (peers.includes(peerId)) {
      setPeers(prev => prev.filter(p => p !== peerId));
      addConnectionEvent('peer-left', `Peer left (total: ${peers.length})`, peers.length);
    }

    if (roomEventHandlers.onPeerLeave) {
      roomEventHandlers.onPeerLeave(peerId);
    }
  })

  rxPublicGameTableData((publicGameTableData: GameTable, peer: string) => {
    console.log('🎮 Received game table data from peer:', peer, publicGameTableData)
    setGameTable(publicGameTableData)
  })

  rxPublicGameActionsData((publicGameActionsData: DbGameTableAction[], peer: string) => {
    console.log('🎮 Received game actions data from peer:', peer, publicGameActionsData)
    setGameActions(publicGameActionsData)
  })

  rxPlayerProfile((playerProfile: PublicPlayerProfile, peer: string) => {
    console.log('🎮 Received player profile data from peer:', peer, playerProfile)
    const peerId = PeerIdSchema.parse(peer);
    setPeerPlayers(prev => new Map(prev).set(peerId, playerProfile))
  })

  const otherPlayerProfiles = new Map<PlayerProfileId, PublicPlayerProfile>([
    ...Array.from(peerPlayers.values()).map(profile => [profile.id, profile] as const),
  ]);

  const allPlayerProfiles = new Map<PlayerProfileId, PublicPlayerProfile>(otherPlayerProfiles);
  if (myPlayerProfile) {
    allPlayerProfiles.set(myPlayerProfile.id, myPlayerProfile);
  }

  const refreshConnection = () => {
    addConnectionEvent('auto-refresh', 'Connection refreshed manually', peers.length);
    setPeerPlayers(new Map());
    setPeers([]);
    setGameTable(null);
    setGameActions([]);
    // Room will be recreated on next render automatically
  };

  
  return {
    room,
    gameTable,
    gameActions,
    connectionStatus,
    connectionEvents,
    peers,
    peerPlayers,
    allPlayerProfiles,
    
    txPlayerActionStr,
    rxPlayerActionStr: (callback: (actionStr: PlayerP2pActionStr, peer: PeerId) => void) => {
      rxPlayerActionStr((move: PlayerP2pActionStr, peer: string) => {
        const peerId = PeerIdSchema.parse(peer);
        callback(move, peerId);
      });
    },
    refreshConnection,
  }
}
