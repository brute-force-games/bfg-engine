import { useState, useEffect, useCallback } from "react";
import { useGameRegistry } from "~/hooks/games-registry/games-registry";
import { GameTable } from "~/models/game-table/game-table";
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile";
import { PlayerProfileId } from "~/models/types/bfg-branded-ids";
import { PeerId, PlayerP2pActionStr, PrivatePlayerKnowledgeStr } from "../p2p-types";
import { useP2pGameRoomContext } from "./p2p-game-room-context";
import { IBfgGameRoomForHost, IHostBfgGameDetails, IP2pDetails, IPlayerBfgGameDetails, IPublicBfgGameDetails } from "./p2p-game-types";
import { useRoomUserDetails } from "./use-bfg-game-room";
import { useHostedGame } from "~/hooks/stores/use-hosted-games-store";
import { useGameActions } from "~/hooks/stores/use-game-actions-store";
import { BfgEncodedString } from "~/models/game-engine/encoders";
import { getPeerIdForPlayerSeat, matchPlayerToSeat } from "~/ops/game-table-ops/player-seat-utils";
import { BfgGameImplPlayerAction } from "~/models/game-engine/bfg-game-engine-types";
import { asHostApplyMoveFromPlayer } from "~/ops/game-table-ops/as-host-apply-move-from-player";
import { updateHostedGame } from "~/tb-store/hosted-games-store";
import { addGamePlayerAction } from "~/tb-store/hosted-game-actions-store";


export const useP2pGameAsHost = (): IBfgGameRoomForHost | null => {

  const p2pGameRoom = useP2pGameRoomContext();
  const roomUserDetails = useRoomUserDetails(p2pGameRoom.gameTableId, 'host');

  const [peers, setPeers] = useState<PeerId[]>([]);
  const [peerPlayerIds, setPeerPlayerIds] = useState<Map<PeerId, PlayerProfileId>>(new Map());
  const [allPlayerProfiles, setAllPlayerProfiles] = useState<Map<PlayerProfileId, PublicPlayerProfile>>(new Map());
  const [myPrivatePlayerKnowledgeStr, setMyPrivatePlayerKnowledgeStr] = useState<PrivatePlayerKnowledgeStr | null>(null);

  const gameRegistry = useGameRegistry();
  const hostedGame = useHostedGame(p2pGameRoom.gameTableId);
  const gameActions = useGameActions(p2pGameRoom.gameTableId);
  
  const { txPublicGameTableData, txPublicGameActionsData, txPrivatePlayerKnowledgeStr } = p2pGameRoom;
  
  const myHostProfile = roomUserDetails.myHostProfile;
  if (!myHostProfile) {
    console.error('❌ My host profile not found');
    // return;
  }
  const myPlayerSeat = myHostProfile ? matchPlayerToSeat(myHostProfile.id, hostedGame) : null;

  const doSendGameUpdates = useCallback(() => {
    if (hostedGame && gameActions) {
      const gameTable: GameTable = {
        ...hostedGame,
      }

      const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);

      console.log('🎮 Host sending game data:', gameTable)
      console.log('🎮 Host sending game actions:', gameActions)

      txPublicGameTableData(gameTable);
      txPublicGameActionsData(gameActions);

      const latestGameAction = gameActions[gameActions.length - 1];
      const gameState = gameMetadata.encoders.hostGameStateEncoder.decode(latestGameAction.nextGameStateStr);
      if (!gameState) {
        console.error('❌ Game state not found');
        return;
      }

      // send private player knowledge updates; update self player knowledge
      if (gameMetadata.gameKnowledgeType === 'private-player-knowledge') {
        const allPlayersPrivateKnowledge = gameMetadata.engine.getAllPlayersPrivateKnowledge(gameTable, gameState);
        if (!allPlayersPrivateKnowledge) {
          console.error('❌ All players private knowledge not found');
          return;
        }

        for (const [playerSeat, privatePlayerKnowledge] of allPlayersPrivateKnowledge.entries()) {
          const privatePlayerKnowledgeStr = gameMetadata.encoders.privatePlayerKnowledgeEncoder
            .encode(privatePlayerKnowledge) as BfgEncodedString as unknown as PrivatePlayerKnowledgeStr;

          if (playerSeat === myPlayerSeat) {
            setMyPrivatePlayerKnowledgeStr(privatePlayerKnowledgeStr);
          } else {
            const playerSeatPeerId = getPeerIdForPlayerSeat(playerSeat, gameTable, peerPlayerIds);
            if (!playerSeatPeerId) {
              console.error('❌ Player seat peer ID not found:', playerSeat);
              continue;
            }
            txPrivatePlayerKnowledgeStr(privatePlayerKnowledgeStr, playerSeatPeerId);
          }
        }
      }
      
    } else {
      console.log('🎮 Host cannot send game data - missing:', { hostedGame: !!hostedGame, gameActions: !!gameActions })
    }
  }, [hostedGame, gameActions, txPublicGameTableData, txPublicGameActionsData])

  
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

    const rxPlayerActionStrUnsubscribe = p2pGameRoom.rxPlayerActionStr(async (playerActionStr, peerId) => {
      console.log('🎮 Received player action data from peer:', peerId, playerActionStr);
      if (!hostedGame) {
        console.error('❌ Hosted game not found - cannot apply move');
        return;
      }
      if (!myHostProfile) {
        console.error('❌ My host profile not found - cannot apply move');
        return;
      }
      const moveResult = await asHostApplyMoveFromPlayer(gameRegistry, hostedGame, gameActions, myHostProfile.id, playerActionStr);
      if (moveResult) {
        const updatedGameTable = moveResult.gameTable;
        updateHostedGame(hostedGame.id, updatedGameTable);
        addGamePlayerAction(hostedGame.id, moveResult.gameAction);  
      }
    });

    return () => {
      onRoomPeerJoinUnsubscribe();
      onRoomPeerLeaveUnsubscribe();
      rxPlayerProfileUnsubscribe();
      rxPlayerActionStrUnsubscribe();
    };
  }, []);

  useEffect(() => {
    doSendGameUpdates();
  }, [doSendGameUpdates])

  const p2pDetails: IP2pDetails = {
    peers,
    peerPlayerIds,
    allPlayerProfiles,
    connectionStatus: p2pGameRoom.connectionStatus,
    connectionEvents: p2pGameRoom.connectionEvents,
  }

  if (roomUserDetails.maxAllowedAccessRole !== 'host' ||
      roomUserDetails.myHostProfile === null ||
      hostedGame === null
  ) {
    return null;
  }



  // const handleSelfPlayerActionStr = async (actionStr: PlayerP2pActionStr) => {
  //   const validationResult = PlayerP2pActionStrSchema.safeParse(actionStr);
  //   if (!validationResult.success) {
  //     console.error('❌ Invalid player action received:', actionStr);
  //     return;
  //   }

  //   const validatedActionStr = validationResult.data;

  //   console.log('🎮 HOST RECEIVED self player action:', validatedActionStr);

  //   const playerActionEncoder = gameMetadata.encoders.playerActionEncoder;
  //   const p2pToBfgEncoded: BfgEncodedString = validatedActionStr as unknown as BfgEncodedString;
  //   const validatedAction = playerActionEncoder.decode(p2pToBfgEncoded);

  //   if (!validatedAction) {
  //     console.error('❌ Invalid move received:', validatedActionStr);
  //     return;
  //   }
    
  //   const moveResult = await asHostApplyMoveFromPlayer(gameRegistry, hostedGame, gameActions, hostPlayerProfile.id, validatedActionStr);
  //   if (moveResult) {
  //     const updatedGameTable = moveResult.gameTable;
  //     const updatedGameAction = moveResult.gameAction;
  //     updateHostedGame(hostedGame.id, updatedGameTable);
  //     addGamePlayerAction(hostedGame.id, updatedGameAction);
  //   }
  // }


  const onPlayerAction = useCallback(async (playerAction: BfgGameImplPlayerAction) => {
    console.log('🎮 Host received player action:', playerAction);

    const encoder = gameMetadata.encoders.playerActionEncoder;
    if (encoder.format !== 'json-zod-object-string') {
      throw new Error('Player action encoder format is not json-zod-object-string');
    }

    const playerActionStr = encoder.encode(playerAction) as unknown as PlayerP2pActionStr;

    const hostPlayerProfileId = roomUserDetails.myHostProfile?.id;
    if (!hostPlayerProfileId) {
      throw new Error('Host player profile ID not found');
    }

    const moveResult = await asHostApplyMoveFromPlayer(gameRegistry, hostedGame, gameActions, hostPlayerProfileId, playerActionStr);
    if (moveResult) {
      const updatedGameTable = moveResult.gameTable;
      const updatedGameAction = moveResult.gameAction;
      updateHostedGame(hostedGame.id, updatedGameTable);
      addGamePlayerAction(hostedGame.id, updatedGameAction);
    }

  }, []);

  const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);

  const publicGameDetails: IPublicBfgGameDetails | null = hostedGame ? {
    gameMetadata,
    gameTable: hostedGame,
    gameActions,
    allPlayerProfiles,
  } : null;

  const hostGameDetails: IHostBfgGameDetails | null = hostedGame ? {
    gameMetadata,
    myHostProfile: roomUserDetails.myHostProfile,
    gameTable: hostedGame,
    gameActions,
  } : null;

  const playerGameDetails: IPlayerBfgGameDetails | null = hostedGame && 
    roomUserDetails.myPlayerProfile &&
    myPlayerSeat !== null &&
    roomUserDetails.allowedRoles.includes('play') ? {
      gameMetadata,
      myPlayerProfile: roomUserDetails.myPlayerProfile,
      allPlayerProfiles,
      gameTable: hostedGame,
      gameActions,
      myPrivatePlayerKnowledgeStr,
      myPlayerSeat,
      onPlayerAction,
    } : null;

  const retVal: IBfgGameRoomForHost = {
    gameTableId: p2pGameRoom.gameTableId,
    gameMetadata,

    accessRole: 'host',
    maxAllowedAccessRole: roomUserDetails.maxAllowedAccessRole,
    allowedRoles: roomUserDetails.allowedRoles,
    myHostProfile: roomUserDetails.myHostProfile,

    p2pDetails,
    publicGameDetails,
    playerGameDetails,
    hostGameDetails,
  }

  return retVal;
}
