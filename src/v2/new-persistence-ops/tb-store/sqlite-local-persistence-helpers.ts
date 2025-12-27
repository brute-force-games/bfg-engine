// import type { GameRoomPersist } from "../../../models/tinybase/game-room-persist";
// import type { GameStepPersist } from "../../../models/tinybase/game-step-persist-tb";
// import type { BfgGameInstanceId, BfgGameRoomId, BfgGameTableId, BfgTimestamp } from "../../../models/types/bfg-branded-uuids";
// import { bfgSqliteArchivesStore, ensureSqliteInitialized } from "./bfg-sqlite-local-stores";
// import {
//   BFG_GAME_ROOMS_TABLE_NAME,
//   BFG_GAME_INSTANCES_TABLE_NAME,
//   BFG_GAME_STEPS_TABLE_NAME,
//   type GameInstanceMappingsTinybaseTableColumns,
//   type GameRoomSnapshotTinybaseTableColumns,
//   type GameStepTinybaseTableColumns,
// } from "./bfg-store-constants";
// import type { GameTablePersist } from "./sqlite-persistence-helpers";

// // Helper function to save a new game table to SQLite store (local)
// export const saveNewGameTableToSqliteLocal = async (
//   gameInstanceId: BfgGameInstanceId,
//   gameRoomId: BfgGameRoomId,
//   gameTableId: BfgGameTableId,
//   gameRoom: GameRoomPersist,
//   gameStep: GameStepPersist,
// ): Promise<{ success: boolean; error?: string }> => {
//   // Ensure SQLite is initialized before use
//   await ensureSqliteInitialized();
//   try {
//     const now = Date.now() as BfgTimestamp;
//     const stringifiedRoomState = JSON.stringify(gameRoom);
//     const stringifiedStepState = JSON.stringify(gameStep);

//     const gameRoomSnapshotTbRow: GameRoomSnapshotTinybaseTableColumns = {
//       gameInstanceId,
//       gameRoomId,
//       gameTableId,
//       stringifiedRoomState,
//       createdAt: now,
//       lastUpdatedAt: now,
//     };

//     const gameStepTbRow: GameStepTinybaseTableColumns = {
//       gameInstanceId,
//       gameRoomId,
//       gameTableId,
//       stringifiedStepState,
//       createdAt: now,
//       lastUpdatedAt: now,
//     };

//     const gameInstanceMappingTbRow: GameInstanceMappingsTinybaseTableColumns = {
//       gameInstanceId,
//       gameRoomId,
//       gameTableId,
//       gameTitle: gameRoom.gameTitle,
//       latestStepIndex: gameStep.stepIndex,
//       createdAt: now,
//       lastUpdatedAt: now,
//     };

//     bfgSqliteArchivesStore.transaction(() => {
//       bfgSqliteArchivesStore.setRow(BFG_GAME_INSTANCES_TABLE_NAME, gameInstanceId, gameInstanceMappingTbRow);
//       bfgSqliteArchivesStore.setRow(BFG_GAME_ROOMS_TABLE_NAME, gameRoomId, gameRoomSnapshotTbRow);
//       bfgSqliteArchivesStore.setRow(BFG_GAME_STEPS_TABLE_NAME, gameTableId, gameStepTbRow);
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error saving new game table to SQLite (local):", error);
//     return { success: false, error: `Failed to save new game table: ${error instanceof Error ? error.message : String(error)}` };
//   }
// };

// // Helper function to update the latest game table step in SQLite store (local)
// export const updateLatestGameTableStepInSqliteLocal = async (
//   gameInstanceId: BfgGameInstanceId,
//   gameRoomId: BfgGameRoomId,
//   gameTableId: BfgGameTableId,
//   gameStep: GameStepPersist,
// ): Promise<{ success: boolean; error?: string }> => {
//   // Ensure SQLite is initialized before use
//   await ensureSqliteInitialized();
//   try {
//     const now = Date.now() as BfgTimestamp;
//     const stringifiedStepState = JSON.stringify(gameStep);

//     // Get existing game room to update lastUpdatedAt
//     const existingGameRoom = bfgSqliteArchivesStore.getRow(BFG_GAME_ROOMS_TABLE_NAME, gameRoomId);
//     if (!existingGameRoom) {
//       return { success: false, error: "Game room not found" };
//     }

//     const updatedGameRoomSnapshot: GameRoomSnapshotTinybaseTableColumns = {
//       ...(existingGameRoom as GameRoomSnapshotTinybaseTableColumns),
//       lastUpdatedAt: now,
//     };

//     const gameStepTbRow: GameStepTinybaseTableColumns = {
//       gameInstanceId,
//       gameRoomId,
//       gameTableId,
//       stringifiedStepState,
//       createdAt: now,
//       lastUpdatedAt: now,
//     };

//     // Update game instance mapping with latest step index
//     const existingGameInstance = bfgSqliteArchivesStore.getRow(BFG_GAME_INSTANCES_TABLE_NAME, gameInstanceId);
//     const updatedGameInstanceMapping: GameInstanceMappingsTinybaseTableColumns = {
//       ...(existingGameInstance as GameInstanceMappingsTinybaseTableColumns),
//       latestStepIndex: gameStep.stepIndex,
//       lastUpdatedAt: now,
//     };

//     bfgSqliteArchivesStore.transaction(() => {
//       bfgSqliteArchivesStore.setRow(BFG_GAME_ROOMS_TABLE_NAME, gameRoomId, updatedGameRoomSnapshot);
//       bfgSqliteArchivesStore.setRow(BFG_GAME_STEPS_TABLE_NAME, gameTableId, gameStepTbRow);
//       bfgSqliteArchivesStore.setRow(BFG_GAME_INSTANCES_TABLE_NAME, gameInstanceId, updatedGameInstanceMapping);
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error updating latest game table step in SQLite (local):", error);
//     return { success: false, error: `Failed to update game table step: ${error instanceof Error ? error.message : String(error)}` };
//   }
// };

// // Helper function to get the latest game table from SQLite store (local)
// export const getLatestGameTableFromSqliteLocal = async (
//   gameInstanceId: BfgGameInstanceId,
//   gameRoomId: BfgGameRoomId,
//   gameTableId: BfgGameTableId,
// ): Promise<{ success: boolean; gameTable?: GameTablePersist; error?: string }> => {
//   // Ensure SQLite is initialized before use
//   await ensureSqliteInitialized();
//   try {
//     const gameRoomRow = bfgSqliteArchivesStore.getRow(BFG_GAME_ROOMS_TABLE_NAME, gameRoomId);
//     const gameStepRow = bfgSqliteArchivesStore.getRow(BFG_GAME_STEPS_TABLE_NAME, gameTableId);

//     if (!gameRoomRow || !gameStepRow) {
//       return { success: false, error: "Game table not found" };
//     }

//     const gameRoomSnapshot = gameRoomRow as GameRoomSnapshotTinybaseTableColumns;
//     const gameStepSnapshot = gameStepRow as GameStepTinybaseTableColumns;

//     const gameRoom = JSON.parse(gameRoomSnapshot.stringifiedRoomState) as GameRoomPersist;
//     const gameStep = JSON.parse(gameStepSnapshot.stringifiedStepState) as GameStepPersist;

//     return {
//       success: true,
//       gameTable: {
//         gameRoom,
//         gameStep,
//       },
//     };
//   } catch (error) {
//     console.error("Error getting latest game table from SQLite (local):", error);
//     return { success: false, error: `Failed to get game table: ${error instanceof Error ? error.message : String(error)}` };
//   }
// };

