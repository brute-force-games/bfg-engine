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
import { LocalTbPersistenceOps } from '../v2/new-persistence-ops/tb-file-persistence-ops';
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

// Download JSON export function
async function downloadDatabase() {
  try {
    addOutput('Preparing JSON export...', 'normal');
    
    // Get the TinyBase store and export all tables as JSON
    const { playerProfileStore } = await import('../tb-store/player-profile-store');
    
    // Get all tables from the store
    const tables = playerProfileStore.getTables();
    
    // Create export object with metadata
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tables: tables,
    };
    
    // Convert to JSON string with pretty formatting
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5); // Format: YYYY-MM-DDTHH-MM-SS
    const filename = `player_profiles_${timestamp}.json`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addOutput(`✓ JSON export downloaded: ${filename}`, 'success');
  } catch (error: any) {
    addOutput(`Error exporting JSON: ${error.message || error}`, 'error');
    console.error('Error exporting JSON:', error);
  }
}

// Upload/import JSON function
async function uploadDatabase(file: File) {
  try {
    addOutput(`Reading JSON file: ${file.name}...`, 'normal');
    
    // Read file as text (JSON)
    const text = await file.text();
    
    addOutput(`File read: ${text.length} characters`, 'normal');
    
    // Parse JSON
    let importData: any;
    try {
      importData = JSON.parse(text);
    } catch (parseError: any) {
      addOutput(`Error: Invalid JSON format - ${parseError.message}`, 'error');
      return;
    }
    
    // Validate JSON structure
    if (!importData.tables || typeof importData.tables !== 'object') {
      addOutput('Error: JSON file must contain a "tables" object', 'error');
      return;
    }
    
    addOutput('Importing data into TinyBase store...', 'normal');
    
    // Get the TinyBase store
    const { playerProfileStore, TB_PLAYER_PROFILES_TABLE_KEY } = await import('../tb-store/player-profile-store');
    
    // Set all tables from the imported data
    // TinyBase will handle all the parsing and validation
    playerProfileStore.setTables(importData.tables);
    
    addOutput('Data loaded into TinyBase store', 'success');
    
    // Check how many profiles were loaded
    const { getAllPlayerProfiles } = await import('../tb-store/player-profile-store');
    const profiles = getAllPlayerProfiles();
    addOutput(`Loaded ${profiles.length} profile(s) from imported JSON`, profiles.length > 0 ? 'success' : 'error');
    
    // CRITICAL: Save the imported data to IndexedDB (the primary source of truth)
    addOutput('Saving imported data to IndexedDB (primary storage)...', 'normal');
    const { getPlayerProfileIndexedDbPersister } = await import('../v2/new-persistence-ops/tb-store/player-profile-browser-persistence');
    const indexedDbPersister = getPlayerProfileIndexedDbPersister();
    if (indexedDbPersister) {
      // Stop auto-load temporarily to prevent it from overwriting our imported data
      indexedDbPersister.stopAutoLoad?.();
      
      // Save the current store state (which now has imported data) to IndexedDB
      await indexedDbPersister.save();
      
      // Verify the save worked
      const profilesAfterSave = getAllPlayerProfiles();
      addOutput(`Data saved to IndexedDB: ${profilesAfterSave.length} profile(s)`, profilesAfterSave.length > 0 ? 'success' : 'error');
      
      // Restart auto-load
      indexedDbPersister.startAutoLoad();
    } else {
      addOutput('Warning: IndexedDB persister not available', 'error');
    }
    
    // Also save to SQLite for consistency (if SQLite is being used)
    try {
      const { savePlayerProfileStore } = await import('../tb-store/player-profile-store');
      await savePlayerProfileStore();
      addOutput('Data synced to SQLite', 'normal');
    } catch (e) {
      // SQLite might not be initialized, that's okay
      console.warn('Could not sync to SQLite:', e);
    }
    
    // Final verification
    const finalProfiles = getAllPlayerProfiles();
    addOutput(`Final verification: ${finalProfiles.length} profile(s) in store`, finalProfiles.length > 0 ? 'success' : 'error');
    if (finalProfiles.length > 0) {
      addOutput(`Profile handles: ${finalProfiles.map(p => p.handle).join(', ')}`, 'normal');
    }
    
    addOutput(`✓ JSON imported successfully from ${file.name}`, 'success');
    addOutput('You may need to refresh the page or run "list-users" to see the imported data', 'normal');
  } catch (error: any) {
    addOutput(`Error importing JSON: ${error.message || error}`, 'error');
    console.error('Error importing JSON:', error);
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

