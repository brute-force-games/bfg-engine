// import { z } from "zod";
// import { BfgGameImplHostActionSchema } from "../../models/game-engine/bfg-game-engine-types";
// // import { BfgGameSpecificPlayerActionOutcomeSchema, BfgGameSpecificHostActionOutcomeSchema } from "../../models/game-table/game-table-action";
// import { createJsonZodObjectDataEncoder } from "../encoders";
// import type { CompleteDataRoleSchemaAndEncoders } from "../metadata-types";
// import type { BfgGameStateForHostSchema, BfgGameStateForPlayerSchema, BfgGameStateForPublicSchema } from "../metadata-types/game-state-types";
// import type { BfgGameActionHostOutcomeStr, BfgGameActionOutcomeSchema, BfgGameActionPlayerOutcomeStr, BfgGameActionPublicOutcomeStr, BfgGameActionSchema  } from "../metadata-types/game-action-types";
// import type { CompleteGameStateTypes } from "./complete-game-state-types-factory";


// // interface ICompleteGameStateTypesFactoryParams<
// //   PublicGameStateSchema extends typeof BfgGameStateForPublicSchema,
// //   PlayerGameStateSchema extends typeof BfgGameStateForPlayerSchema,
// //   HostGameStateSchema extends typeof BfgGameStateForHostSchema,
// // > {
// //   publicGameStateSchema: PublicGameStateSchema;
// //   playerGameStateSchema: PlayerGameStateSchema;
// //   hostGameStateSchema: HostGameStateSchema;
// // }

// // export const createCompleteGameStateTypes = <
// //   PublicGameStateSchema extends typeof BfgGameStateForPublicSchema,
// //   PlayerGameStateSchema extends typeof BfgGameStateForPlayerSchema,
// //   HostGameStateSchema extends typeof BfgGameStateForHostSchema,
// // >(params: ICompleteGameStateTypesFactoryParams<
// //   PublicGameStateSchema,
// //   PlayerGameStateSchema,
// //   HostGameStateSchema
// // >) => {
// //   return {
// //     publicGameState: { schema: params.publicGameStateSchema, encoder: createJsonZodObjectDataEncoder(params.publicGameStateSchema) },
// //     playerGameState: { schema: params.playerGameStateSchema, encoder: createJsonZodObjectDataEncoder(params.playerGameStateSchema) },
// //     hostGameState: { schema: params.hostGameStateSchema, encoder: createJsonZodObjectDataEncoder(params.hostGameStateSchema) },
// //   };
// // }

// // export type CompleteGameStateTypes = ReturnType<typeof createCompleteGameStateTypes>;


// // export interface ICompleteGameActionFactoryParams<
// //   GameActionSchema extends typeof BfgGameActionSchema,
// //   GameActionOutcomeSchema extends typeof BfgGameActionOutcomeSchema,
// // > {
// //   actionSchema: GameActionSchema;
  
// //   createPublicOutcomeMessage: (outcome: z.infer<GameActionOutcomeSchema>) => BfgGameActionPublicOutcomeStr;
// //   createPlayerOutcomeMessage: (outcome: z.infer<GameActionOutcomeSchema>) => BfgGameActionPlayerOutcomeStr;
// //   createHostOutcomeMessage: (outcome: z.infer<GameActionOutcomeSchema>) => BfgGameActionHostOutcomeStr;
// // }

// // export const createCompleteGameActionType = <
// //   GameActionSchema extends typeof BfgGameActionSchema,
// //   GameActionOutcomeSchema extends typeof BfgGameActionOutcomeSchema,
// // >(params: ICompleteGameActionFactoryParams<GameActionSchema, GameActionOutcomeSchema>) => {
// //   return {
// //     actionSchema: params.actionSchema,
// //     createPublicOutcomeMessage: params.createPublicOutcomeMessage,
// //     createPlayerOutcomeMessage: params.createPlayerOutcomeMessage,
// //     createHostOutcomeMessage: params.createHostOutcomeMessage,
// //   };
// // }



// interface ICompleteGameActionTypesFactoryParams<
//   HostActionSchema extends typeof BfgGameImplHostActionSchema,
//   HostActionOutcomeSchema extends typeof BfgGameSpecificHostActionOutcomeSchema,
//   PlayerActionSchema extends typeof BfgGameImplPlayerActionSchema,
//   PlayerActionOutcomeSchema extends typeof BfgGameSpecificPlayerActionOutcomeSchema,
// > {
//   hostActionSchema: HostActionSchema;
//   hostActionOutcomeSchema: HostActionOutcomeSchema;


// }

// export const createCompleteGameActionTypes = <
//   HostActionSchema extends typeof BfgGameImplHostActionSchema,
//   HostActionOutcomeSchema extends typeof BfgGameSpecificHostActionOutcomeSchema,
//   PlayerActionSchema extends typeof BfgGameImplPlayerActionSchema,
//   PlayerActionOutcomeSchema extends typeof BfgGameSpecificPlayerActionOutcomeSchema,
// >(params: ICompleteGameActionTypesFactoryParams<HostActionSchema, HostActionOutcomeSchema, PlayerActionSchema, PlayerActionOutcomeSchema>) => {
//   return {
//     hostAction: { schema: params.hostActionSchema, encoder: createJsonZodObjectDataEncoder(params.hostActionSchema) },
//   };
// }

// export type CompleteGameActionTypes = ReturnType<typeof createCompleteGameActionTypes>;



// export const createCompleteBfgGameTypes = <
//   HGSSchema extends typeof BfgHostGameImplStateSchema,
//   PGSchema extends typeof BfgPublicGameImplStateSchema,

//   GPASchema extends typeof BfgGameImplPlayerActionSchema,
//   GHASchema extends typeof BfgGameImplHostActionSchema,

//   GPAOSchema extends typeof BfgGameSpecificPlayerActionOutcomeSchema,
//   GHAOSchema extends typeof BfgGameSpecificHostActionOutcomeSchema,

//   PPKSchema extends typeof BfgPrivatePlayerKnowledgeImplStateSchema,
// >(
//   gameStateTypes: CompleteGameStateTypes,
//   gameActionTypes: CompleteGameActionTypes,
//   // hostGameStateSchema: HGSSchema,
//   // publicGameStateSchema: PGSchema,
  
//   hostActionSchema: GHASchema,
//   hostActionOutcomeSchema: GHAOSchema,

//   playerActionSchema: GPASchema,
//   playerActionOutcomeSchema: GPAOSchema,

//   privatePlayerKnowledgeSchema: PPKSchema,
// ): CompleteDataRoleSchemaAndEncoders<
//   z.infer<HGSSchema>,
//   z.infer<PGSchema>,
//   z.infer<GPASchema>,
//   z.infer<GPAOSchema>,
//   z.infer<GHASchema>,
//   z.infer<GHAOSchema>,
//   z.infer<PPKSchema>
// > => {
//   return {
//     hostGameState: { schema: gameStateTypes.hostGameState.schema, encoder: createJsonZodObjectDataEncoder(gameStateTypes.hostGameState.schema) },
//     publicGameState: { schema: gameStateTypes.publicGameState.schema, encoder: createJsonZodObjectDataEncoder(gameStateTypes.publicGameState.schema) },
    
//     playerAction: { schema: playerActionSchema, encoder: createJsonZodObjectDataEncoder(playerActionSchema) },
//     hostAction: { schema: hostActionSchema, encoder: createJsonZodObjectDataEncoder(hostActionSchema) },
    
//     playerActionOutcome: { schema: playerActionOutcomeSchema, encoder: createJsonZodObjectDataEncoder(playerActionOutcomeSchema) },
//     hostActionOutcome: { schema: hostActionOutcomeSchema, encoder: createJsonZodObjectDataEncoder(hostActionOutcomeSchema) },
    
//     privatePlayerKnowledge: { schema: privatePlayerKnowledgeSchema, encoder: createJsonZodObjectDataEncoder(privatePlayerKnowledgeSchema) },
//   };
// }

// export type CompleteBfgGameTypes = ReturnType<typeof createCompleteBfgGameTypes>;


// // export type CompleteBfgGameTypes<
// //   HGSSchema extends typeof BfgHostGameImplStateSchema,
// //   PGSchema extends typeof BfgPublicGameImplStateSchema,
// //   GHASchema extends typeof BfgGameImplHostActionSchema,
// //   GHAOSchema extends typeof BfgGameSpecificHostActionOutcomeSchema,
// //   GPASchema extends typeof BfgGameImplPlayerActionSchema,
// //   GPAOSchema extends typeof BfgGameSpecificPlayerActionOutcomeSchema,
// //   PPKSchema extends typeof BfgPrivatePlayerKnowledgeImplStateSchema,
// // > = ReturnType<typeof createCompleteBfgGameTypes<HGSSchema, PGSchema, GHASchema, GHAOSchema, GPASchema, GPAOSchema, PPKSchema>>;


// // hostGameStateSchema: HGSSchema,
// // publicGameStateSchema: PGSchema,

// // hostActionSchema: GHASchema,
// // hostActionOutcomeSchema: GHAOSchema,

// // playerActionSchema: GPASchema,
// // playerActionOutcomeSchema: GPAOSchema,

// // privatePlayerKnowledgeSchema: PPKSchema,
