import { GameLobby } from "~/models/p2p-lobby";
import { PlayerProfileId } from "~/models/types/bfg-branded-ids";
import { IGameRegistry } from "~/hooks/games-registry/games-registry";
import { BfgSupportedGameTitle } from "~/models/game-box-definition";


export const playerSetGameChoice = async (gameRegistry: IGameRegistry, lobby: GameLobby, playerId: PlayerProfileId, gameChoice: BfgSupportedGameTitle): Promise<GameLobby | null> => {
  console.log('playerSetGameChoice', lobby, playerId, gameChoice);

  const gameMetadata = gameRegistry.getGameDefinition(gameChoice);

  const minNumPlayers = gameMetadata.minNumPlayersForGame;
  const maxNumPlayers = gameMetadata.maxNumPlayersForGame;
  const numPlayers = lobby.playerPool.length;

  const isLobbyValid = numPlayers >= minNumPlayers && numPlayers <= maxNumPlayers;
  
  const updatedLobby: GameLobby = {
    ...lobby,
    gameTitle: gameChoice,
    minNumPlayers,
    maxNumPlayers,
    isLobbyValid,
    updatedAt: Date.now(),
  };
  return updatedLobby;
}
