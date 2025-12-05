import { type IBfgGameTableForHost, type IBfgGameTableForUnknown } from "../p2p-game-types";
import { adaptToHostedGameRoomNoP2p } from "./adapt-to-hosted-game-room-no-p2p";
import { adaptToHostedGameRoomWithP2p } from "./adapt-to-hosted-game-room-with-p2p";


export const adaptToHostedGameRoom = (gameRoomUnknown: IBfgGameTableForUnknown): IBfgGameTableForHost | null => {

  const { accessMode: mode } = gameRoomUnknown;
  
  if (mode === 'host-only') {
    const adaptedForHost = adaptToHostedGameRoomNoP2p(gameRoomUnknown);
    return adaptedForHost;
  }

  if (mode === 'host+p2p') {
    const adaptedForHost = adaptToHostedGameRoomWithP2p(gameRoomUnknown);
    return adaptedForHost;
  }

  // For 'p2p-only' mode, there's no hosted game room available
  // The user is only accessing via P2P without hosting locally
  if (mode === 'p2p-only') {
    return null;
  }

  // For 'unavailable' mode, also return null
  if (mode === 'unavailable') {
    return null;
  }

  throw new Error(`Unknown game room mode for hosting: ${mode}`);
}
