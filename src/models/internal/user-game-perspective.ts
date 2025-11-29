import z from "zod";
import { GameTableSeatSchema } from "../..";


export const GTAL_NONE = 'none' as const;
export const GTAL_HOST = 'host' as const;
export const GTAL_PLAYER = 'player' as const;
export const GTAL_OBSERVER = 'observer' as const;

export const GameTableAccessLevelSchema = z.enum([
  GTAL_HOST,
  GTAL_PLAYER,
  GTAL_OBSERVER,
  GTAL_NONE,
]);
export type GameTableAccessLevel = z.infer<typeof GameTableAccessLevelSchema>;

export const GameTableAccessActionSchema = z.enum([
  'watch',
  'play',
  'host',
]);
export type GameTableAccessAction = z.infer<typeof GameTableAccessActionSchema>;


// export const UserGameRoleEnumSchema = z.enum(['host', 'player', 'watcher']);
// export type UserGameRole = z.infer<typeof UserGameRoleEnumSchema>;


export const UserGameRoleBaseSchema = z.object({
  accessLevel: GameTableAccessLevelSchema,
});
export type UserGameRoleBase = z.infer<typeof UserGameRoleBaseSchema>;


export const UserGameRoleForHostSchema = UserGameRoleBaseSchema.extend({
  accessLevel: z.literal('host'),
});
export type UserGameRoleForHost = z.infer<typeof UserGameRoleForHostSchema>;

export const UserGameRoleForPlayerSchema = UserGameRoleBaseSchema.extend({
  accessLevel: z.literal('player'),
  playerSeat: GameTableSeatSchema,
});
export type UserGameRoleForPlayer = z.infer<typeof UserGameRoleForPlayerSchema>;

export const UserGameRoleForWatcherSchema = UserGameRoleBaseSchema.extend({
  accessLevel: z.literal('observer'),
});
export type UserGameRoleForWatcher = z.infer<typeof UserGameRoleForWatcherSchema>;


export const UserGameRoleSchema = z.discriminatedUnion('accessLevel', [
  UserGameRoleForHostSchema,
  UserGameRoleForPlayerSchema,
  UserGameRoleForWatcherSchema,
]);
export type UserGameRole = z.infer<typeof UserGameRoleSchema>;





// export const UserGameHistorySchema = z.object({
//   gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
//   gameRoomId: BfgGameRoomIdToolbox.idSchema,
//   gameTableId: BfgGameTableIdToolbox.idSchema,
//   boardEvents: createBoardTransitionsArraySchema(schemas),
// });
// export type UserGameHistory = z.infer<typeof UserGameHistorySchema>;
