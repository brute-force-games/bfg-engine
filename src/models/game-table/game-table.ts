import { z } from "zod";
import { BfgGameTableActionId, BfgGameTableId, BfgPlayerProfileId } from "../types/bfg-branded-ids";
import { TablePhaseEnumSchema } from "./table-phase";
import { BfgSupportedGameTitleSchema } from "../game-box-definition";


export const PLAYER_SEATS = [
  'p1',
  'p2',
  'p3',
  'p4',
  'p5',
  'p6',
  'p7',
  'p8',
] as const;


export const GameTableSeatSchema = z.enum(PLAYER_SEATS);

export type GameTableSeat = z.infer<typeof GameTableSeatSchema>;


export const GameTableSchema = z.object({
  id: BfgGameTableId.idSchema,
  latestActionId: BfgGameTableActionId.idSchema,

  gameTitle: BfgSupportedGameTitleSchema,
  gameHostPlayerProfileId: BfgPlayerProfileId.idSchema,
  tablePhase: TablePhaseEnumSchema,

  currentStatusDescription: z.string(),

  p1: BfgPlayerProfileId.idSchema,
  p2: BfgPlayerProfileId.idSchema.optional(),
  p3: BfgPlayerProfileId.idSchema.optional(),
  p4: BfgPlayerProfileId.idSchema.optional(),
  p5: BfgPlayerProfileId.idSchema.optional(),
  p6: BfgPlayerProfileId.idSchema.optional(),
  p7: BfgPlayerProfileId.idSchema.optional(),
  p8: BfgPlayerProfileId.idSchema.optional(),

  createdAt: z.number(),
  lastUpdatedAt: z.number(),
});

export type GameTable = z.infer<typeof GameTableSchema>;
