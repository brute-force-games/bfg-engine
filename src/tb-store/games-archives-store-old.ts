// import { createStore } from 'tinybase';
// import { createLocalPersister } from 'tinybase/persisters/persister-browser';
// import { BfgGameRoomIdToolbox, BfgGameTableId, BfgGameTableIdToolbox, type BfgGameRoomId } from '../models/types/bfg-branded-uuids';
// import { GameTableStateDbStep } from '../models/game-table/game-table-event';
// import type { GameRoomDb } from '../models/game-table/game-room';
// import { GameRoomDbSchema } from '../models/game-table/game-room';
// import { InferTypeFromSchema, createZodSchemaFromTinyBaseSchema, type TinybaseTableSchema } from './zod-tb-utils';
// import { useRow } from 'tinybase/ui-react';
// import { type LatestGameState } from '../models/game-table/latest-game-state';
// import type { GameBoardTransition } from '../models/game-table/game-transition';


// // const GameRoomTinybaseSchema = {
// //   gameTableId: { type: 'string' as const },

// // } as const satisfies TinybaseTableSchema;

// // Define the schema once - this is the single source of truth
// const GameRoomSnapshotTinybaseTableSchema = {
//   gameRoomId: { type: 'string' as const },

//   stringifiedRoomState: { type: 'string' as const },
//   stringifiedLatestBoardTransition: { type: 'string' as const },
//   // stringifiedLatestEvent: { type: 'string' as const },
//   // stringifiedLatestChange: { type: 'string' as const },
//   // stringifiedLatestBoardState: { type: 'string' as const },
  
//   latestStepIndex: { type: 'number' as const },
//   createdAt: { type: 'number' as const },
//   lastUpdatedAt: { type: 'number' as const },
// } as const satisfies TinybaseTableSchema;

// const GameStepTinybaseTableSchema = {
//   gameTableId: { type: 'string' as const },
//   stepIndex: { type: 'number' as const },

//   stringifiedBoardTransition: { type: 'string' as const },
//   // stringifiedEvent: { type: 'string' as const },
//   // stringifiedChange: { type: 'string' as const },
//   // stringifiedNextBoardState: { type: 'string' as const },
// } as const satisfies TinybaseTableSchema;



// type GameRoomTinybaseSnapshot = InferTypeFromSchema<typeof GameRoomSnapshotTinybaseTableSchema> & {
//   gameRoomId: BfgGameRoomId;
// };

// const GameRoomTinybaseSnapshotSchema = createZodSchemaFromTinyBaseSchema(GameRoomSnapshotTinybaseTableSchema, {
//   gameRoomId: BfgGameRoomIdToolbox.idSchema, // Use branded type schema
// });

// // export type GameStep = InferTypeFromSchema<typeof GameStepTinybaseTableSchema> & {
// //   gameTableId: BfgGameTableId; // Override with branded type
// // };

// // export const GameStepSchema = createZodSchemaFromTinyBaseSchema(GameStepsTinybaseTableSchema, {
// //   gameTableId: BfgGameTableIdToolbox.idSchema, // Use branded type schema
// //   stringifiedEvent: BfgGameEventStringifier.stringValueSchema,
// //   stringifiedChange: BfgGameEventChangeStringifier.stringValueSchema,
// //   stringifiedNextGameState: BfgGameStateStringifier.stringValueSchema,
// // });



// export const TB_GAME_ROOMS_TABLE_NAME = 'tb-game-rooms';
// export const TB_GAME_STEPS_TABLE_NAME = 'tb-game-steps';


// // Create the store
// export const gameArchivesStore = createStore();
// const gameRoomsPersister = createLocalPersister(gameArchivesStore, TB_GAME_ROOMS_TABLE_NAME);
// const gameStepsPersister = createLocalPersister(gameArchivesStore, TB_GAME_STEPS_TABLE_NAME);


// // gameArchivesStore.setSchema({
// //   [TB_GAME_ARCHIVES_TABLE_NAME]: GameArchiveRowTinybaseSchema,
// //   [TB_GAME_STEPS_TABLE_NAME]: GameStepRowTinybaseSchema,
// // });

// gameArchivesStore.setTablesSchema({
//   [TB_GAME_ROOMS_TABLE_NAME]: GameRoomSnapshotTinybaseTableSchema,
//   [TB_GAME_STEPS_TABLE_NAME]: GameStepTinybaseTableSchema,
// });

// gameRoomsPersister.startAutoLoad();
// gameRoomsPersister.startAutoSave();

// gameStepsPersister.startAutoLoad();
// gameStepsPersister.startAutoSave();

// // /**
// //  * Get the table name for a specific game table's actions
// //  */
// // export const getGameArchiveTableName = (gameTableId: BfgGameTableId): string => {
// //   return `bfg-game-archive-${gameTableId}`;
// // };

// // /**
// //  * Safely parse game action data from TinyBase store
// //  */
// // const parseRawGameActionData = (actionId: string, rawData: any): DbGameTableAction | null => {
// //   const result = DbGameTableActionSchema.safeParse(rawData);
  
// //   if (!result.success) {
// //     console.error(`Error validating game action data for ${actionId}:`, result.error);
// //     return null;
// //   }
  
// //   return result.data;
// // };

// // /**
// //  * Get the next action index for a game table
// //  */
// // const getNextActionIndex = (gameTableId: BfgGameTableId): number => {
// //   const tableName = getGameActionsTableName(gameTableId);
// //   const existingActions = gameActionsStore.getTable(tableName);
// //   const existingIndices = Object.keys(existingActions).map(Number).filter(n => !isNaN(n));
  
// //   if (existingIndices.length === 0) {
// //     return 0;
// //   }
  
// //   return Math.max(...existingIndices) + 1;
// // };




// // /**
// //  * Add a new hosted game to the store
// //  */
// // export const addNewHostedGame = async (
// //   gameTable: GameTable,
// //   snapshot: DbGameTableSnapshot,
// //   step: DbGameTableStep,
// // ): Promise<boolean> => {
// //   // try {
// //     // Validate the game table data
// //     const validationResult = GameRoomSchema.safeParse(gameTable);
// //     if (!validationResult.success) {
// //       console.error('Error validating game table data:', validationResult.error);
// //       return false;
// //     }

// //     // const validationResultAction = DbGameTableActionSchema.safeParse(initialAction);
// //     // if (!validationResultAction.success) {
// //     //   console.error('Error validating initial action data:', validationResultAction.error);
// //     //   return false;
// //     // }

// //     const gameTableId = gameTable.id as BfgGameTableId;

// //     gameArchivesStore.transaction(
// //       () => {
// //         // const serializedGameTable = serializeGameTableForTinybase(validationResult.data);
// //         // gameArchivesStore.setRow(TB_GAME_ARCHIVES_STORE_NAME, gameTableId, serializedGameTable);
// //         // console.log("Hosted game added:", gameTableId);
// //         // console.log("Hosted game added:", serializedGameTable);
// //         // addGameAction(gameTableId, initialAction);
// //         // hostedGamesStore.setRow(TB_HOSTED_GAMES_ACTIONS_TABLE_KEY, initialAction.id, initialAction as any);
// //       },
// //     );

// //     return true;
// //   // } catch (error) {
// //   //   console.error('Error adding hosted game:', error);
// //   //   return false;
// //   // }
// // };


// export const addGameStep = async (
//   gameRoomId: BfgGameRoomId,
//   // latestGameRoom: GameRoomDb,
//   latestBoardTransition: GameBoardTransition,
//   // latestChange: GameEventChange,
//   // nextGameState: LatestGameState,
// ): Promise<{ success: boolean; actionId?: string; error?: string }> => {
//   try {

//     const currentGameRoom = gameArchivesStore.getRow(TB_GAME_ROOMS_TABLE_NAME, gameRoomId);
//     if (!currentGameRoom) {
//       throw new Error("No game room found for game room: " + gameRoomId);
//     }

//     const gameRoomSnapshotParseResult = GameRoomTinybaseSnapshotSchema.safeParse(currentGameRoom);
//     if (!gameRoomSnapshotParseResult.success) {
//       console.error('Error validating existing game room snapshot:', gameRoomSnapshotParseResult.error);
//       return { success: false, error: 'Invalid game room snapshot data' };
//     }
//     const gameRoomSnapshot = gameRoomSnapshotParseResult.data;

//     const now = Date.now();

//     // const stringifiedLatestGameRoomState = JSON.stringify(latestGameRoom);
//     // const stringifiedLatestEvent = JSON.stringify(latestEvent);
//     // const stringifiedLatestChange = JSON.stringify(latestChange);
//     // const stringifiedLatestGameState = JSON.stringify(nextGameState);
//     // const stringifiedRoomState = JSON.stringify(latestGameRoom);
//     const stringifiedLatestBoardTransition = JSON.stringify(latestBoardTransition);
    
//     const latestStepIndex = gameRoomSnapshot.latestStepIndex + 1;

//     const newGameRoomSnapshot: GameRoomTinybaseSnapshot = {
//       ...gameRoomSnapshot,
//       gameRoomId: gameRoomId as BfgGameRoomId,
//       latestStepIndex,
//       stringifiedLatestBoardTransition,      
//       lastUpdatedAt: now,
//     };

//     gameArchivesStore.transaction(
//       () => {
//         gameArchivesStore.setRow(TB_GAME_ROOMS_TABLE_NAME, gameRoomId, newGameRoomSnapshot);
//       },
//     );

//     return { success: true };
//   } catch (error) {
//     console.error('Error adding game step:', error);
//     return { success: false, error: 'Failed to add game step' };
//   }
// };


// export const addNewHostedGameRoom = async (
//   gameRoom: GameRoomDb,
//   gameStep: GameTableStateDbStep,
// ): Promise<{ success: boolean; error?: string }> => {
//   try {
//     const currentGameArchive = gameArchivesStore.getRow(TB_GAME_ROOMS_TABLE_NAME, gameRoom.id);
//   }
// };



//   //   // Validate the action data
//   //   const validationResult = DbGameTableActionSchema.safeParse(newAction);
//   //   if (!validationResult.success) {
//   //     console.error('Error validating game action data:', validationResult.error);
//   //     return { success: false, error: 'Invalid action data' };
//   //   }

//   //   // Get the next action index
//   //   const actionIndex = getNextActionIndex(gameTableId);
//   //   const tableName = getGameActionsTableName(gameTableId);

//   //   console.log("addGameAction: BfgGameTableId", gameTableId);
//   //   console.log("addGameAction: newAction", newAction);
    
//   //   // Get the previous action ID (the last action in the chain)
//   //   // const existingActions = gameActionsStore.getTable(tableName);
//   //   // const existingIndices = Object.keys(existingActions).map(Number).filter(n => !isNaN(n));
//   //   // const lastActionIndex = existingIndices.length > 0 ? Math.max(...existingIndices) : null;
//   //   // const previousActionId = lastActionIndex !== null ? existingActions[lastActionIndex]?.id || null : null;

//   //   // const gameActionId = BfgGameTableActionId.createId();

//   //   // Create the complete action with ID and metadata
//   //   const completeAction: DbGameTableAction = {
//   //     ...newAction,
//   //     // id: gameActionId, // Using a simple ID format
//   //     gameTableId,
//   //   };

//   //   // Validate the complete action
//   //   const completeValidationResult = DbGameTableActionSchema.safeParse(completeAction);
//   //   if (!completeValidationResult.success) {
//   //     console.error('Error validating complete game action data:', completeValidationResult.error);
//   //     return { success: false, error: 'Invalid complete action data' };
//   //   }

//   //   // Add to store
//   //   gameActionsStore.setRow(tableName, actionIndex.toString(), completeAction);

//   //   return { 
//   //     success: true, 
//   //     // actionId: completeAction.id,
//   //   };
//   // } catch (error) {
//   //   console.error('Error adding game action:', error);
//   //   return { success: false, error: 'Failed to add action' };
//   // }
// // };

// // export const addGameHostAction = async (
// //   gameTableId: BfgGameTableId,
// //   action: DbGameTableAction
// // ): Promise<{ success: boolean; actionId?: string; error?: string }> => {
// //   validateAsHostDbGameTableAction(action);

// //   return await addGameAction(gameTableId, action);
// // };

// // export const addGamePlayerAction = async (
// //   gameTableId: BfgGameTableId,
// //   action: DbGameTableAction
// // ): Promise<{ success: boolean; actionId?: string; error?: string }> => {
// //   validateAsPlayerDbGameTableAction(action);

// //   return await addGameAction(gameTableId, action);
// // };


// /**
//  * Get all hosted games
//  */
// export const getAllHostedGames = (): GameRoomDb[] => {
//   try {
//     const games: GameRoomDb[] = [];
//     const parsedGameTableIds = new Set<BfgGameTableId>();

//     // Get all row IDs from gameArchivesStore and parse them
//     const archiveTable = gameArchivesStore.getTable('gameArchives');
//     Object.keys(archiveTable).forEach((rowId) => {
//       const parseResult = BfgGameTableIdToolbox.idSchema.safeParse(rowId);
//       if (parseResult.success) {
//         parsedGameTableIds.add(parseResult.data);
//       } else {
//         console.warn(`Invalid game table ID in archive store: ${rowId}`, parseResult.error);
//       }
//     });

//     // For each parsed game table ID, get the GameTable from archive data
//     parsedGameTableIds.forEach((gameTableId) => {
//       const archiveRow = gameArchivesStore.getRow('gameArchives', gameTableId);
//       if (archiveRow && typeof archiveRow.stringifiedLatestTableState === 'string') {
//         try {
//           const parsedTableState = JSON.parse(archiveRow.stringifiedLatestTableState);
//           const gameTable = GameRoomDbSchema.parse(parsedTableState);
//           games.push(gameTable);
//         } catch (error) {
//           console.error(`Error parsing game table state for ${gameTableId}:`, error);
//         }
//       }
//     });
    
//     return games;
//   } catch (error) {
//     console.error('Error getting all hosted games:', error);
//     return [];
//   }
// };



// export const useHostedGameStep = (gameTableId: BfgGameTableId, stepIndex: number): GameRoomSnapshot | null => {
//   // const hostedGameArchive = useHostedGameArchive(gameTableId);
//   // if (!hostedGameArchive) {
//   //   return null;
//   // }

//   const hostedGameArchive = gameArchivesStore.getRow(TB_GAME_STEPS_TABLE_NAME, gameTableId);



//   return hostedGameArchive.stringifiedLatestTableState;
// };


// export const useLatestHostedGameSnapshot = (gameTableId: BfgGameTableId): GameArchive | null => {
//   const hostedGameArchive = useHostedGameArchive(gameTableId);
//   if (!hostedGameArchive) {
//     return null;
//   }

//   const latestGameStepIndex = hostedGameArchive.latestStepIndex;
//   const latestGameStep = useHostedGameStep(gameTableId, latestGameStepIndex);
//   // if (!latestGameStep) {
//   //   return null;
//   // }
//   return latestGameStep;
// };


// export const useHostedGameArchive = (gameTableId: BfgGameTableId): GameArchive | null => {
//   const hostedGameArchive = useRow(TB_GAME_ARCHIVES_TABLE_NAME, gameTableId, gameArchivesStore);
//   // const archiveRow = hostedGameArchiveTable[gameTableId];

//   if (!hostedGameArchive) {
//     return null;
//   }

//   const gameArchiveParseResult = GameArchiveSchema.safeParse(hostedGameArchive);
//   if (!gameArchiveParseResult.success) {
//     console.error('Error validating existing game archive:', gameArchiveParseResult.error);
//     return null;
//   }
//   const gameArchive = gameArchiveParseResult.data;

//   return gameArchive;
  
//   // // Parse all stringified fields
//   // const latestTableState = GameRoomSchema.parse(JSON.parse(gameSnapshot.stringifiedLatestTableState));
//   // const latestEvent = DbGameTableEventSchema.parse(JSON.parse(gameSnapshot.stringifiedLatestEvent));
//   // const latestChange = GameEventChangeSchema.parse(JSON.parse(gameSnapshot.stringifiedLatestChange));
//   // const latestGameState = LatestGameStateSchema.parse(JSON.parse(gameSnapshot.stringifiedLatestGameState));
//   // // const gameHistory = GameHistorySchema.parse(JSON.parse(gameSnapshot.stringifiedGameHistory));

//   // const retVal: GameTable = {
//   //   gameTableId,
//   //   latestTableState,
//   //   latestEvent,
//   //   latestChange,
//   //   latestGameState,
//   //   // gameHistory,
//   //   // gameHistoryLength,
//   //   createdAt: gameSnapshot.createdAt,
//   //   lastUpdatedAt: gameSnapshot.lastUpdatedAt,
//   // };

//   // return retVal;

//   // try {
//   //   // Type-check and extract stringified fields
//   //   const stringifiedLatestTableState = archiveRow.stringifiedLatestTableState;
//   //   const stringifiedLatestEvent = archiveRow.stringifiedLatestEvent;
//   //   const stringifiedLatestOutcome = archiveRow.stringifiedLatestOutcome;
//   //   const stringifiedLatestGameState = archiveRow.stringifiedLatestGameState;
//   //   const stringifiedGameHistory = archiveRow.stringifiedGameHistory;
//   //   const gameHistoryLength = archiveRow.gameHistoryLength;
//   //   const createdAt = archiveRow.createdAt;
//   //   const lastUpdatedAt = archiveRow.lastUpdatedAt;

//   //   if (
//   //     typeof stringifiedLatestTableState !== 'string' ||
//   //     typeof stringifiedLatestEvent !== 'string' ||
//   //     typeof stringifiedLatestOutcome !== 'string' ||
//   //     typeof stringifiedLatestGameState !== 'string' ||
//   //     typeof stringifiedGameHistory !== 'string' ||
//   //     typeof gameHistoryLength !== 'number' ||
//   //     typeof createdAt !== 'number' ||
//   //     typeof lastUpdatedAt !== 'number'
//   //   ) {
//   //     console.error(`Invalid archive row data types for ${gameTableId}`);
//   //     return null;
//   //   }

//   //   // Parse all stringified fields
//   //   const latestTableState = GameRoomSchema.parse(JSON.parse(stringifiedLatestTableState));
//   //   const latestEvent = DbGameTableEventSchema.parse(JSON.parse(stringifiedLatestEvent));
//   //   const latestChange = GameEventChangeSchema.parse(JSON.parse(stringifiedLatestChange));
//   //   const latestGameState = LatestGameStateSchema.parse(JSON.parse(stringifiedLatestGameState));
//   //   const gameHistory = GameHistorySchema.parse(JSON.parse(stringifiedGameHistory));

//   //   return {
//   //     gameTableId,
//   //     latestTableState,
//   //     latestEvent,
//   //     latestChange,
//   //     latestGameState,
//   //     gameHistory,
//   //     gameHistoryLength,
//   //     createdAt,
//   //     lastUpdatedAt,
//   //   };
//   // } catch (error) {
//   //   console.error(`Error parsing game archive for ${gameTableId}:`, error);
//   //   return null;
//   // }
// };


// export const useHostedGameLatestTableState = (gameTableId: BfgGameTableId): GameRoomDb | null => {
//   const hostedGameArchive = useHostedGameArchive(gameTableId);
//   const latestTableState = hostedGameArchive?.stringifiedLatestTableState;

//   if (!hostedGameArchive) {
//     return null;
//   }
//   return hostedGameArchive.latestTableState;
// };


// export const clearAllGameArchives = (): void => {
//   gameArchivesStore.delTable(TB_GAME_ARCHIVES_TABLE_NAME);
//   console.log('Game archives cleared successfully');
// };


// export const clearGameArchive = (gameTableId: BfgGameTableId): void => {
//   gameArchivesStore.delRow(TB_GAME_ARCHIVES_TABLE_NAME, gameTableId);
//   console.log('Game archive cleared successfully');
// };


// /**
//  * Update an existing hosted game
//  */
// export const updateHostedGame = (
//   gameTableId: BfgGameTableId,
//   updatedRoomState: GameRoomDb,
//   boardTransition: GameBoardTransition,
//   // latestEvent: GameTableStateDbStep,
//   // latestChange: GameEventChange,
//   // latestGameState: LatestGameState,
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

//     // if (typeof existingGame.stringifiedLatestTableState !== 'string') {
//     //   return false;
//     // }

//     // const existingGameTable = GameRoomSchema.parse(JSON.parse(
//     //   existingGame.stringifiedLatestTableState));

//     // const updatedGame: GameTable = {
//     //   ...existingGameTable,
//     //   ...updatedTableState,
//     // };

//     // Validate the updated data
//     // const validationResult = GameRoomSchema.safeParse(updatedGame);
//     // if (!validationResult.success) {
//     //   console.error('Error validating updated game table data:', validationResult.error);
//     //   return false;
//     // }

//     // Validate that existingGame has all required fields
//     // if (
//     //   typeof existingGame.gameTableId !== 'string' ||
//     //   typeof existingGame.stringifiedLatestTableState !== 'string' ||
//     //   typeof existingGame.stringifiedLatestAction !== 'string' ||
//     //   typeof existingGame.stringifiedLatestOutcome !== 'string' ||
//     //   typeof existingGame.stringifiedLatestGameState !== 'string' ||
//     //   typeof existingGame.stringifiedGameHistory !== 'string' ||
//     //   typeof existingGame.gameHistoryLength !== 'number' ||
//     //   typeof existingGame.createdAt !== 'number' ||
//     //   typeof existingGame.lastUpdatedAt !== 'number'
//     // ) {
//     //   console.error('Error: existing game archive missing required fields');
//     //   return false;
//     // }




// // export const GameStepSchema = createZodSchemaFromTinyBaseSchema(GameStepsTinybaseTableSchema, {
// //   gameTableId: BfgGameTableIdToolbox.idSchema, // Use branded type schema
// //   stringifiedEvent: BfgGameEventStringifier.stringValueSchema,
// //   stringifiedChange: BfgGameEventChangeStringifier.stringValueSchema,
// //   stringifiedNextGameState: BfgGameStateStringifier.stringValueSchema,
// // });


//     // const currentGameHistory = GameHistorySchema.parse(JSON.parse(existingGame.stringifiedGameHistory));
//     // const historyStep = {
//     //   event: latestEvent,
//     //   change: updatedChange,
//     //   nextGameState: updatedGameState,
//     // };

//     // const updatedGameHistory = [...currentGameHistory, historyStep];

//     // const stringifiedLatestTableState = JSON.stringify(updatedTableState);
//     // const stringifiedLatestEvent = JSON.stringify(latestEvent);
//     // const stringifiedLatestChange = JSON.stringify(updatedChange);
//     // const stringifiedLatestGameState = JSON.stringify(updatedGameState);
//     // const stringifiedGameHistory = JSON.stringify(updatedGameHistory);

//     // const updatedGameArchive: GameArchive = {
//     //   gameTableId,
//     //   stringifiedLatestTableState,
//     //   stringifiedLatestEvent,
//     //   stringifiedLatestChange,
//     //   stringifiedLatestGameState,
//     //   stringifiedGameHistory,
//     //   gameHistoryLength: updatedGameHistory.length,
//     //   createdAt: existingGame.createdAt,
//     //   lastUpdatedAt: Date.now(),
//     // };

//     gameArchivesStore.setRow(TB_GAME_ARCHIVES_TABLE_NAME, gameTableId, updatedGameArchive);
//     return true;


//     // const updatedGameArchive: GameArchive = {
//     //   gameTableId: existingGame.gameTableId as BfgGameTableId,
//     //   stringifiedLatestTableState,
//     //   stringifiedLatestAction: existingGame.stringifiedLatestAction,
//     //   stringifiedLatestOutcome: existingGame.stringifiedLatestOutcome,
//     //   stringifiedLatestGameState: existingGame.stringifiedLatestGameState,
//     //   stringifiedGameHistory: existingGame.stringifiedGameHistory,
//     //   gameHistoryLength: existingGame.gameHistoryLength,
//     //   createdAt: existingGame.createdAt,
//     //   lastUpdatedAt: Date.now(),
//     // };

//     // gameArchivesStore.setRow(TB_GAME_ARCHIVES_STORE_NAME, gameId, updatedGameArchive);
//     // return true;

//   } catch (error) {
//     console.error('Error updating hosted game:', error);
//     return false;
//   }
// };





// // export const updateLatestGameState = async (
// //   gameTableId: BfgGameTableId,
// //   latestAction: DbGameTableAction,
// //   latestOutcome: GameEventOutcome,
// //   latestNextGameState: DbGameTableAction
// // ): Promise<{ success: boolean; actionId?: string; error?: string }> => {
// //   validateAsHostDbGameTableAction(latestAction);
// //   validateAsHostDbGameTableAction(latestOutcome);
// //   validateAsHostDbGameTableAction(latestNextGameState);

// //   return await addGameAction(gameTableId, latestAction);
// // };

// // /**
// //  * Get all actions for a specific game table
// //  */
// // export const getGameActions = (gameTableId: BfgGameTableId): DbGameTableAction[] => {
// //   try {
// //     const tableName = getGameActionsTableName(gameTableId);
// //     const rawActions = gameActionsStore.getTable(tableName);
// //     const actions: DbGameTableAction[] = [];
    
// //     // Sort by index to maintain chronological order
// //     const sortedIndices = Object.keys(rawActions)
// //       .map(Number)
// //       .filter(n => !isNaN(n))
// //       .sort((a, b) => a - b);
    
// //     sortedIndices.forEach(index => {
// //       const rawActionData = rawActions[index];
// //       const parsedAction = parseRawGameActionData(index.toString(), rawActionData);
// //       if (parsedAction) {
// //         actions.push(parsedAction);
// //       }
// //     });
    
// //     return actions;
// //   } catch (error) {
// //     console.error('Error getting game actions:', error);
// //     return [];
// //   }
// // };

// // /**
// //  * Get a specific game action by index
// //  */
// // export const getGameAction = (gameTableId: BfgGameTableId, actionIndex: number): DbGameTableAction | null => {
// //   try {
// //     const tableName = getGameActionsTableName(gameTableId);
// //     const rawActionData = gameActionsStore.getRow(tableName, actionIndex.toString());
    
// //     if (!rawActionData) {
// //       return null;
// //     }
    
// //     return parseRawGameActionData(actionIndex.toString(), rawActionData);
// //   } catch (error) {
// //     console.error('Error getting game action:', error);
// //     return null;
// //   }
// // };

// // /**
// //  * Get the latest action for a game table
// //  */
// // export const getLatestGameAction = (gameTableId: BfgGameTableId): DbGameTableAction | null => {
// //   try {
// //     const actions = getGameActions(gameTableId);
// //     return actions.length > 0 ? actions[actions.length - 1] : null;
// //   } catch (error) {
// //     console.error('Error getting latest game action:', error);
// //     return null;
// //   }
// // };

// // /**
// //  * Get actions count for a game table
// //  */
// // export const getGameActionsCount = (gameTableId: BfgGameTableId): number => {
// //   try {
// //     const tableName = getGameActionsTableName(gameTableId);
// //     const rawActions = gameActionsStore.getTable(tableName);
// //     return Object.keys(rawActions).length;
// //   } catch (error) {
// //     console.error('Error getting game actions count:', error);
// //     return 0;
// //   }
// // };

// // /**
// //  * Clear all actions for a specific game table
// //  */
// // export const clearGameActions = (gameTableId: BfgGameTableId): boolean => {
// //   try {
// //     const tableName = getGameActionsTableName(gameTableId);
// //     gameActionsStore.delTable(tableName);
// //     return true;
// //   } catch (error) {
// //     console.error('Error clearing game actions:', error);
// //     return false;
// //   }
// // };

// // /**
// //  * Clear all game actions from all tables (for testing/debugging)
// //  */
// // export const clearAllGameActions = (): void => {
// //   try {
// //     const allTables = gameActionsStore.getTables();
// //     Object.keys(allTables).forEach(tableName => {
// //       if (tableName.startsWith('bfg-game-actions-')) {
// //         gameActionsStore.delTable(tableName);
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Error clearing all game actions:', error);
// //   }
// // };

// // /**
// //  * Get all game table IDs that have actions
// //  */
// // export const getGameTableIdsWithActions = (): BfgGameTableId[] => {
// //   try {
// //     const allTables = gameActionsStore.getTables();
// //     const BfgGameTableIds: BfgGameTableId[] = [];
    
// //     Object.keys(allTables).forEach(tableName => {
// //       if (tableName.startsWith('bfg-game-actions-')) {
// //         const gameTableId = tableName.replace('bfg-game-actions-', '') as BfgGameTableId;
// //         BfgGameTableIds.push(gameTableId);
// //       }
// //     });
    
// //     return BfgGameTableIds;
// //   } catch (error) {
// //     console.error('Error getting game table IDs with actions:', error);
// //     return [];
// //   }
// // };
