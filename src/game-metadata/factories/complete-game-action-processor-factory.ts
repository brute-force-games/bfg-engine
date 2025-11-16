// import { z } from "zod";
// import type { BfgGameActionByHost, BfgGameActionByHostSchema, BfgGameActionByPlayerSchema, BfgGameActionHostOutcomeStr, BfgGameActionPlayerOutcomeStr, BfgGameActionPublicOutcomeStr, BfgGameSpecificHostActionOutcomeSchema, BfgGameSpecificPlayerActionOutcomeSchema, HostActionHandler  } from "../metadata-types/game-action-types";
// import type { ICompleteTypesForGameMetadata } from "../metadata-types";


// export interface IBfgCompleteGameActionHandler<
//   GAP extends typeof BfgGameActionByPlayerSchema,
//   GAPO extends typeof BfgGameSpecificPlayerActionOutcomeSchema,
//   GHA extends typeof BfgGameActionByHostSchema,
//   GHAO extends typeof BfgGameSpecificHostActionOutcomeSchema,
// > {
//   actionSchema: GAP;
  
//   createPublicOutcomeMessage: (outcome: z.infer<GAPO>) => BfgGameActionPublicOutcomeStr;
//   createPlayerOutcomeMessage: (outcome: z.infer<GAPO>) => BfgGameActionPlayerOutcomeStr;
//   createHostOutcomeMessage: (outcome: z.infer<GHAO>) => BfgGameActionHostOutcomeStr;
// }


// export const createCompleteGameActionProcessor = (
//   gameTypes: ICompleteTypesForGameMetadata,
//   actionHandler: IBfgCompleteGameActionHandler<
//     typeof gameTypes.playerActionSchema,
//     typeof gameTypes.playerActionOutcomeSchema,
//     typeof gameTypes.hostActionSchema,
//     typeof gameTypes.hostActionOutcomeSchema
//   >
// ) => {

//   return {
//     actionSchema: gameTypes.playerActionSchema,
//     createPublicOutcomeMessage: actionHandler.createPublicOutcomeMessage,
//     createPlayerOutcomeMessage: actionHandler.createPlayerOutcomeMessage,
//     createHostOutcomeMessage: actionHandler.createHostOutcomeMessage,
//   };
// }

// export type CompleteGameActionProcessor = ReturnType<typeof createCompleteGameActionProcessor>;


// // export const createPublicKnowledgeGameActionProcessor = <
// //   GameActionSchema extends typeof BfgGameActionSchema,
// //   GameActionOutcomeSchema extends typeof BfgGameActionOutcomeSchema,
// // >(params: ICompleteGameActionProcessorFactoryParams<GameActionSchema, GameActionOutcomeSchema>) => {
// //   return {
// //     actionSchema: params.actionSchema,
// //     createPublicOutcomeMessage: params.createPublicOutcomeMessage,
// //     createPlayerOutcomeMessage: params.createPlayerOutcomeMessage,
// //     createHostOutcomeMessage: params.createHostOutcomeMessage,
// //   };
// // }

// // export type PublicKnowledgeGameActionProcessor = ReturnType<typeof createPublicKnowledgeGameActionProcessor>;



// export const createHostActionHandler = <HostAction extends BfgGameActionByHost>(
//   // hostActionSchema: z.ZodType<HostAction>,
//   handler: HostActionHandler<HostAction>
// ): HostActionHandler<HostAction> => {
//   return (hostAction: HostAction) => {
//     // hostActionSchema.parse(hostAction);
//     return handler(hostAction);
//   };
// };