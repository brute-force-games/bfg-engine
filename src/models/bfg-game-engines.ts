import { BfgSupportedGameTitle, GameDefinition } from "../models/game-box-definition";
import { IBfgAllPublicKnowledgeGameProcessor } from "./game-engine/bfg-game-engine-processor";
import { BfgAllPublicKnowledgeGameEngineComponents, BfgGameImplHostAction, BfgGameImplPlayerAction, BfgPublicGameImplState } from "./game-engine/bfg-game-engine-types";
import { IBfgDataEncoder } from "./game-engine/encoders";
import { BfgDataEncoderFormat } from "./game-engine/encoders";


// export interface BfgGameMetadata {
//   gameDefinition: GameDefinition;
//   engineProcessor: BfgGameEngineProcessorType<any, any>;
// }

// // Re-export the correct type for backward compatibility
// export type BfgGameEngineProcessor<
//   GameStateSchema extends z.ZodTypeAny = z.ZodTypeAny,
//   GameActionSchema extends z.ZodTypeAny = z.ZodTypeAny
// > = BfgGameEngineProcessorType<GameStateSchema, GameActionSchema>;


// export type InitialGameData = {
//   initialGameSpecificState: any;
//   gameStateJson: string;
//   actionJson: string;
// }

// // export const createInitialGameData = (gameRegistry: IGameRegistry, gameTitle: BfgSupportedGameTitle): InitialGameData => {
// export const createInitialGameData = (
//   gameRegistry: IGameRegistry, 
//   gameTitle: BfgSupportedGameTitle, 
//   newGameTable: GameTable,
//   lobbyState: GameLobby
// ): InitialGameData => {
//   const metadata = gameRegistry.getGameMetadata(gameTitle);
  
//   const gameProcessor = metadata.engine.processor;
//   // const gameProcessor = metadata.processor;
  
//   // Same pattern for all games - type assertions need to be better genericized
//   const initialGameSpecificState = gameProcessor.createInitialGameSpecificState(newGameTable, lobbyState);
//   // const initialGameSpecificState = gameEngine.createBfgInitialGameSpecificState(initGameAction);
//   // const gameStateJson = gameEngine.createGameSpecificGameStateJson(initialGameSpecificState);
//   // const actionJson = gameEngine.createGameSpecificActionJson(initGameAction.gameSpecificAction);

//   const gameStateJson = JSON.stringify(initialGameSpecificState);
//   const actionJson = JSON.stringify(initialGameSpecificState);

//   // const x = metadata.engine.gameSpecificStateSchema.parse(initialGameSpecificState);
  
//   return {
//     initialGameSpecificState,
//     gameStateJson,
//     actionJson,
//   } satisfies InitialGameData;
// }


export type BfgGameEngineMetadata<
  // GS extends z.ZodTypeAny,
  // GPA extends z.ZodTypeAny,
  // GHA extends z.ZodTypeAny
  GIS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction

> = {
  definition: GameDefinition;
  // processor: BfgGameEngineProcessor<GS, GA>;
  // engine: IBfgAllPublicKnowledgeGameEngine<GIS, GPA, GHA>;


  gameTitle: BfgSupportedGameTitle,
  
  // gameSpecificStateSchema: z.ZodType<GIS>,
  // gameSpecificStateEncodingSchema: BfgDataEncodingFormat,
  
  // actionEncodingSchema: BfgDataEncodingFormat,
  // playerActionSchema: z.ZodType<GPA>,
  // hostActionSchema: z.ZodType<GHA>,

  gameSpecificStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GIS>;
  playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPA>;
  hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GHA>;

  engine: IBfgAllPublicKnowledgeGameProcessor<GIS, GPA, GHA>,
  components: BfgAllPublicKnowledgeGameEngineComponents<GIS, GPA, GHA>,
}
