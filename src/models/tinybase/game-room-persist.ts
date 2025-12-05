import z from "zod";
import { BfgGameRoomIdToolbox, BfgGameTableIdToolbox } from "../types/bfg-branded-uuids";
import { BfgSupportedGameTitleSchema } from "../game-box-definition";
import { BfgPlayerProfileIdToolbox } from "../types/bfg-branded-uuids";
import { BfgPlayersSchema } from "../internal/game-room-base";
import { RoomPhaseEnumSchema } from "../internal/table-phase";


export const GameRoomPersistSchema = z.object({
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


export type GameRoomPersistFields = z.infer<typeof GameRoomPersistSchema>;

export type GameRoomPersist = GameRoomPersistFields;


export interface UpdatedGameTable<HostGameStateSchema extends z.ZodType = z.ZodType> {
  gameRoom: GameRoomPersist;
  gameState: z.infer<HostGameStateSchema>;
}
