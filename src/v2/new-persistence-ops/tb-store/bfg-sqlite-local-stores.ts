import { createStore } from "tinybase";

import {
  BFG_GAME_ROOMS_TABLE_NAME,
  BFG_GAME_INSTANCES_TABLE_NAME,
  BFG_GAME_STEPS_TABLE_NAME,
  GameInstanceMappingsTinybaseTableColumnsSchema,
  GameRoomSnapshotTinybaseTableColumnsSchema,
  GameStepTinybaseTableColumnsSchema,
} from "./bfg-store-constants";


export const bfgSqliteArchivesStore = createStore();

// Conditionally initialize SQLite persisters only when actually needed (not during module resolution)
let sqliteInitialized = false;
let gameRoomsSqlitePersister: any = null;
let gameStepsSqlitePersister: any = null;
let gameInstancesSqlitePersister: any = null;

const initializeSqlitePersisters = async () => {
  if (sqliteInitialized) {
    return;
  }

  try {
    // Dynamic import to avoid Vite resolution issues during test module loading
    // Use string literal to prevent Vite from analyzing the import path
    const sqlitePersisterPath = "tinybase/persisters/persister-sqlite";
    const betterSqlitePath = "better-sqlite3";
    
    const sqliteModule = await import(/* @vite-ignore */ sqlitePersisterPath);
    const betterSqliteModule = await import(/* @vite-ignore */ betterSqlitePath);
    
    const { createSqlitePersister } = sqliteModule;
    const Database = betterSqliteModule.default;

  // Initialize single SQLite database connection for all tables
  const sqliteDb = new Database("bfg-archives.db");

  // Create SQLite persisters for local/Node environment using the same database
  gameRoomsSqlitePersister = createSqlitePersister(
    bfgSqliteArchivesStore,
    sqliteDb,
    BFG_GAME_ROOMS_TABLE_NAME
  );

  gameStepsSqlitePersister = createSqlitePersister(
    bfgSqliteArchivesStore,
    sqliteDb,
    BFG_GAME_STEPS_TABLE_NAME
  );

  gameInstancesSqlitePersister = createSqlitePersister(
    bfgSqliteArchivesStore,
    sqliteDb,
    BFG_GAME_INSTANCES_TABLE_NAME
  );

  bfgSqliteArchivesStore.setTablesSchema({
    [BFG_GAME_INSTANCES_TABLE_NAME]: GameInstanceMappingsTinybaseTableColumnsSchema,
    [BFG_GAME_ROOMS_TABLE_NAME]: GameRoomSnapshotTinybaseTableColumnsSchema,
    [BFG_GAME_STEPS_TABLE_NAME]: GameStepTinybaseTableColumnsSchema,
  });

  gameRoomsSqlitePersister.startAutoLoad();
  gameRoomsSqlitePersister.startAutoSave();

  gameStepsSqlitePersister.startAutoLoad();
  gameStepsSqlitePersister.startAutoSave();

    gameInstancesSqlitePersister.startAutoLoad();
    gameInstancesSqlitePersister.startAutoSave();

    sqliteInitialized = true;
  } catch (error) {
    // Silently fail if SQLite dependencies aren't available (e.g., in test environment)
    // The store will still work, just without persistence
    console.warn("SQLite persisters not available:", error);
  }
};

// Initialize SQLite persisters on first use
// This will be called when the persistence ops are actually used
export const ensureSqliteInitialized = initializeSqlitePersisters;

