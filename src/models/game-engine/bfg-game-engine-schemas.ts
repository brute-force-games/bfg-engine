import type { z } from "zod";

export type BfgGameEngineSchemas<
  HostGameStateSchema extends z.ZodTypeAny = z.ZodTypeAny,
  PublicGameStateSchema extends z.ZodTypeAny = z.ZodTypeAny,
  PlayerActionSchema extends z.ZodTypeAny = z.ZodTypeAny,
  HostActionSchema extends z.ZodTypeAny = z.ZodTypeAny,
  PlayerActionOutcomeSchema extends z.ZodTypeAny = z.ZodTypeAny,
  HostActionOutcomeSchema extends z.ZodTypeAny = z.ZodTypeAny,
  PrivatePlayerKnowledgeSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = {
  hostGameStateSchema: HostGameStateSchema;
  publicGameStateSchema: PublicGameStateSchema;
  playerActionSchema: PlayerActionSchema;
  hostActionSchema: HostActionSchema;
  playerActionOutcomeSchema: PlayerActionOutcomeSchema;
  hostActionOutcomeSchema: HostActionOutcomeSchema;
  privatePlayerKnowledgeSchema: PrivatePlayerKnowledgeSchema;
};
