import { z } from "zod";
import { type BfgGameInstanceId } from "../../../models/types/bfg-branded-uuids";
// import { UserGameRoleBaseSchema, UserGameRoleForPlayerSchema, GTAL_NONE } from "../../../models/internal/user-game-perspective";
import { GameRoomP2pSchema } from "../../../models/p2p/game-room-p2p";
import { UserGameRoleBaseSchema, UserGameRoleForPlayerSchema, GTAL_NONE } from "../../../game-metadata/metadata-types";


export const UserGameRoomRoleSchema = z.enum(['host', 'play', 'watch']);


// const UserGameRoomDataBaseSchema = z.object({
const UserGameRoomDataBaseSchema = UserGameRoleBaseSchema.extend({
  // gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
  // gameRole: UserGameRoleSchema,
  // gameRoom: GameRoomP2pSchema,
});
export type UserGameRoomDataBase = z.infer<typeof UserGameRoomDataBaseSchema>;


// export const UserGameRoomDataForHostSchema = UserGameRoomDataBaseSchema.extend({
//   role: z.literal('host'),
//   gameRoom: GameRoomP2pSchema,
//   hostGameHistory: GameTableEventForHostP2pSchema.array(),
// });
// export type UserGameRoomDataForHost = z.infer<typeof UserGameRoomDataForHostSchema>;



export const createUserGameRoomDataForPlayerSchema = (
  playerGameEventOutcomePerspectiveSchema: z.ZodType,
  playerGameStatePerspectiveSchema: z.ZodType,
) => {
  const playerPerspectiveGameStepSchema = z.object({
    outcome: playerGameEventOutcomePerspectiveSchema,
    nextBoardState: playerGameStatePerspectiveSchema,
  }).describe(`PlayerPerspectiveGameStep`);

  const UserGameRoomDataForPlayerSchema = UserGameRoomDataBaseSchema.extend({
    role: z.literal('player'),
    playerSeat: UserGameRoleForPlayerSchema.shape.playerSeat,
    gameRoom: GameRoomP2pSchema,
    playerGameHistory: playerPerspectiveGameStepSchema.array(),
  });

  return UserGameRoomDataForPlayerSchema;
}
export type UserGameRoomDataForPlayer = z.infer<ReturnType<typeof createUserGameRoomDataForPlayerSchema>>;
export type PlayerPerspectiveGameStepSchema = ReturnType<typeof createUserGameRoomDataForPlayerSchema>['shape']['playerGameHistory']['element'];
export type PlayerPerspectiveGameStep = z.infer<PlayerPerspectiveGameStepSchema>;
// export const UserGameRoomDataForPlayerSchema = z.infer<typeof UserGameRoomDataForPlayerSchema>;


export const createUserGameRoomDataForWatcherSchema = (
  watcherGameEventOutcomePerspectiveSchema: z.ZodType,
  watcherGameStatePerspectiveSchema: z.ZodType,
) => {
  const watcherPerspectiveGameStepSchema = z.object({
    outcome: watcherGameEventOutcomePerspectiveSchema,
    nextBoardState: watcherGameStatePerspectiveSchema,
  }).describe(`WatcherPerspectiveGameStep`);

  const UserGameRoomDataForWatcherSchema = UserGameRoomDataBaseSchema.extend({
    role: z.literal('watcher'),
    gameRoom: GameRoomP2pSchema,
    watcherGameHistory: watcherPerspectiveGameStepSchema.array(),
  });

  return UserGameRoomDataForWatcherSchema;
}
export type UserGameRoomDataForWatcherSchema = ReturnType<typeof createUserGameRoomDataForWatcherSchema>;
export type UserGameRoomDataForWatcher = z.infer<ReturnType<typeof createUserGameRoomDataForWatcherSchema>>;
export type WatcherPerspectiveGameStep = z.infer<ReturnType<typeof createUserGameRoomDataForWatcherSchema>>['watcherGameHistory'][number];


// export const UserGameRoomDataForPlayerSchema = UserGameRoomDataBaseSchema.extend({
//   role: z.literal('player'),
//   playerSeat: UserGameRoleForPlayerSchema.shape.playerSeat,
//   gameRoom: GameRoomP2pSchema,
//   playerGameHistory: GameTableEventForPlayerP2pSchema.array(),
// });
// export type UserGameRoomDataForPlayer = z.infer<typeof UserGameRoomDataForPlayerSchema>;


// export const UserGameRoomDataForWatcherSchema = UserGameRoomDataBaseSchema.extend({
//   role: z.literal('watcher'),
//   gameRoom: GameRoomP2pSchema,
//   watcherGameHistory: GameTableEventForWatcherP2pSchema.array(),
// });
// export type UserGameRoomDataForWatcher = z.infer<typeof UserGameRoomDataForWatcherSchema>;


export const UserGameRoomDataForNoAccessSchema = UserGameRoomDataBaseSchema.extend({
  role: z.literal('no-access'),
});
export type UserGameRoomDataForNoAccess = z.infer<typeof UserGameRoomDataForNoAccessSchema>;


export const createUserGameRoomDataForPerspectiveSchema = (
  userGameRoomDataForPlayerSchema: ReturnType<typeof createUserGameRoomDataForPlayerSchema>,
  userGameRoomDataForWatcherSchema: ReturnType<typeof createUserGameRoomDataForWatcherSchema>,
) => {
  // const userGameRoomDataForPlayerSchema = createUserGameRoomDataForPlayerSchema(userGameRoomDataForPlayerSchema);
  // const userGameRoomDataForWatcherSchema = createUserGameRoomDataForWatcherSchema(userGameRoomDataForWatcherSchema);

  const UserGameRoomDataForPerspectiveSchema = z.discriminatedUnion('role', [
    userGameRoomDataForPlayerSchema,
    userGameRoomDataForWatcherSchema,
    UserGameRoomDataForNoAccessSchema,
  ]);
  return UserGameRoomDataForPerspectiveSchema;
}
export type UserGameRoomDataForPerspective = z.infer<ReturnType<typeof createUserGameRoomDataForPerspectiveSchema>>;

// export const UserGameRoomDataForPerspectiveSchema = z.discriminatedUnion('role', [
//   // UserGameRoomDataForHostSchema,
//   UserGameRoomDataForPlayerSchema,
//   UserGameRoomDataForWatcherSchema,
//   UserGameRoomDataForNoAccessSchema,
// ]);
// export type UserGameRoomDataForPerspective = z.infer<typeof UserGameRoomDataForPerspectiveSchema>;


// export type UserGameRoomDataForPerspective = 
//   | UserGameRoomDataForHost
//   | UserGameRoomDataForPlayer
//   | UserGameRoomDataForWatcher;


// export type UserGameRoomDataForHost = UserGameRoomDataBase & {
//   myGameRole: 'host';
//   myGameState: BfgGameStateForHost;
//   hostGameHistory: GameTableEventForHostP2p[];
// };

// export type UserGameRoomDataForPlayer = UserGameRoomDataBase & {
//   myGameRole: 'play';
//   playerSeat: GameTableSeat;
//   myGameState: BfgGameStateForPlayer;
//   playerGameHistory: GameTableEventForPlayerP2p[];
// };

// export type UserGameRoomDataForWatcher = UserGameRoomDataBase & {
//   myGameRole: 'watch';
//   myGameState: BfgGameStateForWatcher;
//   watcherGameHistory: GameTableEventForWatcherP2p[];
// };

// export type UserGameRoomData = 
//   | UserGameRoomDataForHost
//   | UserGameRoomDataForPlayer
//   | UserGameRoomDataForWatcher;

// export const UserGameRoomDataSchema = z.discriminatedUnion('role', [
//   UserGameRoomDataForHostSchema,
//   UserGameRoomDataForPlayerSchema,
//   UserGameRoomDataForWatcherSchema,
// ]);
// export type UserGameRoomData = z.infer<typeof UserGameRoomDataSchema>;


// export const UserGameRoomDataP2pSchema = z.object({
//   gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
//   // gameRole: UserGameRoleSchema,
//   role: UserGameRoleSchema,
//   stringifiedRoomState: z.string(),
//   stringifiedBoardTransitions: z.string(),
// });
// export type UserGameRoomDataP2p = z.infer<typeof UserGameRoomDataP2pSchema>;


// export const createUserGameRoomDataP2p = (userGameRoomData: UserGameRoomData) => {
//   return UserGameRoomDataP2pSchema.parse({
//     gameInstanceId: userGameRoomData.gameInstanceId,
//     gameRole: userGameRoomData.myGameRole,
//     stringifiedGameRoomData: JSON.stringify(userGameRoomData.gameRoom),
//     stringifiedGameHistory: JSON.stringify(userGameRoomData.gameHistory),
//   });
// };


export const createUserGameRoomDataForNoAccess = (_gameInstanceId: BfgGameInstanceId): UserGameRoomDataForNoAccess => {
  const retVal: UserGameRoomDataForNoAccess = {
    accessLevel: GTAL_NONE,
    // gameInstanceId: gameInstanceId,
    role: 'no-access' as const,
  };

  return retVal;
};
