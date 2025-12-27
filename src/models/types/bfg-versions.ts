import { z } from "zod";
import { BfgGameRoomIdToolbox, BfgGameTableIdToolbox } from "./bfg-branded-uuids";
import { GameRoomPersistSchema } from "../tinybase/game-room-persist";
// import type { GenericGameMetadata } from "../../game-metadata/games-registry";
import { BfgSupportedGameTitleSchema } from "../game-box-definition";


export const BfgGameRoomVersionIndexSchema = z.number().int().nonnegative().brand<"BfgGameRoomVersionIndex">();
export type BfgGameRoomVersionIndex = z.infer<typeof BfgGameRoomVersionIndexSchema>;

export const BfgGameStepIndexSchema = z.number().int().nonnegative().brand<"BfgGameStepIndex">();
export type BfgGameStepIndex = z.infer<typeof BfgGameStepIndexSchema>;

export const BfgTimestampSchema = z.number().int().nonnegative().brand<"BfgTimestamp">();
export type BfgTimestamp = z.infer<typeof BfgTimestampSchema>;

export const BfgStepIndexSchema = z.number().int().nonnegative().brand<"BfgStepIndex">();
export type BfgStepIndex = z.infer<typeof BfgStepIndexSchema>;


export const BfgGameRoomVersionSchema = z.object({
  roomId: BfgGameRoomIdToolbox.idSchema,
  stepIndex: BfgGameRoomVersionIndexSchema,
}).describe("BfgGameRoomVersion");
export type BfgGameRoomVersion = z.infer<typeof BfgGameRoomVersionSchema>;

export const BfgGameTableVersionSchema = z.object({
  tableId: BfgGameTableIdToolbox.idSchema,
  historyIndex: BfgGameStepIndexSchema,
}).describe("BfgGameTableVersion");
export type BfgGameTableVersion = z.infer<typeof BfgGameTableVersionSchema>;


export const BfgGameRoomInstanceSchema = z.object({
  roomVersion: BfgGameRoomVersionSchema,
  roomData: GameRoomPersistSchema,
}).describe("BfgGameRoomInstance");
export type BfgGameRoomInstance = z.infer<typeof BfgGameRoomInstanceSchema>;


export const createBfgGameStepSchema = <
  HostGameStateSchema extends z.ZodType,
  HostGameEventSchema extends z.ZodType,
  HostGameEventOutcomeSchema extends z.ZodType
>(schemas: {
  hostGameStateSchema: HostGameStateSchema;
  hostGameEventSchema: HostGameEventSchema;
  hostGameEventOutcomeSchema: HostGameEventOutcomeSchema;
}) => {
  const { hostGameEventSchema, hostGameEventOutcomeSchema, hostGameStateSchema } = schemas;

  return z.object({
    stepIndex: BfgGameStepIndexSchema,
    createdAt: BfgTimestampSchema,
    event: hostGameEventSchema,
    outcome: hostGameEventOutcomeSchema,
    nextBoardState: hostGameStateSchema,
  }).describe(`BfgGameStep`);
}
export type BfgGameStep = z.infer<ReturnType<typeof createBfgGameStepSchema>>;


export const createBfgGameTableLogSchema = <
  GameTableEventSchema extends z.ZodType
>(schemas: {
  gameTableEventSchema: GameTableEventSchema;
}) => {
  // const BfgGameStepSchema = createBfgGameStepSchema(schemas);
  return z.object({
    gameTableId: BfgGameTableIdToolbox.idSchema,
    gameTitle: BfgSupportedGameTitleSchema,
    history: z.array(schemas.gameTableEventSchema),
  }).describe("BfgGameTableLog");
};
export type BfgGameTableLog<GameTableEventSchema extends z.ZodType> = z.infer<ReturnType<typeof createBfgGameTableLogSchema<GameTableEventSchema>>>;
