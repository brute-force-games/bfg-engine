// import { PlayerProfileId } from "../../models/types/bfg-branded-uuids";
// import { type GameTableEventWithTransition } from "../../models/game-table/game-table-event";
// import { getPlayerActionSource } from "./player-seat-utils";
// import { GameRoomDb } from "../../models/game-table/game-room";
// import { RoomPhase } from "../../models/game-table/table-phase";
// import type { IGameRegistry } from "../../game-metadata/games-registry";
// import type { BfgEncodedString } from "../../game-metadata/encoders";
// import type { BfgGameActionByPlayer, BfgGameEventOutcome } from "../../game-metadata/metadata-types/game-action-types";
// import type { GameEventChange } from "../../models/game-table/game-event-change";
// import type { LatestGameState } from "../../models/game-table/latest-game-state";
// import type { BfgGameStateForHost } from "../../game-metadata/metadata-types/game-state-types";



// export type HostApplyMoveFromPlayerResult = {
//   resultTablePhase: RoomPhase;
//   gameTable: GameRoomDb;
//   gameEvent: GameTableEventWithTransition;
//   gameEventOutcome: BfgGameEventOutcome;
//   nextGameState: BfgGameStateForHost;
// }

// export const asHostApplyMoveFromPlayer = async<
//   // GSH extends BfgGameStateForHost,
//   // GSP extends BfgGameStateForPlayer,
//   // GSW extends BfgGameStateForWatcher,
//   PGA extends BfgGameActionByPlayer,
//   // HGA extends BfgGameActionByHost,
// >(
//   gameRegistry: IGameRegistry,
//   gameTable: GameRoomDb,
//   gameEvents: GameTableEventWithTransition[],
//   playerId: PlayerProfileId, 
//   // playerActionStr: PlayerP2pActionStr,
//   playerAction: PGA
// ): Promise<HostApplyMoveFromPlayerResult> => {
  
//   if (!gameTable) {
//     throw new Error("Table not found");
//   }

//   // console.log("INCOMING PLAYER ACTION", playerActionStr);

//   const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
//   const gameProcessor = gameMetadata.gameProcessor;

//   const playerActionSource = getPlayerActionSource(gameTable, playerId);  

//   const latestAction = gameEvents[gameEvents.length - 1];
//   const currentGameState = gameMetadata.encoders.hostGameStateEncoder.decode(latestAction.nextGameStateStr);

//   console.log("MAKE MOVE - CURRENT GAME STATE (PARSED)", currentGameState);

//   if (!currentGameState) {
//     throw new Error("Failed to parse current game state");
//   }

//   // const playerActionEncoder = gameMetadata.encoders.playerActionEncoder;
//   // const p2pToBfgEncoded: BfgEncodedString = playerActionStr as unknown as BfgEncodedString;
//   // const playerAction = playerActionEncoder.decode(p2pToBfgEncoded);

//   // if (!playerAction) {
//   //   throw new Error("Failed to parse player action: " + playerActionStr);
//   // }

//   const afterActionResult = await gameProcessor.applyPlayerAction(gameTable, currentGameState, playerAction);

//   const { tablePhase, gameSpecificStateSummary, gameSpecificActionOutcome } = afterActionResult;

//   const nextGameStateJsonStr = gameMetadata.encoders.hostGameStateEncoder.encode(afterActionResult.gameSpecificState);
//   const gameSpecificActionOutcomeStr = gameMetadata.encoders.playerActionOutcomeEncoder 
//     && gameSpecificActionOutcome
//     ? gameMetadata.encoders.playerActionOutcomeEncoder.encode(gameSpecificActionOutcome)
//     : null;
  
//   const now = Date.now();

//   const nextGameTable: GameRoomDb = {
//     ...gameTable,
//     tablePhase,
//     currentStatusDescription: gameSpecificStateSummary,
//   }

//   const playerMoveAction: GameTableStateDbStep = {
//     gameTableId: gameTable.id,
//     createdAt: now,
//     source: playerActionSource,
//     eventType: "game-table-action-player-action",
//     actionOutcomeStr: gameSpecificActionOutcomeStr as unknown as BfgEncodedString,
//     actionStr: playerActionStr as unknown as BfgEncodedString,
//     nextGameStateStr: nextGameStateJsonStr as unknown as BfgEncodedString,
//   }

//   const retVal: HostApplyMoveFromPlayerResult = {
//     resultTablePhase: tablePhase,
//     gameTable: nextGameTable,
//     gameEvent: playerMoveAction,
//     gameEventOutcome: gameSpecificActionOutcome,
//     nextGameState: nextGameState,
//   } satisfies HostApplyMoveFromPlayerResult;

//   return retVal;
// }



// export const asHostApplyMoveFromPlayer = async(
//   gameRegistry: IGameRegistry,
//   gameTable: GameTable,
//   gameActions: DbGameTableAction[],
//   playerId: PlayerProfileId, 
//   playerActionStr: PlayerP2pActionStr
// ): Promise<HostApplyMoveFromPlayerResult> => {
  
//   if (!gameTable) {
//     throw new Error("Table not found");
//   }

//   console.log("INCOMING PLAYER ACTION", playerActionStr);

//   const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
//   const gameEngine = gameMetadata.engine;
//   const gameProcessor = gameEngine;

//   const playerActionSource = getPlayerActionSource(gameTable, playerId);  

//   const latestAction = gameActions[gameActions.length - 1];
//   const currentGameState = gameMetadata.encoders.hostGameStateEncoder.decode(latestAction.nextGameStateStr);

//   console.log("MAKE MOVE - CURRENT GAME STATE (PARSED)", currentGameState);

//   if (!currentGameState) {
//     throw new Error("Failed to parse current game state");
//   }

//   const playerActionEncoder = gameMetadata.encoders.playerActionEncoder;
//   const p2pToBfgEncoded: BfgEncodedString = playerActionStr as unknown as BfgEncodedString;
//   const playerAction = playerActionEncoder.decode(p2pToBfgEncoded);

//   if (!playerAction) {
//     throw new Error("Failed to parse player action: " + playerActionStr);
//   }

//   const afterActionResult = await gameProcessor.applyPlayerAction(gameTable, currentGameState, playerAction);

//   const { tablePhase, gameSpecificStateSummary } = afterActionResult;

//   const nextGameStateJsonStr = gameMetadata.encoders.hostGameStateEncoder.encode(afterActionResult.gameSpecificState);

//   const now = Date.now();

//   const nextGameTable: GameTable = {
//     ...gameTable,
//     tablePhase,
//     currentStatusDescription: gameSpecificStateSummary,
//   }

//   const playerMoveAction: DbGameTableAction = {
//     gameTableId: gameTable.id,
//     createdAt: now,
//     source: playerActionSource,
//     actionType: "game-table-action-player-action",
//     actionStr: playerActionStr as unknown as BfgEncodedString,
//     nextGameStateStr: nextGameStateJsonStr as unknown as BfgEncodedString,
//   }

//   const retVal: HostApplyMoveFromPlayerResult = {
//     resultTablePhase: tablePhase,
//     gameTable: nextGameTable,
//     gameAction: playerMoveAction,
//   } satisfies HostApplyMoveFromPlayerResult;

//   return retVal;
// }
