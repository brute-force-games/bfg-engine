/**
 * Generic browser-specific SQLite database export functionality
 * Uses SQLite WASM and OPFS (Origin Private File System)
 * 
 * Based on the official @sqlite.org/sqlite-wasm example pattern:
 * 1. Import sqlite3InitModule directly
 * 2. Create database instance ourselves
 * 3. Use sqlite3.capi.sqlite3_js_db_export(db.pointer) for export
 */

/**
 * Export a SQLite database from a browser SQLite WASM persister
 * @param persister - The TinyBase SQLite WASM persister
 * @param dbName - The database file name (e.g., 'my-data.db')
 * @param tableName - The table name to verify (optional, for debugging)
 * @param getSqliteReferences - Optional function to get sqlite3 and db references
 * @returns The database file as Uint8Array, or null if export fails
 */
export async function exportSqliteDatabaseBrowser(
  persister: any,
  dbName: string,
  tableName?: string,
  getSqliteReferences?: () => { sqlite3: any; db: any } | null
): Promise<Uint8Array | null> {
  // CRITICAL: We need to ensure data is saved to the SQLite database before export
  let sqlite3: any = null;
  let db: any = null;
  
  // If persister exists, save current data and get database references
  if (persister) {
    try {
      // Force save to ensure all current data is in SQLite
      await persister.save();
      console.log('Persister saved successfully - data flushed to SQLite database');
      
      // Try to get db from persister internal state
      // @ts-ignore - accessing internal persister state
      const persisterDb = persister.db || (persister as any)._db;
      // @ts-ignore
      const persisterSqlite3 = persister.sqlite3 || (persister as any)._sqlite3;
      
      if (persisterDb && persisterSqlite3) {
        db = persisterDb;
        sqlite3 = persisterSqlite3;
        console.log('Using database and sqlite3 from persister');
      } else if (getSqliteReferences) {
        // Try to get from stored references
        const refs = getSqliteReferences();
        if (refs && refs.sqlite3 && refs.db) {
          db = refs.db;
          sqlite3 = refs.sqlite3;
          console.log('Using database and sqlite3 from stored references');
        }
      }
      
      // Verify data was actually written to the database we're exporting
      if (db && tableName) {
        try {
          const verifyResult = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
          let tableNames: string[] = [];
          if (Array.isArray(verifyResult)) {
            for (const result of verifyResult) {
              if (result.columns && result.values) {
                const nameIndex = result.columns.indexOf('name');
                if (nameIndex >= 0) {
                  for (const row of result.values) {
                    if (row[nameIndex]) {
                      tableNames.push(String(row[nameIndex]));
                    }
                  }
                }
              }
            }
          }
          console.log(`Database has ${tableNames.length} table(s) after save:`, tableNames);
          
          if (tableNames.includes(tableName)) {
            const countResult = db.exec(`SELECT COUNT(*) as count FROM "${tableName}"`);
            if (Array.isArray(countResult) && countResult.length > 0) {
              const firstResult = countResult[0];
              if (firstResult.values && firstResult.values.length > 0) {
                const count = firstResult.values[0][0] || 0;
                console.log(`${tableName} table has ${count} row(s)`);
              }
            }
          } else {
            console.warn(`${tableName} table not found in database after save!`);
          }
        } catch (e) {
          console.warn('Could not verify database after save:', e);
        }
      }
    } catch (e) {
      console.warn('Could not save persister:', e);
    }
  }
  
  // If we don't have db/sqlite3 yet, try to initialize
  if (!sqlite3 || !db) {
    try {
      const { initializeSqliteWasm, createSqliteDatabase } = await import('../../../tb-store/sqlite-wasm-initializer');
      sqlite3 = await initializeSqliteWasm();
      db = await createSqliteDatabase(dbName, 'c');
      console.log('Initialized new database instance for export');
    } catch (e) {
      console.warn('Could not initialize SQLite for export:', e);
    }
  }
  
  // PRIMARY METHOD: Use SQLite WASM C API to export database directly
  if (sqlite3 && db && sqlite3.capi && db.pointer) {
    try {
      console.log('Exporting SQLite file bytes using sqlite3_js_db_export...');
      const byteArray = sqlite3.capi.sqlite3_js_db_export(db.pointer);
      
      if (byteArray && byteArray instanceof Uint8Array) {
        console.log(`Successfully exported database using sqlite3_js_db_export (${byteArray.length} bytes)`);
        return byteArray;
      } else {
        console.warn('sqlite3_js_db_export returned invalid data:', typeof byteArray);
      }
    } catch (e) {
      console.error('Export via sqlite3_js_db_export failed:', e);
      console.error('Error stack:', (e as Error).stack);
    }
  } else {
    console.warn('SQLite WASM module or database not initialized for export', {
      hasSqlite3: !!sqlite3,
      hasDb: !!db,
      hasCapi: !!(sqlite3 && sqlite3.capi),
      hasPointer: !!(db && db.pointer)
    });
  }
  
  // FALLBACK: Try OPFS file access as last resort
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.getDirectory) {
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
          console.log(`Found database at OPFS path: ${path}`);
          return new Uint8Array(arrayBuffer);
        } catch (e) {
          // Try next path
          continue;
        }
      }
      
      console.warn('Database file not found in OPFS at any expected location');
    } catch (opfsError) {
      console.warn('OPFS access failed:', opfsError);
    }
  }
  
  console.warn('Could not export database file. Persister may not be initialized or database structure is unexpected.');
  return null;
}

