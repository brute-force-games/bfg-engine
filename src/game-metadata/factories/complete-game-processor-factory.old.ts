// import React from "react";
// import { z } from "zod";
// import type { GameTable, GameTableSeat } from "../../models/game-table/game-table";
// import type { BfgGameSpecificTableAction, DbGameTableAction } from "../../models/game-table/game-table-action";
// import type { GameLobby } from "../../models/p2p-lobby";
// import type { BfgGameActionByHost, BfgGameActionByPlayer } from "../metadata-types/game-action-types";
// import type { BfgMetadataGameStateAccessTypes } from "../metadata-types";
// import type { BfgGameStateForHost } from "../metadata-types/game-state-types";



// export interface ICompleteGameProcessor<
//   GSH extends BfgGameStateForHost,
//   // PGA extends BfgGameActionByPlayer,
//   // GAPO extends BfgGameSpecificPlayerActionOutcome,
//   HGA extends BfgGameActionByHost,
//   // GAHO extends BfgGameSpecificHostActionOutcome,
//   // GSP extends BfgGameStateForPlayer,
//   // GAP extends BfgGameActionByPlayer,
//   // GAPO extends BfgGameSpecificPlayerActionOutcome,
//   // GHA extends BfgGameActionByHost,
//   // GHAO extends BfgGameSpecificHostActionOutcome,
//   // PPK extends BfgPrivatePlayerKnowledgeImplState | null
// > {
//   // gameTitle: BfgSupportedGameTitle,

//   createGameSpecificInitialAction: (gameTable: GameTable, lobbyState: GameLobby) => BfgGameSpecificTableAction<HGA>,
//   createGameSpecificInitialState: (gameTable: GameTable, gameSpecificInitialAction: BfgGameSpecificTableAction<HGA>) => GSH,

//   // applyPlayerAction: (
//   //   tableState: GameTable,
//   //   gameState: GSH,
//   //   playerAction: GAP
//   // ) => Promise<GameTableActionResult<'player', GSH, GAPO>>,

//   // applyHostAction: (
//   //   tableState: GameTable,
//   //   gameState: GSH,
//   //   hostAction: GHA
//   // ) => Promise<GameTableActionResult<'host', GSH, GHAO>>,

//   getNextToActPlayers: (gameTable: GameTable, gameState: GSH) => GameTableSeat[],
//   getPlayerDetailsLine: (gameState: GSH, playerSeat: GameTableSeat) => React.ReactNode,

//   // getAllPlayersPrivateKnowledge: (gameTable: GameTable, gameState: GSH) => Map<GameTableSeat, PPK> | null,

//   summarizeGameAction: (gameAction: DbGameTableAction) => string,
// }



// // type HostActionFromDefinitions<TDefinitions extends ReadonlyArray<HostActionDefinition<any, any, any>>> =
// //   TDefinitions[number] extends HostActionDefinition<any, infer HostAction, any>
// //     ? HostAction
// //     : BfgGameActionByHost;


// export const createCompleteGameProcessor = (
//   metadataTypes: BfgMetadataGameStateAccessTypes
//   // playerActionDefinitions: ReadonlyArray<PlayerActionDefinition<
//   //   z.infer<HostGameStateSchema>,
//   //   PlayerActionOutcome
//   // >>,
//   // hostActionDefinitions: HostActionDefinitions,
//   // playerActionHandlers: ReadonlyArray<{
//   //   actionType: z.infer<typeof metadataTypes.playerActionSchema>['actionType'];
//   //   handler: PlayerActionHandler<z.infer<typeof metadataTypes.playerActionSchema>>;
//   // }>,
//   // hostActionHandlers: ReadonlyArray<{
//   //   actionType: z.infer<typeof metadataTypes.hostActionSchema>['actionType'];
//   //   handler: HostActionHandler<z.infer<typeof metadataTypes.hostActionSchema>>;
//   // }>,

//   // playerActionHandlers: Record<
//   //   z.infer<typeof metadataTypes.playerActionSchema>['actionType'],
//   //   PlayerActionHandler<z.infer<typeof metadataTypes.playerActionSchema>>
//   // >,
//   // hostActionHandlers: Record<
//   //   z.infer<typeof metadataTypes.hostActionSchema>['actionType'],
//   //   HostActionHandler<z.infer<typeof metadataTypes.hostActionSchema>>
//   // >,

//   // processorHandlers: ICompleteGameProcessor<
//   //   z.infer<HostGameStateSchema>,
//   //   HostActionFromDefinitions<HostActionDefinitions>
//   // >,
// ) => {

//   type InferredGSH = z.infer<typeof metadataTypes.hostGameStateSchema>;
//   // type InferredGPA = z.infer<typeof metadataTypes.playerActionSchema>;
//   // type InferredGHA = z.infer<typeof metadataTypes.hostActionSchema>;


//   const applyPlayerAction = (tableState: GameTable, gameState: InferredGSH, playerAction: BfgGameActionByPlayer) => {
//     // const playerActionDefinition = playerActionDefinitions.find(d => 
//     //   d.actionSchema.parse(playerAction).actionType === playerAction.actionType);

//     // if (!playerActionDefinition) {
//     //   throw new Error(`No player action handler found for action type: ${playerAction.actionType}`);
//     // }

//     // const parsedPlayerAction = playerActionDefinition.actionSchema.parse(playerAction);
//     // return playerActionDefinition.actionHandler(tableState, gameState, parsedPlayerAction);

//     // if (playerAction.actionType === playerActionDefinition.actionSchema.actionType) {
//     //   const parsedPlayerAction = playerActionDefinition.actionSchema.parse(playerAction);
//     //   throw new Error(`Player action type mismatch: ${playerAction.actionType} !== ${playerActionDefinition.actionSchema.actionType}`);
//     // }
//     // return playerActionDefinition.actionHandler(_tableState, _gameState, playerAction);
//     // const playerActionHandler = playerActionHandlers[playerAction.actionType];
//     // return playerActionHandler(playerAction);
//   };

//   const applyHostAction = (tableState: GameTable, gameState: InferredGSH, hostAction: BfgGameActionByHost) => {
//     // const hostActionDefinition = hostActionDefinitions.find(d => 
//     //   d.actionSchema.parse(hostAction).actionType === hostAction.actionType);

//     // if (!hostActionDefinition) {
//     //   throw new Error(`No host action handler found for action type: ${hostAction.actionType}`);
//     // }

//     // const parsedHostAction = hostActionDefinition.actionSchema.parse(hostAction);
//     // return hostActionDefinition.actionHandler(tableState, gameState, parsedHostAction);

//     // const hostActionHandler = hostActionHandlers.find(h => 
//     //   h.actionType === hostAction.actionType);
//     // if (!hostActionHandler) {
//     //   throw new Error(`No host action handler found for action type: ${hostAction.actionType}`);
//     // }
//     // return hostActionHandler.handler(hostAction);

//     // const hostActionHandler = hostActionHandlers[hostAction.actionType];
//       // h.actionType === hostAction.actionType);
//     // if (!hostActionHandler) {
//     //   throw new Error(`No host action handler found for action type: ${hostAction.actionType}`);
//     // }
//     // return hostActionHandler(hostAction);
//   };


//   const retVal = {
//     ...processorHandlers,
//     applyHostAction,
//     applyPlayerAction,
//   };

//   return retVal;

//   // return {
//   //   gameStateSchema: params.gameStateSchema,
//   //   gameActionSchema: params.gameActionSchema,
//   //   gameActionOutcomeSchema: params.gameActionOutcomeSchema,
//   // };
// }

// export type CompleteGameProcessor = ReturnType<typeof createCompleteGameProcessor>;


// // export const createPublicKnowledgeGameProcessor = <
// //   GameStateSchema extends typeof BfgGameStateSchema,
// //   GameActionSchema extends typeof BfgGameActionSchema,
// //   GameActionOutcomeSchema extends typeof BfgGameActionOutcomeSchema,
// // >(params: ICompleteGameProcessorFactoryParams<GameStateSchema, GameActionSchema, GameActionOutcomeSchema>) => {
// //   return {
// //     gameStateSchema: params.gameStateSchema,
// //     gameActionSchema: params.gameActionSchema,
// //     gameActionOutcomeSchema: params.gameActionOutcomeSchema,
// //   };
// // }

// // export type PublicKnowledgeGameProcessor = ReturnType<typeof createPublicKnowledgeGameProcessor>;
