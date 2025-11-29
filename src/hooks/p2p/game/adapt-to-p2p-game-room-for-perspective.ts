import type { IP2pRawRoomValue } from "./p2p-raw-room-context";
import { createUserGameRoomDataForNoAccess, UserGameRoomDataForPerspectiveSchema, type UserGameRoomDataForPerspective } from "./user-game-room-data";
import { type GameTableAccessAction } from "../../../models/internal/user-game-perspective";
import { convertGameTableAccessActionToGameTableAccessLevel } from "../../../models/internal/user-game-perspective-utils";


export const adaptToP2pGameRoomForPerspective = (
  rawP2pGameRoom: IP2pRawRoomValue,
  accessAction: GameTableAccessAction,
): UserGameRoomDataForPerspective => {

  const defaultUserGameRoomDataForNoAccess = createUserGameRoomDataForNoAccess(rawP2pGameRoom.gameInstanceId);
  
  const userGameRoomPerspectiveStr = rawP2pGameRoom.userGameRoomPerspectiveStr;
  if (!userGameRoomPerspectiveStr) {
    return defaultUserGameRoomDataForNoAccess;
  }

  const userGameRoomJson = JSON.parse(userGameRoomPerspectiveStr);
  const userGameRoomDataForPerspectiveParseResult = UserGameRoomDataForPerspectiveSchema.safeParse(userGameRoomJson);
  if (!userGameRoomDataForPerspectiveParseResult.success) {
    console.error('Error parsing user game room perspective:', userGameRoomDataForPerspectiveParseResult.error);
    return defaultUserGameRoomDataForNoAccess;
  }

  const userGameRoomDataForPerspective = userGameRoomDataForPerspectiveParseResult.data;

  // const userGameRoomPerspective = UserGameRoleSchema.safeParse(userGameRoomJson);
  // if (!userGameRoomPerspective.success) {
  //   console.error('Error parsing user game room perspective:', userGameRoomPerspective.error);
  //   return null;
  // }

  const accessLevelForAction = convertGameTableAccessActionToGameTableAccessLevel(accessAction);
  if (userGameRoomDataForPerspective.accessLevel !== accessLevelForAction) {
    console.error('User game room data role does not match requested action');
    console.error('[${accessAction}] vs [${userGameRoomDataForPerspective.accessLevel}]');
    return defaultUserGameRoomDataForNoAccess;
  }

  return userGameRoomDataForPerspective;

  // if (userGameRoomData.role !== rawP2pGameRoom.requestedRole) {
  //   console.error('User game room data role does not match requested role');
  //   console.error('[${rawP2pGameRoom.requestedRole}] vs [${userGameRoomData.role}]');
  //   return null;
  // }

  // const gameRoomDataJson = JSON.parse(userGameRoomData.stringifiedRoomState);
  // const gameRoomDataParseResult = GameRoomP2pSchema.safeParse(gameRoomDataJson);
  // if (!gameRoomDataParseResult.success) {
  //   console.error('Error parsing game room data:', gameRoomDataParseResult.error);
  //   return null;
  // }

  // const gameRoom = gameRoomDataParseResult.data;

  // const gameMetadata = getGameMetadata(gameRoom.gameTitle);
  // if (!gameMetadata) {
  //   console.error('Game metadata not found for game title:', gameRoom.gameTitle);
  //   return null;
  // }

  // const boardEventsJson = JSON.parse(userGameRoomData.stringifiedBoardTransitions);
  // const boardEventsParseResult = createBoardTransitionsArraySchema(gameMetadata.schemas).safeParse(boardEventsJson);
  // if (!boardEventsParseResult.success) {
  //   console.error('Error parsing board events:', boardEventsParseResult.error);
  //   return null;
  // }

  // const boardEvents = boardEventsParseResult.data;
  

  // if (userGameRoomData.role === 'host') {
  //   const hostGameHistory = boardEvents.map(convertGameBoardEventDbToHostP2p);
  //   const hydratedUserGameRoomData: UserGameRoomDataForPerspective = {
  //     gameInstanceId: userGameRoomData.gameInstanceId,
  //     role: 'host' as const,
  //     gameRoom,
  //     hostGameHistory,
  //   } satisfies UserGameRoomDataForPerspective;
  //   return hydratedUserGameRoomData;
  // }

  // if (userGameRoomData.role === 'watcher') {
  //   const watcherGameHistory = boardEvents.map(convertGameBoardEventDbToWatcherP2p);
  //   const hydratedUserGameRoomData: UserGameRoomDataForPerspective = {
  //     gameInstanceId: userGameRoomData.gameInstanceId,
  //     role: 'watcher' as const,
  //     gameRoom,
  //     watcherGameHistory,
  //   } satisfies UserGameRoomDataForPerspective;
  //   return hydratedUserGameRoomData;
  // }

  // if (userGameRoomData.role === 'player') {
  //   // For player role, we need to determine playerSeat from the gameRoom
  //   // Since we don't have the player profile ID in this context, we cannot determine the seat
  //   // This function may need to be refactored to accept player profile ID, or playerSeat should be included in UserGameRoomDataP2p
  //   console.error('Cannot determine playerSeat for player role without player profile ID');
  //   return null;
  // }

  // // This should never happen due to discriminated union
  // throw new Error('User game room data role does not match any valid role');
  
}
