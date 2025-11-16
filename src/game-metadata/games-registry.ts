import type { BfgSupportedGameTitle, GameDefinition } from "../models/game-box-definition";
import type { BfgGameEngineMetadata } from "./metadata-types";


export const GamesRegistry = new Map<BfgSupportedGameTitle, GameDefinition>();

// export type GenericGameMetadata = BfgGameEngineMetadata<
//   BfgGameStateForHost,
//   BfgGameStateForPlayer,
//   BfgGameStateForWatcher,
//   BfgGameActionByPlayer,
//   BfgGameActionByHost
// >;

export type GenericGameMetadata = BfgGameEngineMetadata;

export const GamesMetadataRegistry = new Map<BfgSupportedGameTitle, GenericGameMetadata>();


export interface IGameRegistry {
  getAvailableGameTitles: () => BfgSupportedGameTitle[];
  getGameDefinition: (gameTitle: BfgSupportedGameTitle) => GameDefinition;
  getGameMetadata: (gameTitle: BfgSupportedGameTitle) => GenericGameMetadata;
}

export const registerGame = (gameMetadata: GenericGameMetadata) => {
  const { gameTitle, definition } = gameMetadata;
  GamesRegistry.set(gameTitle, definition);
  GamesMetadataRegistry.set(gameTitle, gameMetadata);
}


export const getGameMetadata = (gameTitle: BfgSupportedGameTitle): GenericGameMetadata => {
  const metadata = GamesMetadataRegistry.get(gameTitle);
  if (!metadata) {
    throw new Error(`Game metadata not found for: ${gameTitle}`);
  }
  return metadata;
}

export const getAvailableGameTitles = () => {
  const retVal = Array.from(GamesRegistry.keys());
  retVal.sort();
  return retVal;
}

export const getGameDefinition = (gameTitle: BfgSupportedGameTitle): GameDefinition => {
  const definition = GamesRegistry.get(gameTitle);
  if (!definition) {
    throw new Error(`Game definition not found for: ${gameTitle}`);
  }
  return definition;
}
