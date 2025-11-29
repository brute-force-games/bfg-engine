import type { IP2pRawRoomValue } from "./p2p-raw-room-context";
import { createUserGameRoomDataForNoAccess, UserGameRoomDataForPerspectiveSchema, type UserGameRoomDataForPerspective } from "./user-game-room-data";


export const useGamePerspectiveDetailsFromRawP2pRoom = (
  p2pRawRoom: IP2pRawRoomValue,
): UserGameRoomDataForPerspective => {

  const { gameInstanceId, userGameRoomPerspectiveStr } = p2pRawRoom;

  if (!userGameRoomPerspectiveStr) {
    return createUserGameRoomDataForNoAccess(gameInstanceId);
  }

  const userGameRoomDataForPerspectiveParseResult = UserGameRoomDataForPerspectiveSchema
    .safeParse(userGameRoomPerspectiveStr);

  if (!userGameRoomDataForPerspectiveParseResult.success) {
    console.error('Error parsing user game room perspective:', userGameRoomDataForPerspectiveParseResult.error);
    console.error('Raw JSON string:', userGameRoomPerspectiveStr);
    return createUserGameRoomDataForNoAccess(gameInstanceId);
  }

  const userGameRoomDataForPerspective = userGameRoomDataForPerspectiveParseResult.data;
  console.log('🔍 Observer: Parsed game perspective details, role:', userGameRoomDataForPerspective.role);

  return userGameRoomDataForPerspective;
}
