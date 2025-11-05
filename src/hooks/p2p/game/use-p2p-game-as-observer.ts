import { PlayerProfileId } from "../../../models/types/bfg-branded-ids";
import { DbGameTableAction } from "../../../models/game-table/game-table-action";
import { GameTable } from "../../../models/game-table/game-table";
import { PublicPlayerProfile } from "../../../models/player-profile/public-player-profile";
import { PeerId } from "../p2p-types";
import { useP2pGameRoomContext } from "./p2p-game-room-context";
import { IBfgGameRoomForObserver, IP2pDetails, IPublicBfgGameDetails } from "./p2p-game-types";
import { useGameRegistry } from "~/hooks/games-registry/games-registry";
import { useEffect, useState } from "react";
import { isMessageFromHost } from "~/models/game-table/utils";
import { useRoomUserDetails } from "./use-bfg-game-room";


export const useP2pGameAsObserver = (): IBfgGameRoomForObserver => {

  const p2pGameRoom = useP2pGameRoomContext();
  const roomUserDetails = useRoomUserDetails(p2pGameRoom.gameTableId, 'watch');

  const [peers, setPeers] = useState<PeerId[]>([]);
  const [peerPlayerIds, setPeerPlayerIds] = useState<Map<PeerId, PlayerProfileId>>(new Map());
  const [allPlayerProfiles, setAllPlayerProfiles] = useState<Map<PlayerProfileId, PublicPlayerProfile>>(new Map());
  const [gameTable, setGameTable] = useState<GameTable | null>(null);
  const [gameActions, setGameActions] = useState<DbGameTableAction[]>([]);


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
      setPeerPlayerIds(prev => {
        const newMap = new Map(prev);
        newMap.set(peerId, playerProfile.id);
        return newMap;
      });
    });

    const rxPublicGameTableDataUnsubscribe = p2pGameRoom.rxPublicGameTableData((gameTable, peerId) => {
      const isFromHost = isMessageFromHost(peerId);
      if (!isFromHost) {
        console.log('🎮 Received game table data from non-host peer:', peerId, gameTable);
        return;
      }
      setGameTable(gameTable);
    });

    const rxPublicGameActionsDataUnsubscribe = p2pGameRoom.rxPublicGameActionsData((gameActions, peerId) => {
      const isFromHost = isMessageFromHost(peerId);
      if (!isFromHost) {
        console.log('🎮 Received game actions data from non-host peer:', peerId, gameActions);
        return;
      }
      setGameActions(gameActions);
    });

    return () => {
      onRoomPeerJoinUnsubscribe();
      onRoomPeerLeaveUnsubscribe();
      rxPlayerProfileUnsubscribe();
      rxPublicGameTableDataUnsubscribe();
      rxPublicGameActionsDataUnsubscribe();
    };
  }, []);

  const p2pDetails: IP2pDetails = {
    peers,
    peerPlayerIds,
    allPlayerProfiles,
    connectionStatus: p2pGameRoom.connectionStatus,
    connectionEvents: p2pGameRoom.connectionEvents,
  }

  const gameRegistry = useGameRegistry();
  const gameMetadata = gameTable ? gameRegistry.getGameMetadata(gameTable.gameTitle) : null;

  const publicGameDetails: IPublicBfgGameDetails | null = gameTable ? {
    gameMetadata,
    gameTable,
    gameActions,
    allPlayerProfiles,
  } : null;

  const retVal: IBfgGameRoomForObserver = {
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
