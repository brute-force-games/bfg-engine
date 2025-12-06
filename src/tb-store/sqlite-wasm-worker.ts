/**
 * Web Worker for SQLite WASM with OPFS support
 * This worker runs SQLite in a separate thread, enabling OPFS persistence
 */

// Import SQLite WASM in the worker
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

let sqlite3: any = null;
let databases: Map<string, any> = new Map();

// Initialize SQLite WASM when worker starts
const wasmUrl = 'https://cdn.jsdelivr.net/npm/@sqlite.org/sqlite-wasm@3.50.4-build1/sqlite-wasm/jswasm/sqlite3.wasm';

sqlite3InitModule({
  wasmUrl: wasmUrl
}).then((sqlite3Module: any) => {
  sqlite3 = sqlite3Module;
  postMessage({ type: 'initialized' });
});

// Handle messages from main thread
self.onmessage = async (event: MessageEvent) => {
  const { type, id, dbName, mode, operation, params } = event.data;

  try {
    switch (type) {
      case 'createDatabase': {
        if (!sqlite3) {
          postMessage({ type: 'error', id, error: 'SQLite not initialized' });
          return;
        }
        const db = new sqlite3.oo1.DB(dbName, mode);
        databases.set(dbName, db);
        postMessage({ type: 'databaseCreated', id, dbName });
        break;
      }

      case 'getDatabase': {
        const db = databases.get(dbName);
        if (!db) {
          postMessage({ type: 'error', id, error: `Database ${dbName} not found` });
          return;
        }
        // Return database pointer for export
        postMessage({ type: 'databaseInfo', id, dbName, hasDb: true });
        break;
      }

      case 'exportDatabase': {
        const db = databases.get(dbName);
        if (!db || !sqlite3) {
          postMessage({ type: 'error', id, error: `Database ${dbName} not found or SQLite not initialized` });
          return;
        }
        const byteArray = sqlite3.capi.sqlite3_js_db_export(db.pointer);
        // Transfer the array buffer to main thread
        postMessage({ type: 'databaseExported', id, dbName, data: byteArray }, [byteArray.buffer]);
        break;
      }

      case 'closeDatabase': {
        const db = databases.get(dbName);
        if (db) {
          db.close();
          databases.delete(dbName);
          postMessage({ type: 'databaseClosed', id, dbName });
        }
        break;
      }

      default:
        postMessage({ type: 'error', id, error: `Unknown operation: ${type}` });
    }
  } catch (error: any) {
    postMessage({ type: 'error', id, error: error.message || String(error) });
  }
};

