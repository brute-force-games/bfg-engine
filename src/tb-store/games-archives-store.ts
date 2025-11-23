import { z } from 'zod';
import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { BfgGameTableId, BfgGameTableIdToolbox, type BfgGameInstanceId, type BfgGameRoomId } from '../models/types/bfg-branded-uuids';
import type { GameRoomDb } from '../models/tinybase/game-room-db';
import { GameRoomDbSchema } from '../models/tinybase/game-room-db';
import { InferTypeFromSchema, createZodSchemaFromTinyBaseSchema, type TinybaseTableSchema } from './zod-tb-utils';
import { type GameBoardEventForDb } from '../models/game-table/game-table-event-db';
import { type HydratedLatestGameSnapshot } from '../models/internal/game-room-snapshot-from-tb';
import { getGameMetadata } from '../game-metadata/games-registry';
import type { GameTableEventWithTransition } from '../models/game-table/game-table-event';
import { TB_GAME_INSTANCES_TABLE_NAME, TB_GAME_ROOMS_TABLE_NAME, TB_GAME_EVENTS_TABLE_NAME } from './tb-constants';
import { GameInstanceMappingsTinybaseTableColumnsSchema, getGameInstanceMapping, useLatestHostedGameIdentifiers, type GameInstanceMappingsTinybaseTableColumns } from './game-instance-store';
import { createBoardTransitionsArraySchema } from '../models/tinybase/game-board-event';
import { BfgSupportedGameTitleSchema } from '../models/game-box-definition';
import { GameRoomSnapshotTbTableRowForZodSchema, GameSnapshotTinybaseTableColumnsSchema, type GameRoomSnapshotTbTableRow } from '../models/tinybase/game-snapshot';
import { BfgStringifiedBoardTransitionsStrToolbox, } from '../models/types/bfg-branded-string-types';
// import { createGameRoomSnapshotForP2pSchema } from '../models/p2p/game-room-snapshot-p2p';


// export const GameRoomSnapshotTinybaseTableColumnsSchema = {
//   gameInstanceId: { type: 'string' as const },
//   gameRoomId: { type: 'string' as const },
//   gameTableId: { type: 'string' as const },

//   stringifiedRoomState: { type: 'string' as const },
//   stringifiedLatestBoardTransition: { type: 'string' as const },
  
//   latestStepIndex: { type: 'number' as const },
//   createdAt: { type: 'number' as const },
//   lastUpdatedAt: { type: 'number' as const },
// } as const satisfies TinybaseTableSchema;

// export type GameRoomSnapshotTinybaseTableColumns = InferTypeFromSchema<typeof GameRoomSnapshotTinybaseTableColumnsSchema>;

// export const GameRoomSnapshotTbTableRowForZodSchema = createZodSchemaFromTinyBaseSchema(GameSnapshotTinybaseTableColumnsSchema, {
//   gameRoomId: BfgGameRoomIdToolbox.idSchema, // Use branded type schema
// });

// export type GameRoomSnapshotTbTableRow = z.infer<typeof GameRoomSnapshotTbTableRowForZodSchema>;


// export const createHydratedGameRoomSnapshot = (gameRoomSnapshotTbTableRow: GameRoomSnapshotTbTableRow): GameRoomSnapshotForDb => {
//   const parsedRoomState = JSON.parse(gameRoomSnapshotTbTableRow.stringifiedRoomState);
//   const hydratedRoomState = GameRoomDbSchema.parse(parsedRoomState);
//   return {
//     ...gameRoomSnapshotTbTableRow,
//     gameRoom: hydratedRoomState,
//   };
// }

// export const HydrateGameRoomSnapshot = (gameRoomSnapshotTbTableRow: GameRoomSnapshotTbTableRow): GameRoomSnapshotForDb => {
//   const parsedRoomState = JSON.parse(gameRoomSnapshotTbTableRow.stringifiedRoomState);
//   const hydratedRoomState = GameRoomDbSchema.parse(parsedRoomState);
//   return {
//     ...gameRoomSnapshotTbTableRow,
//     gameRoom: hydratedRoomState,
//   };
// }


const BoardTransitionTinybaseTableColumnsSchema = {
  gameTableId: { type: 'string' as const },
  gameTitle: { type: 'string' as const },
  stringifiedBoardTransitions: { type: 'string' as const },
} as const satisfies TinybaseTableSchema;

export type BoardTransitionTinybaseTableColumns = InferTypeFromSchema<typeof BoardTransitionTinybaseTableColumnsSchema>;

export const BoardTransitionTbTableRowForZodSchema = createZodSchemaFromTinyBaseSchema(BoardTransitionTinybaseTableColumnsSchema, {
  gameTitle: BfgSupportedGameTitleSchema,
  gameTableId: BfgGameTableIdToolbox.idSchema,
  stringifiedBoardTransitions: BfgStringifiedBoardTransitionsStrToolbox.schema,
});

export type BoardTransitionTbTableRow = z.infer<typeof BoardTransitionTbTableRowForZodSchema>;


export const gameArchivesStore = createStore();
const gameRoomsPersister = createLocalPersister(gameArchivesStore, TB_GAME_ROOMS_TABLE_NAME);
const gameEventsPersister = createLocalPersister(gameArchivesStore, TB_GAME_EVENTS_TABLE_NAME);
const gameInstancesPersister = createLocalPersister(gameArchivesStore, TB_GAME_INSTANCES_TABLE_NAME);



gameArchivesStore.setTablesSchema({
  [TB_GAME_INSTANCES_TABLE_NAME]: GameInstanceMappingsTinybaseTableColumnsSchema,
  [TB_GAME_ROOMS_TABLE_NAME]: GameSnapshotTinybaseTableColumnsSchema,
  [TB_GAME_EVENTS_TABLE_NAME]: BoardTransitionTinybaseTableColumnsSchema,
});

gameRoomsPersister.startAutoLoad();
gameRoomsPersister.startAutoSave();

gameEventsPersister.startAutoLoad();
gameEventsPersister.startAutoSave();

gameInstancesPersister.startAutoLoad();
gameInstancesPersister.startAutoSave();


export const getAllHostedGames = (): GameRoomDb[] => {
  try {
    const games: GameRoomDb[] = [];
    const parsedGameTableIds = new Set<BfgGameTableId>();

    // Get all row IDs from gameArchivesStore and parse them
    const archiveTable = gameArchivesStore.getTable('gameArchives');
    Object.keys(archiveTable).forEach((rowId) => {
      const parseResult = BfgGameTableIdToolbox.idSchema.safeParse(rowId);
      if (parseResult.success) {
        parsedGameTableIds.add(parseResult.data);
      } else {
        console.warn(`Invalid game table ID in archive store: ${rowId}`, parseResult.error);
      }
    });

    // For each parsed game table ID, get the GameTable from archive data
    parsedGameTableIds.forEach((gameTableId) => {
      const archiveRow = gameArchivesStore.getRow('gameArchives', gameTableId);
      if (archiveRow && typeof archiveRow.stringifiedLatestTableState === 'string') {
        try {
          const parsedTableState = JSON.parse(archiveRow.stringifiedLatestTableState);
          const gameTable = GameRoomDbSchema.parse(parsedTableState);
          games.push(gameTable);
        } catch (error) {
          console.error(`Error parsing game table state for ${gameTableId}:`, error);
        }
      }
    });
    
    return games;
  } catch (error) {
    console.error('Error getting all hosted games:', error);
    return [];
  }
};


// export const useGameInstanceIdsFromGameRoomId = (gameInstanceId: BfgGameInstanceId): GameInstanceMapping => {
//   const rawTable = useTable(TB_GAME_INSTANCES_TABLE_NAME, gameArchivesStore);
  
//   // Find the first row where gameRoomId matches
//   const matchingEntry = Object.entries(rawTable).find(([_gameInstanceId, rowData]) => {
//     const tbModel = rowData as GameInstanceMappingsTinybaseTableColumns;
//     return tbModel.gameInstanceId === gameInstanceId;
//   });
  
//   if (!matchingEntry) {
//     throw new Error(`No game instance mapping found for game room ID: ${gameInstanceId}`);
//   }
  
//   const [_gameInstanceId, rowData] = matchingEntry;
//   const tbModel = rowData as GameInstanceMappingsTinybaseTableColumns;
//   const gameInstanceMapping = convertTbModelToGameInstanceMapping(tbModel);
  
//   return gameInstanceMapping;
// };


export const useLatestHostedGameSnapshot = (gameInstanceId: BfgGameInstanceId): HydratedLatestGameSnapshot | null => {

  const gameIdentifiers = useLatestHostedGameIdentifiers(gameInstanceId);

  const gameRoomId = gameIdentifiers.gameRoomId;
  const gameTableId = gameIdentifiers.gameTableId;

  const hostedGameRoomSnapshot = useRow(TB_GAME_ROOMS_TABLE_NAME, gameRoomId, gameArchivesStore);
  const hostedGameEvents = useRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId, gameArchivesStore);

  // if (!hostedGameRoomSnapshot) {
  //   return null;
  // }

  const gameRoomSnapshotParseResult = GameRoomSnapshotTbTableRowForZodSchema.safeParse(hostedGameRoomSnapshot);
  if (!gameRoomSnapshotParseResult.success) {
    console.error('Error validating existing game room snapshot:', gameRoomSnapshotParseResult.error);
    return null;
  }
  const gameRoomSnapshotTbTableRow = gameRoomSnapshotParseResult.data;

  const parsedRoomState = JSON.parse(gameRoomSnapshotTbTableRow.stringifiedRoomState);

  const hydratedRoomState = GameRoomDbSchema.parse(parsedRoomState);
  const gameTitle = hydratedRoomState.gameTitle;
  if (!gameTitle) {
    throw new Error("Game title not found");
  }

  const gameMetadata = getGameMetadata(gameTitle);

  const gameEventsParseResult = BoardTransitionTbTableRowForZodSchema.safeParse(hostedGameEvents);
  if (!gameEventsParseResult.success) {
    console.error('Error validating existing game events:', gameEventsParseResult.error);
    return null;
  }
  const gameEvents = gameEventsParseResult.data;

  const BoardTransitionsArraySchema = createBoardTransitionsArraySchema(gameMetadata.schemas);

  const unstringifiedBoardTransitions = JSON.parse(gameEvents.stringifiedBoardTransitions);
  const parsedAllBoardTransitions = BoardTransitionsArraySchema.safeParse(unstringifiedBoardTransitions);
  if (!parsedAllBoardTransitions.success) {
    console.error('Error parsing all board transitions:', parsedAllBoardTransitions.error);
    return null;
  }

  const allBoardEvents = parsedAllBoardTransitions.data;

  // const GameBoardTransitionSchema = createGameBoardEventForDbSchema(gameMetadata.schemas);
  // const hydratedLatestBoardEventParseResult = GameBoardTransitionSchema.safeParse(parsedLatestBoardTransition);

  // if (!hydratedLatestBoardEventParseResult.success) {
  //   console.error('Error validating latest board transition:', hydratedLatestBoardEventParseResult.error);
  //   return null;
  // }
  // const hydratedLatestBoardEvent = hydratedLatestBoardEventParseResult.data;
  
  // const GameRoomSnapshotSchema = createGameRoomSnapshotForP2pSchema(gameMetadata.schemas);
  // type GameRoomSnapshot = z.infer<typeof GameRoomSnapshotSchema>;

  // TODO: this needs to be populated (from the game steps table?)
  // const boardEvents: GameBoardEventForDb[] = [];

  // console.warn("empty boardEvents for now", boardEvents);
  
  const gameRoomSnapshot: HydratedLatestGameSnapshot = {
    // gameRoomId,
    // latestStepIndex: gameRoomSnapshotTbTableRow.latestStepIndex,
    gameRoom: hydratedRoomState,
    // createdAt: gameRoomSnapshotTbTableRow.createdAt,
    boardEvents: allBoardEvents,
    // latestStepIndex: allBoardEvents.length,
  }

  return gameRoomSnapshot;
};


export const useGameHistory = (gameInstanceId: BfgGameInstanceId): GameBoardEventForDb[] => {
  // const gameIdentifers = useRow(TB_GAME_INSTANCES_TABLE_NAME, gameInstanceId, gameArchivesStore);

  // if (!gameIdentifers) {
  //   return [];
  // }

  const gameIdentifiers = useLatestHostedGameIdentifiers(gameInstanceId);

  const { gameTableId, gameTitle } = gameIdentifiers;

  // const gameTableId = gameIdentifers.gameTableId as BfgGameTableId;

  // Get the row for this gameTableId
  const gameStepsRowTb = useRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId, gameArchivesStore);
  
  if (!gameStepsRowTb) {
    // return [];
    console.error("No game steps row found for game table: " + gameTableId);
    throw new Error("No game steps row found for game table: " + gameTableId);
  }

  const parseResult = BoardTransitionTbTableRowForZodSchema.safeParse(gameStepsRowTb);
  if (!parseResult.success) {
    console.error('Error parsing game board transitions row:', parseResult.error);
    // return [];
    throw new Error("Error parsing game board transitions row: " + gameTableId);
  }

  const gameHistoryTbRow = parseResult.data;

  const gameMetadata = getGameMetadata(gameTitle);
  if (!gameMetadata) {
    throw new Error("Game metadata not found for game title: " + gameTitle);
  }

  const BoardTransitionsArraySchema = createBoardTransitionsArraySchema(gameMetadata.schemas);
  const boardTransitionsParseResult = BoardTransitionsArraySchema.safeParse(gameHistoryTbRow.stringifiedBoardTransitions);
  if (!boardTransitionsParseResult.success) {
    console.error('Error parsing board transitions array:', boardTransitionsParseResult.error);
    throw new Error("Error parsing board transitions array: " + gameTableId);
  }
  const boardTransitions = boardTransitionsParseResult.data;

  return boardTransitions;

  // try {
  //   const parsedTransitions = JSON.parse(gameHistoryTbRow.stringifiedBoardTransitions);
  //   if (!Array.isArray(parsedTransitions)) {
  //     console.error('Parsed board transitions is not an array');
  //     return [];
  //   }
  //   // TODO: Need to get game metadata to properly parse each transition
  //   // For now, return the parsed array as-is
  //   return parsedTransitions as GameBoardEventForDb[];
  // } catch (error) {
  //   console.error('Error parsing stringified board transitions:', error);
  //   return [];
  // }
};


export const updateHostedGameWithNewNextBoardState = (
  gameInstanceId: BfgGameInstanceId,
  latestStepIndex: number,
  updatedGameEvent: GameTableEventWithTransition,
): void => {
  const gameInstanceMapping = getGameInstanceMapping(gameInstanceId);
  const gameTableId = gameInstanceMapping.gameTableId;

  const gameTableHistoryRowTb = gameArchivesStore.getRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId);
  if (!gameTableHistoryRowTb) {
    throw new Error("No game table history row found for game table: " + gameTableId);
  }

  const gameTableHistoryRowParseResult = BoardTransitionTbTableRowForZodSchema.safeParse(gameTableHistoryRowTb);
  if (!gameTableHistoryRowParseResult.success) {
    console.error('Error parsing game table history row:', gameTableHistoryRowParseResult.error);
    throw new Error("Error parsing game table history row: " + gameTableId);
  }

  const gameTableHistoryRow = gameTableHistoryRowParseResult.data;

  const boardTransitions = JSON.parse(gameTableHistoryRow.stringifiedBoardTransitions);

  if (latestStepIndex !== boardTransitions.length) {
    console.error("Current step index does not match the number of board transitions");
    console.error("Current step index: " + latestStepIndex);
    console.error("Number of board transitions: " + boardTransitions.length);
    console.error("Board transitions: " + JSON.stringify(boardTransitions));
    console.error("Updated game event: " + JSON.stringify(updatedGameEvent));
    throw new Error("Current step index does not match the number of board transitions");
  }

  boardTransitions.push(updatedGameEvent);
  const stringifiedBoardTransitions = JSON.stringify(boardTransitions);
  
  const updatedGameTableHistoryRow: BoardTransitionTbTableRow = {
    ...gameTableHistoryRow,
    stringifiedBoardTransitions,
  };

  gameArchivesStore.setRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId, updatedGameTableHistoryRow);
}


export const clearAllGameArchives = (): void => {
  gameArchivesStore.delTable(TB_GAME_ROOMS_TABLE_NAME);
  gameArchivesStore.delTable(TB_GAME_EVENTS_TABLE_NAME);
  gameArchivesStore.delTable(TB_GAME_INSTANCES_TABLE_NAME);
  console.log('Game archives cleared successfully');
};


export const clearGameArchive = (gameInstanceId: BfgGameInstanceId): void => {
  const gameIdentifers = gameArchivesStore.getRow(TB_GAME_INSTANCES_TABLE_NAME, gameInstanceId);
  if (!gameIdentifers) {
    return;
  }

  const gameRoomId = gameIdentifers.gameRoomId as BfgGameRoomId;
  const gameTableId = gameIdentifers.gameTableId as BfgGameTableId;
  
  gameArchivesStore.delRow(TB_GAME_ROOMS_TABLE_NAME, gameRoomId);
  gameArchivesStore.delRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId);
  gameArchivesStore.delRow(TB_GAME_INSTANCES_TABLE_NAME, gameInstanceId);
  
  console.log('Game archive cleared successfully');
};







// /**
//  * Update an existing hosted game
//  */
// export const updateHostedGame = (
//   gameTableId: BfgGameTableId,
//   updatedRoomState: GameRoomDb,
//   boardTransition: GameBoardTransition,
// ): boolean => {
//   try {
//     const existingGameRoom = gameArchivesStore.getRow(TB_GAME_ROOMS_TABLE_NAME, gameTableId);
//     if (!existingGameRoom) {
//       return false;
//     }

//     const gameRoomSnapshotParseResult = GameRoomTinybaseSnapshotSchema.safeParse(existingGameRoom);
//     if (!gameRoomSnapshotParseResult.success) {
//       console.error('Error validating existing game room snapshot:', gameRoomSnapshotParseResult.error);
//       return false;
//     }

//     const gameRoomSnapshot = gameRoomSnapshotParseResult.data;
//     const latestStepIndex = gameRoomSnapshot.latestStepIndex + 1;
//     const now = Date.now();

//     const stringifiedLatestTableState = JSON.stringify(updatedRoomState);
//     // const stringifiedLatestEvent = JSON.stringify(latestEvent);
//     // const stringifiedLatestChange = JSON.stringify(latestChange);
//     // const stringifiedLatestGameState = JSON.stringify(latestGameState);

//     const updatedGameRoomSnapshot: GameRoomSnapshot = {
//       gameTableId,
//       latestStepIndex,
//       createdAt: gameSnapshot.createdAt,
//       lastUpdatedAt: now,
//       stringifiedLatestTableState,
//       stringifiedLatestEvent,
//       stringifiedLatestChange,
//       stringifiedLatestGameState,
//     };

//     gameArchivesStore.setRow(TB_GAME_ROOMS_TABLE_NAME, gameTableId, updatedGameRoomSnapshot);
//     return true;

//   } catch (error) {
//     console.error('Error updating hosted game:', error);
//     return false;
//   }
// };


// TODO: consolidate ID inputs into gameInstanceId
export const addGameBoardTransition = async (
  gameInstanceId: BfgGameInstanceId,
  // gameRoomId: BfgGameRoomId,
  // gameTableId: BfgGameTableId,
  latestBoardTransition: GameBoardEventForDb,
): Promise<{ success: boolean; actionId?: string; error?: string }> => {
  try {

    const gameInstanceMapping = getGameInstanceMapping(gameInstanceId);
    // if (!gameInstanceMappingTbRow) {
    //   throw new Error("No game instance mapping found for game instance: " + gameInstanceId);
    // }

    const gameRoomId = gameInstanceMapping.gameRoomId;
    const gameTableId = gameInstanceMapping.gameTableId;

    const currentGameRoomTbRow = gameArchivesStore.getRow(TB_GAME_ROOMS_TABLE_NAME, gameRoomId);
    if (!currentGameRoomTbRow) {
      throw new Error("No game room found for game room: " + gameRoomId);
    }

    const currentGameRoomParseResult = GameRoomSnapshotTbTableRowForZodSchema.safeParse(currentGameRoomTbRow);
    if (!currentGameRoomParseResult.success) {
      console.error('Error validating existing game room snapshot:', currentGameRoomParseResult.error);
      return { success: false, error: 'Invalid game room snapshot data' };
    }

    // const currentGameRoom = currentGameRoomParseResult.data;
    
    // const latestGameSnapshot = createHydratedLatestGameSnapshotFromTbData(
    //   currentGameRoom.stringifiedRoomState,
    //   currentGameRoom.stringifiedLatestBoardTransition,
    // );

    // const now = Date.now();
    // const latestStepIndex = latestGameSnapshot.latestStepIndex + 1;
    
    // const stringifiedLatestBoardTransition = JSON.stringify(latestBoardTransition);
    
    // const newGameRoomSnapshot: GameRoomSnapshotTbTableRow = {
    //   ...currentGameRoom,
    //   gameInstanceId,
    //   gameRoomId,
    //   gameTableId,
    //   latestStepIndex,
    //   stringifiedLatestBoardTransition,      
    //   createdAt: now,
    // };

    // const gameTitle = currentGameRoom.gameTitle;
    // const gameMetadata = getGameMetadata(gameTitle);
    // if (!gameMetadata) {
    //   throw new Error("Game metadata not found for game title: " + gameTitle);
    // }

    // Get existing game steps row or create new one
    const existingGameStepsRowTb = gameArchivesStore.getRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId);
    
    if (!existingGameStepsRowTb) {
      throw new Error("No game steps row found for game table: " + gameTableId);
    }

    const existingGameStepsRowParseResult = BoardTransitionTbTableRowForZodSchema.safeParse(existingGameStepsRowTb);
    if (!existingGameStepsRowParseResult.success) {
      console.error('Error parsing existing game steps row:', existingGameStepsRowParseResult.error);
      throw new Error("Invalid game steps row for game table: " + gameTableId);
    }

    const existingGameStepsRow = existingGameStepsRowParseResult.data;
    const gameTitle = gameInstanceMapping.gameTitle;
    const gameMetadata = getGameMetadata(gameTitle);
    if (!gameMetadata) {
      throw new Error("Game metadata not found for game title: " + gameTitle);
    }

    const arraySchema = createBoardTransitionsArraySchema(gameMetadata.schemas);
    const arrayParseResult = arraySchema.safeParse(existingGameStepsRow.stringifiedBoardTransitions);
    if (!arrayParseResult.success) {
      console.error('Error parsing existing game steps row:', arrayParseResult.error);
      throw new Error("Invalid game steps row for game table: " + gameTableId);
    }
    const boardTransitions = arrayParseResult.data;

    // Append the new transition
    boardTransitions.push(latestBoardTransition);
    const stringifiedBoardTransitions = JSON.stringify(boardTransitions);

    const updatedGameStepsRow: BoardTransitionTbTableRow = {
      ...existingGameStepsRow,
      stringifiedBoardTransitions,
    };

    gameArchivesStore.transaction(
      () => {
        // gameArchivesStore.setRow(TB_GAME_ROOMS_TABLE_NAME, gameRoomId, newGameRoomSnapshot);
        gameArchivesStore.setRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId, updatedGameStepsRow);
      },
    );

    return { success: true };

  } catch (error) {
    console.error('Error adding game step:', error);
    return { success: false, error: 'Failed to add game step' };
  }
};


export const saveNewHostedGame = async (
  gameInstanceId: BfgGameInstanceId,
  gameRoomId: BfgGameRoomId,
  gameTableId: BfgGameTableId,
  gameRoom: GameRoomDb,
  initialGameTableEventWithTransition: GameTableEventWithTransition,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const now = Date.now();
    const stringifiedRoomState = JSON.stringify(gameRoom);
    // const latestStepIndex = 0;
    // const stringifiedLatestBoardTransition = JSON.stringify(initialGameTableEventWithTransition);

    const gameRoomSnapshotTbRow: GameRoomSnapshotTbTableRow = {
      gameInstanceId,
      gameRoomId,
      gameTableId,
      stringifiedRoomState,
      // stringifiedLatestBoardTransition,
      // latestStepIndex,
      createdAt: now,
      lastUpdatedAt: now,
    };

    // Initialize with an array containing the initial transition
    const initialBoardTransitions: GameBoardEventForDb[] = [initialGameTableEventWithTransition as GameBoardEventForDb];
    const stringifiedBoardTransitions = JSON.stringify(initialBoardTransitions);

    const newGameStepsRow: BoardTransitionTbTableRow = {
      gameTableId,
      gameTitle: gameRoom.gameTitle,
      stringifiedBoardTransitions,
    };

    const gameInstanceMappingTbRow: GameInstanceMappingsTinybaseTableColumns = {
      gameInstanceId,
      gameRoomId,
      gameTableId,
      gameTitle: gameRoom.gameTitle,
      createdAt: now,
      lastUpdatedAt: now,
    };

    gameArchivesStore.transaction(
      () => {
        gameArchivesStore.setRow(TB_GAME_INSTANCES_TABLE_NAME, gameInstanceId, gameInstanceMappingTbRow);
        gameArchivesStore.setRow(TB_GAME_ROOMS_TABLE_NAME, gameRoomId, gameRoomSnapshotTbRow);
        gameArchivesStore.setRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId, newGameStepsRow);
      },
    );

    return { success: true };

  } catch (error) {
    console.error('Error adding new hosted game room:', error);
    return { success: false, error: 'Failed to add new hosted game room' };
  }
};
