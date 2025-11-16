import { GameLobby } from "../../models/p2p-lobby";
import type { SharedPublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { validateLobby } from "./lobby-utils";
import { IGameRegistry } from "@bfg-engine/game-metadata/games-registry";


export const playerLeaveSeat = async (
  gameRegistry: IGameRegistry,
  lobby: GameLobby,
  playerProfile: SharedPublicPlayerProfile
): Promise<GameLobby> => {
  // Create updated lobby with the player removed from the seat

  if (!lobby.playerPool.some(p => p.id === playerProfile.id)) {
    return lobby;
  }

  const updatedPlayerPool = lobby.playerPool.filter(p => p.id !== playerProfile.id);

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
