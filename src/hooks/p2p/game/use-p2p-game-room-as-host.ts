import { useState, useEffect, useCallback, useRef } from "react";
import { useGameRegistry } from "~/hooks/games-registry/games-registry";
import { GameTable } from "~/models/game-table/game-table";
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile";
import { PlayerProfileId } from "~/models/types/bfg-branded-ids";
import { PeerId, PlayerP2pActionStr, PrivatePlayerKnowledgeStr, HostP2pActionStr } from "../p2p-types";
import { useP2pGameRoomContext } from "./p2p-game-room-context";
import { IBfgGameRoomForHost, IHostBfgGameDetails, IP2pDetails, IPlayerBfgGameDetails, IPublicBfgGameDetails } from "./p2p-game-types";
import { useRoomUserDetails } from "./use-bfg-game-room";
import { useHostedGame } from "~/hooks/stores/use-hosted-games-store";
import { useGameActions } from "~/hooks/stores/use-game-actions-store";
import { BfgEncodedString } from "~/models/game-engine/encoders";
import { getPeerIdForPlayerSeat, matchPlayerToSeat } from "~/ops/game-table-ops/player-seat-utils";
import { BfgGameImplHostAction, BfgGameImplPlayerAction } from "~/models/game-engine/bfg-game-engine-types";
import { asHostApplyMoveFromPlayer } from "~/ops/game-table-ops/as-host-apply-move-from-player";
import { asHostApplyHostAction } from "~/ops/game-table-ops/as-host-apply-host-action";
import { updateHostedGame } from "~/tb-store/hosted-games-store";
import { addGamePlayerAction, addGameHostAction } from "~/tb-store/hosted-game-actions-store";


export const useP2pGameRoomAsHost = (): IBfgGameRoomForHost | null => {

  const p2pGameRoom = useP2pGameRoomContext();
  const roomUserDetails = useRoomUserDetails(p2pGameRoom.gameTableId, 'host');

  const [peers, setPeers] = useState<PeerId[]>([]);
  const [peerPlayerIds, setPeerPlayerIds] = useState<Map<PeerId, PlayerProfileId>>(new Map());
  const [allPlayerProfiles, setAllPlayerProfiles] = useState<Map<PlayerProfileId, PublicPlayerProfile>>(new Map());
  const [myPrivatePlayerKnowledgeStr, setMyPrivatePlayerKnowledgeStr] = useState<PrivatePlayerKnowledgeStr | null>(null);

  // Use a ref to store the latest doSendGameUpdates to avoid infinite loops
  const doSendGameUpdatesRef = useRef<() => void>(() => {});
  
  // Track the last game action ID to prevent sending on every render
  const lastGameActionIdRef = useRef<string | null>(null);

  const gameRegistry = useGameRegistry();
  const hostedGame = useHostedGame(p2pGameRoom.gameTableId);
  const gameActions = useGameActions(p2pGameRoom.gameTableId);
  
  const { txPublicGameTableData, txPublicGameActionsData, txPrivatePlayerKnowledgeStr } = p2pGameRoom;
  
  const myHostProfile = roomUserDetails.myHostProfile;
  if (!myHostProfile) {
    console.error('❌ My host profile not found');
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

      const latestGameAction = gameActions[gameActions.length - 1];
      const gameState = gameMetadata.encoders.hostGameStateEncoder.decode(latestGameAction.nextGameStateStr);
      if (!gameState) {
        console.error('❌ Game state not found');
        return;
      }

      // For private knowledge games, transform game actions to contain only public state before sending
      if (gameMetadata.gameKnowledgeType === 'private-player-knowledge') {
        // Transform all game actions to use public game state instead of host game state
        const publicGameActions = gameActions.map(action => {
          const hostState = gameMetadata.encoders.hostGameStateEncoder.decode(action.nextGameStateStr);
          if (!hostState) {
            console.error('❌ Failed to decode host state for action:', action);
            return action;
          }
          
          // Extract only public fields by parsing through the public schema
          // This ensures we don't include private fields like 'deck' or 'playerHandStates'
          try {
            const publicState = gameMetadata.zodSchemas.publicGameStateSchema.parse(hostState);
            const publicStateStr = gameMetadata.encoders.publicGameStateEncoder.encode(publicState);
          
            return {
              ...action,
              nextGameStateStr: publicStateStr,
            };
          } catch (error) {
            console.error('❌ Failed to parse host state as public state:', error);
            console.error('❌ Host state:', hostState);
            console.error('❌ Game:', gameMetadata.gameTitle);
            return action;
          }
        });
        
        txPublicGameActionsData(publicGameActions);
      } else {
        // For public knowledge games, send as-is
        txPublicGameActionsData(gameActions);
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
            console.log('🎮 Host: Setting my own private knowledge');
            setMyPrivatePlayerKnowledgeStr(privatePlayerKnowledgeStr);
          } else {
            console.log('🎮 Host: Looking up peer ID for seat', playerSeat);
            const playerSeatPeerId = getPeerIdForPlayerSeat(playerSeat, gameTable, peerPlayerIds);
            if (!playerSeatPeerId) {
              console.error('❌ Player seat peer ID not found:', playerSeat);
              console.error('❌ Expected profile ID:', gameTable[playerSeat]);
              console.error('❌ Available peers:', Array.from(peerPlayerIds.entries()));
              continue;
            }
            console.log('🎮 Host: Sending private knowledge to peer', playerSeatPeerId, 'for seat', playerSeat);
            txPrivatePlayerKnowledgeStr(privatePlayerKnowledgeStr, playerSeatPeerId);
          }
        }
      }
      
    } else {
      console.log('🎮 Host cannot send game data - missing:', { hostedGame: !!hostedGame, gameActions: !!gameActions })
    }
  }, [hostedGame, gameActions, peerPlayerIds, txPublicGameTableData, txPublicGameActionsData, txPrivatePlayerKnowledgeStr, gameRegistry, myPlayerSeat])

  // Update the ref whenever doSendGameUpdates changes
  doSendGameUpdatesRef.current = doSendGameUpdates;
  
  useEffect(() => {
    const onRoomPeerJoinUnsubscribe = p2pGameRoom.onRoomPeerJoin((peerId: PeerId) => {
      console.log('🎮 Host: Peer joined:', peerId);
      setPeers(prev => [...prev, peerId]);
      // Send game updates to the new peer after a short delay to ensure they're subscribed
      setTimeout(() => {
        console.log('🎮 Host: Sending game updates after peer join');
        doSendGameUpdatesRef.current();
      }, 100);
    });

    const onRoomPeerLeaveUnsubscribe = p2pGameRoom.onRoomPeerLeave((peerId: PeerId) => {
      console.log('🎮 Host: Peer left:', peerId);
      setPeers(prev => prev.filter(p => p !== peerId));
      
      // Clean up the peerPlayerIds mapping
      setPeerPlayerIds(prev => {
        const newMap = new Map(prev);
        const playerProfileId = newMap.get(peerId);
        if (playerProfileId) {
          console.log('🎮 Host: Removing peer mapping:', peerId, '->', playerProfileId);
          newMap.delete(peerId);
          console.log('🎮 Host: Remaining peer mappings:', Array.from(newMap.entries()));
        }
        return newMap;
      });
    });

    const rxPlayerProfileUnsubscribe = p2pGameRoom.rxPlayerProfile((playerProfile, peerId) => {
      console.log('🎮 Host: Received player profile from peer:', peerId, playerProfile);
      setAllPlayerProfiles(prev => {
        const newMap = new Map(prev);
        newMap.set(playerProfile.id, playerProfile);
        console.log('🎮 Host: Updated allPlayerProfiles, now has:', Array.from(newMap.keys()));
        return newMap;
      });
      setPeerPlayerIds(prev => {
        const newMap = new Map(prev);
        newMap.set(peerId, playerProfile.id);
        console.log('🎮 Host: Updated peerPlayerIds mapping:', peerId, '->', playerProfile.id);
        console.log('🎮 Host: All peer mappings now:', Array.from(newMap.entries()));
        return newMap;
      });
      // Note: doSendGameUpdates will be automatically triggered by the useEffect
      // when peerPlayerIds changes, so no need to call it explicitly here
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
  }, [hostedGame, gameActions, myHostProfile, gameRegistry, p2pGameRoom]);

  // Call doSendGameUpdates when game actions actually change (new moves applied)
  useEffect(() => {
    if (gameActions && gameActions.length > 0) {
      const latestAction = gameActions[gameActions.length - 1];
      const latestActionTimestamp = latestAction?.createdAt.toString();
      // Only send if this is a genuinely new action (check by timestamp)
      if (latestActionTimestamp && latestActionTimestamp !== lastGameActionIdRef.current) {
        console.log('🎮 Host: Game actions changed, sending updates. New action timestamp:', latestActionTimestamp);
        lastGameActionIdRef.current = latestActionTimestamp;
        doSendGameUpdatesRef.current();
      }
    }
  }, [gameActions])

  const p2pDetails: IP2pDetails = {
    peerIds: peers,
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

  const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);

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

  }, [gameMetadata, gameRegistry, hostedGame, gameActions, roomUserDetails.myHostProfile]);

  const onHostAction = useCallback(async (hostAction: BfgGameImplHostAction) => {
    // Convert to encoded string if needed (hosted-game-view.tsx sends it as a string)
    // let hostActionStr: HostP2pActionStr;
    // if (typeof hostAction === 'string') {
    //   hostActionStr = hostAction as unknown as HostP2pActionStr;
    // } else {
    //   hostActionStr = gameMetadata.encoders.hostActionEncoder.encode(hostAction) as unknown as HostP2pActionStr;
    // }
    const hostActionStr = gameMetadata.encoders.hostActionEncoder.encode(hostAction) as unknown as HostP2pActionStr;

    // Use the existing helper function to apply the host action
    const result = await asHostApplyHostAction(gameRegistry, hostedGame, gameActions, hostActionStr);

    // Update the stored game table and add the action
    updateHostedGame(hostedGame.id, result.gameTable);
    await addGameHostAction(hostedGame.id, result.gameAction);

  }, [gameMetadata, gameRegistry, hostedGame, gameActions, roomUserDetails.myHostProfile]);


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
    onHostAction,
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

  if (!hostGameDetails) {
    return null;
  }

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
