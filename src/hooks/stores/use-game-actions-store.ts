import { useCallback } from 'react';
import { useTable } from 'tinybase/ui-react';
import { 
  gameActionsStore,
  getGameActionsTableName,
  // addGameAction,
  clearGameActions,
  clearAllGameActions,
} from '../../tb-store/hosted-game-actions-store';
import { GameTableId } from '../../models/types/bfg-branded-ids';
import { DbGameTableAction, DbGameTableActionSchema } from '../../models/game-table/game-table-action';

/**
 * React hooks for game actions management with TinyBase
 */

/**
 * Safely parse game action data from TinyBase reactive hooks
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
 * Hook to get all actions for a specific game table with reactive updates
 */
export const useGameActions = (gameTableId: GameTableId): DbGameTableAction[] => {
  const tableName = getGameActionsTableName(gameTableId);
  const rawActions = useTable(tableName, gameActionsStore);
  
  // Sort by index to maintain chronological order
  const sortedIndices = Object.keys(rawActions)
    .map(Number)
    .filter(n => !isNaN(n))
    .sort((a, b) => a - b);
  
  return sortedIndices
    .map(index => parseRawGameActionData(index.toString(), rawActions[index]))
    .filter((action): action is DbGameTableAction => action !== null);
};

/**
 * Hook to get a specific game action by index with reactive updates
 */
export const useGameAction = (gameTableId: GameTableId, actionIndex: number) => {
  const tableName = getGameActionsTableName(gameTableId);
  const rawActions = useTable(tableName, gameActionsStore);
  const rawActionData = rawActions[actionIndex];
  
  if (!rawActionData) {
    return null;
  }
  
  return parseRawGameActionData(actionIndex.toString(), rawActionData);
};

/**
 * Hook to get the latest action for a game table with reactive updates
 */
export const useLatestGameAction = (gameTableId: GameTableId) => {
  const actions = useGameActions(gameTableId);
  return actions.length > 0 ? actions[actions.length - 1] : null;
};

/**
 * Hook to get actions count for a game table with reactive updates
 */
export const useGameActionsCount = (gameTableId: GameTableId) => {
  const tableName = getGameActionsTableName(gameTableId);
  const rawActions = useTable(tableName, gameActionsStore);
  return Object.keys(rawActions).length;
};

/**
 * Hook for game actions management actions
 */
export const useGameActionsActions = () => {
  // const addAction = useCallback(async (
  //   gameTableId: GameTableId, 
  //   newAction: DbGameTableAction
  // ): Promise<{ success: boolean; actionId?: string; error?: string }> => {
  //   return await addGameAction(gameTableId, newAction);
  // }, []);

  const clearActions = useCallback((gameTableId: GameTableId): boolean => {
    return clearGameActions(gameTableId);
  }, []);

  const clearAllActions = useCallback((): void => {
    clearAllGameActions();
  }, []);

  return {
    // addAction,
    // addHostAction,
    // addPlayerAction,
    clearActions,
    clearAllActions,
  };
};

/**
 * Hook to get all game table IDs that have actions with reactive updates
 */
export const useGameTableIdsWithActions = () => {
  // We need to get all tables and filter for game action tables
  // Since TinyBase doesn't have a direct way to get all table names,
  // we'll use a different approach by checking if specific tables exist
  const allTables = gameActionsStore.getTables();
  const gameTableIds: GameTableId[] = [];
  
  Object.keys(allTables).forEach(tableName => {
    if (tableName.startsWith('bfg-game-actions-')) {
      const gameTableId = tableName.replace('bfg-game-actions-', '') as GameTableId;
      gameTableIds.push(gameTableId);
    }
  });
  
  return gameTableIds;
};

/**
 * Hook to get actions by action type for a specific game table
 */
export const useGameActionsByType = (gameTableId: GameTableId, actionType: string) => {
  const actions = useGameActions(gameTableId);
  return actions.filter(action => action.actionType === actionType);
};

/**
 * Hook to get actions by source for a specific game table
 */
export const useGameActionsBySource = (gameTableId: GameTableId, source: string) => {
  const actions = useGameActions(gameTableId);
  return actions.filter(action => action.source === source);
};

/**
 * Hook to get recent actions for a game table (sorted by creation date, most recent first)
 */
export const useRecentGameActions = (gameTableId: GameTableId, limit?: number) => {
  const actions = useGameActions(gameTableId);
  const sortedActions = actions.sort((a, b) => b.createdAt - a.createdAt);
  
  return limit ? sortedActions.slice(0, limit) : sortedActions;
};

/**
 * Hook to get actions within a time range for a game table
 */
export const useGameActionsInTimeRange = (
  gameTableId: GameTableId, 
  startTime: number, 
  endTime: number
) => {
  const actions = useGameActions(gameTableId);
  return actions.filter(action => 
    action.createdAt >= startTime && action.createdAt <= endTime
  );
};

/**
 * Hook to get game actions statistics for a specific game table
 */
export const useGameActionsStats = (gameTableId: GameTableId) => {
  const actions = useGameActions(gameTableId);
  
  const stats = {
    total: actions.length,
    byType: actions.reduce((acc, action) => {
      acc[action.actionType] = (acc[action.actionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    bySource: actions.reduce((acc, action) => {
      acc[action.source] = (acc[action.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    firstAction: actions.length > 0 ? actions[0] : null,
    lastAction: actions.length > 0 ? actions[actions.length - 1] : null,
    timeSpan: actions.length > 1 ? 
      actions[actions.length - 1].createdAt - actions[0].createdAt : 0,
  };
  
  return stats;
};

/**
 * Hook to check if a game table has any actions
 */
export const useHasGameActions = (gameTableId: GameTableId) => {
  const count = useGameActionsCount(gameTableId);
  return count > 0;
};

// /**
//  * Hook to get the action chain (all actions in order) for a game table
//  */
// export const useGameActionChain = (gameTableId: GameTableId) => {
//   const actions = useGameActions(gameTableId);
  
//   // Build the action chain by following the previousActionId links
//   const actionMap = new Map(actions.map(action => [action.id, action]));
//   const chain: DbGameTableAction[] = [];
  
//   // Find the latest action (the one with no next action)
//   const latestAction = actions.find(action => 
//     !actions.some(other => other.previousActionId === action.id)
//   );
  
//   if (latestAction) {
//     let currentAction: DbGameTableAction | null = latestAction;
//     while (currentAction) {
//       chain.unshift(currentAction); // Add to beginning to maintain chronological order
//       currentAction = currentAction.previousActionId ? 
//         actionMap.get(currentAction.previousActionId) || null : null;
//     }
//   }
  
//   return chain;
// };
