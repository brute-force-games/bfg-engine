import { z } from "zod";
import { PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { getPlayerActionSource } from "./player-seat-utils";
import { GameTable } from "../../models/game-table/game-table";
import { TablePhase } from "../../models/game-table/table-phase";
import { IGameRegistry } from "../../hooks/games-registry/games-registry";
import { BfgEncodedString } from "~/models/game-engine/encoders";


export type HostApplyHostActionResult = {
  resultTablePhase: TablePhase;
  gameTable: GameTable;
  gameAction: DbGameTableAction;
}

export const asHostApplyHostAction = async <GameSpecificAction extends z.ZodTypeAny>(
  gameRegistry: IGameRegistry,
  gameTable: GameTable,
  gameActions: DbGameTableAction[],
  hostPlayerId: PlayerProfileId, 
  hostAction: z.infer<GameSpecificAction>
): Promise<HostApplyHostActionResult> => {
  
  if (!gameTable) {
    throw new Error("Table not found");
  }

  throw new Error("Not implemented");


  console.log("INCOMING HOST ACTION", hostAction);

  const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
  const gameEngine = gameMetadata.engine;
  // const gameProcessor = gameEngine.processor;
  const gameProcessor = gameEngine;

  const playerActionSource = getPlayerActionSource(gameTable, playerId);  

  const latestAction = gameActions[gameActions.length - 1];

  // const actionStr = gameMetadata.hostActionEncoder.encode(initialGameSpecificAction.gameSpecificAction);
  // const initialGameStateJonsStr = latestAction.actionOutcomeGameStateJsonStr;
  // const currentGameStateJson = JSON.parse(latestAction.nextGameStateStr);
  const currentGameState = gameMetadata.gameSpecificStateEncoder.decode(latestAction.nextGameStateStr);

  // console.log("MAKE MOVE - CURRENT GAME STATE JSON", currentGameStateJson);
  console.log("MAKE MOVE - CURRENT GAME STATE (PARSED)", currentGameState);

  if (!currentGameState) {
    throw new Error("Failed to parse current game state");
  }

  // const currentGameState = currentGameStateResult.data;

  // const initialGameStateJson = latestAction.actionOutcomeGameStateJsonStr;
  // const initialGameState = gameEngine.parseGameSpecificGameStateJson(
  //   initialGameStateJson as any);


  // if (!gameEngine.applyGameAction) {
  //   throw new Error("Game engine does not support applyGameAction");
  // }

  const afterActionResult = await gameProcessor.applyPlayerAction(gameTable, currentGameState, playerAction);

  const { tablePhase, gameSpecificStateSummary } = afterActionResult;

  console.log("MAKE MOVE - PLAYER ACTION", playerAction);
  console.log("MAKE MOVE - AFTER ACTION RESULT", afterActionResult);

  // const playerActionJson = gameEngine.createGameSpecificActionJson?.(playerAction) ?? playerAction;
  const playerActionJsonStr = gameMetadata.playerActionEncoder.encode(playerAction);
  const nextGameStateJsonStr = gameMetadata.gameSpecificStateEncoder.encode(afterActionResult.gameSpecificState);

  console.log("MAKE MOVE - playerActionJson", playerActionJsonStr);

  // const actionOutcomeGameState = afterActionResult.gameSpecificState;
  // const actionOutcomeGameStateJson = gameEngine.createGameSpecificGameStateJson?.(actionOutcomeGameState) ?? actionOutcomeGameState;
  // console.log("MAKE MOVE - actionOutcomeGameStateJson", actionOutcomeGameStateJson);

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
    actionType: "game-table-action-player-action",
    actionStr: playerActionJsonStr as unknown as BfgEncodedString,
    nextGameStateStr: nextGameStateJsonStr as unknown as BfgEncodedString,
  }

  const retVal: HostApplyHostActionResult = {
    resultTablePhase: tablePhase,
    gameTable: nextGameTable,
    gameAction: playerMoveAction,
  } satisfies HostApplyHostActionResult;

  return retVal;
}
