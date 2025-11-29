import { IBfgGameTableForObserver, type IBfgGameTableForAccessLevelNone } from "./p2p-game-types";
import { adaptToGameRoomAsObserver } from "./watcher/adapt-to-game-room-as-observer";
import { useGameRoomWithUnknownAccessMode } from "./use-game-room-with-unknown-access-mode";


export const useGameRoomAsObserver = (): IBfgGameTableForObserver | IBfgGameTableForAccessLevelNone => {

  const gameRoomUnknown = useGameRoomWithUnknownAccessMode();

  const gameRoom = adaptToGameRoomAsObserver(gameRoomUnknown);

  return gameRoom;
  
  // const p2pGameRoom = useP2pGameRoomContext();
  // const roomUserDetails = useGameInstanceUserDetails(p2pGameRoom.gameInstanceId, 'watch');

  // const [peers, setPeers] = useState<PeerId[]>([]);
  // const [peerIdsToPlayerIds, setPeerIdsToPlayerIds] = useState<Map<PeerId, PlayerProfileId>>(new Map());
  // const [allPlayerProfiles, setAllPlayerProfiles] = useState<Map<PlayerProfileId, PublicPlayerProfile>>(new Map());
  // const [gameRoom, setGameRoom] = useState<GameRoomP2p | null>(null);
  // const [gameEvents, setGameEvents] = useState<GameTableEventForWatcherP2p[]>([]);

  // useEffect(() => {
  //   const onRoomPeerJoinUnsubscribe = p2pGameRoom.onRoomPeerJoin((peerId: PeerId) => {
  //     setPeers(prev => [...prev, peerId]);
  //   });

  //   const onRoomPeerLeaveUnsubscribe = p2pGameRoom.onRoomPeerLeave((peerId: PeerId) => {
  //     setPeers(prev => prev.filter(p => p !== peerId));
  //   });

  //   const rxPlayerProfileUnsubscribe = p2pGameRoom.rxPlayerProfile((playerProfile, peerId) => {
  //     setAllPlayerProfiles(prev => {
  //       const newMap = new Map(prev);
  //       newMap.set(playerProfile.id, playerProfile);
  //       return newMap;
  //     });
  //     setPeerIdsToPlayerIds(prev => {
  //       const newMap = new Map(prev);
  //       newMap.set(peerId, playerProfile.id);
  //       return newMap;
  //     });
  //   });

  //   const rxPublicGameRoomDataUnsubscribe = p2pGameRoom.rxPublicGameRoomData((gameRoom, peerId) => {
  //     const isFromHost = isMessageFromHost(peerId);
  //     if (!isFromHost) {
  //       console.log('🎮 Received game room data from non-host peer:', peerId, gameRoom);
  //       return;
  //     }
  //     setGameRoom(gameRoom);
  //   });

  //   const rxPublicGameEventsDataUnsubscribe = p2pGameRoom.rxPublicGameEventsData((gameEvents, peerId) => {
  //     const isFromHost = isMessageFromHost(peerId);
  //     if (!isFromHost) {
  //       console.log('🎮 Received game events data from non-host peer:', peerId, gameEvents);
  //       return;
  //     }
  //     setGameEvents(gameEvents);
  //   });

  //   return () => {
  //     onRoomPeerJoinUnsubscribe();
  //     onRoomPeerLeaveUnsubscribe();
  //     rxPlayerProfileUnsubscribe();
  //     rxPublicGameRoomDataUnsubscribe();
  //     rxPublicGameEventsDataUnsubscribe();
  //   };
  // }, []);

  // const p2pDetails: IP2pDetails = {
  //   peerIds: peers,
  //   peerIdsToPlayerIds,
  //   allPlayerProfiles,
  //   myPeerProfile: roomUserDetails.myPlayerProfile,
  //   connectionStatus: p2pGameRoom.connectionStatus,
  //   connectionEvents: p2pGameRoom.connectionEvents,
  // }

  // const gameRegistry = useGameRegistry();
  // const gameMetadata = gameRoom ? gameRegistry.getGameMetadata(gameRoom.gameTitle) : null;

  // const latestGameEventForWatcher = gameEvents[gameEvents.length - 1];

  // const publicGameDetails: IPublicBfgGameDetails | null = gameRoom && gameMetadata ? {
  //   gameMetadata,
  //   gameRoom,
  //   latestWatcherGameEvent: latestGameEventForWatcher,
  //   watcherGameEvents: gameEvents,
  //   allPlayerProfiles,
  // } : null;

  // const retVal: IBfgGameTableForObserver = {
  //   gameInstanceId: p2pGameRoom.gameInstanceId,
  //   gameMetadata,

  //   accessRole: 'watch',
  //   maxAllowedAccessRole: roomUserDetails.maxAllowedAccessRole,
  //   allowedRoles: roomUserDetails.allowedRoles,

  //   myObserverProfile: null,

  //   p2pDetails,
  //   publicGameDetails,
  // }

  // return retVal;
}
