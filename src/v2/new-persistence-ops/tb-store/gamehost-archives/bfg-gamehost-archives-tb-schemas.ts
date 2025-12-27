import { BfgGameInstanceIdToolbox, BfgGameRoomIdToolbox, BfgGameTableIdToolbox } from "@bfg-engine/models/types/bfg-branded-uuids";
import { BfgSupportedGameTitleSchema } from "@bfg-engine/models/game-box-definition";
import { BfgStringifiedBoardTransitionsStrToolbox, BfgStringifiedRoomStateStrToolbox } from "@bfg-engine/models/types/bfg-branded-string-types";
import { BfgStepIndexSchema, BfgTimestampSchema } from "@bfg-engine/models/types/bfg-versions";


export const BFG_GAME_INSTANCES_TABLE_NAME = 'bfg-game-instances';
export const BFG_GAME_ROOMS_TABLE_NAME = 'bfg-game-rooms';
export const BFG_GAME_STEPS_TABLE_NAME = 'bfg-game-steps';


export const GameInstanceMappingsTbZodSchema = {
  gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
  gameRoomId: BfgGameRoomIdToolbox.idSchema,
  gameTableId: BfgGameTableIdToolbox.idSchema,
  
  gameTitle: BfgSupportedGameTitleSchema,
  latestStepIndex: BfgStepIndexSchema,

  createdAt: BfgTimestampSchema,
  lastUpdatedAt: BfgTimestampSchema,
};
  
export const GameRoomSnapshotTbZodSchema = {
  gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
  gameRoomId: BfgGameRoomIdToolbox.idSchema,
  gameTableId: BfgGameTableIdToolbox.idSchema,

  stringifiedRoomState: BfgStringifiedRoomStateStrToolbox.schema,
  
  createdAt: BfgTimestampSchema,
  lastUpdatedAt: BfgTimestampSchema,
};

export const GameStepTbZodSchema = {
  gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
  gameRoomId: BfgGameRoomIdToolbox.idSchema,
  gameTableId: BfgGameTableIdToolbox.idSchema,

  stringifiedStepsHistory: BfgStringifiedBoardTransitionsStrToolbox.schema,
  
  createdAt: BfgTimestampSchema,
  lastUpdatedAt: BfgTimestampSchema,
};


export const BfgGameHostArchivesTbSchema = {
  gameInstanceMappings: GameInstanceMappingsTbZodSchema,
  gameRoomSnapshots: GameRoomSnapshotTbZodSchema,
  gameSteps: GameStepTbZodSchema,
}
