import z from "zod";
import { GameTableActionSourceSchema, GameTableEventTypeSchema } from "../game-table/game-table-event";
import { BfgTimestampSchema, BfgGameStepIndexSchema } from "../types/bfg-versions";
import { BfgGameActionTypeStrToolbox, BfgStringifiedGameActionDataStrToolbox, BfgStringifiedGameActionOutcomeStrToolbox, BfgStringifiedNextGameStateStrToolbox } from "../types/bfg-branded-string-types";


export const GameStepPersistTbSchema = z.object({
  createdAt: BfgTimestampSchema,
  stepIndex: BfgGameStepIndexSchema,

  source: GameTableActionSourceSchema,
  eventType: GameTableEventTypeSchema,

  gameActionType: BfgGameActionTypeStrToolbox.schema,
  
  stringifiedGameActionData: BfgStringifiedGameActionDataStrToolbox.schema,
  stringifiedGameActionOutcome: BfgStringifiedGameActionOutcomeStrToolbox.schema,
  stringifiedNextGameState: BfgStringifiedNextGameStateStrToolbox.schema,
});

export type GameStepPersistTbFields = z.infer<typeof GameStepPersistTbSchema>;
export type GameStepPersistTb = GameStepPersistTbFields;
