import { type GameRoomModeHostOnlyAccess, type GameRoomModeHostPlusP2pAccess, type GameRoomModeP2pOnlyAccess, type GameRoomModeWithAccess } from "./p2p-game-types";
import { ensureAllValuesAgree } from "../../../game-stock/mechanics/utils";
import { useGameRoomSources } from "./use-game-room-sources";


export const useGameRoomWithUnknownAccessMode = (): GameRoomModeWithAccess => {

  const gameRoomSources = useGameRoomSources();

  const { roomFromHost, rawRoomFromP2p } = gameRoomSources;

  if (roomFromHost === null) {
    if (rawRoomFromP2p === null) {
      throw new Error('No game room sources found');
    }
    
    const retVal: GameRoomModeP2pOnlyAccess = {
      gameInstanceId: rawRoomFromP2p.gameInstanceId,
      accessMode: 'p2p-only',
      p2pRawRoom: rawRoomFromP2p,
    };

    return retVal;
  }

  const gameInstanceId = ensureAllValuesAgree(
    'Game instance IDs from hosted game room and P2P raw room must agree',
    roomFromHost?.gameInstanceId,
    rawRoomFromP2p?.gameInstanceId);

  if (rawRoomFromP2p === null || roomFromHost.hostMode === 'host-only') {
    const retVal = {
      gameInstanceId: roomFromHost.gameInstanceId,
      accessMode: 'host-only',
      hostedGameRoom: roomFromHost,
    } satisfies GameRoomModeHostOnlyAccess;

    return retVal;
  }

  if (roomFromHost.hostMode === 'host+p2p') {
    const retVal: GameRoomModeHostPlusP2pAccess = {
      gameInstanceId,
      accessMode: 'host+p2p',
      hostedGameRoom: roomFromHost,
      p2pRawRoom: rawRoomFromP2p,
    } satisfies GameRoomModeHostPlusP2pAccess;
    return retVal;
  }

  throw new Error(`Unknown game room mode for hosting: ${roomFromHost.hostMode}`);
}
