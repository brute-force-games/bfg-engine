import { z } from "zod";
import type { BfgGenericEngineMetadataSchemas } from "../../game-metadata/metadata-types";
import { BfgGameRoomIdToolbox, BfgGameStateIdToolbox } from "../types/bfg-branded-uuids";

// Consolidated transition schema - structure is identical for DB and P2P
// though they have different security profiles and serialization paths
export const createGameStateTransitionSchema = (schemas: BfgGenericEngineMetadataSchemas) => {
  const { gameEventSchema, gameEventOutcomeSchema, hostGameStateSchema } = schemas;

  const GameStateTransitionSchema = z.object({
    event: gameEventSchema,
    change: gameEventOutcomeSchema,
    nextBoardState: hostGameStateSchema,
  });

  return GameStateTransitionSchema;
}

export type GameStateTransition = z.infer<ReturnType<typeof createGameStateTransitionSchema>>;

// Type aliases for context clarity (DB vs P2P) - same structure, different usage contexts
export type GameStateTransitionForDb = GameStateTransition;
// export type GameStateTransitionForP2p = GameStateTransition; // Unused - P2P code uses DB functions directly


// Consolidated board event schema - structure is identical for DB and P2P
// though they have different security profiles and serialization paths
export const createGameBoardEventSchema = (schemas: BfgGenericEngineMetadataSchemas) => {
  const transitionSchema = createGameStateTransitionSchema(schemas);
  
  const GameBoardEventSchema = z.object({
    gameStateId: BfgGameStateIdToolbox.idSchema,
    gameRoomId: BfgGameRoomIdToolbox.idSchema,
    createdAt: z.number(),
    stepIndex: z.number(),
  
    transitionForHost: transitionSchema,
  });

  return GameBoardEventSchema;
}

export type GameBoardEvent = z.infer<ReturnType<typeof createGameBoardEventSchema>>;

// Type aliases for context clarity (DB vs P2P) - same structure, different usage contexts
export type GameBoardEventForDb = GameBoardEvent;
// export type GameBoardTransitionForP2p = GameBoardEvent; // Unused - P2P code uses DB functions directly

