import { Context, Effect, Layer } from "effect";
import { GameLobby } from "../../models/p2p-lobby";
import { FirstGameStepResult, GameStepResult, IBfgGameOps } from "./game-ops";
import { IGameIdentifiers } from "../../models/types/game-identifiers";
import type { INewHostOps } from "../new-host-ops/new-host-ops";
import type { IPersistenceOps } from "../new-persistence-ops/persistence-ops";
import type { ITxOps } from "../relay-ops/tx-ops";
import type { IRxOps } from "../relay-ops/rx-ops";
import type { IPlayerOps } from "../player-ops/player-ops";
import type { IWatcherOps } from "../watcher-ops/watcher-ops";


// Effect Context services for dependency injection
export class HostOps extends Context.Tag("HostOps")<HostOps, INewHostOps>() {}
export class PersistenceOps extends Context.Tag("PersistenceOps")<PersistenceOps, IPersistenceOps>() {}
export class TxOps extends Context.Tag("TxOps")<TxOps, ITxOps>() {}
export class RxOps extends Context.Tag("RxOps")<RxOps, IRxOps>() {}
export class PlayerOps extends Context.Tag("PlayerOps")<PlayerOps, IPlayerOps>() {}
export class WatcherOps extends Context.Tag("WatcherOps")<WatcherOps, IWatcherOps>() {}


// Factory function that creates an IBfgGameOps instance with dependencies provided via Effect Context
// Dependencies are resolved from Effect Context and captured in the closure for easy access
export const createBfgGameOpsForConsoleInstance = (
  hostOps: INewHostOps,
  persistenceOps: IPersistenceOps,
  txOps: ITxOps,
  rxOps: IRxOps,
  playerOps: IPlayerOps,
  watcherOps: IWatcherOps
): IBfgGameOps => {
  // Create a Layer with all dependencies
  const dependenciesLayer = Layer.mergeAll(
    Layer.succeed(HostOps, hostOps),
    Layer.succeed(PersistenceOps, persistenceOps),
    Layer.succeed(TxOps, txOps),
    Layer.succeed(RxOps, rxOps),
    Layer.succeed(PlayerOps, playerOps),
    Layer.succeed(WatcherOps, watcherOps)
  );

  // Resolve all dependencies from Effect Context and capture them in closure
  const resolvedDeps = Effect.gen(function* () {
    const hostOpsInstance = yield* HostOps;
    const persistenceOpsInstance = yield* PersistenceOps;
    const txOpsInstance = yield* TxOps;
    const rxOpsInstance = yield* RxOps;
    const playerOpsInstance = yield* PlayerOps;
    const watcherOpsInstance = yield* WatcherOps;
    
    return {
      hostOps: hostOpsInstance,
      persistenceOps: persistenceOpsInstance,
      txOps: txOpsInstance,
      rxOps: rxOpsInstance,
      playerOps: playerOpsInstance,
      watcherOps: watcherOpsInstance,
    };
  }).pipe(Effect.provide(dependenciesLayer), Effect.runSync);

  return {
    initializeGameOps: async () => {
      // Dependencies are available via Effect Context: resolvedDeps.hostOps, resolvedDeps.persistenceOps, etc.
      // Access dependencies when needed for initialization
      return;
    },

    doFirstGameStep: async (gameLobby: GameLobby, gameIdentifiers: IGameIdentifiers): Promise<FirstGameStepResult> => {
      // Access dependencies from Effect Context
      const { hostOps, persistenceOps, txOps, rxOps } = resolvedDeps;

      const { gameInstanceId, gameRoomId, gameTableId } = gameIdentifiers;

      const startedGameTable = await hostOps.startNewGame(gameLobby, gameInstanceId, gameRoomId, gameTableId);
      
      const [txInitResult, rxInitResult] = await Promise.all([
        txOps.initializeTx(startedGameTable),
        rxOps.initializeRx(startedGameTable),
      ]);

      const newGameTablePersist = persistenceOps.mappers.mapToNewGameTableState(startedGameTable);
      const gameStepPersist = startedGameTable.gameStep;

      const saveResult = await persistenceOps.persistNewGameTable(gameInstanceId, gameRoomId, gameTableId, newGameTablePersist, gameStepPersist);
      if (!saveResult.success) {
        throw new Error("Failed to persist new game table: " + saveResult.error);
      }

      const txAllPlayersResult = await txOps.txGameTableToAllPlayers(gameStepPersist);

      const retVal: FirstGameStepResult = {
        txInitResult,
        rxInitResult,
        gameStepResult: {
          gameTablePhase: startedGameTable.gameRoom.latestRoomPhase,
          saveResult,
          txAllPlayersResult,
          hostEvents: [],
          playerEvents: [],
        },
      }

      return retVal;
    },

    doGameStep: async (gameIdentifiers: IGameIdentifiers): Promise<GameStepResult> => {
      // Access dependencies from Effect Context
      const { hostOps, persistenceOps, txOps, rxOps } = resolvedDeps;
      const { gameInstanceId, gameRoomId, gameTableId } = gameIdentifiers;

      const latestGameTable = await persistenceOps.getLatestGameTable(gameInstanceId, gameRoomId, gameTableId);

      const [hostEvents, playerEvents] = await Promise.all([
        hostOps.gatherGameEvents(latestGameTable),
        rxOps.gatherNextPlayerActions(latestGameTable),
      ]);

      const continuedGameTable = await hostOps.continueGame(latestGameTable.gameTable!, hostEvents, playerEvents);

      const newGameTablePersist = persistenceOps.mappers.mapToNewGameTableState(continuedGameTable);
      const gameStepPersist = newGameTablePersist.gameStep;

      const saveResult = await persistenceOps.persistNewGameTable(gameInstanceId, gameRoomId, gameTableId, newGameTablePersist, gameStepPersist);
      if (!saveResult.success) {
        throw new Error("Failed to persist latest game table: " + saveResult.error);
      }

      const txAllPlayersResult = await txOps.txGameTableToAllPlayers(gameStepPersist);

      const retVal: GameStepResult = {
        gameTablePhase: continuedGameTable.gameRoom.latestRoomPhase,
        saveResult,
        txAllPlayersResult,
        hostEvents,
        playerEvents,
      }

      return retVal;
    },
  };
};

// const gameOps: IBfgGameOps = BfgGameOpsForConsoleTests;
// const hostOps: INewHostOps = NewHostOps;
// const persistenceOps: IPersistenceOps = LocalTbPersistenceOps;
// const txOps: ITxOps = LocalTbTxOps;
// const rxOps: IRxOps = LocalTbRxOps;

// const playerOps: IPlayerOps = GameGuessNumberPlayerOps;
// const watcherOps: IWatcherOps = GameGuessNumberWatcherOps;

// const startedGameTable = await hostOps.startNewGame(gameLobby, gameInstanceId, gameRoomId, gameTableId);
// const [txInitResult, rxInitResult] = await Promise.all([
//   txOps.initializeTx(startedGameTable),
//   rxOps.initializeRx(startedGameTable),
// ]);

// const newGameTablePersist = persistenceOps.mappers.mapToNewGameTableState(startedGameTable);

// const saveResult = await persistenceOps.persistNewGameTable(gameInstanceId, gameRoomId, gameTableId, newGameTablePersist, gameStepPersist);
// assert(saveResult.success, "Failed to persist new game table: " + saveResult.error);

// const txResult = await txOps.txGameStepToAllPlayers(gameStepPersist);

// let validNextPlayerActions = null;
// while (!validNextPlayerActions) {
//   const rxResult = await rxOps.rxNextPlayerActions(gameStepPersist);
//   validNextPlayerActions = rxResult.validNextPlayerActions;
// }
