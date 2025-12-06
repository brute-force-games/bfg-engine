/**
 * CLI/Local (Node.js) specific persistence for player profiles
 * Handles all persister initialization and access logic for CLI environment
 */

import { playerProfileStore, TB_PLAYER_PROFILES_TABLE_KEY } from '../../../tb-store/player-profile-store';
import { ensureSqliteInitialized } from './bfg-sqlite-local-stores';

let sqlitePersister: any = null;
let sqliteInitialized = false;

/**
 * Initialize CLI persister for player profiles
 * Uses the same SQLite database as bfg-sqlite (bfg-archives.db)
 */
export const initializePlayerProfileLocalPersister = async (): Promise<void> => {
  if (sqliteInitialized) {
    return;
  }

  try {
    // Ensure the bfg-sqlite store is initialized first
    await ensureSqliteInitialized();

    // Use the same SQLite database as the bfg-sqlite store
    // Dynamic import to avoid Vite resolution issues during test module loading
    const sqlitePersisterPath = "tinybase/persisters/persister-sqlite3";
    const sqlite3Path = "sqlite3";
    
    const sqliteModule = await import(/* @vite-ignore */ sqlitePersisterPath);
    const sqlite3Module = await import(/* @vite-ignore */ sqlite3Path);
    
    const { createSqlite3Persister } = sqliteModule;
    const Database = sqlite3Module.Database || sqlite3Module.default?.Database || sqlite3Module.default;

    // Use the same database file as bfg-sqlite (bfg-archives.db)
    const sqliteDb = new Database("bfg-archives.db");

    // Create SQLite persister for player profiles table in the same database
    sqlitePersister = createSqlite3Persister(
      playerProfileStore,
      sqliteDb,
      TB_PLAYER_PROFILES_TABLE_KEY
    );

    // Load existing data, but don't use auto-save for CLI (we'll save explicitly)
    sqlitePersister.startAutoLoad();
    // Explicitly load data immediately (startAutoLoad may not load synchronously)
    await sqlitePersister.load();
    // Note: No auto-save for CLI - we save explicitly before exit

    sqliteInitialized = true;
  } catch (error) {
    // Log error for debugging
    console.error("SQLite persister not available for player profiles:", error);
    throw error; // Re-throw so callers know initialization failed
  }
};

/**
 * Save/flush the player profile store to database
 */
export const savePlayerProfileStore = async (): Promise<void> => {
  if (sqlitePersister && sqliteInitialized) {
    try {
      await sqlitePersister.save();
    } catch (e) {
      console.warn('Failed to save player profile store to SQLite:', e);
    }
  }
};

/**
 * Get the SQLite persister for player profiles (CLI)
 */
export const getPlayerProfileSqlitePersister = (): any => {
  return sqlitePersister;
};

/**
 * Ensure persister is initialized
 */
export const ensurePlayerProfileLocalPersisterInitialized = async (): Promise<void> => {
  if (!sqliteInitialized) {
    await initializePlayerProfileLocalPersister();
  }
};

// Auto-initialize on module load (CLI environment)
if (typeof localStorage === 'undefined') {
  // Initialize SQLite persister asynchronously
  initializePlayerProfileLocalPersister().catch(() => {
    // Error logged in initializePlayerProfileLocalPersister, but don't throw here
    // so the store can still work in-memory
  });
}

