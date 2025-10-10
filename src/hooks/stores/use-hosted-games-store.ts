import { useCallback } from 'react';
import { useTable } from 'tinybase/ui-react';
import { 
  hostedGamesStore,
  TB_HOSTED_GAMES_TABLE_KEY,
  updateHostedGame,
  deleteHostedGame,
  clearAllHostedGames,
  clearAllStores,
  parseRawHostedGameData,
} from '~/tb-store/hosted-games-store';
import { GameTableId } from '~/models/types/bfg-branded-ids';
import { GameTable } from '~/models/game-table/game-table';

/**
 * React hooks for hosted game management with TinyBase
 */

/**
 * Hook to get all hosted games with reactive updates
 */
export const useHostedGames = () => {
  const rawGames = useTable(TB_HOSTED_GAMES_TABLE_KEY, hostedGamesStore);
  
  return Object.entries(rawGames)
    .map(([id, rawGameData]) => parseRawHostedGameData(id, rawGameData))
    .filter((game): game is GameTable => game !== null);
};

/**
 * Hook to get a specific hosted game by ID with reactive updates
 */
export const useHostedGame = (gameId: GameTableId): GameTable | null => {
  // const rawGames = useTable(TB_HOSTED_GAMES_TABLE_KEY, hostedGamesStore);
  const rawGames = useHostedGames();
  const rawGameData = rawGames.find(game => game.id === gameId);

  // console.log("rawGameData", rawGameData);
  
  if (!rawGameData) {
    return null;
  }
  
  return parseRawHostedGameData(gameId, rawGameData);
};

// /**
//  * Hook to get hosted games by host player profile ID with reactive updates
//  */
// export const useHostedGamesByHost = (hostPlayerId: string) => {
//   const allGames = useHostedGames();
//   return allGames.filter(game => game.gameHostPlayerProfileId === hostPlayerId);
// };

// /**
//  * Hook to get hosted games by game title with reactive updates
//  */
// export const useHostedGamesByTitle = (gameTitle: string) => {
//   const allGames = useHostedGames();
//   return allGames.filter(game => game.gameTitle === gameTitle);
// };

// /**
//  * Hook to get hosted games by table phase with reactive updates
//  */
// export const useHostedGamesByPhase = (tablePhase: string) => {
//   const allGames = useHostedGames();
//   return allGames.filter(game => game.tablePhase === tablePhase);
// };

/**
 * Hook to get hosted games count with reactive updates
 */
export const useHostedGamesCount = () => {
  const rawGames = useTable(TB_HOSTED_GAMES_TABLE_KEY, hostedGamesStore);
  return Object.keys(rawGames).length;
};

/**
 * Hook for hosted game management actions
 */
export const useHostedGameActions = () => {
  // const addGame = useCallback(async (gameTable: GameTable, initialAction: DbGameTableAction): Promise<boolean> => {
  //   return await addHostedGame(gameTable, initialAction);
  // }, []);

  const updateGame = useCallback((
    gameId: GameTableId, 
    updates: Partial<Omit<GameTable, 'id' | 'createdAt'>>
  ): boolean => {
    return updateHostedGame(gameId, updates);
  }, []);

  const removeGame = useCallback((gameId: GameTableId): boolean => {
    return deleteHostedGame(gameId);
  }, []);

  const clearAll = useCallback((): void => {
    clearAllHostedGames();
  }, []);

  const clearAllStoresComprehensive = useCallback((): void => {
    clearAllStores();
  }, []);

  return {
    // addGame,
    updateGame,
    removeGame,
    clearAll,
    clearAllStores: clearAllStoresComprehensive,
  };
};

/**
 * Hook to get active hosted games (games that are not finished)
 */
export const useActiveHostedGames = () => {
  const allGames = useHostedGames();
  return allGames.filter(game => 
    game.tablePhase !== 'table-phase-game-complete-with-winners' && 
    game.tablePhase !== 'table-phase-game-complete-with-draw' &&
    game.tablePhase !== 'table-phase-game-abandoned' &&
    game.tablePhase !== 'table-phase-error'
  );
};

/**
 * Hook to get finished hosted games
 */
export const useFinishedHostedGames = () => {
  const allGames = useHostedGames();
  return allGames.filter(game => 
    game.tablePhase === 'table-phase-game-complete-with-winners' || 
    game.tablePhase === 'table-phase-game-complete-with-draw' ||
    game.tablePhase === 'table-phase-game-abandoned' ||
    game.tablePhase === 'table-phase-error'
  );
};

/**
 * Hook to get hosted games that are waiting for players
 */
export const useWaitingHostedGames = () => {
  const allGames = useHostedGames();
  return allGames.filter(game => 
    game.tablePhase === 'table-phase-lobby'
  );
};

/**
 * Hook to get hosted games that are currently in progress
 */
export const useInProgressHostedGames = () => {
  const allGames = useHostedGames();
  return allGames.filter(game => 
    game.tablePhase === 'table-phase-game-in-progress'
  );
};

/**
 * Hook to get recent hosted games (sorted by creation date, most recent first)
 */
export const useRecentHostedGames = (limit?: number) => {
  const allGames = useHostedGames();
  const sortedGames = allGames.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return limit ? sortedGames.slice(0, limit) : sortedGames;
};

/**
 * Hook to get hosted games statistics
 */
export const useHostedGamesStats = () => {
  const allGames = useHostedGames();
  
  const stats = {
    total: allGames.length,
    active: allGames.filter(game => 
      game.tablePhase !== 'table-phase-game-complete-with-winners' && 
      game.tablePhase !== 'table-phase-game-complete-with-draw' &&
      game.tablePhase !== 'table-phase-game-abandoned' &&
      game.tablePhase !== 'table-phase-error'
    ).length,
    finished: allGames.filter(game => 
      game.tablePhase === 'table-phase-game-complete-with-winners' || 
      game.tablePhase === 'table-phase-game-complete-with-draw' ||
      game.tablePhase === 'table-phase-game-abandoned' ||
      game.tablePhase === 'table-phase-error'
    ).length,
    waiting: allGames.filter(game => 
      game.tablePhase === 'table-phase-lobby'
    ).length,
    inProgress: allGames.filter(game => 
      game.tablePhase === 'table-phase-game-in-progress'
    ).length,
  };
  
  return stats;
};
