import { createContext, useContext, useRef, useState } from "react";
import { joinRoom, Room } from "trystero";
import { useGameHosting } from "~/hooks/games-registry/game-hosting";
import { GameTable } from "~/models/game-table/game-table";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile";
import { P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_GAME_PLAYER_ACTION_DATA_ACTION_KEY, P2P_GAME_TABLE_ACTION_KEY, P2P_GAME_ACTIONS_ACTION_KEY, P2P_GAME_PRIVATE_PLAYER_KNOWLEDGE_DATA_ACTION_KEY } from "~/ui/components/constants";
import { ConnectionEvent, PeerId, PeerIdSchema, PlayerP2pActionStr, PrivatePlayerKnowledgeStr } from "../p2p-types";
import { GameTableId } from "~/models/types/bfg-branded-ids";
import { GameTableAccessRole } from "~/models/game-roles";


// Subscription manager for handling multiple handlers per event type
class SubscriptionManager<T> {
  private onDataHandlers = new Map<number, (data: T, peer: PeerId) => void>();
  private onPeerHandlers = new Map<number, (peer: PeerId) => void>();
  
  private nextId = 0;

  subscribe(handler: (peer: PeerId) => void): () => void {
    const id = this.nextId++;
    this.onPeerHandlers.set(id, handler);
    return () => {
      this.onPeerHandlers.delete(id);
    };
  }

  subscribeData(handler: (data: T, peer: PeerId) => void): () => void {
    const id = this.nextId++;
    this.onDataHandlers.set(id, handler);
    return () => {
      this.onDataHandlers.delete(id);
    };
  }

  notify(peer: PeerId): void {
    this.onPeerHandlers.forEach(handler => handler(peer));
  }

  notifyData(data: T, peer: PeerId): void {
    this.onDataHandlers.forEach(handler => handler(data, peer));
  }
}


/**
 * P2P Game Room Context Value
 * 
 * Provides access to peer-to-peer communication for game rooms.
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { rxPlayerProfile, txPlayerProfile } = useP2pGameRoomContext();
 *   
 *   useEffect(() => {
 *     // Subscribe to player profile updates
 *     const unsubscribe = rxPlayerProfile((profile, peerId) => {
 *       console.log('Received profile from', peerId, profile);
 *     });
 *     
 *     // Clean up subscription on unmount
 *     return unsubscribe;
 *   }, [rxPlayerProfile]);
 *   
 *   return <div>...</div>;
 * };
 * ```
 */
export interface IP2pGameRoomValue {
  gameTableId: GameTableId;
  requestedRole: GameTableAccessRole;

  room: Room;
  connectionStatus: string;
  connectionEvents: ConnectionEvent[];

  // Transmit functions
  txPlayerProfile: (playerProfile: PublicPlayerProfile, peer: PeerId) => void;
  txPlayerActionStr: (playerActionStr: PlayerP2pActionStr) => void;
  txPublicGameTableData: (gameTable: GameTable) => void;
  txPublicGameActionsData: (gameActions: DbGameTableAction[]) => void;
  txPrivatePlayerKnowledgeStr: (privatePlayerKnowledge: PrivatePlayerKnowledgeStr, peer: PeerId) => void;

  // observer, host, player
  onRoomPeerJoin: (handler: (peer: PeerId) => void) => (() => void);
  onRoomPeerLeave: (handler: (peer: PeerId) => void) => (() => void);
  rxPlayerProfile: (handler: (data: PublicPlayerProfile, peer: PeerId) => void) => (() => void);

  // observer, player
  rxPublicGameTableData: (handler: (data: GameTable, peer: PeerId) => void) => (() => void);
  rxPublicGameActionsData: (handler: (data: DbGameTableAction[], peer: PeerId) => void) => (() => void);

  // player-only
  rxPrivatePlayerKnowledgeStr: (handler: (data: PrivatePlayerKnowledgeStr, peer: PeerId) => void) => (() => void);

  // host-only
  rxPlayerActionStr: (handler: (data: PlayerP2pActionStr, peer: PeerId) => void) => (() => void);

  // peers: PeerId[];
  // peerPlayers: Map<PeerId, PublicPlayerProfile>;
  // allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  // myPlayerProfile: PrivatePlayerProfile | null;
  // myGameTableAccess: GameTableAccessRole;
}


export interface IP2pGameRoomContextProviderProps {
  gameTableId: GameTableId;
  requestedRole: GameTableAccessRole;
  children: React.ReactNode;
}

const P2pGameRoomContext = createContext<IP2pGameRoomValue | null>(null);

export const P2pGameRoomContextProvider = ({ 
  gameTableId,
  requestedRole,
  children 
}: IP2pGameRoomContextProviderProps) => {

  // const isValidHost = requestedRole === 'host' && myPlayerProfile;

  // const p2pGame = isValidHost ? 
  //   useHostedP2pGameWithStore(gameTableId, myPlayerProfile) : 
  //   useP2pGame({
  //     gameTableId,
  //     myPlayerProfile,
  //     requestedRole,
  //   });

  // const retVal: IP2pGameValue = {
  //   ...p2pGame,
  //   myPlayerProfile,
  // };


  // Create room - gets recreated on every render
  const gameHosting = useGameHosting();
  const trysteroConfig = gameHosting.getTrysteroConfig();

  const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([]);

  // Create subscription managers (using refs to persist across renders)
  const onRoomPeerJoinManager = useRef(new SubscriptionManager<PeerId>());
  const onRoomPeerLeaveManager = useRef(new SubscriptionManager<PeerId>());
  const playerProfileManager = useRef(new SubscriptionManager<PublicPlayerProfile>());
  const playerActionStrManager = useRef(new SubscriptionManager<PlayerP2pActionStr>());
  const gameTableDataManager = useRef(new SubscriptionManager<GameTable>());
  const gameActionsDataManager = useRef(new SubscriptionManager<DbGameTableAction[]>());
  const privatePlayerKnowledgeManager = useRef(new SubscriptionManager<PrivatePlayerKnowledgeStr>());

  console.log('P2pGameRoomContextProvider - gameTableId', gameTableId)
  
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

  const [txPlayerProfile, rxPlayerProfileRaw] = room.makeAction<PublicPlayerProfile>(P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY)
  const [txPlayerActionStr, rxPlayerActionStrRaw] = room.makeAction<PlayerP2pActionStr>(P2P_GAME_PLAYER_ACTION_DATA_ACTION_KEY)

  const [txPublicGameTableData, rxPublicGameTableDataRaw] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
  const [txPublicGameActionsData, rxPublicGameActionsDataRaw] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);
  const [txPrivatePlayerKnowledgeStr, rxPrivatePlayerKnowledgeStrRaw] = room.makeAction<PrivatePlayerKnowledgeStr>(P2P_GAME_PRIVATE_PLAYER_KNOWLEDGE_DATA_ACTION_KEY)

  room.onPeerJoin((peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('🎮 Peer joined:', peerId);
    onRoomPeerJoinManager.current.notify(peerId);
  });

  room.onPeerLeave((peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('🎮 Peer left:', peerId);
    onRoomPeerLeaveManager.current.notify(peerId);
  });
  
  // Wire up trystero receivers to subscription managers
  rxPlayerProfileRaw((playerProfile: PublicPlayerProfile, peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('🎮 Received player profile data from peer:', peerId, playerProfile);
    playerProfileManager.current.notifyData(playerProfile, peerId);
  });

  rxPlayerActionStrRaw((playerActionStr: PlayerP2pActionStr, peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('🎮 Received player action data from peer:', peerId, playerActionStr);
    playerActionStrManager.current.notifyData(playerActionStr, peerId);
  });

  rxPublicGameTableDataRaw((gameTable: GameTable, peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('🎮 Received game table data from peer:', peerId, gameTable);
    gameTableDataManager.current.notifyData(gameTable, peerId);
  });

  rxPublicGameActionsDataRaw((gameActions: DbGameTableAction[], peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('🎮 Received game actions data from peer:', peerId, gameActions);
    gameActionsDataManager.current.notifyData(gameActions, peerId);
  });

  rxPrivatePlayerKnowledgeStrRaw((privatePlayerKnowledge: PrivatePlayerKnowledgeStr, peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('🎮 Received private player knowledge data from peer:', peerId, privatePlayerKnowledge);
    privatePlayerKnowledgeManager.current.notifyData(privatePlayerKnowledge, peerId);
  });

  // Expose subscription functions that return unsubscribe functions
  const rxPlayerProfile = (handler: (data: PublicPlayerProfile, peer: PeerId) => void): (() => void) => {
    return playerProfileManager.current.subscribeData(handler);
  };

  const rxPlayerActionStr = (handler: (data: PlayerP2pActionStr, peer: PeerId) => void): (() => void) => {
    return playerActionStrManager.current.subscribeData(handler);
  };

  const rxPublicGameTableData = (handler: (data: GameTable, peer: PeerId) => void): (() => void) => {
    return gameTableDataManager.current.subscribeData(handler);
  };

  const rxPublicGameActionsData = (handler: (data: DbGameTableAction[], peer: PeerId) => void): (() => void) => {
    return gameActionsDataManager.current.subscribeData(handler);
  };

  const rxPrivatePlayerKnowledgeStr = (handler: (data: PrivatePlayerKnowledgeStr, peer: PeerId) => void): (() => void) => {
    return privatePlayerKnowledgeManager.current.subscribeData(handler);
  };

  const onRoomPeerJoin = (handler: (peer: PeerId) => void): (() => void) => {
    return onRoomPeerJoinManager.current.subscribe(handler);
  };

  const onRoomPeerLeave = (handler: (peer: PeerId) => void): (() => void) => {
    return onRoomPeerLeaveManager.current.subscribe(handler);
  };

  const peers = room.getPeers();
  const connectionStatus = `Connected to ${peers.length} peers`;

  const retVal: IP2pGameRoomValue = {
    gameTableId,
    requestedRole,

    room,
    connectionStatus,
    connectionEvents,

    txPlayerProfile,
    txPlayerActionStr,
    txPublicGameTableData,
    txPublicGameActionsData,
    txPrivatePlayerKnowledgeStr,

    onRoomPeerJoin,
    onRoomPeerLeave,

    rxPlayerProfile,
    rxPlayerActionStr,
    rxPublicGameTableData,
    rxPublicGameActionsData,
    rxPrivatePlayerKnowledgeStr,
  };

  return (
    <P2pGameRoomContext.Provider value={retVal}>
      {children}
    </P2pGameRoomContext.Provider>
  )
}


export const useP2pGameRoomContext = (): IP2pGameRoomValue => {
  const context = useContext(P2pGameRoomContext);
  if (!context) {
    throw new Error('useP2pGameRoomContext must be used within a P2pGameRoomContextProvider');
  }
  return context;
}
