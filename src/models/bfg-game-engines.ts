import { z } from "zod";
import { IGameRegistry } from "../hooks/games-registry/games-registry";
import { BfgSupportedGameTitle, GameDefinition } from "../models/game-box-definition";
import { 
  BfgGameEngineProcessor as BfgGameEngineProcessorType 
} from "@bfg-engine/models/game-engine/bfg-game-engines";
import { GameTable } from "./game-table/game-table";


export interface BfgGameMetadata {
  gameDefinition: GameDefinition;
  engineProcessor: BfgGameEngineProcessorType<any, any>;
}

// Re-export the correct type for backward compatibility
export type BfgGameEngineProcessor<
  GameStateSchema extends z.ZodTypeAny = z.ZodTypeAny,
  GameActionSchema extends z.ZodTypeAny = z.ZodTypeAny
> = BfgGameEngineProcessorType<GameStateSchema, GameActionSchema>;


export type InitialGameData = {
  initialGameSpecificState: any;
  gameStateJson: string;
  actionJson: string;
}

// export const createInitialGameData = (gameRegistry: IGameRegistry, gameTitle: BfgSupportedGameTitle): InitialGameData => {
export const createInitialGameData = (gameRegistry: IGameRegistry, gameTitle: BfgSupportedGameTitle, newGameTable: GameTable): InitialGameData => {
  const metadata = gameRegistry.getGameMetadata(gameTitle);
  
  const gameEngine = metadata.processor;
  
  // Same pattern for all games - type assertions need to be better genericized
  const initGameAction = gameEngine.createBfgGameSpecificInitialGameTableAction(newGameTable);
  const initialGameSpecificState = gameEngine.createBfgInitialGameSpecificState(initGameAction);
  const gameStateJson = gameEngine.createGameSpecificGameStateJson(initialGameSpecificState);
  const actionJson = gameEngine.createGameSpecificActionJson(initGameAction.gameSpecificAction);
  
  return {
    initialGameSpecificState,
    gameStateJson,
    actionJson,
  };
}


export type BfgGameEngineMetadata<
  GS extends z.ZodTypeAny,
  GA extends z.ZodTypeAny
> = {
  definition: GameDefinition;
  processor: BfgGameEngineProcessor<GS, GA>;
}
