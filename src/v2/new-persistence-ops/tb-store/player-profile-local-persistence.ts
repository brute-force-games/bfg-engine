// /**
//  * CLI/Local (Node.js) specific persistence for player profiles
//  * Handles all persister initialization and access logic for CLI environment
//  * Uses JSON file persistence with the SAME format as web-cli for compatibility
//  */

// import { playerProfileStore, TB_PLAYER_PROFILES_TABLE_KEY } from '../../../tb-store/player-profile-store';
// import * as fs from 'fs/promises';
// import * as path from 'path';

// const JSON_FILE_NAME = 'player_profiles.json';

// let jsonInitialized = false;

// /**
//  * Initialize CLI persister for player profiles
//  * Uses JSON file persistence (player_profiles.json) with the same format as web-cli
//  */
// export const initializePlayerProfileLocalPersister = async (): Promise<void> => {
//   if (jsonInitialized) {
//     return;
//   }

//   try {
//     // Load existing data from JSON file if it exists
//     // Use the same format as web-cli: { version, exportedAt, tables }
//     try {
//       const filePath = path.resolve(JSON_FILE_NAME);
//       const fileContent = await fs.readFile(filePath, 'utf-8');
//       const importData = JSON.parse(fileContent);
      
//       // Support both formats:
//       // 1. Web CLI format: { version, exportedAt, tables }
//       // 2. Direct TinyBase format: { tables } (for backward compatibility)
//       const tables = importData.tables || importData;
      
//       if (tables && typeof tables === 'object') {
//         playerProfileStore.setTables(tables);
//       }
//     } catch (loadError: any) {
//       // File might not exist yet, that's okay - we'll create it on first save
//       if (loadError.code !== 'ENOENT') {
//         console.warn('Error loading player profiles from JSON file:', loadError);
//       }
//     }

//     // Note: No auto-save for CLI - we save explicitly before exit
//     jsonInitialized = true;
//   } catch (error) {
//     // Log error for debugging
//     console.error("JSON file persister not available for player profiles:", error);
//     throw error; // Re-throw so callers know initialization failed
//   }
// };

// /**
//  * Save/flush the player profile store to JSON file
//  * Uses the SAME format as web-cli for compatibility
//  */
// export const savePlayerProfileStore = async (): Promise<void> => {
//   if (!jsonInitialized) {
//     return;
//   }

//   try {
//     // Get all tables from the store
//     const tables = playerProfileStore.getTables();
    
//     // Create export object with metadata (SAME format as web-cli)
//     const exportData = {
//       version: '1.0',
//       exportedAt: new Date().toISOString(),
//       tables: tables,
//     };
    
//     // Convert to JSON string with pretty formatting (same as web-cli)
//     const jsonString = JSON.stringify(exportData, null, 2);
    
//     // Write to file
//     const filePath = path.resolve(JSON_FILE_NAME);
//     await fs.writeFile(filePath, jsonString, 'utf-8');
//   } catch (e) {
//     console.warn('Failed to save player profile store to JSON file:', e);
//   }
// };

// /**
//  * Ensure persister is initialized
//  */
// export const ensurePlayerProfileLocalPersisterInitialized = async (): Promise<void> => {
//   if (!jsonInitialized) {
//     await initializePlayerProfileLocalPersister();
//   }
// };

// // Auto-initialize on module load (CLI environment)
// if (typeof localStorage === 'undefined') {
//   // Initialize JSON persister asynchronously
//   initializePlayerProfileLocalPersister().catch(() => {
//     // Error logged in initializePlayerProfileLocalPersister, but don't throw here
//     // so the store can still work in-memory
//   });
// }

