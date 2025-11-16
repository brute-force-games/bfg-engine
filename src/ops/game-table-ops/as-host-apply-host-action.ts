import { type GameTableEventWithTransition, type GameTableStepHostP2p } from "../../models/game-table/game-table-event";
import { type GameRoomP2p } from "../../models/game-table/game-room-p2p";
import { RoomPhase } from "../../models/game-table/table-phase";
import type { IGameRegistry } from "../../game-metadata/games-registry";
import type { BfgGameActionByHost, BfgGameHostActionOutcome } from "../../game-metadata/metadata-types/game-action-types";
import type { BfgGameStateForHost } from "../../game-metadata/metadata-types/game-state-types";
import type { GameStateTransitionForDb } from "../../models/game-table/game-board-transition-db";


export type HostApplyHostActionResult = {
  resultTablePhase: RoomPhase;
  gameRoom: GameRoomP2p;
  gameEvent: GameTableEventWithTransition;
  gameEventOutcome: BfgGameHostActionOutcome;
  nextGameState: BfgGameStateForHost;
}

export const asHostApplyHostAction = async (
  gameRegistry: IGameRegistry,
  gameRoom: GameRoomP2p,
  latestGameStep: GameTableStepHostP2p,
  hostAction: BfgGameActionByHost
): Promise<HostApplyHostActionResult> => {
  
  if (!gameRoom) {
    throw new Error("Table not found");
  }

  // console.log("INCOMING HOST ACTION", hostActionStr);

  const gameMetadata = gameRegistry.getGameMetadata(gameRoom.gameTitle);
  const gameEngine = gameMetadata.gameProcessor;
  const gameProcessor = gameEngine;

  const afterActionResult = await gameProcessor.applyHostAction(gameRoom, latestGameStep, hostAction);
  const afterActionSummary = gameProcessor.summarizeHostActionOutcome(afterActionResult.hostActionOutcome);

  const { updatedGameState, updatedRoomPhase } = afterActionResult;

  // console.log("MAKE MOVE - HOST ACTION", hostAction);
  // console.log("MAKE MOVE - AFTER ACTION RESULT", afterActionResult);

  const now = Date.now();
  const nextStepIndex = gameRoom.latestGameStepIndex + 1;

  const nextGameRoom: GameRoomP2p = {
    ...gameRoom,
    latestRoomPhase: updatedRoomPhase,
    latestRoomStatusDescription: afterActionSummary,
    latestGameStepIndex: nextStepIndex,
  }

  // const updatedWatcherState = gameMetadata.accessLevelAdapters.hostToWatcherAccessLevelAdapter(updatedGameState);

  const transition: GameStateTransitionForDb = {
    event: hostAction,
    change: afterActionResult.hostActionOutcome,
    nextBoardState: updatedGameState,
  }

  const hostActionStep: GameTableEventWithTransition = {
    // gameTableId: gameRoom.id,
    createdAt: now,
    stepIndex: nextStepIndex,
    source: 'game-table-action-source-host',
    eventType: 'game-table-action-host-action',
    transition: transition,
  }

  const retVal: HostApplyHostActionResult = {
    resultTablePhase: updatedRoomPhase,
    gameRoom: nextGameRoom,
    gameEvent: hostActionStep,
    gameEventOutcome: afterActionResult.hostActionOutcome,
    nextGameState: updatedGameState,
  } satisfies HostApplyHostActionResult;

  return retVal;
}
