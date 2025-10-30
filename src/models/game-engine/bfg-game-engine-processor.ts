import { z } from "zod";
import { BfgSupportedGameTitle } from "../game-box-definition";
import { GameTable, GameTableSeat } from "../game-table/game-table";
import { GameTableActionResult } from "../game-table/table-phase";
import { BfgAllPublicKnowledgeGameEngineComponents, BfgGameImplHostAction, BfgGameImplPlayerAction, BfgPublicGameImplState } from "./bfg-game-engine-types";
import { GameLobby } from "../p2p-lobby";
import { BfgGameSpecificTableAction } from "../game-table/game-table-action";
// import { GameActionJson, GameStateJson } from "./bfg-game-engines";


export interface IBfgAllPublicKnowledgeGameProcessor<
  // GS extends z.ZodTypeAny,
  // GA extends z.ZodTypeAny
  // GIS extends BfgPublicGameImplState,
  // GPA extends BfgGameImplPlayerAction,
  // GHA extends BfgGameImplHostAction
  GIS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction
> {

  gameTitle: BfgSupportedGameTitle,

  // gameSpecificStateSchema: z.ZodType<GIS>,
  // playerActionSchema: z.ZodType<GPA>,
  // hostActionSchema: z.ZodType<GHA>,

  createGameSpecificInitialAction: (gameTable: GameTable, lobbyState: GameLobby) => BfgGameSpecificTableAction<GHA>,
  createGameSpecificInitialState: (gameTable: GameTable, gameSpecificInitialAction: BfgGameSpecificTableAction<GHA>) => GIS,

  applyPlayerAction: (
    tableState: GameTable,
    gameState: GIS,
    playerAction: GPA
  ) => Promise<GameTableActionResult<GIS>>,

  applyHostAction: (
    tableState: GameTable,
    gameState: GIS,
    hostAction: GHA
  ) => Promise<GameTableActionResult<GIS>>,

  getNextToActPlayers: (gameState: GIS) => GameTableSeat[],
}


export interface IBfgAllPublicKnowledgeGameEngine<
  GIS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction
> {

  gameTitle: BfgSupportedGameTitle,
  
  gameSpecificStateSchema: z.ZodType<GIS>,
  playerActionSchema: z.ZodType<GPA>,
  hostActionSchema: z.ZodType<GHA>,

  processor: IBfgAllPublicKnowledgeGameProcessor<GIS, GPA, GHA>,
  components: BfgAllPublicKnowledgeGameEngineComponents<GIS, GPA, GHA>,

  // createInitialGameImplState: (gameTable: GameTable, lobbyState: GameLobby) => GIS,

  // applyPlayerAction: (
  //   tableState: GameTable,
  //   gameState: GIS,
  //   playerAction: GPA
  // ) => Promise<GameTableActionResult<GIS>>,

  // applyHostAction: (
  //   tableState: GameTable,
  //   gameState: GIS,
  //   hostAction: GHA
  // ) => Promise<GameTableActionResult<GIS>>,
}




// export const createBfgGameEngine = <
//   // GIS extends TypeOf<GIS>,
//   // GA extends z.ZodTypeAny
//   GIS extends BfgPublicGameImplState,
//   GPA extends BfgGameImplPlayerAction,
//   GHA extends BfgGameImplHostAction
// >(
//   gameTitle: BfgSupportedGameTitle,

//   gameStateSchema: GIS,
//   playerActionSchema: GPA,
//   hostActionSchema: GHA,

//   processor: IBfgAllPublicKnowledgeGameProcessor<GIS, GPA, GHA>,
//   components: BfgAllPublicKnowledgeGameEngineComponents<GIS, GPA, GHA>,

//   // processorImplementation: IBfgGameEngineProcessor<GS, GA>,
//   // rendererFactory: BfgGameEngineRendererFactory<GS, GA>,
// ): IBfgAllPublicKnowledgeGameEngine<GIS, GPA, GHA> => {

//   type TGameStateInferred = z.infer<GIS>;
//   type TPlayerActionInferred = z.infer<GPA>;
//   type THostActionInferred = z.infer<GHA>;

//   const createBrandedGameStateJsonValue = (obj: TGameStateInferred): GameStateJson<GIS> => {
//     const json = JSON.stringify(obj);
//     console.log("createBrandedGameStateJsonValue", json);
//     return json as GameStateJson<GIS>;
//   }

//   const createBrandedPlayerActionJsonValue = (obj: TPlayerActionInferred): GameActionJson<GPA> => {
//     const json = JSON.stringify(obj);
//     return json as GameActionJson<GPA>;
//   }

//   const createBrandedHostActionJsonValue = (obj: THostActionInferred): GameActionJson<GHA> => {
//     const json = JSON.stringify(obj);
//     return json as GameActionJson<GHA>;
//   }

//   // const createBfgInitialGameState = (initialGameTableAction: BfgGameSpecificTableAction<z.infer<GA>>): z.infer<GS> => {
//   //   const initialGameSpecificState = processorImplementation.createInitialGameSpecificState(initialGameTableAction.gameSpecificAction);
    
//   //   return initialGameSpecificState;
//   // }


//   const engine: IBfgAllPublicKnowledgeGameEngine<GIS, GPA, GHA> = {
//     gameTitle,
    
//     gameStateSchema,
//     playerActionSchema,
//     hostActionSchema,

//     processor,
//     components,
//   };

//   return engine;

//     // ...processorImplementation,

//     // rendererFactory,

//     // createBfgInitialGameSpecificState: createBfgInitialGameState,
//     // createBfgGameSpecificInitialGameTableAction: processorImplementation.createInitialGameTableAction,

//     // createGameSpecificGameStateJson: (obj: TGameStateInferred) => createBrandedGameStateJsonValue(obj),
//     // parseGameSpecificGameStateJson: (jsonString: GameStateJson<GS>) => {
//     //   const json = JSON.parse(jsonString);
//     //   return gameStateSchema.parse(json) as z.infer<GS>;
//     // },

//     // createGameSpecificActionJson: (obj: TGameActionInferred) => createBrandedGameActionJsonValue(obj),
//     // parseGameSpecificActionJson: (jsonString: GameActionJson<GA>) => {
//     //   const json = JSON.parse(jsonString);
//     //   return gameActionSchema.parse(json) as z.infer<GA>;
//     // },

//     // // narrowGameStateToValidGameActions,

//     // gameStateJsonSchema: gameStateSchema,
//     // gameActionJsonSchema: gameActionSchema,
// };

// //   return processor;
// // }





// export const createBfgGameEngine = <
//   // GIS extends TypeOf<GIS>,
//   GIS extends typeof BfgPublicGameImplStateSchema,
//   // GA extends z.ZodTypeAny
//   // GIS extends BfgPublicGameImplState,
//   GPA extends typeof BfgGameImplPlayerActionSchema,
//   // GPA extends BfgGameImplPlayerAction,
//   GHA extends typeof BfgGameImplHostActionSchema,
//   // GHA extends BfgGameImplHostAction
// >(
//   gameTitle: BfgSupportedGameTitle,

//   gameStateSchema: z.infer<GIS>,
//   playerActionSchema: z.infer<GPA>,
//   hostActionSchema: z.infer<GHA>,

//   processor: IBfgAllPublicKnowledgeGameProcessor<GIS, GPA, GHA>,
//   components: BfgAllPublicKnowledgeGameEngineComponents<GIS, GPA, GHA>,

//   // processorImplementation: IBfgGameEngineProcessor<GS, GA>,
//   // rendererFactory: BfgGameEngineRendererFactory<GS, GA>,
// ): IBfgAllPublicKnowledgeGameEngine<GIS, GPA, GHA> => {

//   // type TGameStateInferred = z.infer<GIS>;
//   // type TPlayerActionInferred = z.infer<GPA>;
//   // type THostActionInferred = z.infer<GHA>;

//   // const createBrandedGameStateJsonValue = (obj: TGameStateInferred): GameStateJson<GIS> => {
//   //   const json = JSON.stringify(obj);
//   //   console.log("createBrandedGameStateJsonValue", json);
//   //   return json as GameStateJson<GIS>;
//   // }

//   // const createBrandedPlayerActionJsonValue = (obj: TPlayerActionInferred): GameActionJson<GPA> => {
//   //   const json = JSON.stringify(obj);
//   //   return json as GameActionJson<GPA>;
//   // }

//   // const createBrandedHostActionJsonValue = (obj: THostActionInferred): GameActionJson<GHA> => {
//   //   const json = JSON.stringify(obj);
//   //   return json as GameActionJson<GHA>;
//   // }

//   const engine: IBfgAllPublicKnowledgeGameEngine<GIS, GPA, GHA> = {
//     gameTitle,
    
//     gameStateSchema,
//     playerActionSchema,
//     hostActionSchema,

//     processor,
//     components,
//   };

//   return engine;
// };
