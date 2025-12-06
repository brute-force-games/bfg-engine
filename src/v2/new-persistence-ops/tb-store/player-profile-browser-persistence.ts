/**
 * Browser-specific persistence for player profiles
 * Handles all persister initialization and access logic for browser environment
 */

import { playerProfileStore, TB_PLAYER_PROFILES_TABLE_KEY, PLAYER_PROFILES_DB_NAME } from '../../../tb-store/player-profile-store';
import { createSqliteWasmPersister } from 'tinybase/persisters/persister-sqlite-wasm';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';

// Persisters for browser environment
let indexedDbPersister: ReturnType<typeof createLocalPersister> | null = null;
let browserSqlitePersister: ReturnType<typeof createSqliteWasmPersister> | null = null;
let browserSqliteDb: any = null; // Store reference to SQLite database for export
let browserSqlite3: any = null; // Store reference to SQLite3 module for export
let browserSqliteInitialized = false;

/**
 * Initialize browser persisters for player profiles
 * Uses hybrid approach: IndexedDB (primary) + SQLite WASM (export)
 */
export const initializePlayerProfileBrowserPersisters = async (): Promise<void> => {
  if (browserSqliteInitialized) {
    return;
  }

  try {
    // First, set up IndexedDB persister for true persistence
    // Use createLocalPersister which uses IndexedDB under the hood
    indexedDbPersister = createLocalPersister(
      playerProfileStore,
      `bfg-${TB_PLAYER_PROFILES_TABLE_KEY}`
    );
    
    // Load from IndexedDB first (this has the persisted data)
    indexedDbPersister.startAutoLoad();
    await indexedDbPersister.load();
    console.log('IndexedDB persister initialized - data loaded from IndexedDB');
    
    // Set up auto-save to IndexedDB
    indexedDbPersister.startAutoSave();
    
    // Now set up SQLite WASM persister for download/export
    // Create database and sqlite3 instances directly so we can store references
    const { initializeSqliteWasm, createSqliteDatabase } = await import('../../../tb-store/sqlite-wasm-initializer');
    browserSqlite3 = await initializeSqliteWasm();
    browserSqliteDb = await createSqliteDatabase(PLAYER_PROFILES_DB_NAME, 'c');
    
    browserSqlitePersister = createSqliteWasmPersister(
      playerProfileStore,
      browserSqlite3,
      browserSqliteDb,
      TB_PLAYER_PROFILES_TABLE_KEY
    );
    
    // Configure auto-save to SQLite (but not auto-load, since IndexedDB is source of truth)
    browserSqlitePersister.startAutoSave();
    
    // Sync current store data to SQLite immediately (so download works)
    await browserSqlitePersister.save();
    console.log('SQLite WASM persister initialized for download/export');

    browserSqliteInitialized = true;
    console.log('Hybrid persistence initialized: IndexedDB (primary) + SQLite (export)');
  } catch (error) {
    console.error("Browser persister initialization failed:", error);
    // Mark as initialized to prevent retry loops, but persister will be null
    browserSqliteInitialized = true;
  }
};

/**
 * Save/flush the player profile store to database
 */
export const savePlayerProfileStore = async (): Promise<void> => {
  if (browserSqlitePersister && browserSqliteInitialized) {
    try {
      await browserSqlitePersister.save();
    } catch (e) {
      console.warn('Failed to save player profile store to SQLite:', e);
    }
  }
  // IndexedDB persister auto-saves, so no explicit save needed
};

/**
 * Get the SQLite persister for player profiles (browser)
 */
export const getPlayerProfileSqlitePersister = (): ReturnType<typeof createSqliteWasmPersister> | null => {
  return browserSqlitePersister;
};

/**
 * Get SQLite database and sqlite3 references for export
 */
export const getPlayerProfileSqliteReferences = (): { sqlite3: any; db: any } | null => {
  if (browserSqlite3 && browserSqliteDb) {
    return { sqlite3: browserSqlite3, db: browserSqliteDb };
  }
  return null;
};

/**
 * Ensure persisters are initialized
 */
export const ensurePlayerProfileBrowserPersistersInitialized = async (): Promise<void> => {
  if (!browserSqliteInitialized) {
    await initializePlayerProfileBrowserPersisters();
  }
};

// Auto-initialize on module load (browser environment)
if (typeof localStorage !== 'undefined') {
  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Page already loaded, initialize immediately
      initializePlayerProfileBrowserPersisters();
    } else {
      // Wait for page to load
      window.addEventListener('DOMContentLoaded', () => {
        initializePlayerProfileBrowserPersisters();
      });
      // Also try after a short delay in case DOMContentLoaded already fired
      setTimeout(() => {
        if (!browserSqliteInitialized) {
          initializePlayerProfileBrowserPersisters();
        }
      }, 100);
    }
  } else {
    // Not in browser window context, initialize immediately
    initializePlayerProfileBrowserPersisters();
  }
}

