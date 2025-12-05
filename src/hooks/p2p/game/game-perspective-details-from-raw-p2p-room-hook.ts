import type { IP2pRawRoomValue } from "./p2p-raw-room-context";
import { createUserGameRoomDataForNoAccess, type UserGameRoomDataForPerspective } from "./user-game-room-data";
import { getGameMetadata } from "../../../game-metadata/games-registry";


export const useGamePerspectiveDetailsFromRawP2pRoom = (
  p2pRawRoom: IP2pRawRoomValue,
): UserGameRoomDataForPerspective => {

  const { gameInstanceId, userGameRoomPerspectiveStr } = p2pRawRoom;

  if (!userGameRoomPerspectiveStr) {
    return createUserGameRoomDataForNoAccess(gameInstanceId);
  }

  const userGameRoomJson = JSON.parse(userGameRoomPerspectiveStr);
  
  // First, extract the game title to get the appropriate metadata
  const gameTitle = userGameRoomJson?.gameRoom?.gameTitle;
  if (!gameTitle) {
    console.error('No game title found in user game room perspective');
    return createUserGameRoomDataForNoAccess(gameInstanceId);
  }

  const gameMetadata = getGameMetadata(gameTitle);
  if (!gameMetadata) {
    console.error('Game metadata not found for game title:', gameTitle);
    return createUserGameRoomDataForNoAccess(gameInstanceId);
  }

  // Use the game's schema for user game room perspective
  const userGameRoomDataForPerspectiveParseResult = gameMetadata.schemas.userGameRoomDataForPerspectiveSchema
    .safeParse(userGameRoomJson);

  if (!userGameRoomDataForPerspectiveParseResult.success) {
    console.error('Error parsing user game room perspective:', userGameRoomDataForPerspectiveParseResult.error);
    console.error('Raw JSON string:', userGameRoomPerspectiveStr);
    return createUserGameRoomDataForNoAccess(gameInstanceId);
  }

  const userGameRoomDataForPerspective = userGameRoomDataForPerspectiveParseResult.data;
  console.log('🔍 Observer: Parsed game perspective details, role:', userGameRoomDataForPerspective.role);

  return userGameRoomDataForPerspective;
}
