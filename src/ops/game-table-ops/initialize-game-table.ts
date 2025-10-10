// import { z } from "zod";
// import { GameTable } from "~/models/game-table/game-table";
// // import { bfgDb } from "../bfg-db";
// // import { getTiedRealmId } from "dexie-cloud-addon";
// import { BfgGameTableId, BfgGameTableActionId } from "~/models/types/bfg-branded-ids";
// import { getBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
// import { DbGameTableAction } from "~/models/game-table/game-table-action";
// import { AvailableGameTitles } from "~/types/bfg-game-engines/supported-games";
// import { BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";
// import { addHostedGame } from "~/store/hosted-games-store";


// // TODO: how much of this is necessary vs host starting game?
// export const initializeGameTable = async (gameTable: NewGameTable) => {

//   const selectedGameTitle = AvailableGameTitles
//     .find((title) => title === gameTable.gameTitle);

//   if (!selectedGameTitle) {
//     throw new Error("Game title is required");
//   }

//   // const selectedGameProcessor = BfgGameEngineMetadata[selectedGameTitle];


//   // const selectedGameProcessor = getBfgGameMetadata(gameTable);
//   // const selectedGameEngine = selectedGameProcessor.processor as BfgGameEngineProcessor<
//   //   // typeof gameTable.gameTitle,
//   //   z.infer<typeof selectedGameProcessor.processor["gameStateJsonSchema"]>,
//   //   z.infer<typeof selectedGameProcessor.processor["gameActionJsonSchema"]>
//   // >;

//   type gameSpecificStateType = z.infer<typeof selectedGameProcessor.processor["gameStateJsonSchema"]>;
//   type gameSpecificActionType = z.infer<typeof selectedGameProcessor.processor["gameActionJsonSchema"]>;

//   const selectedGameProcessor = getBfgGameMetadata(gameTable);
//   const selectedGameEngine = selectedGameProcessor.processor as BfgGameEngineProcessor<
//     gameSpecificStateType,
//     gameSpecificActionType
//     >;
//   // > & {
//   //   createInitialGameState: (initialGameTableAction: gameSpecificActionType) => gameSpecificStateType;
//   // };

//   // const selectedGameProcessor = BfgGameEngineMetadata[selectedGameTitle] as BfgGameEngineProcessor<
//   //   z.infer<typeof BfgGameEngineMetadata[typeof selectedGameTitle]["gameStateJsonSchema"]>,
//   //   z.infer<typeof BfgGameEngineMetadata[typeof selectedGameTitle]["gameActionJsonSchema"]>,
//   //   // typeof selectedGameTitle,
//   //   typeof selectedGameTitle
//   // >;


//   const initGameAction = selectedGameEngine.createBfgGameSpecificInitialGameTableAction(gameTable);
//   const initialGameState = selectedGameEngine.createBfgInitialGameSpecificState(initGameAction);

//   const initialGameStateJson = selectedGameEngine.createGameSpecificGameStateJson(initialGameState);
//   const actionJson = selectedGameEngine.createGameSpecificActionJson(initGameAction.gameSpecificAction);

//   console.log("actionJson", actionJson);

//   const newTableId = BfgGameTableId.createId();
//   const newActionId = BfgGameTableActionId.createId();

//   const now = Date.now();
  
//   const newAction: DbGameTableAction = {
//     ...initGameAction,
//     id: newActionId,
//     // previousActionId: null,
//     // gameHostPlayerProfileId: gameTable.gameHostPlayerProfileId,
//     gameTableId: newTableId,
//     createdAt: now,
//     source: "game-table-action-source-host",
//     actionType: "game-table-action-host-starts-game",
//     actionJson: actionJson,
//     actionOutcomeGameStateJson: initialGameStateJson,
//   }

//   const newTable: GameTable = {
//     ...gameTable,
//     id: newTableId,
//     latestActionId: newActionId,
//     createdAt: now,
//   }

//   const retVal = await addHostedGame(newTable, newAction);

//   // const retVal = await bfgDb.transaction(
//   //   'rw',
//   //   [bfgDb.gameTables, bfgDb.gameTableActions, bfgDb.realms],
//   //   async () => {



//   //     await bfgDb.gameTables.add(newTable);
//   //     await bfgDb.gameTableActions.add(newAction);

//   //     return newTable;
//   //   }
//   // );

//   console.log("initializeGameTable: retVal", retVal);

//   // return retVal;
//   return newTableId;
// }
