import { useCallback } from "react";
import type { BfgGameTableId } from "../../models/types/bfg-branded-uuids";
import { clearAllHostedLobbies } from "../../tb-store/hosted-lobbies-store";
import { clearAllGameArchives } from "../../tb-store/games-archives-store";


const clearAllTbStores = (): void => {
  clearAllHostedLobbies();
  clearAllGameArchives();
  
  console.log('All stores cleared successfully');
};


export const useTbStoresManager = () => {
  // const addGame = useCallback(async (gameTable: GameTable, initialAction: DbGameTableAction): Promise<boolean> => {
  //   return await addHostedGame(gameTable, initialAction);
  // }, []);

  // const updateGame = useCallback((
  //   gameId: BfgGameTableId, 
  //   updates: Partial<Omit<GameTable, 'id' | 'createdAt'>>
  // ): boolean => {
  //   return updateHostedGame(gameId, updates);
  // }, []);

  const removeGame = useCallback((_gameId: BfgGameTableId): boolean => {
    // return deleteGameArchive(gameId);
    console.warn("not implemented");
    return false;
  }, []);

  const clearAllGameArchives = useCallback((): void => {
    clearAllGameArchives();
  }, []);

  // const clearAllStoresComprehensive = useCallback((): void => {
  //   clearAllTbStores();
  // }, []);

  return {
    // addGame,
    // updateGame,
    removeGame,
    // clearAll,
    clearAllStores: clearAllTbStores,
  };
};
