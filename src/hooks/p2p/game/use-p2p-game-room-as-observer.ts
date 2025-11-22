import { PlayerProfileId } from "../../../models/types/bfg-branded-uuids";
import { type GameRoomP2p } from "../../../models/p2p/game-room-p2p";
import { PublicPlayerProfile } from "../../../models/internal/player-profile/public-player-profile";
import { PeerId } from "../p2p-types";
import { useP2pGameRoomContext } from "./p2p-game-room-context";
import { IBfgGameTableForObserver, IP2pDetails, IPublicBfgGameDetails } from "./p2p-game-types";
import { useGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry-hook";
import { useEffect, useState } from "react";
import { useGameInstanceUserDetails } from "./use-bfg-game-instance";
import type { GameTableEventForWatcherP2p } from "../../../models/p2p/game-table-event-p2p";
import { isMessageFromHost } from "../../../models/game-table/utils";


export const useP2pGameRoomAsObserver = (): IBfgGameTableForObserver => {

  const p2pGameRoom = useP2pGameRoomContext();
  const roomUserDetails = useGameInstanceUserDetails(p2pGameRoom.gameInstanceId, 'watch');

  const [peers, setPeers] = useState<PeerId[]>([]);
  const [peerIdsToPlayerIds, setPeerIdsToPlayerIds] = useState<Map<PeerId, PlayerProfileId>>(new Map());
  const [allPlayerProfiles, setAllPlayerProfiles] = useState<Map<PlayerProfileId, PublicPlayerProfile>>(new Map());
  const [gameRoom, setGameRoom] = useState<GameRoomP2p | null>(null);
  const [gameEvents, setGameEvents] = useState<GameTableEventForWatcherP2p[]>([]);

  useEffect(() => {
    const onRoomPeerJoinUnsubscribe = p2pGameRoom.onRoomPeerJoin((peerId: PeerId) => {
      setPeers(prev => [...prev, peerId]);
    });

    const onRoomPeerLeaveUnsubscribe = p2pGameRoom.onRoomPeerLeave((peerId: PeerId) => {
      setPeers(prev => prev.filter(p => p !== peerId));
    });

    const rxPlayerProfileUnsubscribe = p2pGameRoom.rxPlayerProfile((playerProfile, peerId) => {
      setAllPlayerProfiles(prev => {
        const newMap = new Map(prev);
        newMap.set(playerProfile.id, playerProfile);
        return newMap;
      });
      setPeerIdsToPlayerIds(prev => {
        const newMap = new Map(prev);
        newMap.set(peerId, playerProfile.id);
        return newMap;
      });
    });

    const rxPublicGameRoomDataUnsubscribe = p2pGameRoom.rxPublicGameRoomData((gameRoom, peerId) => {
      const isFromHost = isMessageFromHost(peerId);
      if (!isFromHost) {
        console.log('🎮 Received game room data from non-host peer:', peerId, gameRoom);
        return;
      }
      setGameRoom(gameRoom);
    });

    const rxPublicGameEventsDataUnsubscribe = p2pGameRoom.rxPublicGameEventsData((gameEvents, peerId) => {
      const isFromHost = isMessageFromHost(peerId);
      if (!isFromHost) {
        console.log('🎮 Received game events data from non-host peer:', peerId, gameEvents);
        return;
      }
      setGameEvents(gameEvents);
    });

    return () => {
      onRoomPeerJoinUnsubscribe();
      onRoomPeerLeaveUnsubscribe();
      rxPlayerProfileUnsubscribe();
      rxPublicGameRoomDataUnsubscribe();
      rxPublicGameEventsDataUnsubscribe();
    };
  }, []);

  const p2pDetails: IP2pDetails = {
    peerIds: peers,
    peerIdsToPlayerIds,
    allPlayerProfiles,
    myPeerProfile: roomUserDetails.myPlayerProfile,
    connectionStatus: p2pGameRoom.connectionStatus,
    connectionEvents: p2pGameRoom.connectionEvents,
  }

  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRoom ? gameRegistry.getGameMetadata(gameRoom.gameTitle) : null;

  const latestGameEventForWatcher = gameEvents[gameEvents.length - 1];

  const publicGameDetails: IPublicBfgGameDetails | null = gameRoom && gameMetadata ? {
    gameMetadata,
    gameRoom,
    // gameEvents,
    // latestGameEventForWatcher,
    latestWatcherGameEvent: latestGameEventForWatcher,
    watcherGameEvents: gameEvents,
    allPlayerProfiles,
  } : null;

  const retVal: IBfgGameTableForObserver = {
    gameRoomId: p2pGameRoom.gameRoomId,
    gameTableId: p2pGameRoom.gameTableId,
    gameMetadata,

    accessRole: 'watch',
    maxAllowedAccessRole: roomUserDetails.maxAllowedAccessRole,
    allowedRoles: roomUserDetails.allowedRoles,

    myObserverProfile: null,

    p2pDetails,
    publicGameDetails,
  }

  return retVal;
}
