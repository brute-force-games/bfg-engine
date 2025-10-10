import { BfgSupportedGameTitle, GameDefinition } from "~/models/game-box-definition";
import { BfgGameEngineMetadata } from "~/models/bfg-game-engines";


export const GamesRegistry = new Map<BfgSupportedGameTitle, GameDefinition>();
export const GamesMetadataRegistry = new Map<BfgSupportedGameTitle, BfgGameEngineMetadata<any, any>>();


export interface IGameRegistry {
  getAvailableGameTitles: () => BfgSupportedGameTitle[];
  getGameDefinition: (gameTitle: BfgSupportedGameTitle) => GameDefinition;
  getGameMetadata: (gameTitle: BfgSupportedGameTitle) => BfgGameEngineMetadata<any, any>;
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

const getGameMetadata = (gameTitle: BfgSupportedGameTitle): BfgGameEngineMetadata<any, any> => {
  const metadata = GamesMetadataRegistry.get(gameTitle);
  if (!metadata) {
    throw new Error(`Game metadata not found for: ${gameTitle}`);
  }
  return metadata;
}

export const registerGame = (gameTitle: BfgSupportedGameTitle, gameDefinition: GameDefinition, gameMetadata: BfgGameEngineMetadata<any, any>) => {
  GamesRegistry.set(gameTitle, gameDefinition);
  GamesMetadataRegistry.set(gameTitle, gameMetadata);
}


export const useGameRegistry = (): IGameRegistry => {
  return {
    getAvailableGameTitles,
    getGameDefinition,
    getGameMetadata,
  };
}
