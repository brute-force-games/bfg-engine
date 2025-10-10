import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { GameTableId } from '~/models/types/bfg-branded-ids';
import { DbGameTableAction, DbGameTableActionSchema } from '~/models/game-table/game-table-action';

/**
 * TinyBase store for game actions data
 * Provides reactive state management for game table actions
 * Each game table has its own table: "bfg-game-actions-{gameTableId}"
 */

export const TB_GAME_ACTIONS_STORE_NAME = 'tinybase_game_actions';

// Create the store
export const gameActionsStore = createStore();
const persister = createLocalPersister(gameActionsStore, TB_GAME_ACTIONS_STORE_NAME);

// Create persister for automatic localStorage persistence
persister.startAutoLoad();
persister.startAutoSave();

/**
 * Get the table name for a specific game table's actions
 */
export const getGameActionsTableName = (gameTableId: GameTableId): string => {
  return `bfg-game-actions-${gameTableId}`;
};

/**
 * Safely parse game action data from TinyBase store
 */
const parseRawGameActionData = (actionId: string, rawData: any): DbGameTableAction | null => {
  const result = DbGameTableActionSchema.safeParse(rawData);
  
  if (!result.success) {
    console.error(`Error validating game action data for ${actionId}:`, result.error);
    return null;
  }
  
  return result.data;
};

/**
 * Get the next action index for a game table
 */
const getNextActionIndex = (gameTableId: GameTableId): number => {
  const tableName = getGameActionsTableName(gameTableId);
  const existingActions = gameActionsStore.getTable(tableName);
  const existingIndices = Object.keys(existingActions).map(Number).filter(n => !isNaN(n));
  
  if (existingIndices.length === 0) {
    return 0;
  }
  
  return Math.max(...existingIndices) + 1;
};

/**
 * Add a new game action to the store
 */
// id: BfgGameTableId.idSchema,
export const addGameAction = async (
  gameTableId: GameTableId, 
  newAction: DbGameTableAction
): Promise<{ success: boolean; actionId?: string; error?: string }> => {
  try {
    // Validate the action data
    const validationResult = DbGameTableActionSchema.safeParse(newAction);
    if (!validationResult.success) {
      console.error('Error validating game action data:', validationResult.error);
      return { success: false, error: 'Invalid action data' };
    }

    // Get the next action index
    const actionIndex = getNextActionIndex(gameTableId);
    const tableName = getGameActionsTableName(gameTableId);

    console.log("addGameAction: gameTableId", gameTableId);
    console.log("addGameAction: newAction", newAction);
    
    // Get the previous action ID (the last action in the chain)
    // const existingActions = gameActionsStore.getTable(tableName);
    // const existingIndices = Object.keys(existingActions).map(Number).filter(n => !isNaN(n));
    // const lastActionIndex = existingIndices.length > 0 ? Math.max(...existingIndices) : null;
    // const previousActionId = lastActionIndex !== null ? existingActions[lastActionIndex]?.id || null : null;

    // const gameActionId = BfgGameTableActionId.createId();

    // Create the complete action with ID and metadata
    const completeAction: DbGameTableAction = {
      ...newAction,
      // id: gameActionId, // Using a simple ID format
      gameTableId,
      // previousActionId,
    };

    // Validate the complete action
    const completeValidationResult = DbGameTableActionSchema.safeParse(completeAction);
    if (!completeValidationResult.success) {
      console.error('Error validating complete game action data:', completeValidationResult.error);
      return { success: false, error: 'Invalid complete action data' };
    }

    // Add to store
    gameActionsStore.setRow(tableName, actionIndex.toString(), completeAction);

    return { 
      success: true, 
      // actionId: completeAction.id,
    };
  } catch (error) {
    console.error('Error adding game action:', error);
    return { success: false, error: 'Failed to add action' };
  }
};

/**
 * Get all actions for a specific game table
 */
export const getGameActions = (gameTableId: GameTableId): DbGameTableAction[] => {
  try {
    const tableName = getGameActionsTableName(gameTableId);
    const rawActions = gameActionsStore.getTable(tableName);
    const actions: DbGameTableAction[] = [];
    
    // Sort by index to maintain chronological order
    const sortedIndices = Object.keys(rawActions)
      .map(Number)
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);
    
    sortedIndices.forEach(index => {
      const rawActionData = rawActions[index];
      const parsedAction = parseRawGameActionData(index.toString(), rawActionData);
      if (parsedAction) {
        actions.push(parsedAction);
      }
    });
    
    return actions;
  } catch (error) {
    console.error('Error getting game actions:', error);
    return [];
  }
};

/**
 * Get a specific game action by index
 */
export const getGameAction = (gameTableId: GameTableId, actionIndex: number): DbGameTableAction | null => {
  try {
    const tableName = getGameActionsTableName(gameTableId);
    const rawActionData = gameActionsStore.getRow(tableName, actionIndex.toString());
    
    if (!rawActionData) {
      return null;
    }
    
    return parseRawGameActionData(actionIndex.toString(), rawActionData);
  } catch (error) {
    console.error('Error getting game action:', error);
    return null;
  }
};

/**
 * Get the latest action for a game table
 */
export const getLatestGameAction = (gameTableId: GameTableId): DbGameTableAction | null => {
  try {
    const actions = getGameActions(gameTableId);
    return actions.length > 0 ? actions[actions.length - 1] : null;
  } catch (error) {
    console.error('Error getting latest game action:', error);
    return null;
  }
};

/**
 * Get actions count for a game table
 */
export const getGameActionsCount = (gameTableId: GameTableId): number => {
  try {
    const tableName = getGameActionsTableName(gameTableId);
    const rawActions = gameActionsStore.getTable(tableName);
    return Object.keys(rawActions).length;
  } catch (error) {
    console.error('Error getting game actions count:', error);
    return 0;
  }
};

/**
 * Clear all actions for a specific game table
 */
export const clearGameActions = (gameTableId: GameTableId): boolean => {
  try {
    const tableName = getGameActionsTableName(gameTableId);
    gameActionsStore.delTable(tableName);
    return true;
  } catch (error) {
    console.error('Error clearing game actions:', error);
    return false;
  }
};

/**
 * Clear all game actions from all tables (for testing/debugging)
 */
export const clearAllGameActions = (): void => {
  try {
    const allTables = gameActionsStore.getTables();
    Object.keys(allTables).forEach(tableName => {
      if (tableName.startsWith('bfg-game-actions-')) {
        gameActionsStore.delTable(tableName);
      }
    });
  } catch (error) {
    console.error('Error clearing all game actions:', error);
  }
};

/**
 * Get all game table IDs that have actions
 */
export const getGameTableIdsWithActions = (): GameTableId[] => {
  try {
    const allTables = gameActionsStore.getTables();
    const gameTableIds: GameTableId[] = [];
    
    Object.keys(allTables).forEach(tableName => {
      if (tableName.startsWith('bfg-game-actions-')) {
        const gameTableId = tableName.replace('bfg-game-actions-', '') as GameTableId;
        gameTableIds.push(gameTableId);
      }
    });
    
    return gameTableIds;
  } catch (error) {
    console.error('Error getting game table IDs with actions:', error);
    return [];
  }
};
