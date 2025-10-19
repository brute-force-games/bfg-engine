import { useState, useEffect } from "react";
import { joinRoom, Room } from "trystero";
import { P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_GAME_PLAYER_MOVE_DATA_ACTION_KEY, P2P_GAME_TABLE_ACTION_KEY, P2P_GAME_ACTIONS_ACTION_KEY } from "../../ui/components/constants"; 
import { GameTable } from "../../models/game-table/game-table";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { GameTableId, PlayerProfileId } from "../../models/types/bfg-branded-ids"
import { useGameHosting } from "../../index";
import { ConnectionEvent, PeerId, PeerIdSchema } from "./p2p-types";


export interface IP2pGame {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  peerProfiles: Map<PeerId, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  gameTable: GameTable | null;
  gameActions: DbGameTableAction[];

  sendPlayerMove: (move: unknown) => void
  getPlayerMove: (callback: (move: unknown, peer: PeerId) => void) => void
  
  refreshConnection: () => void
}


export const useP2pGame = (gameTableId: GameTableId, myPlayerProfile: PublicPlayerProfile | null): IP2pGame => {
  
  const [gameTable, setGameTable] = useState<GameTable | null>(null)
  const [gameActions, setGameActions] = useState<DbGameTableAction[]>([])
  const [peerProfiles, setPeerProfiles] = useState<Map<PeerId, PublicPlayerProfile>>(new Map())
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
  console.log('joined p2p game room', room)

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

  const [, getPublicGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
  const [, getPublicGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);
  const [sendPlayerProfile, getPlayerProfile] = room.makeAction<PublicPlayerProfile>(P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY)
  const [sendPlayerMove, getPlayerMove] = room.makeAction<any>(P2P_GAME_PLAYER_MOVE_DATA_ACTION_KEY)

  if (!myPlayerProfile) {
    throw new Error('My player profile is required');
  }

  const connectionStatus = `Connected to ${peerProfiles.size} peers`;

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
    sendPlayerProfile(myPlayerProfile, peerId);
    setPeerProfiles(prev => {
      const updated = new Map(prev).set(peerId, myPlayerProfile);
      const newCount = updated.size;
      addConnectionEvent('peer-joined', `Peer joined (total: ${newCount})`, newCount);
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

  getPublicGameTableData((publicGameTableData: GameTable, peer: string) => {
    console.log('🎮 Received game table data from peer:', peer, publicGameTableData)
    setGameTable(publicGameTableData)
  })

  getPublicGameActionsData((publicGameActionsData: DbGameTableAction[], peer: string) => {
    console.log('🎮 Received game actions data from peer:', peer, publicGameActionsData)
    setGameActions(publicGameActionsData)
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
    setGameTable(null);
    setGameActions([]);
    // Room will be recreated on next render automatically
  };

  
  return {
    room,
    gameTable,
    gameActions,
    connectionStatus: connectionStatus,
    connectionEvents,
    peerProfiles,
    playerProfiles,
    sendPlayerMove,
    getPlayerMove: (callback: (move: unknown, peer: PeerId) => void) => {
      getPlayerMove((move: unknown, peer: string) => {
        const peerId = PeerIdSchema.parse(peer);
        callback(move, peerId);
      });
    },
    refreshConnection,
  }
}
