import { z } from "zod";
import { GameTableSeatSchema } from "../../models/game-table/game-room-p2p";


// export const BfgGameActionSource = ['player', 'host'] as const;

// export type BfgGameActionSource = typeof BfgGameActionSource[number];


export const BfgGameActionSource = ['player', 'host'] as const;

export type BfgGameActionSource = typeof BfgGameActionSource[number];


export const BfgGameEventSchema = z.object({
  source: z.enum(BfgGameActionSource),
});
export type BfgGameEvent = z.infer<typeof BfgGameEventSchema>;

export const BfgGameEventOutcomeSchema = z.object({});
export type BfgGameEventOutcome = z.infer<typeof BfgGameEventOutcomeSchema>;



// export const BfgGameEventBaseSchema = BfgGameActionBaseSchema.extend({
//   source: z.enum(BfgGameActionSource),
//   // actionType: z.string(),
// });
// export type BfgGameEventBase = z.infer<typeof BfgGameEventBaseSchema>;


export const BfgGameActionByPlayerSchema = BfgGameEventSchema.extend({
  source: z.literal('player'),
  playerSeat: GameTableSeatSchema,
  // actionType: z.string(),
});

export type BfgGameActionByPlayer = z.infer<typeof BfgGameActionByPlayerSchema>;
// export type PGAExt = Extends<BfgGameActionByPlayer, typeof BfgGameActionByPlayerSchema>;


export const AllBfgGameActionsByPlayerSchema = z.array(BfgGameActionByPlayerSchema);
// export type AllBfgGameActionsByPlayer = z.infer<typeof AllBfgGameActionsByPlayerSchema>;



export const BfgGameActionByHostSchema = BfgGameEventSchema.extend({
  source: z.literal('host'),
  // actionType: z.string(),
});

export type BfgGameActionByHost = z.infer<typeof BfgGameActionByHostSchema>;

export const BfgGameActionSchema = z.discriminatedUnion('source', [
  BfgGameActionByPlayerSchema,
  BfgGameActionByHostSchema,
]);

export type BfgGameAction = z.infer<typeof BfgGameActionSchema>;

// export const AllBfgGameActionsByHostSchema = z.array(BfgGameActionByHostSchema);
// export type AllBfgGameActionsByHost = z.infer<typeof AllBfgGameActionsByHostSchema>;


export const BfgGamePlayerActionOutcomeSchema = z.object({});
export type BfgGamePlayerActionOutcome = z.infer<typeof BfgGamePlayerActionOutcomeSchema>;

export const BfgGameHostActionOutcomeSchema = z.object({});
export type BfgGameHostActionOutcome = z.infer<typeof BfgGameHostActionOutcomeSchema>;


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
