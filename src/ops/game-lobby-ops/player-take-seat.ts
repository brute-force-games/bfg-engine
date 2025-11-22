import { GameLobby } from "../../models/p2p-lobby";
import type { PublicPlayerProfile } from "../../models/internal/player-profile/public-player-profile";
import { validateLobby } from "./lobby-utils";
import { IGameRegistry } from "@bfg-engine/game-metadata/games-registry";


export const playerTakeSeat = async (gameRegistry: IGameRegistry, lobby: GameLobby, player: PublicPlayerProfile): Promise<GameLobby> => {
  // Create updated lobby with the player assigned to the seat

  if (lobby.playerPool.some(p => p.id === player.id)) {
    return lobby;
  }

  const updatedPlayerPool = [...lobby.playerPool.filter(p => 
    p.id !== player.id), player];

  const updatedLobby: GameLobby = {
    ...lobby,
    playerPool: updatedPlayerPool,
  };

  const invalidLobbyReasons = validateLobby(gameRegistry, updatedLobby);
  const isLobbyValid = invalidLobbyReasons.length === 0;

  const validatedLobby = {
    ...updatedLobby,
    isLobbyValid,
    updatedAt: Date.now(),
  };

  return validatedLobby;
}
