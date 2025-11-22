import { z } from "zod";
import React from "react";
import type { GameRoomP2p } from "../../models/p2p/game-room-p2p";
import type { GameTableSeat } from "../../models/internal/game-room-base";
import type { GameTableEventWithTransition } from "../../models/game-table/game-table-event";
import type { GameLobby } from "../../models/p2p-lobby";
import type { BfgGameActionByHost, BfgGameActionByPlayer, BfgGameHostActionOutcome, BfgGamePlayerActionOutcome } from "../metadata-types/game-action-types";
import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../metadata-types/game-state-types";
import type { RoomPhase } from "../../models/internal/table-phase";
import type { GameBoardEventForDb } from "../../models/game-table/game-table-event-db";
import type { GameTableEventForHostP2p, GameTableEventForPlayerP2p, GameTableEventForWatcherP2p } from "../../models/p2p/game-table-event-p2p";


export const PlayerActionOutcomeSummarySchema = z.string().brand('PlayerActionOutcomeSummary');
export type PlayerActionOutcomeSummary = z.infer<typeof PlayerActionOutcomeSummarySchema>;

export const HostActionOutcomeSummarySchema = z.string().brand('HostActionOutcomeSummary');
export type HostActionOutcomeSummary = z.infer<typeof HostActionOutcomeSummarySchema>;



export type ApplyPlayerActionResult<
  GSH extends BfgGameStateForHost,
  GPA extends BfgGameActionByPlayer,
  GPAO extends BfgGamePlayerActionOutcome,
> = {
  playerAction: GPA;
  playerActionOutcome: GPAO;
  updatedGameState: GSH;
  updatedRoomPhase: RoomPhase,
}

export type ApplyHostActionResult<
  GSH extends BfgGameStateForHost,
  GHA extends BfgGameActionByHost,
  GHAO extends BfgGameHostActionOutcome,
> = {
  hostAction: GHA;
  hostActionOutcome: GHAO;
  updatedGameState: GSH;
  updatedRoomPhase: RoomPhase,
}


export interface IBfgGameProcessor {
  createHostStartsGameAction: <
    GAH extends BfgGameActionByHost,
  >(lobbyState: GameLobby) => GAH,

  createHostOpensGameOutcome: <
    GAH extends BfgGameActionByHost,
    GHAO extends BfgGameHostActionOutcome,
  >(startGameAction: GAH) => GHAO,

  createHostOpensGameState: <
    GAH extends BfgGameActionByHost,
    GSH extends BfgGameStateForHost,
  >(startGameAction: GAH) => GSH,

  getNextToActPlayers: <
    GSH extends BfgGameStateForHost,
  >(gameRoom: GameRoomP2p, gameState: GSH) => GameTableSeat[],

  getPlayerDetailsLine: <
    GSH extends BfgGameStateForHost,
  >(gameRoom: GameRoomP2p, gameState: GSH, playerSeat: GameTableSeat) => React.ReactNode,

  summarizeGameEvent: (gameEvent: GameTableEventWithTransition) => string,

  applyPlayerAction: <
    GSH extends BfgGameStateForHost,
    GPA extends BfgGameActionByPlayer,
    GPAO extends BfgGamePlayerActionOutcome,
  >(gameRoom: GameRoomP2p, gameState: GSH, playerAction: GPA) => Promise<ApplyPlayerActionResult<GSH, GPA, GPAO>>,

  applyHostAction: <
    GSH extends BfgGameStateForHost,
    GAH extends BfgGameActionByHost,
    GHAO extends BfgGameHostActionOutcome,
  >(gameRoom: GameRoomP2p, gameState: GSH, hostAction: GAH) => Promise<ApplyHostActionResult<GSH, GAH, GHAO>>,

  summarizePlayerActionOutcome: <
    GPAO extends BfgGamePlayerActionOutcome,
  >(playerActionOutcome: GPAO) => PlayerActionOutcomeSummary,
  
  summarizeHostActionOutcome: <
    GHAO extends BfgGameHostActionOutcome,
  >(hostActionOutcome: GHAO) => HostActionOutcomeSummary,
}


export interface IBfgGameEngineAccessLevelAdapters {
  hostGameStateToPlayerAccessLevelAdapter: <
    GSH extends BfgGameStateForHost,
    GSP extends BfgGameStateForPlayer,
  >(hostState: GSH) => GSP;
  
  // hostGameStateToWatcherAccessLevelAdapter: <
  //   GSH extends BfgGameStateForHost,
  //   GSW extends BfgGameStateForWatcher,
  // >(hostState: GSH) => GSW;

  // hostEventTransitionFromHostEventTransitionDb: <
  //   GTDb extends GameBoardEventForDb,
  //   GTH extends GameTableEventForHostP2p,
  // >(hostEventTransitionDb: GTDb) => GTH;

  // hostEventTransitionToPlayerAccessLevelAdapter: <
  //   GTH extends GameBoardEventForDb,
  //   GTP extends GameTableEventForPlayerP2p,
  // >(playerSeat: GameTableSeat, hostEventTransitionDb: GTH) => GTP;

  // hostEventTransitionToWatcherAccessLevelAdapter: <
  //   GTH extends GameBoardEventForDb,
  //   GTW extends GameTableEventForWatcherP2p
  // >(hostEventTransition: GTH) => GTW;
}



export type BfgGameEngineAccessLevelAdapters = {
  hostGameStateToPlayerAccessLevelAdapter: <
    GSH extends BfgGameStateForHost,
    GSP extends BfgGameStateForPlayer,
  >(hostState: GSH) => GSP;
  
  hostGameStateToWatcherAccessLevelAdapter: <
    GSH extends BfgGameStateForHost,
    GSW extends BfgGameStateForWatcher,
  >(hostState: GSH) => GSW;

  hostEventTransitionFromHostEventTransitionDb: <
    GTDb extends GameBoardEventForDb,
    GTH extends GameTableEventForHostP2p,
  >(hostEventTransitionDb: GTDb) => GTH;

  hostEventTransitionToPlayerAccessLevelAdapter: <
    GTH extends GameBoardEventForDb,
    GTP extends GameTableEventForPlayerP2p,
  >(playerSeat: GameTableSeat, hostEventTransitionDb: GTH) => GTP;

  hostEventTransitionToWatcherAccessLevelAdapter: <
    GTH extends GameBoardEventForDb,
    GTW extends GameTableEventForWatcherP2p,
  >(hostEventTransition: GTH) => GTW;
}