import { useState, useEffect } from "react";
import { joinRoom, Room } from "trystero";
import { P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_GAME_PLAYER_MOVE_DATA_ACTION_KEY, P2P_GAME_TABLE_ACTION_KEY, P2P_GAME_ACTIONS_ACTION_KEY } from "~/ui/components/constants";
import { GameTable } from "~/models/game-table/game-table";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile";
import { GameTableId, PlayerProfileId } from "~/models/types/bfg-branded-ids"
import { ConnectionEvent } from "./use-p2p-lobby";
import { useGameHosting } from "~/index";

// Re-export for convenience
export type { ConnectionEvent };


export interface IP2pGame {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  gameTable: GameTable | null;
  gameActions: DbGameTableAction[];

  sendPlayerMove: (move: unknown) => void
  getPlayerMove: (callback: (move: unknown, peer: string) => void) => void
  
  refreshConnection: () => void
}


export const useP2pGame = (gameTableId: GameTableId, myPlayerProfile: PublicPlayerProfile | null): IP2pGame => {
  
  const [gameTable, setGameTable] = useState<GameTable | null>(null)
  const [gameActions, setGameActions] = useState<DbGameTableAction[]>([])
  const [peerProfiles, setPeerProfiles] = useState<Map<string, PublicPlayerProfile>>(new Map())
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
  console.log('room', room)

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
  }, []);


  room.onPeerJoin(peer => {
    console.log('Peer joined:', peer)
    sendPlayerProfile(myPlayerProfile, peer);
    setPeerProfiles(prev => {
      const updated = new Map(prev).set(peer, myPlayerProfile);
      const newCount = updated.size;
      addConnectionEvent('peer-joined', `Peer joined (total: ${newCount})`, newCount);
      return updated;
    });
  })

  room.onPeerLeave(peer => {
    console.log('Peer left:', peer)
    setPeerProfiles(prev => {
      const updated = new Map(prev)
      updated.delete(peer)
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
    setPeerProfiles(prev => new Map(prev).set(peer, playerProfile))
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
    getPlayerMove,
    refreshConnection,
  }
}
