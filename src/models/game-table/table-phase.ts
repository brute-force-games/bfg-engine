import { z } from "zod";


export const TablePhaseEnumSchema = z.enum([
  "table-phase-lobby",
  "table-phase-lobby-abandoned",
  "table-phase-game-in-progress",
  "table-phase-game-complete-with-winners",
  "table-phase-game-complete-with-draw",
  "table-phase-game-complete-no-winners",
  "table-phase-game-abandoned",
  "table-phase-error",
]);

export type TablePhase = z.infer<typeof TablePhaseEnumSchema>;


export type GameTableActionResult<T> = {
  tablePhase: TablePhase;
  gameSpecificState: T;
  gameSpecificStateSummary: string;
}


export const isGameOver = (tablePhase: TablePhase) => {
  switch (tablePhase) {
    case "table-phase-game-in-progress":
    case "table-phase-lobby":
      return false;

    case "table-phase-lobby-abandoned":
    case "table-phase-game-abandoned":
    case "table-phase-error":
    case "table-phase-game-complete-with-draw":
    case "table-phase-game-complete-with-winners":
    default:
      return true;
  }
}
