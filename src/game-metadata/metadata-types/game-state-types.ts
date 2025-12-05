// import { z } from "zod";
// import { GameTableSeatSchema } from "../../models/internal/game-room-base";


// export const BfgGameStateBaseSchema = z.object({}).catchall(z.unknown());
// export type BfgGameStateBase = z.infer<typeof BfgGameStateBaseSchema>;

// export const BfgGameStateForHostSchema = BfgGameStateBaseSchema.extend({});
// export type BfgGameStateForHost = z.infer<typeof BfgGameStateForHostSchema>;

// export const BfgGameStateForPlayerSchema = BfgGameStateBaseSchema.extend({});
// export type BfgGameStateForPlayer = z.infer<typeof BfgGameStateForPlayerSchema>;

// export const AssignedBfgGameStateForPlayerSchema = BfgGameStateForPlayerSchema.extend({
//   playerSeat: GameTableSeatSchema,
// });
// export type AssignedBfgGameStateForPlayer = z.infer<typeof AssignedBfgGameStateForPlayerSchema>;

// export const AllAssignedBfgGameStateForPlayersSchema = z.array(AssignedBfgGameStateForPlayerSchema);
// export type AllAssignedBfgGameStateForPlayers = z.infer<typeof AllAssignedBfgGameStateForPlayersSchema>;

// export const BfgGameStateForWatcherSchema = BfgGameStateBaseSchema.extend({});
// export type BfgGameStateForWatcher = z.infer<typeof BfgGameStateForWatcherSchema>;



// export const BfgGameActionSource = ['player', 'host'] as const;

// export type BfgGameActionSource = typeof BfgGameActionSource[number];


// // export const BfgGameEventSchema = z.object({});
// // export type BfgGameEvent = z.infer<typeof BfgGameEventSchema>;

// export const BfgGameEventOutcomeSchema = z.object({});
// export type BfgGameEventOutcome = z.infer<typeof BfgGameEventOutcomeSchema>;

