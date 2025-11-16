import { z } from "zod";
import type { BfgGenericEngineMetadataSchemas } from "../../game-metadata/metadata-types";
import { BfgGameRoomIdToolbox, BfgGameStateIdToolbox } from "../types/bfg-branded-uuids";



export const createGameStateTransitionForDbSchema = (schemas: BfgGenericEngineMetadataSchemas) => {
  const { gameEventSchema, gameEventOutcomeSchema, hostGameStateSchema } = schemas;

  const GameStateTransitionForDbSchema = z.object({
    event: gameEventSchema,
    change: gameEventOutcomeSchema,
    nextBoardState: hostGameStateSchema,
  });

  return GameStateTransitionForDbSchema;
}

export type GameStateTransitionForDb = z.infer<ReturnType<typeof createGameStateTransitionForDbSchema>>;



export const createGameBoardEventForDbSchema = (schemas: BfgGenericEngineMetadataSchemas) => {

  const transitionForDbSchema = createGameStateTransitionForDbSchema(schemas);
  
  const GameBoardEventSchema = z.object({
    gameStateId: BfgGameStateIdToolbox.idSchema,
    gameRoomId: BfgGameRoomIdToolbox.idSchema,
    createdAt: z.number(),
    stepIndex: z.number(),
  
    transitionForHost: transitionForDbSchema,
  });

  return GameBoardEventSchema;
}
export type GameBoardEventForDb = z.infer<ReturnType<typeof createGameBoardEventForDbSchema>>;
