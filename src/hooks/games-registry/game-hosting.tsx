import { createContext, useContext } from "react";
import { GameFriendId, GameTableId } from "~/models/types/bfg-branded-ids";
import { TrysteroConfig } from "~/p2p/trystero-config";


export interface GameHostingContextType {
  getTrysteroConfig(): TrysteroConfig;
  createJoinGameUrl: (gameTableId: GameTableId) => string;
  createFriendUrl: (friendId: GameFriendId) => string;
  createHostedGameUrl: (gameTableId: GameTableId) => string;
  createPlayerGameUrl: (gameTableId: GameTableId) => string;
}

export const GameHostingContext = createContext<GameHostingContextType>({
  getTrysteroConfig: () => {
    throw new Error('getTrysteroConfig not implemented');
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
