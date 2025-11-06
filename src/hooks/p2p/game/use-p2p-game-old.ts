// import { useState, useEffect } from "react";
// import { joinRoom, Room } from "trystero";
// import { P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_GAME_PLAYER_ACTION_DATA_ACTION_KEY, P2P_GAME_TABLE_ACTION_KEY, P2P_GAME_ACTIONS_ACTION_KEY, P2P_GAME_PRIVATE_PLAYER_KNOWLEDGE_DATA_ACTION_KEY } from "../../../ui/components/constants"; 
// import { GameTable } from "../../../models/game-table/game-table";
// import { DbGameTableAction } from "../../../models/game-table/game-table-action";
// import { PublicPlayerProfile } from "../../../models/player-profile/public-player-profile";
// import { GameTableId, PlayerProfileId } from "../../../models/types/bfg-branded-ids"
// import { PrivatePlayerProfile, useGameHosting, useGameRegistry } from "../../../index";
// import { ConnectionEvent, PeerId, PeerIdSchema, PlayerP2pActionStr, PrivatePlayerKnowledgeStr } from "../p2p-types";
// import { GameTableAccessRole } from "~/models/game-roles";
// // import { getTableAccessRoleForProfile, hasTableAccessRoleForProfile } from "~/models/game-table/utils";
// // import { BfgGameEngineMetadata } from "~/models/bfg-game-engines";
// // import { useRoom } from "~/hooks/use-trystero-room";
// // import { useSupabaseRoom } from "~/hooks/use-trystero-supabase-room";
// // import { useMqttRoom } from "~/hooks/use-trystero-mqtt-room";
// // import { useTorrentRoom } from "~/hooks/use-trystero-torrent-room";


// export interface IP2pGameRoomEventHandlers {
//   onPeerJoin?: (peer: PeerId) => void
//   onPeerLeave?: (peer: PeerId) => void
// }

// // export interface IP2pGame {
// //   room: Room
// //   connectionStatus: string
// //   connectionEvents: ConnectionEvent[]

// //   peers: PeerId[];
// //   peerPlayers: Map<PeerId, PublicPlayerProfile>
// //   allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

// //   gameMetadata: BfgGameEngineMetadata | null;
// //   gameTable: GameTable | null;
// //   gameActions: DbGameTableAction[];

// //   myPlayerProfile: PrivatePlayerProfile | null;
// //   hasRequestedTableAccess: boolean;
// //   myGameTableAccess: GameTableAccessRole;

// //   setRoomEventHandlers: (eventHandlers: IP2pGameRoomEventHandlers) => void
// //   clearRoomEventHandlers: () => void

// //   // const [txGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
// //   // const [txGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);

// //   txPublicGameTableData: (gameTable: GameTable) => void
// //   txPublicGameActionsData: (gameActions: DbGameTableAction[]) => void

// //   txPlayerActionStr: (actionStr: PlayerP2pActionStr) => void
// //   rxPlayerActionStr: (callback: (actionStr: PlayerP2pActionStr, peer: PeerId) => void) => void
  
// //   txPrivatePlayerKnowledgeStr: (privatePlayerKnowledge: PrivatePlayerKnowledgeStr, peer: PeerId) => void
// //   rxPrivatePlayerKnowledgeStr: (callback: (privatePlayerKnowledge: PrivatePlayerKnowledgeStr, peer: PeerId) => void) => void
  
// //   refreshConnection: () => void
// // }


// export interface IP2pGameProps {
//   gameTableId: GameTableId;
//   myPlayerProfile: PrivatePlayerProfile | null;
//   requestedRole: GameTableAccessRole;
// }


// export const useP2pGame = ({
//   gameTableId,
//   myPlayerProfile,
//   requestedRole,
// }: IP2pGameProps): IP2pGame => {

//   const [gameTable, setGameTable] = useState<GameTable | null>(null)
//   const [gameActions, setGameActions] = useState<DbGameTableAction[]>([])
//   const [peers, setPeers] = useState<PeerId[]>([])
//   const [peerPlayers, setPeerPlayers] = useState<Map<PeerId, PublicPlayerProfile>>(new Map())
//   const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([]);

//   let roomEventHandlers: IP2pGameRoomEventHandlers | undefined = undefined;

//   const setRoomEventHandlers = (eventHandlers: IP2pGameRoomEventHandlers) => {
//     if (roomEventHandlers !== undefined) {
//       // throw new Error('Room event handlers already set');
//       console.warn('Room event handlers already set');
//     }
//     roomEventHandlers = eventHandlers;
//   }

//   const clearRoomEventHandlers = () => {
//     roomEventHandlers = undefined;
//   }

//   // Create room - gets recreated on every render
//   const gameHosting = useGameHosting();
//   const trysteroConfig = gameHosting.getTrysteroConfig();

//   console.log('useP2pGame - gameTableId', gameTableId)
  
//   const room = joinRoom(trysteroConfig, gameTableId, (error: {
//     error: string;
//     appId: string;
//     roomId: string;
//     peerId: string;
//   }) => {
//     console.error('Join error:', error)
//     addConnectionEvent('join-error', `Join error: ${error.error}`, 0);
//   });
//   // const room = useRoom(trysteroConfig, gameTableId);
//   // const room = useSupabaseRoom(gameTableId);
//   // const room = useTorrentRoom(trysteroConfig, gameTableId);
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

//   const [txPlayerProfile, rxPlayerProfile] = room.makeAction<PublicPlayerProfile>(P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY)
//   const [txPlayerActionStr, rxPlayerActionStr] = room.makeAction<PlayerP2pActionStr>(P2P_GAME_PLAYER_ACTION_DATA_ACTION_KEY)

//   const [txPublicGameTableData, rxPublicGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
//   const [txPublicGameActionsData, rxPublicGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);
//   const [txPrivatePlayerKnowledgeStr, rxPrivatePlayerKnowledgeStr] = room.makeAction<PrivatePlayerKnowledgeStr>(P2P_GAME_PRIVATE_PLAYER_KNOWLEDGE_DATA_ACTION_KEY)

//   const connectionStatus = `Connected to ${peers.length} peers; Connected to ${peerPlayers.size} players`;

//   // Initialize connection event on mount
//   useEffect(() => {
//     addConnectionEvent('initialized', 'P2P game connection initialized', 0);

//     return () => {
//       console.log('🔌 Leaving P2P game room');
//       room.leave();
//     }
//   }, []);

//   // const isHostPeerId = (peerId: PeerId) => {
//   //   // return peerId === room.peerId;
//   //   return true;
//   // }


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

//     if (roomEventHandlers?.onPeerJoin) {
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

//     if (roomEventHandlers?.onPeerLeave) {
//       roomEventHandlers.onPeerLeave(peerId);
//     }
//   })

//   rxPublicGameTableData((publicGameTableData: GameTable, peer: string) => {
//     const peerId = PeerIdSchema.parse(peer);
//     console.log('🎮 Received game table data from peer:', peerId, publicGameTableData)
//     setGameTable(publicGameTableData)
//   })

//   rxPublicGameActionsData((publicGameActionsData: DbGameTableAction[], peer: string) => {
//     const peerId = PeerIdSchema.parse(peer);
//     console.log('🎮 Received game actions data from peer:', peerId, publicGameActionsData)
//     setGameActions(publicGameActionsData)
//   })

//   rxPlayerProfile((playerProfile: PublicPlayerProfile, peer: string) => {
//     const peerId = PeerIdSchema.parse(peer);
//     console.log('🎮 Received player profile data from peer:', peerId, playerProfile)
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

//   const myPlayerProfileId = myPlayerProfile?.id ?? null;
//   const myGameTableAccess = getTableAccessRoleForProfile(myPlayerProfileId, gameTable, requestedRole);
//   const hasRequestedTableAccess = hasTableAccessRoleForProfile(myPlayerProfileId, gameTable, requestedRole);

//   const gameRegistry = useGameRegistry();
//   const gameMetadata = gameTable ?
//     gameRegistry.getGameMetadata(gameTable.gameTitle) :
//     null;
  
//   const retVal: IP2pGame = {
//     room,
//     gameMetadata,
//     gameTable,
//     gameActions,
//     connectionStatus,
//     connectionEvents,
    
//     myPlayerProfile,
//     myGameTableAccess,
//     hasRequestedTableAccess,

//     peers,
//     peerPlayers,
//     allPlayerProfiles,

//     setRoomEventHandlers,
//     clearRoomEventHandlers,

//     txPublicGameTableData,
//     txPublicGameActionsData,

//     txPlayerActionStr,
//     rxPlayerActionStr: (callback: (actionStr: PlayerP2pActionStr, peer: PeerId) => void) => {
//       rxPlayerActionStr((move: PlayerP2pActionStr, peer: string) => {
//         const peerId = PeerIdSchema.parse(peer);
//         callback(move, peerId);
//       });
//     },

//     txPrivatePlayerKnowledgeStr,
//     rxPrivatePlayerKnowledgeStr: (callback: (privatePlayerKnowledgeStr: PrivatePlayerKnowledgeStr, peer: PeerId) => void) => {
//       rxPrivatePlayerKnowledgeStr((privatePlayerKnowledgeStr: PrivatePlayerKnowledgeStr, peer: string) => {
//         const peerId = PeerIdSchema.parse(peer);
//         callback(privatePlayerKnowledgeStr, peerId);
//       });
//     },

//     refreshConnection,
//   }

//   return retVal;
// }
