import type { PrivatePlayerProfile } from "../../../../models/internal/player-profile/private-player-profile";
import { createBfgGameTableForAccessLevelNone, IBfgGameTableForPlayer } from "../p2p-game-types";
import type { GameRoomModeWithAccess, IBfgGameTableForAccessLevelNone } from "../p2p-game-types";
import { adaptToGameRoomAsHostPlayer } from "./adapt-to-game-room-as-host-player";
import { adaptToGameRoomAsP2pPlayer } from "./adapt-to-game-room-as-p2p-player";


const mergeAdaptedGameRooms = (
  adaptedForHost: IBfgGameTableForPlayer,
  adaptedForP2p: IBfgGameTableForPlayer,
): IBfgGameTableForPlayer => {

  const mergedGameRoom: IBfgGameTableForPlayer = {
    ...adaptedForP2p,
    ...adaptedForHost,
  };

  return mergedGameRoom;
}

export const adaptToGameRoomAsPlayer = (
  gameRoomUnknown: GameRoomModeWithAccess,
  playerProfile: PrivatePlayerProfile,
): IBfgGameTableForPlayer | IBfgGameTableForAccessLevelNone => {

  const { accessMode: mode } = gameRoomUnknown;

  if (mode === 'host-only') {
    const adaptedForHost = adaptToGameRoomAsHostPlayer(gameRoomUnknown, playerProfile);
    // return adaptedForHost;
    if (!adaptedForHost) {
      console.error('❌ Adapted game room for host not found');
      return createBfgGameTableForAccessLevelNone(gameRoomUnknown.gameInstanceId);
    }
    return adaptedForHost;
  }

  if (mode === 'p2p-only') {
    const adaptedForP2p = adaptToGameRoomAsP2pPlayer(gameRoomUnknown, playerProfile);
    // return adaptedForP2p;
    if (!adaptedForP2p) {
      console.error('❌ Adapted game room for P2P not found');
      return createBfgGameTableForAccessLevelNone(gameRoomUnknown.gameInstanceId);
    }
    return adaptedForP2p;
  }

  if (mode === 'host+p2p') {
    if (gameRoomUnknown.hostedGameRoom === null || gameRoomUnknown.p2pRawRoom === null) {
      console.error('❌ Hosted game room or P2P raw room not found');
      return createBfgGameTableForAccessLevelNone(gameRoomUnknown.gameInstanceId);
    }

    const adaptedForHost = adaptToGameRoomAsHostPlayer(gameRoomUnknown, playerProfile);
    const adaptedForP2p = adaptToGameRoomAsP2pPlayer(gameRoomUnknown, playerProfile);

    if (!adaptedForHost || !adaptedForP2p) {
      console.error('❌ Adapted game rooms not found for game room: ' + gameRoomUnknown.gameInstanceId);
      return createBfgGameTableForAccessLevelNone(gameRoomUnknown.gameInstanceId);
    }

    const mergedGameRoom = mergeAdaptedGameRooms(adaptedForHost, adaptedForP2p);
    return mergedGameRoom;
  }

  throw new Error(`Unknown game room mode for playing: ${mode}`);


  // const p2pGameRoom = useP2pGameRoomContext();
  // const roomUserDetails = useGameInstanceUserDetails(p2pGameRoom.gameInstanceId, 'play');
  // const myPlayerProfile = roomUserDetails.myPlayerProfile;

  // const [peers, setPeers] = useState<PeerId[]>([]);
  // const [peerIdsToPlayerIds, setPeerIdsToPlayerIds] = useState<Map<PeerId, PlayerProfileId>>(() => {
  //   const map = new Map<PeerId, PlayerProfileId>();
  //   if (myPlayerProfile) {
  //     const selfPeerId = PeerIdSchema.parse(selfId);
  //     map.set(selfPeerId, myPlayerProfile.id);
  //   }
  //   return map;
  // });
  
  // const [allPlayerProfiles, setAllPlayerProfiles] = useState<Map<PlayerProfileId, PublicPlayerProfile>>(new Map());
  // const [gameTable, _setGameTable] = useState<GameRoomDb | null>(null);
  // const [watcherGameEvents, _setWatcherGameEvents] = useState<GameTableEventForWatcherP2p[]>([]);
  // const [myPlayerGameEvents, _setMyPlayerGameEvents] = useState<GameTableEventForPlayerP2p[]>([]);

  // const { txPlayerProfile } = p2pGameRoom;

  // const gameRegistry = useGameRegistry();


  // const onPlayerAction = async (_playerAction: BfgGameActionByPlayer) => {
    
  //   if (!gameMetadata) {
  //     console.error('❌ Game metadata not found - cannot call onPlayerAction');
  //     return;
  //   }

  //   console.warn("Implement me - as player apply move from host");

  //   // const encoder = gameMetadata.encoders.playerActionEncoder;
    
  //   // if (encoder.format !== 'json-zod-object-string') {
  //   //   throw new Error('Player action encoder format is not json-zod-object-string');
  //   // }

  //   // const playerActionStr = encoder.encode(playerAction) as unknown as PlayerP2pActionStr;
  //   // txPlayerActionStr(playerActionStr);
  // }

  // // const myPlayerProfile = roomUserDetails.myPlayerProfile;
  // if (!myPlayerProfile) {
  //   console.error('❌ My player profile not found');
  //   return null;
  // }
  
  // useEffect(() => {
  //   // Send our profile immediately when joining
  //   const myPublicProfile = convertPrivateToPublicProfile(myPlayerProfile);
  //   console.log('🎮 Player: Broadcasting profile to all peers on join:', myPublicProfile);
  //   txPlayerProfile(myPublicProfile);
    
  //   const onRoomPeerJoinUnsubscribe = p2pGameRoom.onRoomPeerJoin((peerId: PeerId) => {
  //     console.log('🎮 Player: Peer joined (likely host):', peerId);
  //     setPeers(prev => [...prev, peerId]);
      
  //     // Send our profile to the new peer as well
  //     console.log('🎮 Player: Sending profile to new peer:', peerId, myPublicProfile);
  //     txPlayerProfile(myPublicProfile, peerId);
  //   });

  //   const onRoomPeerLeaveUnsubscribe = p2pGameRoom.onRoomPeerLeave((peerId: PeerId) => {
  //     console.log('🎮 Player: Peer left:', peerId);
  //     setPeers(prev => prev.filter(p => p !== peerId));
      
  //     // Clean up the peerPlayerIds mapping
  //     setPeerIdsToPlayerIds(prev => {
  //       const newMap = new Map(prev);
  //       newMap.delete(peerId);
  //       return newMap;
  //     });
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

  //   // const rxPublicGameTableDataUnsubscribe = p2pGameRoom.rxPublicGameTableData((gameTable, peerId) => {
  //   //   console.log('🎮 Received game table data from peer:', peerId, gameTable);
  //   //   setGameTable(gameTable);
  //   // });

  //   // const rxPublicGameActionsDataUnsubscribe = p2pGameRoom.rxPublicGameActionsData((gameActions, peerId) => {
  //   //   console.log('🎮 Received game actions data from peer:', peerId, gameActions);
  //   //   setGameActions(gameActions);
  //   // });

  //   // const rxPrivatePlayerKnowledgeStrUnsubscribe = p2pGameRoom.rxPrivatePlayerKnowledgeStr((privatePlayerKnowledgeStr, peerId) => {
  //   //   console.log('🎮 Player: Received private player knowledge from peer:', peerId);
  //   //   setMyPrivatePlayerKnowledgeStr(privatePlayerKnowledgeStr);
  //   // });

  //   return () => {
  //     onRoomPeerJoinUnsubscribe();
  //     onRoomPeerLeaveUnsubscribe();
  //     rxPlayerProfileUnsubscribe();
  //     // rxPublicGameTableDataUnsubscribe();
  //     // rxPublicGameActionsDataUnsubscribe();
  //     // rxPrivatePlayerKnowledgeStrUnsubscribe();
  //   };
  // }, [myPlayerProfile, txPlayerProfile, p2pGameRoom]);

  // // useEffect(() => {
  // //   doSendGameUpdates();
  // // }, [doSendGameUpdates])
  

  // if (!gameTable) {
  //   console.error('❌ Game data not ready');
  //   return null;
  // }

  // const myPlayerSeat = myPlayerProfile ? matchPlayerToSeat(myPlayerProfile.id, gameTable) : null;

  // if (!myPlayerSeat) {
  //   console.error('❌ My player seat not found');
  //   return null;
  // }

  // const p2pDetails: IP2pDetails = {
  //   peerIds: peers,
  //   peerIdsToPlayerIds,
  //   allPlayerProfiles,
  //   myPeerProfile: myPlayerProfile,
  //   connectionStatus: p2pGameRoom.connectionStatus,
  //   connectionEvents: p2pGameRoom.connectionEvents,
  // }

  // const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
  // const latestWatcherGameEvent = watcherGameEvents[watcherGameEvents.length - 1];
  // const latestMyPlayerGameEvent = myPlayerGameEvents[myPlayerGameEvents.length - 1];

  // const publicGameDetails: IPublicBfgGameDetails | null = gameTable ? {
  //   gameMetadata,
  //   gameRoom: gameTable,
  //   latestWatcherGameEvent,
  //   watcherGameEvents,
  //   allPlayerProfiles,
  // } : null;

  // const playerGameDetails: IPlayerBfgGameDetails = {
  //     gameMetadata,
  //     myPlayerProfile,
  //     allPlayerProfiles,
  //     gameRoom: gameTable,

  //     latestWatcherGameEvent,
  //     watcherGameEvents,

  //     latestPlayerGameEvent: latestMyPlayerGameEvent,
  //     playerGameEvents: myPlayerGameEvents,

  //     myPlayerSeat,
  //     onPlayerAction,
  //   } satisfies IPlayerBfgGameDetails;

  // const retVal: IBfgGameTableForPlayer = {
  //   gameInstanceId: p2pGameRoom.gameInstanceId,
  //   gameMetadata,

  //   accessRole: 'play',
  //   maxAllowedAccessRole: roomUserDetails.maxAllowedAccessRole,
  //   allowedRoles: roomUserDetails.allowedRoles,
  //   myPlayerProfile,

  //   p2pDetails,
  //   publicGameDetails,
  //   playerGameDetails,
  // }

  // return retVal;
}
