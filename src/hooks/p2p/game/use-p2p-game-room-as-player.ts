import { useState, useEffect } from "react";
import { useGameRegistry } from "~/hooks/games-registry/games-registry";
import { GameTable } from "~/models/game-table/game-table";
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile";
import { PlayerProfileId } from "~/models/types/bfg-branded-ids";
import { PeerId, PlayerP2pActionStr, PrivatePlayerKnowledgeStr } from "../p2p-types";
import { useP2pGameRoomContext } from "./p2p-game-room-context";
import { IBfgGameRoomForPlayer, IP2pDetails, IPlayerBfgGameDetails, IPublicBfgGameDetails } from "./p2p-game-types";
import { useRoomUserDetails } from "./use-bfg-game-room";
import { matchPlayerToSeat } from "~/ops/game-table-ops/player-seat-utils";
import { BfgGameImplPlayerAction } from "~/models/game-engine/bfg-game-engine-types";
import { DbGameTableAction } from "~/models/game-table/game-table-action";


export const useP2pGameRoomAsPlayer = (): IBfgGameRoomForPlayer | null => {

  const p2pGameRoom = useP2pGameRoomContext();
  const roomUserDetails = useRoomUserDetails(p2pGameRoom.gameTableId, 'play');

  const [peers, setPeers] = useState<PeerId[]>([]);
  const [peerPlayerIds, setPeerPlayerIds] = useState<Map<PeerId, PlayerProfileId>>(new Map());
  const [allPlayerProfiles, setAllPlayerProfiles] = useState<Map<PlayerProfileId, PublicPlayerProfile>>(new Map());
  const [myPrivatePlayerKnowledgeStr, setMyPrivatePlayerKnowledgeStr] = useState<PrivatePlayerKnowledgeStr | null>(null);
  const [gameTable, setGameTable] = useState<GameTable | null>(null);
  const [gameActions, setGameActions] = useState<DbGameTableAction[]>([]);

  const { txPlayerActionStr } = p2pGameRoom;

  const gameRegistry = useGameRegistry();  
  const gameMetadata = gameTable ? gameRegistry.getGameMetadata(gameTable.gameTitle) : null;


  const onPlayerAction = async (playerAction: BfgGameImplPlayerAction) => {
    
    if (!gameMetadata) {
      console.error('❌ Game metadata not found - cannot call onPlayerAction');
      return;
    }

    const encoder = gameMetadata.encoders.playerActionEncoder;
    
    if (encoder.format !== 'json-zod-object-string') {
      throw new Error('Player action encoder format is not json-zod-object-string');
    }

    const playerActionStr = encoder.encode(playerAction) as unknown as PlayerP2pActionStr;
    txPlayerActionStr(playerActionStr);

  }

  const myPlayerProfile = roomUserDetails.myPlayerProfile;
  if (!myPlayerProfile) {
    console.error('❌ My player profile not found');
    return null;
  }
  
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
      console.log('🎮 Received game table data from peer:', peerId, gameTable);
      setGameTable(gameTable);
    });

    const rxPublicGameActionsDataUnsubscribe = p2pGameRoom.rxPublicGameActionsData((gameActions, peerId) => {
      console.log('🎮 Received game actions data from peer:', peerId, gameActions);
      setGameActions(gameActions);
    });

    const rxPrivatePlayerKnowledgeStrUnsubscribe = p2pGameRoom.rxPrivatePlayerKnowledgeStr((privatePlayerKnowledgeStr, peerId) => {
      console.log('🎮 Received private player knowledge data from peer:', peerId, privatePlayerKnowledgeStr);
      setMyPrivatePlayerKnowledgeStr(privatePlayerKnowledgeStr);
    });

    return () => {
      onRoomPeerJoinUnsubscribe();
      onRoomPeerLeaveUnsubscribe();
      rxPlayerProfileUnsubscribe();
      rxPublicGameTableDataUnsubscribe();
      rxPublicGameActionsDataUnsubscribe();
      rxPrivatePlayerKnowledgeStrUnsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   doSendGameUpdates();
  // }, [doSendGameUpdates])
  

  if (!gameTable) {
    console.error('❌ Game table not found');
    return null;
  }

  const myPlayerSeat = myPlayerProfile ? matchPlayerToSeat(myPlayerProfile.id, gameTable) : null;

  if (!myPlayerSeat) {
    console.error('❌ My player seat not found');
    return null;
  }

  const p2pDetails: IP2pDetails = {
    peerIds: peers,
    peerPlayerIds,
    allPlayerProfiles,
    connectionStatus: p2pGameRoom.connectionStatus,
    connectionEvents: p2pGameRoom.connectionEvents,
  }

  const publicGameDetails: IPublicBfgGameDetails | null = gameTable ? {
    gameMetadata,
    gameTable,
    gameActions,
    allPlayerProfiles,
  } : null;

  const playerGameDetails: IPlayerBfgGameDetails = {
      gameMetadata,
      myPlayerProfile,
      allPlayerProfiles,
      gameTable,
      gameActions,
      myPrivatePlayerKnowledgeStr,
      myPlayerSeat,
      onPlayerAction,
    };

  const retVal: IBfgGameRoomForPlayer = {
    gameTableId: p2pGameRoom.gameTableId,
    gameMetadata,

    accessRole: 'play',
    maxAllowedAccessRole: roomUserDetails.maxAllowedAccessRole,
    allowedRoles: roomUserDetails.allowedRoles,
    myPlayerProfile,

    p2pDetails,
    publicGameDetails,
    playerGameDetails,
  }

  return retVal;
}
