import { z } from "zod";
import React from "react";
import type { GameRoomP2p, GameTableSeat } from "../../models/game-table/game-room-p2p";
import type { GameTableEventWithTransition } from "../../models/game-table/game-table-event";
import type { GameLobby } from "../../models/p2p-lobby";
import type { BfgGameActionByHost, BfgGameActionByPlayer, BfgGameHostActionOutcome, BfgGamePlayerActionOutcome } from "../metadata-types/game-action-types";
import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../metadata-types/game-state-types";
import type { RoomPhase } from "../../models/game-table/table-phase";
import type { GameBoardEventForDb } from "../../models/game-table/game-board-transition-db";
import type { GameTableEventForHostP2p, GameTableEventForPlayerP2p, GameTableEventForWatcherP2p } from "../../models/game-table/game-table-event-p2p";
// import type { GameTableEventResult } from "../../models/game-table/table-phase";


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


export interface IBfgGameProcessor
// <
//   // GHA extends BfgGameActionByHost,
//   GAHSchema extends z.ZodType<BfgGameActionByHost>,
//   GSHSchema extends z.ZodType<BfgGameStateForHost>,
//   // GAHSchema extends z.ZodSchema<BfgGameActionByHost>,
//   // GSH extends BfgGameStateForHost,
//   // // GSP extends BfgGameStateForPlayer,
//   // // GSW extends BfgGameStateForWatcher,
//   // // PGA extends BfgGameActionByPlayer,
//   // HGA extends BfgGameActionByHost,
// > 
{

  createHostStartsGameAction: <
    GAH extends BfgGameActionByHost,
    // GED extends z.ZodType<GameTableEventData>
  >(lobbyState: GameLobby) => GAH,

  createHostOpensGameOutcome: <
    GAH extends BfgGameActionByHost,
    GHAO extends BfgGameHostActionOutcome,
    // GED extends z.ZodType<GameTableEventData>
  >(startGameAction: GAH) => GHAO,

  createHostOpensGameState: <
    GAH extends BfgGameActionByHost,
    GSH extends BfgGameStateForHost,
    // GED extends z.ZodType<GameTableEventData>
  >(startGameAction: GAH) => GSH,

  // applyHostStartsGameAction: <
  //   GAH extends BfgGameActionByHost,
  //   GSH extends BfgGameStateForHost,
  //   // GED extends z.ZodType<GameTableEventData>
  // >(gameRoom: GameRoomP2p, startGameAction: GAH) => Promise<GSH>,

  getNextToActPlayers: <
    GSH extends BfgGameStateForHost,
  >(gameRoom: GameRoomP2p, gameState: GSH) => GameTableSeat[],

  getPlayerDetailsLine: <
    GSH extends BfgGameStateForHost,
  >(gameRoom: GameRoomP2p, gameState: GSH, playerSeat: GameTableSeat) => React.ReactNode,
  // getPlayerDetailsLine: (gameState: BfgGameStateForHost, playerSeat: GameTableSeat) => React.ReactNode,

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
    // GSH extends z.ZodType<BfgGameStateForHost>,
    GPAO extends BfgGamePlayerActionOutcome,
  >(playerActionOutcome: GPAO) => PlayerActionOutcomeSummary,
  
  summarizeHostActionOutcome: <
    // GSH extends z.ZodType<BfgGameStateForHost>,
    GHAO extends BfgGameHostActionOutcome,
  >(hostActionOutcome: GHAO) => HostActionOutcomeSummary,
}


// export const createCompleteGameProcessor = (
//   gameStateAccessTypes: BfgMetadataGameStateAccessTypes,
//   processorHandlers: IBfgGameProcessor<
//     typeof gameStateAccessTypes.hostGameStateSchema,
//     HGAExt
//   >,
// ) => {

//   type InferredGSH = z.infer<typeof gameStateAccessTypes.hostGameStateSchema>;

//   const applyPlayerAction = async (_tableState: GameTable, _gameState: InferredGSH, _playerAction: BfgGameActionByPlayer) => {
//     throw new Error('Not implemented');
//   };

//   const applyHostAction = async (_tableState: GameTable, _gameState: InferredGSH, _hostAction: BfgGameActionByHost) => {
//     throw new Error('Not implemented');
//   };

//   const retVal = {
//     ...processorHandlers,
//     applyPlayerAction,
//     applyHostAction,
//   };

//   return retVal;
// }

// export type CompleteGameProcessor = ReturnType<typeof createCompleteGameProcessor>;



export interface IBfgGameEngineAccessLevelAdapters {
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
    GTW extends GameTableEventForWatcherP2p
  >(hostEventTransition: GTH) => GTW;
}