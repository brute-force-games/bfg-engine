import { z } from "zod";
import type { GameTableSeat } from "../../models/internal/game-room-base";
import type { GameTableEventForDb } from "../metadata-types";


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


export type BfgGameEngineMetadataSchemas = {
  hostGameStateSchema: z.ZodType;
  playerGameStatePerspectiveSchema: z.ZodType;
  watcherGameStatePerspectiveSchema: z.ZodType;

  hostSourcedGameEventSchema: z.ZodType;
  hostSourcedGameEventOutcomeSchema: z.ZodType;

  playerSourcedGameEventSchema: z.ZodType;
  playerSourcedGameEventOutcomeSchema: z.ZodType;

  playerPerspectiveForGameEventOutcomeSchema: z.ZodType;
  watcherPerspectiveForGameEventOutcomeSchema: z.ZodType;
};


// export interface IMyGameAccessLevelAdapterFactory <
//   HostGameStateSchema extends z.ZodType,
//   PlayerGamePerspectiveSchema extends z.ZodType,
//   WatcherGamePerspectiveSchema extends z.ZodType,
//   GameEventSchema extends z.ZodType,
//   HostGameEventOutcomeSchema extends z.ZodType,
//   PlayerGameEventPerspectiveSchema extends z.ZodType,
//   WatcherGameEventPerspectiveSchema extends z.ZodType,
// >{
//   schemas: {
//     hostGameStateSchema: HostGameStateSchema;
//     playerGamePerspectiveSchema: PlayerGamePerspectiveSchema;
//     watcherGamePerspectiveSchema: WatcherGamePerspectiveSchema;
//     gameEventSchema: GameEventSchema;
//     hostGameEventOutcomeSchema: HostGameEventOutcomeSchema;
//     playerGameEventPerspectiveSchema: PlayerGameEventPerspectiveSchema;
//     watcherGameEventPerspectiveSchema: WatcherGameEventPerspectiveSchema;
//   },
//   adapters: {
//     myHostGameStateToPlayerPerspectiveAdapter: (
//       playerSeat: GameTableSeat,
//       hostState: z.infer<HostGameStateSchema>
//     ) => z.infer<PlayerGamePerspectiveSchema>;
//     myHostGameStateToWatcherPerspectiveAdapter: (
//       hostState: z.infer<HostGameStateSchema>
//     ) => z.infer<WatcherGamePerspectiveSchema>;
//     // myHostEventTransitionFromHostEventTransitionDb: (
//     //   hostEventTransition: z.infer<GameEventSchema>
//     // ) => z.infer<GameEventSchema>;

//     myHostEventOutcomeToPlayerPerspectiveAdapter: (
//       playerSeat: GameTableSeat,
//       hostEventOutcome: z.infer<HostGameEventOutcomeSchema>
//     ) => z.infer<PlayerGameEventPerspectiveSchema>;
//     myHostEventOutcomeToWatcherPerspectiveAdapter: (
//       hostEventOutcome: z.infer<HostGameEventOutcomeSchema>
//     ) => z.infer<WatcherGameEventPerspectiveSchema>;
//   },
// };



export interface IMyGameStatePerspectiveAdaptersFactory <
  HostGameStateSchema extends z.ZodType,
  PlayerGamePerspectiveSchema extends z.ZodType,
  WatcherGamePerspectiveSchema extends z.ZodType,
>{
  schemas: {
    hostGameStateSchema: HostGameStateSchema;
    playerGamePerspectiveSchema: PlayerGamePerspectiveSchema;
    watcherGamePerspectiveSchema: WatcherGamePerspectiveSchema;
  },
  // adapters: {
    myHostGameStateToPlayerPerspectiveAdapter: (
      playerSeat: GameTableSeat,
      hostState: z.infer<HostGameStateSchema>
    ) => z.infer<PlayerGamePerspectiveSchema>;
    
    myHostGameStateToWatcherPerspectiveAdapter: (
      hostState: z.infer<HostGameStateSchema>
    ) => z.infer<WatcherGamePerspectiveSchema>;
  // },
};



export interface IMyGameEventOutcomePerspectiveAdaptersFactory <
  HostGameStateSchema extends z.ZodType,
  HostGameEventSchema extends z.ZodType,
  HostGameEventOutcomeSchema extends z.ZodType,
  PlayerGameEventSchema extends z.ZodType,
  PlayerGameEventOutcomeSchema extends z.ZodType,
  PlayerGameEventPerspectiveSchema extends z.ZodType,
  WatcherGameEventPerspectiveSchema extends z.ZodType,
>{
  schemas: {
    hostGameEventSchema: HostGameEventSchema;
    hostGameEventOutcomeSchema: HostGameEventOutcomeSchema;
    hostGameStateSchema: HostGameStateSchema;
    playerGameEventPerspectiveSchema: PlayerGameEventPerspectiveSchema;
    watcherGameEventPerspectiveSchema: WatcherGameEventPerspectiveSchema;
  },
  myHostEventOutcomeToPlayerPerspectiveAdapter: (
    playerSeat: GameTableSeat,
    hostEvent: z.infer<HostGameEventSchema>,
    hostEventOutcome: z.infer<HostGameEventOutcomeSchema>,
    hostGameState: z.infer<HostGameStateSchema>
  ) => z.infer<PlayerGameEventPerspectiveSchema>;

  myHostEventOutcomeToWatcherPerspectiveAdapter: (
    hostEvent: z.infer<HostGameEventSchema>,
    hostEventOutcome: z.infer<HostGameEventOutcomeSchema>,
    hostGameState: z.infer<HostGameStateSchema>
  ) => z.infer<WatcherGameEventPerspectiveSchema>;

  myPlayerEventOutcomeToPlayerPerspectiveAdapter: (
    playerSeat: GameTableSeat,
    playerEvent: z.infer<PlayerGameEventSchema>,
    playerEventOutcome: z.infer<PlayerGameEventOutcomeSchema>,
    playerGameState: z.infer<HostGameStateSchema>
  ) => z.infer<PlayerGameEventPerspectiveSchema>;
  
  myPlayerEventOutcomeToWatcherPerspectiveAdapter: (
    playerEvent: z.infer<PlayerGameEventSchema>,
    playerEventOutcome: z.infer<PlayerGameEventOutcomeSchema>,
    playerGameState: z.infer<HostGameStateSchema>
  ) => z.infer<WatcherGameEventPerspectiveSchema>;
};






// export const createBfgGameEnginePerspectiveAdapters = <
//   PerfectInformationGameStateSchema extends z.ZodType,
//   PlayerGamePerspectiveSchema extends z.ZodType,
//   WatcherGamePerspectiveSchema extends z.ZodType,
//   GameEventSchema extends z.ZodType,
//   PerfectInformationGameEventOutcomeSchema extends z.ZodType,
//   PlayerGameEventPerspectiveSchema extends z.ZodType,
//   WatcherGameEventPerspectiveSchema extends z.ZodType,
// // >(myGameAccessLevelAdapterFactory: IMyGameAccessLevelAdapterFactory<PerfectInformationGameStateSchema, PlayerGamePerspectiveSchema, WatcherGamePerspectiveSchema, GameEventSchema, PerfectInformationGameEventOutcomeSchema, PlayerGameEventPerspectiveSchema, WatcherGameEventPerspectiveSchema>) => {
// >(myGameAccessLevelAdapterFactory: IMyGameAccessLevelAdapterFactory<PerfectInformationGameStateSchema, PlayerGamePerspectiveSchema, WatcherGamePerspectiveSchema, GameEventSchema, PerfectInformationGameEventOutcomeSchema, PlayerGameEventPerspectiveSchema, WatcherGameEventPerspectiveSchema>) => {

export const createBfgGameStatePerspectiveAdapters = <
  HostGameStateSchema extends z.ZodType,
  PlayerGamePerspectiveSchema extends z.ZodType,
  WatcherGamePerspectiveSchema extends z.ZodType,
  // GameEventSchema extends z.ZodType,
  // HostGameEventOutcomeSchema extends z.ZodType,
  // PlayerGameEventPerspectiveSchema extends z.ZodType,
  // WatcherGameEventPerspectiveSchema extends z.ZodType,
>({
  schemas,
  myHostGameStateToPlayerPerspectiveAdapter,
  myHostGameStateToWatcherPerspectiveAdapter,
}: IMyGameStatePerspectiveAdaptersFactory<HostGameStateSchema, PlayerGamePerspectiveSchema, WatcherGamePerspectiveSchema>) => {
// >({
//   schemas,
//   adapters
// }: {
//   // gameMetadata: GenericGameMetadata;
//   schemas: IBfgEngineMetadataSchemas<HostGameStateSchema, PlayerGamePerspectiveSchema, WatcherGamePerspectiveSchema, GameEventSchema, HostGameEventOutcomeSchema, PlayerGameEventPerspectiveSchema, WatcherGameEventPerspectiveSchema>;
//   adapters: IMyGameStatePerspectiveAdaptersFactory<HostGameStateSchema, PlayerGamePerspectiveSchema, WatcherGamePerspectiveSchema>;
// }) => {
    // const { schemas, adapters } = myGameAccessLevelAdapterFactory;

  // const schemas = gameMetadata.schemas;
  // const adapterMethods = adapters.adapters;

  const { 
    hostGameStateSchema,
    playerGamePerspectiveSchema,
    watcherGamePerspectiveSchema,
    // gameEventSchema,
    // hostGameEventOutcomeSchema,
    // playerGameEventPerspectiveSchema,
    // watcherGameEventPerspectiveSchema,
  } = schemas;

  type InferredPerfectInformationGameState = z.infer<typeof hostGameStateSchema>;
  type InferredPlayerGamePerspective = z.infer<typeof playerGamePerspectiveSchema>;
  type InferredWatcherGamePerspective = z.infer<typeof watcherGamePerspectiveSchema>;
  // type InferredPerfectInformationGameEvent = z.infer<typeof gameEventSchema>;
  // // type InferredPerfectInformationGameEvent = z.infer<GameEventSchema>;
  // type InferredPerfectInformationGameEventOutcome = z.infer<typeof hostGameEventOutcomeSchema>;
  // type InferredPlayerGameEventPerspective = z.infer<PlayerGameEventPerspectiveSchema>;
  // type InferredWatcherGameEventPerspective = z.infer<WatcherGameEventPerspectiveSchema>;
  // type InferredPerfectInformationPlayerGameEventPerspective = z.infer<typeof playerGameEventPerspectiveSchema>;
  // type InferredPerfectInformationWatcherGameEventPerspective = z.infer<typeof watcherGameEventPerspectiveSchema>;

  // const BfgGameStepSchema = createBfgGameStepSchema(schemas);
  // type InferredBfgGameStep = z.infer<typeof BfgGameStepSchema>;

  // const createBfgGameStep = (
  //   createdAt: BfgTimestamp,
  //   stepIndex: BfgGameStepIndex,
  //   event: InferredPerfectInformationGameEvent,
  //   outcome: InferredPerfectInformationGameEventOutcome,
  //   nextBoardState: InferredPerfectInformationGameState,
  // ): InferredBfgGameStep => {

  //   const retVal: InferredBfgGameStep = {
  //     createdAt,
  //     stepIndex,
  //     event,
  //     outcome,
  //     nextBoardState,
  //   };

  //   return retVal;
  // };


  return {
    myHostGameStateToPlayerPerspectiveAdapter: (
      playerSeat: GameTableSeat,
      hostState: InferredPerfectInformationGameState
    ): InferredPlayerGamePerspective => {
      const result = myHostGameStateToPlayerPerspectiveAdapter(playerSeat, hostState);
      return result;
    },

    myHostGameStateToWatcherPerspectiveAdapter: (
      hostState: InferredPerfectInformationGameState
    ): InferredWatcherGamePerspective => {
      const result = myHostGameStateToWatcherPerspectiveAdapter(hostState);
      return result;
    },
  };
};

export type BfgGameStatePerspectiveAdapters = ReturnType<typeof createBfgGameStatePerspectiveAdapters>;



// Reusable constraint for complete game schemas objects
export type BfgCompleteGameSchemas = {
  hostGameStateSchema: z.ZodType;
  playerGameStatePerspectiveSchema: z.ZodType;
  watcherGameStatePerspectiveSchema: z.ZodType;

  hostSourcedGameEventSchema: z.ZodType;
  hostSourcedGameEventOutcomeSchema: z.ZodType;

  playerSourcedGameEventSchema: z.ZodType;
  playerSourcedGameEventOutcomeSchema: z.ZodType;
  
  playerPerspectiveForGameEventOutcomeSchema: z.ZodType;
  watcherPerspectiveForGameEventOutcomeSchema: z.ZodType;
};

// Type-safe wrapper that infers all generic types from the schema types object
export const createBfgGameEventOutcomePerspectiveAdaptersTyped = <
  const TSchemasObject extends BfgCompleteGameSchemas
>(
  config: {
    schemas: TSchemasObject;

    myHostEventOutcomeToPlayerPerspectiveAdapter: (
      playerSeat: GameTableSeat,
      hostEvent: z.infer<TSchemasObject['hostSourcedGameEventSchema']>,
      hostEventOutcome: z.infer<TSchemasObject['hostSourcedGameEventOutcomeSchema']>,
      hostGameState: z.infer<TSchemasObject['hostGameStateSchema']>
    ) => z.infer<TSchemasObject['playerPerspectiveForGameEventOutcomeSchema']>;

    myHostEventOutcomeToWatcherPerspectiveAdapter: (
      hostEvent: z.infer<TSchemasObject['hostSourcedGameEventSchema']>,
      hostEventOutcome: z.infer<TSchemasObject['hostSourcedGameEventOutcomeSchema']>,
      hostGameState: z.infer<TSchemasObject['hostGameStateSchema']>
    ) => z.infer<TSchemasObject['watcherPerspectiveForGameEventOutcomeSchema']>;

    myPlayerEventOutcomeToPlayerPerspectiveAdapter: (
      playerSeat: GameTableSeat,
      playerEvent: z.infer<TSchemasObject['playerSourcedGameEventSchema']>,
      playerEventOutcome: z.infer<TSchemasObject['playerSourcedGameEventOutcomeSchema']>,
      playerGameState: z.infer<TSchemasObject['hostGameStateSchema']>
    ) => z.infer<TSchemasObject['playerPerspectiveForGameEventOutcomeSchema']>;
    
    myPlayerEventOutcomeToWatcherPerspectiveAdapter: (
      playerEvent: z.infer<TSchemasObject['playerSourcedGameEventSchema']>,
      playerEventOutcome: z.infer<TSchemasObject['playerSourcedGameEventOutcomeSchema']>,
      playerGameState: z.infer<TSchemasObject['hostGameStateSchema']>
    ) => z.infer<TSchemasObject['watcherPerspectiveForGameEventOutcomeSchema']>;
  }
) => {
  // Schemas parameter is kept in this wrapper for API consistency, 
  // but not passed to the core function since type information is sufficient
  return createBfgGameEventOutcomePerspectiveAdapters<
    TSchemasObject['hostGameStateSchema'],
    TSchemasObject['hostSourcedGameEventSchema'],
    TSchemasObject['hostSourcedGameEventOutcomeSchema'],
    TSchemasObject['playerSourcedGameEventSchema'],
    TSchemasObject['playerSourcedGameEventOutcomeSchema'],
    TSchemasObject['playerPerspectiveForGameEventOutcomeSchema'],
    TSchemasObject['watcherPerspectiveForGameEventOutcomeSchema']
  >({
    schemas: {
      hostGameStateSchema: config.schemas.hostGameStateSchema,
      hostGameEventSchema: config.schemas.hostSourcedGameEventSchema,
      hostGameEventOutcomeSchema: config.schemas.hostSourcedGameEventOutcomeSchema,
      playerGameEventPerspectiveSchema: config.schemas.playerPerspectiveForGameEventOutcomeSchema,
      watcherGameEventPerspectiveSchema: config.schemas.watcherPerspectiveForGameEventOutcomeSchema,
    },
    myHostEventOutcomeToPlayerPerspectiveAdapter: config.myHostEventOutcomeToPlayerPerspectiveAdapter,
    myHostEventOutcomeToWatcherPerspectiveAdapter: config.myHostEventOutcomeToWatcherPerspectiveAdapter,
    myPlayerEventOutcomeToPlayerPerspectiveAdapter: config.myPlayerEventOutcomeToPlayerPerspectiveAdapter,
    myPlayerEventOutcomeToWatcherPerspectiveAdapter: config.myPlayerEventOutcomeToWatcherPerspectiveAdapter,
  });
};

export const createBfgGameEventOutcomePerspectiveAdapters = 
<
  HostGameStateSchema extends z.ZodType,
  HostGameEventSchema extends z.ZodType,
  HostGameEventOutcomeSchema extends z.ZodType,
  
  PlayerGameEventSchema extends z.ZodType,
  PlayerGameEventOutcomeSchema extends z.ZodType,

  PlayerGameEventPerspectiveSchema extends z.ZodType,
  WatcherGameEventPerspectiveSchema extends z.ZodType,
>
({
  schemas,
  myHostEventOutcomeToPlayerPerspectiveAdapter,
  myHostEventOutcomeToWatcherPerspectiveAdapter,
}: IMyGameEventOutcomePerspectiveAdaptersFactory<
  HostGameStateSchema,
  HostGameEventSchema,
  HostGameEventOutcomeSchema,
  PlayerGameEventSchema,
  PlayerGameEventOutcomeSchema,
  PlayerGameEventPerspectiveSchema,
  WatcherGameEventPerspectiveSchema
>) => {
    // const { schemas, adapters } = myGameAccessLevelAdapterFactory;

  // const { 
  //   hostGameStateSchema,
  //   playerGamePerspectiveSchema,
  //   watcherGamePerspectiveSchema,
  //   gameEventSchema,
  //   hostGameEventOutcomeSchema,
  //   playerGameEventPerspectiveSchema,
  //   watcherGameEventPerspectiveSchema,
  // } = schemas;

  type InferredPerfectInformationGameState = z.infer<HostGameStateSchema>;
  type InferredPerfectInformationGameEvent = z.infer<HostGameEventSchema>;
  type InferredPerfectInformationGameEventOutcome = z.infer<HostGameEventOutcomeSchema>;
  type InferredPlayerGameEventPerspective = z.infer<PlayerGameEventPerspectiveSchema>;
  type InferredWatcherGameEventPerspective = z.infer<WatcherGameEventPerspectiveSchema>;

  // Create the GameBoardEventForDb type structure based on the game-board-event.ts schema
  // This matches the actual structure: { stepIndex, createdAt, event, outcome, nextBoardState }
  // GameBoardEventForDb is just a BfgGameStep with properties at the top level
  // type InferredGameBoardEventForDb = {
  //   stepIndex: z.infer<typeof BfgGameStepIndexSchema>;
  //   createdAt: z.infer<typeof BfgTimestampSchema>;
  //   event: z.infer<HostGameEventSchema>;
  //   outcome: z.infer<HostGameEventOutcomeSchema>;
  //   nextBoardState: z.infer<HostGameStateSchema>;
  // };

  return {
  
    hostGameTableEventToPlayerPerspectiveAdapter: (
      playerSeat: GameTableSeat,
      gameTableEvent: GameTableEventForDb
    ): InferredPlayerGameEventPerspective => {
      const hostAction = gameTableEvent.event.action;
      const hostEventOutcome = gameTableEvent.event.outcome;
      const hostGameState = gameTableEvent.nextBoardState;

      const validatedHostEvent = schemas.hostGameEventSchema.parse(hostAction);
      const validatedHostEventOutcome = schemas.hostGameEventOutcomeSchema.parse(hostEventOutcome);
      const validatedHostGameState = schemas.hostGameStateSchema.parse(hostGameState);

      const adaptedPlayerState = myHostEventOutcomeToPlayerPerspectiveAdapter(
        playerSeat, 
        validatedHostEvent, 
        validatedHostEventOutcome, 
        validatedHostGameState
      );

      return adaptedPlayerState;
    },
    
    myHostEventTransitionToPlayerPerspectiveAdapter: (
      playerSeat: GameTableSeat,
      gameEvent: InferredPerfectInformationGameEventOutcome,
      hostGameState: InferredPerfectInformationGameState
    ): InferredPlayerGameEventPerspective => {
      // Event parameter not available in this context, passing null placeholder
      const adaptedPlayerState = myHostEventOutcomeToPlayerPerspectiveAdapter(playerSeat, null as InferredPerfectInformationGameEvent, gameEvent, hostGameState);
      // const adaptedWatcherState = adapterMethods.myHostGameStateToWatcherAccessLevelAdapter(typedHostState);

      return adaptedPlayerState;
    },
    
    hostEventTransitionToWatcherAccessLevelAdapter: (
      hostEventOutcome: InferredPerfectInformationGameEventOutcome,
      hostGameState: InferredPerfectInformationGameState
    ): InferredWatcherGameEventPerspective => {
      // Event parameter not available in this context, passing null placeholder
      const adaptedWatcherState = myHostEventOutcomeToWatcherPerspectiveAdapter(null as InferredPerfectInformationGameEvent, hostEventOutcome, hostGameState);

      return adaptedWatcherState;
    },
  };
};

export type BfgGameEventOutcomePerspectiveAdapters = ReturnType<typeof createBfgGameEventOutcomePerspectiveAdapters>;





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