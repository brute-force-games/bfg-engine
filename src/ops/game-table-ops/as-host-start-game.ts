import { BfgGameTableActionId, GameTableId } from "~/models/types/bfg-branded-ids";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { GameTable } from "~/models/game-table/game-table";
import { GameLobby } from "~/models/p2p-lobby";
import { addHostedGame } from "~/tb-store/hosted-games-store";
import { addGameAction } from "~/tb-store/hosted-game-actions-store";
import { createInitialGameData } from "~/models/bfg-game-engines";
import { IGameRegistry } from "~/hooks/games-registry/games-registry";


const createNewGameTableFromLobbyState = (lobbyState: GameLobby, newGameTableId: GameTableId): GameTable => {
  const gameTitle = lobbyState.gameTitle;
  if (!gameTitle) {
    throw new Error("Game title not found");
  }

  // Validate lobby has at least 1 player
  const playerPool = lobbyState.playerPool;
  if (playerPool.length < 1) {
    throw new Error("Lobby must have at least 1 player");
  }

  const now = Date.now();
  const latestActionId = BfgGameTableActionId.createId();

  // Fill out p1-p8 from the lobby player pool array
  const retVal: GameTable = {
    id: newGameTableId,
    latestActionId,
    createdAt: now,
    lastUpdatedAt: now,
    
    gameTitle,
    gameHostPlayerProfileId: lobbyState.gameHostPlayerProfile.id,
    tablePhase: 'table-phase-lobby',
    currentStatusDescription: lobbyState.currentStatusDescription,
    p1: playerPool[0], // Guaranteed to exist after validation
    p2: playerPool[1],
    p3: playerPool[2],
    p4: playerPool[3],
    p5: playerPool[4],
    p6: playerPool[5],
    p7: playerPool[6],
    p8: playerPool[7],
  }

  return retVal;
}

export const asHostStartNewGame = async (gameRegistry: IGameRegistry, lobbyState: GameLobby, newGameTableId: GameTableId): Promise<GameTable> => {
  console.log("DB: asHostStartGame", lobbyState);

  const gameTitle = lobbyState.gameTitle;
  if (!gameTitle) {
    throw new Error("Game title not found");
  }

  const newGameTable = createNewGameTableFromLobbyState(lobbyState, newGameTableId);
  
  // Type-safe game engine access using helper function
  const { initialGameSpecificState, gameStateJson, actionJson } = createInitialGameData(gameRegistry, gameTitle);

  const gameSpecificSummary = `Game started`;

  const initialGameState = {
    gameSpecificState: initialGameSpecificState,
    tablePhase: 'table-phase-game-in-progress' as const,
    gameSpecificStateSummary: gameSpecificSummary,
  };

  console.log("HOST STARTING GAME - INITIAL GAME STATE", initialGameState);
  console.log("HOST STARTING GAME - GAME STATE JSON", gameStateJson);
  console.log("HOST STARTING GAME - ACTION JSON", actionJson);

  const addedGameTable = await addHostedGame(newGameTable);

  if (!addedGameTable) {
    throw new Error("Failed to add game table");
  }

  // const startActionId = BfgGameTableActionId.createId();

  const tableId = newGameTable.id;
  const now = Date.now();

  const hostStartsGameSetupAction: DbGameTableAction = {
    // id: startActionId,
    gameTableId: tableId,
    // previousActionId: mostRecentGameActionId,
    createdAt: now,

    source: "game-table-action-source-host",
    actionType: "game-table-action-host-starts-setup",
    // nextPlayersToAct,
    actionJson,
    actionOutcomeGameStateJson: gameStateJson,

    // realmId: newGameTable.realmId,
  }

  console.log("ADDING GAME ACTION", hostStartsGameSetupAction);
  await addGameAction(tableId, hostStartsGameSetupAction);

  return newGameTable;
}
