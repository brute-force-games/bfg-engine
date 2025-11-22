import { z } from "zod";
// import type { BfgGameSpecificPlayerActionOutcome, BfgGameSpecificHostActionOutcome } from "../../game-metadata/metadata-types/game-action-types";
// import { BfgHostGameImplState } from "../game-engine/bfg-game-engine-types";
// import { BfgGameSpecificHostActionOutcome, BfgGameSpecificPlayerActionOutcome } from "./game-table-action";


export const ROOM_PHASE_LOBBY = 'room-phase-lobby' as const;
export const ROOM_PHASE_LOBBY_ABANDONED = 'room-phase-lobby-abandoned' as const;
// export const ROOM_PHASE_GAME_SETUP = 'room-phase-game-setup' as const;
export const ROOM_PHASE_GAME_IN_PROGRESS = 'room-phase-game-in-progress' as const;
export const ROOM_PHASE_GAME_COMPLETE_WITH_WINNERS = 'room-phase-game-complete-with-winners' as const;
export const ROOM_PHASE_GAME_COMPLETE_WITH_DRAW = 'room-phase-game-complete-with-draw' as const;
export const ROOM_PHASE_GAME_COMPLETE_NO_WINNERS = 'room-phase-game-complete-no-winners' as const;
export const ROOM_PHASE_GAME_ABANDONED = 'room-phase-game-abandoned' as const;
export const ROOM_PHASE_ERROR = 'room-phase-error' as const;


export const RoomPhaseEnumSchema = z.enum([
  ROOM_PHASE_LOBBY,
  ROOM_PHASE_LOBBY_ABANDONED,
  // ROOM_PHASE_GAME_SETUP,
  ROOM_PHASE_GAME_IN_PROGRESS,
  ROOM_PHASE_GAME_COMPLETE_WITH_WINNERS,
  ROOM_PHASE_GAME_COMPLETE_WITH_DRAW,
  ROOM_PHASE_GAME_COMPLETE_NO_WINNERS,
  ROOM_PHASE_GAME_ABANDONED,
  ROOM_PHASE_ERROR,
]);

export type RoomPhase = z.infer<typeof RoomPhaseEnumSchema>;


export type ActionEventSource = 'player' | 'host';

// export type GameTableEventResult<
//   AES extends ActionEventSource,
//   GSH extends BfgGameStateForHost,
//   GASO extends AES extends 'player' ? GameTableEventResult<'player', GSH, z.infer<GASO>> | null : GameTableEventResult<'host', GSH, z.infer<GASO>> | null
// > = {
//   tablePhase: RoomPhase;
//   actionSource: AES;
//   gameSpecificState: GSH;
//   gameSpecificActionOutcome: GASO;
//   // gameSpecificStateSummary: string;
// }


// export type GameTablePhaseInProgressEventResult<
//   AS extends ActionEventSource,
//   GHS extends BfgGameStateForHost,
//   GASO extends AS extends 'player' ? BfgGameSpecificPlayerActionOutcome : BfgGameSpecificHostActionOutcome
// > = GameTableEventResult<AS, GHS, GASO> & {
//   tablePhase: 'table-phase-game-in-progress';
//   actionSource: AS;
//   gameSpecificState: GHS;
//   gameSpecificActionOutcome: GASO | null;
//   gameSpecificStateSummary: string;
// }


export const isGameOver = (tablePhase: RoomPhase) => {
  switch (tablePhase) {
    case "room-phase-game-in-progress":
    // case "room-phase-game-setup":
    case "room-phase-lobby":
      return false;

    case "room-phase-lobby-abandoned":
    case "room-phase-game-abandoned":
    case "room-phase-error":
    case "room-phase-game-complete-with-draw":
    case "room-phase-game-complete-with-winners":
      return true;

    default:
      throw new Error(`Unhandled table phase: ${tablePhase}`);
  } 
}
