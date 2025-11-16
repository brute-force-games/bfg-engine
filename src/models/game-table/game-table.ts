import z from "zod";
import { BfgGameTableIdToolbox } from "../types/bfg-branded-uuids";


export const GameTableDbSchema = z.object({
  id: BfgGameTableIdToolbox.idSchema,
  createdAt: z.number(),
  lastUpdatedAt: z.number(),
});

export type GameTableFields = z.infer<typeof GameTableDbSchema>;

export type GameTable = GameTableFields;