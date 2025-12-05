// import { z } from "zod";
// import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../metadata-types/game-state-types";
// import type { BfgGameEvent, BfgGameEventOutcome } from "../metadata-types/game-action-types";
// import type { GameBoardEventForDb } from "../../models/game-table/game-table-event-db";
// import type { GameTableEventForHostP2p, GameTableEventForPlayerP2p, GameTableEventForWatcherP2p } from "../../models/p2p/game-table-event-p2p";
// import type { GameTableSeat } from "../../models/internal/game-room-base";




// export interface IMyGameAccessLevelAdapterFactory<
//   GSHSchema extends z.ZodType<BfgGameStateForHost>,
//   GSPSchema extends z.ZodType<BfgGameStateForPlayer>,
//   GSWSchema extends z.ZodType<BfgGameStateForWatcher>,
//   GEvSchema extends z.ZodType<BfgGameEvent>,
//   GEvOSchema extends z.ZodType<BfgGameEventOutcome>,
// > {
//   schemas: {
//     hostGameStateSchema: GSHSchema;
//     playerGameStateSchema: GSPSchema;
//     watcherGameStateSchema: GSWSchema;
//     gameEventSchema: GEvSchema;
//     gameEventOutcomeSchema: GEvOSchema;
//   },
//   adapters: {
//     myHostGameStateToPlayerAccessLevelAdapter: (hostState: z.infer<GSHSchema>) => z.infer<GSPSchema>;
//     myHostGameStateToWatcherAccessLevelAdapter: (hostState: z.infer<GSHSchema>) => z.infer<GSWSchema>;
//     myHostEventTransitionFromHostEventTransitionDb: (hostEventTransition: z.infer<GEvSchema>) => z.infer<GEvSchema>;
//   },
// };




// export const createBfgGameEngineAccessLevelAdapters = <
//   GSHSchema extends z.ZodType<BfgGameStateForHost>,
//   GSPSchema extends z.ZodType<BfgGameStateForPlayer>,
//   GSWSchema extends z.ZodType<BfgGameStateForWatcher>,
//   GEvSchema extends z.ZodType<BfgGameEvent>,
//   GEvOSchema extends z.ZodType<BfgGameEventOutcome>,
// >(myGameAccessLevelAdapterFactory: IMyGameAccessLevelAdapterFactory<GSHSchema, GSPSchema, GSWSchema, GEvSchema, GEvOSchema>) => {
//   const { schemas, adapters } = myGameAccessLevelAdapterFactory;
  
//   const hostGameStateSchema = schemas.hostGameStateSchema;
//   const gameEventSchema = schemas.gameEventSchema;

//   type InferredGSH = z.infer<typeof hostGameStateSchema>;
//   type InferredGEv = z.infer<typeof gameEventSchema>;

//   return {
//     hostGameStateToPlayerAccessLevelAdapter: <
//       GSH extends BfgGameStateForHost,
//       GSP extends BfgGameStateForPlayer,
//     >(hostState: GSH): GSP => {
//       // Converting from generic GSH to specific InferredGSH for the adapter call
//       // This is safe because the function is only called with the specific types at runtime
//       const typedHostState = hostState as unknown as InferredGSH;
//       const result = adapters.myHostGameStateToPlayerAccessLevelAdapter(typedHostState);

//       // Converting from specific InferredGSP to generic GSP
//       // This is safe because the function is only called with the specific types at runtime
//       return result as unknown as GSP;
//     },

//     hostGameStateToWatcherAccessLevelAdapter: <
//       GSH extends BfgGameStateForHost,
//       GSW extends BfgGameStateForWatcher,
//     >(hostState: GSH): GSW => {
//       // Converting from generic GSH to specific InferredGSH for the adapter call
//       // This is safe because the function is only called with the specific types at runtime
//       const typedHostState = hostState as unknown as InferredGSH;
//       const result = adapters.myHostGameStateToWatcherAccessLevelAdapter(typedHostState);

//       // Converting from specific InferredGSW to generic GSW
//       // This is safe because the function is only called with the specific types at runtime
//       return result as unknown as GSW;
//     },

//     hostEventTransitionFromHostEventTransitionDb: <
//       GTDb extends GameBoardEventForDb,
//       GTH extends GameTableEventForHostP2p,
//     >(hostEventTransitionDb: GTDb): GTH => {
//       const parsedEvent = gameEventSchema.parse(hostEventTransitionDb.transitionForHost.event);
//       const adaptedEvent = adapters.myHostEventTransitionFromHostEventTransitionDb(parsedEvent);
      
//       const typedHostState = hostEventTransitionDb.transitionForHost.nextBoardState as unknown as InferredGSH;
//       // const adaptedWatcherState = adapters.myHostGameStateToWatcherAccessLevelAdapter(typedHostState);

//       // Converting from GameBoardEventForDb structure to GameTableEventForHostP2p structure
//       // Note: nextGamePlayerStates is an empty array because we don't have player seat information
//       // in GameBoardEventForDb. This should be populated by the caller if needed.
//       const result = {
//         // gameTableId: hostEventTransitionDb.gameRoomId as unknown as GTH['gameTableId'],
//         createdAt: hostEventTransitionDb.createdAt,
//         stepIndex: hostEventTransitionDb.stepIndex,
//         event: adaptedEvent as unknown as GTH['event'],
//         outcome: hostEventTransitionDb.transitionForHost.change as unknown as GTH['outcome'],
//         nextGameHostState: typedHostState as unknown as GTH['nextGameHostState'],
//         // nextGamePlayerStates: [] as unknown as GTH['nextGamePlayerStates'],
//         // nextGameWatcherState: adaptedWatcherState as unknown as GTH['nextGameWatcherState'],
//       };

//       return result as unknown as GTH;
//     },

//     hostEventTransitionToPlayerAccessLevelAdapter: <
//       GTH extends GameBoardEventForDb,
//       GTP extends GameTableEventForPlayerP2p,
//     >(playerSeat: GameTableSeat, hostEventTransitionDb: GTH): GTP => {
//       const parsedEvent = gameEventSchema.parse(hostEventTransitionDb.transitionForHost.event);
//       const adaptedEvent = adapters.myHostEventTransitionFromHostEventTransitionDb(parsedEvent);
      
//       const typedHostState = hostEventTransitionDb.transitionForHost.nextBoardState as unknown as InferredGSH;
//       const adaptedPlayerState = adapters.myHostGameStateToPlayerAccessLevelAdapter(typedHostState);
//       // const adaptedWatcherState = adapters.myHostGameStateToWatcherAccessLevelAdapter(typedHostState);

//       // Converting from GameBoardEventForDb structure to GameTableEventForPlayerP2p structure
//       // AssignedBfgGameStateForPlayer extends the player state schema and adds playerSeat
//       // So we need to spread the adaptedPlayerState and add playerSeat
//       const result = {
//         createdAt: hostEventTransitionDb.createdAt,
//         stepIndex: hostEventTransitionDb.stepIndex,
//         event: adaptedEvent as unknown as GTP['event'],
//         outcome: hostEventTransitionDb.transitionForHost.change as unknown as GTP['outcome'],
//         nextGamePlayerState: {
//           ...adaptedPlayerState,
//           playerSeat: playerSeat,
//         } as unknown as GTP['nextGamePlayerState'],
//       };

//       return result as unknown as GTP;
//     },
    
//     hostEventTransitionToWatcherAccessLevelAdapter: <
//       GTH extends GameBoardEventForDb,
//       GTW extends GameTableEventForWatcherP2p,
//     >(hostEventTransition: GTH): GTW => {

//       const parsedEvent = gameEventSchema.parse(hostEventTransition.transitionForHost.event);
//       const adaptedEvent = adapters.myHostEventTransitionFromHostEventTransitionDb(parsedEvent);
      
//       const parsedHostState = hostGameStateSchema.parse(hostEventTransition.transitionForHost.nextBoardState);

//       // const typedHostState = hostEventTransition.transitionForHost.nextBoardState as unknown as InferredGSH;
//       const adaptedWatcherState = adapters.myHostGameStateToWatcherAccessLevelAdapter(parsedHostState);

//       // // Converting from GameBoardEventForDb structure to GameTableEventForWatcherP2p structure
//       // const result = {
//       //   // gameTableId: hostEventTransition.gameRoomId as unknown as GTW['gameTableId'],
//       //   createdAt: hostEventTransition.createdAt,
//       //   stepIndex: hostEventTransition.stepIndex,
//       //   event: adaptedEvent as unknown as GTW['event'],
//       //   outcome: hostEventTransition.transitionForHost.change as unknown as GTW['outcome'],
//       //   nextGameWatcherState: adaptedWatcherState as unknown as GTW['nextGameWatcherState'],
//       // };

//       // return result as unknown as GTW;

//       // Converting from GameBoardEventForDb structure to GameTableEventForWatcherP2p structure
//       const result: GTW = {
//         createdAt: hostEventTransition.createdAt,
//         stepIndex: hostEventTransition.stepIndex,
//         event: adaptedEvent,
//         outcome: hostEventTransition.transitionForHost.change,
//         nextGameWatcherState: adaptedWatcherState,
//       };

//       return result;
//     },
//   };
// };





// // export const createBfgGameEngineAccessLevelAdapters = <
// //   GSHSchema extends z.ZodType<BfgGameStateForHost>,
// //   GSPSchema extends z.ZodType<BfgGameStateForPlayer>,
// // >(
// //   // schemas: BfgGenericEngineMetadataSchemas & {
// //   schemas: {
// //     hostGameStateSchema: GSHSchema;
// //     playerGameStateSchema: GSPSchema;
// //   },
// //   adapters: {
// //     myHostGameStateToPlayerAccessLevelAdapter: (hostState: z.infer<GSHSchema>) => z.infer<GSPSchema>;
// //   },
// //   // {
// //   //   myHostGameStateToPlayerAccessLevelAdapter,
// //   //   // hostGameStateToWatcherAccessLevelAdapter,
// //   //   // hostEventTransitionFromHostEventTransitionDb,
// //   //   // hostEventTransitionToPlayerAccessLevelAdapter,
// //   //   // hostEventTransitionToWatcherAccessLevelAdapter,
// //   // }: IGameAccessLevelAdapterFactory<GSHSchema, GSPSchema>
// // ) => {
// //   const hostGameStateSchema = schemas.hostGameStateSchema;

// //   type InferredGSH = z.infer<typeof hostGameStateSchema>;

// //   return {
// //     hostGameStateToPlayerAccessLevelAdapter: <
// //       GSH extends BfgGameStateForHost,
// //       GSP extends BfgGameStateForPlayer,
// //     >(hostState: GSH): GSP => {
// //       // Converting from generic GSH to specific InferredGSH for the adapter call
// //       // This is safe because the function is only called with the specific types at runtime
// //       const typedHostState = hostState as unknown as InferredGSH;
// //       const result = adapters.myHostGameStateToPlayerAccessLevelAdapter(typedHostState);

// //       // Converting from specific InferredGSP to generic GSP
// //       // This is safe because the function is only called with the specific types at runtime
// //       return result as unknown as GSP;
// //     },
// //     // hostGameStateToPlayerAccessLevelAdapter: (hostState: RockPaperScissorsHostGameState): RockPaperScissorsPlayerGameState => {
// //     //   const retVal: RockPaperScissorsPlayerGameState = {
// //     //     myChoice: null,
// //     //     p1WinCount: hostState.p1WinCount,
// //     //     p2WinCount: hostState.p2WinCount,
// //     //     tieCount: hostState.tieCount,
// //     //   };

// //     //   return retVal;
// //     // },
// //     // hostGameStateToPlayerAccessLevelAdapter,
// //   };
// // };