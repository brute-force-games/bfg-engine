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

  throw new Error(`Unknown game room mode for hosting: ${mode}`);
}
