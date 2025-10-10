import { IGameRegistry } from "~/hooks/games-registry/games-registry";
import { GameLobby } from "~/models/p2p-lobby";


export const validateLobby = (gameRegistry: IGameRegistry, lobby: GameLobby): boolean => {
  if (!lobby.gameTitle) {
    return false;
  }

  const numPlayers = lobby.playerPool.length;

  const gameDefinition = gameRegistry.getGameDefinition(lobby.gameTitle);
  
  const isValidNumberOfPlayers = numPlayers >= gameDefinition.minNumPlayersForGame && numPlayers <= gameDefinition.maxNumPlayersForGame;
  return isValidNumberOfPlayers;
}
