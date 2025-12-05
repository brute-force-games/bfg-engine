// import { BfgSupportedGameTitle, GameDefinition } from "../../../src/models/game-box-definition";
import { assert, describe, it } from "vitest";
// import { GuessNumberGameMetadata } from "../game-guess-number/game-box";
// import type { GameLobby } from "../../../src/models/p2p-lobby";
// import { BfgGameInstanceIdToolbox, BfgGameLobbyIdToolbox, BfgGameRoomIdToolbox, BfgGameTableIdToolbox, BfgPlayerProfileIdToolbox } from "../../../src/models/types/bfg-branded-uuids";
// import type { PublicPlayerProfile } from "../../../src/models/internal/player-profile/public-player-profile";
// import type { INewHostOps } from "../../../src/v2/new-host-ops/new-host-ops";
// import { NewHostOps } from "../../../src/v2/new-host-ops/new-host-ops";
// import { registerGame } from "../../../src/v2/new-game-registry/new-game-registry";
// import type { IPersistenceOps } from "../../../src/v2/new-persistence-ops/persistence-ops";
// import { LocalTbPersistenceOps } from "../../../src/v2/new-persistence-ops/local-tb-persistence-ops";
// import { GameGuessNumberPlayerOps } from "../game-guess-number/role-ops/ggn-player-ops";
// import { GameGuessNumberWatcherOps } from "../game-guess-number/role-ops/ggn-watcher-ops";
// import type { IPlayerOps } from "../../../src/v2/player-ops/player-ops";
// import type { IWatcherOps } from "../../../src/v2/watcher-ops/watcher-ops";
// import type { ITxOps } from "../../../src/v2/relay-ops/tx-ops";
// import type { IRxOps } from "../../../src/v2/relay-ops/rx-ops";
// import type { IBfgGameOps } from "../../../src/v2/game-ops/game-ops";
// import { TxOps } from "../../../src/v2/relay-ops/tx-ops";
// import { RxOps } from "../../../src/v2/relay-ops/rx-ops";
// import { createBfgGameOpsForConsoleInstance } from "../../../src/v2/game-ops/game-ops-for-console-impl";
// import { IGameIdentifiers } from "../../../src/models/types/game-identifiers";


describe("play guess number game", () => {
  
  // registerGame(GuessNumberGameMetadata);
  
  // // Set up all dependencies
  // const hostOps: INewHostOps = NewHostOps;
  // const persistenceOps: IPersistenceOps = LocalTbPersistenceOps;
  // const txOps: ITxOps = TxOps;
  // const rxOps: IRxOps = RxOps;
  // const playerOps: IPlayerOps = GameGuessNumberPlayerOps;
  // const watcherOps: IWatcherOps = GameGuessNumberWatcherOps;

  // // Create gameOps instance with all dependencies via Effect Context
  // const gameOps: IBfgGameOps = createBfgGameOpsForConsoleInstance(
  //   hostOps,
  //   persistenceOps,
  //   txOps,
  //   rxOps,
  //   playerOps,
  //   watcherOps
  // );

  // const gameLobbyId = BfgGameLobbyIdToolbox.createRandomId();
  // const gameRoomId = BfgGameRoomIdToolbox.createRandomId();
  // const gameTableId = BfgGameTableIdToolbox.createRandomId();
  // const gameInstanceId = BfgGameInstanceIdToolbox.createRandomId();
  // const gameHostPlayerProfileId = BfgPlayerProfileIdToolbox.createRandomId();

  // const gameIdentifiers: IGameIdentifiers = {
  //   gameInstanceId: gameInstanceId,
  //   gameRoomId: gameRoomId,
  //   gameTableId: gameTableId,
  // };
  
  // const gameHostPlayerProfile: PublicPlayerProfile = {
  //   id: gameHostPlayerProfileId,
  //   handle: "TestHost",
  //   createdAt: Date.now(),
  //   updatedAt: Date.now(),
  // };

  // const secondPlayerProfileId = BfgPlayerProfileIdToolbox.createRandomId();
  // const secondPlayerProfile: PublicPlayerProfile = {
  //   id: secondPlayerProfileId,
  //   handle: "TestPlayer2",
  //   createdAt: Date.now(),
  //   updatedAt: Date.now(),
  // };

  // const numberSetterPlayerProfileId = gameHostPlayerProfileId;
  // const guesserPlayerProfileId = secondPlayerProfileId;

  // const gameLobby: GameLobby = {
  //   id: gameLobbyId,
  //   gameHostPlayerProfile: gameHostPlayerProfile,
  //   lobbyName: "Test Game Room",
  //   currentStatusDescription: "Test Game Room",
  //   isLobbyValid: true,
  //   gameTitle: GuessNumberGameMetadata.gameTitle,
  //   playerPool: [gameHostPlayerProfile, secondPlayerProfile],
  //   minNumPlayers: 2,
  //   maxNumPlayers: 2,
  //   createdAt: Date.now(),
  //   updatedAt: Date.now(),
  // };

  it("fails if the target number is not set", async () => {
    // const startedGameTable = await hostOps.startNewGame(gameLobby, gameInstanceId, gameRoomId, gameTableId);
    // const { gameRoom, gameStep } = startedGameTable;
    // const { action, actionOutcome, nextGameState, gameTableEvent, nextToActPlayers } = gameStep;
    // const stringifiedStep = JSON.stringify(gameStep) as BfgStringifiedGameStepStr;
    // const gameStepPersist = persistenceOps.mappers.mapToGameStepPersist(gameStep);
  });

  it("doesn't show the target number to the guesser", async () => {
    // const startedGameTable = await hostOps.startNewGame(gameLobby, gameInstanceId, gameRoomId, gameTableId);
    // const { gameRoom, gameStep } = startedGameTable;
    // const { action, actionOutcome, nextGameState, gameTableEvent, nextToActPlayers } = gameStep;
    // const stringifiedStep = JSON.stringify(gameStep) as BfgStringifiedGameStepStr;
    // const gameStepPersist = persistenceOps.mappers.mapToGameStepPersist(gameStep);
  });

  // it("ends the game when the target number is guessed", async () => {

  //   const gameOpsInitResult = await gameOps.initializeGameOps();

  //   await gameOps.doFirstGameStep(gameLobby, gameIdentifiers);

  //   await gameOps.doGameStep(gameIdentifiers);




  //   // const startedGameTable = await hostOps.startNewGame(gameLobby, gameInstanceId, gameRoomId, gameTableId);
  //   // const [txInitResult, rxInitResult] = await Promise.all([
  //   //   txOps.initializeTx(startedGameTable),
  //   //   rxOps.initializeRx(startedGameTable),
  //   // ]);

  //   // const newGameTablePersist = persistenceOps.mappers.mapToNewGameTableState(startedGameTable);

  //   // const saveResult = await persistenceOps.persistNewGameTable(gameInstanceId, gameRoomId, gameTableId, newGameTablePersist, gameStepPersist);
  //   // assert(saveResult.success, "Failed to persist new game table: " + saveResult.error);

  //   // const txResult = await txOps.txGameStepToAllPlayers(gameStepPersist);

  //   // let validNextPlayerActions = null;
  //   // while (!validNextPlayerActions) {
  //   //   const rxResult = await rxOps.rxNextPlayerActions(gameStepPersist);
  //   //   validNextPlayerActions = rxResult.validNextPlayerActions;
  //   // }
    
  //   // const loadedGameTable = await persistenceOps.loadLatestGameTableState(gameInstanceId, gameRoomId, gameTableId);
  //   // assert(loadedGameTable.success, "Failed to load latest game table: " + loadedGameTable.error);

  //   const guesserPlayer = loadedGameTable.data.gameRoom.playerPool.find((player) => player.id === guesserPlayerProfileId);
  //   assert(guesserPlayer, "Guesser player not found in loaded game table");

  //   const numberSetterPlayer = loadedGameTable.data.gameRoom.playerPool.find((player) => player.id === numberSetterPlayerProfileId);
  //   assert(numberSetterPlayer, "Number setter player not found in loaded game table");

  //   const setNumberAction = hostOps.createGameAction(numberSetterPlayerProfileId, "set-number", { number: 42 });

  //   const guessNumberAction = hostOps.createGameAction(guesserPlayerProfileId, "guess-number", { number: 42 });

    


  //   // hostOps.processGameAction(loadedGameTable.data.gameStep);

  //   // const loadedGameStep = loadedGameTable.data.gameStep;
  //   // assert(loadedGameStep, "No game step found in loaded game table");

  //   // const loadedGameState = loadedGameTable.data.gameState;
  //   // assert(loadedGameState, "No game state found in loaded game table");

  //   // console.log("ADDING GAME ACTION", startedGameTable);
  //   // const saveResult = await persistenceOps.saveNewGameTable(gameInstanceId, gameRoomId, gameTableId, startedGameTable.gameRoom, startedGameTable.gameState);
    
  //   // if (!saveResult.success) {
  //   //   console.error('Failed to save new hosted game:', saveResult.error);
  //   //   throw new Error(`Failed to save new hosted game: ${saveResult.error}`);
  //   // }
    
  //   // console.log('Successfully saved new hosted game:', gameInstanceId);


  //   // console.log("NEW GAME RESULT", newGameResult);
    
  // });
});