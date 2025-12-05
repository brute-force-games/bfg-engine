import { ALL_PLAYER_SEATS } from "../../models/internal/game-room-base";
import { ROOM_PHASE_GAME_IN_PROGRESS } from "../../models/internal/table-phase";
import type { GameLobby } from "../../models/p2p-lobby";
import type { GameRoomPersist } from "../../models/tinybase/game-room-persist";
import type { BfgGameInstanceId, BfgGameRoomId, BfgGameTableId } from "../../models/types/bfg-branded-uuids";
import type { BfgTimestamp } from "../../models/types/bfg-versions";
import { NewGamesRegistry, type INewGameRegistry } from "../new-game-registry/new-game-registry";
import type { IPersistenceOps } from "../new-persistence-ops/persistence-ops";
import { LocalTbPersistenceOps } from "../new-persistence-ops/local-tb-persistence-ops";
import { GameStepPersist } from "@bfg-engine/models/persist/game-step-persist";
import { GameTablePersist } from "../new-persistence-ops/tb-store/sqlite-persistence-helpers";


export type UpdatedGameTable = {
  gameRoom: GameRoomPersist;
  gameStep: GameStepPersist;
}


export interface INewHostOps {
  gameRegistry: INewGameRegistry;

  startNewGame: (
    gameLobby: GameLobby,
    gameInstanceId: BfgGameInstanceId,
    gameRoomId: BfgGameRoomId,
    gameTableId: BfgGameTableId,
  ) => 
    Promise<UpdatedGameTable>;

  continueGame: (
    latestGameTable: GameTablePersist,
    hostEvents: GameTableEvent[],
    playerEvents: GameTableEvent[],
  ) => Promise<UpdatedGameTable>;

  gatherGameEvents(latestGameTable: { success: boolean; gameTable?: GameTablePersist; error?: string; }): any;
}


interface INewHostOpsDependencies {
  gameRegistry: INewGameRegistry;
  persistenceOps: IPersistenceOps;
}


const createNewHostOps = (dependencies: INewHostOpsDependencies): INewHostOps => {
  const { gameRegistry } = dependencies;

  const retVal: INewHostOps = {
    gameRegistry,
    
    async startNewGame<GameStep>(
      gameLobby: GameLobby, 
      gameInstanceId: BfgGameInstanceId, 
      gameRoomId: BfgGameRoomId, 
      gameTableId: BfgGameTableId,
    ): Promise<UpdatedGameTable> {

      const gameTitle = gameLobby.gameTitle;
      if (!gameTitle) {
        throw new Error("Game title not found");
      }

      // const newGameRoom = createNewGameRoomFromGameSpecificState(gameLobby, gameRoomId, gameTableId);
      const now = Date.now() as BfgTimestamp;

      // Validate lobby has at least 1 player
      const playerPool = gameLobby.playerPool;
      if (playerPool.length < 1) {
        throw new Error("Lobby must have at least 1 player");
      }

      const players = playerPool.map((player, index) => {
        const role = ALL_PLAYER_SEATS[index];
        const retVal = {
          role,
          playerName: player.handle,
          playerProfileId: player.id,
          playerProfile: player,
        }
        return retVal;
      });

      const playerCount = playerPool.length;

      // Fill out p1-p8 from the lobby player pool array
      const newGameRoom: GameRoomPersist = {
        id: gameRoomId,
        gameTableId,
        latestGameStepIndex: 0,
        latestRoomStatusDescription: `${playerCount} playing ${gameTitle}`,
        latestGameStatusDescription: `Game setup in progress: ${gameLobby.lobbyName} [${gameTitle}]`,
        latestRoomPhase: ROOM_PHASE_GAME_IN_PROGRESS,
        createdAt: now,
        lastUpdatedAt: now,
        players,
        gameTitle,
        tableName: gameLobby.lobbyName,
        gameHostPlayerProfileId: gameLobby.gameHostPlayerProfile.id,
      }

      const metadata = gameRegistry.getGameMetadata(gameTitle);
      const gameProcessor = metadata.gameProcessor;
      // const gameSchemas = metadata.myGameSchemas;

      const initializeGameAction = metadata.myGameActions.find(action =>
        action.actionSource.source === 'host' &&
        action.actionType === metadata.hostStartsGameActionType);

      if (!initializeGameAction) {
        throw new Error(`No initialize game action found for game ${gameTitle}`);
      }

      const startGameStep = gameProcessor.bfgInitializeGame(gameLobby);

      const retVal: UpdatedGameTable = {
        gameRoom: newGameRoom,
        gameStep: startGameStep,
      };

      return retVal;
    },

    async continueGame(latestGameTable: GameTablePersist, hostEvents: GameTableEvent[], playerEvents: GameTableEvent[]): Promise<UpdatedGameTable> {
      const { gameInstanceId, gameRoomId, gameTableId } = gameIdentifiers;

      const gameTable = await persistenceOps.getLatestGameTable(gameInstanceId, gameRoomId, gameTableId);
    },
  }

  return retVal;
}


export const NewHostOps = createNewHostOps({
  gameRegistry: NewGamesRegistry,
  persistenceOps: LocalTbPersistenceOps,
});
