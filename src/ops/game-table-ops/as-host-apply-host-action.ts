import type { z } from "zod";
import { type GameTableEventForGameStep } from "../../models/game-table/game-table-event";
import { type GameRoomP2p } from "../../models/p2p/game-room-p2p";
import { RoomPhase } from "../../models/internal/table-phase";
import type { GenericGameMetadata, IGameRegistry } from "../../game-metadata/games-registry";
import type { BfgGameActionByHost } from "../../game-metadata/metadata-types/game-action-types";
import type { BfgGameStep } from "../../models/types/bfg-versions";
// import type { BfgGameStateForHost } from "../../game-metadata/metadata-types/game-state-types";
// import type { GameStateTransitionForDb } from "../../models/game-table/game-table-event-db";


export type HostApplyHostActionResult = {
  resultTablePhase: RoomPhase;
  gameRoom: GameRoomP2p;
  gameEvent: GameTableEventForGameStep;
  gameEventOutcome: z.infer<GenericGameMetadata['schemas']['hostGameEventOutcomeSchema']>;
  nextGameState: z.infer<GenericGameMetadata['schemas']['hostGameStateSchema']>;
}

export const asHostApplyHostAction = async (
  gameRegistry: IGameRegistry,
  gameRoom: GameRoomP2p,
  latestGameStep: BfgGameStep,
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
  // const nextStepIndex = gameRoom.latestGameStepIndex + 1;
  const nextStepIndex = latestGameStep.stepIndex + 1;

  const nextGameRoom: GameRoomP2p = {
    ...gameRoom,
    latestRoomPhase: updatedRoomPhase,
    latestRoomStatusDescription: afterActionSummary,
    // latestGameStepIndex: nextStepIndex,
  }

  // const updatedWatcherState = gameMetadata.accessLevelAdapters.hostToWatcherAccessLevelAdapter(updatedGameState);

  const gameStep = {
    stepIndex: nextStepIndex,
    createdAt: now,
    event: hostAction,
    // outcome: {
    //   ...afterActionResult.hostActionOutcome,
    //   description: afterActionSummary,
    // },
    outcome: afterActionResult.hostActionOutcome,
    nextBoardState: updatedGameState,
  };

  // Nested structure - gameStep contains the step details, top level has metadata
  const hostActionStep: GameTableEventForGameStep = {
    stepIndex: nextStepIndex,
    createdAt: now,
    source: 'game-table-action-source-host',
    eventType: 'game-table-action-host-action',
    gameStep,
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
