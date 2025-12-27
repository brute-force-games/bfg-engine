import { BfgGameInstanceIdToolbox, BfgGameRoomIdToolbox, BfgGameTableIdToolbox } from "../../../models/types/bfg-branded-uuids";
import { BfgSupportedGameTitleSchema } from "../../../models/game-box-definition";
import { BfgStringifiedBoardTransitionsStrToolbox, BfgStringifiedRoomStateStrToolbox } from "../../../models/types/bfg-branded-string-types";
import { z } from "zod";


export const BFG_GAME_INSTANCES_TABLE_NAME = 'bfg-game-instances';
export const BFG_GAME_ROOMS_TABLE_NAME = 'bfg-game-rooms';
export const BFG_GAME_STEPS_TABLE_NAME = 'bfg-game-steps';

export const GameInstanceMappingsZodSchema = {
  gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
  gameRoomId: BfgGameRoomIdToolbox.idSchema,
  gameTableId: BfgGameTableIdToolbox.idSchema,
  
  gameTitle: BfgSupportedGameTitleSchema,
  latestStepIndex: z.number(),

  createdAt: z.number(),
  lastUpdatedAt: z.number(),
};
  
export const GameRoomSnapshotZodSchema = {
  gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
  gameRoomId: BfgGameRoomIdToolbox.idSchema,
  gameTableId: BfgGameTableIdToolbox.idSchema,

  stringifiedRoomState: BfgStringifiedRoomStateStrToolbox.schema,
  
  createdAt: z.number(),
  lastUpdatedAt: z.number(),
};

export const GameStepZodSchema = {
  gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
  gameRoomId: BfgGameRoomIdToolbox.idSchema,
  gameTableId: BfgGameTableIdToolbox.idSchema,

  stringifiedStepsHistory: BfgStringifiedBoardTransitionsStrToolbox.schema,
  
  createdAt: z.number(),
  lastUpdatedAt: z.number(),
};



// export type GameStepTinybaseTableColumns = InferTypeFromSchema<typeof GameStepTinybaseTableColumnsSchema>;


// const schematizer = createZodSchematizer();

// export const BfgTbSchema = {
//   gameInstanceMappings: GameInstanceMappingsZodSchema,
//   gameRoomSnapshots: GameRoomSnapshotZodSchema,
//   gameSteps: GameStepZodSchema,
// }

// const schematizedStore = createStore().setTablesSchema(
//   schematizer.toTablesSchema(BfgTbSchema),
// );





// export const GameInstanceMappingsTinybaseTableColumnsSchema = {
//   gameInstanceId: { type: 'string' as const },
//   gameRoomId: { type: 'string' as const },
//   gameTableId: { type: 'string' as const },
  
//   gameTitle: { type: 'string' as const },
//   latestStepIndex: { type: 'number' as const },

//   createdAt: { type: 'number' as const },
//   lastUpdatedAt: { type: 'number' as const },
// } as const satisfies TinybaseTableSchema;

// export type GameInstanceMappingsTinybaseTableColumns = InferTypeFromSchema<typeof GameInstanceMappingsTinybaseTableColumnsSchema>;


// export const GameInstanceMappingsForZodSchema = createZodSchemaFromTinyBaseSchema(GameInstanceMappingsTinybaseTableColumnsSchema, {
//   gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
//   gameRoomId: BfgGameRoomIdToolbox.idSchema,
//   gameTableId: BfgGameTableIdToolbox.idSchema,
//   gameTitle: BfgSupportedGameTitleSchema,
// });

// export type GameInstanceMappings = z.infer<typeof GameInstanceMappingsForZodSchema>;



// export const GameRoomSnapshotTinybaseTableColumnsSchema = {
//   gameInstanceId: { type: 'string' as const },
//   gameRoomId: { type: 'string' as const },
//   gameTableId: { type: 'string' as const },

//   stringifiedRoomState: { type: 'string' as const },
  
//   createdAt: { type: 'number' as const },
//   lastUpdatedAt: { type: 'number' as const },
// } as const satisfies TinybaseTableSchema;

// export type GameRoomSnapshotTinybaseTableColumns = InferTypeFromSchema<typeof GameRoomSnapshotTinybaseTableColumnsSchema>;


// export const GameRoomSnapshotTbTableRowForZodSchema = createZodSchemaFromTinyBaseSchema(GameRoomSnapshotTinybaseTableColumnsSchema, {
//   gameRoomId: BfgGameRoomIdToolbox.idSchema,
//   stringifiedRoomState: BfgStringifiedRoomStateStrToolbox.schema,
// });

// export type GameRoomSnapshotTbTableRow = z.infer<typeof GameRoomSnapshotTbTableRowForZodSchema>;



// export const GameStepTinybaseTableColumnsSchema = {
//   gameInstanceId: { type: 'string' as const },
//   gameRoomId: { type: 'string' as const },
//   gameTableId: { type: 'string' as const },

//   stringifiedStepState: { type: 'string' as const },
  
//   createdAt: { type: 'number' as const },
//   lastUpdatedAt: { type: 'number' as const },
// } as const satisfies TinybaseTableSchema;

// export type GameStepTinybaseTableColumns = InferTypeFromSchema<typeof GameStepTinybaseTableColumnsSchema>;


// export const GameStepTbTableRowForZodSchema = createZodSchemaFromTinyBaseSchema(GameStepTinybaseTableColumnsSchema, {
//   gameRoomId: BfgGameRoomIdToolbox.idSchema,
//   gameTableId: BfgGameTableIdToolbox.idSchema,
//   gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
  
//   stringifiedStepState: BfgStringifiedRoomStateStrToolbox.schema,
// });

// export type GameStepTbTableRow = z.infer<typeof GameStepTbTableRowForZodSchema>;
