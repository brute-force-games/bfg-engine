import { GameLobby } from "@bfg-engine/models/p2p-lobby";
import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-ids";
import { validateLobby } from "./lobby-utils";
import { IGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry";


export const playerLeaveSeat = async (gameRegistry: IGameRegistry, lobby: GameLobby, playerId: PlayerProfileId): Promise<GameLobby | null> => {
  // Create updated lobby with the player removed from the seat

  const updatedPlayerPool = lobby.playerPool.filter(id => id !== playerId);

  const updatedLobby: GameLobby = {
    ...lobby,
    playerPool: updatedPlayerPool,
  };

  const isLobbyValid = validateLobby(gameRegistry, updatedLobby);
  
  const validatedLobby = {
    ...updatedLobby,
    isLobbyValid,
    updatedAt: Date.now(),
  };

  return validatedLobby;
}
