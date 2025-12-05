import type { z } from "zod";
import type React from "react";
// import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../metadata-types/game-state-types";
// import type { BfgGameEvent, BfgGameEventOutcome } from "../metadata-types/game-action-types";
import type { GameTableSeat } from "../../models/internal/game-room-base";
// import type { GameTableEventForGameStep } from "../../models/game-table/game-table-event";
import type { GameLobby } from "../../models/p2p-lobby";
import type { GameRoomP2p } from "../../models/p2p/game-room-p2p";
import type { ApplyPlayerActionResult, ApplyHostActionResult, PlayerActionOutcomeSummary, HostActionOutcomeSummary } from "./complete-game-processor-factory";
import type { UserGameRole } from "../../models/internal/user-game-perspective";
import type { GameTableEventForDb } from "../metadata-types";
// import type { GameTableEventForDb } from "../../models/tinybase/game-board-event";



// Helper types to extract specific types from schemas
// type InferredGameState<GSHSchema extends z.ZodType<BfgGameStateForHost>> = z.infer<GSHSchema>;
// type InferredHostAction<GEvSchema extends z.ZodType<BfgGameEvent>> = z.infer<GEvSchema> & { source: 'host' };
// type InferredPlayerAction<GEvSchema extends z.ZodType<BfgGameEvent>> = z.infer<GEvSchema> & { source: 'player' };
// type InferredEventOutcome<GEvOSchema extends z.ZodType<BfgGameEventOutcome>> = z.infer<GEvOSchema>;


// export interface IMyGameProcessorFactory<
//   // GSHSchema extends z.ZodType<BfgGameStateForHost>,
//   // GSPSchema extends z.ZodType<BfgGameStateForPlayer>,
//   // GSWSchema extends z.ZodType<BfgGameStateForWatcher>,
//   // GEvSchema extends z.ZodType<BfgGameEvent>,
//   // GEvOSchema extends z.ZodType<BfgGameEventOutcome>,
// > {
//   // schemas: {
//   //   hostGameStateSchema: GSHSchema;
//   //   playerGameStateSchema: GSPSchema;
//   //   watcherGameStateSchema: GSWSchema;
//   //   gameEventSchema: GEvSchema;
//   //   gameEventOutcomeSchema: GEvOSchema;
//   // },
//   schemas: IBfgEngineMetadataSchemas,
//   gameFunctions: {
//     // Implementations return specific types inferred from schemas
//     // The factory will wrap these to convert to generic types
//     createHostStartsGameAction: (lobbyState: GameLobby) => z.infer<typeof schemas.gameEventSchema>,
//     createHostOpensGameOutcome: (startGameAction: InferredHostAction<GEvSchema>) => InferredEventOutcome<GEvOSchema>,
//     createHostOpensGameState: (startGameAction: InferredHostAction<GEvSchema>) => InferredGameState<GSHSchema>,
//     getNextToActPlayers: (gameRoom: GameRoomP2p, gameState: InferredGameState<GSHSchema>) => GameTableSeat[],
//     getPlayerDetailsLine: (gameRoom: GameRoomP2p, gameState: InferredGameState<GSHSchema>, playerSeat: GameTableSeat) => React.ReactNode,
//     summarizeGameEvent: (gameEvent: GameTableEventWithTransition) => string,
//     applyPlayerAction: (gameRoom: GameRoomP2p, gameState: InferredGameState<GSHSchema>, playerAction: InferredPlayerAction<GEvSchema>) => Promise<{
//       playerAction: InferredPlayerAction<GEvSchema>;
//       playerActionOutcome: InferredEventOutcome<GEvOSchema>;
//       updatedGameState: InferredGameState<GSHSchema>;
//       updatedRoomPhase: RoomPhase;
//     }>,
//     applyHostAction: (gameRoom: GameRoomP2p, gameState: InferredGameState<GSHSchema>, hostAction: InferredHostAction<GEvSchema>) => Promise<{
//       hostAction: InferredHostAction<GEvSchema>;
//       hostActionOutcome: InferredEventOutcome<GEvOSchema>;
//       updatedGameState: InferredGameState<GSHSchema>;
//       updatedRoomPhase: RoomPhase;
//     }>,
//     summarizePlayerActionOutcome: (playerActionOutcome: InferredEventOutcome<GEvOSchema>) => PlayerActionOutcomeSummary,
//     summarizeHostActionOutcome: (hostActionOutcome: InferredEventOutcome<GEvOSchema>) => HostActionOutcomeSummary,
//   }
// };



// export const createBfgGameProcessor = <
//   // GSHSchema extends z.ZodType<BfgGameStateForHost>,
//   // GSPSchema extends z.ZodType<BfgGameStateForPlayer>,
//   // GSWSchema extends z.ZodType<BfgGameStateForWatcher>,
//   // GEvSchema extends z.ZodType<BfgGameEvent>,
//   // GEvOSchema extends z.ZodType<BfgGameEventOutcome>,
// >({schemas, gameFunctions}: {
//   schemas: IBfgEngineMetadataSchemas,
//   gameFunctions: IMyGameProcessorFactory['gameFunctions'],
// }): IBfgGameProcessor => {
//   // myGameProcessorFactory: IMyGameProcessorFactory<GSHSchema, GSPSchema, GSWSchema, GEvSchema, GEvOSchema>
//   // schemas: IBfgEngineMetadataSchemas,

// // ): IBfgGameProcessor => {
//   // const { schemas, gameFunctions } = myGameProcessorFactory;
//   // const { gameFunctions } = myGameProcessorFactory;
  
//   // const hostGameStateSchema = schemas.hostGameStateSchema;
//   // const gameEventSchema = schemas.gameEventSchema;

//   // type InferredGSH = z.infer<typeof hostGameStateSchema>;
//   // type InferredGEv = z.infer<typeof gameEventSchema>;
//   // type InferredGEvO = z.infer<typeof schemas.gameEventOutcomeSchema>;
//   // type InferredHostAction = InferredGEv & { source: 'host' };
//   // type InferredPlayerAction = InferredGEv & { source: 'player' };



//   return {

//     createHostStartsGameAction: <
//       GAH extends BfgGameActionByHost,
//     >(lobbyState: GameLobby): GAH => {
//       const result = gameFunctions.createHostStartsGameAction(lobbyState);
//       // Type assertion needed at generic interface boundary
//       // This is safe because the specific type extends BfgGameActionByHost
//       return result as unknown as GAH;
//     },

//     createHostOpensGameOutcome: <
//       GAH extends BfgGameActionByHost,
//       GHAO extends BfgGameHostActionOutcome,
//     >(startGameAction: GAH): GHAO => {
//       // Convert generic to specific for implementation
//       const typedAction = startGameAction as unknown as InferredHostAction;
//       const result = gameFunctions.createHostOpensGameOutcome(typedAction);
//       // Convert specific back to generic
//       return result as unknown as GHAO;
//     },

//     createHostOpensGameState: <
//       GAH extends BfgGameActionByHost,
//       GSH extends BfgGameStateForHost,
//     >(startGameAction: GAH): GSH => {
//       // Convert generic to specific for implementation
//       const typedAction = startGameAction as unknown as InferredHostAction;
//       const result = gameFunctions.createHostOpensGameState(typedAction);
//       // Convert specific back to generic
//       return result as unknown as GSH;
//     },

//     getNextToActPlayers: <
//       GSH extends BfgGameStateForHost,
//     >(gameRoom: GameRoomP2p, gameState: GSH): GameTableSeat[] => {
//       // Convert generic to specific for implementation
//       const typedState = gameState as unknown as InferredGSH;
//       return gameFunctions.getNextToActPlayers(gameRoom, typedState);
//     },

//     getPlayerDetailsLine: <
//       GSH extends BfgGameStateForHost,
//     >(gameRoom: GameRoomP2p, gameState: GSH, playerSeat: GameTableSeat): React.ReactNode => {
//       // Convert generic to specific for implementation
//       const typedState = gameState as unknown as InferredGSH;
//       return gameFunctions.getPlayerDetailsLine(gameRoom, typedState, playerSeat);
//     },

//     summarizeGameEvent: gameFunctions.summarizeGameEvent,

//     applyPlayerAction: async <
//       GSH extends BfgGameStateForHost,
//       GPA extends BfgGameActionByPlayer,
//       GPAO extends BfgGamePlayerActionOutcome,
//     >(gameRoom: GameRoomP2p, gameState: GSH, playerAction: GPA): Promise<ApplyPlayerActionResult<GSH, GPA, GPAO>> => {
//       // Convert generic to specific for implementation
//       const typedState = gameState as unknown as InferredGSH;
//       const typedAction = playerAction as unknown as InferredPlayerAction;
//       const result = await gameFunctions.applyPlayerAction(gameRoom, typedState, typedAction);
//       // Convert specific back to generic
//       return {
//         playerAction,
//         playerActionOutcome: result.playerActionOutcome as unknown as GPAO,
//         updatedGameState: result.updatedGameState as unknown as GSH,
//         updatedRoomPhase: result.updatedRoomPhase,
//       };
//     },

//     applyHostAction: async <
//       GSH extends BfgGameStateForHost,
//       GAH extends BfgGameActionByHost,
//       GHAO extends BfgGameHostActionOutcome,
//     >(gameRoom: GameRoomP2p, gameState: GSH, hostAction: GAH): Promise<ApplyHostActionResult<GSH, GAH, GHAO>> => {
//       // Convert generic to specific for implementation
//       const typedState = gameState as unknown as InferredGSH;
//       const typedAction = hostAction as unknown as InferredHostAction;
//       const result = await gameFunctions.applyHostAction(gameRoom, typedState, typedAction);
//       // Convert specific back to generic
//       return {
//         hostAction,
//         hostActionOutcome: result.hostActionOutcome as unknown as GHAO,
//         updatedGameState: result.updatedGameState as unknown as GSH,
//         updatedRoomPhase: result.updatedRoomPhase,
//       };
//     },

//     summarizePlayerActionOutcome: <
//       GPAO extends BfgGamePlayerActionOutcome,
//     >(playerActionOutcome: GPAO): PlayerActionOutcomeSummary => {
//       // Convert generic to specific for implementation
//       const typedOutcome = playerActionOutcome as unknown as InferredGEvO;
//       return gameFunctions.summarizePlayerActionOutcome(typedOutcome);
//     },

//     summarizeHostActionOutcome: <
//       GHAO extends BfgGameHostActionOutcome,
//     >(hostActionOutcome: GHAO): HostActionOutcomeSummary => {
//       // Convert generic to specific for implementation
//       const typedOutcome = hostActionOutcome as unknown as InferredGEvO;
//       return gameFunctions.summarizeHostActionOutcome(typedOutcome);
//     },

//   };
// };



export interface IMyGameProcessorFunctions <
  HostGameStateSchema extends z.ZodType,
  PlayerGamePerspectiveSchema extends z.ZodType,
  WatcherGamePerspectiveSchema extends z.ZodType,

  HostGameActionSchema extends z.ZodType,
  HostGameEventOutcomeSchema extends z.ZodType,

  PlayerGameActionSchema extends z.ZodType,
  PlayerGameEventOutcomeSchema extends z.ZodType,

  // PlayerGameEventPerspectiveSchema extends z.ZodType,
  // WatcherGameEventPerspectiveSchema extends z.ZodType,
> {
  schemas: {
    hostGameStateSchema: HostGameStateSchema;
    playerGamePerspectiveSchema: PlayerGamePerspectiveSchema;
    watcherGamePerspectiveSchema: WatcherGamePerspectiveSchema;
  },
  gameFunctions: {
    createHostStartsGameAction: (lobbyState: GameLobby) => z.infer<HostGameActionSchema>;
    createHostOpensGameOutcome: (startGameAction: z.infer<HostGameActionSchema>) => z.infer<HostGameEventOutcomeSchema>;
    createHostOpensGameState: (startGameAction: z.infer<HostGameActionSchema>) => z.infer<HostGameStateSchema>;
    
    getNextToActPlayers: (gameRoom: GameRoomP2p, gameState: z.infer<HostGameStateSchema>) => GameTableSeat[];
    getPlayerDetailsLine: (gameRoom: GameRoomP2p, gameState: z.infer<HostGameStateSchema>, playerSeat: GameTableSeat) => React.ReactNode;
    summarizeGameEvent: (gameEvent: GameTableEventForDb) => string;
    
    applyPlayerAction: (gameRoom: GameRoomP2p, gameState: z.infer<HostGameStateSchema>, playerAction: z.infer<PlayerGameActionSchema>) =>
      Promise<ApplyPlayerActionResult<HostGameStateSchema, PlayerGameActionSchema, HostGameEventOutcomeSchema>>;
    applyHostAction: (gameRoom: GameRoomP2p, gameState: z.infer<HostGameStateSchema>, hostAction: z.infer<HostGameActionSchema>) => 
      Promise<ApplyHostActionResult<HostGameStateSchema, HostGameActionSchema, HostGameEventOutcomeSchema>>;
    
    summarizeHostActionOutcome: (
      hostActionOutcome: z.infer<HostGameEventOutcomeSchema>,
      userGameRole: UserGameRole,
    ) => HostActionOutcomeSummary;
    summarizePlayerActionOutcome: (
      playerActionOutcome: z.infer<PlayerGameEventOutcomeSchema>,
      userGameRole: UserGameRole,
    ) => PlayerActionOutcomeSummary;
    // summarizeWatcherActionOutcome: (watcherActionOutcome: z.infer<WatcherGameEventPerspectiveSchema>) => WatcherActionOutcomeSummary;
  };
}


// Reusable constraint for complete game schemas objects (imported from adapter factory)
type BfgCompleteGameSchemas = {
  hostGameStateSchema: z.ZodType;
  playerGamePerspectiveSchema: z.ZodType;
  watcherGamePerspectiveSchema: z.ZodType;
  hostGameEventSchema: z.ZodType;
  hostGameEventOutcomeSchema: z.ZodType;
  playerGameEventSchema: z.ZodType;
  playerGameEventOutcomeSchema: z.ZodType;
  playerGameEventPerspectiveSchema: z.ZodType;
  watcherGameEventPerspectiveSchema: z.ZodType;
};

// Type-safe wrapper that infers all generic types from the schemas object  
export const createBfgGameProcessorTyped = <
  const TSchemasObject extends BfgCompleteGameSchemas
>(config: {
  schemas: TSchemasObject;
  gameFunctions: {
    createHostStartsGameAction: (lobbyState: GameLobby) => z.infer<TSchemasObject['hostGameEventSchema']>;
    createHostOpensGameOutcome: (startGameAction: z.infer<TSchemasObject['hostGameEventSchema']>) => z.infer<TSchemasObject['hostGameEventOutcomeSchema']>;
    createHostOpensGameState: (startGameAction: z.infer<TSchemasObject['hostGameEventSchema']>) => z.infer<TSchemasObject['hostGameStateSchema']>;
    
    getNextToActPlayers: (gameRoom: GameRoomP2p, gameState: z.infer<TSchemasObject['hostGameStateSchema']>) => GameTableSeat[];
    getPlayerDetailsLine: (gameRoom: GameRoomP2p, gameState: z.infer<TSchemasObject['hostGameStateSchema']>, playerSeat: GameTableSeat) => React.ReactNode;
    summarizeGameEvent: (gameEvent: GameTableEventForDb) => string;
    
    applyPlayerAction: (gameRoom: GameRoomP2p, gameState: z.infer<TSchemasObject['hostGameStateSchema']>, playerAction: z.infer<TSchemasObject['playerGameEventSchema']>) =>
      Promise<ApplyPlayerActionResult<TSchemasObject['hostGameStateSchema'], TSchemasObject['playerGameEventSchema'], TSchemasObject['hostGameEventOutcomeSchema']>>;
    applyHostAction: (gameRoom: GameRoomP2p, gameState: z.infer<TSchemasObject['hostGameStateSchema']>, hostAction: z.infer<TSchemasObject['hostGameEventSchema']>) => 
      Promise<ApplyHostActionResult<TSchemasObject['hostGameStateSchema'], TSchemasObject['hostGameEventSchema'], TSchemasObject['hostGameEventOutcomeSchema']>>;
    
    summarizeHostActionOutcome: (
      hostActionOutcome: z.infer<TSchemasObject['hostGameEventOutcomeSchema']>,
      userGameRole: UserGameRole,
    ) => HostActionOutcomeSummary;
    summarizePlayerActionOutcome: (
      playerActionOutcome: z.infer<TSchemasObject['playerGameEventOutcomeSchema']>,
      userGameRole: UserGameRole,
    ) => PlayerActionOutcomeSummary;
  };
}) => {
  return createBfgGameProcessor<
    TSchemasObject['hostGameStateSchema'],
    TSchemasObject['playerGamePerspectiveSchema'],
    TSchemasObject['watcherGamePerspectiveSchema'],
    TSchemasObject['hostGameEventSchema'],
    TSchemasObject['hostGameEventOutcomeSchema'],
    TSchemasObject['playerGameEventSchema'],
    TSchemasObject['playerGameEventOutcomeSchema']
    // TSchemasObject['playerGameEventPerspectiveSchema'],
    // TSchemasObject['watcherGameEventPerspectiveSchema']
  >({
    schemas: {
      hostGameStateSchema: config.schemas.hostGameStateSchema,
      playerGamePerspectiveSchema: config.schemas.playerGamePerspectiveSchema,
      watcherGamePerspectiveSchema: config.schemas.watcherGamePerspectiveSchema,
    },
    gameFunctions: config.gameFunctions,
  });
};

export const createBfgGameProcessor = <
  HostGameStateSchema extends z.ZodType,
  PlayerGamePerspectiveSchema extends z.ZodType,
  WatcherGamePerspectiveSchema extends z.ZodType,

  HostGameActionSchema extends z.ZodType,
  HostGameEventOutcomeSchema extends z.ZodType,

  PlayerGameActionSchema extends z.ZodType,
  PlayerGameEventOutcomeSchema extends z.ZodType,

  // PlayerGameEventPerspectiveSchema extends z.ZodType,
  // WatcherGameEventPerspectiveSchema extends z.ZodType,
>({
  schemas,
  gameFunctions
}: IMyGameProcessorFunctions<
  HostGameStateSchema,
  PlayerGamePerspectiveSchema,
  WatcherGamePerspectiveSchema,
  HostGameActionSchema,
  HostGameEventOutcomeSchema,
  PlayerGameActionSchema,
  PlayerGameEventOutcomeSchema
  // PlayerGameEventPerspectiveSchema,
  // WatcherGameEventPerspectiveSchema
>) => {
  
  return {
    schemas,

    createHostStartsGameAction: gameFunctions.createHostStartsGameAction,
    createHostOpensGameOutcome: gameFunctions.createHostOpensGameOutcome,
    createHostOpensGameState: gameFunctions.createHostOpensGameState,

    getNextToActPlayers: gameFunctions.getNextToActPlayers,
    getPlayerDetailsLine: gameFunctions.getPlayerDetailsLine,

    summarizeGameEvent: gameFunctions.summarizeGameEvent,

    applyPlayerAction: gameFunctions.applyPlayerAction,
    applyHostAction: gameFunctions.applyHostAction,

    summarizeHostActionOutcome: gameFunctions.summarizeHostActionOutcome,
    summarizePlayerActionOutcome: gameFunctions.summarizePlayerActionOutcome,
    // summarizeWatcherActionOutcome: gameFunctions.summarizeWatcherActionOutcome,
  };
};
