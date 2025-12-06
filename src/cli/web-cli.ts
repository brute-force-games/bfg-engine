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

import {
  createInitCommand,
  createFirstStepCommand,
  createStepCommand,
  handleAddUser,
  handleListUsers,
  handleRemoveUser,
  handleClearAllUsers,
} from './cli-commands';

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
  console.log = (...args: any[]) => {
    originalLog(...args);
    addOutput(args.join(' '), 'normal');
  };
  console.error = (...args: any[]) => {
    originalError(...args);
    addOutput(args.join(' '), 'error');
  };
  console.warn = (...args: any[]) => {
    originalWarn(...args);
    addOutput(args.join(' '), 'error');
  };
}

function restoreConsole() {
  console.log = originalLog;
  console.error = originalError;
  console.warn = originalWarn;
}

// Parse command line arguments from input string
function parseCommand(input: string): { command: string; argv: any } | null {
  const parts = input.trim().split(/\s+/);
  if (parts.length === 0) return null;
  
  const command = parts[0];
  const args = parts.slice(1);
  
  // Convert to yargs-like argv object
  const argv: any = { _: [command] };
  
  // Parse positional arguments
  if (command === 'add-user' && args.length > 0) {
    argv.handle = args[0];
  } else if (command === 'remove-user' && args.length > 0) {
    argv.profileId = args[0];
  } else if (command === 'first-step') {
    // Parse options for first-step
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-g' || args[i] === '--game-title') {
        argv['game-title'] = args[++i];
      } else if (args[i] === '-l' || args[i] === '--lobby-name') {
        argv['lobby-name'] = args[++i];
      } else if (args[i] === '-h' || args[i] === '--host') {
        argv.host = args[++i];
      } else if (args[i] === '-p' || args[i] === '--players') {
        argv.players = [];
        while (i + 1 < args.length && !args[i + 1].startsWith('-')) {
          argv.players.push(args[++i]);
        }
      } else if (args[i] === '-i' || args[i] === '--instance-id') {
        argv['instance-id'] = args[++i];
      } else if (args[i] === '-r' || args[i] === '--room-id') {
        argv['room-id'] = args[++i];
      } else if (args[i] === '-t' || args[i] === '--table-id') {
        argv['table-id'] = args[++i];
      }
    }
  } else if (command === 'step') {
    // Parse options for step
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-i' || args[i] === '--instance-id') {
        argv['instance-id'] = args[++i];
      } else if (args[i] === '-r' || args[i] === '--room-id') {
        argv['room-id'] = args[++i];
      } else if (args[i] === '-t' || args[i] === '--table-id') {
        argv['table-id'] = args[++i];
      }
    }
  }
  
  return { command, argv };
}

async function executeCommand(input: string) {
  addOutput(`bfg$ ${input}`, 'normal');
  
  const parsed = parseCommand(input);
  if (!parsed) {
    addOutput('Error: Invalid command', 'error');
    return;
  }

  captureConsole();
  
  try {
    // Override process.exit to not actually exit in browser
    (globalThis as any).process.exit = (code?: number) => {
      // In browser, just log instead of exiting
      if (code !== 0) {
        addOutput(`Process would exit with code ${code}`, 'error');
      }
    };
    
    switch (parsed.command) {
      case 'init':
        await createInitCommand(gameOps)(parsed.argv);
        break;
      case 'first-step':
        await createFirstStepCommand(gameOps)(parsed.argv);
        break;
      case 'step':
        await createStepCommand(gameOps)(parsed.argv);
        break;
      case 'add-user':
        await handleAddUser(parsed.argv);
        break;
      case 'list-users':
        await handleListUsers(parsed.argv);
        break;
      case 'remove-user':
        await handleRemoveUser(parsed.argv);
        break;
      case 'delete-all-users':
        await handleClearAllUsers(parsed.argv);
        break;
      default:
        addOutput(`Unknown command: ${parsed.command}`, 'error');
        addOutput('Available commands: init, first-step, step, add-user <handle>, list-users, remove-user <profile-id>, delete-all-users', 'normal');
    }
  } catch (error: any) {
    addOutput(`Error: ${error.message}`, 'error');
    if (error.stack) {
      addOutput(error.stack, 'error');
    }
  } finally {
    restoreConsole();
  }
}

executeBtn.addEventListener('click', () => {
  const input = commandInput.value.trim();
  if (input) {
    executeCommand(input);
    commandInput.value = '';
  }
});

commandInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const input = commandInput.value.trim();
    if (input) {
      executeCommand(input);
      commandInput.value = '';
    }
  }
});

// Function to create yargs instance with all commands (same as cli.ts)
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
  
  return yargs(['--help'])
    .scriptName('bfg')
    .version('1.0.0')
    .usage('$0 <command> [options]')
    .command(
      'init',
      'Initialize game operations',
      (yargs) => {
        return yargs;
      },
      () => {} // Dummy handler for help generation
    )
    .command(
      'first-step',
      'Execute the first game step',
      (yargs) => {
        return yargs
          .option('game-title', {
            alias: 'g',
            type: 'string',
            description: 'Game title',
            demandOption: true,
          })
          .option('lobby-name', {
            alias: 'l',
            type: 'string',
            description: 'Lobby name',
            demandOption: true,
          })
          .option('host', {
            alias: 'h',
            type: 'string',
            description: 'Host player handle',
            default: 'Host',
          })
          .option('players', {
            alias: 'p',
            type: 'array',
            description: 'Player handles',
            default: [],
          })
          .option('instance-id', {
            alias: 'i',
            type: 'string',
            description: 'Game instance ID (optional, will generate if not provided)',
          })
          .option('room-id', {
            alias: 'r',
            type: 'string',
            description: 'Game room ID (optional, will generate if not provided)',
          })
          .option('table-id', {
            alias: 't',
            type: 'string',
            description: 'Game table ID (optional, will generate if not provided)',
          });
      },
      () => {} // Dummy handler for help generation
    )
    .command(
      'step',
      'Execute a game step',
      (yargs) => {
        return yargs
          .option('instance-id', {
            alias: 'i',
            type: 'string',
            description: 'Game instance ID',
            demandOption: true,
          })
          .option('room-id', {
            alias: 'r',
            type: 'string',
            description: 'Game room ID',
            demandOption: true,
          })
          .option('table-id', {
            alias: 't',
            type: 'string',
            description: 'Game table ID',
            demandOption: true,
          });
      },
      () => {} // Dummy handler for help generation
    )
    .command(
      'add-user <handle>',
      'Create a new user profile',
      (yargs) => {
        return yargs
          .positional('handle', {
            type: 'string',
            description: 'User handle',
            demandOption: true,
          });
      },
      () => {} // Dummy handler for help generation
    )
    .command(
      'list-users',
      'List all saved user profiles',
      (yargs) => {
        return yargs;
      },
      () => {} // Dummy handler for help generation
    )
    .command(
      'remove-user <profile-id>',
      'Remove a user profile by profile ID',
      (yargs) => {
        return yargs
          .positional('profile-id', {
            type: 'string',
            description: 'Profile ID of the user to remove',
            demandOption: true,
          });
      },
      () => {} // Dummy handler for help generation
    )
    .command(
      'delete-all-users',
      'Delete all user profiles',
      (yargs) => {
        return yargs;
      },
      () => {} // Dummy handler for help generation
    )
    .demandCommand(1, 'You need at least one command before moving on')
    .help();
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

// Event listeners
helpBtn.addEventListener('click', showHelp);
downloadDbBtn.addEventListener('click', downloadDatabase);
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

