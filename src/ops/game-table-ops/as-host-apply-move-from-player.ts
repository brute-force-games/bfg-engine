import { z } from "zod";
import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-ids";
import { DbGameTableAction } from "@bfg-engine/models/game-table/game-table-action";
import { getPlayerActionSource } from "./player-seat-utils";
import { GameTable } from "@bfg-engine/models/game-table/game-table";
import { TablePhase } from "@bfg-engine/models/game-table/table-phase";
import { IGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry";


export type HostApplyMoveFromPlayerResult = {
  resultTablePhase: TablePhase;
  gameTable: GameTable;
  gameAction: DbGameTableAction;
}

export const asHostApplyMoveFromPlayer = async <GameSpecificAction extends z.ZodTypeAny>(
  gameRegistry: IGameRegistry,
  gameTable: GameTable,
  gameActions: DbGameTableAction[],
  playerId: PlayerProfileId, 
  playerAction: z.infer<GameSpecificAction>
): Promise<HostApplyMoveFromPlayerResult> => {
  
  if (!gameTable) {
    throw new Error("Table not found");
  }

  console.log("INCOMING PLAYER ACTION", playerAction);

  const selectedGameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
  const selectedGameEngine = selectedGameMetadata.processor;

  const playerActionSource = getPlayerActionSource(gameTable, playerId);  

  const latestAction = gameActions[gameActions.length - 1];

  const initialGameState = selectedGameEngine.parseGameSpecificGameStateJson?.(
    latestAction.actionOutcomeGameStateJson) ?? latestAction.actionOutcomeGameStateJson;

  console.log("MAKE MOVE - INITIAL GAME STATE", initialGameState);

  if (!selectedGameEngine.applyGameAction) {
    throw new Error("Game engine does not support applyGameAction");
  }

  const afterActionResult = selectedGameEngine.applyGameAction(gameTable, initialGameState, playerAction);

  const { tablePhase, gameSpecificStateSummary } = afterActionResult;

  console.log("MAKE MOVE - PLAYER ACTION", playerAction);
  console.log("MAKE MOVE - AFTER ACTION RESULT", afterActionResult);

  const playerActionJson = selectedGameEngine.createGameSpecificActionJson?.(playerAction) ?? playerAction;

  console.log("MAKE MOVE - playerActionJson", playerActionJson);

  const actionOutcomeGameState = afterActionResult.gameSpecificState;
  const actionOutcomeGameStateJson = selectedGameEngine.createGameSpecificGameStateJson?.(actionOutcomeGameState) ?? actionOutcomeGameState;
  console.log("MAKE MOVE - actionOutcomeGameStateJson", actionOutcomeGameStateJson);

  const now = Date.now();

  const nextGameTable: GameTable = {
    ...gameTable,
    tablePhase,
    currentStatusDescription: gameSpecificStateSummary,
  }

  const playerMoveAction: DbGameTableAction = {
    gameTableId: gameTable.id,
    createdAt: now,
    source: playerActionSource,
    actionType: "game-table-action-player-move",
    actionJson: playerActionJson,
    actionOutcomeGameStateJson,
  }

  const retVal: HostApplyMoveFromPlayerResult = {
    resultTablePhase: tablePhase,
    gameTable: nextGameTable,
    gameAction: playerMoveAction,
  } satisfies HostApplyMoveFromPlayerResult;

  return retVal;
}
