import { z } from "zod";
import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../metadata-types/game-state-types";
import type { GameBoardEventForDb } from "../../models/game-table/game-board-transition-db";
import type { GameTableEventForHostP2p, GameTableEventForPlayerP2p, GameTableEventForWatcherP2p } from "../../models/game-table/game-table-event-p2p";
import type { GameTableSeat } from "../../models/game-table/game-room-p2p";


export interface IMyGameAccessLevelAdapterFactory<
  GSHSchema extends z.ZodType<BfgGameStateForHost>,
  GSPSchema extends z.ZodType<BfgGameStateForPlayer>,
  GSWSchema extends z.ZodType<BfgGameStateForWatcher>,
> {
  schemas: {
    hostGameStateSchema: GSHSchema;
    playerGameStateSchema: GSPSchema;
    watcherGameStateSchema: GSWSchema;
  },
  adapters: {
    myHostGameStateToPlayerAccessLevelAdapter: (hostState: z.infer<GSHSchema>) => z.infer<GSPSchema>;
    myHostGameStateToWatcherAccessLevelAdapter: (hostState: z.infer<GSHSchema>) => z.infer<GSWSchema>;
    myHostEventTransitionFromHostEventTransitionDb: (hostEventTransitionDb: GameBoardEventForDb) => GameTableEventForHostP2p;
    // myHostEventTransitionToPlayerAccessLevelAdapter: (playerSeat: GameTableSeat, hostEventTransitionDb: GameBoardEventForDb) => GameTableEventForPlayerP2p;
    // myHostEventTransitionToWatcherAccessLevelAdapter: (hostEventTransition: GameBoardEventForDb) => GameTableEventForWatcherP2p;
  },
  // hostEventTransitionFromHostEventTransitionDb: (hostEventTransitionDb: GameBoardEventForDb) => {
  //   return {
  //     ...hostEventTransitionDb,
  //     p1Choice: hostEventTransitionDb.p1Choice,
  //     p2Choice: hostEventTransitionDb.p2Choice,
  //   };
  // },
  // hostEventTransitionToPlayerAccessLevelAdapter: (playerSeat: GameTableSeat, hostEventTransitionDb: GameBoardEventForDb) => {
  //   return {
  //     ...hostEventTransitionDb,
  //     p1Choice: hostEventTransitionDb.p1Choice,
  //     p2Choice: hostEventTransitionDb.p2Choice,
  //   };
  // },
  // hostEventTransitionToWatcherAccessLevelAdapter: (hostEventTransition: GameBoardEventForDb) => {
  //   return {
  //     ...hostEventTransition,
  //     p1Choice: hostEventTransition.p1Choice,
  //     p2Choice: hostEventTransition.p2Choice,
  //   };
  // },
};




export const createBfgGameEngineAccessLevelAdapters = <
  GSHSchema extends z.ZodType<BfgGameStateForHost>,
  GSPSchema extends z.ZodType<BfgGameStateForPlayer>,
  GSWSchema extends z.ZodType<BfgGameStateForWatcher>,
>(myGameAccessLevelAdapterFactory: IMyGameAccessLevelAdapterFactory<GSHSchema, GSPSchema, GSWSchema>) => {
  const { schemas, adapters } = myGameAccessLevelAdapterFactory;
  
  const hostGameStateSchema = schemas.hostGameStateSchema;

  type InferredGSH = z.infer<typeof hostGameStateSchema>;

  return {
    hostGameStateToPlayerAccessLevelAdapter: <
      GSH extends BfgGameStateForHost,
      GSP extends BfgGameStateForPlayer,
    >(hostState: GSH): GSP => {
      // Converting from generic GSH to specific InferredGSH for the adapter call
      // This is safe because the function is only called with the specific types at runtime
      const typedHostState = hostState as unknown as InferredGSH;
      const result = adapters.myHostGameStateToPlayerAccessLevelAdapter(typedHostState);

      // Converting from specific InferredGSP to generic GSP
      // This is safe because the function is only called with the specific types at runtime
      return result as unknown as GSP;
    },
    hostGameStateToWatcherAccessLevelAdapter: <
      GSH extends BfgGameStateForHost,
      GSW extends BfgGameStateForWatcher,
    >(hostState: GSH): GSW => {
      // Converting from generic GSH to specific InferredGSH for the adapter call
      // This is safe because the function is only called with the specific types at runtime
      const typedHostState = hostState as unknown as InferredGSH;
      const result = adapters.myHostGameStateToWatcherAccessLevelAdapter(typedHostState);

      // Converting from specific InferredGSW to generic GSW
      // This is safe because the function is only called with the specific types at runtime
      return result as unknown as GSW;
    },
    hostEventTransitionFromHostEventTransitionDb: <
      GTDb extends GameBoardEventForDb,
      GTH extends GameTableEventForHostP2p,
    >(hostEventTransitionDb: GTDb): GTH => {
      // Converting from generic GTDb to specific InferredGTDb for the adapter call
      // This is safe because the function is only called with the specific types at runtime
      const typedHostEventTransitionDb = hostEventTransitionDb as unknown as InferredGTDb;
      const result = adapters.myHostEventTransitionFromHostEventTransitionDb(typedHostEventTransitionDb);

      // Converting from specific InferredGTH to generic GTH
      // This is safe because the function is only called with the specific types at runtime
      return result as unknown as GTH;
    },
    // hostGameStateToPlayerAccessLevelAdapter: (hostState: RockPaperScissorsHostGameState): RockPaperScissorsPlayerGameState => {
    //   const retVal: RockPaperScissorsPlayerGameState = {
    //     myChoice: null,
    //     p1WinCount: hostState.p1WinCount,
    //     p2WinCount: hostState.p2WinCount,
    //     tieCount: hostState.tieCount,
    //   };

    //   return retVal;
    // },
    // hostGameStateToPlayerAccessLevelAdapter,
  };
};





// export const createBfgGameEngineAccessLevelAdapters = <
//   GSHSchema extends z.ZodType<BfgGameStateForHost>,
//   GSPSchema extends z.ZodType<BfgGameStateForPlayer>,
// >(
//   // schemas: BfgGenericEngineMetadataSchemas & {
//   schemas: {
//     hostGameStateSchema: GSHSchema;
//     playerGameStateSchema: GSPSchema;
//   },
//   adapters: {
//     myHostGameStateToPlayerAccessLevelAdapter: (hostState: z.infer<GSHSchema>) => z.infer<GSPSchema>;
//   },
//   // {
//   //   myHostGameStateToPlayerAccessLevelAdapter,
//   //   // hostGameStateToWatcherAccessLevelAdapter,
//   //   // hostEventTransitionFromHostEventTransitionDb,
//   //   // hostEventTransitionToPlayerAccessLevelAdapter,
//   //   // hostEventTransitionToWatcherAccessLevelAdapter,
//   // }: IGameAccessLevelAdapterFactory<GSHSchema, GSPSchema>
// ) => {
//   const hostGameStateSchema = schemas.hostGameStateSchema;

//   type InferredGSH = z.infer<typeof hostGameStateSchema>;

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
//     // hostGameStateToPlayerAccessLevelAdapter: (hostState: RockPaperScissorsHostGameState): RockPaperScissorsPlayerGameState => {
//     //   const retVal: RockPaperScissorsPlayerGameState = {
//     //     myChoice: null,
//     //     p1WinCount: hostState.p1WinCount,
//     //     p2WinCount: hostState.p2WinCount,
//     //     tieCount: hostState.tieCount,
//     //   };

//     //   return retVal;
//     // },
//     // hostGameStateToPlayerAccessLevelAdapter,
//   };
// };