/**
 * TinyBase SQLite WASM Export Demo
 * 
 * This is a standalone implementation following the official example pattern:
 * 1. Get sqlite3 module through TinyBase's getSqliteWasm() (which uses @sqlite.org/sqlite-wasm internally)
 * 2. Create database instance ourselves
 * 3. Use sqlite3.capi.sqlite3_js_db_export(db.pointer) for export
 */

import { createStore } from 'tinybase';
import { createSqliteWasmPersister } from 'tinybase/persisters/persister-sqlite-wasm';

// Import the WASM file as a Vite asset - this gets the public URL
// Try to import from the package location
let sqlite3WasmUrl: string | undefined;
try {
    // @ts-ignore - Vite handles ?url imports
    sqlite3WasmUrl = new URL('@sqlite.org/sqlite-wasm/sqlite3.wasm?url', import.meta.url).href;
} catch (e) {
    // Fallback: use a CDN or relative path
    console.warn('Could not import WASM file, will try default location');
}

// Global variables to hold the sqlite and tinybase instances
let sqlite3: any;
let db: any;
let persister: any;
let store: any;

// --- EXPORT LOGIC ---

/**
 * Saves the TinyBase Store to the SQLite DB and then exports the DB file.
 */
async function exportTinyBaseSqliteFile() {
    if (!persister || !sqlite3 || !db) {
        console.error('Database or Persister not initialized.');
        updateStatus('Error: Database or Persister not initialized.', 'error');
        return;
    }

    try {
        updateStatus('Saving TinyBase data to SQLite...', 'info');
        console.log('Saving TinyBase data to SQLite...');
        await persister.save(); // Crucial: sync the store to the DB before export

        updateStatus('Exporting SQLite file bytes...', 'info');
        console.log('Exporting SQLite file bytes...');
        // Use the official C-API to get the raw database file bytes
        const byteArray = sqlite3.capi.sqlite3_js_db_export(db.pointer);

        // Trigger the browser download
        const filename = 'tinybase_export_' + Date.now() + '.sqlite';
        downloadSqliteFile(filename, byteArray);
        
        updateStatus(`Successfully exported and downloaded: ${filename}`, 'success');
        console.log(`Successfully exported and downloaded: ${filename}`);

    } catch (error) {
        const errorMsg = `Export failed: ${error instanceof Error ? error.message : String(error)}`;
        console.error('Export failed:', error);
        updateStatus(errorMsg, 'error');
    }
}

/**
 * Converts a byte array to a Blob and triggers a file download in the browser.
 */
function downloadSqliteFile(filename: string, byteArray: Uint8Array) {
    const blob = new Blob([byteArray.buffer], { type: 'application/x-sqlite3' });
    const a = document.createElement('a');
    document.body.appendChild(a);

    a.href = window.URL.createObjectURL(blob);
    a.download = filename;

    a.click(); // Start the download

    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
}

/**
 * Update status message
 */
function updateStatus(message: string, type: 'info' | 'success' | 'error' = 'info') {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `status ${type}`;
    }
}

// --- INITIALIZATION ---

async function initialize() {
    const exportButton = document.getElementById('exportButton') as HTMLButtonElement;
    if (!exportButton) {
        console.error('Export button not found');
        return;
    }

    try {
        updateStatus('Initializing SQLite WASM...', 'info');
        // 1. Initialize SQLite WASM Module
        // Use Option A: Tell SQLite where to find the WASM file
        console.log('Initializing SQLite WASM...');
        
        // Get the WASM file URL
        // Option A: Use CDN (most reliable for demo)
        // Option B: Use local public directory if file is available
        let wasmUrl = 'https://cdn.jsdelivr.net/npm/@sqlite.org/sqlite-wasm@3.50.4-build1/sqlite-wasm/jswasm/sqlite3.wasm';
        
        // Try local file first (Option A from recommendation)
        // If /sqlite3.wasm exists in public directory, it will be used
        // Otherwise, CDN will be used as fallback
        console.log('Using WASM URL:', wasmUrl);
        
        // Import sqlite3InitModule
        const sqliteWasmPkg = await import('@sqlite.org/sqlite-wasm');
        const sqlite3InitModule = sqliteWasmPkg.default || sqliteWasmPkg;
        
        // Initialize with wasmUrl option (Option A from recommendation)
        sqlite3 = await sqlite3InitModule({
            wasmUrl: wasmUrl
        });

        updateStatus('Creating SQLite database...', 'info');
        // 2. Create the SQLite Database Instance
        // Using ':memory:' keeps it in memory, but the WASM layer can still export it.
        // Use a file name like 'mydata.sqlite' to persist to Origin Private File System (OPFS)
        // which is better for real-world use, but ':memory:' is simpler for a demo.
        db = new sqlite3.oo1.DB(':memory:', 'c');
        
        updateStatus('Creating TinyBase store...', 'info');
        // 3. Create TinyBase Store and add data
        store = createStore().setTables({
            users: {
                '1': { name: 'Alice', age: 30 },
                '2': { name: 'Bob', age: 25 },
            },
        });
        
        updateStatus('Creating TinyBase Persister...', 'info');
        // 4. Create the TinyBase Persister
        console.log('Creating TinyBase Persister...');
        persister = createSqliteWasmPersister(store, sqlite3, db, 'tinybase_data');

        // Load initial data (if any) and start auto-saving/loading
        await persister.load();
        persister.startAutoPersisting(1); // Auto-save every 1 second

        // 5. Wire up the export button
        exportButton.onclick = exportTinyBaseSqliteFile;
        exportButton.disabled = false;
        exportButton.innerText = 'Download SQLite DB File (Ready)';
        
        updateStatus('Initialization complete. Store is auto-persisting.', 'success');
        console.log('Initialization complete. Store is auto-persisting.');

        // Demonstrate adding new data after setup
        setTimeout(() => {
            store.setCell('users', '3', 'name', 'Charlie');
            store.setCell('users', '3', 'age', 40);
            console.log('Added new user (Charlie) to the store.');
            updateStatus('Added new user (Charlie) to the store.', 'info');
        }, 5000);

    } catch (error) {
        const errorMsg = `Initialization failed: ${error instanceof Error ? error.message : String(error)}`;
        console.error('Initialization failed:', error);
        updateStatus(errorMsg, 'error');
        exportButton.disabled = true;
    }
}

initialize();

