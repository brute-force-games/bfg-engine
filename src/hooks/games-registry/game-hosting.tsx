import { createContext, useContext } from "react";
import { GameFriendId, GameTableId } from "../../models/types/bfg-branded-ids";
import { TrysteroConfig } from "../../models/trystero-config";


export interface GameHostingContextType {
  getSiteTitle(): string;
  getTrysteroConfig(): TrysteroConfig;
  getBaseUrl(): string;
  createJoinGameUrl: (gameTableId: GameTableId) => string;
  createFriendUrl: (friendId: GameFriendId) => string;
  createHostedGameUrl: (gameTableId: GameTableId) => string;
  createPlayerGameUrl: (gameTableId: GameTableId) => string;
  createObserverGameUrl: (gameTableId: GameTableId) => string;
}

export const GameHostingContext = createContext<GameHostingContextType>({
  getSiteTitle: () => {
    throw new Error('getSiteTitle not implemented');
  },
  getTrysteroConfig: () => {
    throw new Error('getTrysteroConfig not implemented');
  },
  getBaseUrl: () => {
    throw new Error('getBaseUrl not implemented');
  },
  createJoinGameUrl: () => {
    throw new Error('createJoinGameUrl not implemented');
  },
  createFriendUrl: () => {
    throw new Error('createFriendUrl not implemented');
  },
  createHostedGameUrl: () => {
    throw new Error('createHostedGameUrl not implemented');
  },
  createPlayerGameUrl: () => {  
    throw new Error('createPlayerGameUrl not implemented');
  },
  createObserverGameUrl: () => {
    throw new Error('createObserverGameUrl not implemented');
  },
});


interface GameHostingProviderProps {
  children: React.ReactNode;
  gameHosting: GameHostingContextType;
}


export const GameHostingProvider = ({ children, gameHosting }: GameHostingProviderProps) => {
  
  return (
    <GameHostingContext.Provider
      value={gameHosting}
    >
      {children}
    </GameHostingContext.Provider>
  );
}


export const useGameHosting = () => {
  const gameHosting = useContext(GameHostingContext);
  return gameHosting;
}
