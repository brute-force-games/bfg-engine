// import { IBfgGameTableForObserver, IPublicBfgGameDetails, type GameRoomModeHostPlusP2pAccess, type GameRoomModeP2pOnlyAccess, type IP2pDetails } from "../p2p-game-types";
// import { useGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry-hook";
// import { type RoomUserDetails } from "../use-bfg-game-instance";
// import { useMyDefaultPlayerProfile } from "../../../..";
// import type { GameBoardEventForDb } from "../../../../models/tinybase/game-board-event";


// export const adaptToGameRoomAsP2pObserver = (
//   gameRoomForP2p: GameRoomModeP2pOnlyAccess | GameRoomModeHostPlusP2pAccess,
//   p2pDetails: IP2pDetails,
// ): IBfgGameTableForObserver | null => {
  
//   const p2pRawRoom = gameRoomForP2p.p2pRawRoom;

//   // const p2pDetails = useP2pDetailsFromRawRoom(p2pRawRoom, null);

//   const myDefaultPlayerProfile = useMyDefaultPlayerProfile();
//   // const [peers, setPeers] = useState<PeerId[]>([]);
//   // const [peerIdsToPlayerIds, setPeerIdsToPlayerIds] = useState<Map<PeerId, PlayerProfileId>>(new Map());
//   // const [allPlayerProfiles, setAllPlayerProfiles] = useState<Map<PlayerProfileId, PublicPlayerProfile>>(new Map());
//   // const [gameRoom, setGameRoom] = useState<GameRoomP2p | null>(null);
//   // const [gameEvents, setGameEvents] = useState<GameTableEventForWatcherP2p[]>([]);
//   // const [watcherGameEvents, setWatcherGameEvents] = useState<GameTableEventForWatcherP2p[]>([]);

//   // useEffect(() => {
//   //   // const onRoomPeerJoinUnsubscribe = p2pRawRoom.onRoomPeerJoin((peerId: PeerId) => {
//   //   //   setPeers(prev => [...prev, peerId]);
//   //   // });

//   //   // const onRoomPeerLeaveUnsubscribe = p2pRawRoom.onRoomPeerLeave((peerId: PeerId) => {
//   //   //   setPeers(prev => prev.filter(p => p !== peerId));
//   //   // });

//   //   // const rxPlayerProfileUnsubscribe = p2pRawRoom.rxPlayerProfile((playerProfile, peerId) => {
//   //   //   setAllPlayerProfiles(prev => {
//   //   //     const newMap = new Map(prev);
//   //   //     newMap.set(playerProfile.id, playerProfile);
//   //   //     return newMap;
//   //   //   });
//   //   //   setPeerIdsToPlayerIds(prev => {
//   //   //     const newMap = new Map(prev);
//   //   //     newMap.set(peerId, playerProfile.id);
//   //   //     return newMap;
//   //   //   });
//   //   // });

//   //   // const rxPublicGameRoomDataUnsubscribe = p2pGameRoom.rxPublicGameRoomData((gameRoom, peerId) => {
//   //   //   const isFromHost = isMessageFromHost(peerId);
//   //   //   if (!isFromHost) {
//   //   //     console.log('🎮 Received game room data from non-host peer:', peerId, gameRoom);
//   //   //     return;
//   //   //   }
//   //   //   setGameRoom(gameRoom);
//   //   // });

//   //   // const rxPublicGameEventsDataUnsubscribe = p2pGameRoom.rxPublicGameEventsData((gameEvents, peerId) => {
//   //   //   const isFromHost = isMessageFromHost(peerId);
//   //   //   if (!isFromHost) {
//   //   //     console.log('🎮 Received game events data from non-host peer:', peerId, gameEvents);
//   //   //     return;
//   //   //   }
//   //   //   setGameEvents(gameEvents);
//   //   // });

//   //   // return () => {
//   //   //   onRoomPeerJoinUnsubscribe();
//   //   //   onRoomPeerLeaveUnsubscribe();
//   //   //   rxPlayerProfileUnsubscribe();
//   //   //   // rxUserGameRoomDataStrUnsubscribe();
//   //   //   // rxPublicGameRoomDataUnsubscribe();
//   //   //   // rxPublicGameEventsDataUnsubscribe();
//   //   // };
//   // }, []);


//   // const myGamePlayerProfile = watcherGameRoomData?.gameRoom.players
//   //   .find(player => player.playerProfile.id === myDefaultPlayerProfile?.id)?.playerProfile ?? null;
//   // const myGameHostProfile = watcherGameRoomData?.gameRoom.players
//   //   .find(player => player.playerProfile.id === myDefaultPlayerProfile?.id)?.playerProfile ?? null;

//   // const myPlayerProfile = myGamePlayerProfile !== null ? myDefaultPlayerProfile : null;
//   // const myHostProfile = myGameHostProfile !== null ? myDefaultPlayerProfile : null;

//   // const roomUserDetails: RoomUserDetails = {
//   //   currentAccessRole: 'watch',
//   //   maxAllowedAccessRole: 'watch',
//   //   allowedRoles: ['watch'],
//   //   myPlayerProfile,
//   //   myHostProfile,
//   // };
  
//   // const p2pDetails: IP2pDetails = {
//   //   peerIds: peers,
//   //   peerIdsToPlayerIds,
//   //   allPlayerProfiles,
//   //   myPeerProfile: roomUserDetails.myPlayerProfile,
//   //   connectionStatus: p2pRawRoom.connectionStatus,
//   //   connectionEvents: p2pRawRoom.connectionEvents,
//   // }


  

//   // const publicGameDetails: IPublicBfgGameDetails | null = gameRoom && gameMetadata ? {
//   //   gameMetadata,
//   //   gameRoom,
//   //   latestWatcherGameEvent: latestGameEventForWatcher,
//   //   watcherGameEvents,
//   //   allPlayerProfiles,
//   // } : null;


//   const getPublicGameDetails = () => {

//     const gameRoom = gameRoomForP2p.accessMode === 'p2p-only' ? 
//       gameRoomForP2p.p2pGameRoom.userGameRoom?.gameRoom :
//       gameRoomForP2p.hostedGameRoom.gameRoom;

//     if (!gameRoom) {
//       return null;
//     }

//     const gameTitle = gameRoom.gameTitle;
//     const gameRegistry = useGameRegistry();
//     const gameMetadata = gameRegistry.getGameMetadata(gameTitle);
  
//     const getWatcherHistory = () => {
//       // const gameHistory = gameRoomForP2p.mode === 'p2p-only' ?
//       // gameRoomForP2p.p2pGameRoom.userGameRoom?.watcherGameHistory :
//       // gameRoomForP2p.hostedGameRoom.hostGameHistory;
//       if (gameRoomForP2p.accessMode === 'host+p2p') {
//         const hostGameHistory = gameRoomForP2p.hostedGameRoom.hostGameHistory;
//         const hostToWatcherHistoryAdapter = gameMetadata.accessLevelAdapters.hostEventTransitionToWatcherAccessLevelAdapter;
//         if (!hostToWatcherHistoryAdapter) {
//           console.error('❌ Host to watcher history adapter not found');
//           return [];
//         }
//         const watcherGameHistory = hostGameHistory.map(hostGameEvent => {
//           // Convert GameTableEventForHostP2p to GameBoardEventForDb format
//           const gameBoardEventForDb: GameBoardEventForDb = {
//             createdAt: hostGameEvent.createdAt,
//             stepIndex: hostGameEvent.stepIndex,
//             transitionForHost: {
//               event: hostGameEvent.event,
//               change: hostGameEvent.outcome,
//               nextBoardState: hostGameEvent.nextGameHostState,
//             },
//           };
//           return hostToWatcherHistoryAdapter(gameBoardEventForDb);
//         });

//         return watcherGameHistory;
//       }
      
//       if (gameRoomForP2p.accessMode === 'p2p-only') {
//         if (gameRoomForP2p.p2pGameRoom.userGameRoom?.role === 'watcher') {
//           return gameRoomForP2p.p2pGameRoom.userGameRoom.watcherGameHistory;
//         }
//       }

//       return [];

//     }

//     const watcherGameHistory = getWatcherHistory();
    
//     // Return null if there are no events, as latestWatcherGameEvent is required
//     if (watcherGameHistory.length === 0) {
//       return null;
//     }
    
//     const latestGameEventForWatcher = watcherGameHistory[watcherGameHistory.length - 1];
    
//     const retVal: IPublicBfgGameDetails = {
//       gameMetadata,
//       gameRoom,
//       latestWatcherGameEvent: latestGameEventForWatcher,
//       watcherGameEvents: watcherGameHistory,
//       allPlayerProfiles: p2pDetails.allPlayerProfiles,
//     }

//     return retVal;
//   }

//   const publicGameDetails = getPublicGameDetails();


//   const myGamePlayerProfile = publicGameDetails?.gameRoom.players
//     .find(player => player.playerProfile.id === myDefaultPlayerProfile?.id)?.playerProfile ?? null;
//   const myGameHostProfile = publicGameDetails?.gameRoom.players
//     .find(player => player.playerProfile.id === myDefaultPlayerProfile?.id)?.playerProfile ?? null;

//   const myPlayerProfile = myGamePlayerProfile !== null ? myDefaultPlayerProfile : null;
//   const myHostProfile = myGameHostProfile !== null ? myDefaultPlayerProfile : null;

//   const roomUserDetails: RoomUserDetails = {
//     currentAccessLevel: 'observer',
//     maxAllowedAccessLevel: 'observer',
//     allowedLevels: ['observer'],
//     myPlayerProfile,
//     myHostProfile,
//   };

//   // const p2pDetails: IP2pDetails = {
//   //   peerIds: peers,
//   //   peerIdsToPlayerIds,
//   //   allPlayerProfiles,
//   //   myPeerProfile: roomUserDetails.myPlayerProfile,
//   //   connectionStatus: p2pRawRoom.connectionStatus,
//   //   connectionEvents: p2pRawRoom.connectionEvents,
//   // }

//   const retVal: IBfgGameTableForObserver = {
//     gameInstanceId: p2pRawRoom.gameInstanceId,
//     gameMetadata: publicGameDetails?.gameMetadata ?? null,

//     accessLevel: 'observer',
//     maxAllowedAccessLevel: roomUserDetails.maxAllowedAccessLevel,
//     allowedLevels: roomUserDetails.allowedLevels,

//     myObserverProfile: null,

//     p2pDetails,
//     publicGameDetails,
//   }

//   return retVal;
// }
