import { z } from "zod";
import { type BfgGameInstanceId, type BfgGameRoomId, type BfgGameTableId } from "../../models/types/bfg-branded-uuids";
import { GameRoomDb, type UpdatedGameRoom } from "../../models/tinybase/game-room-db";
import { ALL_PLAYER_SEATS } from "../../models/internal/game-room-base";
import { GameLobby } from "../../models/p2p-lobby";
import type { IGameRegistry } from "@bfg-engine/game-metadata/games-registry";
import { ROOM_PHASE_GAME_IN_PROGRESS } from "../../models/internal/table-phase";
import { saveNewHostedGame } from "../../tb-store/games-archives-store";
import { createGameStateTransitionForDbSchema } from "../../models/game-table/game-table-event-db";
import { createGameTableEventWithTransitionSchema } from "../../models/game-table/game-table-event";


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
): GameRoomDb => {

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
  const retVal: GameRoomDb = {
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
): Promise<UpdatedGameRoom> => {

  console.log("DB: asHostStartGame", lobbyState);

  const gameTitle = lobbyState.gameTitle;
  if (!gameTitle) {
    throw new Error("Game title not found");
  }

  const newGameRoom = createNewGameRoomFromGameSpecificState(lobbyState, newGameRoomId, newGameTableId);

  const now = Date.now();
  const metadata = gameRegistry.getGameMetadata(gameTitle);
  const gameProcessor = metadata.gameProcessor;

  const startGameAction = gameProcessor.createHostStartsGameAction(lobbyState);
  const startGameOutcome = gameProcessor.createHostOpensGameOutcome(startGameAction);
  const startGameState = gameProcessor.createHostOpensGameState(startGameAction);

  const GameStateTransitionSchema = createGameStateTransitionForDbSchema(metadata.schemas);
  type GameStateTransition = z.infer<typeof GameStateTransitionSchema>;

  const gameStateTransition: GameStateTransition = {
    event: startGameAction,
    change: {
      ...startGameOutcome,
      description: startGameOutcome.description,
    },
    nextBoardState: startGameState,
  }

  const GameTableEventWithTransitionSchema = createGameTableEventWithTransitionSchema(metadata.schemas);
  type GameTableEventWithTransition = z.infer<typeof GameTableEventWithTransitionSchema>;

  const gameTableEventWithTransition: GameTableEventWithTransition = {
    stepIndex: 0,
    source: "game-table-action-source-host",
    eventType: "game-table-action-host-starts-setup",
    transitionForHost: gameStateTransition,
    createdAt: now,
  }
  
  const gameTableEventWithTransitionParseResult = GameTableEventWithTransitionSchema.safeParse(gameTableEventWithTransition);
  if (!gameTableEventWithTransitionParseResult.success) {
    console.error('Error validating game table event with transition:', gameTableEventWithTransitionParseResult.error);
    throw new Error('Invalid game table event with transition');
  }
  const validatedGameTableEventWithTransition = gameTableEventWithTransitionParseResult.data;

  console.log("ADDING GAME ACTION", gameTableEventWithTransition);
  await saveNewHostedGame(newGameInstanceId, newGameRoomId, newGameTableId, newGameRoom, validatedGameTableEventWithTransition);

  const retVal: UpdatedGameRoom = {
    gameRoom: newGameRoom,
    gameState: startGameState,
  };

  return retVal;
}
