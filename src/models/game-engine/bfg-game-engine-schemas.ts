import z from "zod";
import { BfgGameImplHostActionSchema, BfgGameImplPlayerActionSchema, BfgHostGameImplStateSchema, BfgPrivatePlayerKnowledgeImplStateSchema, BfgPublicGameImplStateSchema } from "./bfg-game-engine-types";



export const BfgGameEngineSchemasSchema = z.object({
  hostGameStateSchema: BfgHostGameImplStateSchema,
  hostActionSchema: BfgGameImplHostActionSchema,
  publicGameStateSchema: BfgPublicGameImplStateSchema,

  playerActionSchema: BfgGameImplPlayerActionSchema,
  privatePlayerKnowledgeSchema: BfgPrivatePlayerKnowledgeImplStateSchema,
});
export type BfgGameEngineSchemas = z.infer<typeof BfgGameEngineSchemasSchema>;
