import { createBfgGameTableForAccessLevelNone, IBfgGameTableForHost, type IBfgGameTableForAccessLevelNone } from "./p2p-game-types";
import { useGameRoomWithUnknownAccessMode } from "./use-game-room-with-unknown-access-mode";
import { adaptToHostedGameRoom } from "./host/adapt-to-hosted-game-room";


export const useGameRoomAsHost = (): IBfgGameTableForHost | IBfgGameTableForAccessLevelNone => {

  const gameRoomUnknown = useGameRoomWithUnknownAccessMode();
  const gameRoom = adaptToHostedGameRoom(gameRoomUnknown);

  if (!gameRoom) {
    console.error('❌ Adapted game room for host not found');
    return createBfgGameTableForAccessLevelNone(gameRoomUnknown.gameInstanceId);
  }
  
  return gameRoom;
}
