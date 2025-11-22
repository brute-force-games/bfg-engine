import z from "zod";
import { BfgGameRoomIdToolbox, BfgGameTableIdToolbox } from "../types/bfg-branded-uuids";
import { BfgSupportedGameTitleSchema } from "../game-box-definition";
import { BfgPlayerProfileIdToolbox } from "../types/bfg-branded-uuids";
import { BfgPlayersSchema } from "../internal/game-room-base";
import { RoomPhaseEnumSchema } from "../internal/table-phase";
import type { BfgGameStateForHost } from "../../game-metadata/metadata-types/game-state-types";


export const GameRoomDbSchema = z.object({
  id: BfgGameRoomIdToolbox.idSchema,
  gameTableId: BfgGameTableIdToolbox.idSchema,

  tableName: z.string(),
  // room host or game host? -> is the same for now
  gameHostPlayerProfileId: BfgPlayerProfileIdToolbox.idSchema,
  latestRoomStatusDescription: z.string(),
  latestRoomPhase: RoomPhaseEnumSchema,
  gameTitle: BfgSupportedGameTitleSchema,

  players: BfgPlayersSchema,

  // while a game is in progress, these fields are updated
  latestGameStepIndex: z.number(),
  latestGameStatusDescription: z.string(),

  createdAt: z.number(),
  lastUpdatedAt: z.number(),
});


export type GameRoomDbFields = z.infer<typeof GameRoomDbSchema>;

export type GameRoomDb = GameRoomDbFields;


export interface UpdatedGameRoom {
  gameRoom: GameRoomDb;
  gameState: BfgGameStateForHost;
}
