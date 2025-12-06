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
    console.log(`Creating user with handle: ${argv.handle}...`);
    
    const result = await UserOps.createPlayerProfile(argv.handle);
    
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
    console.log('Fetching user profiles...');
    
    // Ensure SQLite is initialized and data is loaded before fetching
    await ensurePlayerProfileSqliteInitialized();
    
    const result = await UserOps.getAllPlayerProfiles();
    
    if (result.success && result.profiles) {
      if (result.profiles.length === 0) {
        console.log('\nNo users found. Use "bfg add-user <handle>" to create a new user.\n');
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
    if (!argv.profileId) {
      console.error('✗ Profile ID is required. Use "bfg remove-user <profile-id>"');
      process.exit(1);
      return;
    }

    console.log(`Removing user with profile ID: ${argv.profileId}...`);
    
    const result = await UserOps.deletePlayerProfile(argv.profileId);
    
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

