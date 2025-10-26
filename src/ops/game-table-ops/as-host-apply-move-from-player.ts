import { PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { getPlayerActionSource } from "./player-seat-utils";
import { GameTable } from "../../models/game-table/game-table";
import { TablePhase } from "../../models/game-table/table-phase";
import { IGameRegistry } from "../../hooks/games-registry/games-registry";
import { BfgEncodedString } from "~/models/game-engine/encoders";
import { PlayerP2pActionStr } from "~/hooks/p2p/p2p-types";


export type HostApplyMoveFromPlayerResult = {
  resultTablePhase: TablePhase;
  gameTable: GameTable;
  gameAction: DbGameTableAction;
}

export const asHostApplyMoveFromPlayer = async(
  gameRegistry: IGameRegistry,
  gameTable: GameTable,
  gameActions: DbGameTableAction[],
  playerId: PlayerProfileId, 
  playerActionStr: PlayerP2pActionStr
): Promise<HostApplyMoveFromPlayerResult> => {
  
  if (!gameTable) {
    throw new Error("Table not found");
  }

  console.log("INCOMING PLAYER ACTION", playerActionStr);

  const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
  const gameEngine = gameMetadata.engine;
  const gameProcessor = gameEngine;

  const playerActionSource = getPlayerActionSource(gameTable, playerId);  

  const latestAction = gameActions[gameActions.length - 1];
  const currentGameState = gameMetadata.gameSpecificStateEncoder.decode(latestAction.nextGameStateStr);

  console.log("MAKE MOVE - CURRENT GAME STATE (PARSED)", currentGameState);

  if (!currentGameState) {
    throw new Error("Failed to parse current game state");
  }

  const playerActionEncoder = gameMetadata.playerActionEncoder;
  const p2pToBfgEncoded: BfgEncodedString = playerActionStr as unknown as BfgEncodedString;
  const playerAction = playerActionEncoder.decode(p2pToBfgEncoded);

  if (!playerAction) {
    throw new Error("Failed to parse player action: " + playerActionStr);
  }

  const afterActionResult = await gameProcessor.applyPlayerAction(gameTable, currentGameState, playerAction);

  const { tablePhase, gameSpecificStateSummary } = afterActionResult;

  const nextGameStateJsonStr = gameMetadata.gameSpecificStateEncoder.encode(afterActionResult.gameSpecificState);

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
    actionStr: playerActionStr as unknown as BfgEncodedString,
    nextGameStateStr: nextGameStateJsonStr as unknown as BfgEncodedString,
  }

  const retVal: HostApplyMoveFromPlayerResult = {
    resultTablePhase: tablePhase,
    gameTable: nextGameTable,
    gameAction: playerMoveAction,
  } satisfies HostApplyMoveFromPlayerResult;

  return retVal;
}
