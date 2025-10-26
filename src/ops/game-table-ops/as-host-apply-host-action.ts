import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { GameTable } from "../../models/game-table/game-table";
import { TablePhase } from "../../models/game-table/table-phase";
import { IGameRegistry } from "../../hooks/games-registry/games-registry";
import { BfgEncodedString } from "~/models/game-engine/encoders";
import { HostP2pActionStr } from "~/hooks/p2p/p2p-types";


export type HostApplyHostActionResult = {
  resultTablePhase: TablePhase;
  gameTable: GameTable;
  gameAction: DbGameTableAction;
}

export const asHostApplyHostAction = async (
  gameRegistry: IGameRegistry,
  gameTable: GameTable,
  gameActions: DbGameTableAction[], 
  hostActionStr: HostP2pActionStr
): Promise<HostApplyHostActionResult> => {
  
  if (!gameTable) {
    throw new Error("Table not found");
  }

  console.log("INCOMING HOST ACTION", hostActionStr);

  const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
  const gameEngine = gameMetadata.engine;
  const gameProcessor = gameEngine;

  const latestAction = gameActions[gameActions.length - 1];
  const currentGameState = gameMetadata.gameSpecificStateEncoder.decode(latestAction.nextGameStateStr);

  console.log("MAKE MOVE - CURRENT GAME STATE (PARSED)", currentGameState);

  if (!currentGameState) {
    throw new Error("Host action failed to parse current game state");
  }

  const hostActionEncoder = gameMetadata.hostActionEncoder;
  const p2pToBfgEncoded: BfgEncodedString = hostActionStr as unknown as BfgEncodedString;
  const hostAction = hostActionEncoder.decode(p2pToBfgEncoded);

  if (!hostAction) {
    throw new Error("Failed to parse host action: " + hostActionStr);
  }

  const afterActionResult = await gameProcessor.applyHostAction(gameTable, currentGameState, hostAction);

  const { tablePhase, gameSpecificStateSummary } = afterActionResult;

  console.log("MAKE MOVE - HOST ACTION", hostAction);
  console.log("MAKE MOVE - AFTER ACTION RESULT", afterActionResult);

  const nextGameStateJsonStr = gameMetadata.gameSpecificStateEncoder.encode(afterActionResult.gameSpecificState);

  console.log("MAKE MOVE - hostActionJson", hostActionStr);

  const now = Date.now();

  const nextGameTable: GameTable = {
    ...gameTable,
    tablePhase,
    currentStatusDescription: gameSpecificStateSummary,
  }

  const playerMoveAction: DbGameTableAction = {
    gameTableId: gameTable.id,
    createdAt: now,
    source: "game-table-action-source-host",
    actionType: "game-table-action-host-action",
    actionStr: hostActionStr as unknown as BfgEncodedString,
    nextGameStateStr: nextGameStateJsonStr as unknown as BfgEncodedString,
  }

  const retVal: HostApplyHostActionResult = {
    resultTablePhase: tablePhase,
    gameTable: nextGameTable,
    gameAction: playerMoveAction,
  } satisfies HostApplyHostActionResult;

  return retVal;
}
