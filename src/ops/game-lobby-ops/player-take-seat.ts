import { GameLobby } from "~/models/p2p-lobby";
import { PlayerProfileId } from "~/models/types/bfg-branded-ids";
import { validateLobby } from "./lobby-utils";
import { IGameRegistry } from "~/hooks/games-registry/games-registry";


export const playerTakeSeat = async (gameRegistry: IGameRegistry, lobby: GameLobby, playerId: PlayerProfileId): Promise<GameLobby | null> => {
  // Create updated lobby with the player assigned to the seat

  const updatedPlayerPool = [...lobby.playerPool.filter(id => id !== playerId), playerId];

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
