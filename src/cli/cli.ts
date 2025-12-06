#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import type { INewHostOps } from '../v2/new-host-ops/new-host-ops';
import { NewHostOps } from '../v2/new-host-ops/new-host-ops';
import { registerGame } from '../v2/new-game-registry/new-game-registry';
import type { IPersistenceOps } from '../v2/new-persistence-ops/persistence-ops';
import { LocalTbPersistenceOps } from '../v2/new-persistence-ops/local-tb-persistence-ops';
import type { IPlayerOps } from '../v2/player-ops/player-ops';
import type { IWatcherOps } from '../v2/watcher-ops/watcher-ops';
import type { ITxOps } from '../v2/relay-ops/tx-ops';
import type { IRxOps } from '../v2/relay-ops/rx-ops';
import type { IBfgGameOps } from '../v2/game-ops/game-ops';
import { TxOps } from '../v2/relay-ops/tx-ops';
import { RxOps } from '../v2/relay-ops/rx-ops';
import { createBfgGameOpsForConsoleInstance } from '../v2/game-ops/game-ops-for-console-impl';
import { GuessNumberGameMetadata } from '@bfg-engine/example-games/game-guess-number/game-box';
import { createCliPlayerOps } from '@bfg-engine/v2/player-ops/cli-player-ops';
import { createCliWatcherOps } from '@bfg-engine/v2/watcher-ops/cli-watcher-ops';
import {
  createInitCommand,
  createFirstStepCommand,
  createStepCommand,
  handleAddUser,
  handleListUsers,
  handleRemoveUser,
  handleClearAllUsers,
} from './cli-commands';



// Import game-specific implementations
// import { GameGuessNumberPlayerOps } from '../tests/v2/game-guess-number/role-ops/ggn-player-ops';
// import { GameGuessNumberWatcherOps } from '../../tests/v2/game-guess-number/role-ops/ggn-watcher-ops';
// import { GuessNumberGameMetadata } from '../../tests/v2/game-guess-number/game-box';

// Register games
registerGame(GuessNumberGameMetadata);

// Use game-specific implementations
const playerOps: IPlayerOps = createCliPlayerOps();
const watcherOps: IWatcherOps = createCliWatcherOps();

// Initialize game ops instance
const hostOps: INewHostOps = NewHostOps;
const persistenceOps: IPersistenceOps = LocalTbPersistenceOps;
const txOps: ITxOps = TxOps;
const rxOps: IRxOps = RxOps;

const gameOps: IBfgGameOps = createBfgGameOpsForConsoleInstance(
  hostOps,
  persistenceOps,
  txOps,
  rxOps,
  playerOps,
  watcherOps
);


// CLI Commands
yargs(hideBin(process.argv))
  .scriptName('bfg')
  .version('1.0.0')
  .usage('$0 <command> [options]')
  .command(
    'init',
    'Initialize game operations',
    (yargs) => {
      return yargs;
    },
    createInitCommand(gameOps)
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
    createFirstStepCommand(gameOps)
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
    createStepCommand(gameOps)
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
    handleAddUser
  )
  .command(
    'list-users',
    'List all saved user profiles',
    (yargs) => {
      return yargs;
    },
    handleListUsers
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
    handleRemoveUser
  )
  .command(
    'delete-all-users',
    'Delete all user profiles',
    (yargs) => {
      return yargs;
    },
    handleClearAllUsers
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .parse();
