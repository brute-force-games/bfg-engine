import { BfgGameTableActionId, GameTableId } from "../../models/types/bfg-branded-ids";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { GameTable } from "../../models/game-table/game-table";
import { GameLobby } from "../../models/p2p-lobby";
import { addHostedGame } from "../../tb-store/hosted-games-store";
import { addGameHostAction } from "../../tb-store/hosted-game-actions-store";
import { IGameRegistry } from "../../hooks/games-registry/games-registry";


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
    tablePhase: 'table-phase-game-setup',
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
  
  const metadata = gameRegistry.getGameMetadata(gameTitle);
  const gameProcessor = metadata.engine;

  const initialGameSpecificAction = gameProcessor.createGameSpecificInitialAction(newGameTable, lobbyState);
  const initialGameSpecificState = gameProcessor.createGameSpecificInitialState(newGameTable, initialGameSpecificAction);

  const actionStr = metadata.hostActionEncoder.encode(initialGameSpecificAction.gameSpecificAction);
  const nextGameStateStr = metadata.gameSpecificStateEncoder.encode(initialGameSpecificState);

  const addedGameTable = await addHostedGame(newGameTable);

  if (!addedGameTable) {
    throw new Error("Failed to add game table");
  }

  const tableId = newGameTable.id;
  const now = Date.now();

  const hostSetsUpGameSetupAction: DbGameTableAction = {
    gameTableId: tableId,
    createdAt: now,

    source: "game-table-action-source-host",
    actionType: "game-table-action-host-starts-setup",

    actionStr,
    nextGameStateStr,
  }

  console.log("ADDING GAME ACTION", hostSetsUpGameSetupAction);
  await addGameHostAction(tableId, hostSetsUpGameSetupAction);

  return newGameTable;
}
