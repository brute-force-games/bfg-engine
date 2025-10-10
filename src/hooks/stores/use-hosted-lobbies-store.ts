import { useCallback } from 'react';
import { useTable } from 'tinybase/ui-react';
import { 
  hostedLobbiesStore,
  TB_HOSTED_LOBBIES_TABLE_KEY,
  addHostedLobby,
  updateHostedLobby,
  deleteHostedLobby,
  clearAllHostedLobbies,
  parseRawHostedLobbyData,
  GameLobbyUpdateFields,
  updateHostedLobbyPlayerPool,
} from '~/tb-store/hosted-lobbies-store';
import { GameLobbyId, PlayerProfileId } from '~/models/types/bfg-branded-ids';
import { GameLobby } from '~/models/p2p-lobby';

/**
 * React hooks for hosted lobby management with TinyBase
 */

/**
 * Hook to get all hosted lobbies with reactive updates
 */
export const useHostedLobbies = () => {
  const rawLobbies = useTable(TB_HOSTED_LOBBIES_TABLE_KEY, hostedLobbiesStore);
  
  return Object.entries(rawLobbies)
    .map(([id, rawLobbyData]) => parseRawHostedLobbyData(id, rawLobbyData))
    .filter((lobby): lobby is GameLobby => lobby !== null);
};

/**
 * Hook to get a specific hosted lobby by ID with reactive updates
 */
export const useHostedLobby = (lobbyId: GameLobbyId) => {
  const rawLobbies = useTable(TB_HOSTED_LOBBIES_TABLE_KEY, hostedLobbiesStore);
  // console.log('rawLobbies', rawLobbies);
  const rawLobbyData = rawLobbies[lobbyId];
  
  if (!rawLobbyData) {
    return null;
  }
  
  return parseRawHostedLobbyData(lobbyId, rawLobbyData);
};

/**
 * Hook to get hosted lobbies by host player profile ID with reactive updates
 */
export const useHostedLobbiesByHost = (hostPlayerId: string) => {
  const allLobbies = useHostedLobbies();
  return allLobbies.filter(lobby => lobby.gameHostPlayerProfile.id === hostPlayerId);
};

/**
 * Hook to get hosted lobbies by game title with reactive updates
 */
export const useHostedLobbiesByTitle = (gameTitle: string) => {
  const allLobbies = useHostedLobbies();
  return allLobbies.filter(lobby => lobby.gameTitle === gameTitle);
};

/**
 * Hook to get hosted lobbies by status description with reactive updates
 */
export const useHostedLobbiesByStatus = (statusDescription: string) => {
  const allLobbies = useHostedLobbies();
  return allLobbies.filter(lobby => lobby.currentStatusDescription === statusDescription);
};


/**
 * Hook to get hosted lobbies count with reactive updates
 */
export const useHostedLobbiesCount = () => {
  const rawLobbies = useTable(TB_HOSTED_LOBBIES_TABLE_KEY, hostedLobbiesStore);
  return Object.keys(rawLobbies).length;
};

/**
 * Hook for hosted lobby management actions
 */
export const useHostedLobbyActions = () => {
  const addLobby = useCallback(async (lobby: GameLobby): Promise<boolean> => {
    return await addHostedLobby(lobby);
  }, []);

  const updateLobby = useCallback((
    lobbyId: GameLobbyId, 
    updates: GameLobbyUpdateFields
  ): boolean => {
    return updateHostedLobby(lobbyId, updates);
  }, []);

  const updateLobbyPlayerPool = useCallback((
    lobbyId: GameLobbyId, 
    playerPool: PlayerProfileId[]
  ): boolean => {
    return updateHostedLobbyPlayerPool(lobbyId, playerPool);
  }, []);

  const removeLobby = useCallback((lobbyId: GameLobbyId): boolean => {
    return deleteHostedLobby(lobbyId);
  }, []);

  const clearAll = useCallback((): void => {
    clearAllHostedLobbies();
  }, []);
  

  return {
    addLobby,
    updateLobby,
    updateLobbyPlayerPool,
    removeLobby,
    clearAll,
  };
};

/**
 * Hook to get active lobbies (lobbies that are not finished)
 */
export const useActiveHostedLobbies = () => {
  const allLobbies = useHostedLobbies();
  return allLobbies.filter(lobby => 
    !lobby.currentStatusDescription.includes('complete') &&
    !lobby.currentStatusDescription.includes('abandoned') &&
    !lobby.currentStatusDescription.includes('error')
  );
};

/**
 * Hook to get finished lobbies
 */
export const useFinishedHostedLobbies = () => {
  const allLobbies = useHostedLobbies();
  return allLobbies.filter(lobby => 
    lobby.currentStatusDescription.includes('complete') ||
    lobby.currentStatusDescription.includes('abandoned') ||
    lobby.currentStatusDescription.includes('error')
  );
};

/**
 * Hook to get lobbies that are waiting for players
 */
export const useWaitingHostedLobbies = () => {
  const allLobbies = useHostedLobbies();
  return allLobbies.filter(lobby => 
    lobby.currentStatusDescription.includes('waiting') ||
    lobby.currentStatusDescription.includes('lobby') ||
    lobby.currentStatusDescription.includes('open')
  );
};

/**
 * Hook to get lobbies that are currently in progress
 */
export const useInProgressHostedLobbies = () => {
  const allLobbies = useHostedLobbies();
  return allLobbies.filter(lobby => 
    lobby.currentStatusDescription.includes('in progress') ||
    lobby.currentStatusDescription.includes('playing')
  );
};

/**
 * Hook to get recent lobbies (sorted by creation date, most recent first)
 */
export const useRecentHostedLobbies = (limit?: number) => {
  const allLobbies = useHostedLobbies();
  const sortedLobbies = allLobbies.sort((a, b) => 
    b.createdAt - a.createdAt
  );
  
  return limit ? sortedLobbies.slice(0, limit) : sortedLobbies;
};

/**
 * Hook to get lobbies statistics
 */
export const useHostedLobbiesStats = () => {
  const allLobbies = useHostedLobbies();
  
  const stats = {
    total: allLobbies.length,
    active: allLobbies.filter(lobby => 
      !lobby.currentStatusDescription.includes('complete') &&
      !lobby.currentStatusDescription.includes('abandoned') &&
      !lobby.currentStatusDescription.includes('error')
    ).length,
    finished: allLobbies.filter(lobby => 
      lobby.currentStatusDescription.includes('complete') ||
      lobby.currentStatusDescription.includes('abandoned') ||
      lobby.currentStatusDescription.includes('error')
    ).length,
    waiting: allLobbies.filter(lobby => 
      lobby.currentStatusDescription.includes('waiting') ||
      lobby.currentStatusDescription.includes('lobby') ||
      lobby.currentStatusDescription.includes('open')
    ).length,
    inProgress: allLobbies.filter(lobby => 
      lobby.currentStatusDescription.includes('in progress') ||
      lobby.currentStatusDescription.includes('playing')
    ).length,
  };
  
  return stats;
};

// /**
//  * Hook to get lobbies with specific seat count
//  */
// export const useLobbiesBySeatCount = (seatCount: number) => {
//   const allLobbies = useHostedLobbies();
//   return allLobbies.filter(lobby => {
//     const occupiedSeats = [lobby.p1, lobby.p2, lobby.p3, lobby.p4, lobby.p5, lobby.p6, lobby.p7, lobby.p8]
//       .filter(seat => seat !== undefined).length;
//     return occupiedSeats === seatCount;
//   });
// };

// /**
//  * Hook to get lobbies with available seats for a specific number of players
//  */
// export const useLobbiesWithSeatsFor = (playerCount: number) => {
//   const allLobbies = useHostedLobbies();
//   return allLobbies.filter(lobby => {
//     const occupiedSeats = [lobby.p1, lobby.p2, lobby.p3, lobby.p4, lobby.p5, lobby.p6, lobby.p7, lobby.p8]
//       .filter(seat => seat !== undefined).length;
//     return (occupiedSeats + playerCount) <= 8; // Assuming max 8 players
//   });
// };
