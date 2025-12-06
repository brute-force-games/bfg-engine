// Browser-compatible CLI runner
// Create browser-compatible process object before imports
if (typeof (globalThis as any).process === 'undefined') {
  (globalThis as any).process = {
    argv: ['node', 'bfg'],
    cwd: () => '/',
    stdout: {
      columns: 80,
      isTTY: false,
    },
    stderr: {
      columns: 80,
      isTTY: false,
    },
    exit: (code?: number) => {
      // In browser, just log instead of exiting
      console.log(`Process would exit with code ${code || 0}`);
    }
  };
}

import { configureYargsCommands } from './cli-yargs-config';

import { NewHostOps } from '../v2/new-host-ops/new-host-ops';
import { LocalTbPersistenceOps } from '../v2/new-persistence-ops/local-tb-persistence-ops';
import { TxOps } from '../v2/relay-ops/tx-ops';
import { RxOps } from '../v2/relay-ops/rx-ops';
import { createBfgGameOpsForConsoleInstance } from '../v2/game-ops/game-ops-for-console-impl';
import { GuessNumberGameMetadata } from '@bfg-engine/example-games/game-guess-number/game-box';
import { createCliPlayerOps } from '@bfg-engine/v2/player-ops/cli-player-ops';
import { createCliWatcherOps } from '@bfg-engine/v2/watcher-ops/cli-watcher-ops';
import { registerGame } from '../v2/new-game-registry/new-game-registry';

// Setup game ops
registerGame(GuessNumberGameMetadata);
const playerOps = createCliPlayerOps();
const watcherOps = createCliWatcherOps();
const gameOps = createBfgGameOpsForConsoleInstance(
  NewHostOps,
  LocalTbPersistenceOps,
  TxOps,
  RxOps,
  playerOps,
  watcherOps
);

const output = document.getElementById('output')!;
const commandInput = document.getElementById('commandInput') as HTMLInputElement;
const executeBtn = document.getElementById('executeBtn')!;
const helpBtn = document.getElementById('helpBtn')!;
const downloadDbBtn = document.getElementById('downloadDbBtn')!;
const dbFileInput = document.getElementById('dbFileInput') as HTMLInputElement;
const helpModal = document.getElementById('helpModal')!;
const helpContent = document.getElementById('helpContent')!;
const closeHelp = document.getElementById('closeHelp')!;

// Capture console output
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

function addOutput(text: string, type: 'normal' | 'error' | 'success' = 'normal') {
  const line = document.createElement('div');
  line.className = `output-line ${type}`;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function captureConsole() {
  // Override console methods to capture output and display it in the web UI
  console.log = (...args: any[]) => {
    originalLog(...args);
    const message = args.map(arg => {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
    addOutput(message, 'normal');
  };
  console.error = (...args: any[]) => {
    originalError(...args);
    const message = args.map(arg => {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
    addOutput(message, 'error');
  };
  console.warn = (...args: any[]) => {
    originalWarn(...args);
    const message = args.map(arg => {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
    addOutput(message, 'error');
  };
}

function restoreConsole() {
  console.log = originalLog;
  console.error = originalError;
  console.warn = originalWarn;
}

// Removed parseCommand - now using yargs directly for consistency with cli.ts

// Helper function to parse input string into argv array for yargs
// Handles quoted strings and basic argument parsing
function parseInputToArgv(input: string): string[] {
  const argv = ['bfg']; // yargs expects script name as first arg
  
  // Simple tokenizer that handles quoted strings
  const tokens: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    
    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false;
      quoteChar = '';
    } else if (char === ' ' && !inQuotes) {
      if (current.trim()) {
        tokens.push(current.trim());
        current = '';
      }
    } else {
      current += char;
    }
  }
  
  if (current.trim()) {
    tokens.push(current.trim());
  }
  
  return [...argv, ...tokens];
}

async function executeCommand(input: string) {
  addOutput(`bfg$ ${input}`, 'normal');
  
  captureConsole();
  
  try {
    // Ensure process object is fully set up before yargs runs
    const proc = (globalThis as any).process;
    if (!proc.stdout) {
      proc.stdout = { columns: 80, isTTY: false };
    }
    if (!proc.stderr) {
      proc.stderr = { columns: 80, isTTY: false };
    }
    // Override process.exit to not actually exit in browser
    // Store the original if it exists, but always override
    const originalExit = proc.exit;
    let exitCalled = false;
    let exitCode: number | undefined = undefined;
    proc.exit = (code?: number) => {
      // Mark that exit was called, but don't actually exit
      exitCalled = true;
      exitCode = code;
      
      // In browser, just log instead of exiting
      // Don't treat exit(0) as an error - it's normal for successful commands
      if (code !== undefined && code !== 0) {
        addOutput(`Process would exit with code ${code}`, 'error');
      }
      // Don't actually exit - just return
      // Note: We keep console captured until restoreConsole() is called
      return;
    };
    
    // Parse input string to argv array
    const argv = parseInputToArgv(input);
    
    // Import yargs and parse the command
    const yargsModule = await import('yargs');
    const yargs = yargsModule.default;
    
    // Parse and execute using yargs (same as cli.ts)
    // Note: The handlers use console.log which is captured by captureConsole()
    // The handlers will execute asynchronously, so we need to keep console captured
    try {
      const yargsInstance = configureYargsCommands(yargs(argv), gameOps);
      // Configure for browser environment
      yargsInstance.exitProcess(false); // Don't exit - we're in a browser
      yargsInstance.help(); // Enable help but don't show automatically
      
      // Parse the command - this validates and returns the parsed arguments
      // IMPORTANT: With exitProcess(false), yargs should still call handlers automatically
      // However, if handlers aren't executing, we may need to manually invoke them
      const result = await yargsInstance.parseAsync();
      
      // If handler wasn't called (no console output), manually invoke it
      // This is a workaround for yargs not executing handlers with exitProcess(false)
      if (result && result._ && result._.length > 1) {
        const command = result._[1];
        const { handleAddUser, handleListUsers, handleRemoveUser, handleUserDetails, handleClearAllUsers } = await import('./cli-commands');
        
        // Manually call the appropriate handler based on the command
        switch (command) {
          case 'add-user':
            await handleAddUser(result);
            break;
          case 'list-users':
            await handleListUsers(result);
            break;
          case 'remove-user':
            await handleRemoveUser(result);
            break;
          case 'user-details':
            await handleUserDetails(result);
            break;
          case 'delete-all-users':
            await handleClearAllUsers(result);
            break;
          // Game commands are handled by their own command factories
          case 'init':
          case 'first-step':
          case 'step':
            // These are handled by yargs automatically via createInitCommand, etc.
            break;
        }
      }
    } catch (parseError: any) {
      // If yargs throws, it might be a validation error or handler error
      console.error('[executeCommand] Yargs parse/handler error:', parseError);
      // Re-throw to be caught by outer catch block
      throw parseError;
    }
    
    // Give handlers time to complete and flush any console output
    // This is important because handlers are async and might call process.exit(0)
    // which we've overridden, but we still need to wait for their output
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // If exit was called, handlers have completed
    // Ensure any remaining console output is flushed
    if (exitCalled) {
      // Force a flush by waiting a bit more
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  } catch (error: any) {
    // yargs throws errors for invalid commands/options
    // Check if it's a help request
    if (error.message && (error.message.includes('help') || input.trim() === '--help' || input.trim() === '-h')) {
      await showHelp();
    } else {
      addOutput(`Error: ${error.message || 'Invalid command or options'}`, 'error');
      addOutput('Type "bfg --help" for available commands', 'normal');
    }
  } finally {
    // Restore console after handlers have had time to output
    await new Promise(resolve => setTimeout(resolve, 50));
    restoreConsole();
  }
}

executeBtn.addEventListener('click', () => {
  const input = commandInput.value.trim();
  if (input) {
    executeCommand(input).catch((error) => {
      console.error('Error executing command:', error);
      addOutput(`Error: ${error.message || error}`, 'error');
    });
    commandInput.value = '';
  }
});

commandInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const input = commandInput.value.trim();
    if (input) {
      executeCommand(input).catch((error) => {
        console.error('Error executing command:', error);
        addOutput(`Error: ${error.message || error}`, 'error');
      });
      commandInput.value = '';
    }
  }
});

// Function to create yargs instance with all commands (for help generation)
async function createYargsInstance() {
  // Ensure process object is fully set up
  const proc = (globalThis as any).process;
  if (!proc.argv) {
    proc.argv = ['node', 'bfg'];
  }
  if (!proc.cwd) {
    proc.cwd = () => '/';
  }
  if (!proc.stdout) {
    proc.stdout = { columns: 80, isTTY: false };
  }
  if (!proc.stderr) {
    proc.stderr = { columns: 80, isTTY: false };
  }
  
  // Dynamic import to avoid process access at module load time
  const yargsModule = await import('yargs');
  const yargs = yargsModule.default;
  
  // Use shared configuration with dummy handlers for help generation
  return configureYargsCommands(yargs(['--help']), gameOps);
}

// Function to get help text dynamically from yargs
async function getHelpText(): Promise<string> {
  // Capture console output to get help text from yargs
  const helpLines: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  
  console.log = (...args: any[]) => {
    helpLines.push(args.join(' '));
  };
  console.error = (...args: any[]) => {
    helpLines.push(args.join(' '));
  };
  
  try {
    const yargsInstance = await createYargsInstance();
    // showHelp() writes to console, which we're capturing
    yargsInstance.showHelp();
  } catch (error: any) {
    // If showHelp fails, try getHelp() as fallback
    try {
      const yargsInstance = await createYargsInstance();
      const help = (yargsInstance as any).getHelp();
      if (typeof help === 'string') {
        helpLines.push(help);
      } else if (help && typeof help.then === 'function') {
        const resolvedHelp = await help;
        if (typeof resolvedHelp === 'string') {
          helpLines.push(resolvedHelp);
        }
      }
    } catch (e2) {
      throw new Error(`Failed to generate help text: ${error.message || error}`);
    }
  } finally {
    // Restore console
    console.log = originalLog;
    console.error = originalError;
  }
  
  if (helpLines.length === 0) {
    throw new Error('Unable to generate help text from yargs');
  }
  
  return helpLines.join('\n');
}

// Show help modal
async function showHelp() {
  if (!helpModal || !helpContent) {
    console.error('Help modal elements not found');
    return;
  }
  
  helpContent.textContent = 'Loading help...';
  helpModal.style.display = 'block';
  try {
    const helpText = await getHelpText();
    helpContent.textContent = helpText;
  } catch (error: any) {
    const errorMsg = `Error generating help: ${error.message || error}\n\nPlease check the browser console for details.`;
    helpContent.textContent = errorMsg;
    console.error('Error generating help:', error);
    console.error('Error stack:', error.stack);
  }
}

// Close help modal
function closeHelpModal() {
  helpModal.style.display = 'none';
}

// // List database files function
// async function listDatabaseFiles() {
//   try {
//     addOutput('Scanning OPFS for database files...', 'normal');
    
//     if (!navigator.storage || !navigator.storage.getDirectory) {
//       addOutput('Error: OPFS (Origin Private File System) is not available in this browser', 'error');
//       return;
//     }
    
//     const opfsRoot = await navigator.storage.getDirectory();
//     const files: Array<{ path: string; size: number }> = [];
    
//     // Recursively scan OPFS for all files
//     async function scanDirectory(dir: FileSystemDirectoryHandle, path: string = '') {
//       try {
//         // @ts-ignore - entries() exists but may not be in TypeScript definitions
//         for await (const [name, handle] of dir.entries()) {
//           const currentPath = path ? `${path}/${name}` : name;
          
//           if (handle.kind === 'file') {
//             try {
//               const file = await (handle as FileSystemFileHandle).getFile();
//               files.push({
//                 path: currentPath,
//                 size: file.size
//               });
//             } catch (e) {
//               console.warn(`Could not get file info for ${currentPath}:`, e);
//             }
//           } else if (handle.kind === 'directory') {
//             await scanDirectory(handle as FileSystemDirectoryHandle, currentPath);
//           }
//         }
//       } catch (e) {
//         console.warn(`Error scanning directory ${path}:`, e);
//       }
//     }
    
//     await scanDirectory(opfsRoot);
    
//     if (files.length === 0) {
//       addOutput('No database files found in OPFS', 'normal');
//       addOutput('(This is expected if the SQLite WASM persister has not been initialized)', 'normal');
//     } else {
//       addOutput(`Found ${files.length} file(s) in OPFS:`, 'success');
//       addOutput('', 'normal');
      
//       // Sort by path
//       files.sort((a, b) => a.path.localeCompare(b.path));
      
//       // Format file sizes
//       function formatSize(bytes: number): string {
//         if (bytes === 0) return '0 B';
//         const k = 1024;
//         const sizes = ['B', 'KB', 'MB', 'GB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
//       }
      
//       // Display files in a table-like format
//       const maxPathLength = Math.max(...files.map(f => f.path.length), 20);
//       files.forEach(file => {
//         const pathPadded = file.path.padEnd(maxPathLength);
//         const sizeFormatted = formatSize(file.size).padStart(10);
//         addOutput(`${pathPadded}  ${sizeFormatted}`, 'normal');
//       });
      
//       addOutput('', 'normal');
//       const totalSize = files.reduce((sum, f) => sum + f.size, 0);
//       addOutput(`Total: ${formatSize(totalSize)}`, 'normal');
//     }
//   } catch (error: any) {
//     addOutput(`Error listing database files: ${error.message || error}`, 'error');
//     console.error('Error listing database files:', error);
//   }
// }

// Download database function
async function downloadDatabase() {
  try {
    addOutput('Preparing database download...', 'normal');
    
    const { getPlayerProfilesDatabaseFile, PLAYER_PROFILES_DB_NAME } = await import('../tb-store/player-profile-store');
    const dbData = await getPlayerProfilesDatabaseFile();
    
    if (!dbData) {
      addOutput('Error: Could not retrieve database file', 'error');
      return;
    }
    
    // Create a blob and download it
    // Create a new Uint8Array to ensure we have a proper ArrayBuffer
    const arrayBuffer = new Uint8Array(dbData).buffer;
    const blob = new Blob([arrayBuffer], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5); // Format: YYYY-MM-DDTHH-MM-SS
    const baseName = PLAYER_PROFILES_DB_NAME || 'player_profiles.db';
    const nameWithoutExt = baseName.replace(/\.db$/, '');
    const filename = `${nameWithoutExt}_${timestamp}.db`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addOutput(`✓ Database downloaded: ${filename}`, 'success');
  } catch (error: any) {
    addOutput(`Error downloading database: ${error.message || error}`, 'error');
    console.error('Error downloading database:', error);
  }
}

// Upload/import database function
async function uploadDatabase(file: File) {
  try {
    addOutput(`Reading database file: ${file.name}...`, 'normal');
    
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const dbBytes = new Uint8Array(arrayBuffer);
    
    addOutput(`File read: ${dbBytes.length} bytes`, 'normal');
    
    // Get SQLite references
    const { ensurePlayerProfileSqliteInitialized } = await import('../tb-store/player-profile-store');
    await ensurePlayerProfileSqliteInitialized();
    
    const { getPlayerProfileSqliteReferences: getSqliteRefs } = await import('../v2/new-persistence-ops/tb-store/player-profile-browser-persistence');
    const refs = getSqliteRefs();
    
    if (!refs || !refs.sqlite3 || !refs.db) {
      addOutput('Error: SQLite database not initialized', 'error');
      return;
    }
    
    const { sqlite3, db } = refs;
    const { PLAYER_PROFILES_DB_NAME } = await import('../tb-store/player-profile-store');
    
    addOutput('Importing database...', 'normal');
    
    // Write the database file directly to OPFS
    addOutput('Writing database to OPFS...', 'normal');
    
    // Close the current database first
    try {
      db.close();
      addOutput('Closed current database', 'normal');
    } catch (e) {
      console.warn('Error closing database (may already be closed):', e);
    }
    
    // Write the database bytes to OPFS
    try {
      const opfsRoot = await navigator.storage.getDirectory();
      
      // Remove the old file if it exists
      try {
        await opfsRoot.removeEntry(PLAYER_PROFILES_DB_NAME);
        addOutput('Removed old database file from OPFS', 'normal');
      } catch (e) {
        // File might not exist, that's okay
      }
      
      // Write the new database file
      const dbFile = await opfsRoot.getFileHandle(PLAYER_PROFILES_DB_NAME, { create: true });
      const writable = await dbFile.createWritable();
      await writable.write(dbBytes);
      await writable.close();
      addOutput(`Database file written to OPFS (${dbBytes.length} bytes)`, 'normal');
      
      // Give OPFS time to flush and ensure the file is fully written
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify the file was written correctly by reading it back
      const verifyFile = await opfsRoot.getFileHandle(PLAYER_PROFILES_DB_NAME);
      const verifyFileData = await verifyFile.getFile();
      const verifyBytes = new Uint8Array(await verifyFileData.arrayBuffer());
      addOutput(`Verified file size: ${verifyBytes.length} bytes (expected: ${dbBytes.length})`, verifyBytes.length === dbBytes.length ? 'success' : 'error');
      
      if (verifyBytes.length !== dbBytes.length) {
        addOutput('Error: File size mismatch! The database file may be corrupted.', 'error');
        throw new Error('File size mismatch after write');
      }
    } catch (opfsError: any) {
      addOutput(`Error writing to OPFS: ${opfsError.message}`, 'error');
      throw opfsError;
    }
    
    // The core issue: SQLite WASM uses its own VFS to access OPFS files, and it can't
    // read files we write using the browser's File System Access API.
    // 
    // Solution: Since we can't import bytes directly, we need to:
    // 1. Verify the file is a valid SQLite database (check header)
    // 2. Use a workaround: Read the database using a different method
    // 
    // Actually, wait - the CLI database might be in a different format or location.
    // Let's check if the file is actually a valid SQLite database first.
    
    addOutput('Verifying SQLite file format...', 'normal');
    
    // SQLite files start with a specific header: "SQLite format 3\000"
    const sqliteHeader = new TextDecoder().decode(dbBytes.slice(0, 16));
    const isValidSqlite = sqliteHeader.startsWith('SQLite format 3');
    addOutput(`File header: ${isValidSqlite ? 'Valid SQLite format' : 'Invalid or corrupted'}`, isValidSqlite ? 'success' : 'error');
    
    if (!isValidSqlite) {
      addOutput('Error: The uploaded file does not appear to be a valid SQLite database.', 'error');
      addOutput('Please ensure you are uploading a .db or .sqlite file created by SQLite.', 'error');
      return;
    }
    
    // The problem: SQLite WASM can't read files we write to OPFS using File System Access API
    // because it uses its own VFS. We need to use SQLite WASM's own file writing mechanism.
    // 
    // Workaround: Since we can't import bytes directly, we'll need to:
    // 1. Use a JavaScript SQLite parser to read the file (complex)
    // 2. Or, use a different approach: Create an in-memory database and try to restore
    // 
    // Actually, let's try using the fact that SQLite WASM might be able to read the file
    // if we use OpfsDb instead of regular DB. But OpfsDb requires a worker thread.
    // 
    // Better approach: Since the CLI database might have multiple tables, let's try to
    // open it and see what tables it actually has, then extract the playerProfiles data.
    
    addOutput('Attempting to read database using SQLite WASM...', 'normal');
    
    // Try using OpfsDb if available (it might be able to read the file we wrote)
    let sourceDb: any = null;
    let importSuccess = false;
    
    try {
      // First, try using OpfsDb which might be able to read the file
      if (sqlite3.oo1?.OpfsDb) {
        addOutput('Trying OpfsDb to read the file...', 'normal');
        try {
          const opfsDb = new sqlite3.oo1.OpfsDb(PLAYER_PROFILES_DB_NAME);
          
          // Check if it can read the file
          const tables = opfsDb.exec({
            returnValue: 'resultRows',
            sql: "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
          });
          const tableNames = tables.map((row: any) => row.name);
          addOutput(`OpfsDb found tables: ${tableNames.join(', ') || 'none'}`, 'normal');
          
          if (tableNames.includes('playerProfiles')) {
            sourceDb = opfsDb;
            importSuccess = true;
            addOutput('Successfully opened database using OpfsDb', 'success');
          } else {
            opfsDb.close();
            addOutput('OpfsDb opened file but no playerProfiles table found', 'error');
          }
        } catch (opfsError: any) {
          addOutput(`OpfsDb failed: ${opfsError.message}`, 'error');
          console.warn('OpfsDb error:', opfsError);
        }
      }
      
      // If OpfsDb didn't work, use sql.js to parse the uploaded file directly
      if (!importSuccess) {
        addOutput('Using sql.js to parse the uploaded database file...', 'normal');
        
        try {
          // Load sql.js from CDN instead of bundling it
          // This avoids Vite bundling issues with sql.js
          addOutput('Loading sql.js from CDN...', 'normal');
          
          // Check if sql.js is already loaded globally
          // sql.js from CDN exposes initSqlJs in different ways depending on the build
          let initSqlJs: any = (window as any).initSqlJs || (window as any).SQL;
          
          if (!initSqlJs || typeof initSqlJs !== 'function') {
            // Load sql.js script from CDN
            await new Promise<void>((resolve, reject) => {
              // Check if script already exists
              const existingScript = document.querySelector('script[data-sqljs]');
              if (existingScript) {
                initSqlJs = (window as any).initSqlJs || (window as any).SQL;
                if (typeof initSqlJs === 'function') {
                  resolve();
                  return;
                }
              }
              
              const script = document.createElement('script');
              script.setAttribute('data-sqljs', 'true');
              // Use the UMD build which exposes initSqlJs globally
              script.src = 'https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-wasm.js';
              script.onload = () => {
                // Try multiple ways sql.js might expose itself
                initSqlJs = (window as any).initSqlJs || (window as any).SQL || (window as any).default;
                
                // If it's an object, try to get initSqlJs from it
                if (initSqlJs && typeof initSqlJs !== 'function') {
                  initSqlJs = initSqlJs.initSqlJs || initSqlJs.default;
                }
                
                if (typeof initSqlJs === 'function') {
                  resolve();
                } else {
                  // Log what we found for debugging
                  console.error('sql.js loaded but initSqlJs not found. Window keys:', Object.keys(window).filter(k => k.includes('sql') || k.includes('SQL')));
                  reject(new Error('sql.js loaded but initSqlJs is not a function'));
                }
              };
              script.onerror = () => {
                reject(new Error('Failed to load sql.js from CDN'));
              };
              document.head.appendChild(script);
            });
          }
          
          if (typeof initSqlJs !== 'function') {
            throw new Error('sql.js initSqlJs is not available after loading');
          }
          
          // Initialize sql.js with WASM file location
          addOutput('Initializing sql.js...', 'normal');
          const SQL = await initSqlJs({
            // Use CDN for the WASM file
            locateFile: (file: string) => {
              if (file.endsWith('.wasm')) {
                return `https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/${file}`;
              }
              return file;
            }
          });
              
              // Load the database from the uploaded bytes
              const db = new SQL.Database(dbBytes);
              
              // Check what tables exist
          const tablesResult = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
          const tableNames = tablesResult.length > 0 ? tablesResult[0].values.map((row: any) => row[0]) : [];
          addOutput(`Found tables in uploaded database: ${tableNames.join(', ') || 'none'}`, 'normal');
          
          // Check if playerProfiles table exists
          if (!tableNames.includes('playerProfiles')) {
            db.close();
            addOutput(`Error: Database does not contain 'playerProfiles' table`, 'error');
            addOutput(`Available tables: ${tableNames.join(', ') || 'none'}`, 'error');
            addOutput(`The CLI database (bfg-archives.db) may contain multiple tables.`, 'error');
            addOutput(`Please ensure the database contains a 'playerProfiles' table.`, 'error');
            return;
          }
          
          // Extract all player profiles from the database
          const profilesResult = db.exec("SELECT * FROM playerProfiles");
          if (profilesResult.length === 0 || profilesResult[0].values.length === 0) {
            db.close();
            addOutput('Database contains playerProfiles table but it is empty', 'error');
            return;
          }
          
          const profiles = profilesResult[0];
          const columnNames = profiles.columns;
          const profileRows = profiles.values;
          
          addOutput(`Found ${profileRows.length} profile(s) in uploaded database`, 'success');
          
          // Now insert each profile into the TinyBase store
          addOutput('Importing profiles into TinyBase store...', 'normal');
          const { TB_PLAYER_PROFILES_TABLE_KEY, playerProfileStore } = await import('../tb-store/player-profile-store');
          
          let importedCount = 0;
          let errorCount = 0;
          
          for (const row of profileRows) {
            try {
              // Convert row array to object using column names
              const profileData: any = {};
              columnNames.forEach((col: string, index: number) => {
                profileData[col] = row[index];
              });
              
              // Parse webCryptoWallet if it's a string
              if (profileData.webCryptoWallet && typeof profileData.webCryptoWallet === 'string') {
                try {
                  profileData.webCryptoWallet = JSON.parse(profileData.webCryptoWallet);
                } catch (e) {
                  // If parsing fails, keep it as a string
                }
              }
              
              // Validate the profile data
              const { parseRawProfileData } = await import('../tb-store/player-profile-store');
              const validatedProfile = parseRawProfileData(profileData.id, profileData);
              
              if (validatedProfile) {
                // Store the profile (webCryptoWallet needs to be stringified for TinyBase)
                const storeData = {
                  ...validatedProfile,
                  webCryptoWallet: typeof validatedProfile.webCryptoWallet === 'string' 
                    ? validatedProfile.webCryptoWallet 
                    : JSON.stringify(validatedProfile.webCryptoWallet),
                };
                
                playerProfileStore.setRow(TB_PLAYER_PROFILES_TABLE_KEY, validatedProfile.id, storeData as any);
                importedCount++;
              } else {
                errorCount++;
                addOutput(`Warning: Failed to validate profile ${profileData.id?.substring(0, 8)}...`, 'error');
              }
            } catch (rowError: any) {
              errorCount++;
              console.error('Error importing profile row:', rowError);
            }
          }
          
          db.close();
          
          addOutput(`Imported ${importedCount} profile(s) successfully`, importedCount > 0 ? 'success' : 'error');
          if (errorCount > 0) {
            addOutput(`Failed to import ${errorCount} profile(s)`, 'error');
          }
          
              // Mark as successful so we continue with IndexedDB save
              importSuccess = true;
        } catch (sqlJsError: any) {
          addOutput(`Error using sql.js to parse database: ${sqlJsError.message}`, 'error');
          console.error('sql.js error:', sqlJsError);
          return;
        }
      }
      
      if (!importSuccess) {
        addOutput('Failed to import database using any method', 'error');
        return;
      }
    } catch (error: any) {
      addOutput(`Error attempting to read database: ${error.message}`, 'error');
      console.error('Database read error:', error);
      return;
    }
    
    // If we used OpfsDb, create a persister and load data
    // If we used sql.js, the data is already in the TinyBase store
    if (sourceDb) {
      addOutput('Creating new persister with imported database...', 'normal');
      const { createSqliteWasmPersister } = await import('tinybase/persisters/persister-sqlite-wasm');
      const { TB_PLAYER_PROFILES_TABLE_KEY, playerProfileStore } = await import('../tb-store/player-profile-store');
      
      const newPersister = createSqliteWasmPersister(
        playerProfileStore,
        sqlite3,
        sourceDb,
        TB_PLAYER_PROFILES_TABLE_KEY
      );
      
      // Load data from the imported database into the TinyBase store
      addOutput('Loading data from imported database into TinyBase store...', 'normal');
      try {
        await newPersister.load();
        addOutput('Data loaded from imported database', 'normal');
        
        // Check how many profiles were loaded
        const { getAllPlayerProfiles } = await import('../tb-store/player-profile-store');
        const profiles = getAllPlayerProfiles();
        addOutput(`Data loaded from imported database: ${profiles.length} profile(s) found`, profiles.length > 0 ? 'success' : 'error');
        console.log('Profiles after SQLite load:', profiles);
        
        if (profiles.length === 0) {
          addOutput('Warning: No profiles loaded. The database may be empty or in a different format.', 'error');
          addOutput('Checking raw store data...', 'normal');
          const rawTable = playerProfileStore.getTable(TB_PLAYER_PROFILES_TABLE_KEY);
          const rawKeys = Object.keys(rawTable);
          addOutput(`Raw store has ${rawKeys.length} key(s): ${rawKeys.slice(0, 5).join(', ')}${rawKeys.length > 5 ? '...' : ''}`, 'normal');
        }
        
        // Stop auto-save on the new persister - we'll restart it after IndexedDB save
        newPersister.stopAutoSave?.();
      } catch (loadError: any) {
        addOutput(`Error loading from imported database: ${loadError.message}`, 'error');
        console.error('Load error:', loadError);
        if (sourceDb) sourceDb.close();
      }
    } else {
      // Data was imported via sql.js, already in the store
      addOutput('Data imported directly into TinyBase store via sql.js', 'success');
      
      // Verify the data is in the store
      const { getAllPlayerProfiles } = await import('../tb-store/player-profile-store');
      const profiles = getAllPlayerProfiles();
      addOutput(`Store now contains ${profiles.length} profile(s)`, profiles.length > 0 ? 'success' : 'error');
    }
    
    // CRITICAL: Save the imported data to IndexedDB (the primary source of truth)
    // The IndexedDB persister has auto-load enabled, so we need to save to it
    // so it becomes the new source of truth
    addOutput('Saving imported data to IndexedDB (primary storage)...', 'normal');
    const { getPlayerProfileIndexedDbPersister } = await import('../v2/new-persistence-ops/tb-store/player-profile-browser-persistence');
    const indexedDbPersister = getPlayerProfileIndexedDbPersister();
    if (indexedDbPersister) {
      // Stop auto-load temporarily to prevent it from overwriting our imported data
      indexedDbPersister.stopAutoLoad?.();
      
      // Save the current store state (which now has imported data) to IndexedDB
      await indexedDbPersister.save();
      
      // Verify the save worked
      const { getAllPlayerProfiles } = await import('../tb-store/player-profile-store');
      const profilesAfterSave = getAllPlayerProfiles();
      addOutput(`Data saved to IndexedDB: ${profilesAfterSave.length} profile(s)`, profilesAfterSave.length > 0 ? 'success' : 'error');
      console.log('Profiles after IndexedDB save:', profilesAfterSave);
      
      // Restart auto-load
      indexedDbPersister.startAutoLoad();
    } else {
      addOutput('Warning: IndexedDB persister not available', 'error');
    }
    
    // Also save to SQLite for consistency
    const { savePlayerProfileStore } = await import('../tb-store/player-profile-store');
    await savePlayerProfileStore();
    addOutput('Data synced to SQLite', 'normal');
    
    // Final verification
    const { getAllPlayerProfiles: getAllPlayerProfilesFinal } = await import('../tb-store/player-profile-store');
    const finalProfiles = getAllPlayerProfilesFinal();
    addOutput(`Final verification: ${finalProfiles.length} profile(s) in store`, finalProfiles.length > 0 ? 'success' : 'error');
    if (finalProfiles.length > 0) {
      addOutput(`Profile handles: ${finalProfiles.map(p => p.handle).join(', ')}`, 'normal');
    }
    
    addOutput(`✓ Database imported successfully from ${file.name}`, 'success');
    addOutput('You may need to refresh the page or run "list-users" to see the imported data', 'normal');
  } catch (error: any) {
    addOutput(`Error importing database: ${error.message || error}`, 'error');
    console.error('Error importing database:', error);
  }
}

// Event listeners
helpBtn.addEventListener('click', showHelp);
downloadDbBtn.addEventListener('click', downloadDatabase);

if (dbFileInput) {
  // Add click listener to show feedback
  dbFileInput.addEventListener('click', () => {
    console.log('File input clicked - file picker should open');
    addOutput('Opening file picker...', 'normal');
  });
  
  // Using label approach - clicking the label automatically triggers the file input
  // This is more reliable than programmatic clicks
  dbFileInput.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      addOutput(`File selected: ${file.name}`, 'normal');
      await uploadDatabase(file);
      // Reset the input so the same file can be selected again
      dbFileInput.value = '';
    } else {
      console.log('No file selected (user cancelled)');
      addOutput('File selection cancelled', 'normal');
    }
  });
} else {
  console.error('File input not found');
  addOutput('Error: File input element not found', 'error');
}
// listDbFilesBtn.addEventListener('click', listDatabaseFiles); // Commented out - button is not in HTML
closeHelp.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  closeHelpModal();
});

// Close modal when clicking outside of it
helpModal.addEventListener('click', (event) => {
  if (event.target === helpModal) {
    closeHelpModal();
  }
});

// Initial welcome message
addOutput('BFG CLI Web Interface', 'success');
addOutput('Type a command and press Enter or click Execute', 'normal');
addOutput('', 'normal');

// Focus the command input on page load
commandInput.focus();

