import { BfgSupportedGameTitle, GameDefinition } from "../../models/game-box-definition";
import { BfgGameEngineMetadata } from "../../models/bfg-game-engines";


export const GamesRegistry = new Map<BfgSupportedGameTitle, GameDefinition>();
export const GamesMetadataRegistry = new Map<BfgSupportedGameTitle, BfgGameEngineMetadata>();


export interface IGameRegistry {
  getAvailableGameTitles: () => BfgSupportedGameTitle[];
  getGameDefinition: (gameTitle: BfgSupportedGameTitle) => GameDefinition;
  getGameMetadata: (gameTitle: BfgSupportedGameTitle) => BfgGameEngineMetadata;
}


const getAvailableGameTitles = () => {
  const retVal = Array.from(GamesRegistry.keys());
  retVal.sort();
  return retVal;
}

const getGameDefinition = (gameTitle: BfgSupportedGameTitle): GameDefinition => {
  const definition = GamesRegistry.get(gameTitle);
  if (!definition) {
    throw new Error(`Game definition not found for: ${gameTitle}`);
  }
  return definition;
}

const getGameMetadata = (gameTitle: BfgSupportedGameTitle): BfgGameEngineMetadata => {
  const metadata = GamesMetadataRegistry.get(gameTitle);
  if (!metadata) {
    throw new Error(`Game metadata not found for: ${gameTitle}`);
  }
  return metadata;
}

export const registerGame = (gameMetadata: BfgGameEngineMetadata) => {
  const { gameTitle, definition } = gameMetadata;
  GamesRegistry.set(gameTitle, definition);
  GamesMetadataRegistry.set(gameTitle, gameMetadata);
}


export const useGameRegistry = (): IGameRegistry => {
  return {
    getAvailableGameTitles,
    getGameDefinition,
    getGameMetadata,
  };
}
