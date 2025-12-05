import { z } from "zod";
import { type BfgGameInstanceId, type BfgGameRoomId, type BfgGameTableId } from "../../models/types/bfg-branded-uuids";
import { GameRoomPersist, type UpdatedGameTable } from "../../models/tinybase/game-room-persist";
import { ALL_PLAYER_SEATS } from "../../models/internal/game-room-base";
import { GameLobby } from "../../models/p2p-lobby";
import type { IGameRegistry } from "@bfg-engine/game-metadata/games-registry";
import { ROOM_PHASE_GAME_IN_PROGRESS } from "../../models/internal/table-phase";
import { saveNewHostedGame } from "../../tb-store/games-archives-store";
import type { BfgGameStepIndex, BfgTimestamp } from "../../models/types/bfg-versions";
import type { GameTableEventForDb } from "../../game-metadata/metadata-types";
// import type { BfgGameRoomEvent } from "../../game-metadata/metadata-types";


// const createNewGameTableFromLobbyState = (
//   lobbyState: GameLobby,
//   newGameTableId: BfgGameTableId,
//   gameMetadata: GenericGameMetadata,
// ): GameTable => {
//   const gameTitle = lobbyState.gameTitle;
//   if (!gameTitle) {
//     throw new Error("Game title not found");
//   }

//   // Validate lobby has at least 1 player
//   const playerPool = lobbyState.playerPool;
//   if (playerPool.length < 1) {
//     throw new Error("Lobby must have at least 1 player");
//   }

//   const now = Date.now();
//   const latestActionId = BfgGameTableActionIdToolbox.createRandomId();

//   const players = playerPool.map((player, index) => {
//     const role = ALL_PLAYER_SEATS[index];
//     const retVal = {
//       role,
//       playerName: player.handle,
//       playerProfileId: player.id,
//     }
//     return retVal;
//   });

//   const GameSpecificGameRoomSchema = createGameRoomSchemaForGame(gameMetadata);
//   type GameSpecificGameTable = z.infer<typeof GameSpecificGameRoomSchema>;

//   // Fill out p1-p8 from the lobby player pool array
//   const retVal: GameSpecificGameTable = {
//     id: newGameTableId,
//     latestActionId,
//     createdAt: now,
//     lastUpdatedAt: now,
//     players,
//     gameTitle,
//     tableName: lobbyState.lobbyName,
//     gameHostPlayerProfileId: lobbyState.gameHostPlayerProfile.id,
//     tablePhase: 'table-phase-game-setup',
//     currentStatusDescription: lobbyState.currentStatusDescription,
//   }

//   return retVal;
// }



const createNewGameRoomFromGameSpecificState = (
  lobbyState: GameLobby,
  newGameRoomId: BfgGameRoomId,
  newGameTableId: BfgGameTableId,
  // gameMetadata: GenericGameMetadata,
  // gameStateTransition: GameStateTransition,
): GameRoomPersist => {

  const gameTitle = lobbyState.gameTitle;
  if (!gameTitle) {
    throw new Error("Game title not found");
  }

  // Validate lobby has at least 1 player
  const playerPool = lobbyState.playerPool;
  if (playerPool.length < 1) {
    throw new Error("Lobby must have at least 1 player");
  }

  const now = Date.now();
  // const latestActionId = BfgGameTableActionIdToolbox.createRandomId();

  const players = playerPool.map((player, index) => {
    const role = ALL_PLAYER_SEATS[index];
    const retVal = {
      role,
      playerName: player.handle,
      playerProfileId: player.id,
      playerProfile: player,
    }
    return retVal;
  });

  // const GameSpecificGameRoomDbSchema = createGameRoomDbSchemaForGame(gameMetadata);
  // type GameSpecificGameRoomDb = z.infer<typeof GameSpecificGameRoomDbSchema>;

  // // Fill out p1-p8 from the lobby player pool array
  // const retVal: GameSpecificGameTable = {
  //   id: newGameTableId,
  //   latestActionId,
  //   createdAt: now,
  //   lastUpdatedAt: now,
  //   players,
  //   gameTitle,
  //   tableName: lobbyState.lobbyName,
  //   gameHostPlayerProfileId: lobbyState.gameHostPlayerProfile.id,
  //   tablePhase: 'table-phase-game-setup',
  //   currentStatusDescription: lobbyState.currentStatusDescription,
  // }

  const playerCount = playerPool.length;

  // Fill out p1-p8 from the lobby player pool array
  const retVal: GameRoomPersist = {
    id: newGameRoomId,
    gameTableId: newGameTableId,

    // latestGameTableId: newGameTableId,
    latestGameStepIndex: 0,
    // latestStep: gameSpecificStep,
    // latestGameStatusDescription: gameSpecificStep.nextGameState.summary,
    latestRoomStatusDescription: `${playerCount} playing ${gameTitle}`,
    latestGameStatusDescription: `Game setup in progress: ${lobbyState.lobbyName} [${gameTitle}]`,
    latestRoomPhase: ROOM_PHASE_GAME_IN_PROGRESS,
    createdAt: now,
    lastUpdatedAt: now,
    players,
    gameTitle,
    tableName: lobbyState.lobbyName,
    gameHostPlayerProfileId: lobbyState.gameHostPlayerProfile.id,
    // tablePhase: 'table-phase-game-setup',
    // currentStatusDescription: lobbyState.currentStatusDescription,
  }

  return retVal;
}


export const asHostStartNewGame = async (
  gameRegistry: IGameRegistry,
  lobbyState: GameLobby,
  newGameInstanceId: BfgGameInstanceId,
  newGameRoomId: BfgGameRoomId,
  newGameTableId: BfgGameTableId,
): Promise<UpdatedGameTable> => {

  console.log("DB: asHostStartGame", lobbyState);

  const gameTitle = lobbyState.gameTitle;
  if (!gameTitle) {
    throw new Error("Game title not found");
  }

  const newGameRoom = createNewGameRoomFromGameSpecificState(lobbyState, newGameRoomId, newGameTableId);

  const now = Date.now() as BfgTimestamp;
  const metadata = gameRegistry.getGameMetadata(gameTitle);
  const gameProcessor = metadata.gameProcessor;
  const gameSchemas = metadata.schemas;

  const startGameAction = gameProcessor.createHostStartsGameAction(lobbyState);
  const startGameOutcome = gameProcessor.createHostOpensGameOutcome(startGameAction);
  const startGameState = gameProcessor.createHostOpensGameState(startGameAction);

  // Type for game step can be extracted when needed:
  type BfgGameStep = z.infer<typeof gameSchemas.gameStepSchema>;
  const bfgGameStep: BfgGameStep = {
    // stepIndex: 0 as BfgGameStepIndex,
    // createdAt: now as BfgTimestamp,
    source: 'host',
    action: startGameAction,
    outcome: startGameOutcome,
    // nextBoardState: startGameState,
  }
  
  const GameRoomEventSchema = gameSchemas.gameTableEventSchema;
  // type GameRoomEvent = z.infer<typeof GameRoomEventSchema>;

  const gameRoomEvent: GameTableEventForDb = {
    createdAt: now,
    stepIndex: 0 as BfgGameStepIndex,
    source: "game-table-action-source-host",
    eventType: "game-table-action-host-starts-setup",
    event: bfgGameStep,
    nextBoardState: startGameState,
  }

  const gameRoomEventParseResult = GameRoomEventSchema.safeParse(gameRoomEvent);
  if (!gameRoomEventParseResult.success) {
    console.error('Error validating game room event:', gameRoomEventParseResult.error);
    throw new Error('Invalid game room event');
  }
  const validatedGameRoomEvent = gameRoomEventParseResult.data;

  console.log("ADDING GAME ACTION", gameRoomEvent);
  const saveResult = await saveNewHostedGame(newGameInstanceId, newGameRoomId, newGameTableId, newGameRoom, validatedGameRoomEvent);
  
  if (!saveResult.success) {
    console.error('Failed to save new hosted game:', saveResult.error);
    throw new Error(`Failed to save new hosted game: ${saveResult.error}`);
  }
  
  console.log('Successfully saved new hosted game:', newGameInstanceId);

  const retVal: UpdatedGameTable = {
    gameRoom: newGameRoom,
    gameState: startGameState,
  };

  return retVal;
}
