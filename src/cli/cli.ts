#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { GameLobby } from '../models/p2p-lobby';
import { BfgGameInstanceIdToolbox, BfgGameLobbyIdToolbox, BfgGameRoomIdToolbox, BfgGameTableIdToolbox, BfgPlayerProfileIdToolbox } from '../models/types/bfg-branded-uuids';
import type { PublicPlayerProfile } from '../models/internal/player-profile/public-player-profile';
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
import { IGameIdentifiers } from '../models/types/game-identifiers';
import { BfgSupportedGameTitle } from '../models/game-box-definition';
import { GuessNumberGameMetadata } from '@bfg-engine/example-games/game-guess-number/game-box';
import { createCliPlayerOps } from '@bfg-engine/v2/player-ops/cli-player-ops';
import { createCliWatcherOps } from '@bfg-engine/v2/watcher-ops/cli-watcher-ops';



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

// Helper function to create a game lobby
function createGameLobby(
  gameTitle: string,
  lobbyName: string,
  hostHandle: string,
  playerHandles: string[]
): GameLobby {
  const gameLobbyId = BfgGameLobbyIdToolbox.createRandomId();
  const gameHostPlayerProfileId = BfgPlayerProfileIdToolbox.createRandomId();
  
  const gameHostPlayerProfile: PublicPlayerProfile = {
    id: gameHostPlayerProfileId,
    handle: hostHandle,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const playerPool: PublicPlayerProfile[] = [
    gameHostPlayerProfile,
    ...playerHandles.map(handle => ({
      id: BfgPlayerProfileIdToolbox.createRandomId(),
      handle,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }))
  ];

  return {
    id: gameLobbyId,
    gameHostPlayerProfile,
    lobbyName,
    currentStatusDescription: lobbyName,
    isLobbyValid: true,
    gameTitle: gameTitle as BfgSupportedGameTitle,
    playerPool,
    minNumPlayers: playerPool.length,
    maxNumPlayers: playerPool.length,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

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
    async (_argv) => {
      try {
        console.log('Initializing game operations...');
        await gameOps.initializeGameOps();
        console.log('✓ Game operations initialized successfully');
      } catch (error) {
        console.error('✗ Failed to initialize game operations:', error);
        process.exit(1);
      }
    }
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
    async (argv) => {
      try {
        console.log('Executing first game step...');
        
        const gameLobby = createGameLobby(
          argv['game-title'],
          argv['lobby-name'],
          argv.host,
          argv.players as string[]
        );

        const gameIdentifiers: IGameIdentifiers = {
          gameInstanceId: argv['instance-id'] 
            ? argv['instance-id'] as any
            : BfgGameInstanceIdToolbox.createRandomId(),
          gameRoomId: argv['room-id']
            ? argv['room-id'] as any
            : BfgGameRoomIdToolbox.createRandomId(),
          gameTableId: argv['table-id']
            ? argv['table-id'] as any
            : BfgGameTableIdToolbox.createRandomId(),
        };

        const result = await gameOps.doFirstGameStep(gameLobby, gameIdentifiers);
        
        console.log('✓ First game step completed successfully');
        console.log('Game Table Phase:', result.gameStepResult.gameTablePhase);
        console.log('Save Result:', result.gameStepResult.saveResult.success ? 'Success' : `Failed: ${result.gameStepResult.saveResult.error}`);
        console.log('TX Result:', result.gameStepResult.txAllPlayersResult.success ? 'Success' : `Failed: ${result.gameStepResult.txAllPlayersResult.error}`);
        console.log('Host Events:', result.gameStepResult.hostEvents.length);
        console.log('Player Events:', result.gameStepResult.playerEvents.length);
        console.log('\nGame Identifiers:');
        console.log(JSON.stringify(gameIdentifiers, null, 2));
      } catch (error) {
        console.error('✗ Failed to execute first game step:', error);
        process.exit(1);
      }
    }
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
    async (argv) => {
      try {
        console.log('Executing game step...');
        
        const gameIdentifiers: IGameIdentifiers = {
          gameInstanceId: argv['instance-id'] as any,
          gameRoomId: argv['room-id'] as any,
          gameTableId: argv['table-id'] as any,
        };

        const result = await gameOps.doGameStep(gameIdentifiers);
        
        console.log('✓ Game step completed successfully');
        console.log('Game Table Phase:', result.gameTablePhase);
        console.log('Save Result:', result.saveResult.success ? 'Success' : `Failed: ${result.saveResult.error}`);
        console.log('TX Result:', result.txAllPlayersResult.success ? 'Success' : `Failed: ${result.txAllPlayersResult.error}`);
        console.log('Host Events:', result.hostEvents.length);
        console.log('Player Events:', result.playerEvents.length);
      } catch (error) {
        console.error('✗ Failed to execute game step:', error);
        process.exit(1);
      }
    }
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .parse();
