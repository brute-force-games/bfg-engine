import { GameLobby } from '../models/p2p-lobby';
import { BfgGameInstanceIdToolbox, BfgGameLobbyIdToolbox, BfgGameRoomIdToolbox, BfgGameTableIdToolbox, BfgPlayerProfileIdToolbox } from '../models/types/bfg-branded-uuids';
import type { PublicPlayerProfile } from '../models/internal/player-profile/public-player-profile';
import type { IBfgGameOps } from '../v2/game-ops/game-ops';
import { IGameIdentifiers } from '../models/types/game-identifiers';
import { BfgSupportedGameTitle } from '../models/game-box-definition';
import { UserOps } from '../v2/user-ops/user-ops-impl';
import { savePlayerProfileStore, ensurePlayerProfileSqliteInitialized } from '../tb-store/player-profile-store';

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

export function createInitCommand(gameOps: IBfgGameOps) {
  return async (_argv: any) => {
    try {
      console.log('Initializing game operations...');
      await gameOps.initializeGameOps();
      console.log('✓ Game operations initialized successfully');
    } catch (error) {
      console.error('✗ Failed to initialize game operations:', error);
      process.exit(1);
    }
  };
}

export function createFirstStepCommand(gameOps: IBfgGameOps) {
  return async (argv: any) => {
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
  };
}

export function createStepCommand(gameOps: IBfgGameOps) {
  return async (argv: any) => {
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
  };
}

export async function handleAddUser(argv: any) {
  try {
    // Extract handle from argv - yargs positional arguments can be in different places
    const handle = argv.handle || (argv._ && argv._.length > 2 ? argv._[2] : undefined);
    
    if (!handle) {
      console.error('✗ Error: Handle is required. Usage: add-user <handle>');
      process.exit(1);
      return;
    }
    
    console.log(`Creating user with handle: ${handle}...`);
    
    const result = await UserOps.createPlayerProfile(handle);
    
    if (result.success && result.profileId) {
      console.log('✓ User created successfully');
      console.log('Profile ID:', result.profileId);
      // Save/flush database before exiting
      await savePlayerProfileStore();
      // Exit cleanly after successful creation
      process.exit(0);
    } else {
      console.error('✗ Failed to create user:', result.error || 'Unknown error');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Failed to create user:', error);
    process.exit(1);
  }
}

export async function handleListUsers(_argv: any) {
  try {
    console.log('[handleListUsers] Starting');
    console.log('Fetching user profiles...');
    
    // Ensure SQLite is initialized and data is loaded before fetching
    await ensurePlayerProfileSqliteInitialized();
    
    // Give the persister a moment to ensure data is fully loaded
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = await UserOps.getAllPlayerProfiles();
    
    if (result.success && result.profiles) {
      if (result.profiles.length === 0) {
        // Check if there's raw data that failed validation
        const { playerProfileStore, TB_PLAYER_PROFILES_TABLE_KEY } = await import('../tb-store/player-profile-store');
        const rawTable = playerProfileStore.getTable(TB_PLAYER_PROFILES_TABLE_KEY);
        const rawCount = rawTable ? Object.keys(rawTable).length : 0;
        
        if (rawCount > 0) {
          console.log(`\n⚠️  Warning: Found ${rawCount} profile(s) in store but none passed validation.`);
          console.log('This may indicate data format issues. Try creating a new user with "bfg add-user <handle>".\n');
        } else {
          console.log('\nNo users found. Use "bfg add-user <handle>" to create a new user.\n');
        }
      } else {
        console.log(`\nFound ${result.profiles.length} user(s):\n`);
        result.profiles.forEach((profile, index) => {
          console.log(`${index + 1}. Handle: ${profile.handle}`);
          console.log(`   Profile ID: ${profile.id}`);
          console.log(`   Created: ${new Date(profile.createdAt).toLocaleString()}`);
          if (profile.avatarImageUrl) {
            console.log(`   Avatar: ${profile.avatarImageUrl}`);
          }
          console.log('');
        });
      }
      // Exit cleanly after displaying results
      process.exit(0);
    } else {
      console.error('✗ Failed to fetch users:', result.error || 'Unknown error');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Failed to list users:', error);
    process.exit(1);
  }
}

export async function handleRemoveUser(argv: any) {
  try {
    // Yargs converts kebab-case to camelCase, so check both
    const profileId = argv.profileId || argv['profile-id'];
    
    // If profileId not provided, show interactive menu
    if (!profileId) {
      // Ensure SQLite is initialized and data is loaded
      await ensurePlayerProfileSqliteInitialized();
      
      // Give the persister a moment to ensure data is fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await UserOps.getAllPlayerProfiles();
      
      if (!result.success) {
        console.error(`✗ Failed to fetch users: ${result.error || 'Unknown error'}`);
        process.exit(1);
        return;
      }
      
      if (!result.profiles || result.profiles.length === 0) {
        console.error('✗ No users found to remove. Use "bfg add-user <handle>" to create a new user.');
        process.exit(1);
        return;
      }

      // Show menu to select user
      const { showMenuPrompt } = await import('./menu-prompt');
      const menuResult = await showMenuPrompt({
        message: 'Select a user to remove:',
        options: result.profiles.map((profile) => ({
          label: profile.handle,
          value: profile.id,
          description: `ID: ${profile.id}`,
        })),
      });

      if (menuResult.selectedIndex === -1) {
        // If cancelled or non-TTY, show list of available profiles
        if (!process.stdin.isTTY) {
          console.log('\nAvailable users:');
          result.profiles.forEach((profile, index) => {
            console.log(`  ${index + 1}. ${profile.handle} (${profile.id})`);
          });
          console.log('\nTo remove a user, run: bfg remove-user <profile-id>');
          console.log('Or run this command directly in your terminal (not through npm) for an interactive menu.');
        } else {
          console.log('Cancelled');
        }
        process.exit(0);
        return;
      }

      argv.profileId = menuResult.selectedValue;
    }

    // Ensure SQLite is initialized before removing profile
    await ensurePlayerProfileSqliteInitialized();

    const finalProfileId = argv.profileId || argv['profile-id'];
    console.log(`Removing user with profile ID: ${finalProfileId}...`);
    
    const result = await UserOps.deletePlayerProfile(finalProfileId);
    
    if (result.success) {
      console.log('✓ User removed successfully');
      // Save/flush database before exiting
      await savePlayerProfileStore();
      // Exit cleanly after successful removal
      process.exit(0);
    } else {
      console.error('✗ Failed to remove user:', result.error || 'Unknown error');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Failed to remove user:', error);
    process.exit(1);
  }
}

export async function handleUserDetails(argv: any) {
  try {
    // Yargs converts kebab-case to camelCase, so check both
    const profileId = argv.profileId || argv['profile-id'];
    
    // If profileId not provided, show interactive menu
    if (!profileId) {
      // Ensure SQLite is initialized and data is loaded
      await ensurePlayerProfileSqliteInitialized();
      
      // Give the persister a moment to ensure data is fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await UserOps.getAllPlayerProfiles();
      
      if (!result.success) {
        console.error(`✗ Failed to fetch users: ${result.error || 'Unknown error'}`);
        process.exit(1);
        return;
      }
      
      if (!result.profiles || result.profiles.length === 0) {
        console.error('✗ No users found. Use "bfg add-user <handle>" to create a new user.');
        process.exit(1);
        return;
      }

      // Show menu to select user
      const { showMenuPrompt } = await import('./menu-prompt');
      const menuResult = await showMenuPrompt({
        message: 'Select a user to view details:',
        options: result.profiles.map((profile) => ({
          label: profile.handle,
          value: profile.id,
          description: `ID: ${profile.id}`,
        })),
      });

      if (menuResult.selectedIndex === -1) {
        // If cancelled or non-TTY, show list of available profiles
        if (!process.stdin.isTTY) {
          console.log('\nAvailable users:');
          result.profiles.forEach((profile, index) => {
            console.log(`  ${index + 1}. ${profile.handle} (${profile.id})`);
          });
          console.log('\nTo view details, run: bfg user-details <profile-id>');
          console.log('Or run this command directly in your terminal (not through npm) for an interactive menu.');
        } else {
          console.log('Cancelled');
        }
        process.exit(0);
        return;
      }

      argv.profileId = menuResult.selectedValue;
    }

    // Ensure SQLite is initialized before fetching profile
    await ensurePlayerProfileSqliteInitialized();

    const finalProfileId = argv.profileId || argv['profile-id'];
    console.log(`Fetching details for profile ID: ${finalProfileId}...`);
    
    const result = await UserOps.getPlayerProfile(finalProfileId);
    
    if (result.success && result.data) {
      const profile = result.data;
      console.log('\n═══════════════════════════════════════════════════════');
      console.log('USER PROFILE DETAILS');
      console.log('═══════════════════════════════════════════════════════\n');
      console.log(`Handle:           ${profile.handle}`);
      console.log(`Profile ID:       ${profile.id}`);
      console.log(`Created:          ${new Date(profile.createdAt).toLocaleString()}`);
      console.log(`Updated:          ${new Date(profile.updatedAt).toLocaleString()}`);
      if (profile.avatarImageUrl) {
        console.log(`Avatar URL:       ${profile.avatarImageUrl}`);
      } else {
        console.log(`Avatar URL:       (not set)`);
      }
      if (profile.walletAddress) {
        console.log(`Wallet Address:   ${profile.walletAddress}`);
      } else {
        console.log(`Wallet Address:   (not set)`);
      }
      console.log('\n═══════════════════════════════════════════════════════\n');
      process.exit(0);
    } else {
      console.error('✗ Failed to fetch user details:', result.error || 'Unknown error');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Failed to get user details:', error);
    process.exit(1);
  }
}

export async function handleClearAllUsers(_argv: any) {
  try {
    console.log('Clearing all users...');
    
    // Import clearAllProfiles from the store
    const { clearAllProfiles } = await import('../tb-store/player-profile-store');
    clearAllProfiles();
    
    console.log('✓ All users cleared successfully');
    // Save/flush database before exiting
    await savePlayerProfileStore();
    // Exit cleanly after successful clearing
    process.exit(0);
  } catch (error) {
    console.error('✗ Failed to clear all users:', error);
    process.exit(1);
  }
}

