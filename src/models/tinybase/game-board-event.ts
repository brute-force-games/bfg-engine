import { z } from "zod";
import type { BfgGenericEngineMetadataSchemas } from "../../game-metadata/metadata-types";
// import { BfgGameStepIndexSchema, BfgTimestampSchema } from "../types/bfg-versions";
// import { GameTableActionSourceSchema, GameTableEventTypeSchema } from "../game-table/game-table-event";


// Consolidated transition schema - structure is identical for DB and P2P
// though they have different security profiles and serialization paths
// export const createGameStateTransitionSchema = (schemas: BfgGenericEngineMetadataSchemas) => {
//   const { hostGameEventSchema, hostGameEventOutcomeSchema, hostGameStateSchema } = schemas;

//   const GameStateTransitionSchema = z.object({
//     event: hostGameEventSchema,
//     change: hostGameEventOutcomeSchema,
//     nextBoardState: hostGameStateSchema,
//   });

//   return GameStateTransitionSchema;
// }

// export type GameStateTransition = z.infer<ReturnType<typeof createGameStateTransitionSchema>>;

// // Type aliases for context clarity (DB vs P2P) - same structure, different usage contexts
// export type GameStateTransitionForDb = GameStateTransition;
// export type GameStateTransitionForP2p = GameStateTransition; // Unused - P2P code uses DB functions directly


// // Consolidated board event schema - structure is identical for DB and P2P
// // though they have different security profiles and serialization paths
// export const createGameTableEventSchema = <GameStepSchema extends z.ZodType>(gameStepSchema: GameStepSchema) => {
//   // const transitionSchema = createGameStateTransitionSchema(schemas);
//   // const gameStepSchema = createBfgGameStepSchema(schemas);
  
//   const GameTableEventSchema = z.object({
//     createdAt: BfgTimestampSchema,
//     stepIndex: BfgGameStepIndexSchema,
//     source: GameTableActionSourceSchema,
//     eventType: GameTableEventTypeSchema,
  
//     gameStep: gameStepSchema,
//   });

//   // return GameBoardEventSchema;
//   return GameTableEventSchema;
// }

// export type GameTableEvent = z.infer<ReturnType<typeof createGameTableEventSchema>>;

// Type aliases for context clarity (DB vs P2P) - same structure, different usage contexts
// export type GameTableEventForDb = GameTableEvent;
// export type GameBoardTransitionForP2p = GameBoardEvent; // Unused - P2P code uses DB functions directly

export const createTableTransitionsArraySchema = (schemas: BfgGenericEngineMetadataSchemas) => {
  // return z.array(createGameTableEventSchema(schemas.gameStepSchema));
  return z.array(schemas.gameTableEventSchema);
}
export type TableTransitionsArray = z.infer<ReturnType<typeof createTableTransitionsArraySchema>>;





// export const GameHistorySchema = z.object({
//   gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
//   gameRoomId: BfgGameRoomIdToolbox.idSchema,
//   gameTableId: BfgGameTableIdToolbox.idSchema,
//   boardEvents: createBoardTransitionsArraySchema(schemas),
// });
// export type GameHistory = z.infer<typeof GameHistorySchema>;