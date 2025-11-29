import { z } from "zod";
import { GameTableSeatSchema } from "../../models/internal/game-room-base";


export const BfgGameActionSource = ['player', 'host'] as const;

export type BfgGameActionSource = typeof BfgGameActionSource[number];


export const BfgGameEventBaseSchema = z.object({
  source: z.enum(BfgGameActionSource),
})
.catchall(z.unknown())
.describe("BfgGameEventSchema");
export type BfgGameEventBase = z.infer<typeof BfgGameEventBaseSchema>;

export const BfgGameEventOutcomeSchema = z.object({
  description: z.string(),
})
.describe("BfgGameEventOutcomeSchema");
export type BfgGameEventOutcome = z.infer<typeof BfgGameEventOutcomeSchema>;


export const BfgGameActionByPlayerSchema = BfgGameEventBaseSchema.extend({
  source: z.literal('player'),
  playerSeat: GameTableSeatSchema,
});

export type BfgGameActionByPlayer = z.infer<typeof BfgGameActionByPlayerSchema>;


export const AllBfgGameActionsByPlayerSchema = z.array(BfgGameActionByPlayerSchema);


export const BfgGameActionByHostSchema = BfgGameEventBaseSchema.extend({
  source: z.literal('host'),
});

export type BfgGameActionByHost = z.infer<typeof BfgGameActionByHostSchema>;

export const BfgGameEventSchema = z.discriminatedUnion('source', [
  BfgGameActionByPlayerSchema,
  BfgGameActionByHostSchema,
]);

export type BfgGameEvent = z.infer<typeof BfgGameEventSchema>;

// export const AllBfgGameActionsByHostSchema = z.array(BfgGameActionByHostSchema);
// export type AllBfgGameActionsByHost = z.infer<typeof AllBfgGameActionsByHostSchema>;


// Helper type to make accessing non-existent properties return never
// This prevents TypeScript from allowing property access on empty object types
// By intersecting with Record<string, never>, any property access will return never
// instead of unknown, which TypeScript will catch as a type error
type StrictEmptyObject = Record<string, never>;

export const BfgGamePlayerActionOutcomeSchema = z.object({
  description: z.string(),
}).strict();
// Intersect inferred type with StrictEmptyObject to prevent property access
// while maintaining the relationship to the schema
export type BfgGamePlayerActionOutcome = z.infer<typeof BfgGamePlayerActionOutcomeSchema> & StrictEmptyObject;

export const BfgGameHostActionOutcomeSchema = z.object({
  description: z.string(),
}).strict()
.describe("BfgGameHostActionOutcomeSchema");
// Intersect inferred type with StrictEmptyObject to prevent property access
// while maintaining the relationship to the schema
export type BfgGameHostActionOutcome = z.infer<typeof BfgGameHostActionOutcomeSchema> & StrictEmptyObject;


export const BfgGameActionOutcomeSchema = z.discriminatedUnion('source', [
  BfgGamePlayerActionOutcomeSchema,
  BfgGameHostActionOutcomeSchema,
]);

// export const BfgGameActionPublicOutcomeStrSchema = z.string().brand<'BfgGameActionPublicOutcomeStr'>();
// export type BfgGameActionPublicOutcomeStr = z.infer<typeof BfgGameActionPublicOutcomeStrSchema>;

// export const BfgGameActionPlayerOutcomeStrSchema = z.string().brand<'BfgGameActionPlayerOutcomeStr'>();
// export type BfgGameActionPlayerOutcomeStr = z.infer<typeof BfgGameActionPlayerOutcomeStrSchema>;

// export const BfgGameActionHostOutcomeStrSchema = z.string().brand<'BfgGameActionHostOutcomeStr'>();
// export type BfgGameActionHostOutcomeStr = z.infer<typeof BfgGameActionHostOutcomeStrSchema>;



// export const BfgGameActionSchema = z.discriminatedUnion('source', [
//   BfgGameActionByPlayerSchema,
//   BfgGameActionByHostSchema,
// ]);

// export type BfgGameAction = z.infer<typeof BfgGameActionSchema>;


// export const BfgGameSpecificPlayerActionOutcomeSchema = z.object({
//   updatedGameState: BfgGameStateForHostSchema,
//   watcherSummary: BfgGameActionPublicOutcomeStrSchema,
//   playerSeatSummaries: z.record(GameTableSeatSchema, BfgGameActionPlayerOutcomeStrSchema),
//   hostSummary: BfgGameActionHostOutcomeStrSchema,
//   nextActions: z.array(BfgGameActionSchema).nullable(),
// });
// export type BfgGameSpecificPlayerActionOutcome = z.infer<typeof BfgGameSpecificPlayerActionOutcomeSchema>;


// export const BfgGameSpecificHostActionOutcomeSchema = z.object({}).passthrough();
// export type BfgGameSpecificHostActionOutcome = z.infer<typeof BfgGameSpecificHostActionOutcomeSchema>;


// export type PlayerActionHandler = (playerAction: BfgGameActionByPlayer) => BfgGameSpecificPlayerActionOutcome;
// export type PlayerActionHandler<GPA extends BfgGameActionByPlayer> = (playerAction: GPA) => Promise<BfgGameSpecificPlayerActionOutcome>;

// export type HostActionHandler<GHA extends BfgGameActionByHost> = (hostAction: GHA) => Promise<BfgGameSpecificHostActionOutcome>;


// export const PlayerActionOutcomeSummarySchema = z.string().brand<'PlayerActionOutcomeSummary'>();
// export type PlayerActionOutcomeSummary = z.infer<typeof PlayerActionOutcomeSummarySchema>;

// export const HostActionOutcomeSummarySchema = z.string().brand<'HostActionOutcomeSummary'>();
// export type HostActionOutcomeSummary = z.infer<typeof HostActionOutcomeSummarySchema>;
