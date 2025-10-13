// import { z } from "zod";
// import { getBfgGameMetadata } from "~/models/bfg-game-engines";
// import { bfgDb } from "../bfg-db";
// // import { DbGameTableId } from "~/types/core/branded-values/branded-strings";
// type DbGameTableId = any; // Temporary stub
// import { BfgGameTableActionId } from "~/models/types/bfg-branded-ids";
// import { DbGameTable } from "~/models/game-table/game-table";
// import { getLatestAction } from "./order-game-table-actions";
// import { getPlayerActionSource } from "./player-seat-utils";
// // import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
// type BfgGameSpecificGameStateTypedJson = any; // Temporary stub
// import { BfgGameEngineProcessor } from "~/models/bfg-game-engines";
// import { createSignedGameAction } from "~/models/game-table/signed-game-action";
// import { PrivatePlayerProfile } from "~/models/player-profile/private-player-profile";

// /**
//  * Make a signed move as a player - includes digital signature for authentication
//  * This replaces the original asPlayerMakeMove function with cryptographic security
//  */
// export const asPlayerMakeSignedMove = async <GameSpecificAction extends z.ZodTypeAny>(
//   tableId: DbGameTableId, 
//   playerProfile: PrivatePlayerProfile,
//   playerAction: z.infer<GameSpecificAction>
// ) => {
//   const gameTable = await bfgDb.gameTables.get(tableId);

//   if (!gameTable) {
//     throw new Error("Table not found");
//   }

//   console.log("INCOMING SIGNED PLAYER ACTION", playerAction);

//   const selectedGameMetadata = getBfgGameMetadata(gameTable);
//   const selectedGameEngine = selectedGameMetadata.processor as BfgGameEngineProcessor<
//     z.infer<typeof selectedGameMetadata.processor["gameStateJsonSchema"]>,
//     z.infer<typeof selectedGameMetadata.processor["gameActionJsonSchema"]>
//   >;

//   const playerActionSource = getPlayerActionSource(gameTable, playerProfile.id);  

//   const latestAction = await getLatestAction(tableId);

//   const initialGameState = selectedGameEngine.parseGameSpecificGameStateJson(
//     latestAction.actionOutcomeGameStateJson as BfgGameSpecificGameStateTypedJson<typeof gameTable.gameTitle>);

//   console.log("MAKE SIGNED MOVE - INITIAL GAME STATE", initialGameState);

//   const afterActionResult = selectedGameEngine.applyGameAction(gameTable, initialGameState, playerAction);

//   const gameStateSummary = afterActionResult.gameSpecificStateSummary;

//   console.log("MAKE SIGNED MOVE - PLAYER ACTION", playerAction);
//   console.log("MAKE SIGNED MOVE - AFTER ACTION RESULT", afterActionResult);

//   const playerActionJson = selectedGameEngine.createGameSpecificActionJson(playerAction);

//   console.log("MAKE SIGNED MOVE - playerActionJson", playerActionJson);

//   const actionOutcomeGameState = afterActionResult.gameSpecificState;
//   const actionOutcomeGameStateJson = selectedGameEngine.createGameSpecificGameStateJson(actionOutcomeGameState);
//   console.log("MAKE SIGNED MOVE - actionOutcomeGameStateJson", actionOutcomeGameStateJson);

//   const mostRecentGameActionId = gameTable.latestActionId;
//   const startActionId = BfgGameTableActionId.createId();

//   // Create the base game action
//   const baseGameAction = {
//     id: startActionId,
//     gameTableId: tableId,
//     previousActionId: mostRecentGameActionId,
//     createdAt: new Date(),

//     source: playerActionSource,
//     actionType: "game-table-action-player-move" as const,
//     actionJson: playerActionJson,
//     actionOutcomeGameStateJson,

//     realmId: gameTable.realmId,
//   };

//   // Create signed version of the action
//   const signedGameAction = await createSignedGameAction(
//     baseGameAction,
//     playerProfile,
//     playerProfile.id
//   );

//   console.log("MAKE SIGNED MOVE - signedGameAction", signedGameAction);

//   const tablePhase = afterActionResult.tablePhase;

//   await bfgDb.transaction(
//     'rw',
//     [bfgDb.gameTables, bfgDb.gameTableActions],
//     async () => {
//       const updatedGameTable: DbGameTable = {
//         ...gameTable,
//         tablePhase,
//         latestActionId: startActionId,
//         currentStatusDescription: gameStateSummary,
//       }

//       await bfgDb
//         .gameTables
//         .update(gameTable, updatedGameTable);

//       // Store the signed action (for now, we'll store it as a regular action but with signature data)
//       // TODO: Update the database schema to support signed actions
//       await bfgDb.gameTableActions.add({
//         ...signedGameAction,
//         // Store signature data in a custom field for now
//         actionJson: JSON.stringify({
//           originalAction: playerActionJson,
//           signature: signedGameAction.signature,
//           playerId: signedGameAction.playerId,
//         }),
//       });
//     }
//   );
// }

// /**
//  * Verify a signed move before processing it
//  */
// export const verifySignedMove = async (signedAction: any): Promise<boolean> => {
//   try {
//     const { verifySignedMove: verifyCrypto } = await import('~/crypto/crypto-utils');
    
//     if (!signedAction.signature) {
//       console.error('Move missing signature');
//       return false;
//     }
    
//     return await verifyCrypto(signedAction.signature);
//   } catch (error) {
//     console.error('Error verifying signed move:', error);
//     return false;
//   }
// };
