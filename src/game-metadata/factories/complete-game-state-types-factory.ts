// import { createJsonZodObjectDataEncoder } from "../encoders";
// import type { BfgGameStateForHostSchema, BfgGameStateForPlayerSchema } from "../metadata-types/game-state-types";


// interface ICompleteGameStateTypesFactoryParams<
//   PublicGameStateSchema extends typeof BfgGameStateForPublicSchema,
//   PlayerGameStateSchema extends typeof BfgGameStateForPlayerSchema,
//   HostGameStateSchema extends typeof BfgGameStateForHostSchema,
// > {
//   publicGameStateSchema: PublicGameStateSchema;
//   playerGameStateSchema: PlayerGameStateSchema;
//   hostGameStateSchema: HostGameStateSchema;
// }

// export const createCompleteGameStateTypes = <
//   PublicGameStateSchema extends typeof BfgGameStateForPublicSchema,
//   PlayerGameStateSchema extends typeof BfgGameStateForPlayerSchema,
//   HostGameStateSchema extends typeof BfgGameStateForHostSchema,
// >(params: ICompleteGameStateTypesFactoryParams<
//   PublicGameStateSchema,
//   PlayerGameStateSchema,
//   HostGameStateSchema
// >) => {
//   return {
//     publicGameState: { schema: params.publicGameStateSchema, encoder: createJsonZodObjectDataEncoder(params.publicGameStateSchema) },
//     playerGameState: { schema: params.playerGameStateSchema, encoder: createJsonZodObjectDataEncoder(params.playerGameStateSchema) },
//     hostGameState: { schema: params.hostGameStateSchema, encoder: createJsonZodObjectDataEncoder(params.hostGameStateSchema) },
//   };
// }

// export type CompleteGameStateTypes = ReturnType<typeof createCompleteGameStateTypes>;


// // export const createCompleteGameActionTypes = <
// //   HostActionSchema extends typeof BfgGameImplHostActionSchema,
// //   HostActionOutcomeSchema extends typeof BfgGameSpecificHostActionOutcomeSchema,
// //   PlayerActionSchema extends typeof BfgGameImplPlayerActionSchema,
// //   PlayerActionOutcomeSchema extends typeof BfgGameSpecificPlayerActionOutcomeSchema,
// // >(params: ICompleteGameActionTypesFactoryParams<HostActionSchema, HostActionOutcomeSchema, PlayerActionSchema, PlayerActionOutcomeSchema>) => {
// //   return {
// //     hostAction: { schema: params.hostActionSchema, encoder: createJsonZodObjectDataEncoder(params.hostActionSchema) },
// //   };
// // }

// // export type CompleteGameActionTypes = ReturnType<typeof createCompleteGameActionTypes>;



// // export const createCompleteBfgGameTypes = <
// //   HGSSchema extends typeof BfgHostGameImplStateSchema,
// //   PGSchema extends typeof BfgPublicGameImplStateSchema,

// //   GPASchema extends typeof BfgGameImplPlayerActionSchema,
// //   GHASchema extends typeof BfgGameImplHostActionSchema,

// //   GPAOSchema extends typeof BfgGameSpecificPlayerActionOutcomeSchema,
// //   GHAOSchema extends typeof BfgGameSpecificHostActionOutcomeSchema,

// //   PPKSchema extends typeof BfgPrivatePlayerKnowledgeImplStateSchema,
// // >(
// //   gameStateTypes: CompleteGameStateTypes,
// //   gameActionTypes: CompleteGameActionTypes,
// //   // hostGameStateSchema: HGSSchema,
// //   // publicGameStateSchema: PGSchema,
  
// //   hostActionSchema: GHASchema,
// //   hostActionOutcomeSchema: GHAOSchema,

// //   playerActionSchema: GPASchema,
// //   playerActionOutcomeSchema: GPAOSchema,

// //   privatePlayerKnowledgeSchema: PPKSchema,
// // ): CompleteDataRoleSchemaAndEncoders<
// //   z.infer<HGSSchema>,
// //   z.infer<PGSchema>,
// //   z.infer<GPASchema>,
// //   z.infer<GPAOSchema>,
// //   z.infer<GHASchema>,
// //   z.infer<GHAOSchema>,
// //   z.infer<PPKSchema>
// // > => {
// //   return {
// //     hostGameState: { schema: gameStateTypes.hostGameState.schema, encoder: createJsonZodObjectDataEncoder(gameStateTypes.hostGameState.schema) },
// //     publicGameState: { schema: gameStateTypes.publicGameState.schema, encoder: createJsonZodObjectDataEncoder(gameStateTypes.publicGameState.schema) },
    
// //     playerAction: { schema: playerActionSchema, encoder: createJsonZodObjectDataEncoder(playerActionSchema) },
// //     hostAction: { schema: hostActionSchema, encoder: createJsonZodObjectDataEncoder(hostActionSchema) },
    
// //     playerActionOutcome: { schema: playerActionOutcomeSchema, encoder: createJsonZodObjectDataEncoder(playerActionOutcomeSchema) },
// //     hostActionOutcome: { schema: hostActionOutcomeSchema, encoder: createJsonZodObjectDataEncoder(hostActionOutcomeSchema) },
    
// //     privatePlayerKnowledge: { schema: privatePlayerKnowledgeSchema, encoder: createJsonZodObjectDataEncoder(privatePlayerKnowledgeSchema) },
// //   };
// // }

// // export type CompleteBfgGameTypes = ReturnType<typeof createCompleteBfgGameTypes>;
