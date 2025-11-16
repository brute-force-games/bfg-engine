import { GameLobby } from "../../models/p2p-lobby";
import { PlayerProfileId } from "../../models/types/bfg-branded-uuids";
import { IGameRegistry } from "@bfg-engine/game-metadata/games-registry";
import { BfgSupportedGameTitle } from "@bfg-engine/models/game-box-definition";


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
