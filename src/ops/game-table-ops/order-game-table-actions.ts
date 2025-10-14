// import { DbGameTableAction } from "@bfg-engine/models/game-table/game-table-action";
// import { bfgDb } from "../bfg-db";
// import { DbGameTableId } from "@bfg-engine/types/core/branded-values/branded-strings";



// export const orderGameTableActions = (actions: DbGameTableAction[]): DbGameTableAction[] => {
//   // First, separate actions with no previousActionId
//   const rootActions = actions.filter(action => !action.previousActionId);

//   console.log("orderGameTableActions: rootActions", rootActions);
//   if (rootActions.length !== 1) {
//     console.error("Messed up game table actions: rootActions", rootActions.length);
//   }

//   // const linkedActions = actions.filter(action => action.previousActionId);

//   // Create a map for quick lookup of actions by their id
//   // const actionMap = new Map(actions.map(action => [action.id, action]));

//   // Function to build a chain of actions starting from a root action
//   const buildActionChain = (rootAction: DbGameTableAction): DbGameTableAction[] => {
//     const chain: DbGameTableAction[] = [rootAction];
//     let currentAction = rootAction;

//     if (!rootAction) {
//       console.error("No root action found");
//       return [];
//     }

//     console.log("ROOT ACTION", rootAction);

//     let nextAction = actions.find(action => action.previousActionId === currentAction.id);

//     while (nextAction) {
//       chain.push(nextAction);
//       currentAction = nextAction;
//       nextAction = actions.find(action => action.previousActionId === currentAction.id);
//     }

//     return chain;
//   };

//   // Build chains for each root action and combine them
//   // const orderedActions = 
  
//   const actionChains = buildActionChain(rootActions[0]);

//   return actionChains;
// };


// export const getLatestAction = async (gameTableId: DbGameTableId): Promise<DbGameTableAction> => {
//   const actions = await bfgDb
//     .gameTableActions
//     .where('gameTableId')
//     .equals(gameTableId)
//     .toArray();

//   const orderedActions = orderGameTableActions(actions);
//   return orderedActions[orderedActions.length - 1];
// }
