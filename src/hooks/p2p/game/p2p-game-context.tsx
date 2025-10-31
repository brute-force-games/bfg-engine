import { createContext, useContext } from "react";
import { IP2pGame, IP2pGameProps, useP2pGame } from "./use-p2p-game";
import { GameTableAccessRole } from "~/models/game-roles";
import { PrivatePlayerProfile } from "~/models/player-profile/private-player-profile";
import { useHostedP2pGameWithStore } from "./use-hosted-p2p-game-with-store";


export interface IP2pGameValue extends IP2pGame {
  myPlayerProfile: PrivatePlayerProfile | null;
  myGameTableAccess: GameTableAccessRole;

  // room: Room

  // connectionStatus: string
  // connectionEvents: ConnectionEvent[]

  // peers: PeerId[];
  // peerPlayers: Map<PeerId, PublicPlayerProfile>
  // allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  // gameTable: GameTable | null;
  // gameActions: DbGameTableAction[];

  // txPlayerActionStr: (actionStr: PlayerP2pActionStr) => void
  // rxPlayerActionStr: (callback: (actionStr: PlayerP2pActionStr, peer: PeerId) => void) => void
  
  // refreshConnection: () => void
}


export interface IP2pGameContextProviderProps extends IP2pGameProps {
  // gameTableId: GameTableId;
  myPlayerProfile: PrivatePlayerProfile | null;
  requestedRole: GameTableAccessRole;
  // roomEventHandlers: IP2pGameRoomEventHandlers;
  children: React.ReactNode;
}

const P2pGameContext = createContext<IP2pGameValue | null>(null);

export const P2pGameContextProvider = ({ 
  gameTableId,
  myPlayerProfile,
  requestedRole,
  // roomEventHandlers,
  children 
}: IP2pGameContextProviderProps) => {

  const isValidHost = requestedRole === 'host' && myPlayerProfile;

  const p2pGame = isValidHost ? 
    useHostedP2pGameWithStore(gameTableId, myPlayerProfile) : 
    useP2pGame({
      gameTableId,
      myPlayerProfile,
      requestedRole,
    });

  // if (requestedRole === 'host' && myPlayerProfile) {
  //   return (
  //     <P2pHostedGameContextProvider
  //       gameTableId={gameTableId}
  //       // myPlayerProfile={myPlayerProfile}
  //       hostPlayerProfile={myPlayerProfile}
  //       children={children}
  //     />
  //   )
  // }

  // const p2pGame = useP2pGame({
  //   gameTableId,
  //   myPlayerProfile,
  //   requestedRole,
  // });

  const retVal: IP2pGameValue = {
    ...p2pGame,
    myPlayerProfile,
  };

  return (
    <P2pGameContext.Provider value={retVal}>
      {children}
    </P2pGameContext.Provider>
  )
}


export const useP2pGameContext = (): IP2pGameValue => {
  const context = useContext(P2pGameContext);
  if (!context) {
    throw new Error('useP2pGameContext must be used within a P2pGameContextProvider');
  }
  return context;
}

// export const useP2pGame = (
//   gameTableId: GameTableId,
//   myPlayerProfile: PublicPlayerProfile | null,
//   roomEventHandlers: IP2pGameRoomEventHandlers = {}
// ): IP2pGameValue => {
  
//   const [gameTable, setGameTable] = useState<GameTable | null>(null)
//   const [gameActions, setGameActions] = useState<DbGameTableAction[]>([])
//   const [peers, setPeers] = useState<PeerId[]>([])
//   const [peerPlayers, setPeerPlayers] = useState<Map<PeerId, PublicPlayerProfile>>(new Map())
//   const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([]);

//   // Create room - gets recreated on every render
//   const gameHosting = useGameHosting();
//   const trysteroConfig = gameHosting.getTrysteroConfig();
  
//   const room = joinRoom(trysteroConfig, gameTableId, (error: {
//     error: string;
//     appId: string;
//     roomId: string;
//     peerId: string;
//   }) => {
//     console.error('Join error:', error)
//     addConnectionEvent('join-error', `Join error: ${error.error}`, 0);
//   });
//   console.log('joined p2p game room', room);

//   const addConnectionEvent = (type: ConnectionEvent['type'], message: string, peerCount: number) => {
//     const event: ConnectionEvent = {
//       type,
//       timestamp: new Date(),
//       peerCount,
//       message
//     };
//     console.log(`📡 [${event.timestamp.toLocaleTimeString()}] ${event.message}`);
//     setConnectionEvents(prev => [...prev, event]);
//   };

//   const [, rxPublicGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
//   const [, rxPublicGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);
//   const [txPlayerProfile, rxPlayerProfile] = room.makeAction<PublicPlayerProfile>(P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY)
//   const [txPlayerActionStr, rxPlayerActionStr] = room.makeAction<PlayerP2pActionStr>(P2P_GAME_PLAYER_ACTION_DATA_ACTION_KEY)

//   const connectionStatus = `Connected to ${peers.length} peers; Connected to ${peerPlayers.size} players`;

//   // Initialize connection event on mount
//   useEffect(() => {
//     addConnectionEvent('initialized', 'P2P game connection initialized', 0);

//     return () => {
//       console.log('🔌 Leaving P2P game room');
//       // room.leave();
//     }
//   }, []);


//   room.onPeerJoin(peer => {
//     const peerId = PeerIdSchema.parse(peer);
//     console.log('Peer joined:', peerId)

//     if (!peers.includes(peerId)) {
//       setPeers(prev => [...prev, peerId]);
//       addConnectionEvent('peer-joined', `Peer joined (total: ${peers.length})`, peers.length);
//     }

//     // Only send player profile if we have one (observers don't send profiles)
//     if (myPlayerProfile) {
//       console.log('Sending my player profile to peer:', peerId, myPlayerProfile)
//       txPlayerProfile(myPlayerProfile, peerId);
//     }

//     if (roomEventHandlers.onPeerJoin) {
//       roomEventHandlers.onPeerJoin(peerId);
//     }
//   })

//   room.onPeerLeave(peer => {
//     const peerId = PeerIdSchema.parse(peer);
//     console.log('Peer left:', peerId)
//     setPeerPlayers(prev => {
//       const updated = new Map(prev);
//       updated.delete(peerId);
//       return updated;
//     });
//     if (peers.includes(peerId)) {
//       setPeers(prev => prev.filter(p => p !== peerId));
//       addConnectionEvent('peer-left', `Peer left (total: ${peers.length})`, peers.length);
//     }

//     if (roomEventHandlers.onPeerLeave) {
//       roomEventHandlers.onPeerLeave(peerId);
//     }
//   })

//   rxPublicGameTableData((publicGameTableData: GameTable, peer: string) => {
//     console.log('🎮 Received game table data from peer:', peer, publicGameTableData)
//     setGameTable(publicGameTableData)
//   })

//   rxPublicGameActionsData((publicGameActionsData: DbGameTableAction[], peer: string) => {
//     console.log('🎮 Received game actions data from peer:', peer, publicGameActionsData)
//     setGameActions(publicGameActionsData)
//   })

//   rxPlayerProfile((playerProfile: PublicPlayerProfile, peer: string) => {
//     console.log('🎮 Received player profile data from peer:', peer, playerProfile)
//     const peerId = PeerIdSchema.parse(peer);
//     setPeerPlayers(prev => new Map(prev).set(peerId, playerProfile))
//   })

//   const otherPlayerProfiles = new Map<PlayerProfileId, PublicPlayerProfile>([
//     ...Array.from(peerPlayers.values()).map(profile => [profile.id, profile] as const),
//   ]);

//   const allPlayerProfiles = new Map<PlayerProfileId, PublicPlayerProfile>(otherPlayerProfiles);
//   if (myPlayerProfile) {
//     allPlayerProfiles.set(myPlayerProfile.id, myPlayerProfile);
//   }

//   const refreshConnection = () => {
//     addConnectionEvent('auto-refresh', 'Connection refreshed manually', peers.length);
//     setPeerPlayers(new Map());
//     setPeers([]);
//     setGameTable(null);
//     setGameActions([]);
//     // Room will be recreated on next render automatically
//   };

  
//   return {
//     room,
//     gameTable,
//     gameActions,
//     connectionStatus,
//     connectionEvents,
//     peers,
//     peerPlayers,
//     allPlayerProfiles,
    
//     txPlayerActionStr,
//     rxPlayerActionStr: (callback: (actionStr: PlayerP2pActionStr, peer: PeerId) => void) => {
//       rxPlayerActionStr((move: PlayerP2pActionStr, peer: string) => {
//         const peerId = PeerIdSchema.parse(peer);
//         callback(move, peerId);
//       });
//     },
//     refreshConnection,
//   }
// }
