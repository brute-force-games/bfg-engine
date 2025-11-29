import type { GameRoomP2p } from "../../../models/p2p/game-room-p2p";
import type { GameTableEventForHostP2p, GameTableEventForPlayerP2p, GameTableEventForWatcherP2p } from "../../../models/p2p/game-table-event-p2p";
import type { GameRoomDb } from "../../../models/tinybase/game-room-db";
import type { GameBoardEventForDb } from "../../../models/tinybase/game-board-event";
import type { BfgGameInstanceId } from "../../../models/types/bfg-branded-uuids";
import type { UserGameRoomDataForHost as UserGameRoomDataForHost, UserGameRoomDataForPlayer as UserGameRoomDataForPlayer, UserGameRoomDataForWatcher as UserGameRoomDataForWatcher } from "./user-game-room-data";
import type { GameTableSeat } from "../../../models/internal/game-room-base";
import type { AllAssignedBfgGameStateForPlayers } from "../../../game-metadata/metadata-types/game-state-types";


export const convertGameRoomDbToP2p = (gameRoomDb: GameRoomDb): GameRoomP2p => {
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


export const convertGameBoardEventDbToHostP2p = (gameBoardEventDb: GameBoardEventForDb): GameTableEventForHostP2p => {
  // With the consolidation to BfgGameAction, events from DB should already conform to BfgGameAction
  // The constraint ensures gameEventSchema extends z.ZodType<BfgGameAction>, so the event conforms to the discriminated union
  // TypeScript can't automatically verify the discriminated union structure, so we use a type assertion
  const event = gameBoardEventDb.transitionForHost.event;

  const retVal: GameTableEventForHostP2p = {
    createdAt: gameBoardEventDb.createdAt,
    stepIndex: gameBoardEventDb.stepIndex,
    event,
    outcome: gameBoardEventDb.transitionForHost.change,
    nextGameHostState: gameBoardEventDb.transitionForHost.nextBoardState,
  };

  return retVal;
};


export const convertGameBoardEventDbToPlayerP2p = (
  gameBoardEventDb: GameBoardEventForDb,
  playerSeat: GameTableSeat,
): GameTableEventForPlayerP2p => {
  // With the consolidation to BfgGameAction, events from DB should already conform to BfgGameAction
  // The constraint ensures gameEventSchema extends z.ZodType<BfgGameAction>, so the event conforms to the discriminated union
  // TypeScript can't automatically verify the discriminated union structure, so we use a type assertion
  // Using double assertion (as unknown as) because TypeScript is strict about the discriminated union structure
  const retVal: GameTableEventForPlayerP2p = {
    createdAt: gameBoardEventDb.createdAt,
    stepIndex: gameBoardEventDb.stepIndex,
    event: gameBoardEventDb.transitionForHost.event,
    outcome: gameBoardEventDb.transitionForHost.change,
    nextGamePlayerState: {
      ...gameBoardEventDb.transitionForHost.nextBoardState,
      playerSeat,
    },
  };
  
  return retVal;
}



export const convertGameBoardEventDbToWatcherP2p = (gameBoardEventDb: GameBoardEventForDb): GameTableEventForWatcherP2p => {
  // With the consolidation to BfgGameAction, events from DB should already conform to BfgGameAction
  // The constraint ensures gameEventSchema extends z.ZodType<BfgGameAction>, so the event conforms to the discriminated union
  // TypeScript can't automatically verify the discriminated union structure, so we use a type assertion
  const event = gameBoardEventDb.transitionForHost.event;
  
  return {
    createdAt: gameBoardEventDb.createdAt,
    stepIndex: gameBoardEventDb.stepIndex,
    event,
    outcome: gameBoardEventDb.transitionForHost.change,
    nextGameWatcherState: gameBoardEventDb.transitionForHost.nextBoardState,
  };
}


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
  gameInstanceId: BfgGameInstanceId,
  hostedGame: GameRoomDb,
  hostedGameBoardEvents: GameBoardEventForDb[],
): UserGameRoomDataForHost => {

  const gameRoomP2p = convertGameRoomDbToP2p(hostedGame);
  const hostGameHistory = hostedGameBoardEvents
    .map(convertGameBoardEventDbToHostP2p);

  const retVal: UserGameRoomDataForHost = {
    gameInstanceId,
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
  gameInstanceId: BfgGameInstanceId,
  playerSeat: GameTableSeat,
  hostedGame: GameRoomDb,
  hostedGameBoardEvents: GameBoardEventForDb[],
): UserGameRoomDataForPlayer => {

  const gameRoomP2p = convertGameRoomDbToP2p(hostedGame);
  const playerGameHistory = hostedGameBoardEvents.map((gameBoardEventDb) => 
    convertGameBoardEventDbToPlayerP2p(gameBoardEventDb, playerSeat));

  const retVal: UserGameRoomDataForPlayer = {
    gameInstanceId,
    accessLevel: 'player',
    role: 'player',
    playerSeat,
    gameRoom: gameRoomP2p,
    playerGameHistory,
  };

  return retVal;
}


export const createAllPlayersGameRoomData = (
  gameInstanceId: BfgGameInstanceId,
  hostedGame: GameRoomDb,
  hostedGameBoardEvents: GameBoardEventForDb[],
): AllAssignedBfgGameStateForPlayers => {

  // const gameRoomP2p = convertGameRoomDbToP2p(hostedGame);
  const allPlayerSeats = hostedGame.players.map((player) => player.role);
  // const allPlayersGameHistory = allPlayerSeats.map((playerSeat) => 
  //   createSinglePlayerGameHistory(gameInstanceId, playerSeat, hostedGame, hostedGameBoardEvents));

  const retVal = allPlayerSeats.map((playerSeat) =>
    createSinglePlayerGameRoomData(gameInstanceId, playerSeat, hostedGame, hostedGameBoardEvents));

  return retVal;
}


export const createWatcherGameRoomData = (
  gameInstanceId: BfgGameInstanceId,
  hostedGame: GameRoomDb,
  hostedGameBoardEvents: GameBoardEventForDb[],
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
  const watcherGameHistory = hostedGameBoardEvents.map(convertGameBoardEventDbToWatcherP2p);

  const retVal: UserGameRoomDataForWatcher = {
    gameInstanceId,
    accessLevel: 'observer',
    role: 'watcher',
    gameRoom: gameRoomP2p,
    watcherGameHistory,
  };

  return retVal;
}
