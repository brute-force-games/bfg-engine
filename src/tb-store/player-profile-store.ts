import { createStore } from 'tinybase';
import { createSqliteWasmPersister } from 'tinybase/persisters/persister-sqlite-wasm';
// Don't import getSqliteWasm at top level - import it dynamically when needed
// This prevents module load failures if it's not available
import { PrivatePlayerProfile, PrivatePlayerProfileSchema } from "@bfg-engine/models/internal/player-profile/private-player-profile";
import { PublicPlayerProfile } from "@bfg-engine/models/internal/player-profile/public-player-profile";
import { createPrivatePlayerProfile } from "@bfg-engine/models/internal/player-profile/private-player-profile";
import { createPlayerProfileId, PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { ensureSqliteInitialized } from '../v2/new-persistence-ops/tb-store/bfg-sqlite-local-stores';


/**
 * TinyBase store for player profiles
 * Provides reactive state management for player profile data
 */


export const TB_STORE_NAME = 'tinybase_player_profiles';

export const TB_PLAYER_PROFILES_TABLE_KEY = 'playerProfiles';

export const TB_DEFAULT_PROFILE_ID_KEY = 'defaultProfileId';
export const DEFAULT_PROFILE_ID_VALUE = '';

export const PLAYER_PROFILES_DB_NAME = 'player_profiles.db';


// Create the store
export const playerProfileStore = createStore();

// Persisters for different environments
let browserSqlitePersister: ReturnType<typeof createSqliteWasmPersister> | null = null;
let browserSqliteWasm: any = null; // Store the SQLite WASM instance for database export
let sqlitePersister: any = null;
let sqliteInitialized = false;
let browserSqliteInitialized = false;

if (typeof localStorage !== 'undefined') {
  // Browser environment - use SQLite WASM
  const initializeBrowserSqlitePersister = async () => {
    if (browserSqliteInitialized) {
      return;
    }

    try {
      // Try to dynamically import getSqliteWasm
      // It may not be available in all builds, so we handle failure gracefully
      let sqliteWasm: any = null;
      try {
        const sqliteWasmModule = await import('tinybase/persisters/persister-sqlite-wasm');
        // @ts-ignore - getSqliteWasm may not be in type definitions but might exist at runtime
        const getSqliteWasm = (sqliteWasmModule as any).getSqliteWasm;
        if (getSqliteWasm && typeof getSqliteWasm === 'function') {
          sqliteWasm = await getSqliteWasm();
        }
      } catch (importError) {
        console.warn('getSqliteWasm not available via import:', importError);
      }
      
      if (!sqliteWasm) {
        console.error('Cannot initialize SQLite WASM persister: getSqliteWasm not available');
        browserSqliteInitialized = true; // Mark as initialized to prevent retry loops
        return;
      }
      
      browserSqliteWasm = sqliteWasm; // Store for later use
      
      browserSqlitePersister = createSqliteWasmPersister(
        playerProfileStore,
        sqliteWasm,
        TB_PLAYER_PROFILES_TABLE_KEY,
        PLAYER_PROFILES_DB_NAME
      );

      browserSqlitePersister.startAutoLoad();
      browserSqlitePersister.startAutoSave();
      // Explicitly load data immediately
      await browserSqlitePersister.load();

      browserSqliteInitialized = true;
      console.log('SQLite WASM persister initialized successfully');
    } catch (error) {
      console.error("SQLite WASM persister initialization failed:", error);
      // Mark as initialized to prevent retry loops, but persister will be null
      browserSqliteInitialized = true;
    }
  };

  // Initialize SQLite WASM persister asynchronously - wait for page to be ready
  // This ensures all modules are loaded before trying to initialize
  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Page already loaded, initialize immediately
      initializeBrowserSqlitePersister();
    } else {
      // Wait for page to load
      window.addEventListener('DOMContentLoaded', () => {
        initializeBrowserSqlitePersister();
      });
      // Also try after a short delay in case DOMContentLoaded already fired
      setTimeout(() => {
        if (!browserSqliteInitialized) {
          initializeBrowserSqlitePersister();
        }
      }, 100);
    }
  } else {
    // Not in browser, initialize immediately
    initializeBrowserSqlitePersister();
  }
} else {
  // Node.js environment - use the existing bfg-sqlite infrastructure
  const initializeSqlitePersister = async () => {
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

  // Initialize SQLite persister asynchronously
  initializeSqlitePersister().catch(() => {
    // Error logged in initializeSqlitePersister, but don't throw here
    // so the store can still work in-memory
  });
}

/**
 * Save/flush the player profile store to database
 * This ensures all pending changes are written
 */
export const savePlayerProfileStore = async (): Promise<void> => {
  if (typeof localStorage !== 'undefined') {
    // Browser environment - SQLite WASM auto-saves, but we can trigger a save
    if (browserSqlitePersister && browserSqliteInitialized) {
      try {
        await browserSqlitePersister.save();
      } catch (error) {
        console.error('Error saving player profiles to database:', error);
      }
    }
    return;
  }
  
  if (sqlitePersister && sqliteInitialized) {
    try {
      await sqlitePersister.save();
    } catch (error) {
      console.error('Error saving player profiles to database:', error);
    }
  }
};

/**
 * Ensure SQLite persister is initialized and data is loaded
 * This should be called before operations that need persistence
 */
export const ensurePlayerProfileSqliteInitialized = async (): Promise<void> => {
  if (typeof localStorage !== 'undefined') {
    // Browser environment - ensure SQLite WASM is initialized
    if (!browserSqliteInitialized) {
      // Try to dynamically import getSqliteWasm
      let sqliteWasm: any = null;
      try {
        const sqliteWasmModule = await import('tinybase/persisters/persister-sqlite-wasm');
        // @ts-ignore - getSqliteWasm may not be in type definitions but might exist at runtime
        const getSqliteWasm = (sqliteWasmModule as any).getSqliteWasm;
        if (getSqliteWasm && typeof getSqliteWasm === 'function') {
          sqliteWasm = await getSqliteWasm();
        }
      } catch (importError) {
        console.warn('getSqliteWasm not available via import:', importError);
      }
      
      if (!sqliteWasm) {
        throw new Error('Cannot initialize SQLite WASM persister: getSqliteWasm not available');
      }
      
      browserSqliteWasm = sqliteWasm; // Store for later use
      browserSqlitePersister = createSqliteWasmPersister(
        playerProfileStore,
        sqliteWasm,
        TB_PLAYER_PROFILES_TABLE_KEY,
        PLAYER_PROFILES_DB_NAME
      );
      browserSqlitePersister.startAutoLoad();
      browserSqlitePersister.startAutoSave();
      await browserSqlitePersister.load();
      browserSqliteInitialized = true;
    }
    return;
  }
  
  if (sqliteInitialized && sqlitePersister) {
    // Ensure data is loaded even if persister was already initialized
    try {
      await sqlitePersister.load();
    } catch (error) {
      // Ignore load errors, data might already be loaded
    }
    return;
  }
  
  // Wait for initialization if it's in progress
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (!sqliteInitialized) {
      // Try to initialize if it hasn't happened yet
      try {
        await ensureSqliteInitialized();
        const sqlitePersisterPath = "tinybase/persisters/persister-sqlite3";
        const sqlite3Path = "sqlite3";
        
        const sqliteModule = await import(/* @vite-ignore */ sqlitePersisterPath);
        const sqlite3Module = await import(/* @vite-ignore */ sqlite3Path);
        
        const { createSqlite3Persister } = sqliteModule;
        const Database = sqlite3Module.Database || sqlite3Module.default?.Database || sqlite3Module.default;

        const sqliteDb = new Database("bfg-archives.db");
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
      console.error("Failed to initialize SQLite persister for player profiles:", error);
    }
  } else if (sqlitePersister) {
    // Persister was initialized, ensure data is loaded
    try {
      await sqlitePersister.load();
    } catch (error) {
      // Ignore load errors
    }
  }
};

// Set initial values only if store is empty (no existing data)
const hasExistingData = playerProfileStore.getTable(TB_PLAYER_PROFILES_TABLE_KEY) && 
  Object.keys(playerProfileStore.getTable('playerProfiles')).length > 0;

if (!hasExistingData) {
  playerProfileStore.setValue(TB_DEFAULT_PROFILE_ID_KEY, DEFAULT_PROFILE_ID_VALUE);
}


/**
 * Safely parse profile data from TinyBase store - now just validates the stored object
 */
export const parseRawProfileData = (profileId: PlayerProfileId, rawData: any): PrivatePlayerProfile | null => {
  // TinyBase stores complex nested objects as JSON strings, so we need to parse the webCryptoWallet field
  let parsedData = rawData;
  if (rawData.webCryptoWallet && typeof rawData.webCryptoWallet === 'string') {
    try {
      parsedData = {
        ...rawData,
        webCryptoWallet: JSON.parse(rawData.webCryptoWallet),
      };
    } catch (error) {
      console.error(`Error parsing webCryptoWallet for ${profileId}:`, error);
      return null;
    }
  }
  
  const result = PrivatePlayerProfileSchema.safeParse(parsedData);
  
  if (!result.success) {
    console.error(`Error validating profile data for ${profileId}:`, result.error);
    return null;
  }
  
  return result.data;
}


/**
 * Add a new player profile to the store
 */
export const addPlayerProfile = async (
  handle: string,
  avatarImageUrl?: string
): Promise<PlayerProfileId> => {
  try {
    // Ensure SQLite is initialized before adding profile (for Node.js environments)
    await ensurePlayerProfileSqliteInitialized();
    
    // Create profile data using mnemonic-based wallet system
    const profileData = await createPrivatePlayerProfile(handle, avatarImageUrl);
    
    // Add required fields
    const now = Date.now();
    const profileId = createPlayerProfileId();
    
    const completeProfileData: PrivatePlayerProfile = {
      id: profileId,
      ...profileData,
      createdAt: now,
      updatedAt: now,
    };
    
    // Serialize webCryptoWallet as JSON string for TinyBase storage
    const storeData = {
      ...completeProfileData,
      webCryptoWallet: JSON.stringify(completeProfileData.webCryptoWallet),
    };
    
    // Add to store - store the entire profile object
    playerProfileStore.setRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId, storeData as any);
    
    return profileId;
  } catch (error) {
    console.error('Error adding player profile:', error);
    throw new Error('Failed to add player profile');
  }
};

/**
 * Update an existing player profile
 */
export const updatePlayerProfile = (
  profileId: PlayerProfileId,
  updates: Partial<Omit<PrivatePlayerProfile, 'id' | 'createdAt' | 'updatedAt'>>
): boolean => {
  try {
    const existingProfile = playerProfileStore.getRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId);
    if (!existingProfile) {
      return false;
    }
    
    // Serialize webCryptoWallet if it's being updated
    const serializedUpdates = updates.webCryptoWallet
      ? { ...updates, webCryptoWallet: JSON.stringify(updates.webCryptoWallet) }
      : updates;
    
    const updatedProfile = {
      ...existingProfile,
      ...serializedUpdates,
      updatedAt: Date.now(),
    };
    
    playerProfileStore.setRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId, updatedProfile as any);
    return true;
  } catch (error) {
    console.error('Error updating player profile:', error);
    return false;
  }
};

/**
 * Delete a player profile
 */
export const deletePlayerProfile = (profileId: PlayerProfileId): boolean => {
  try {
    const existingProfile = playerProfileStore.getRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId);
    if (!existingProfile) {
      return false;
    }
    
    // Remove from store
    playerProfileStore.delRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId);
    
    // If this was the default profile, clear the default
    const currentDefault = playerProfileStore.getValue(TB_DEFAULT_PROFILE_ID_KEY);
    if (currentDefault === profileId) {
      playerProfileStore.setValue(TB_DEFAULT_PROFILE_ID_KEY, DEFAULT_PROFILE_ID_VALUE);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting player profile:', error);
    return false;
  }
};

/**
 * Get a player profile by ID
 */
export const getPlayerProfile = (profileId: PlayerProfileId): PrivatePlayerProfile | null => {
  try {
    const rawProfileData = playerProfileStore.getRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId);
    if (!rawProfileData) {
      return null;
    }
    
    return parseRawProfileData(profileId, rawProfileData);
  } catch (error) {
    console.error('Error getting player profile:', error);
    return null;
  }
};

/**
 * Get all player profiles
 */
export const getAllPlayerProfiles = (): PrivatePlayerProfile[] => {
  try {
    const rawProfiles = playerProfileStore.getTable(TB_PLAYER_PROFILES_TABLE_KEY);
    const profiles: PrivatePlayerProfile[] = [];
    
    Object.entries(rawProfiles).forEach(([id, rawProfileData]) => {
      const parsedProfile = parseRawProfileData(id as PlayerProfileId, rawProfileData);
      if (parsedProfile) {
        profiles.push(parsedProfile);
      }
    });
    
    return profiles;
  } catch (error) {
    console.error('Error getting all player profiles:', error);
    return [];
  }
};

/**
 * Set the default player profile
 */
export const setDefaultProfile = async (profileId: PlayerProfileId): Promise<boolean> => {
  try {
    const profile = playerProfileStore.getRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId);
    if (!profile) {
      return false;
    }
    
    playerProfileStore.setValue(TB_DEFAULT_PROFILE_ID_KEY, profileId);
    
    return true;
  } catch (error) {
    console.error('Error setting default profile:', error);
    return false;
  }
};

/**
 * Get the default player profile
 */
export const getDefaultPlayerProfile = (): PrivatePlayerProfile | null => {
  try {
    const defaultId = playerProfileStore.getValue(TB_DEFAULT_PROFILE_ID_KEY);
    if (!defaultId || typeof defaultId !== 'string') {
      return null;
    }
    
    return getPlayerProfile(defaultId as PlayerProfileId);
  } catch (error) {
    console.error('Error getting default player profile:', error);
    return null;
  }
};

/**
 * Convert a private profile to public (for sharing)
 */
export const getPublicProfile = (profileId: PlayerProfileId): PublicPlayerProfile | null => {
  const privateProfile = getPlayerProfile(profileId);
  if (!privateProfile) {
    return null;
  }
  
  return {
    id: privateProfile.id,
    handle: privateProfile.handle,
    avatarImageUrl: privateProfile.avatarImageUrl,
    signingPublicKey: privateProfile.signingPublicKey,
    encryptionPublicKey: privateProfile.encryptionPublicKey,
    publicKey: privateProfile.publicKey, // Legacy
    walletAddress: privateProfile.walletAddress, // Legacy
    walletPublicKey: privateProfile.walletPublicKey, // Legacy
    // identityType: privateProfile.identityType,
    createdAt: privateProfile.createdAt,
    updatedAt: privateProfile.updatedAt,
  };
};

/**
 * Get all public profiles (for sharing with other players)
 */
export const getAllPublicProfiles = (): PublicPlayerProfile[] => {
  return getAllPlayerProfiles().map(privateProfile => ({
    id: privateProfile.id,
    handle: privateProfile.handle,
    avatarImageUrl: privateProfile.avatarImageUrl,
    signingPublicKey: privateProfile.signingPublicKey,
    encryptionPublicKey: privateProfile.encryptionPublicKey,
    publicKey: privateProfile.publicKey, // Legacy
    walletAddress: privateProfile.walletAddress, // Legacy
    walletPublicKey: privateProfile.walletPublicKey, // Legacy
    // identityType: privateProfile.identityType,
    createdAt: privateProfile.createdAt,
    updatedAt: privateProfile.updatedAt,
  }));
};

/**
 * Clear all player profiles (for testing/debugging)
 */
export const clearAllProfiles = (): void => {
  playerProfileStore.delTable(TB_PLAYER_PROFILES_TABLE_KEY);
  playerProfileStore.setValue(TB_DEFAULT_PROFILE_ID_KEY, DEFAULT_PROFILE_ID_VALUE);
};

/**
 * Get the SQLite WASM database file as a Uint8Array for download (browser only)
 */
export const getPlayerProfilesDatabaseFile = async (): Promise<Uint8Array | null> => {
  if (typeof localStorage === 'undefined') {
    // Node.js environment - not supported
    return null;
  }

  const dbName = PLAYER_PROFILES_DB_NAME;
  
  // Try to ensure persister is initialized (even if it might fail)
  // This will attempt to create the database if it doesn't exist
  try {
    await ensurePlayerProfileSqliteInitialized();
  } catch (e) {
    console.warn('Persister initialization failed, will try OPFS directly:', e);
  }
  
  // Try to save persister first if it exists (ensures data is flushed to OPFS)
  try {
    if (browserSqlitePersister) {
      await browserSqlitePersister.save();
      console.log('Persister saved successfully');
    } else {
      console.warn('Persister not initialized - database may not exist yet');
    }
  } catch (e) {
    // Ignore save errors - persister might not be initialized
    console.warn('Could not save persister:', e);
  }

  // Access the database through OPFS (Origin Private File System)
  // SQLite WASM stores databases in OPFS, we can read the file directly
  if (navigator.storage && navigator.storage.getDirectory) {
    try {
      const opfsRoot = await navigator.storage.getDirectory();
      
      // Try multiple possible locations and filenames
      const possiblePaths = [
        dbName,
        `${dbName}.db`,
        `.sqlite/${dbName}`,
        `.sqlite/${dbName}.db`,
        `sqlite/${dbName}`,
        `sqlite/${dbName}.db`,
      ];
      
      for (const path of possiblePaths) {
        try {
          const parts = path.split('/');
          let currentHandle: FileSystemDirectoryHandle | FileSystemFileHandle = opfsRoot;
          
          // Navigate through directory structure
          for (let i = 0; i < parts.length - 1; i++) {
            currentHandle = await (currentHandle as FileSystemDirectoryHandle).getDirectoryHandle(parts[i], { create: false });
          }
          
          // Get the file
          const dbFile = await (currentHandle as FileSystemDirectoryHandle).getFileHandle(parts[parts.length - 1], { create: false });
          const file = await dbFile.getFile();
          const arrayBuffer = await file.arrayBuffer();
          console.log(`Found database at: ${path}`);
          return new Uint8Array(arrayBuffer);
        } catch (e) {
          // Try next path
          continue;
        }
      }
      
      // If not found, try listing all files to see what's available
      console.log('Database file not found in expected locations. Listing OPFS contents...');
      try {
        const entries: string[] = [];
        // @ts-ignore - entries() exists but may not be in TypeScript definitions
        for await (const [name, handle] of opfsRoot.entries()) {
          entries.push(name);
          if (handle.kind === 'directory') {
            // Check subdirectories
            // @ts-ignore - entries() exists but may not be in TypeScript definitions
            for await (const [subName] of (handle as FileSystemDirectoryHandle).entries()) {
              entries.push(`${name}/${subName}`);
            }
          }
        }
        console.log('Available files in OPFS:', entries);
      } catch (listError) {
        console.warn('Could not list OPFS contents:', listError);
      }
      
    } catch (opfsError) {
      console.error('OPFS access failed:', opfsError);
    }
  }
  
  // Fallback: Try to access through persister's internal state
  if (browserSqliteWasm && browserSqlitePersister) {
    try {
      // @ts-ignore - accessing internal state
      const dbHandle = browserSqlitePersister.db;
      if (dbHandle && typeof browserSqliteWasm.export === 'function') {
        const fileData = browserSqliteWasm.export(dbHandle);
        return new Uint8Array(fileData);
      }
    } catch (e) {
      console.warn('Export via sqliteWasm failed:', e);
    }
  }
  
  console.warn('Could not find database file. Persister may not be initialized.');
  return null;
};

