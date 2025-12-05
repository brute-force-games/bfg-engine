import { z } from "zod";
import { BfgGameRoomIdToolbox } from "../../types/bfg-branded-uuids";
import { BfgGameRoomInstanceSchema, BfgGameRoomVersionSchema, BfgGameTableVersionSchema, createBfgGameTableLogSchema } from "../../types/bfg-versions";
import type { GenericGameMetadata } from "../../../game-metadata/games-registry";


// game table ID -> maps to a game history, which is a series of board events
// room ID -> maps to a game room, which has a series of game room versions
  // game room ID + room version number
  // game table ID + table version number
// game instant -> defined by a game room version and a game history version
// game instance ID - > identifies a particular game instant (latest game, latest version?)

// with perfect information record, which the host will have access to. Any version of game
// state and/or history can be adapted from it.
// Game choices are the only "unpredictables". Sources of unpredictability should be limited
// to features or agents defined in the game room.


export const FullGameInstanceIdSchema = z.object({
  gameRoomVersion: BfgGameRoomVersionSchema,
  gameTableVersion: BfgGameTableVersionSchema,
}).describe("FullGameInstanceId");
export type FullGameInstanceId = z.infer<typeof FullGameInstanceIdSchema>;


export const LatestRoomGameInstanceIdSchema = z.object({
  gameRoomId: BfgGameRoomIdToolbox.idSchema,
  gameTableVersion: BfgGameTableVersionSchema,
}).describe("LatestRoomGameInstanceId");
export type LatestRoomGameInstanceId = z.infer<typeof LatestRoomGameInstanceIdSchema>;


// export const hydrateLatestPerfectInformationGameJournalSchema = (gameRoomId: BfgGameRoomId) => {
//   const gameMetadata = getGameMetadata(gameRoomId);

//   const gameTitle = gameMetadata.gameTitle;

//   const BfgGameStepSchema = createBfgGameStepSchema(gameMetadata);

//   return z.object({
//     gameRoomHistory: z.array(BfgGameRoomInstanceSchema),
//     gameTableHistory: z.array(BfgGameStepSchema),
//   }).describe(`PerfectInformationGameJournal for ${gameTitle}`);
// };


export const createPerfectInformationGameJournalSchema = (
  gameMetadata: GenericGameMetadata,
) => {
  const gameTitle = gameMetadata.gameTitle;
  const GameTableLogSchema = createBfgGameTableLogSchema(gameMetadata.schemas);

  return z.object({
    gameRoomLog: z.array(BfgGameRoomInstanceSchema),
    gameTableLog: GameTableLogSchema,
  }).describe(`PerfectInformationGameJournal for ${gameTitle}`);
};
export type PerfectInformationGameJournal = z.infer<ReturnType<typeof createPerfectInformationGameJournalSchema>>;
