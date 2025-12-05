import type { GenericGameMetadata } from "../../../game-metadata/games-registry";
import { useGameRegistry } from "../../../hooks/games-registry/games-registry-hook";
import { ALL_PLAYER_SEATS } from "../../internal/game-room-base";
import { ROOM_PHASE_GAME_IN_PROGRESS } from "../../internal/table-phase";
import type { GameLobby } from "../../p2p-lobby";
import type { GameRoomPersist } from "../../tinybase/game-room-persist";
import type { BfgGameRoomId, BfgGameTableId } from "../../types/bfg-branded-uuids";
import type { BfgGameRoomInstance, BfgGameRoomVersionIndex, BfgGameStep, BfgGameStepIndex, BfgGameTableLog, BfgTimestamp } from "../../types/bfg-versions";
import { type PerfectInformationGameJournal } from "./game-log";



const createNewGameRoomFromGameSpecificState = (
  lobbyState: GameLobby,
  newGameRoomId: BfgGameRoomId,
  newGameTableId: BfgGameTableId,
): GameRoomPersist => {

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

  const players = playerPool.map((player, index) => {
    const role = ALL_PLAYER_SEATS[index];
    const retVal = {
      role,
      playerProfileId: player.id,
      playerProfile: player,
    }
    return retVal;
  });

  const playerCount = playerPool.length;

  const retVal: GameRoomPersist = {
    id: newGameRoomId,
    gameTableId: newGameTableId,

    latestGameStepIndex: 0,
    latestRoomStatusDescription: `${playerCount} playing ${gameTitle}`,
    latestGameStatusDescription: `Game setup in progress: ${lobbyState.lobbyName} [${gameTitle}]`,
    latestRoomPhase: ROOM_PHASE_GAME_IN_PROGRESS,
    createdAt: now,
    lastUpdatedAt: now,
    players,
    gameTitle,
    tableName: lobbyState.lobbyName,
    gameHostPlayerProfileId: lobbyState.gameHostPlayerProfile.id,
  }

  return retVal;
}


const createInitialGameTableLogEntry = (
  lobbyState: GameLobby,
  gameMetadata: GenericGameMetadata,
) => {
  const gameProcessor = gameMetadata.gameProcessor;

  const startGameAction = gameProcessor.createHostStartsGameAction(lobbyState);
  const startGameOutcome = gameProcessor.createHostOpensGameOutcome(startGameAction);
  const startGameState = gameProcessor.createHostOpensGameState(startGameAction);

  const now = Date.now() as BfgTimestamp;
  const stepIndex = 0 as BfgGameStepIndex;

  const initialGameStep: BfgGameStep = {
    createdAt: now,
    stepIndex,
    event: startGameAction,
    outcome: startGameOutcome,
    nextBoardState: startGameState,
  };

  return initialGameStep;
};


export const createNewPerfectInformationGameJournal = (
  lobbyState: GameLobby,
  newGameRoomId: BfgGameRoomId,
  newGameTableId: BfgGameTableId,
): PerfectInformationGameJournal => {

  if (!lobbyState.gameTitle) {
    throw new Error("Game title is required");
  }

  const gameRegistry = useGameRegistry();
  const gameTitle = lobbyState.gameTitle;
  const gameMetadata = gameRegistry.getGameMetadata(gameTitle);

  const newGameRoom = createNewGameRoomFromGameSpecificState(lobbyState, newGameRoomId, newGameTableId);

  const initialGameTableLogEntry = createInitialGameTableLogEntry(lobbyState, gameMetadata);

  const newGameRoomVersion: BfgGameRoomInstance = {
    roomVersion: {
      roomId: newGameRoomId,
      stepIndex: 0 as BfgGameRoomVersionIndex,
    },
    roomData: newGameRoom,
  };


  const gameTableLog: BfgGameTableLog = {
    gameTableId: newGameTableId,
    gameTitle: gameTitle,
    history: [initialGameTableLogEntry],
  };
  
  const newGameJournal: PerfectInformationGameJournal = {
    gameRoomLog: [newGameRoomVersion],
    gameTableLog,
  };

  return newGameJournal;
};
