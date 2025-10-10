import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { GameLobbyId, PlayerProfileId } from '~/models/types/bfg-branded-ids';
import { GameLobby, LobbySchema } from '~/models/p2p-lobby';
import z from 'zod';
import { PublicPlayerProfileJsonStrSchema, PublicPlayerProfileSchema } from '~/models/player-profile/public-player-profile';
// import { createBrandedJson } from '~/types/core/branded-values/bs-json-string-utils';
const createBrandedJson = (obj: any) => JSON.stringify(obj) as any; // Temporary stub

/**
 * TinyBase store for hosted lobby data
 * Provides reactive state management for hosted game lobbies
 */

export const TB_HOSTED_LOBBIES_STORE_NAME = 'tinybase_hosted_lobbies';

export const TB_HOSTED_LOBBIES_TABLE_KEY = 'hostedLobbies';

// Create the store
export const hostedLobbiesStore = createStore();
const persister = createLocalPersister(hostedLobbiesStore, TB_HOSTED_LOBBIES_STORE_NAME);

// Create persister for automatic localStorage persistence
persister.startAutoLoad();
persister.startAutoSave();


const TbStoreLobbySchema = LobbySchema
  .omit({
    gameHostPlayerProfile: true,
    playerPool: true,
  })
  .extend({
    playerPoolCsvStr: z.string(),
    gameHostPlayerProfileJsonStr: PublicPlayerProfileJsonStrSchema,
  });
type TbStoreLobby = z.infer<typeof TbStoreLobbySchema>;

export type GameLobbyUpdateFields = Partial<Omit<GameLobby, 'id' | 'createdAt' | 'gameHostPlayerProfile' | 'playerPool'>>;


/**
 * Safely parse hosted lobby data from TinyBase store
 */
export const parseRawHostedLobbyData = (lobbyId: string, rawData: any): GameLobby | null => {
  const result = TbStoreLobbySchema.safeParse(rawData);
  
  if (!result.success) {
    console.error(`Error validating hosted lobby data for ${lobbyId}:`, result.error);
    return null;
  }

  const tbLobby = result.data;

  const gameHostPlayerProfileJsonStr = tbLobby.gameHostPlayerProfileJsonStr;
  const gameHostPlayerProfileJson = JSON.parse(gameHostPlayerProfileJsonStr);

  const gameHostPlayerProfileResult = PublicPlayerProfileSchema.safeParse(gameHostPlayerProfileJson);
  if (!gameHostPlayerProfileResult.success) {
    console.error(`Error validating game host player profile data for ${lobbyId}:`, gameHostPlayerProfileResult.error);
    return null;
  }

  const playerPool = tbLobby.playerPoolCsvStr.length > 0 ?
    tbLobby.playerPoolCsvStr.split(',') as PlayerProfileId[] :
    [];

  const gameLobby = LobbySchema.parse({
    ...tbLobby,
    gameHostPlayerProfile: gameHostPlayerProfileResult.data,
    playerPool,
  });
  
  return gameLobby;
};

/**
 * Add a new hosted lobby to the store
 */
export const addHostedLobby = async (lobby: GameLobby): Promise<boolean> => {
  try {
    console.log('addHostedLobby: lobby', lobby);
    // Validate the lobby data
    const validationResult = LobbySchema.safeParse(lobby);
    if (!validationResult.success) {
      console.error('Error validating lobby data:', validationResult.error);
      return false;
    }

    console.log('addHostedLobby: validationResult', validationResult);

    const gameHostPlayerProfileJsonStr = createBrandedJson(lobby.gameHostPlayerProfile, PublicPlayerProfileJsonStrSchema);
    const playerPoolCsvStr = lobby.playerPool.join(',');

    const tbLobby: TbStoreLobby = {
      ...lobby,
      gameHostPlayerProfileJsonStr,
      playerPoolCsvStr,
    };

    console.log('addHostedLobby: tbLobby', tbLobby);
    
    hostedLobbiesStore.setRow(TB_HOSTED_LOBBIES_TABLE_KEY, tbLobby.id, tbLobby);

    return true;
  } catch (error) {
    console.error('Error adding hosted lobby:', error);
    return false;
  }
};

/**
 * Update an existing hosted lobby
 */
export const updateHostedLobby = (
  lobbyId: GameLobbyId,
  updates: GameLobbyUpdateFields
): boolean => {
  try {
    const existingLobby = hostedLobbiesStore.getRow(TB_HOSTED_LOBBIES_TABLE_KEY, lobbyId);
    if (!existingLobby) {
      return false;
    }

    const updatedLobby = {
      ...existingLobby,
      ...updates,
    };
    
    // Ignore validation for now until Tinybase can handle more complex objects
    // const validationResult = LobbySchema.safeParse(updatedLobby);
    // if (!validationResult.success) {
    //   console.error('Error validating updated lobby data:', validationResult.error);
    //   return false;
    // }
    
    hostedLobbiesStore.setRow(TB_HOSTED_LOBBIES_TABLE_KEY, lobbyId, updatedLobby);
    return true;
  } catch (error) {
    console.error('Error updating hosted lobby:', error);
    return false;
  }
};


export const updateHostedLobbyPlayerPool = (
  lobbyId: GameLobbyId,
  playerPool: PlayerProfileId[]
): boolean => {
  const existingLobby = hostedLobbiesStore.getRow(TB_HOSTED_LOBBIES_TABLE_KEY, lobbyId);
  if (!existingLobby) {
    return false;
  }

  const updatedPlayerPoolCsvStr = playerPool.join(',');
  
  const updatedLobby = {
    ...existingLobby,
    playerPoolCsvStr: updatedPlayerPoolCsvStr,
  };

  hostedLobbiesStore.setRow(TB_HOSTED_LOBBIES_TABLE_KEY, lobbyId, updatedLobby);
  return true;
}

/**
 * Delete a hosted lobby
 */
export const deleteHostedLobby = (lobbyId: GameLobbyId): boolean => {
  try {
    const existingLobby = hostedLobbiesStore.getRow(TB_HOSTED_LOBBIES_TABLE_KEY, lobbyId);
    if (!existingLobby) {
      return false;
    }
    
    // Remove from store
    hostedLobbiesStore.delRow(TB_HOSTED_LOBBIES_TABLE_KEY, lobbyId);
    return true;
  } catch (error) {
    console.error('Error deleting hosted lobby:', error);
    return false;
  }
};

/**
 * Get a hosted lobby by ID
 */
export const getHostedLobby = (lobbyId: GameLobbyId): GameLobby | null => {
  try {
    const rawLobbyData = hostedLobbiesStore.getRow(TB_HOSTED_LOBBIES_TABLE_KEY, lobbyId);
    if (!rawLobbyData) {
      return null;
    }
    
    return parseRawHostedLobbyData(lobbyId, rawLobbyData);
  } catch (error) {
    console.error('Error getting hosted lobby:', error);
    return null;
  }
};

/**
 * Get all hosted lobbies
 */
export const getAllHostedLobbies = (): GameLobby[] => {
  try {
    const rawLobbies = hostedLobbiesStore.getTable(TB_HOSTED_LOBBIES_TABLE_KEY);
    const lobbies: GameLobby[] = [];
    
    Object.entries(rawLobbies).forEach(([id, rawLobbyData]) => {
      const parsedLobby = parseRawHostedLobbyData(id, rawLobbyData);
      if (parsedLobby) {
        lobbies.push(parsedLobby);
      }
    });
    
    return lobbies;
  } catch (error) {
    console.error('Error getting all hosted lobbies:', error);
    return [];
  }
};

/**
 * Get hosted lobbies by host player profile ID
 */
export const getHostedLobbiesByHost = (hostPlayerId: string): GameLobby[] => {
  try {
    const allLobbies = getAllHostedLobbies();
    return allLobbies.filter(lobby => lobby.gameHostPlayerProfile.id === hostPlayerId);
  } catch (error) {
    console.error('Error getting hosted lobbies by host:', error);
    return [];
  }
};

/**
 * Get hosted lobbies by game title
 */
export const getHostedLobbiesByTitle = (gameTitle: string): GameLobby[] => {
  try {
    const allLobbies = getAllHostedLobbies();
    return allLobbies.filter(lobby => lobby.gameTitle === gameTitle);
  } catch (error) {
    console.error('Error getting hosted lobbies by title:', error);
    return [];
  }
};

/**
 * Get hosted lobbies by status description
 */
export const getHostedLobbiesByStatus = (statusDescription: string): GameLobby[] => {
  try {
    const allLobbies = getAllHostedLobbies();
    return allLobbies.filter(lobby => lobby.currentStatusDescription === statusDescription);
  } catch (error) {
    console.error('Error getting hosted lobbies by status:', error);
    return [];
  }
};

// /**
//  * Get lobbies with available seats
//  */
// export const getLobbiesWithAvailableSeats = (): GameLobby[] => {
//   try {
//     const allLobbies = getAllHostedLobbies();
//     return allLobbies.filter(lobby => {
//       const occupiedSeats = [lobby.p1, lobby.p2, lobby.p3, lobby.p4, lobby.p5, lobby.p6, lobby.p7, lobby.p8]
//         .filter(seat => seat !== undefined).length;
//       return occupiedSeats < 8; // Assuming max 8 players
//     });
//   } catch (error) {
//     console.error('Error getting lobbies with available seats:', error);
//     return [];
//   }
// };

// /**
//  * Get lobbies where a specific player is seated
//  */
// export const getLobbiesByPlayer = (playerId: string): GameLobby[] => {
//   try {
//     const allLobbies = getAllHostedLobbies();
//     return allLobbies.filter(lobby => 
//       lobby.p1 === playerId ||
//       lobby.p2 === playerId ||
//       lobby.p3 === playerId ||
//       lobby.p4 === playerId ||
//       lobby.p5 === playerId ||
//       lobby.p6 === playerId ||
//       lobby.p7 === playerId ||
//       lobby.p8 === playerId
//     );
//   } catch (error) {
//     console.error('Error getting lobbies by player:', error);
//     return [];
//   }
// };

/**
 * Clear all hosted lobbies (for testing/debugging)
 */
export const clearAllHostedLobbies = (): void => {
  hostedLobbiesStore.delTable(TB_HOSTED_LOBBIES_TABLE_KEY);
};

/**
 * Get hosted lobbies count
 */
export const getHostedLobbiesCount = (): number => {
  try {
    const rawLobbies = hostedLobbiesStore.getTable(TB_HOSTED_LOBBIES_TABLE_KEY);
    return Object.keys(rawLobbies).length;
  } catch (error) {
    console.error('Error getting hosted lobbies count:', error);
    return 0;
  }
};
