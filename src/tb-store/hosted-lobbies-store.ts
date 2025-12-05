import { z } from 'zod';
import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { GameLobbyId } from '../models/types/bfg-branded-uuids';
import {
  GameLobby,
  GameLobbySchema,
  GameHostPlayerProfileStringifier,
  PlayerPoolStringifier,
  GameLobbySchemaForTbStoreSchema,
} from '../models/p2p-lobby';
import { BfgSupportedGameTitleSchema } from '../models/game-box-definition';
import { BfgGameInstanceIdToolbox } from '../models/types/bfg-branded-uuids';
import type { SharedPublicPlayerProfile } from '../models/internal/player-profile/public-player-profile';
import type { EnsureCells, InvalidCellFields } from '../models/tb-utils';
import type { AssertNever } from '../models/ts-type-utils';


/**
 * TinyBase store for hosted lobby data
 * Provides reactive state management for hosted game lobbies
 */

export const TB_HOSTED_LOBBIES_STORE_NAME = 'tinybase_hosted_lobbies';

export const TB_HOSTED_LOBBIES_TABLE_KEY = 'hostedLobbies';

// Create the store
export const hostedLobbiesStore = createStore();

// Only create persister if localStorage is available (browser environment)
let persister: ReturnType<typeof createLocalPersister> | null = null;
if (typeof localStorage !== 'undefined') {
  persister = createLocalPersister(hostedLobbiesStore, TB_HOSTED_LOBBIES_STORE_NAME);
  // Create persister for automatic localStorage persistence
  persister.startAutoLoad();
  persister.startAutoSave();
}

export type GameLobbyUpdateFields = Partial<Omit<GameLobby, 'id' | 'createdAt'>>;

export type GameLobbyForTbStoreFields = z.infer<typeof GameLobbySchemaForTbStoreSchema>;

export type GameLobbyForTbStore = EnsureCells<GameLobbyForTbStoreFields>;

export type GameLobbyForTbStoreInvalidFields = AssertNever<
  InvalidCellFields<GameLobbyForTbStoreFields>
>;

export const serializeGameLobbyForTinybase = (
  gameLobby: GameLobby,
): GameLobbyForTbStore => {
  const { gameHostPlayerProfile, playerPool, gameTitle, gameInstanceId, playGameLink, ...rest } = gameLobby;
  const stringifiedGameHostPlayerProfile = GameHostPlayerProfileStringifier.stringify(gameHostPlayerProfile);
  const stringifiedPlayerPool = PlayerPoolStringifier.stringify(playerPool);

  const serialized: GameLobbyForTbStore = {
    ...rest,
    stringifiedGameHostPlayerProfile,
    stringifiedPlayerPool,
    gameTitle: gameTitle ?? '',
    gameInstanceId: gameInstanceId ?? '',
    playGameLink: playGameLink ?? '',
  };

  const retVal = GameLobbySchemaForTbStoreSchema.parse(serialized);

  return retVal;

  // return GameLobbySchemaForTbStore.parse({
  //   ...rest,
  //   stringifiedGameHostPlayerProfile,
  //   stringifiedPlayerPool,
  //   gameTitle: gameTitle ?? '',
  //   gameTableId: gameInstanceId ?? '',
  //   playGameLink: playGameLink ?? '',
  // });
};

export const deserializeGameLobbyFromTinybase = (
  tinybaseRow: GameLobbyForTbStore,
): GameLobby => {
  const { stringifiedGameHostPlayerProfile, stringifiedPlayerPool, gameTitle, gameInstanceId, playGameLink, ...rest } = tinybaseRow;
  const gameHostPlayerProfile = GameHostPlayerProfileStringifier.parseString(stringifiedGameHostPlayerProfile);
  const playerPool = PlayerPoolStringifier.parseString(stringifiedPlayerPool);

  const parsedGameTitle = gameTitle === '' ? undefined : BfgSupportedGameTitleSchema.parse(gameTitle);
  // const parsedGameTableId = gameTableId === '' ? undefined : BfgGameTableIdToolbox.idSchema.parse(gameTableId);
  const parsedGameInstanceId = gameInstanceId === '' ? undefined : BfgGameInstanceIdToolbox.idSchema.parse(gameInstanceId);
  const parsedPlayGameLink = playGameLink === '' ? undefined : playGameLink;

  return GameLobbySchema.parse({
    ...rest,
    gameHostPlayerProfile,
    playerPool,
    gameTitle: parsedGameTitle,
    // gameTableId: parsedGameTableId,
    gameInstanceId: parsedGameInstanceId,
    playGameLink: parsedPlayGameLink,
  });
};


/**
 * Safely parse hosted lobby data from TinyBase store
 */
export const parseRawHostedLobbyData = (lobbyId: string, rawData: unknown): GameLobby | null => {
  const result = GameLobbySchemaForTbStoreSchema.safeParse(rawData);

  if (!result.success) {
    console.error(`Error parsing hosted lobby data for ${lobbyId}:`, result.error);
    console.log("rawData", rawData);
    return null;
  }

  try {
    return deserializeGameLobbyFromTinybase(result.data);
  } catch (error) {
    console.error(`Error parsing hosted lobby data for ${lobbyId}:`, error);
    console.log("rawData", rawData);
    return null;
  }
};

/**
 * Add a new hosted lobby to the store
 */
export const addHostedLobby = async (lobby: GameLobby): Promise<boolean> => {
  // Validate the lobby data
  const validationResult = GameLobbySchema.safeParse(lobby);
  if (!validationResult.success) {
    console.error('Error validating lobby data:', validationResult.error);
    return false;
  }

  const lobbyId = lobby.id as GameLobbyId;

  hostedLobbiesStore.transaction(
    () => {
      const serializedLobby = serializeGameLobbyForTinybase(validationResult.data);
      hostedLobbiesStore.setRow(TB_HOSTED_LOBBIES_TABLE_KEY, lobbyId, serializedLobby);
      console.log("Hosted lobby added:", lobbyId);
      console.log("Hosted lobby added:", serializedLobby);
    },
  );

  return true;
};

/**
 * Update an existing hosted lobby
 */
export const updateHostedLobby = (
  lobbyId: GameLobbyId,
  updates: Partial<Omit<GameLobby, 'id' | 'createdAt'>>
): boolean => {
  try {
    const existingLobby = hostedLobbiesStore.getRow(TB_HOSTED_LOBBIES_TABLE_KEY, lobbyId);
    if (!existingLobby) {
      return false;
    }

    const existingParseResult = GameLobbySchemaForTbStoreSchema.safeParse(existingLobby);
    if (!existingParseResult.success) {
      console.error('Error parsing existing hosted lobby for update:', existingParseResult.error);
      return false;
    }

    const existingGameLobby = deserializeGameLobbyFromTinybase(existingParseResult.data);

    const updatedLobby: GameLobby = {
      ...existingGameLobby,
      ...updates,
    };

    // Validate the updated data
    const validationResult = GameLobbySchema.safeParse(updatedLobby);
    if (!validationResult.success) {
      console.error('Error validating updated lobby data:', validationResult.error);
      return false;
    }

    const serializedLobby = serializeGameLobbyForTinybase(validationResult.data);

    hostedLobbiesStore.setRow(TB_HOSTED_LOBBIES_TABLE_KEY, lobbyId, serializedLobby);
    return true;
  } catch (error) {
    console.error('Error updating hosted lobby:', error);
    return false;
  }
};


export const updateHostedLobbyPlayerPool = (
  lobbyId: GameLobbyId,
  playerPool: SharedPublicPlayerProfile[]
): boolean => {
  return updateHostedLobby(lobbyId, { playerPool });
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
