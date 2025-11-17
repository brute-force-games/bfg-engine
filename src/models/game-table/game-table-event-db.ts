// Re-export consolidated types from game-table-event-board-transition.ts for backward compatibility
export {
  createGameStateTransitionSchema as createGameStateTransitionForDbSchema,
  createGameBoardEventSchema as createGameBoardEventForDbSchema,
  type GameStateTransitionForDb,
  type GameBoardEventForDb,
} from "./game-table-event-board-transition";
