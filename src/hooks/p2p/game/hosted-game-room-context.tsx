import { createContext, useContext } from "react";
import { type BfgGameInstanceId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { GameTableAccessLevel } from "@bfg-engine/models/internal/user-game-perspective";
import { useLatestHostedGameSnapshot, useLatestPerfectInformationGameJournal } from "../../../tb-store/games-archives-store";
import type { GameRoomDb } from "../../../models/tinybase/game-room-db";
import type { GameBoardEventForDb } from "../../../models/tinybase/game-board-event";
import type { BfgGameActionByHost, BfgGameActionByPlayer } from "../../../game-metadata/metadata-types/game-action-types";
import type { AllAssignedBfgGameStateForPlayers } from "../../../game-metadata/metadata-types/game-state-types";
import type { UserGameRoomDataForHost, UserGameRoomDataForWatcher } from "./user-game-room-data";
import { createAllPlayersGameRoomData, createHostGameRoomData, createWatcherGameRoomData } from "./hosted-game-room-context-utils";
import type { GameHostMode } from "./p2p-game-types";
import type { PerfectInformationGameJournal } from "../../../models/perspective-oriented/perfect-information/game-log";


export interface IHostedGameRoomValue {
  gameInstanceId: BfgGameInstanceId;
  requestedRole: GameTableAccessLevel;
  hostMode: GameHostMode;

  hostedGame: GameRoomDb;
  hostedGameBoardEvents: GameBoardEventForDb[];
  
  latestStepIndex: number;
  latestBoardEvent: GameBoardEventForDb;

  perfectInformationGameJournal: PerfectInformationGameJournal;
  hostGameData: UserGameRoomDataForHost;
  allPlayersGameData: AllAssignedBfgGameStateForPlayers;
  watcherGameData: UserGameRoomDataForWatcher;

  hostActions: {
    applyHostAction: (hostAction: BfgGameActionByHost) => Promise<void>;
  };

  playerActions: {
    applyPlayerAction: (playerAction: BfgGameActionByPlayer) => Promise<void>;
  };
}


export interface IHostedGameRoomContextProviderProps {
  gameInstanceId: BfgGameInstanceId;
  requestedRole: GameTableAccessLevel;
  hostMode: GameHostMode;
  children: React.ReactNode;
}

export const HostedGameRoomContext = createContext<IHostedGameRoomValue | null>(null);

export const HostedGameRoomContextProvider = ({ 
  gameInstanceId,
  requestedRole,
  hostMode,
  children 
}: IHostedGameRoomContextProviderProps) => {

  const hostedGameSnapshot = useLatestHostedGameSnapshot(gameInstanceId);
  const perfectInformationGameJournal = useLatestPerfectInformationGameJournal(gameInstanceId);

  // Always provide the context, even if data is missing
  // This allows observers to connect via P2P even when they don't have the hosted game locally
  if (!hostedGameSnapshot || !perfectInformationGameJournal) {
    if (!hostedGameSnapshot) {
      console.error('❌ Hosted game room snapshot not found');
    }
    if (!perfectInformationGameJournal) {
      console.error('❌ Perfect information game journal not found');
    }
    // Provide null context so components can handle missing data gracefully
    return (
      <HostedGameRoomContext.Provider value={null}>
        {children}
      </HostedGameRoomContext.Provider>
    );
  }

  const hostedGame = hostedGameSnapshot.gameRoom;
  const hostedGameBoardEvents = hostedGameSnapshot.boardEvents;

  const latestStepIndex = hostedGameBoardEvents.length - 1;
  const latestBoardEvent = hostedGameBoardEvents[latestStepIndex];

  const hostGameData = createHostGameRoomData(gameInstanceId, hostedGame, hostedGameBoardEvents);
  const allPlayersGameData = createAllPlayersGameRoomData(gameInstanceId, hostedGame, hostedGameBoardEvents);
  const watcherGameData = createWatcherGameRoomData(gameInstanceId, hostedGame, hostedGameBoardEvents);


  const retVal: IHostedGameRoomValue = {
    gameInstanceId,
    requestedRole,
    hostMode,

    hostedGame,
    hostedGameBoardEvents,
    latestStepIndex,
    latestBoardEvent,

    perfectInformationGameJournal,
    hostGameData,
    allPlayersGameData,
    watcherGameData,

    hostActions: {
      applyHostAction: async (hostAction: BfgGameActionByHost) => {
        console.log('🎮 Host received host action:', hostAction);
        console.warn("Implement me - apply host action");
      },
    },

    playerActions: {
      applyPlayerAction: async (playerAction: BfgGameActionByPlayer) => {
        console.log('🎮 Host received player action:', playerAction);
        console.warn("Implement me - apply player action");
      },
    },
  };

  return (
    <HostedGameRoomContext.Provider value={retVal}>
      {children}
    </HostedGameRoomContext.Provider>
  )
}


export const useHostedGameRoomContext = (): IHostedGameRoomValue => {
  const context = useContext(HostedGameRoomContext);
  if (!context) {
    throw new Error('useHostedGameRoomContext must be used within a HostedGameRoomContextProvider');
  }
  return context;
}

export const useHostedGameRoomContextOptional = (): IHostedGameRoomValue | null => {
  return useContext(HostedGameRoomContext);
}
