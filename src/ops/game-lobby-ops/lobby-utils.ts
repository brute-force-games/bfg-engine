import { IGameRegistry } from "../../hooks/games-registry/games-registry";
import { InvalidLobbyReason, GameLobby, InvalidLobbyReasonSchema } from "../../models/p2p-lobby";


export const validateLobby = (gameRegistry: IGameRegistry, lobby: GameLobby): InvalidLobbyReason[] => {

  if (!lobby.gameTitle) {
    return [InvalidLobbyReasonSchema.parse("Game selection is required")];
  }

  const numPlayers = lobby.playerPool.length;

  const gameDefinition = gameRegistry.getGameDefinition(lobby.gameTitle);
  
  const isValidNumberOfPlayers = numPlayers >= gameDefinition.minNumPlayersForGame && numPlayers <= gameDefinition.maxNumPlayersForGame;
  if (!isValidNumberOfPlayers) {
    if (gameDefinition.minNumPlayersForGame === gameDefinition.maxNumPlayersForGame) {
      return [InvalidLobbyReasonSchema.parse(`${lobby.gameTitle} requires ${gameDefinition.minNumPlayersForGame} players`)];
    }
    return [InvalidLobbyReasonSchema.parse(`${lobby.gameTitle} requires ${gameDefinition.minNumPlayersForGame} to ${gameDefinition.maxNumPlayersForGame} players`)];
  }

  return [];
}
