import { z } from "zod";
import React from "react";
import type { GameRoomP2p } from "../../models/p2p/game-room-p2p";
import type { GameTableSeat } from "../../models/internal/game-room-base";
import type { GameLobby } from "../../models/p2p-lobby";
import type { RoomPhase } from "../../models/internal/table-phase";
import type { GameTableEventForDb } from "../metadata-types";
// import type { GameTableEventForGameStep } from "../../models/game-table/game-table-event";
// import type { BfgGameActionByHost, BfgGameActionByPlayer, BfgGameHostActionOutcome, BfgGamePlayerActionOutcome } from "../metadata-types/game-action-types";
// import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../metadata-types/game-state-types";
// import type { GameTableEventForDb } from "../../models/tinybase/game-board-event";
// import type { GameBoardEventForDb } from "../../models/game-table/game-table-event-db";
// import type { GameTableEventForHostP2p, GameTableEventForPlayerP2p, GameTableEventForWatcherP2p } from "../../models/p2p/game-table-event-p2p";


export const PlayerActionOutcomeSummarySchema = z.string().brand('PlayerActionOutcomeSummary');
export type PlayerActionOutcomeSummary = z.infer<typeof PlayerActionOutcomeSummarySchema>;

export const HostActionOutcomeSummarySchema = z.string().brand('HostActionOutcomeSummary');
export type HostActionOutcomeSummary = z.infer<typeof HostActionOutcomeSummarySchema>;

// export const WatcherActionOutcomeSummarySchema = z.string().brand('WatcherActionOutcomeSummary');
// export type WatcherActionOutcomeSummary = z.infer<typeof WatcherActionOutcomeSummarySchema>;



// export type ApplyPlayerActionResult<
//   GSH extends BfgGameStateForHost,
//   GPA extends BfgGameActionByPlayer,
//   GPAO extends BfgGamePlayerActionOutcome,
// > = {
//   playerAction: GPA;
//   playerActionOutcome: GPAO;
//   updatedGameState: GSH;
//   updatedRoomPhase: RoomPhase,
// }

// export type ApplyHostActionResult<
//   GSH extends BfgGameStateForHost,
//   GHA extends BfgGameActionByHost,
//   GHAO extends BfgGameHostActionOutcome,
// > = {
//   hostAction: GHA;
//   hostActionOutcome: GHAO;
//   updatedGameState: GSH;
//   updatedRoomPhase: RoomPhase,
// }


export type ApplyPlayerActionResult<
  HostGameStateSchema extends z.ZodType,
  PlayerGameActionSchema extends z.ZodType,
  HostGameEventOutcomeSchema extends z.ZodType,
  // PlayerGameEventPerspectiveSchema extends z.ZodType,
  // GPAO extends BfgGamePlayerActionOutcome,
> = {
  playerAction: z.infer<PlayerGameActionSchema>;
  playerActionOutcome: z.infer<HostGameEventOutcomeSchema>;
  updatedGameState: z.infer<HostGameStateSchema>;
  updatedRoomPhase: RoomPhase,
}

export type ApplyHostActionResult<
  // GSH extends BfgGameStateForHost,
  // GHA extends BfgGameActionByHost,
  // GHAO extends BfgGameHostActionOutcome,
  HostGameStateSchema extends z.ZodType,
  HostGameActionSchema extends z.ZodType,
  HostGameEventOutcomeSchema extends z.ZodType,
> = {
  hostAction: z.infer<HostGameActionSchema>;
  hostActionOutcome: z.infer<HostGameEventOutcomeSchema>;
  updatedGameState: z.infer<HostGameStateSchema>;
  updatedRoomPhase: RoomPhase,
}


export interface IBfgGameProcessor<
  HostGameStateSchema extends z.ZodType,
  // PlayerGamePerspectiveSchema extends z.ZodType,
  // WatcherGamePerspectiveSchema extends z.ZodType,
  HostGameActionSchema extends z.ZodType,
  PlayerGameActionSchema extends z.ZodType,
  // GameEventSchema extends z.ZodType,
  HostGameEventOutcomeSchema extends z.ZodType,
  GameEventOutcomePlayerPerspectiveSchema extends z.ZodType,
  // WatcherGameEventPerspectiveSchema extends z.ZodType,
> {
  createHostStartsGameAction: (lobbyState: GameLobby) => z.infer<HostGameActionSchema>,

  createHostOpensGameOutcome: (startGameAction: z.infer<HostGameActionSchema>) => z.infer<HostGameEventOutcomeSchema>,

  createHostOpensGameState: (startGameAction: z.infer<HostGameActionSchema>) => z.infer<HostGameStateSchema>,

  getNextToActPlayers: (gameRoom: GameRoomP2p, gameState: z.infer<HostGameStateSchema>) => GameTableSeat[],

  getPlayerDetailsLine: (gameRoom: GameRoomP2p, gameState: z.infer<HostGameStateSchema>, playerSeat: GameTableSeat) => React.ReactNode,

  applyPlayerAction: (gameRoom: GameRoomP2p, gameState: z.infer<HostGameStateSchema>, playerAction: z.infer<PlayerGameActionSchema>) => 
    Promise<ApplyPlayerActionResult<HostGameStateSchema, PlayerGameActionSchema, HostGameEventOutcomeSchema>>,

  applyHostAction: (gameRoom: GameRoomP2p, gameState: z.infer<HostGameStateSchema>, hostAction: z.infer<HostGameActionSchema>) => 
    Promise<ApplyHostActionResult<HostGameStateSchema, HostGameActionSchema, HostGameEventOutcomeSchema>>,

  summarizeGameEvent: (gameEvent: GameTableEventForDb) => string,

  summarizePlayerActionOutcome: (playerActionOutcome: z.infer<GameEventOutcomePlayerPerspectiveSchema>) => PlayerActionOutcomeSummary,
  
  summarizeHostActionOutcome: (hostActionOutcome: z.infer<HostGameEventOutcomeSchema>) => HostActionOutcomeSummary,

  // summarizeWatcherActionOutcome: (watcherActionOutcome: z.infer<WatcherGameEventPerspectiveSchema>) => WatcherActionOutcomeSummary,
}





// export interface IBfgGameEngineAccessLevelAdapters {
//   hostGameStateToPlayerAccessLevelAdapter: <
//     GSH extends BfgGameStateForHost,
//     GSP extends BfgGameStateForPlayer,
//   >(hostState: GSH) => GSP;
// }



// export type BfgGameEngineAccessLevelAdapters = {
//   hostGameStateToPlayerAccessLevelAdapter: <
//     GSH extends BfgGameStateForHost,
//     GSP extends BfgGameStateForPlayer,
//   >(hostState: GSH) => GSP;
  
//   hostGameStateToWatcherAccessLevelAdapter: <
//     GSH extends BfgGameStateForHost,
//     GSW extends BfgGameStateForWatcher,
//   >(hostState: GSH) => GSW;

//   hostEventTransitionFromHostEventTransitionDb: <
//     GTDb extends GameBoardEventForDb,
//     GTH extends GameTableEventForHostP2p,
//   >(hostEventTransitionDb: GTDb) => GTH;

//   hostEventTransitionToPlayerAccessLevelAdapter: <
//     GTH extends GameBoardEventForDb,
//     GTP extends GameTableEventForPlayerP2p,
//   >(playerSeat: GameTableSeat, hostEventTransitionDb: GTH) => GTP;

//   hostEventTransitionToWatcherAccessLevelAdapter: <
//     GTH extends GameBoardEventForDb,
//     GTW extends GameTableEventForWatcherP2p,
//   >(hostEventTransition: GTH) => GTW;
// }


// export type BfgGameStateAccessLevelAdapters = {
//   hostGameStateToPlayerPerspectiveAdapter: <
//     GSH extends BfgGameStateForHost,
//     GSP extends BfgGameStateForPlayer,
//   >(hostState: GSH) => GSP;
//   hostGameStateToWatcherPerspectiveAdapter: <
//     GSH extends BfgGameStateForHost,
//     GSW extends BfgGameStateForWatcher,
//   >(hostState: GSH) => GSW;
//   // hostEventTransitionFromHostEventTransitionDb: <
//   //   GTDb extends GameBoardEventForDb,
//   //   GTH extends GameTableEventForHostP2p,
//   // >(hostEventTransitionDb: GTDb) => GTH;

//   hostEventTransitionToPlayerAccessLevelAdapter: <
//     GTH extends GameBoardEventForDb,
//     GTP extends GameTableEventForPlayerP2p,
//   >(playerSeat: GameTableSeat, hostEventTransitionDb: GTH) => GTP;

//   hostEventTransitionToWatcherAccessLevelAdapter: <
//     GTH extends GameBoardEventForDb,
//     GTW extends GameTableEventForWatcherP2p,
//   >(hostEventTransition: GTH) => GTW;
// }



// export type BfgGameEngineAccessLevelAdapters = {
//   hostGameStateToPlayerAccessLevelAdapter: <
//     GSH extends BfgGameStateForHost,
//     GSP extends BfgGameStateForPlayer,
//   >(hostState: GSH) => GSP;
  
//   hostGameStateToWatcherAccessLevelAdapter: <
//     GSH extends BfgGameStateForHost,
//     GSW extends BfgGameStateForWatcher,
//   >(hostState: GSH) => GSW;

//   // hostEventTransitionFromHostEventTransitionDb: <
//   //   GTDb extends GameBoardEventForDb,
//   //   GTH extends GameTableEventForHostP2p,
//   // >(hostEventTransitionDb: GTDb) => GTH;

//   hostEventTransitionToPlayerAccessLevelAdapter: <
//     GTH extends GameBoardEventForDb,
//     GTP extends GameTableEventForPlayerP2p,
//   >(playerSeat: GameTableSeat, hostEventTransitionDb: GTH) => GTP;

//   hostEventTransitionToWatcherAccessLevelAdapter: <
//     GTH extends GameBoardEventForDb,
//     GTW extends GameTableEventForWatcherP2p,
//   >(hostEventTransition: GTH) => GTW;
// }