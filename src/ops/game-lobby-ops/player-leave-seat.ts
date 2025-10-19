import { GameLobby } from "../../models/p2p-lobby";
import { PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { validateLobby } from "./lobby-utils";
import { IGameRegistry } from "../../hooks/games-registry/games-registry";


export const playerLeaveSeat = async (
  gameRegistry: IGameRegistry,
  lobby: GameLobby,
  playerProfileId: PlayerProfileId
): Promise<GameLobby | null> => {
  // Create updated lobby with the player removed from the seat

  const updatedPlayerPool = lobby.playerPool.filter(id => id !== playerProfileId);

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
