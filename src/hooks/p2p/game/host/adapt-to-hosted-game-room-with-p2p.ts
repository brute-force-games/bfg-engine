import { useState, useEffect, useCallback } from "react";
import { useGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry-hook";
import { PublicPlayerProfile } from "@bfg-engine/models/internal/player-profile/public-player-profile";
import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { PeerId, type UserGameRoomPerspectiveStr } from "../../p2p-types";
import { IBfgGameTableForHost, IHostBfgGameDetails, IPlayerBfgGameDetails, IPublicBfgGameDetails } from "../p2p-game-types";
import { matchPlayerToSeat } from "@bfg-engine/ops/game-table-ops/player-seat-utils";
import type { BfgGameActionByHost, BfgGameActionByPlayer } from "../../../../game-metadata/metadata-types/game-action-types";
import { updateHostedGameWithNewNextBoardState, useLatestHostedGameSnapshot } from "../../../../tb-store/games-archives-store";
import type { GameTableActionSource } from "../../../../models/game-table/game-table-event";
import type { GameTableSeat } from "../../../../models/internal/game-room-base";
import type { BfgGameStepIndex, BfgTimestamp } from "../../../../models/types/bfg-versions";
import type { GameRoomModeHostPlusP2pAccess } from "../p2p-game-types";
import { useGameInstanceUserDetails } from "../use-bfg-game-instance";
// import type { GameTableEventForGameStep } from "../../../../models/game-table/game-table-event";
// import { convertGameRoomDbToP2p, convertGameBoardEventDbToPlayerP2p } from "../hosted-game-room-context-utils";
// import { type UserGameRoomDataForPlayer, type UserGameRoomDataForWatcher } from "../user-game-room-data";
// import { GameTableEventForWatcherP2pSchema } from "../../../../models/p2p/game-table-event-p2p";
import { useP2pDetailsFromRawP2pRoom } from "../p2p-details-from-raw-p2p-room-hook";
import { convertGameRoomDbToP2p } from "../hosted-game-room-context-utils";
import type { UserGameRoomDataForPlayer, UserGameRoomDataForWatcher } from "../user-game-room-data";
// import type { GameTableEvent } from "../../../../models/tinybase/game-board-event";
import type { GameTableEventForDb } from "../../../../game-metadata/metadata-types";


type P2pPlayerGameRoomData = {
  type: 'p2p';
  peerId: PeerId;
  playerProfile: PublicPlayerProfile;
  gameSeat: GameTableSeat;
}

type HostPlayerGameRoomData = {
  type: 'host';
  playerProfile: PublicPlayerProfile;
  gameSeat: GameTableSeat | null;
}

type PlayerGameRoomData = P2pPlayerGameRoomData | HostPlayerGameRoomData;


export const adaptToHostedGameRoomWithP2p = (
  hostingMode: GameRoomModeHostPlusP2pAccess,
): IBfgGameTableForHost | null => {

  const hostedGameRoomContext = hostingMode.hostedGameRoom;
  const p2pGameRoom = hostingMode.p2pRawRoom;

  const gameInstanceUserDetails = useGameInstanceUserDetails(p2pGameRoom.gameInstanceId, 'host');

  const { hostedGame, hostedGameTableEvents, latestStepIndex, latestTableEvent } = hostedGameRoomContext;

  const myPlayerProfile = gameInstanceUserDetails.myPlayerProfile;

  const p2pDetails = useP2pDetailsFromRawP2pRoom(p2pGameRoom, myPlayerProfile);

  const createPlayerGameRoomDataForHost = (playerProfile: PublicPlayerProfile): PlayerGameRoomData | null => {
    const gameSeat = matchPlayerToSeat(playerProfile.id, hostedGame);
    if (gameSeat === null) {
      return null;
    }

    const myPlayerGameRoomData: PlayerGameRoomData = {
      type: 'host',
      playerProfile,
      gameSeat,
    };  
    return myPlayerGameRoomData;
  }

  const { peerIds, peerIdsToPlayerIds, allPlayerProfiles } = p2pDetails;

  const [allPlayerGameRoomData, _setAllPlayerGameRoomData] = useState<Map<PlayerProfileId, PlayerGameRoomData>>(() => {
    const profiles = new Map<PlayerProfileId, PlayerGameRoomData>();
    if (myPlayerProfile) {
      const myPlayerGameRoomData = createPlayerGameRoomDataForHost(myPlayerProfile);
      if (myPlayerGameRoomData !== null) {
        profiles.set(myPlayerProfile.id, myPlayerGameRoomData);
      }
    }
    return profiles;
  });

  const gameRegistry = useGameRegistry();
  const hostedGameSnapshot = useLatestHostedGameSnapshot(p2pGameRoom.gameInstanceId);
  if (!hostedGameSnapshot) {
    console.error('❌ Hosted game room snapshot not found');
    return null;
  }

  // Debug: log when board events change
  useEffect(() => {
    console.log('🎮 Board events updated, count:', hostedGameTableEvents.length);
    if (hostedGameTableEvents.length > 0) {
      const latestEvent = hostedGameTableEvents[hostedGameTableEvents.length - 1];
      // console.log('🎮 Latest event stepIndex:', latestEvent.stepIndex, 'source:', latestEvent.source);
      console.log('🎮 Latest event stepIndex:', latestEvent.stepIndex);
    }
  }, [hostedGameTableEvents.length, hostedGameTableEvents]);

  // 
  // const latestStepIndex = hostedGameBoardEvents.length - 1;
  // const latestBoardEvent = hostedGameBoardEvents[latestStepIndex];
  // if (!latestBoardEvent) {
  //   throw new Error('No board events found - cannot apply player action');
  // }
  const latestGameState = latestTableEvent.nextBoardState;
  
  // Debug: log when latest game state changes
  useEffect(() => {
    console.log('🎮 Latest game state updated, stepIndex:', latestStepIndex);
  }, [latestStepIndex, latestGameState]);


  // const gameActions = useGameActions(p2pGameRoom.gameTableId);

  // const [myPlayerSeatGameStates, setMyPlayerSeatGameStates] = useState<BfgGameStateForPlayer | null>(null);
  // const [watcherGameState, setWatcherGameState] = useState<BfgGameStateForWatcher | null>(null);
  // const [watcherGameActions, setWatcherGameActions] = useState<DbGameTableAction[]>([]);

  
  // const { txGameRoom, txPublicGameEventsDataStr, txPrivatePlayerKnowledgeStr } = p2pGameRoom;
  const { txUserGameRoomPerspectiveStr } = hostingMode.p2pRawRoom;

  
  
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

    // const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);


    // go through peer IDs. 
    // * for those who are players, create their version of the game room data, stringify it, and send it to them.
    // * for those who are not players (i.e. observers), stringify the observer version of the room data, and send it to them.

    // Step 1: Classify peer IDs into players and watchers
    const playerPeers: PeerId[] = [];
    const watcherPeers: PeerId[] = [];
    
    console.log('🎮 Host: Classifying peers. Total peers:', peerIds.length);
    console.log('🎮 Host: peerIdsToPlayerIds map:', Array.from(peerIdsToPlayerIds.entries()));
    
    for (const peerId of peerIds) {
      const playerProfileId = peerIdsToPlayerIds.get(peerId);
      if (playerProfileId) {
        playerPeers.push(peerId);
        console.log('🎮 Host: Classified peer as player:', peerId, '->', playerProfileId);
      } else {
        watcherPeers.push(peerId);
        console.log('🎮 Host: Classified peer as watcher:', peerId);
      }
    }

    console.log('🎮 Host: Player peers:', playerPeers.length, 'Watcher peers:', watcherPeers.length);

    // Step 2: If watchers exist, create watcher data
    const gameRoomP2p = convertGameRoomDbToP2p(hostedGame);
    // const stringifiedRoomState = JSON.stringify(gameRoomP2p);
    
    // let watcherUserGameRoomDataStr: ReturnType<typeof UserGameRoomDataStrSchema.parse> | null = null;
    if (watcherPeers.length > 0) {
      console.log('🎮 Host: Creating watcher data for', watcherPeers.length, 'watcher(s)');
      // const watcherBoardTransitions = hostedGameBoardEvents.map(convertGameBoardEventDbToWatcherP2p);
      // const stringifiedBoardTransitions = JSON.stringify(watcherBoardTransitions);
      
      // const watcherUserGameRoomDataP2p = UserGameRoomDataP2pSchema.parse({
      //   gameInstanceId: p2pGameRoom.gameInstanceId,
      //   gameRole: 'watch',
      //   stringifiedRoomState,
      //   stringifiedBoardTransitions,
      // });

      // Use the game metadata adapter to properly convert host events to watcher events
      const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);
      if (!gameMetadata) {
        console.error('❌ Game metadata not found for game title:', hostedGame.gameTitle);
        return;
      }

      // const tableEventSchema = gameMetadata.schemas.gameTableEventSchema;

      // Convert host events to watcher events and validate through schema to ensure clean data
      // This removes any extra fields like nextGamePlayerStates that might be in the host state
      const watcherGameHistory = hostedGameTableEvents.map(tableEvent => {
        // const gameStepSchema = gameMetadata.schemas.gameStepSchema;
        // const gameStep = gameStepSchema.parse(tableEvent.gameStep);
        // const tableEvent = tableEventSchema.parse(tableEvent);

        const converted = gameMetadata.gameEventOutcomePerspectiveAdapters
          .hostEventTransitionToWatcherAccessLevelAdapter(tableEvent.event, tableEvent.nextBoardState);

        return converted;
        // Log the converted object to debug
        // if (Object.keys(converted).includes('nextGamePlayerStates')) {
        //   console.error('❌ Host: Converted watcher event still has nextGamePlayerStates!', converted);
        // }
        // Validate through schema to ensure no extra fields like nextGamePlayerStates
        // The schema will strip out any fields that aren't in the watcher schema
        // const parsed = GameTableEventForWatcherP2pSchema.parse(converted);
        // if (Object.keys(parsed).includes('nextGamePlayerStates')) {
        //   console.error('❌ Host: Parsed watcher event still has nextGamePlayerStates after schema parse!', parsed);
        // }
        // return parsed;
      });

      const watcherUserGameRoomDataP2p: UserGameRoomDataForWatcher = {
        // gameInstanceId: hostingMode.gameInstanceId,
        accessLevel: 'observer',
        role: 'watcher',
        gameRoom: gameRoomP2p,
        watcherGameHistory,
      };
      
      const watcherUserGameRoomDataStr = JSON.stringify(watcherUserGameRoomDataP2p) as UserGameRoomPerspectiveStr;
      for (const peerId of watcherPeers) {
        txUserGameRoomPerspectiveStr(watcherUserGameRoomDataStr, peerId);
        console.log('🎮 Host: Sent watcher game room data to peer:', peerId);
      }
    }

    // Step 3: For each classified peer ID, send player or watcher data as applicable
    // Send player-specific data to each player
    for (const peerId of playerPeers) {
      const playerProfileId = peerIdsToPlayerIds.get(peerId);
      if (!playerProfileId) {
        // This shouldn't happen since we classified above, but handle it gracefully
        console.error('❌ Player profile ID not found for peer:', peerId);
        continue;
      }
      
      const playerGameRoomData = allPlayerGameRoomData.get(playerProfileId);
      if (!playerGameRoomData) {
        console.error('❌ Player game room data not found for peer:', peerId, 'player profile:', playerProfileId);
        continue;
      }
      
      if (playerGameRoomData.type !== 'p2p') {
        console.error('❌ Expected p2p player game room data, got:', playerGameRoomData.type);
        continue;
      }
      
      const playerSeat = playerGameRoomData.gameSeat;
      const toPlayerGameEventsFn = gameMetadata.gameEventOutcomePerspectiveAdapters
        .hostGameTableEventToPlayerPerspectiveAdapter;
      const playerGameHistory = hostedGameTableEvents.map((event) => 
        toPlayerGameEventsFn(playerSeat, event)
      );

      const playerGameRoomDataP2p: UserGameRoomDataForPlayer = {
        // gameInstanceId: hostingMode.gameInstanceId,
        accessLevel: 'player',
        role: 'player',
        playerSeat,
        gameRoom: gameRoomP2p,
        playerGameHistory: playerBoardTransitions,
      };

      const playerUserGameRoomDataStr = JSON.stringify(playerGameRoomDataP2p) as UserGameRoomPerspectiveStr;
      txUserGameRoomPerspectiveStr(playerUserGameRoomDataStr, peerId);
      console.log('🎮 Host: Sent player game room data to peer:', peerId, 'for seat:', playerSeat);

      // const playerUserGameRoomDataP2p = UserGameRoomDataP2pSchema.parse({
      //   gameInstanceId: p2pGameRoom.gameInstanceId,
      //   gameRole: 'play',
      //   stringifiedRoomState,
      //   stringifiedBoardTransitions,
      // });
      
      // const userGameRoomDataStr = UserGameRoomDataStrSchema.parse(JSON.stringify(playerUserGameRoomDataP2p));
      // txUserGameRoomDataStr(userGameRoomDataStr, peerId);
      // console.log('🎮 Host: Sent player game room data to peer:', peerId, 'for seat:', playerSeat);
    }

    // // Send watcher data to each watcher
    // if (watcherUserGameRoomDataStr !== null) {
    //   for (const peerId of watcherPeers) {
    //     txUserGameRoomDataStr(watcherUserGameRoomDataStr, peerId);
    //     console.log('🎮 Host: Sent watcher game room data to peer:', peerId);
    //   }
    // }


    // const gameRoomP2p: GameRoomP2p = {
    //   // id: hostedGameState.id,
    //   // gameTitle: hostedGameState.gameTitle,
    //   // tableName: hostedGameState.tableName,
    //   // gameHostPlayerProfileId: hostedGameState.gameHostPlayerProfileId,
    //   // latestRoomStatusDescription: hostedGameState.latestRoomStatusDescription,
    //   // players: hostedGameState.players,
    //   // latestGameStepIndex: hostedGameState.latestGameStepIndex,
    //   // latestGameStatusDescription: hostedGameState.latestGameStatusDescription,
    //   // latestRoomPhase: hostedGameState.latestRoomPhase,
    //   // createdAt: hostedGameState.createdAt,
    //   // lastUpdatedAt: hostedGameState.lastUpdatedAt,
    //   ...hostedGame,
    // } satisfies GameRoomP2p;

    // const gameRoomP2p = hostedGame;

    // console.log('🎮 Host sending game data:', gameTable)

    // txPublicGameTableData(gameTable);
    // txUserGameRoomDataStr(gameRoomP2p);

    // const latestGameAction = gameActions[gameActions.length - 1];
    // const gameState = gameMetadata.encoders.hostGameStateEncoder.decode(latestGameAction.nextGameStateStr);
    // if (!gameState) {
    //   console.error('❌ Current host game state not available');
    //   return;
    // }

    // // For private knowledge games, transform game actions to contain only public state before sending
    // if (gameMetadata.metadataType === 'public-knowledge-game') {
    //   // For public knowledge games, send as-is
    //   // txPublicGameActionsData(gameActions);
    // } else {

    //   // // Transform all game actions to use public game state instead of host game state
    //   // const publicGameActions = gameActions.map(action => {
    //   //   const hostState = gameMetadata.encoders.hostGameStateEncoder.decode(action.nextGameStateStr);
    //   //   if (!hostState) {
    //   //     console.error('❌ Failed to decode host state for action:', action);
    //   //     return action;
    //   //   }
        
    //   //   // Extract only public fields by parsing through the public schema
    //   //   // This ensures we don't include private fields like 'deck' or 'playerHandStates'
    //   //   try {
    //   //     // const publicState = gameMetadata.schemas.publicGameStateSchema.parse(hostState);
          
    //   //     const watcherState = gameMetadata.accessLevelConverters.hostToWatcherAccessLevel(hostState);
    //   //     const publicStateStr = gameMetadata.encoders.watcherGameStateEncoder.encode(watcherState);
        
    //   //     return {
    //   //       ...action,
    //   //       nextGameStateStr: publicStateStr,
    //   //     };

    //   //   } catch (error) {
    //   //     console.error('❌ Failed to parse host state as public state:', error);
    //   //     console.error('❌ Host state:', hostState);
    //   //     console.error('❌ Game:', gameMetadata.gameTitle);
    //   //     return action;
    //   //   }
    //   // });
      
    //   // txPublicGameActionsData(publicGameActions);
    //   // setMyPlayerSeatGameStates(playerSeatGameStates);
    //   console.warn("Implement me");
    // }

    // // send private player knowledge updates; update self player knowledge
    // if (gameMetadata.metadataType === 'private-player-knowledge-game') {
    //   // const playerSeatGameStates = gameMetadata.accessLevelConverters.hostToPlayerSeatGameStates(gameTable, gameState);
    //   // if (!playerSeatGameStates || playerSeatGameStates.length === 0) {
    //   //   console.error('❌ Player seat access levels not found');
    //   //   return;
    //   // }

    //   // for (const { playerSeat, } of playerSeatGameStates) {
        
    //   //   if (playerSeat === myPlayerSeat) {
    //   //     console.log('🎮 Host: Setting my own private knowledge');
    //   //     // setMyPrivatePlayerKnowledgeStr(privatePlayerKnowledgeStr);
    //   //     console.warn("Implement me");
    //   //   } else {
    //   //     console.log('🎮 Host: Looking up peer ID for seat', playerSeat);
    //   //     const playerSeatPeerId = getPeerIdForPlayerSeat(playerSeat, gameTable, peerIdsToPlayerIds);
    //   //     if (!playerSeatPeerId) {
    //   //       console.error('❌ Player seat peer ID not found:', playerSeat);
    //   //       // console.error('❌ Expected profile ID:', gameTable[playerSeat]);
    //   //       console.error('❌ Available peers:', Array.from(peerIdsToPlayerIds.entries()));
    //   //       continue;
    //   //     }
    //   //     console.log('🎮 Host: Sending private knowledge to peer', playerSeatPeerId, 'for seat', playerSeat);
    //   //     // txPrivatePlayerKnowledgeStr(privatePlayerKnowledgeStr, playerSeatPeerId);
    //   //     console.warn("Implement me");
    //   //   }
    //   // }
    // }
      
    // } else {
    //   console.log('🎮 Host cannot send game data - missing:', { hostedGame: !!hostedGameState, gameActions: !!gameActions })
    // }
  }, [hostedGame, hostedGameSnapshot, peerIds, peerIdsToPlayerIds, allPlayerGameRoomData, hostingMode.gameInstanceId, hostedGameTableEvents, txUserGameRoomPerspectiveStr])

  // Update the ref whenever doSendGameUpdates changes
  // doSendGameUpdatesRef.current = doSendGameUpdates;
  // doSendGameUpdatesRef.current = doSendGameUpdates;
  

  useEffect(() => {
    // const onRoomPeerJoinUnsubscribe = p2pGameRoom.onRoomPeerJoin((peerId: PeerId) => {
    //   console.log('🎮 Host: Peer joined:', peerId);
    //   setPeers(prev => [...prev, peerId]);
    //   // Send game updates to the new peer after a short delay to ensure they're subscribed
    //   setTimeout(() => {
    //     console.log('🎮 Host: Sending game updates after peer join');
    //     doSendGameUpdates();
    //   }, 100);
    // });

    // const onRoomPeerLeaveUnsubscribe = p2pGameRoom.onRoomPeerLeave((peerId: PeerId) => {
    //   console.log('🎮 Host: Peer left:', peerId);
    //   setPeers(prev => prev.filter(p => p !== peerId));
      
    //   // Clean up the peerPlayerIds mapping
    //   setPeerIdsToPlayerIds(prev => {
    //     const newMap = new Map(prev);
    //     const playerProfileId = newMap.get(peerId);
    //     if (playerProfileId) {
    //       console.log('🎮 Host: Removing peer mapping:', peerId, '->', playerProfileId);
    //       newMap.delete(peerId);
    //       console.log('🎮 Host: Remaining peer mappings:', Array.from(newMap.entries()));
    //     }
    //     return newMap;
    //   });
    // });

    // const rxPlayerProfileUnsubscribe = p2pGameRoom.rxPlayerProfile((playerProfile, peerId) => {
    //   console.log('🎮 Host: Received player profile from peer:', peerId, playerProfile);
    //   setAllPlayerGameRoomData(prev => {
    //     const newMap = new Map(prev);

    //     const playerGameRoomData = createPlayerGameRoomData(playerProfile, peerId);
    //     if (playerGameRoomData === null) {
    //       console.error('❌ Failed to create player game room data');
    //       return prev;
    //     }
    //     newMap.set(playerProfile.id, playerGameRoomData);
    //     console.log('🎮 Host: Updated allPlayerProfiles, now has:', Array.from(newMap.keys()));
    //     return newMap;
    //   });
    //   setPeerIdsToPlayerIds(prev => {
    //     const newMap = new Map(prev);
    //     newMap.set(peerId, playerProfile.id);
    //     console.log('🎮 Host: Updated peerPlayerIds mapping:', peerId, '->', playerProfile.id);
    //     console.log('🎮 Host: All peer mappings now:', Array.from(newMap.entries()));
    //     return newMap;
    //   });
    //   // Note: doSendGameUpdates will be automatically triggered by the useEffect
    //   // when peerPlayerIds changes, so no need to call it explicitly here
    // });

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
      // onRoomPeerJoinUnsubscribe();
      // onRoomPeerLeaveUnsubscribe();
      // rxPlayerProfileUnsubscribe();
      rxPlayerActionStrUnsubscribe();
    };
  }, [hostedGame, hostedGameSnapshot, myHostProfile, gameRegistry, p2pGameRoom]);

  // Call doSendGameUpdates when peers, game data, or board events change
  useEffect(() => {
    if (hostedGame && hostedGameSnapshot && peerIds.length > 0) {
      console.log('🎮 Host: Sending game updates (peers, game data, or events changed)');
      doSendGameUpdates();
    }
  }, [peerIds, hostedGame, hostedGameSnapshot, hostedGameTableEvents, peerIdsToPlayerIds, doSendGameUpdates])

  // Call doSendGameUpdates when game actions actually change (new moves applied)
  useEffect(() => {
    console.warn("Implement me - game actions???");
    console.warn(hostedGameTableEvents.length);
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

  // const allPlayerProfiles = new Map<PlayerProfileId, PublicPlayerProfile>();
  for (const playerGameRoomData of allPlayerGameRoomData.values()) {
    allPlayerProfiles.set(playerGameRoomData.playerProfile.id, playerGameRoomData.playerProfile);
  }

  // const p2pDetails: IP2pDetails = {
  //   peerIds: peers,
  //   peerIdsToPlayerIds,
  //   allPlayerProfiles,
  //   myPeerProfile: myHostProfile,
  //   connectionStatus: p2pGameRoom.connectionStatus,
  //   connectionEvents: p2pGameRoom.connectionEvents,
  // }

  if (gameInstanceUserDetails.maxAllowedAccessLevel !== 'host' ||
      gameInstanceUserDetails.myHostProfile === null ||
      hostedGame === null ||
      hostedGameSnapshot === null ||
      hostedGameTableEvents.length === 0
  ) {
    return null;
  }

  const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);

  const onPlayerAction = useCallback(async (playerAction: BfgGameActionByPlayer) => {
    console.log('🎮 Host received player action:', playerAction);

    const hostPlayerProfileId = gameInstanceUserDetails.myHostProfile?.id;
    if (!hostPlayerProfileId) {
      throw new Error('Host player profile ID not found');
    }

    console.warn("Implement me - as host apply move from player");
    console.warn(playerAction);


    const moveResult = await gameMetadata.gameProcessor.applyPlayerAction(hostedGame, latestGameState, playerAction);
    if (!moveResult) {
      console.error('❌ Failed to apply player action');
      console.warn(moveResult);
      console.warn(playerAction);
      console.warn(latestGameState);
      throw new Error('Failed to apply player action');
    }

    // const latestStepIndex = hostedGame.latestGameStepIndex;
    // const updatedGameTable = moveResult.updatedGameState;
    // const updatedGameEvent = moveResult.updatedGameEvent;
    // const updatedGameEventChange = moveResult.updatedGameEventChange;
    // const updatedNextGameState = moveResult.updatedNextGameState;
    const { updatedGameState, playerActionOutcome } = moveResult;

    const now = Date.now() as BfgTimestamp;
    const nextStepIndex = latestStepIndex + 1 as BfgGameStepIndex;

    // Get player action source from playerSeat
    const playerActionSource: GameTableActionSource = `game-table-action-source-player-${playerAction.playerSeat}` as GameTableActionSource;

    // Create the game step with full details
    // const gameStep: BfgGameStep = {
    //   createdAt: now,
    //   stepIndex: nextStepIndex,
    //   event: playerAction,
    //   outcome: playerActionOutcome,
    //   nextBoardState: updatedGameState,
    // };

    // Create the game event with transition (nested structure)
    const playerActionEvent: GameTableEventForDb = {
      stepIndex: nextStepIndex,
      createdAt: now,
      source: playerActionSource,
      eventType: 'game-table-action-player-action',
      event: {
        source: 'player',
        action: playerAction,
        outcome: playerActionOutcome,
      },
      nextBoardState: updatedGameState,
      // gameStep,
    };

    // addGameBoardTransition(p2pGameRoom.gameInstanceId, playerActionEvent);

    updateHostedGameWithNewNextBoardState(p2pGameRoom.gameInstanceId, nextStepIndex, playerActionEvent);

    // updateHostedGame(hostedGameState.id, updatedGameTable, updatedGameEvent, updatedGameEventChange, updatedNextGameState);
    
      
    // const moveResult = await asHostApplyMoveFromPlayer(gameRegistry, hostedGameState, gameActions, hostPlayerProfileId, playerAction);
    // if (moveResult) {
    //   const updatedGameTable = moveResult.gameTable;
    //   const updatedGameEvent = moveResult.gameEvent;
    //   const updatedGameEventChange = moveResult.gameEventChange;
    //   const updatedNextGameState = moveResult.nextGameState;
    //   updateHostedGame(hostedGameState.id, updatedGameTable, updatedGameEvent, updatedGameEventChange, updatedNextGameState);
    // }
  }, [gameMetadata, gameRegistry, hostedGame, hostedGameSnapshot, hostedGameTableEvents, gameInstanceUserDetails.myHostProfile, latestGameState, latestStepIndex, p2pGameRoom.gameInstanceId]);

  const onHostAction = useCallback(async (hostAction: BfgGameActionByHost) => {
    console.log('🎮 Host received host action:', hostAction);

    const hostPlayerProfileId = gameInstanceUserDetails.myHostProfile?.id;
    if (!hostPlayerProfileId) {
      throw new Error('Host player profile ID not found');
    }

    const moveResult = await gameMetadata.gameProcessor.applyHostAction(hostedGame, latestGameState, hostAction);
    if (!moveResult) {
      console.error('❌ Failed to apply host action');
      console.warn(moveResult);
      console.warn(hostAction);
      console.warn(latestGameState);
      throw new Error('Failed to apply host action');
    }

    const { updatedGameState, hostActionOutcome } = moveResult;

    const now = Date.now() as BfgTimestamp;
    const nextStepIndex = latestStepIndex + 1 as BfgGameStepIndex;

    // // Create the game step with full details
    // const gameStep: BfgGameStep = {
    //   stepIndex: nextStepIndex,
    //   createdAt: now,
    //   event: hostAction,
    //   outcome: hostActionOutcome,
    //   nextBoardState: updatedGameState,
    // };

    // Create the game event with transition (nested structure)
    const hostActionEvent: GameTableEventForDb = {
      stepIndex: nextStepIndex,
      createdAt: now,
      source: 'game-table-action-source-host',
      eventType: 'game-table-action-host-action',
      // gameStep,
      event: {
        source: 'host',
        action: hostAction,
        outcome: hostActionOutcome,
      },
      // outcome: hostActionOutcome,
      nextBoardState: updatedGameState,
    };

    updateHostedGameWithNewNextBoardState(p2pGameRoom.gameInstanceId, nextStepIndex, hostActionEvent);

  }, [gameMetadata, gameRegistry, hostedGame, hostedGameSnapshot, gameInstanceUserDetails.myHostProfile, latestGameState, latestStepIndex, p2pGameRoom.gameInstanceId]);

  if (!hostedGame || !hostedGameSnapshot) {
    return null;
  }

  const playerGame = hostedGame;
  const watcherGame = hostedGame;

  const myPlayerGameEvents = myPlayerSeat ? 
    hostedGameTableEvents.map(boardEvent => gameMetadata.gameEventOutcomePerspectiveAdapters
      .hostGameTableEventToPlayerPerspectiveAdapter(myPlayerSeat, boardEvent)) :
    [];

  const latestMyPlayerGameEvent = myPlayerSeat ? 
    myPlayerGameEvents[myPlayerGameEvents.length - 1] : 
    null;

  // Debug: log when player game events change
  useEffect(() => {
    if (myPlayerSeat) {
      console.log('🎮 Player game events updated, count:', myPlayerGameEvents.length);
      if (latestMyPlayerGameEvent) {
        console.log('🎮 Latest player game event stepIndex:', myPlayerGameEvents.length - 1);
      }
    }
  }, [myPlayerGameEvents.length, latestMyPlayerGameEvent, myPlayerSeat]);

  const toWatcherGameEventsFn = gameMetadata.gameEventOutcomePerspectiveAdapters.hostEventTransitionToWatcherAccessLevelAdapter;

  const watcherGameEvents = hostedGameTableEvents.map(boardEvent => {
    const perspective = toWatcherGameEventsFn(boardEvent.event.outcome, boardEvent.nextBoardState);
    return {
      stepIndex: boardEvent.stepIndex,
      createdAt: boardEvent.createdAt,
      ...(perspective as object),
    };
  });

  const latestWatcherGameEvent = watcherGameEvents[watcherGameEvents.length - 1];

  const hostGameEvents = hostedGameTableEvents;

  // const hostGameEvents = hostedGameBoardEvents.map(boardEvent => gameMetadata.gameEventOutcomePerspectiveAdapters
  //   .hostEventTransitionFromHostEventTransitionDb(boardEvent));

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
    gameInstanceUserDetails.allowedLevels.includes('player') ? {
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
    gameInstanceId: p2pGameRoom.gameInstanceId,
    gameMetadata,

    accessLevel: 'host',
    maxAllowedAccessLevel: gameInstanceUserDetails.maxAllowedAccessLevel,
    allowedLevels: gameInstanceUserDetails.allowedLevels,
    myHostProfile: gameInstanceUserDetails.myHostProfile,

    p2pDetails,
    publicGameDetails,
    playerGameDetails,
    hostGameDetails,
  }

  return retVal;
}

