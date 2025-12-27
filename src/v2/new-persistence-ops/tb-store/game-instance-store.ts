import { 
  BfgGameInstanceIdToolbox,
  BfgGameRoomIdToolbox,
  BfgGameTableIdToolbox,
  type BfgGameInstanceId,
} from '../../../models/types/bfg-branded-uuids';
import { createZodSchemaFromTinyBaseSchema, InferTypeFromSchema, type TinybaseTableSchema } from '../../../utils/zod-tb-utils';
import { bfgArchivesStore } from './gamehost-archives/bfg-gamehost-archives-store';
import { BFG_GAME_INSTANCES_TABLE_NAME, GameInstanceMappingsForZodSchema, type GameInstanceMappings } from './bfg-store-constants';
import type z from 'zod';
import { BfgSupportedGameTitleSchema } from '../../../models/game-box-definition';
import { useRow } from 'tinybase/ui-react';


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


export const getGameInstanceMapping = (gameInstanceId: BfgGameInstanceId): GameInstanceMappings => {
  const gameInstanceMappingTbRow = bfgArchivesStore.getRow(BFG_GAME_INSTANCES_TABLE_NAME, gameInstanceId);
  if (!gameInstanceMappingTbRow) {
    throw new Error(`No game instance mapping found for game instance: ${gameInstanceId}`);
  }
  const gameInstanceMapping = GameInstanceMappingsForZodSchema.parse(gameInstanceMappingTbRow);
  return gameInstanceMapping;
};


// if there are no game instance mappings, the game isn't in our store, so we aren't hosting
export const useLatestHostedGameIdentifiers = (gameInstanceId: BfgGameInstanceId): GameInstanceMappings | null => {
  const gameIdentifersTbRow = useRow(BFG_GAME_INSTANCES_TABLE_NAME, gameInstanceId, bfgArchivesStore);

  if (!gameIdentifersTbRow) {
    return null;
  }
  
  console.log('Raw gameIdentifersTbRow from TinyBase:', gameIdentifersTbRow, 'for gameInstanceId:', gameInstanceId);

  const gameInstanceMappingParseResult = GameInstanceMappingsForZodSchema.safeParse(gameIdentifersTbRow);
  if (!gameInstanceMappingParseResult.success) {
    console.error('Error finding game instance mapping:', gameInstanceMappingParseResult.error);
    console.error('Raw row data that failed validation:', JSON.stringify(gameIdentifersTbRow, null, 2));
    throw new Error(`No game instance mapping found for game instance: ${gameInstanceId}`);
  }
  const gameInstanceMapping = gameInstanceMappingParseResult.data;

  return gameInstanceMapping;
};
