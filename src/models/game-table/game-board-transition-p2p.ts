import { z } from "zod";
import type { BfgGenericEngineMetadataSchemas } from "../../game-metadata/metadata-types";
import { BfgGameRoomIdToolbox, BfgGameStateIdToolbox } from "../types/bfg-branded-uuids";



export const createGameStateTransitionForP2pSchema = (schemas: BfgGenericEngineMetadataSchemas) => {
  const { gameEventSchema, gameEventOutcomeSchema, hostGameStateSchema } = schemas;

  const GameStateTransitionForP2pSchema = z.object({
    event: gameEventSchema,
    change: gameEventOutcomeSchema,
    nextBoardState: hostGameStateSchema,
  });

  return GameStateTransitionForP2pSchema;
}

export type GameStateTransitionForP2p = z.infer<ReturnType<typeof createGameStateTransitionForP2pSchema>>;



export const createGameBoardTransitionForP2pSchema = (schemas: BfgGenericEngineMetadataSchemas) => {

  const transitionForP2pSchema = createGameStateTransitionForP2pSchema(schemas);
  
  const GameBoardTransitionSchema = z.object({
    gameStateId: BfgGameStateIdToolbox.idSchema,
    gameRoomId: BfgGameRoomIdToolbox.idSchema,
    createdAt: z.number(),
    stepIndex: z.number(),
  
    transitionForHost: transitionForP2pSchema,
  });

  return GameBoardTransitionSchema;
}
export type GameBoardTransitionForP2p = z.infer<ReturnType<typeof createGameBoardTransitionForP2pSchema>>;
