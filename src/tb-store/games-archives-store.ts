import { z } from 'zod';
import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { BfgGameRoomIdToolbox, BfgGameTableId, BfgGameTableIdToolbox, type BfgGameInstanceId, type BfgGameRoomId } from '../models/types/bfg-branded-uuids';
import type { GameRoomDb } from '../models/game-table/game-room-p2p';
import { GameRoomDbSchema } from '../models/game-table/game-room-p2p';
import { InferTypeFromSchema, createZodSchemaFromTinyBaseSchema, type TinybaseTableSchema } from './zod-tb-utils';
import { useRow } from 'tinybase/ui-react';
import { createGameBoardEventForDbSchema, type GameBoardEventForDb } from '../models/game-table/game-table-event-db';
import { createGameRoomSnapshotForDbSchema, type GameRoomSnapshotForDb } from '../models/game-table/game-room-snapshot-db';
import { getGameMetadata } from '../game-metadata/games-registry';
import type { GameTableEventWithTransition } from '../models/game-table/game-table-event';


export const GameRoomSnapshotTinybaseTableColumnsSchema = {
  gameRoomId: { type: 'string' as const },
  gameTableId: { type: 'string' as const },

  stringifiedRoomState: { type: 'string' as const },
  stringifiedLatestBoardTransition: { type: 'string' as const },
  
  latestStepIndex: { type: 'number' as const },
  createdAt: { type: 'number' as const },
  lastUpdatedAt: { type: 'number' as const },
} as const satisfies TinybaseTableSchema;

export type GameRoomSnapshotTinybaseTableColumns = InferTypeFromSchema<typeof GameRoomSnapshotTinybaseTableColumnsSchema>;

export const GameRoomSnapshotTbTableRowForZodSchema = createZodSchemaFromTinyBaseSchema(GameRoomSnapshotTinybaseTableColumnsSchema, {
  gameRoomId: BfgGameRoomIdToolbox.idSchema, // Use branded type schema
});

export type GameRoomSnapshotTbTableRow = z.infer<typeof GameRoomSnapshotTbTableRowForZodSchema>;


const BoardTransitionTinybaseTableColumnsSchema = {
  gameTableId: { type: 'string' as const },
  transitionIndex: { type: 'number' as const },

  stringifiedBoardTransition: { type: 'string' as const },
} as const satisfies TinybaseTableSchema;

export type BoardTransitionTinybaseTableColumns = InferTypeFromSchema<typeof BoardTransitionTinybaseTableColumnsSchema>;

const BoardTransitionTbTableRowForZodSchema = createZodSchemaFromTinyBaseSchema(BoardTransitionTinybaseTableColumnsSchema, {
  gameTableId: BfgGameTableIdToolbox.idSchema,
});

export type BoardTransitionTbTableRow = z.infer<typeof BoardTransitionTbTableRowForZodSchema>;




export const TB_GAME_ROOMS_TABLE_NAME = 'tb-game-rooms';
export const TB_GAME_STEPS_TABLE_NAME = 'tb-game-steps';


// Create the store
export const gameArchivesStore = createStore();
const gameRoomsPersister = createLocalPersister(gameArchivesStore, TB_GAME_ROOMS_TABLE_NAME);
const gameStepsPersister = createLocalPersister(gameArchivesStore, TB_GAME_STEPS_TABLE_NAME);



gameArchivesStore.setTablesSchema({
  [TB_GAME_ROOMS_TABLE_NAME]: GameRoomSnapshotTinybaseTableColumnsSchema,
  [TB_GAME_STEPS_TABLE_NAME]: BoardTransitionTinybaseTableColumnsSchema,
});

gameRoomsPersister.startAutoLoad();
gameRoomsPersister.startAutoSave();

gameStepsPersister.startAutoLoad();
gameStepsPersister.startAutoSave();


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



// export const useHostedGameStep = (gameTableId: BfgGameTableId, stepIndex: number): GameRoomSnapshotTbTableRow | null => {
//   // const hostedGameArchive = useHostedGameArchive(gameTableId);
//   // if (!hostedGameArchive) {
//   //   return null;
//   // }

//   const hostedGameArchive = gameArchivesStore.getRow(TB_GAME_STEPS_TABLE_NAME, gameTableId);



//   return hostedGameArchive.stringifiedLatestTableState;
// };


// export const useLatestHostedGameSnapshot = (gameTableId: BfgGameTableId): GameRoomSnapshot | null => {
//   const hostedGameRoomSnapshot = useHostedGameRoomSnapshot(gameTableId);
//   if (!hostedGameRoomSnapshot) {
//     return null;
//   }

//   const latestGameStepIndex = hostedGameRoomSnapshot.latestStepIndex;
//   const latestGameStep = useHostedGameStep(gameTableId, latestGameStepIndex);

//   const retVal: GameRoomSnapshot = {
//     ...hostedGameRoomSnapshot,
//     latestGameStepIndex,
//     latestGameStep,
//   };

//   return retVal;
// };


export const useLatestHostedGameRoomSnapshot = (gameTableId: BfgGameTableId): GameRoomSnapshotForDb | null => {
  const hostedGameRoomSnapshot = useRow(TB_GAME_ROOMS_TABLE_NAME, gameTableId, gameArchivesStore);

  if (!hostedGameRoomSnapshot) {
    return null;
  }

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
  
  const parsedLatestBoardTransition = JSON.parse(gameRoomSnapshotTbTableRow.stringifiedLatestBoardTransition);

  const gameMetadata = getGameMetadata(gameTitle);
  const GameBoardTransitionSchema = createGameBoardEventForDbSchema(gameMetadata.schemas);
  const hydratedLatestBoardEvent = GameBoardTransitionSchema.parse(parsedLatestBoardTransition);
  
  const GameRoomSnapshotSchema = createGameRoomSnapshotForDbSchema(gameMetadata.schemas);
  type GameRoomSnapshot = z.infer<typeof GameRoomSnapshotSchema>;

  const boardEvents: GameBoardEventForDb[] = [];

  console.warn("empty boardEvents for now", boardEvents);
  
  const gameRoomSnapshot: GameRoomSnapshot = {
    gameRoomId: gameRoomSnapshotTbTableRow.gameRoomId as BfgGameRoomId,
    latestStepIndex: gameRoomSnapshotTbTableRow.latestStepIndex,
    createdAt: gameRoomSnapshotTbTableRow.createdAt,
    lastUpdatedAt: gameRoomSnapshotTbTableRow.lastUpdatedAt,

    gameRoom: hydratedRoomState,
    boardEvents,
    latestBoardEvent: hydratedLatestBoardEvent,
  }

  return gameRoomSnapshot;
};


// export const useHostedGameLatestTableState = (gameTableId: BfgGameTableId): GameRoomDb | null => {
//   const hostedGameArchive = useHostedGameArchive(gameTableId);
//   const latestTableState = hostedGameArchive?.stringifiedLatestTableState;

//   if (!hostedGameArchive) {
//     return null;
//   }
//   return hostedGameArchive.latestTableState;
// };


export const clearAllGameArchives = (): void => {
  gameArchivesStore.delTable(TB_GAME_ROOMS_TABLE_NAME);
  gameArchivesStore.delTable(TB_GAME_STEPS_TABLE_NAME);
  console.log('Game archives cleared successfully');
};


export const clearGameArchive = (gameTableId: BfgGameTableId): void => {
  gameArchivesStore.delRow(TB_GAME_ROOMS_TABLE_NAME, gameTableId);
  gameArchivesStore.delRow(TB_GAME_STEPS_TABLE_NAME, gameTableId);
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


export const addGameBoardTransition = async (
  gameRoomId: BfgGameRoomId,
  latestBoardTransition: GameBoardEventForDb,
): Promise<{ success: boolean; actionId?: string; error?: string }> => {
  try {

    const currentGameRoomTbRow = gameArchivesStore.getRow(TB_GAME_ROOMS_TABLE_NAME, gameRoomId);
    if (!currentGameRoomTbRow) {
      throw new Error("No game room found for game room: " + gameRoomId);
    }

    const currentGameRoomParseResult = GameRoomSnapshotTbTableRowForZodSchema.safeParse(currentGameRoomTbRow);
    if (!currentGameRoomParseResult.success) {
      console.error('Error validating existing game room snapshot:', currentGameRoomParseResult.error);
      return { success: false, error: 'Invalid game room snapshot data' };
    }
    const currentGameRoom = currentGameRoomParseResult.data;

    const now = Date.now();
    const latestStepIndex = currentGameRoom.latestStepIndex + 1;
    
    const stringifiedLatestBoardTransition = JSON.stringify(latestBoardTransition);
    
    const newGameRoomSnapshot: GameRoomSnapshotTbTableRow = {
      ...currentGameRoom,
      gameRoomId: gameRoomId as BfgGameRoomId,
      latestStepIndex,
      stringifiedLatestBoardTransition,      
      lastUpdatedAt: now,
    };

    const newTransitionTbRow: BoardTransitionTbTableRow = {
      gameTableId: gameRoomId,
      transitionIndex: latestStepIndex,
      stringifiedBoardTransition: stringifiedLatestBoardTransition,
    };

    gameArchivesStore.transaction(
      () => {
        gameArchivesStore.setRow(TB_GAME_ROOMS_TABLE_NAME, gameRoomId, newGameRoomSnapshot);
        gameArchivesStore.setRow(TB_GAME_STEPS_TABLE_NAME, gameRoomId, newTransitionTbRow);
      },
    );

    return { success: true };

  } catch (error) {
    console.error('Error adding game step:', error);
    return { success: false, error: 'Failed to add game step' };
  }
};


export const addNewHostedGameRoom = async (
  gameInstanceId: BfgGameInstanceId,
  gameRoom: GameRoomDb,
  initialGameTableEventWithTransition: GameTableEventWithTransition,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const now = Date.now();
    const latestStepIndex = 0;
    const stringifiedRoomState = JSON.stringify(gameRoom);
    const stringifiedLatestBoardTransition = JSON.stringify(initialGameTableEventWithTransition);

    const gameRoomSnapshotTbRow: GameRoomSnapshotTbTableRow = {
      gameRoomId: gameInstanceId as BfgGameRoomId,
      gameTableId: gameInstanceId as BfgGameTableId,
      stringifiedRoomState,
      stringifiedLatestBoardTransition,
      latestStepIndex,
      createdAt: now,
      lastUpdatedAt: now,
    };

    const newTransitionTbRow: BoardTransitionTbTableRow = {
      gameTableId: gameInstanceId as BfgGameTableId,
      transitionIndex: latestStepIndex,
      stringifiedBoardTransition: stringifiedLatestBoardTransition,
    };

    gameArchivesStore.transaction(
      () => {
        gameArchivesStore.setRow(TB_GAME_ROOMS_TABLE_NAME, gameInstanceId, gameRoomSnapshotTbRow);
        gameArchivesStore.setRow(TB_GAME_STEPS_TABLE_NAME, gameInstanceId, newTransitionTbRow);
      },
    );

    return { success: true };

  } catch (error) {
    console.error('Error adding new hosted game room:', error);
    return { success: false, error: 'Failed to add new hosted game room' };
  }
};
