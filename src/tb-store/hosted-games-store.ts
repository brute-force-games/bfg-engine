import { z } from 'zod';
import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { GameTableId } from '../models/types/bfg-branded-ids';
import { GameTable, GameTableSchema } from '../models/game-table/game-table';
import { clearAllGameActions } from './hosted-game-actions-store';
import { clearAllHostedLobbies } from './hosted-lobbies-store';

/**
 * TinyBase store for hosted game data
 * Provides reactive state management for hosted game tables
 */

export const TB_HOSTED_GAMES_STORE_NAME = 'tinybase_hosted_games';

export const TB_HOSTED_GAMES_TABLE_KEY = 'hostedGames';
export const TB_HOSTED_GAMES_ACTIONS_TABLE_KEY = 'hostedGamesActions';

// Create the store
export const hostedGamesStore = createStore();
const persister = createLocalPersister(hostedGamesStore, TB_HOSTED_GAMES_STORE_NAME);

// Create persister for automatic localStorage persistence
persister.startAutoLoad();
persister.startAutoSave();


const TbStoreGameTableSchema = GameTableSchema
  .omit({
    // gameHostPlayerProfile: true,
    // playerPool: true,
  })
  .extend({
    // playerPoolCsvStr: z.string(),
    // gameHostPlayerProfileJsonStr: PublicPlayerProfileJsonStrSchema,
  });
type TbStoreGameTable = z.infer<typeof TbStoreGameTableSchema>;

export type GameTableUpdateFields = Partial<Omit<TbStoreGameTable, 'id' | 'createdAt' | 'gameHostPlayerProfile' | 'playerPool'>>;


/**
 * Safely parse hosted game data from TinyBase store
 */
export const parseRawHostedGameData = (gameId: string, rawData: any): GameTable | null => {
  const result = GameTableSchema.safeParse(rawData);
  
  if (!result.success) {
    console.error(`Error parsing hosted game data for ${gameId}:`, result.error);
    console.log("rawData", rawData);
    return null;
  }
  
  return result.data;
};

/**
 * Add a new hosted game to the store
 */
export const addHostedGame = async (gameTable: GameTable): Promise<boolean> => {
  // try {
    // Validate the game table data
    const validationResult = GameTableSchema.safeParse(gameTable);
    if (!validationResult.success) {
      console.error('Error validating game table data:', validationResult.error);
      return false;
    }

    // const validationResultAction = DbGameTableActionSchema.safeParse(initialAction);
    // if (!validationResultAction.success) {
    //   console.error('Error validating initial action data:', validationResultAction.error);
    //   return false;
    // }

    const gameTableId = gameTable.id as GameTableId;

    hostedGamesStore.transaction(
      () => {
        hostedGamesStore.setRow(TB_HOSTED_GAMES_TABLE_KEY, gameTableId, gameTable);
        console.log("Hosted game added:", gameTableId);
        console.log("Hosted game added:", gameTable);
        // addGameAction(gameTableId, initialAction);
        // hostedGamesStore.setRow(TB_HOSTED_GAMES_ACTIONS_TABLE_KEY, initialAction.id, initialAction as any);
      },
    );

    return true;
  // } catch (error) {
  //   console.error('Error adding hosted game:', error);
  //   return false;
  // }
};

/**
 * Update an existing hosted game
 */
export const updateHostedGame = (
  gameId: GameTableId,
  updates: Partial<Omit<GameTable, 'id' | 'createdAt'>>
): boolean => {
  try {
    const existingGame = hostedGamesStore.getRow(TB_HOSTED_GAMES_TABLE_KEY, gameId);
    if (!existingGame) {
      return false;
    }
    
    const updatedGame = {
      ...existingGame,
      ...updates,
    };
    
    // Validate the updated data
    const validationResult = GameTableSchema.safeParse(updatedGame);
    if (!validationResult.success) {
      console.error('Error validating updated game table data:', validationResult.error);
      return false;
    }
    
    hostedGamesStore.setRow(TB_HOSTED_GAMES_TABLE_KEY, gameId, updatedGame);
    return true;
  } catch (error) {
    console.error('Error updating hosted game:', error);
    return false;
  }
};

/**
 * Delete a hosted game
 */
export const deleteHostedGame = (gameId: GameTableId): boolean => {
  try {
    const existingGame = hostedGamesStore.getRow(TB_HOSTED_GAMES_TABLE_KEY, gameId);
    if (!existingGame) {
      return false;
    }
    
    // Remove from store
    hostedGamesStore.delRow(TB_HOSTED_GAMES_TABLE_KEY, gameId);
    return true;
  } catch (error) {
    console.error('Error deleting hosted game:', error);
    return false;
  }
};

/**
 * Get a hosted game by ID
 */
export const getHostedGame = (gameId: GameTableId): GameTable | null => {
  try {
    const rawGameData = hostedGamesStore.getRow(TB_HOSTED_GAMES_TABLE_KEY, gameId);
    if (!rawGameData) {
      return null;
    }
    
    return parseRawHostedGameData(gameId, rawGameData);
  } catch (error) {
    console.error('Error getting hosted game:', error);
    return null;
  }
};

/**
 * Get all hosted games
 */
export const getAllHostedGames = (): GameTable[] => {
  try {
    const rawGames = hostedGamesStore.getTable(TB_HOSTED_GAMES_TABLE_KEY);
    const games: GameTable[] = [];
    
    Object.entries(rawGames).forEach(([id, rawGameData]) => {
      const parsedGame = parseRawHostedGameData(id, rawGameData);
      if (parsedGame) {
        games.push(parsedGame);
      }
    });
    
    return games;
  } catch (error) {
    console.error('Error getting all hosted games:', error);
    return [];
  }
};

/**
 * Get hosted games by host player profile ID
 */
export const getHostedGamesByHost = (hostPlayerId: string): GameTable[] => {
  try {
    const allGames = getAllHostedGames();
    return allGames.filter(game => game.gameHostPlayerProfileId === hostPlayerId);
  } catch (error) {
    console.error('Error getting hosted games by host:', error);
    return [];
  }
};

/**
 * Get hosted games by game title
 */
export const getHostedGamesByTitle = (gameTitle: string): GameTable[] => {
  try {
    const allGames = getAllHostedGames();
    return allGames.filter(game => game.gameTitle === gameTitle);
  } catch (error) {
    console.error('Error getting hosted games by title:', error);
    return [];
  }
};

/**
 * Get hosted games by table phase
 */
export const getHostedGamesByPhase = (tablePhase: string): GameTable[] => {
  try {
    const allGames = getAllHostedGames();
    return allGames.filter(game => game.tablePhase === tablePhase);
  } catch (error) {
    console.error('Error getting hosted games by phase:', error);
    return [];
  }
};

/**
 * Clear all hosted games (for testing/debugging)
 */
export const clearAllHostedGames = (): void => {
  hostedGamesStore.delTable(TB_HOSTED_GAMES_TABLE_KEY);
  
  // Also clear all game actions to prevent cross-contamination
  clearAllGameActions();
};

/**
 * Clear all stores (games, lobbies, and actions) - comprehensive cleanup
 */
export const clearAllStores = (): void => {
  // Clear hosted games and their actions
  clearAllHostedGames();
  
  // Clear hosted lobbies
  clearAllHostedLobbies();
  
  console.log('All stores cleared successfully');
};

/**
 * Get hosted games count
 */
export const getHostedGamesCount = (): number => {
  try {
    const rawGames = hostedGamesStore.getTable(TB_HOSTED_GAMES_TABLE_KEY);
    return Object.keys(rawGames).length;
  } catch (error) {
    console.error('Error getting hosted games count:', error);
    return 0;
  }
};
