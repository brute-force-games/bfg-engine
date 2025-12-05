import type { GameRoomP2p } from "../../../models/p2p/game-room-p2p";
import type { GameRoomPersist } from "../../../models/tinybase/game-room-persist";
// import type { GameTableEventForDb } from "../../../models/tinybase/game-board-event";
import type { UserGameRoomDataForPlayer, UserGameRoomDataForWatcher } from "./user-game-room-data";
import type { GameTableSeat } from "../../../models/internal/game-room-base";
import type { BfgSupportedGameTitle } from "../../../models/game-box-definition";
import { getGameMetadata } from "../../../game-metadata/games-registry";
import { useGameRegistry } from "../../games-registry/games-registry-hook";
import type { GameTableEventForDb } from "../../../game-metadata/metadata-types";

// Define UserGameRoomDataForHost type
export type UserGameRoomDataForHost = {
  // gameInstanceId: BfgGameInstanceId;
  accessLevel: 'host';
  role: 'host';
  gameRoom: GameRoomP2p;
  hostGameHistory: any[];
};

// Define AllAssignedBfgGameStateForPlayers type
export type AllAssignedBfgGameStateForPlayers = UserGameRoomDataForPlayer[];


export const convertGameRoomDbToP2p = (gameRoomDb: GameRoomPersist): GameRoomP2p => {
  const retVal: GameRoomP2p = {
    id: gameRoomDb.id,
    gameTitle: gameRoomDb.gameTitle,
    tableName: gameRoomDb.tableName,
    gameHostPlayerProfileId: gameRoomDb.gameHostPlayerProfileId,
    latestRoomStatusDescription: gameRoomDb.latestRoomStatusDescription,
    players: gameRoomDb.players,
    latestRoomPhase: gameRoomDb.latestRoomPhase,
    createdAt: gameRoomDb.createdAt,
    lastUpdatedAt: gameRoomDb.lastUpdatedAt,
  };

  return retVal;
};


export const convertGameRoomEventDbToHostP2p = (
  gameBoardEventDb: GameTableEventForDb,
  gameTitle: BfgSupportedGameTitle,
): any => {
  // Get game metadata and schemas for this specific game
  const gameMetadata = getGameMetadata(gameTitle);
  if (!gameMetadata) {
    throw new Error(`Game metadata not found for game title: ${gameTitle}`);
  }

  const gameTableEventSchema = gameMetadata.schemas.gameTableEventSchema;

  const bfgGameStep = gameTableEventSchema.safeParse(gameBoardEventDb);

  if (!bfgGameStep.success) {
    console.error('Error parsing game step:', bfgGameStep.error);
    throw new Error('Error parsing game step: ' + bfgGameStep.error.message);
  }

  const retVal = bfgGameStep.data;

  return retVal;
};


// export const convertGameBoardEventDbToPlayerP2p = (
//   gameBoardEventDb: GameBoardEventForDb,
//   playerSeat: GameTableSeat,
// ): any => {
//   // With the consolidation to BfgGameAction, events from DB should already conform to BfgGameAction
//   // The constraint ensures gameEventSchema extends z.ZodType<BfgGameAction>, so the event conforms to the discriminated union
//   // TypeScript can't automatically verify the discriminated union structure, so we use a type assertion
//   // Using double assertion (as unknown as) because TypeScript is strict about the discriminated union structure
//   const retVal: any = {
//     createdAt: gameBoardEventDb.createdAt,
//     stepIndex: gameBoardEventDb.stepIndex,
//     event: gameBoardEventDb.transitionForHost.event,
//     outcome: gameBoardEventDb.transitionForHost.change,
//     nextGamePlayerState: {
//       ...gameBoardEventDb.gameStep.nextBoardState,
//       playerSeat,
//     },
//   };
  
//   return retVal;
// }



// export const convertGameBoardEventDbToWatcherP2p = (gameBoardEventDb: GameBoardEventForDb): any => {
//   // With the consolidation to BfgGameAction, events from DB should already conform to BfgGameAction
//   // The constraint ensures gameEventSchema extends z.ZodType<BfgGameAction>, so the event conforms to the discriminated union
//   // TypeScript can't automatically verify the discriminated union structure, so we use a type assertion
//   const event = gameBoardEventDb.transitionForHost.event;
  
//   return {
//     createdAt: gameBoardEventDb.createdAt,
//     stepIndex: gameBoardEventDb.stepIndex,
//     event,
//     outcome: gameBoardEventDb.transitionForHost.change,
//     nextGameWatcherState: gameBoardEventDb.transitionForHost.nextBoardState,
//   };
// }


// export const convertGameBoardEventDbToPlayerP2p = (gameBoardEventDb: GameBoardEventForDb): GameTableEventForPlayerP2p => {
//   return {
//     createdAt: gameBoardEventDb.createdAt,
//     stepIndex: gameBoardEventDb.stepIndex,
//     gameTableId: gameBoardEventDb.gameTableId,
//     event: gameBoardEventDb.transitionForHost.event,
//     outcome: gameBoardEventDb.transitionForHost.change,
//     nextGamePlayerState: gameBoardEventDb.transitionForHost.nextBoardState,
//   };
// }


export const createHostGameRoomData = (
  // gameInstanceId: BfgGameInstanceId,
  hostedGame: GameRoomPersist,
  hostedGameBoardEvents: GameTableEventForDb[],
): UserGameRoomDataForHost => {

  const gameRoomP2p = convertGameRoomDbToP2p(hostedGame);
  
  const hostGameHistory = hostedGameBoardEvents.map((gameBoardEventDb) => 
    convertGameRoomEventDbToHostP2p(gameBoardEventDb, hostedGame.gameTitle));

  const retVal: UserGameRoomDataForHost = {
    // gameInstanceId,
    accessLevel: 'host',
    role: 'host',
    gameRoom: gameRoomP2p,
    hostGameHistory,
  };

  return retVal;
}


// export const createSinglePlayerGameHistory = (
//   gameInstanceId: BfgGameInstanceId,
//   playerSeat: GameTableSeat,
//   hostedGame: GameRoomDb,
//   hostedGameBoardEvents: GameBoardEventForDb[],
// ): MyUserGameRoomDataForPlayer => {


//   return retVal;
// }


export const createSinglePlayerGameRoomData = (
  // gameInstanceId: BfgGameInstanceId,
  playerSeat: GameTableSeat,
  hostedGame: GameRoomPersist,
  hostedGameBoardEvents: GameTableEventForDb[],
): UserGameRoomDataForPlayer => {

  const gameRoomP2p = convertGameRoomDbToP2p(hostedGame);

  const playerGameHistory = hostedGameBoardEvents.map((gameBoardEventDb) => 
    convertGameRoomEventDbToHostP2p(gameBoardEventDb, hostedGame.gameTitle));

  const retVal: UserGameRoomDataForPlayer = {
    // gameInstanceId,
    accessLevel: 'player',
    role: 'player',
    playerSeat,
    gameRoom: gameRoomP2p,
    playerGameHistory,
  };

  return retVal;
}


export const createAllPlayersGameRoomData = (
  // gameInstanceId: BfgGameInstanceId,
  hostedGame: GameRoomPersist,
  hostedGameBoardEvents: GameTableEventForDb[],
): AllAssignedBfgGameStateForPlayers => {

  // const gameRoomP2p = convertGameRoomDbToP2p(hostedGame);
  const allPlayerSeats = hostedGame.players.map((player) => player.role);
  // const allPlayersGameHistory = allPlayerSeats.map((playerSeat) => 
  //   createSinglePlayerGameHistory(gameInstanceId, playerSeat, hostedGame, hostedGameBoardEvents));

  const retVal = allPlayerSeats.map((playerSeat) =>
    createSinglePlayerGameRoomData(playerSeat, hostedGame, hostedGameBoardEvents));

  return retVal;
}


export const createWatcherGameRoomData = (
  // gameInstanceId: BfgGameInstanceId,
  hostedGame: GameRoomPersist,
  hostedGameTableEvents: GameTableEventForDb[],
): UserGameRoomDataForWatcher => {
  // Convert GameBoardEventForDb[] to GameTableEventForWatcherP2p[]
  // const watcherGameHistory: GameTableEventForWatcherP2p[] = hostedGameBoardEvents.map((boardEvent) => ({
  //   createdAt: boardEvent.createdAt,
  //   stepIndex: boardEvent.stepIndex,
  //   gameTableId: hostedGame.gameTableId,
  //   // Event type from GameBoardEventForDb may have source: "player" | "host", but GameTableEventForWatcherP2p expects discriminated union
  //   // We cast it since we're creating watcher events - proper conversion would require game metadata adapters
  //   event: boardEvent.transitionForHost.event as any,
  //   outcome: boardEvent.transitionForHost.change,
  //   nextGameWatcherState: boardEvent.transitionForHost.nextBoardState,
  // }));

  const gameRoomP2p = convertGameRoomDbToP2p(hostedGame);
  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);
  const toWatcherGameEventsFn = gameMetadata.gameEventOutcomePerspectiveAdapters.hostEventTransitionToWatcherAccessLevelAdapter;
  const watcherGameHistory = hostedGameTableEvents.map((tableEvent) => 
    toWatcherGameEventsFn(tableEvent.outcome, tableEvent.nextBoardState));

  const retVal: UserGameRoomDataForWatcher = {
    // gameInstanceId,
    accessLevel: 'observer',
    role: 'watcher',
    gameRoom: gameRoomP2p,
    watcherGameHistory,
  };

  return retVal;
}
