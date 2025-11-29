import { z } from "zod";
import { BfgGameRoomIdToolbox, BfgGameTableIdToolbox } from "./bfg-branded-uuids";
import { GameRoomDbSchema } from "../tinybase/game-room-db";
import type { GenericGameMetadata } from "../../game-metadata/games-registry";
import { BfgSupportedGameTitleSchema } from "../game-box-definition";


export const BfgGameRoomVersionIndexSchema = z.number().int().nonnegative().brand<"BfgGameRoomVersionIndex">();
export type BfgGameRoomVersionIndex = z.infer<typeof BfgGameRoomVersionIndexSchema>;

export const BfgGameStepIndexSchema = z.number().int().nonnegative().brand<"BfgGameStepIndex">();
export type BfgGameStepIndex = z.infer<typeof BfgGameStepIndexSchema>;

export const BfgTimestampSchema = z.number().int().nonnegative().brand<"BfgTimestamp">();
export type BfgTimestamp = z.infer<typeof BfgTimestampSchema>;


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
  roomData: GameRoomDbSchema,
}).describe("BfgGameRoomInstance");
export type BfgGameRoomInstance = z.infer<typeof BfgGameRoomInstanceSchema>;


export const createBfgGameStepSchema = (gameMetadata: GenericGameMetadata) => {
  const schemas = gameMetadata.schemas;
  const { gameEventSchema, gameEventOutcomeSchema, hostGameStateSchema } = schemas;

  return z.object({
    stepIndex: BfgGameStepIndexSchema,
    createdAt: BfgTimestampSchema,
    event: gameEventSchema,
    outcome: gameEventOutcomeSchema,
    nextBoardState: hostGameStateSchema,
  }).describe("BfgGameStep");
}
export type BfgGameStep = z.infer<ReturnType<typeof createBfgGameStepSchema>>;


export const createBfgGameTableLogSchema = (gameMetadata: GenericGameMetadata) => {
  const BfgGameStepSchema = createBfgGameStepSchema(gameMetadata);
  return z.object({
    gameTableId: BfgGameTableIdToolbox.idSchema,
    gameTitle: BfgSupportedGameTitleSchema,
    history: z.array(BfgGameStepSchema),
  }).describe("BfgGameTableLog");
};
export type BfgGameTableLog = z.infer<ReturnType<typeof createBfgGameTableLogSchema>>;
