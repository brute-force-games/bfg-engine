import { z } from "zod";
import { createZodSchemaFromTinyBaseSchema, InferTypeFromSchema, type TinybaseTableSchema } from "../../tb-store/zod-tb-utils";
import { BfgGameRoomIdToolbox } from "../types/bfg-branded-uuids";
import { BfgStringifiedRoomStateStrToolbox } from "../types/bfg-branded-string-types";


export const GameSnapshotTinybaseTableColumnsSchema = {
  gameInstanceId: { type: 'string' as const },
  gameRoomId: { type: 'string' as const },
  gameTableId: { type: 'string' as const },

  stringifiedRoomState: { type: 'string' as const },
  
  createdAt: { type: 'number' as const },
  lastUpdatedAt: { type: 'number' as const },
} as const satisfies TinybaseTableSchema;

export type GameSnapshotTinybaseTableColumns = InferTypeFromSchema<typeof GameSnapshotTinybaseTableColumnsSchema>;


export const GameRoomSnapshotTbTableRowForZodSchema = createZodSchemaFromTinyBaseSchema(GameSnapshotTinybaseTableColumnsSchema, {
  gameRoomId: BfgGameRoomIdToolbox.idSchema, // Use branded type schema
  stringifiedRoomState: BfgStringifiedRoomStateStrToolbox.schema,
});

export type GameRoomSnapshotTbTableRow = z.infer<typeof GameRoomSnapshotTbTableRowForZodSchema>;
