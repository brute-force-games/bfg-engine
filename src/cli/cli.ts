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
import { configureYargsCommands } from './cli-yargs-config';



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


// CLI Commands - using shared configuration
configureYargsCommands(yargs(hideBin(process.argv)), gameOps).parse();
