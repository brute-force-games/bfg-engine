import { z } from "zod";
import { IGameRegistry } from "../hooks/games-registry/games-registry";
import { BfgSupportedGameTitle, GameDefinition } from "../models/game-box-definition";
import { 
  BfgGameEngineProcessor as BfgGameEngineProcessorType 
} from "~/models/game-engine/bfg-game-engines";


export interface BfgGameMetadata {
  gameDefinition: GameDefinition;
  engineProcessor?: BfgGameEngineProcessorType<any, any>;
}

// Re-export the correct type for backward compatibility
export type BfgGameEngineProcessor<
  GameStateSchema extends z.ZodTypeAny = z.ZodTypeAny,
  GameActionSchema extends z.ZodTypeAny = z.ZodTypeAny
> = BfgGameEngineProcessorType<GameStateSchema, GameActionSchema>;

// const AllBfgGameMetadata: Record<string, BfgGameMetadata> = {};

// export function getBfgGameMetadata(gameTitle: BfgSupportedGameTitle): BfgGameMetadata | undefined {
//   return AllBfgGameMetadata[gameTitle];
// }

export const createInitialGameData = (gameRegistry: IGameRegistry, gameTitle: BfgSupportedGameTitle): {
  initialGameSpecificState: any;
  gameStateJson: string;
  actionJson: string;
} => {
  const metadata = gameRegistry.getGameMetadata(gameTitle);
  
  if (!metadata?.processor) {
    throw new Error(`Game processor not found for game: ${gameTitle}`);
  }

  const gameEngine = metadata.processor;

  // Create a temporary game table object for the initial action
  // We only need the fields required by createBfgGameSpecificInitialGameTableAction
  const tempGameTable = {} as any;
  
  // Same pattern for all games - using type assertions for flexibility
  const initGameAction = gameEngine.createBfgGameSpecificInitialGameTableAction(tempGameTable) as any;
  const initialGameSpecificState = gameEngine.createBfgInitialGameSpecificState(initGameAction) as any;
  const gameStateJson = gameEngine.createGameSpecificGameStateJson(initialGameSpecificState) as any;
  const actionJson = gameEngine.createGameSpecificActionJson(initGameAction.gameSpecificAction) as any;
  
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
