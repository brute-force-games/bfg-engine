import { createContext, useContext, useRef, useState } from "react";
import { joinRoom, Room } from "trystero";
import { useSiteHosting } from "@bfg-engine/hooks/site-hosting";
import { PublicPlayerProfile } from "@bfg-engine/models/internal/player-profile/public-player-profile";
import { P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_GAME_PLAYER_ACTION_DATA_ACTION_KEY, P2P_GAME_USER_GAME_ROOM_DATA_ACTION_KEY } from "@bfg-engine/ui/components/constants";
import { ConnectionEvent, PeerId, PeerIdSchema, PlayerP2pActionStr, type UserGameRoomPerspectiveStr } from "../p2p-types";
import { type BfgGameInstanceId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { type GameTableAccessAction } from "@bfg-engine/models/internal/user-game-perspective";


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



export interface IP2pRawRoomValue {
  gameInstanceId: BfgGameInstanceId;
  requestedAction: GameTableAccessAction;

  room: Room;
  connectionStatus: string;
  connectionEvents: ConnectionEvent[];

  userGameRoomPerspectiveStr: UserGameRoomPerspectiveStr | null;

  // observer, host, player
  onRoomPeerJoin: (handler: (peer: PeerId) => void) => (() => void);
  onRoomPeerLeave: (handler: (peer: PeerId) => void) => (() => void);
  
  // Transmit functions
  txPlayerProfile: (playerProfile: PublicPlayerProfile, peer?: PeerId) => void;
  rxPlayerProfile: (handler: (data: PublicPlayerProfile, peer: PeerId) => void) => (() => void);

  txPlayerActionStr: (playerActionStr: PlayerP2pActionStr, peer: PeerId) => void;
  rxPlayerActionStr: (handler: (data: PlayerP2pActionStr, peer: PeerId) => void) => (() => void);

  // txUserGameRoomData: (userGameRoomData: UserGameRoomData, peer: PeerId) => void;
  // rxUserGameRoomData: (handler: (data: UserGameRoomData, peer: PeerId) => void) => (() => void);

  txUserGameRoomPerspectiveStr: (userGameRoomPerspectiveStr: UserGameRoomPerspectiveStr, peer: PeerId) => void;
  rxUserGameRoomPerspectiveStr: (handler: (data: UserGameRoomPerspectiveStr, peer: PeerId) => void) => (() => void);


  // userGameRoomData: UserGameRoomData | null;
  // latestGameSnapshot: HydratedLatestGameSnapshot | null;

  // txGameRoom: (gameRoomP2p: GameRoomP2p) => void;
  // // txPublicGameTableData: (gameTable: GameRoomDb) => void;
  // txPublicGameEventsDataStr: (gameEventStrs: GameTableEventForWatcherP2pString[]) => void;
  // txPrivatePlayerKnowledgeStr: (privatePlayerKnowledge: PrivatePlayerKnowledgeStr, peer: PeerId) => void;

  // observer, player
  // rxPublicGameTableData: (handler: (data: GameRoomDb, peer: PeerId) => void) => (() => void);
  // rxPublicGameRoomData: (handler: (data: GameRoomP2p, peer: PeerId) => void) => (() => void);
  // rxPublicGameEventsData: (handler: (data: GameTableEventWithTransitionForWatcherP2p[], peer: PeerId) => void) => (() => void);

  // player-only
  // rxPrivatePlayerKnowledgeStr: (handler: (data: PrivatePlayerKnowledgeStr, peer: PeerId) => void) => (() => void);

  // host-only
  // rxPlayerActionStr: (handler: (data: PlayerP2pActionStr, peer: PeerId) => void) => (() => void);
}


export interface IP2pRawRoomContextProviderProps {
  // gameRoomId: BfgGameRoomId;
  // gameTableId: BfgGameTableId;
  gameInstanceId: BfgGameInstanceId;
  requestedAction: GameTableAccessAction;
  children: React.ReactNode;
}

export const P2pRawRoomContext = createContext<IP2pRawRoomValue | null>(null);

export const P2pRawRoomContextProvider = ({ 
  // gameRoomId,
  // gameTableId,
  gameInstanceId,
  requestedAction,
  children 
}: IP2pRawRoomContextProviderProps) => {

  // Create room - gets recreated on every render
  const siteHosting = useSiteHosting();
  const trysteroConfig = siteHosting.getTrysteroConfig();

  const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([]);
  const [userGameRoomPerspectiveStr, setUserGameRoomPerspectiveStr] = useState<UserGameRoomPerspectiveStr | null>(null);

  // Create subscription managers (using refs to persist across renders)
  const onRoomPeerJoinManager = useRef(new SubscriptionManager<PeerId>());
  const onRoomPeerLeaveManager = useRef(new SubscriptionManager<PeerId>());
  const playerProfileManager = useRef(new SubscriptionManager<PublicPlayerProfile>());
  const playerActionStrManager = useRef(new SubscriptionManager<PlayerP2pActionStr>());
  // const gameTableDataManager = useRef(new SubscriptionManager<GameRoomDb>());
  // const gameRoomDataManager = useRef(new SubscriptionManager<GameRoomP2p>());
  // const gameEventsDataManager = useRef(new SubscriptionManager<GameTableEventWithTransitionForWatcherP2p[]>());
  // const privatePlayerKnowledgeManager = useRef(new SubscriptionManager<PrivatePlayerKnowledgeStr>());
  // const userGameRoomDataManager = useRef(new SubscriptionManager<UserGameRoomData>());
  const userGameRoomPerspectiveStrManager = useRef(new SubscriptionManager<UserGameRoomPerspectiveStr>());

  const room = joinRoom(trysteroConfig, gameInstanceId, (error: {
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

  // const [txUserGameRoomData, rxUserGameRoomDataStr] = room.makeAction<UserGameRoomData>(P2P_GAME_USER_GAME_ROOM_DATA_ACTION_KEY);
  const [txUserGameRoomPerspectiveStr, rxUserGameRoomPerspectiveStrRaw] = room.makeAction<UserGameRoomPerspectiveStr>(P2P_GAME_USER_GAME_ROOM_DATA_ACTION_KEY);
  // const [txPublicGameTableData, rxPublicGameTableDataRaw] = room.makeAction<GameRoomDb>(P2P_GAME_TABLE_ACTION_KEY);
  // const [txGameRoom, rxGameRoomRaw] = room.makeAction<GameRoomP2p>(P2P_GAME_ROOM_ACTION_KEY);
  // const [txPublicGameEventsDataStr, rxPublicGameEventsDataRawStr] = room.makeAction<GameTableEventForWatcherP2pString[]>(P2P_GAME_ACTIONS_ACTION_KEY);
  // const [txPrivatePlayerKnowledgeStr, rxPrivatePlayerKnowledgeStrRaw] = room.makeAction<PrivatePlayerKnowledgeStr>(P2P_GAME_PRIVATE_PLAYER_KNOWLEDGE_DATA_ACTION_KEY)
  // const [userGameRoomData, setUserGameRoomData] = useState<UserGameRoomData | null>(null);
  

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

  rxUserGameRoomPerspectiveStrRaw((userGameRoomPerspectiveStr: UserGameRoomPerspectiveStr, peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('🎮 Observer: Received user game room data from peer:', peerId);
    console.log('🎮 Observer: Data length:', userGameRoomPerspectiveStr.length, 'characters');
    // Notify string subscribers
    setUserGameRoomPerspectiveStr(userGameRoomPerspectiveStr);
    userGameRoomPerspectiveStrManager.current.notifyData(userGameRoomPerspectiveStr, peerId);
    // Parse and notify object subscribers
    // const parsedData = JSON.parse(userGameRoomDataStr);
    // const userGameRoomData = UserGameRoomDataSchema.parse(parsedData);
    // // setUserGameRoomData(userGameRoomData);
    // userGameRoomDataManager.current.notifyData(userGameRoomData, peerId);
  });

  // rxPublicGameTableDataRaw((gameTable: GameRoomDb, peer: string) => {
  //   const peerId = PeerIdSchema.parse(peer);
  //   console.log('🎮 Received game table data from peer:', peerId, gameTable);
  //   gameTableDataManager.current.notifyData(gameTable, peerId);
  // });

  // rxGameRoomRaw((gameRoomP2p: GameRoomP2p, peer: string) => {
  //   const peerId = PeerIdSchema.parse(peer);
  //   console.log('🎮 Received game room data from peer:', peerId, gameRoomP2p);
  //   gameRoomDataManager.current.notifyData(gameRoomP2p, peerId);
  // });

  // rxPublicGameEventsDataRawStr((gameEventStrs: GameTableEventForWatcherP2pString[], peer: string) => {
  //   const peerId = PeerIdSchema.parse(peer);
  //   console.log('🎮 Received game events data from peer:', peerId, gameEventStrs);
  //   const gameEvents = gameEventStrs.map(GameTableEventForWatcherP2pSchemaToolbox.hydrateFromString);
  //   gameEventsDataManager.current.notifyData(gameEvents, peerId);
  // });

  // rxPrivatePlayerKnowledgeStrRaw((privatePlayerKnowledge: PrivatePlayerKnowledgeStr, peer: string) => {
  //   const peerId = PeerIdSchema.parse(peer);
  //   console.log('🎮 Received private player knowledge data from peer:', peerId, privatePlayerKnowledge);
  //   privatePlayerKnowledgeManager.current.notifyData(privatePlayerKnowledge, peerId);
  // });

  // Expose subscription functions that return unsubscribe functions
  const rxPlayerProfile = (handler: (data: PublicPlayerProfile, peer: PeerId) => void): (() => void) => {
    return playerProfileManager.current.subscribeData(handler);
  };

  const rxPlayerActionStr = (handler: (data: PlayerP2pActionStr, peer: PeerId) => void): (() => void) => {
    return playerActionStrManager.current.subscribeData(handler);
  };

  const rxUserGameRoomPerspectiveStr = (handler: (data: UserGameRoomPerspectiveStr, peer: PeerId) => void): (() => void) => {
    return userGameRoomPerspectiveStrManager.current.subscribeData(handler);
  };

  // const rxPublicGameRoomData = (handler: (data: GameRoomP2p, peer: PeerId) => void): (() => void) => {
  //   return gameRoomDataManager.current.subscribeData(handler);
  // };

  // // const rxGameRoom = (handler: (data: GameRoomP2p, peer: PeerId) => void): (() => void) => {
  // //   return gameRoomDataManager.current.subscribeData(handler);
  // // };

  // const rxPublicGameEventsData = (handler: (data: GameTableEventWithTransitionForWatcherP2p[], peer: PeerId) => void): (() => void) => {
  //   return gameEventsDataManager.current.subscribeData(handler);
  // };

  // const txUserGameRoomData = (userGameRoomData: UserGameRoomData, peer: string) => {
  //   const peerId = PeerIdSchema.parse(peer);
  //   console.log('🎮 Sending user game room data:', peerId, userGameRoomData);
  //   userGameRoomDataManager.current.notifyData(userGameRoomData, peerId);
  // };

  // const rxPrivatePlayerKnowledgeStr = (handler: (data: PrivatePlayerKnowledgeStr, peer: PeerId) => void): (() => void) => {
  //   return privatePlayerKnowledgeManager.current.subscribeData(handler);
  // };

  const onRoomPeerJoin = (handler: (peer: PeerId) => void): (() => void) => {
    return onRoomPeerJoinManager.current.subscribe(handler);
  };

  const onRoomPeerLeave = (handler: (peer: PeerId) => void): (() => void) => {
    return onRoomPeerLeaveManager.current.subscribe(handler);
  };

  const peers = room.getPeers();
  const connectionStatus = `Connected to ${peers.length} peers`;


  const retVal: IP2pRawRoomValue = {
    // gameRoomId,
    // gameTableId,
    gameInstanceId,
    requestedAction,

    room,
    connectionStatus,
    connectionEvents,

    txPlayerProfile,
    txPlayerActionStr,
    // txPublicGameTableData,
    // txGameRoom,
    // txPublicGameEventsDataStr,
    // txPrivatePlayerKnowledgeStr,

    onRoomPeerJoin,
    onRoomPeerLeave,

    rxPlayerProfile,
    rxPlayerActionStr,
    // rxPublicGameTableData,
    // rxPublicGameRoomData,
    // rxPublicGameEventsData,
    // rxPrivatePlayerKnowledgeStr,

    userGameRoomPerspectiveStr,

    txUserGameRoomPerspectiveStr,
    rxUserGameRoomPerspectiveStr,
  };

  return (
    <P2pRawRoomContext.Provider value={retVal}>
      {children}
    </P2pRawRoomContext.Provider>
  )
}


export const useP2pRawRoomContext = (): IP2pRawRoomValue => {
  const context = useContext(P2pRawRoomContext);
  if (!context) {
    throw new Error('useP2pRawRoomContext must be used within a P2pRawRoomContextProvider');
  }
  return context;
}
