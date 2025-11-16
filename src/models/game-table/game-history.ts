// import z from "zod";
// import { GameTableStateStepDbSchema } from "./game-table-event";
// import { GameEventChangeSchema } from "./game-event-change";
// import { LatestGameStateSchema } from "./latest-game-state";


// export const GameHistoryStepSchema = z.object({
//   event: GameTableStateStepDbSchema,
//   change: GameEventChangeSchema,
//   nextGameState: LatestGameStateSchema,
// });

// export type GameHistoryStep = z.infer<typeof GameHistoryStepSchema>;

// export const GameHistorySchema = z.array(GameHistoryStepSchema);
// export type GameHistory = z.infer<typeof GameHistorySchema>;
