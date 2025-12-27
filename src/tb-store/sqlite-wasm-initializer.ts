// /**
//  * General SQLite WASM initializer for browser environment
//  * Provides shared initialization that can be used by any store needing SQLite persistence
//  * 
//  * Uses Web Worker for OPFS support (enables true persistence across refreshes)
//  * Falls back to main thread if worker is not available
//  */

// // Store the initialized sqlite3 module globally (for fallback)
// let sqlite3Module: any = null;
// let initializationPromise: Promise<any> | null = null;

// // Worker-based SQLite (for OPFS persistence)
// let sqliteWorker: Worker | null = null;
// let workerReady: Promise<void> | null = null;
// let messageIdCounter = 0;
// const pendingMessages = new Map<number, { resolve: (value: any) => void; reject: (error: any) => void }>();

// /**
//  * Initialize SQLite Worker for OPFS persistence
//  * Returns a promise that resolves when the worker is ready
//  */
// async function initializeSqliteWorker(): Promise<Worker> {
//   if (sqliteWorker && workerReady) {
//     await workerReady;
//     return sqliteWorker;
//   }

//   workerReady = new Promise((resolve, reject) => {
//     try {
//       // Create worker from the worker file
//       const workerUrl = new URL('./sqlite-wasm-worker.ts', import.meta.url);
//       sqliteWorker = new Worker(workerUrl, { type: 'module' });

//       // Handle worker messages
//       sqliteWorker.onmessage = (event: MessageEvent) => {
//         const { type, id, error, ...data } = event.data;

//         if (type === 'initialized') {
//           console.log('SQLite Worker initialized with OPFS support');
//           resolve();
//         } else if (type === 'error' && id) {
//           const pending = pendingMessages.get(id);
//           if (pending) {
//             pendingMessages.delete(id);
//             pending.reject(new Error(error));
//           }
//         } else if (id) {
//           const pending = pendingMessages.get(id);
//           if (pending) {
//             pendingMessages.delete(id);
//             pending.resolve(data);
//           }
//         }
//       };

//       sqliteWorker.onerror = (error) => {
//         console.error('SQLite Worker error:', error);
//         reject(error);
//         workerReady = null;
//         sqliteWorker = null;
//       };
//     } catch (error) {
//       console.warn('Failed to create SQLite Worker, will use main thread fallback:', error);
//       workerReady = null;
//       sqliteWorker = null;
//       reject(error);
//     }
//   });

//   await workerReady;
//   return sqliteWorker!;
// }

// /**
//  * Send message to worker and wait for response
//  */
// function sendWorkerMessage(message: any): Promise<any> {
//   return new Promise((resolve, reject) => {
//     if (!sqliteWorker) {
//       reject(new Error('Worker not initialized'));
//       return;
//     }

//     const id = ++messageIdCounter;
//     pendingMessages.set(id, { resolve, reject });
//     sqliteWorker!.postMessage({ ...message, id });
//   });
// }

// /**
//  * Initialize SQLite WASM module (singleton - only initializes once)
//  * Uses main thread with OpfsDb for OPFS persistence (requires COOP/COEP headers)
//  */
// export async function initializeSqliteWasm(): Promise<any> {
//   // If already initialized, return cached module
//   if (sqlite3Module) {
//     return sqlite3Module;
//   }
  
//   // If initialization is in progress, wait for it
//   if (initializationPromise) {
//     return await initializationPromise;
//   }
  
//   // Start initialization
//   initializationPromise = (async () => {
//     try {
//       const sqliteWasmPkg = await import('@sqlite.org/sqlite-wasm');
//       const sqlite3InitModule = sqliteWasmPkg.default || sqliteWasmPkg;
//       const wasmUrl = 'https://cdn.jsdelivr.net/npm/@sqlite.org/sqlite-wasm@3.50.4-build1/sqlite-wasm/jswasm/sqlite3.wasm';
      
//       // @ts-ignore
//       const sqlite3 = await sqlite3InitModule({ wasmUrl });
//       sqlite3Module = sqlite3;
//       console.log('SQLite WASM module initialized (with OPFS support)');
//       return sqlite3;
//     } catch (error) {
//       console.error('Failed to initialize SQLite WASM:', error);
//       initializationPromise = null;
//       throw error;
//     }
//   })();
  
//   return await initializationPromise;
// }

// /**
//  * Check if OpfsDb is available (for OPFS persistence)
//  */
// export function hasOpfsDb(): boolean {
//   return sqlite3Module?.oo1?.OpfsDb != null;
// }

// /**
//  * Get the initialized sqlite3 module (returns null if not initialized)
//  */
// export function getSqlite3Module(): any {
//   return sqlite3Module;
// }

// /**
//  * Create a database instance using the shared sqlite3 module
//  * Uses OpfsDb for OPFS persistence if available, otherwise regular DB
//  * @param dbName - Name of the database file
//  * @param mode - Database mode ('c' for create, etc.)
//  */
// export async function createSqliteDatabase(dbName: string, mode: string = 'c'): Promise<any> {
//   const sqlite3 = await initializeSqliteWasm();
  
//   // Check if OpfsDb is available
//   // Note: OpfsDb requires worker thread, but we can try it anyway
//   // If it fails, it will fall back to regular DB which uses OPFS via worker if available
//   if (sqlite3.oo1?.OpfsDb) {
//     try {
//       // OpfsDb might not work in main thread, but let's try
//       const db = new sqlite3.oo1.OpfsDb(dbName);
      
//       // Configure SQLite to use DELETE journal mode instead of WAL to avoid cleanup errors
//       try {
//         db.exec('PRAGMA journal_mode = DELETE;');
//       } catch (e) {
//         // Ignore if pragma fails
//         console.warn('Could not set journal mode on OpfsDb:', e);
//       }
      
//       console.log(`Created OPFS database: ${dbName} (OpfsDb)`);
//       return db;
//     } catch (error: any) {
//       // OpfsDb requires worker thread - fall back to regular DB
//       // Regular DB with filename will still try to use OPFS if VFS is installed
//       console.warn('OpfsDb not available (requires worker), using regular DB:', error?.message || error);
//     }
//   }
  
//   // Use regular DB - with COOP/COEP headers, it may still use OPFS internally
//   // if the sqlite3_vfs is installed (though it warns about needing worker)
//   const db = new sqlite3.oo1.DB(dbName, mode);
  
//   // Configure SQLite to use DELETE journal mode instead of WAL to avoid cleanup errors
//   // This prevents SQLITE_IOERR_DELETE_NOENT errors when SQLite tries to delete non-existent WAL files
//   try {
//     db.exec('PRAGMA journal_mode = DELETE;');
//   } catch (e) {
//     // Ignore if pragma fails - database might not support it
//     console.warn('Could not set journal mode:', e);
//   }
  
//   console.log(`Created database: ${dbName} (regular DB, may use OPFS if VFS installed)`);
//   return db;
// }

// /**
//  * Export database from worker
//  */
// export async function exportDatabaseFromWorker(dbName: string): Promise<Uint8Array | null> {
//   if (!sqliteWorker) {
//     return null;
//   }
  
//   try {
//     const result = await sendWorkerMessage({ type: 'exportDatabase', dbName });
//     return result.data || null;
//   } catch (error) {
//     console.error('Failed to export database from worker:', error);
//     return null;
//   }
// }

// /**
//  * Create a SQLite WASM persister for any TinyBase store
//  * This is a convenience function that handles the common pattern:
//  * 1. Initialize SQLite WASM (shared, singleton)
//  * 2. Create database instance
//  * 3. Create and configure persister with auto-load/save
//  * 
//  * @param store - The TinyBase store to persist
//  * @param tableName - The table name in the store to persist
//  * @param dbName - The database file name (e.g., 'my-data.db')
//  * @param options - Optional configuration
//  * @returns The configured persister
//  */
// export async function createSqlitePersisterForStore(
//   store: any,
//   tableName: string,
//   dbName: string,
//   options: {
//     autoLoad?: boolean;
//     autoSave?: boolean;
//     loadImmediately?: boolean;
//     useIndexedDBBackup?: boolean; // Use IndexedDB to backup SQLite file for persistence
//   } = {}
// ): Promise<any> {
//   const { createSqliteWasmPersister } = await import('tinybase/persisters/persister-sqlite-wasm');
//   const { loadDatabaseFromIndexedDB, saveDatabaseToIndexedDB } = await import('./indexeddb-sqlite-backup');
  
//   // Initialize SQLite WASM module (shared, singleton)
//   const sqlite3 = await initializeSqliteWasm();
  
//   // If using IndexedDB backup, try to restore from backup first
//   const { useIndexedDBBackup = true, loadImmediately = true } = options;
//   let backupBytes: Uint8Array | null = null;
//   if (useIndexedDBBackup && loadImmediately) {
//     try {
//       backupBytes = await loadDatabaseFromIndexedDB(dbName);
//       if (backupBytes && backupBytes.length > 0) {
//         console.log(`Found IndexedDB backup for ${dbName} (${backupBytes.length} bytes)`);
//       }
//     } catch (error) {
//       console.warn('Failed to load from IndexedDB backup:', error);
//     }
//   }
  
//   // Create database instance (use let so we can reassign if restoring from backup)
//   // Note: createSqliteDatabase already sets journal_mode = DELETE
//   let db = await createSqliteDatabase(dbName, 'c');
  
//   // If we have a backup, restore it to the database before creating persister
//   // Note: SQLite WASM doesn't have a direct "import bytes" API, so we'll use
//   // the backup API to copy from a temporary database
//   if (backupBytes && backupBytes.length > 0) {
//     try {
//       // Close the current database
//       db.close();
      
//       // Create a temporary in-memory database and try to restore backup to it
//       // Then use SQLite backup API to copy to the file database
//       const tempDb = new sqlite3.oo1.DB(':memory:', 'c');
      
//       // Try to use sqlite3_js_db_import if available
//       if (sqlite3.capi?.sqlite3_js_db_import) {
//         sqlite3.capi.sqlite3_js_db_import(tempDb.pointer, backupBytes);
        
//         // Now copy from temp to file database using backup API
//         db = new sqlite3.oo1.DB(dbName, 'c');
//         const backup = sqlite3.capi.sqlite3_backup_init(db.pointer, 'main', tempDb.pointer, 'main');
//         if (backup) {
//           sqlite3.capi.sqlite3_backup_step(backup, -1);
//           sqlite3.capi.sqlite3_backup_finish(backup);
//         }
//         tempDb.close();
//         console.log(`Restored ${dbName} from IndexedDB backup (${backupBytes.length} bytes)`);
//       } else {
//         // sqlite3_js_db_import not available - try alternative restoration method
//         // Use OPFS or File System Access API to write bytes directly to database file
//         try {
//           // Try to write bytes using OPFS (Origin Private File System)
//           const opfsRoot = await navigator.storage.getDirectory();
//           const dbFile = await opfsRoot.getFileHandle(dbName, { create: true });
//           const writable = await dbFile.createWritable();
//           await writable.write(backupBytes);
//           await writable.close();
          
//           // Now open the database from the file we just wrote
//           db = new sqlite3.oo1.DB(dbName, 'c');
//           console.log(`Restored ${dbName} from IndexedDB backup using OPFS (${backupBytes.length} bytes)`);
//           tempDb.close();
//         } catch (opfsError) {
//           // OPFS write failed, try alternative: use SQLite's virtual table or direct file write
//           console.warn('OPFS write failed, trying direct database restoration:', opfsError);
          
//           // Last resort: create fresh database and note that backup is available for download
//           // The data won't auto-restore, but users can download it
//           db = new sqlite3.oo1.DB(dbName, 'c');
//           console.warn('sqlite3_js_db_import not available and OPFS write failed - backup stored in IndexedDB for download only');
//           tempDb.close();
//         }
//       }
//     } catch (error) {
//       console.warn('Failed to restore from IndexedDB backup, using fresh database:', error);
//       // Recreate database if restore failed
//       db = new sqlite3.oo1.DB(dbName, 'c');
//     }
//   }
  
//   // Create persister - TinyBase's createSqliteWasmPersister signature:
//   // createSqliteWasmPersister(store, sqlite3, db, tableName)
//   const persister = createSqliteWasmPersister(
//     store,
//     sqlite3,
//     db,
//     tableName
//   );
  
//   // Configure auto-load/save (default: both enabled)
//   const { autoLoad = true, autoSave = true } = options;
  
//   if (autoLoad) {
//     persister.startAutoLoad();
//   }
  
//   if (autoSave) {
//     persister.startAutoSave();
    
//     // If using IndexedDB backup, also save to IndexedDB periodically
//     if (useIndexedDBBackup) {
//       // Set up periodic backup to IndexedDB
//       // We'll backup after each auto-save (with a small delay to ensure DB is written)
//       let backupTimeout: ReturnType<typeof setTimeout> | null = null;
//       const scheduleBackup = () => {
//         if (backupTimeout) clearTimeout(backupTimeout);
//         backupTimeout = setTimeout(async () => {
//           try {
//             if (sqlite3.capi && db.pointer) {
//               const dbBytes = sqlite3.capi.sqlite3_js_db_export(db.pointer);
//               if (dbBytes && dbBytes instanceof Uint8Array) {
//                 await saveDatabaseToIndexedDB(dbName, dbBytes);
//                 console.log(`Backed up ${dbName} to IndexedDB (${dbBytes.length} bytes)`);
//               }
//             }
//           } catch (error) {
//             console.warn('Failed to backup to IndexedDB:', error);
//           }
//         }, 500); // Small delay to ensure DB is written
//       };
      
//       // Listen to store changes to trigger backup
//       store.addDidFinishTransactionListener(() => {
//         scheduleBackup();
//       });
      
//       // Also backup immediately after initial load
//       if (loadImmediately) {
//         setTimeout(() => scheduleBackup(), 1000);
//       }
//     }
//   }
  
//   // Load existing data immediately if requested
//   if (loadImmediately) {
//     await persister.load();
    
//     // If we have a backup but couldn't restore it, the database might be empty
//     // In that case, we could try to restore from backup, but without sqlite3_js_db_import
//     // we can't do it automatically. The backup is available for download though.
//     if (backupBytes && backupBytes.length > 0) {
//       // Check if database is empty and backup exists
//       // If so, log a message that backup is available
//       try {
//         // Check if store has any data
//         const tableIds = store.getTableIds(tableName);
//         const rowCount = tableIds?.length || 0;
//         if (rowCount === 0) {
//           console.log(`Database appears empty, but IndexedDB backup exists (${backupBytes.length} bytes). Backup available for download via export function.`);
//         }
//       } catch (e) {
//         // Ignore
//       }
//     }
//   }
  
//   // Check if we're using OPFS (OpfsDb) or regular DB
//   const isOpfsDb = sqlite3.oo1?.OpfsDb && db.constructor === sqlite3.oo1.OpfsDb;
//   const dbType = isOpfsDb ? 'OPFS' : (useIndexedDBBackup ? 'IndexedDB-backed' : 'regular');
//   console.log(`SQLite persister created for ${tableName} (${dbName}) [${dbType}]`);
//   return persister;
// }

