import { createContext, useContext } from "react";
import type { BfgGameInstanceId, BfgGameRoomId, BfgGameTableId } from "../../../models/types/bfg-branded-uuids";
import type { GameTableAccessLevel } from "../../../models/internal/user-game-perspective";


export interface GameRoomForMyUserContextValue {
  gameRoomId: BfgGameRoomId;
  gameTableId: BfgGameTableId;
  gameInstanceId: BfgGameInstanceId;
  requestedRole: GameTableAccessLevel;
}

export const GameRoomForMyUserContext = createContext<GameRoomForMyUserContextValue | null>(null);


export interface GameRoomForMyUserContextProviderProps {
  gameRoomId: BfgGameRoomId;
  gameTableId: BfgGameTableId;
  gameInstanceId: BfgGameInstanceId;
  requestedRole: GameTableAccessLevel;

  children: React.ReactNode;
}


export const GameRoomForMyUserContextProvider = (props: GameRoomForMyUserContextProviderProps) => {
  const { gameRoomId, gameTableId, gameInstanceId, requestedRole, children } = props;
  
  const context: GameRoomForMyUserContextValue = {
    gameRoomId,
    gameTableId,
    gameInstanceId,
    requestedRole,
  }
  
  return (
    <GameRoomForMyUserContext.Provider value={context}>
      {children}
    </GameRoomForMyUserContext.Provider>
  );
}


export const useMyUserGameRoomContext = () => {
  const context = useContext(GameRoomForMyUserContext);
  if (!context) {
    throw new Error('useGameRoomForUser must be used within a GameRoomForUserContextProvider');
  }
  return context;
}
