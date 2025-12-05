import type { BfgSupportedGameTitle, GameDefinition } from "../../models/game-box-definition";
import type { IBfgGameMetadataSchemas } from "../new-metadata/new-bfg-metadata";
import type { INewBfgGameMetadata } from "../new-metadata/new-bfg-metadata-impl";
// import type { BfgGameEngineMetadata } from "./metadata-types";


export const NewGameDefinitions = new Map<BfgSupportedGameTitle, GameDefinition>();
export const NewGamesMetadataRegistry = new Map<BfgSupportedGameTitle, INewBfgGameMetadata>();


export interface INewGameRegistry {
  getAvailableGameTitles: () => BfgSupportedGameTitle[];
  getGameDefinition: (gameTitle: BfgSupportedGameTitle) => GameDefinition;
  getGameMetadata: (gameTitle: BfgSupportedGameTitle) => INewBfgGameMetadata;
}

export const registerGame = (gameMetadata: INewBfgGameMetadata) => {
  const { gameTitle, definition } = gameMetadata;
  NewGameDefinitions.set(gameTitle, definition);
  NewGamesMetadataRegistry.set(gameTitle, gameMetadata);
}


export const getGameMetadata = (gameTitle: BfgSupportedGameTitle): INewBfgGameMetadata => {
  const metadata = NewGamesMetadataRegistry.get(gameTitle);
  if (!metadata) {
    throw new Error(`Game metadata not found for: ${gameTitle}`);
  }
  return metadata;
}

export const getAvailableGameTitles = () => {
  const retVal = Array.from(NewGameDefinitions.keys());
  retVal.sort();
  return retVal;
}

export const getGameDefinition = (gameTitle: BfgSupportedGameTitle): GameDefinition => {
  const definition = NewGameDefinitions.get(gameTitle);
  if (!definition) {
    throw new Error(`Game definition not found for: ${gameTitle}`);
  }
  return definition;
}

export const NewGamesRegistry = {
  getAvailableGameTitles,
  getGameDefinition,
  getGameMetadata,
}
