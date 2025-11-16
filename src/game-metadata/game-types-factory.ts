// import { z } from "zod";
// import { BfgGameImplPlayerActionSchema, BfgGameImplHostActionSchema, BfgPublicGameImplStateSchema, BfgHostGameImplStateSchema, BfgPrivatePlayerKnowledgeImplStateSchema } from "../models/game-engine/bfg-game-engine-types";
// import { BfgGameSpecificPlayerActionOutcomeSchema, BfgGameSpecificHostActionOutcomeSchema } from "../models/game-table/game-table-action";
// import { createJsonZodObjectDataEncoder } from "./encoders";
// import type { CompleteDataRoleSchemaAndEncoders } from "./metadata-types";
// import { createCompleteBfgGameTypes } from "./factories/complete-game-types-factory";


// // export const createCompleteGameStateTypes = <
// //   PublicGameStateSchema extends typeof BfgHostGameImplStateSchema,
// //   PlayerGameStateSchema extends typeof BfgGameImplPlayerActionSchema,
// //   HostGameStateSchema extends typeof BfgPublicGameImplStateSchema,
// // >(
// //   publicGameStateSchema: PublicGameStateSchema,
// //   playerGameStateSchema: PlayerGameStateSchema,
// //   hostGameStateSchema: HostGameStateSchema,
// // ) => {
// //   return {
// //     publicGameState: { schema: publicGameStateSchema, encoder: createJsonZodObjectDataEncoder(publicGameStateSchema) },
// //     playerGameState: { schema: playerGameStateSchema, encoder: createJsonZodObjectDataEncoder(playerGameStateSchema) },
// //     hostGameState: { schema: hostGameStateSchema, encoder: createJsonZodObjectDataEncoder(hostGameStateSchema) },
// //   };
// // }


// // Alternative: Type-safe parameter object approach
// // export interface CompleteGameTypesParams<
// //   HGSSchema extends typeof BfgHostGameImplStateSchema,
// //   PGSchema extends typeof BfgPublicGameImplStateSchema,
// //   GPASchema extends typeof BfgGameImplPlayerActionSchema,
// //   GHASchema extends typeof BfgGameImplHostActionSchema,
// //   GPAOSchema extends typeof BfgGameSpecificPlayerActionOutcomeSchema,
// //   GHAOSchema extends typeof BfgGameSpecificHostActionOutcomeSchema,
// //   PPKSchema extends typeof BfgPrivatePlayerKnowledgeImplStateSchema,
// // > {
// //   hostGameStateSchema: HGSSchema;
// //   publicGameStateSchema: PGSchema;
// //   hostActionSchema: GHASchema;
// //   hostActionOutcomeSchema: GHAOSchema;
// //   playerActionSchema: GPASchema;
// //   playerActionOutcomeSchema: GPAOSchema;
// //   privatePlayerKnowledgeSchema: PPKSchema;
// // }

// // export const createCompleteBfgGameTypesAlt = <...>(params: CompleteGameTypesParams<...>) => { ... }


// export const createBfgPublicKnowledgeGameTypes = <
//   PGSchema extends typeof BfgPublicGameImplStateSchema,
//   GPASchema extends typeof BfgGameImplPlayerActionSchema,
//   GHASchema extends typeof BfgGameImplHostActionSchema,
// >({
//   publicGameStateSchema,
//   playerActionSchema,
//   hostActionSchema,
// }: {
//   publicGameStateSchema: PGSchema;
//   playerActionSchema: GPASchema;
//   hostActionSchema: GHASchema;
// }) => {
//   return createCompleteBfgGameTypes(
//     publicGameStateSchema, // hostGameStateSchema
//     publicGameStateSchema,
//     hostActionSchema,
//     null, // hostActionOutcomeSchema
//     playerActionSchema,
//     null, // playerActionOutcomeSchema
//     null, // privatePlayerKnowledgeSchema
//   );
// }


// // export type BfgGameTypes<
// //   HGSSchema extends typeof BfgHostGameImplStateSchema,
// //   PGSchema extends typeof BfgPublicGameImplStateSchema,
// //   GHASchema extends typeof BfgGameImplHostActionSchema,
// //   GHAOSchema extends typeof BfgGameSpecificHostActionOutcomeSchema,
// //   GPASchema extends typeof BfgGameImplPlayerActionSchema,
// //   GPAOSchema extends typeof BfgGameSpecificPlayerActionOutcomeSchema,
// //   PPKSchema extends typeof BfgPrivatePlayerKnowledgeImplStateSchema,
// // > = ReturnType<typeof createCompleteBfgGameTypes<HGSSchema, PGSchema, GHASchema, GHAOSchema, GPASchema, GPAOSchema, PPKSchema>>;


// // export type CompleteGameStateTypes = ReturnType<typeof createCompleteGameStateTypes>;

// // hostGameStateSchema: HGSSchema,
// // publicGameStateSchema: PGSchema,

// // hostActionSchema: GHASchema,
// // hostActionOutcomeSchema: GHAOSchema,

// // playerActionSchema: GPASchema,
// // playerActionOutcomeSchema: GPAOSchema,

// // privatePlayerKnowledgeSchema: PPKSchema,
