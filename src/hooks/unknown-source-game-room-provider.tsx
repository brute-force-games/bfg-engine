import { createContext } from "react";
import type { GameTableAccessAction } from "../models/internal/user-game-perspective";
import type { BfgGameInstanceId } from "../models/types/bfg-branded-uuids";
import { useHostedGameRoomContextOptional, type IHostedGameRoomValue } from "./p2p/game/hosted-game-room-context";
import { useP2pRawRoomContext, type IP2pRawRoomValue } from "./p2p/game/p2p-raw-room-context";


export interface IUnknownSourceGameRoomProviderProps {
  gameInstanceId: BfgGameInstanceId;
  requestedAction: GameTableAccessAction;
  children: React.ReactNode;
}

export type GameRoomStatus = 'loading' | 'ready' | 'error';

export interface IUnknownSourceGameRoomValue {
  gameInstanceId: BfgGameInstanceId;
  requestedAction: GameTableAccessAction;
  gameRoomStatus: GameRoomStatus;

  roomFromHost: IHostedGameRoomValue | null;
  rawRoomFromP2p: IP2pRawRoomValue | null;
}

export const UnknownSourceGameRoomContext = createContext<IUnknownSourceGameRoomValue | null>(null);

export const UnknownSourceGameRoomProvider = ({ 
  gameInstanceId,
  requestedAction,
  children 
}: IUnknownSourceGameRoomProviderProps) => {

  const roomFromHost = useHostedGameRoomContextOptional();
  const rawRoomFromP2p = useP2pRawRoomContext();

  // if (roomFromHost === null && rawRoomFromP2p === null) {
  //   const retVal: GameRoomModeUnavailableAccess = {
  //     gameInstanceId,
  //     accessMode: 'unavailable',
  //     requestedAction,
  //   };
  //   return retVal;
  // }

  // if (roomFromHost !== null && rawRoomFromP2p !== null) {
  //   const retVal: GameRoomModeHostPlusP2pAccess = {
  //     gameInstanceId,
  //     accessMode: 'host+p2p',
  //     hostedGameRoom: roomFromHost,
  //     p2pRawRoom: rawRoomFromP2p,
  //   };
  //   return retVal;
  // }

  // if (roomFromHost === null) {
  //   if (rawRoomFromP2p === null) {
  //     throw new Error('No game room sources found');
  //   }
    
  //   const retVal: GameRoomModeP2pOnlyAccess = {
  //     gameInstanceId: rawRoomFromP2p.gameInstanceId,
  //     accessMode: 'p2p-only',
  //     p2pRawRoom: rawRoomFromP2p,
  //   };

  //   return retVal;
  // }

  // const gameInstanceId = ensureAllValuesAgree(
  //   'Game instance IDs from hosted game room and P2P raw room must agree',
  //   roomFromHost?.gameInstanceId,
  //   rawRoomFromP2p?.gameInstanceId);

  // if (rawRoomFromP2p === null || roomFromHost.hostMode === 'host-only') {
  //   const retVal = {
  //     gameInstanceId: roomFromHost.gameInstanceId,
  //     accessMode: 'host-only',
  //     hostedGameRoom: roomFromHost,
  //   } satisfies GameRoomModeHostOnlyAccess;

  //   return retVal;
  // }

  // if (roomFromHost.hostMode === 'host+p2p') {
  //   const retVal: GameRoomModeHostPlusP2pAccess = {
  //     gameInstanceId,
  //     accessMode: 'host+p2p',
  //     hostedGameRoom: roomFromHost,
  //     p2pRawRoom: rawRoomFromP2p,
  //   } satisfies GameRoomModeHostPlusP2pAccess;
  //   return retVal;
  // }

  const retVal: IUnknownSourceGameRoomValue = {
    gameRoomStatus: 'loading',
    gameInstanceId,
    requestedAction,
    roomFromHost,
    rawRoomFromP2p,
  }

  return (
    <UnknownSourceGameRoomContext.Provider value={retVal}>
      {/* <HostedGameRoomContextProvider
        gameInstanceId={gameInstanceId}
        requestedRole="observer"
        hostMode="host+p2p"
      > */}
        {children}
      {/* </HostedGameRoomContextProvider> */}
    </UnknownSourceGameRoomContext.Provider>
  )
}
