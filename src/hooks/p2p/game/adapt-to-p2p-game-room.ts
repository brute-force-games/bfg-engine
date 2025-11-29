// import type { IP2pRawRoomValue } from "./p2p-raw-room-context";
// import type { IP2pGameRoomValue } from "./p2p-game-room-hook";
// import { UserGameRoomDataP2pSchema, type UserGameRoomDataForPerspective } from "./user-game-room-data";
// import { createHydratedLatestGameSnapshotFromStringifiedData } from "../../../models/internal/game-room-snapshot";
// import { GameRoomP2pSchema } from "../../../models/p2p/game-room-p2p";


// export const adaptToP2pGameRoom = (
//   rawP2pGameRoom: IP2pRawRoomValue,
// ): IP2pGameRoomValue => {
  
//   const getGameRoom = () => {
//     const userGameRoomDataStr = rawP2pGameRoom.userGameRoomPerspectiveStr;
//     if (!userGameRoomDataStr) {
//       return null;
//     }


//     // const hydratedLatestGameSnapshot = createHydratedLatestGameSnapshotFromStringifiedData(userGameRoomDataStr);
  
//     const userGameRoomJson = JSON.parse(userGameRoomDataStr);
//     const userGameRoomData = UserGameRoomDataP2pSchema.parse(userGameRoomJson);

//     const gameRoomDataJson = JSON.parse(userGameRoomData.stringifiedRoomState);
//     const gameRoomDataParseResult = GameRoomP2pSchema.safeParse(gameRoomDataJson);
//     if (!gameRoomDataParseResult.success) {
//       console.error('Error parsing game room data:', gameRoomDataParseResult.error);
//       return null;
//     }
//     // const gameRoomData = gameRoomDataParseResult.data;

//     // const hydratedGameSnapshot = createHydratedLatestGameSnapshotFromStringifiedData(
//     //   gameRoom.stringifiedRoomState,
//     //   gameEvent.stringifiedBoardTransitions,
//     // );

//     const hydratedGameSnapshot = createHydratedLatestGameSnapshotFromStringifiedData(
//       userGameRoomData.stringifiedRoomState,
//       userGameRoomData.stringifiedBoardTransitions
//     );

//     const hydratedUserGameRoomData: UserGameRoomDataForPerspective = {
//       ...userGameRoomData,
//       // myGameState: hydratedGameSnapshot,
//       gameRoom: hydratedGameSnapshot.gameRoom,
//       boardEvents: hydratedGameSnapshot.boardEvents,
//       latestStepIndex: hydratedGameSnapshot.latestStepIndex,
//     } satisfies UserGameRoomDataForPerspective;

//     return hydratedUserGameRoomData;

//     // return hydratedGameSnapshot;

//     // const gameHistoryJson = JSON.parse(userGameRoomData.stringifiedGameHistory);
//     // const gameHistoryParseResult = GameHistoryP2pSchema.safeParse(gameHistoryJson);
//     // if (!gameHistoryParseResult.success) {
//     //   console.error('Error parsing game history:', gameHistoryParseResult.error);
//     //   return null;
//     // }
//     // const gameHistory = gameHistoryParseResult.data;

//     // const retVal: HydratedLatestGameSnapshot = {
//     //   gameRoom: gameRootData,
//     //   boardEvents: gameHistory.gameEvents,
//     //   latestStepIndex: gameHistory.gameEvents.length - 1,
//     // };
//     // return retVal;
//     // return userGameRoomData.myGameState;
//   }

//   const userGameRoom = getGameRoom();
//   // const userGameRoom: UserGameRoomDataForPerspective = {
    
//   // }

//   const retVal: IP2pGameRoomValue = {
//     gameInstanceId: rawP2pGameRoom.gameInstanceId,
//     requestedAction: rawP2pGameRoom.requestedAction,
//     connectionStatus: rawP2pGameRoom.connectionStatus,
//     connectionEvents: rawP2pGameRoom.connectionEvents,
//     userGameRoom,
//   };

//   return retVal;
// }
