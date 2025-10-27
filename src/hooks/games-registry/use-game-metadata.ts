import { useGameRegistry } from "./games-registry";
import { BfgSupportedGameTitle } from "~/models/game-box-definition";


export const useGameMetadata = (gameTitle: BfgSupportedGameTitle) => 
{
  const registry = useGameRegistry();
  const gameMetadata = registry.getGameMetadata(gameTitle);
  if (!gameMetadata) {
    throw new Error(`Game metadata not found for: ${gameTitle}`);
  }
  return gameMetadata;
}
