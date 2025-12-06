/**
 * Shared yargs configuration for CLI commands
 * Used by both cli.ts (Node.js) and web-cli.ts (browser)
 */

import type { IBfgGameOps } from '../v2/game-ops/game-ops';
import {
  createInitCommand,
  createFirstStepCommand,
  createStepCommand,
  handleAddUser,
  handleListUsers,
  handleRemoveUser,
  handleUserDetails,
  handleClearAllUsers,
} from './cli-commands';

/**
 * Configure a yargs instance with all CLI commands
 * @param yargsInstance - The yargs instance to configure
 * @param gameOps - The game operations instance
 * @returns The configured yargs instance
 */
export function configureYargsCommands(yargsInstance: any, gameOps: IBfgGameOps) {
  return yargsInstance
    .scriptName('bfg')
    .version('1.0.0')
    .usage('$0 <command> [options]')
    .exitProcess(false) // Don't exit process - let handlers complete
    .help(false) // Don't show help automatically
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
      'remove-user [profile-id]',
      'Remove a user profile by profile ID',
      (yargs) => {
        return yargs
          .positional('profile-id', {
            type: 'string',
            description: 'Profile ID of the user to remove (optional - will show menu if not provided)',
            demandOption: false,
          });
      },
      handleRemoveUser
    )
    .command(
      'user-details [profile-id]',
      'View detailed information about a user profile',
      (yargs) => {
        return yargs
          .positional('profile-id', {
            type: 'string',
            description: 'Profile ID of the user to view (optional - will show menu if not provided)',
            demandOption: false,
          });
      },
      handleUserDetails
    )
    .command(
      'delete-all-users',
      'Delete all user profiles',
      (yargs) => {
        return yargs;
      },
      handleClearAllUsers
    )
    .demandCommand(1, 'You need at least one command before moving on');
    // Note: .help() is called conditionally in cli.ts and web-cli.ts
}

