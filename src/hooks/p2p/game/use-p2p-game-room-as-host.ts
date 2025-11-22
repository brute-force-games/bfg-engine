import { useState, useEffect, useCallback, useRef } from "react";
import { useGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry-hook";
import { PublicPlayerProfile } from "@bfg-engine/models/internal/player-profile/public-player-profile";
import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { PeerId, PeerIdSchema } from "../p2p-types";
import { useP2pGameRoomContext } from "./p2p-game-room-context";
import { IBfgGameTableForHost, IHostBfgGameDetails, IP2pDetails, IPlayerBfgGameDetails, IPublicBfgGameDetails } from "./p2p-game-types";
import { useGameInstanceUserDetails } from "./use-bfg-game-instance";
// import { useHostedGame } from "@bfg-engine/hooks/stores/use-hosted-games-store";
// import { useGameActions } from "@bfg-engine/hooks/stores/use-game-actions-store";
import { matchPlayerToSeat } from "@bfg-engine/ops/game-table-ops/player-seat-utils";
// import { updateHostedGame } from "@bfg-engine/tb-store/hosted-games-store";
// import { addGamePlayerAction, addGameHostAction } from "@bfg-engine/tb-store/hosted-game-archive-store";
import { selfId } from "trystero";
import type { BfgGameActionByHost, BfgGameActionByPlayer } from "../../../game-metadata/metadata-types/game-action-types";
// import { useHostedGameArchive } from "../../../tb-store/games-archives-store";
import type { GameRoomP2p } from "../../../models/p2p/game-room-p2p";
import { useLatestHostedGameSnapshot } from "../../../tb-store/games-archives-store";


export const useP2pGameRoomAsHost = (): IBfgGameTableForHost | null => {

  const p2pGameRoom = useP2pGameRoomContext();
  const gameInstanceUserDetails = useGameInstanceUserDetails(p2pGameRoom.gameInstanceId, 'host');

  const myPlayerProfile = gameInstanceUserDetails.myPlayerProfile;

  const [peers, setPeers] = useState<PeerId[]>([]);
  const [peerIdsToPlayerIds, setPeerIdsToPlayerIds] = useState<Map<PeerId, PlayerProfileId>>(() => {
    const map = new Map<PeerId, PlayerProfileId>();
    if (myPlayerProfile) {
      const selfPeerId = PeerIdSchema.parse(selfId);
      map.set(selfPeerId, myPlayerProfile.id);
    }
    return map;
  });
  const [allPlayerProfiles, setAllPlayerProfiles] = useState<Map<PlayerProfileId, PublicPlayerProfile>>(() => {
    const profiles = new Map<PlayerProfileId, PublicPlayerProfile>();
    if (myPlayerProfile) {
      profiles.set(myPlayerProfile.id, myPlayerProfile);
    }
    return profiles;
  });  
  
  // const [myHostGameState, setMyHostGameState] = useState<BfgGameStateForHost | null>(null);
  // Use a ref to store the latest doSendGameUpdates to avoid infinite loops
  const doSendGameUpdatesRef = useRef<(
    // publicGameState: BfgGameStateForWatcher,
    // publicGameActions: DbGameTableAction[],
  ) => void>(() => {});
  
  // Track the last game action ID to prevent sending on every render
  // const lastGameActionIdRef = useRef<string | null>(null);

  const gameRegistry = useGameRegistry();
  const hostedGameSnapshot = useLatestHostedGameSnapshot(p2pGameRoom.gameInstanceId);
  if (!hostedGameSnapshot) {
    console.error('❌ Hosted game room snapshot not found');
    return null;
  }

  const hostedGame = hostedGameSnapshot.gameRoom;
  // const hostedGameLatestBoardEvent = hostedGameSnapshot.latestBoardEvent;
  const hostedGameBoardEvents = hostedGameSnapshot.boardEvents;

  // const gameActions = useGameActions(p2pGameRoom.gameTableId);

  // const [myPlayerSeatGameStates, setMyPlayerSeatGameStates] = useState<BfgGameStateForPlayer | null>(null);
  // const [watcherGameState, setWatcherGameState] = useState<BfgGameStateForWatcher | null>(null);
  // const [watcherGameActions, setWatcherGameActions] = useState<DbGameTableAction[]>([]);

  
  const { txGameRoom, txPublicGameEventsDataStr, txPrivatePlayerKnowledgeStr } = p2pGameRoom;
  
  const myHostProfile = gameInstanceUserDetails.myHostProfile;
  if (!myHostProfile) {
    console.error('❌ My host profile not found');
  }
  const myPlayerSeat = myHostProfile ? matchPlayerToSeat(myHostProfile.id, hostedGame) : null;


  // const doWatcherGameUpdates = useCallback((
  //   publicGameState: BfgGameStateForWatcher,
  //   publicGameActions: DbGameTableAction[],
  // ) => {
  //   if (watcherGameState === null || watcherGameActions.length === 0) {
  //     console.warn('❌ No watcher game state or actions to send');
  //     return;
  //   }

  //   txPublicGameTableData(publicGameState);
  //   setWatcherGameState(publicGameState);

  //   txPublicGameActionsData(publicGameActions);
  //   setWatcherGameActions(publicGameActions);
    
  // }, [txPublicGameTableData, txPublicGameActionsData]);


  const doSendGameUpdates = useCallback(() => {
    if (!hostedGame) {
      console.log('🎮 Host cannot send game data - missing game room');
      return;
    }

    if (!hostedGameSnapshot) {
      console.log('🎮 Host cannot send game data - missing game snapshot');
      return;
    }

    // const gameTable: GameTable = {
    //   ...hostedGameState,
    // }

    const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);

    const gameRoomP2p: GameRoomP2p = {
      // id: hostedGameState.id,
      // gameTitle: hostedGameState.gameTitle,
      // tableName: hostedGameState.tableName,
      // gameHostPlayerProfileId: hostedGameState.gameHostPlayerProfileId,
      // latestRoomStatusDescription: hostedGameState.latestRoomStatusDescription,
      // players: hostedGameState.players,
      // latestGameStepIndex: hostedGameState.latestGameStepIndex,
      // latestGameStatusDescription: hostedGameState.latestGameStatusDescription,
      // latestRoomPhase: hostedGameState.latestRoomPhase,
      // createdAt: hostedGameState.createdAt,
      // lastUpdatedAt: hostedGameState.lastUpdatedAt,
      ...hostedGame,
    } satisfies GameRoomP2p;

    // console.log('🎮 Host sending game data:', gameTable)

    // txPublicGameTableData(gameTable);
    txGameRoom(gameRoomP2p);

    // const latestGameAction = gameActions[gameActions.length - 1];
    // const gameState = gameMetadata.encoders.hostGameStateEncoder.decode(latestGameAction.nextGameStateStr);
    // if (!gameState) {
    //   console.error('❌ Current host game state not available');
    //   return;
    // }

    // For private knowledge games, transform game actions to contain only public state before sending
    if (gameMetadata.metadataType === 'public-knowledge-game') {
      // For public knowledge games, send as-is
      // txPublicGameActionsData(gameActions);
    } else {

      // // Transform all game actions to use public game state instead of host game state
      // const publicGameActions = gameActions.map(action => {
      //   const hostState = gameMetadata.encoders.hostGameStateEncoder.decode(action.nextGameStateStr);
      //   if (!hostState) {
      //     console.error('❌ Failed to decode host state for action:', action);
      //     return action;
      //   }
        
      //   // Extract only public fields by parsing through the public schema
      //   // This ensures we don't include private fields like 'deck' or 'playerHandStates'
      //   try {
      //     // const publicState = gameMetadata.schemas.publicGameStateSchema.parse(hostState);
          
      //     const watcherState = gameMetadata.accessLevelConverters.hostToWatcherAccessLevel(hostState);
      //     const publicStateStr = gameMetadata.encoders.watcherGameStateEncoder.encode(watcherState);
        
      //     return {
      //       ...action,
      //       nextGameStateStr: publicStateStr,
      //     };

      //   } catch (error) {
      //     console.error('❌ Failed to parse host state as public state:', error);
      //     console.error('❌ Host state:', hostState);
      //     console.error('❌ Game:', gameMetadata.gameTitle);
      //     return action;
      //   }
      // });
      
      // txPublicGameActionsData(publicGameActions);
      // setMyPlayerSeatGameStates(playerSeatGameStates);
      console.warn("Implement me");
    }

    // send private player knowledge updates; update self player knowledge
    if (gameMetadata.metadataType === 'private-player-knowledge-game') {
      // const playerSeatGameStates = gameMetadata.accessLevelConverters.hostToPlayerSeatGameStates(gameTable, gameState);
      // if (!playerSeatGameStates || playerSeatGameStates.length === 0) {
      //   console.error('❌ Player seat access levels not found');
      //   return;
      // }

      // for (const { playerSeat, } of playerSeatGameStates) {
        
      //   if (playerSeat === myPlayerSeat) {
      //     console.log('🎮 Host: Setting my own private knowledge');
      //     // setMyPrivatePlayerKnowledgeStr(privatePlayerKnowledgeStr);
      //     console.warn("Implement me");
      //   } else {
      //     console.log('🎮 Host: Looking up peer ID for seat', playerSeat);
      //     const playerSeatPeerId = getPeerIdForPlayerSeat(playerSeat, gameTable, peerIdsToPlayerIds);
      //     if (!playerSeatPeerId) {
      //       console.error('❌ Player seat peer ID not found:', playerSeat);
      //       // console.error('❌ Expected profile ID:', gameTable[playerSeat]);
      //       console.error('❌ Available peers:', Array.from(peerIdsToPlayerIds.entries()));
      //       continue;
      //     }
      //     console.log('🎮 Host: Sending private knowledge to peer', playerSeatPeerId, 'for seat', playerSeat);
      //     // txPrivatePlayerKnowledgeStr(privatePlayerKnowledgeStr, playerSeatPeerId);
      //     console.warn("Implement me");
      //   }
      // }
    }
      
    // } else {
    //   console.log('🎮 Host cannot send game data - missing:', { hostedGame: !!hostedGameState, gameActions: !!gameActions })
    // }
  }, [hostedGame, hostedGameSnapshot, peerIdsToPlayerIds, txGameRoom, txPublicGameEventsDataStr, txPrivatePlayerKnowledgeStr, gameRegistry, myPlayerSeat])

  // Update the ref whenever doSendGameUpdates changes
  // doSendGameUpdatesRef.current = doSendGameUpdates;
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
      setPeerIdsToPlayerIds(prev => {
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
      setPeerIdsToPlayerIds(prev => {
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
      console.warn("Implement me");
      
      if (!hostedGame) {
        console.error('❌ Hosted game room not found - cannot apply move');
        return;
      }
      if (!hostedGameSnapshot) {
        console.error('❌ Hosted game snapshot not found - cannot apply move');
        return;
      }
      if (!myHostProfile) {
        console.error('❌ My host profile not found - cannot apply move');
        return;
      }
      // const moveResult = await asHostApplyMoveFromPlayer(gameRegistry, hostedGame, gameActions, myHostProfile.id, playerActionStr);
      // const encoder = gameMetadata.encoders.playerActionEncoder;

      // const playerActionEncoder = gameMetadata.encoders.playerActionEncoder;
      // // const playerActionsEncoder = gameMetadata.encoders.playerActionsEncoder;
      // const p2pToBfgEncoded = playerActionStr as unknown as BfgEncodedString;
      // const playerAction = playerActionEncoder.decode(p2pToBfgEncoded);

      // if (!playerAction) {
      //   console.error('❌ Failed to decode player action:', playerActionStr);

      //   return;
      // }

      // const moveResult = await asHostApplyMoveFromPlayer(gameRegistry, hostedGameState, gameActions, myHostProfile.id, playerAction);
      // if (moveResult) {
      //   const updatedGameTable = moveResult.gameTable;
      //   updateHostedGame(
      //     hostedGameState.id, 
      //     updatedGameTable, 
      //     moveResult.gameEvent, 
      //     moveResult.gameEventChange, 
      //     moveResult.nextGameState);

      //   // addGamePlayerAction(hostedGameState.id, moveResult.gameAction);  
      // }
    });

    return () => {
      onRoomPeerJoinUnsubscribe();
      onRoomPeerLeaveUnsubscribe();
      rxPlayerProfileUnsubscribe();
      rxPlayerActionStrUnsubscribe();
    };
  }, [hostedGame, hostedGameSnapshot, myHostProfile, gameRegistry, p2pGameRoom]);

  // Call doSendGameUpdates when game actions actually change (new moves applied)
  useEffect(() => {
    console.warn("Implement me - game actions???");
    // if (gameActions && gameActions.length > 0) {
    //   const latestAction = gameActions[gameActions.length - 1];
    //   const latestActionTimestamp = latestAction?.createdAt.toString();
    //   // Only send if this is a genuinely new action (check by timestamp)
    //   if (latestActionTimestamp && latestActionTimestamp !== lastGameActionIdRef.current) {
    //     console.log('🎮 Host: Game actions changed, sending updates. New action timestamp:', latestActionTimestamp);
    //     lastGameActionIdRef.current = latestActionTimestamp;
    //     doSendGameUpdatesRef.current();
    //   }
    // }
  }, [])

  const p2pDetails: IP2pDetails = {
    peerIds: peers,
    peerIdsToPlayerIds,
    allPlayerProfiles,
    myPeerProfile: myHostProfile,
    connectionStatus: p2pGameRoom.connectionStatus,
    connectionEvents: p2pGameRoom.connectionEvents,
  }

  if (gameInstanceUserDetails.maxAllowedAccessRole !== 'host' ||
      gameInstanceUserDetails.myHostProfile === null ||
      hostedGame === null ||
      hostedGameSnapshot === null ||
      hostedGameBoardEvents.length === 0
  ) {
    return null;
  }

  const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);

  const onPlayerAction = useCallback(async (playerAction: BfgGameActionByPlayer) => {
    console.log('🎮 Host received player action:', playerAction);

    // const encoder = gameMetadata.encoders.playerActionEncoder;
    // if (encoder.format !== 'json-zod-object-string') {
    //   throw new Error('Player action encoder format is not json-zod-object-string');
    // }

    // const playerActionStr = encoder.encode(playerAction) as unknown as PlayerP2pActionStr;

    const hostPlayerProfileId = gameInstanceUserDetails.myHostProfile?.id;
    if (!hostPlayerProfileId) {
      throw new Error('Host player profile ID not found');
    }

    console.warn("Implement me - as host apply move from player");
    // const moveResult = await asHostApplyMoveFromPlayer(gameRegistry, hostedGameState, gameActions, hostPlayerProfileId, playerAction);
    // if (moveResult) {
    //   const updatedGameTable = moveResult.gameTable;
    //   const updatedGameEvent = moveResult.gameEvent;
    //   const updatedGameEventChange = moveResult.gameEventChange;
    //   const updatedNextGameState = moveResult.nextGameState;
    //   updateHostedGame(hostedGameState.id, updatedGameTable, updatedGameEvent, updatedGameEventChange, updatedNextGameState);
    // }
  }, [gameMetadata, gameRegistry, hostedGame, hostedGameSnapshot, gameInstanceUserDetails.myHostProfile]);

  const onHostAction = useCallback(async (hostAction: BfgGameActionByHost) => {
    console.log('🎮 Host received host action:', hostAction);
    console.warn("Implement me - as host apply host action");
    // Convert to encoded string if needed (hosted-game-view.tsx sends it as a string)
    // let hostActionStr: HostP2pActionStr;
    // if (typeof hostAction === 'string') {
    //   hostActionStr = hostAction as unknown as HostP2pActionStr;
    // } else {
    //   hostActionStr = gameMetadata.encoders.hostActionEncoder.encode(hostAction) as unknown as HostP2pActionStr;
    // }
    // const hostActionStr = gameMetadata.encoders.hostActionEncoder.encode(hostAction) as unknown as HostP2pActionStr;

    // Use the existing helper function to apply the host action
    // const result = await asHostApplyHostAction(gameRegistry, hostedGameState, [], hostAction);

    // Update the stored game table and add the action
    // updateHostedGame(hostedGameState.id, result.gameTable, result.gameEvent, result.gameEventChange, result.nextGameState);
    // await addGameHostAction(hostedGameState.id, result.gameAction);

  }, [gameMetadata, gameRegistry, hostedGame, hostedGameSnapshot, gameInstanceUserDetails.myHostProfile]);

  if (!hostedGame || !hostedGameSnapshot) {
    return null;
  }

  const playerGame = hostedGame;
  const watcherGame = hostedGame;

  const myPlayerGameEvents = myPlayerSeat ? 
    hostedGameBoardEvents.map(boardEvent => gameMetadata.accessLevelAdapters
      .hostEventTransitionToPlayerAccessLevelAdapter(myPlayerSeat, boardEvent)) :
    [];

  const latestMyPlayerGameEvent = myPlayerSeat ? 
    myPlayerGameEvents[myPlayerGameEvents.length - 1] : 
    null;

  const watcherGameEvents = hostedGameBoardEvents.map(boardEvent => gameMetadata.accessLevelAdapters
    .hostEventTransitionToWatcherAccessLevelAdapter(boardEvent));

  const latestWatcherGameEvent = watcherGameEvents[watcherGameEvents.length - 1];

    // const latestGameEventForPlayer = gameMetadata.accessLevelAdapters
  //   .hostEventTransitionToPlayerAccessLevelAdapter(hostedGameSnapshot);

  // const latestGameEventForHost = gameMetadata.accessLevelAdapters
  //   .hostEventTransitionFromHostEventTransitionDb(hostedGameSnapshot.transitionForHost);

  const hostGameEvents = hostedGameBoardEvents.map(boardEvent => gameMetadata.accessLevelAdapters
    .hostEventTransitionFromHostEventTransitionDb(boardEvent));

  const latestHostGameEvent = hostGameEvents[hostGameEvents.length - 1];


  const publicGameDetails: IPublicBfgGameDetails = {
    gameMetadata,
    gameRoom: watcherGame,
    watcherGameEvents,
    
    latestWatcherGameEvent,
    allPlayerProfiles,
  };

  const hostGameDetails: IHostBfgGameDetails | null = {
    gameMetadata,
    myHostProfile: gameInstanceUserDetails.myHostProfile,
    gameRoom: hostedGame,

    latestWatcherGameEvent,
    watcherGameEvents,

    latestHostGameEvent,
    hostGameEvents,

    // gameActions,
    onHostAction,
  };

  const playerGameDetails: IPlayerBfgGameDetails | null = 
    gameInstanceUserDetails.myPlayerProfile &&
    myPlayerSeat !== null &&
    latestMyPlayerGameEvent !== null &&
    gameInstanceUserDetails.allowedRoles.includes('play') ? {
      gameMetadata,
      myPlayerProfile: gameInstanceUserDetails.myPlayerProfile,
      allPlayerProfiles,
      gameRoom: playerGame,

      latestWatcherGameEvent,
      watcherGameEvents,

      latestPlayerGameEvent: latestMyPlayerGameEvent,
      playerGameEvents: myPlayerGameEvents,

      // gameActions,
      // myPrivatePlayerKnowledgeStr,
      myPlayerSeat,
      onPlayerAction,
    } : null;

  if (!hostGameDetails) {
    return null;
  }

  const retVal: IBfgGameTableForHost = {
    gameRoomId: p2pGameRoom.gameRoomId,
    gameTableId: p2pGameRoom.gameTableId,
    gameMetadata,

    accessRole: 'host',
    maxAllowedAccessRole: gameInstanceUserDetails.maxAllowedAccessRole,
    allowedRoles: gameInstanceUserDetails.allowedRoles,
    myHostProfile: gameInstanceUserDetails.myHostProfile,

    p2pDetails,
    publicGameDetails,
    playerGameDetails,
    hostGameDetails,
  }

  return retVal;
}

