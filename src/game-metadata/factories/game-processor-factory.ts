import type { z } from "zod";
import type React from "react";
import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../metadata-types/game-state-types";
import type { BfgGameActionByHost, BfgGameActionByPlayer, BfgGameEvent, BfgGameEventOutcome, BfgGameHostActionOutcome, BfgGamePlayerActionOutcome } from "../metadata-types/game-action-types";
import type { GameTableSeat } from "../../models/internal/game-room-base";
import type { GameTableEventWithTransition } from "../../models/game-table/game-table-event";
import type { GameLobby } from "../../models/p2p-lobby";
import type { GameRoomP2p } from "../../models/p2p/game-room-p2p";
import type { RoomPhase } from "../../models/internal/table-phase";
import type { ApplyPlayerActionResult, ApplyHostActionResult, PlayerActionOutcomeSummary, HostActionOutcomeSummary, IBfgGameProcessor } from "./complete-game-processor-factory";



// Helper types to extract specific types from schemas
type InferredGameState<GSHSchema extends z.ZodType<BfgGameStateForHost>> = z.infer<GSHSchema>;
type InferredHostAction<GEvSchema extends z.ZodType<BfgGameEvent>> = z.infer<GEvSchema> & { source: 'host' };
type InferredPlayerAction<GEvSchema extends z.ZodType<BfgGameEvent>> = z.infer<GEvSchema> & { source: 'player' };
type InferredEventOutcome<GEvOSchema extends z.ZodType<BfgGameEventOutcome>> = z.infer<GEvOSchema>;

export interface IMyGameProcessorFactory<
  GSHSchema extends z.ZodType<BfgGameStateForHost>,
  GSPSchema extends z.ZodType<BfgGameStateForPlayer>,
  GSWSchema extends z.ZodType<BfgGameStateForWatcher>,
  GEvSchema extends z.ZodType<BfgGameEvent>,
  GEvOSchema extends z.ZodType<BfgGameEventOutcome>,
> {
  schemas: {
    hostGameStateSchema: GSHSchema;
    playerGameStateSchema: GSPSchema;
    watcherGameStateSchema: GSWSchema;
    gameEventSchema: GEvSchema;
    gameEventOutcomeSchema: GEvOSchema;
  },
  gameFunctions: {
    // Implementations return specific types inferred from schemas
    // The factory will wrap these to convert to generic types
    createHostStartsGameAction: (lobbyState: GameLobby) => InferredHostAction<GEvSchema>,
    createHostOpensGameOutcome: (startGameAction: InferredHostAction<GEvSchema>) => InferredEventOutcome<GEvOSchema>,
    createHostOpensGameState: (startGameAction: InferredHostAction<GEvSchema>) => InferredGameState<GSHSchema>,
    getNextToActPlayers: (gameRoom: GameRoomP2p, gameState: InferredGameState<GSHSchema>) => GameTableSeat[],
    getPlayerDetailsLine: (gameRoom: GameRoomP2p, gameState: InferredGameState<GSHSchema>, playerSeat: GameTableSeat) => React.ReactNode,
    summarizeGameEvent: (gameEvent: GameTableEventWithTransition) => string,
    applyPlayerAction: (gameRoom: GameRoomP2p, gameState: InferredGameState<GSHSchema>, playerAction: InferredPlayerAction<GEvSchema>) => Promise<{
      playerAction: InferredPlayerAction<GEvSchema>;
      playerActionOutcome: InferredEventOutcome<GEvOSchema>;
      updatedGameState: InferredGameState<GSHSchema>;
      updatedRoomPhase: RoomPhase;
    }>,
    applyHostAction: (gameRoom: GameRoomP2p, gameState: InferredGameState<GSHSchema>, hostAction: InferredHostAction<GEvSchema>) => Promise<{
      hostAction: InferredHostAction<GEvSchema>;
      hostActionOutcome: InferredEventOutcome<GEvOSchema>;
      updatedGameState: InferredGameState<GSHSchema>;
      updatedRoomPhase: RoomPhase;
    }>,
    summarizePlayerActionOutcome: (playerActionOutcome: InferredEventOutcome<GEvOSchema>) => PlayerActionOutcomeSummary,
    summarizeHostActionOutcome: (hostActionOutcome: InferredEventOutcome<GEvOSchema>) => HostActionOutcomeSummary,
  }
};



export const createBfgGameProcessor = <
  GSHSchema extends z.ZodType<BfgGameStateForHost>,
  GSPSchema extends z.ZodType<BfgGameStateForPlayer>,
  GSWSchema extends z.ZodType<BfgGameStateForWatcher>,
  GEvSchema extends z.ZodType<BfgGameEvent>,
  GEvOSchema extends z.ZodType<BfgGameEventOutcome>,
>(myGameProcessorFactory: IMyGameProcessorFactory<GSHSchema, GSPSchema, GSWSchema, GEvSchema, GEvOSchema>): IBfgGameProcessor => {
  const { schemas, gameFunctions } = myGameProcessorFactory;
  
  const hostGameStateSchema = schemas.hostGameStateSchema;
  const gameEventSchema = schemas.gameEventSchema;

  type InferredGSH = z.infer<typeof hostGameStateSchema>;
  type InferredGEv = z.infer<typeof gameEventSchema>;
  type InferredGEvO = z.infer<typeof schemas.gameEventOutcomeSchema>;
  type InferredHostAction = InferredGEv & { source: 'host' };
  type InferredPlayerAction = InferredGEv & { source: 'player' };

  return {

    createHostStartsGameAction: <
      GAH extends BfgGameActionByHost,
    >(lobbyState: GameLobby): GAH => {
      const result = gameFunctions.createHostStartsGameAction(lobbyState);
      // Type assertion needed at generic interface boundary
      // This is safe because the specific type extends BfgGameActionByHost
      return result as unknown as GAH;
    },

    createHostOpensGameOutcome: <
      GAH extends BfgGameActionByHost,
      GHAO extends BfgGameHostActionOutcome,
    >(startGameAction: GAH): GHAO => {
      // Convert generic to specific for implementation
      const typedAction = startGameAction as unknown as InferredHostAction;
      const result = gameFunctions.createHostOpensGameOutcome(typedAction);
      // Convert specific back to generic
      return result as unknown as GHAO;
    },

    createHostOpensGameState: <
      GAH extends BfgGameActionByHost,
      GSH extends BfgGameStateForHost,
    >(startGameAction: GAH): GSH => {
      // Convert generic to specific for implementation
      const typedAction = startGameAction as unknown as InferredHostAction;
      const result = gameFunctions.createHostOpensGameState(typedAction);
      // Convert specific back to generic
      return result as unknown as GSH;
    },

    getNextToActPlayers: <
      GSH extends BfgGameStateForHost,
    >(gameRoom: GameRoomP2p, gameState: GSH): GameTableSeat[] => {
      // Convert generic to specific for implementation
      const typedState = gameState as unknown as InferredGSH;
      return gameFunctions.getNextToActPlayers(gameRoom, typedState);
    },

    getPlayerDetailsLine: <
      GSH extends BfgGameStateForHost,
    >(gameRoom: GameRoomP2p, gameState: GSH, playerSeat: GameTableSeat): React.ReactNode => {
      // Convert generic to specific for implementation
      const typedState = gameState as unknown as InferredGSH;
      return gameFunctions.getPlayerDetailsLine(gameRoom, typedState, playerSeat);
    },

    summarizeGameEvent: gameFunctions.summarizeGameEvent,

    applyPlayerAction: async <
      GSH extends BfgGameStateForHost,
      GPA extends BfgGameActionByPlayer,
      GPAO extends BfgGamePlayerActionOutcome,
    >(gameRoom: GameRoomP2p, gameState: GSH, playerAction: GPA): Promise<ApplyPlayerActionResult<GSH, GPA, GPAO>> => {
      // Convert generic to specific for implementation
      const typedState = gameState as unknown as InferredGSH;
      const typedAction = playerAction as unknown as InferredPlayerAction;
      const result = await gameFunctions.applyPlayerAction(gameRoom, typedState, typedAction);
      // Convert specific back to generic
      return {
        playerAction,
        playerActionOutcome: result.playerActionOutcome as unknown as GPAO,
        updatedGameState: result.updatedGameState as unknown as GSH,
        updatedRoomPhase: result.updatedRoomPhase,
      };
    },

    applyHostAction: async <
      GSH extends BfgGameStateForHost,
      GAH extends BfgGameActionByHost,
      GHAO extends BfgGameHostActionOutcome,
    >(gameRoom: GameRoomP2p, gameState: GSH, hostAction: GAH): Promise<ApplyHostActionResult<GSH, GAH, GHAO>> => {
      // Convert generic to specific for implementation
      const typedState = gameState as unknown as InferredGSH;
      const typedAction = hostAction as unknown as InferredHostAction;
      const result = await gameFunctions.applyHostAction(gameRoom, typedState, typedAction);
      // Convert specific back to generic
      return {
        hostAction,
        hostActionOutcome: result.hostActionOutcome as unknown as GHAO,
        updatedGameState: result.updatedGameState as unknown as GSH,
        updatedRoomPhase: result.updatedRoomPhase,
      };
    },

    summarizePlayerActionOutcome: <
      GPAO extends BfgGamePlayerActionOutcome,
    >(playerActionOutcome: GPAO): PlayerActionOutcomeSummary => {
      // Convert generic to specific for implementation
      const typedOutcome = playerActionOutcome as unknown as InferredGEvO;
      return gameFunctions.summarizePlayerActionOutcome(typedOutcome);
    },

    summarizeHostActionOutcome: <
      GHAO extends BfgGameHostActionOutcome,
    >(hostActionOutcome: GHAO): HostActionOutcomeSummary => {
      // Convert generic to specific for implementation
      const typedOutcome = hostActionOutcome as unknown as InferredGEvO;
      return gameFunctions.summarizeHostActionOutcome(typedOutcome);
    },



    // hostGameStateToPlayerAccessLevelAdapter: <
    //   GSH extends BfgGameStateForHost,
    //   GSP extends BfgGameStateForPlayer,
    // >(hostState: GSH): GSP => {
    //   // Converting from generic GSH to specific InferredGSH for the adapter call
    //   // This is safe because the function is only called with the specific types at runtime
    //   const typedHostState = hostState as unknown as InferredGSH;
    //   const result = gameFunctions.myHostGameStateToPlayerAccessLevelAdapter(typedHostState);

    //   // Converting from specific InferredGSP to generic GSP
    //   // This is safe because the function is only called with the specific types at runtime
    //   return result as unknown as GSP;
    // },
    // hostGameStateToWatcherAccessLevelAdapter: <
    //   GSH extends BfgGameStateForHost,
    //   GSW extends BfgGameStateForWatcher,
    // >(hostState: GSH): GSW => {
    //   // Converting from generic GSH to specific InferredGSH for the adapter call
    //   // This is safe because the function is only called with the specific types at runtime
    //   const typedHostState = hostState as unknown as InferredGSH;
    //   const result = gameFunctions.myHostGameStateToWatcherAccessLevelAdapter(typedHostState);

    //   // Converting from specific InferredGSW to generic GSW
    //   // This is safe because the function is only called with the specific types at runtime
    //   return result as unknown as GSW;
    // },
    // hostEventTransitionFromHostEventTransitionDb: <
    //   GTDb extends GameBoardEventForDb,
    //   GTH extends GameTableEventForHostP2p,
    // >(hostEventTransitionDb: GTDb): GTH => {
    //   const typedEvent = hostEventTransitionDb.transitionForHost.event as unknown as InferredGEv;
    //   const adaptedEvent = gameFunctions.myHostEventTransitionFromHostEventTransitionDb(typedEvent);
      
    //   const typedHostState = hostEventTransitionDb.transitionForHost.nextBoardState as unknown as InferredGSH;
    //   const adaptedWatcherState = gameFunctions.myHostGameStateToWatcherAccessLevelAdapter(typedHostState);

    //   // Converting from GameBoardEventForDb structure to GameTableEventForHostP2p structure
    //   // Note: nextGamePlayerStates is an empty array because we don't have player seat information
    //   // in GameBoardEventForDb. This should be populated by the caller if needed.
    //   const result = {
    //     createdAt: hostEventTransitionDb.createdAt,
    //     stepIndex: hostEventTransitionDb.stepIndex,
    //     event: adaptedEvent as unknown as GTH['event'],
    //     outcome: hostEventTransitionDb.transitionForHost.change as unknown as GTH['outcome'],
    //     nextGameHostState: typedHostState as unknown as GTH['nextGameHostState'],
    //     nextGamePlayerStates: [] as unknown as GTH['nextGamePlayerStates'],
    //     nextGameWatcherState: adaptedWatcherState as unknown as GTH['nextGameWatcherState'],
    //   };

    //   return result as unknown as GTH;
    // },
    // hostEventTransitionToPlayerAccessLevelAdapter: <
    //   GTH extends GameBoardEventForDb,
    //   GTP extends GameTableEventForPlayerP2p,
    // >(playerSeat: GameTableSeat, hostEventTransitionDb: GTH): GTP => {
    //   const typedEvent = hostEventTransitionDb.transitionForHost.event as unknown as InferredGEv;
    //   const adaptedEvent = gameFunctions.myHostEventTransitionFromHostEventTransitionDb(typedEvent);
      
    //   const typedHostState = hostEventTransitionDb.transitionForHost.nextBoardState as unknown as InferredGSH;
    //   const adaptedPlayerState = gameFunctions.myHostGameStateToPlayerAccessLevelAdapter(typedHostState);
    //   const adaptedWatcherState = gameFunctions.myHostGameStateToWatcherAccessLevelAdapter(typedHostState);

    //   // Converting from GameBoardEventForDb structure to GameTableEventForPlayerP2p structure
    //   const result = {
    //     // gameTableId: hostEventTransitionDb.gameRoomId as unknown as GTP['gameTableId'],
    //     createdAt: hostEventTransitionDb.createdAt,
    //     stepIndex: hostEventTransitionDb.stepIndex,
    //     event: adaptedEvent as unknown as GTP['event'],
    //     outcome: hostEventTransitionDb.transitionForHost.change as unknown as GTP['outcome'],
    //     nextGamePlayerState: {
    //       seat: playerSeat,
    //       state: adaptedPlayerState,
    //     } as unknown as GTP['nextGamePlayerState'],
    //     nextGameWatcherState: adaptedWatcherState as unknown as GTP['nextGameWatcherState'],
    //   };

    //   return result as unknown as GTP;
    // },
    // hostEventTransitionToWatcherAccessLevelAdapter: <
    //   GTH extends GameBoardEventForDb,
    //   GTW extends GameTableEventForWatcherP2p,
    // >(hostEventTransition: GTH): GTW => {
    //   const typedEvent = hostEventTransition.transitionForHost.event as unknown as InferredGEv;
    //   const adaptedEvent = gameFunctions.myHostEventTransitionFromHostEventTransitionDb(typedEvent);

    //   const typedHostState = hostEventTransition.transitionForHost.nextBoardState as unknown as InferredGSH;
    //   const adaptedWatcherState = gameFunctions.myHostGameStateToWatcherAccessLevelAdapter(typedHostState);

    //   const result = {
    //     createdAt: hostEventTransition.createdAt,
    //     stepIndex: hostEventTransition.stepIndex,
    //     event: adaptedEvent as unknown as GTW['event'],
    //     outcome: hostEventTransition.transitionForHost.change as unknown as GTW['outcome'],
    //     nextGameWatcherState: adaptedWatcherState as unknown as GTW['nextGameWatcherState'],
    //   };

    //   return result as unknown as GTW;
    // },
  };
};

