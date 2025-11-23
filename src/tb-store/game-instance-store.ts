import { 
  BfgGameInstanceIdToolbox,
  BfgGameRoomIdToolbox,
  BfgGameTableIdToolbox,
  type BfgGameInstanceId,
} from '../models/types/bfg-branded-uuids';
import { createZodSchemaFromTinyBaseSchema, InferTypeFromSchema, type TinybaseTableSchema } from './zod-tb-utils';
import { gameArchivesStore } from './games-archives-store';
import { TB_GAME_INSTANCES_TABLE_NAME } from './tb-constants';
import type z from 'zod';
import { BfgSupportedGameTitleSchema } from '../models/game-box-definition';
import { useRow } from 'tinybase/ui-react';


export const GameInstanceMappingsTinybaseTableColumnsSchema = {
  gameInstanceId: { type: 'string' as const },
  gameRoomId: { type: 'string' as const },
  gameTableId: { type: 'string' as const },
  
  gameTitle: { type: 'string' as const },
  latestStepIndex: { type: 'number' as const },

  createdAt: { type: 'number' as const },
  lastUpdatedAt: { type: 'number' as const },
} as const satisfies TinybaseTableSchema;

export type GameInstanceMappingsTinybaseTableColumns = InferTypeFromSchema<typeof GameInstanceMappingsTinybaseTableColumnsSchema>;


export const GameInstanceMappingsForZodSchema = createZodSchemaFromTinyBaseSchema(GameInstanceMappingsTinybaseTableColumnsSchema, {
  gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
  gameRoomId: BfgGameRoomIdToolbox.idSchema,
  gameTableId: BfgGameTableIdToolbox.idSchema,
  gameTitle: BfgSupportedGameTitleSchema,
});

export type GameInstanceMappings = z.infer<typeof GameInstanceMappingsForZodSchema>;

// export const convertTbModelToGameInstanceMapping = (tbModel: GameInstanceMappingTinybaseTableColumns): GameInstanceMapping => {
//   return {
//     gameInstanceId: tbModel.gameInstanceId as BfgGameInstanceId,
//     gameRoomId: tbModel.gameRoomId as BfgGameRoomId,
//     gameTableId: tbModel.gameTableId as BfgGameTableId,
//   };
// };


export const getGameInstanceMapping = (gameInstanceId: BfgGameInstanceId): GameInstanceMappings => {
  const gameInstanceMappingTbRow = gameArchivesStore.getRow(TB_GAME_INSTANCES_TABLE_NAME, gameInstanceId);
  if (!gameInstanceMappingTbRow) {
    throw new Error(`No game instance mapping found for game instance: ${gameInstanceId}`);
  }
  const gameInstanceMapping = GameInstanceMappingsForZodSchema.parse(gameInstanceMappingTbRow);
  return gameInstanceMapping;
};


export const useLatestHostedGameIdentifiers = (gameInstanceId: BfgGameInstanceId): GameInstanceMappings => {
  const gameIdentifersTbRow = useRow(TB_GAME_INSTANCES_TABLE_NAME, gameInstanceId, gameArchivesStore);

  // Check if row exists first
  if (!gameIdentifersTbRow) {
    // Enhanced error message with debugging info
    const allInstanceIds = gameArchivesStore.getRowIds(TB_GAME_INSTANCES_TABLE_NAME);
    console.error('Game instance mapping not found:', {
      requestedId: gameInstanceId,
      availableIds: Array.from(allInstanceIds),
      storeTable: TB_GAME_INSTANCES_TABLE_NAME,
      file: 'game-instance-store.ts',
      function: 'useLatestHostedGameIdentifiers',
    });
    throw new Error(
      `No game instance mapping found for game instance: ${gameInstanceId}. ` +
      `Available instances: ${Array.from(allInstanceIds).join(', ') || 'none'}. ` +
      `File: modules/bfg-engine/src/tb-store/game-instance-store.ts:63`
    );
  }

  // Debug: log what we actually got from TinyBase
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



// export const useGameInstanceIdentifiersFromGameRoomId = (gameInstanceId: BfgGameInstanceId): GameInstanceMapping => {
//   const rawTable = useTable(TB_GAME_INSTANCES_TABLE_NAME, gameArchivesStore);
  
//   // Find the first row where gameRoomId matches
//   const matchingEntry = Object.entries(rawTable).find(([_gameInstanceId, rowData]) => {
//     const tbModel = rowData as GameInstanceMappingsTinybaseTableColumns;
//     return tbModel.gameInstanceId === gameInstanceId;
//   });
  
//   if (!matchingEntry) {
//     throw new Error(`No game instance mapping found for game room ID: ${gameInstanceId}`);
//   }
  
//   const [_gameInstanceId, rowData] = matchingEntry;
//   const tbModel = rowData as GameInstanceMappingsTinybaseTableColumns;
//   const gameInstanceMapping = convertTbModelToGameInstanceMapping(tbModel);
  
//   return gameInstanceMapping;
// };



// const convertGameInstanceMappingToTbModel = (gameInstanceMapping: GameInstanceMapping): GameInstanceMappingTinybaseTableColumns => {
//   return {
//     gameInstanceId: gameInstanceMapping.gameInstanceId,
//     gameRoomId: gameInstanceMapping.gameRoomId,
//     gameTableId: gameInstanceMapping.gameTableId,
//   };
// };



// export const GameInstanceMappingTbTableRowForZodSchema = createZodSchemaFromTinyBaseSchema(
//   GameInstanceMappingTinybaseTableColumnsSchema,
//   {
//     gameInstanceId: BfgGameInstanceIdToolbox.idSchema,
//     gameRoomId: BfgGameRoomIdToolbox.idSchema,
//     gameTableId: BfgGameTableIdToolbox.idSchema,
//   }
// );

// export type GameInstanceMappingTbTableRow = z.infer<typeof GameInstanceMappingTbTableRowForZodSchema>;

// // Create the store
// export const gameInstanceMappingStore = createStore();
// const persister = createLocalPersister(gameInstanceMappingStore, TB_GAME_INSTANCE_MAPPING_STORE_NAME);

// Set table schema
// gameInstanceMappingStore.setTablesSchema({
//   [TB_GAME_INSTANCE_MAPPING_TABLE_KEY]: GameInstanceMappingTinybaseTableColumnsSchema,
// });

// // Create persister for automatic localStorage persistence
// persister.startAutoLoad();
// persister.startAutoSave();

// /**
//  * Get game room and table IDs for a given game instance ID
//  * Returns null if the mapping doesn't exist
//  */
// export const getGameInstanceMapping = (
//   gameInstanceId: BfgGameInstanceId
// ): GameInstanceMapping | null => {
//   // try {
//     const rawRow = gameInstanceMappingStore.getRow(TB_GAME_INSTANCE_MAPPING_TABLE_KEY, gameInstanceId);
//     if (!rawRow ) {
//       return null;
//     }

//     const tbModel = rawRow as GameInstanceMappingTinybaseTableColumns;
//     const gameInstanceMapping = convertTbModelToGameInstanceMapping(tbModel);
//     return gameInstanceMapping;

//   //   const parseResult = GameInstanceMappingTbTableRowForZodSchema.safeParse(rawRow);
//   //   if (!parseResult.success) {
//   //     console.error('Error validating game instance mapping:', parseResult.error);
//   //     return null;
//   //   }

//   //   const mapping = parseResult.data;
//   //   return {
//   //     gameRoomId: mapping.gameRoomId as BfgGameRoomId,
//   //     gameTableId: mapping.gameTableId as BfgGameTableId,
//   //   };
//   // } catch (error) {
//   //   console.error('Error getting game instance mapping:', error);
//   //   return null;
//   // }
// };

// // /**
//  * Set or update a game instance mapping
//  * Creates a new mapping if it doesn't exist, updates if it does
//  */
// export const addGameInstanceMapping = (
//   gameInstanceId: BfgGameInstanceId,
//   gameRoomId: BfgGameRoomId,
//   gameTableId: BfgGameTableId
// ): boolean => {
//   // try {

//     const mappingTbModel: GameInstanceMappingTinybaseTableColumns = {
//       gameInstanceId,
//       gameRoomId,
//       gameTableId,
//     };

//     // const mappingTbModel = convertGameInstanceMappingToTbModel(mappingRow);

//     // Validate before setting
//     // const validationResult = GameInstanceMappingTbTableRowForZodSchema.safeParse(mappingRow);
//     // if (!validationResult.success) {
//     //   console.error('Error validating game instance mapping:', validationResult.error);
//     //   return false;
//     // }

//     gameInstanceMappingStore.setRow(TB_GAME_INSTANCE_MAPPING_TABLE_KEY, gameInstanceId, mappingTbModel);
//     return true;
//   // } catch (error) {
//   //   console.error('Error setting game instance mapping:', error);
//   //   return false;
//   // }
// };

// /**
//  * Delete a game instance mapping
//  */
// export const deleteGameInstanceMapping = (gameInstanceId: BfgGameInstanceId): boolean => {
//   try {
//     gameInstanceMappingStore.delRow(TB_GAME_INSTANCE_MAPPING_TABLE_KEY, gameInstanceId);
//     return true;
//   } catch (error) {
//     console.error('Error deleting game instance mapping:', error);
//     return false;
//   }
// };

// /**
//  * Get all game instance mappings (for debugging/admin purposes)
//  * Returns a map of BfgGameInstanceId to { gameRoomId, gameTableId }
//  */
// export const getAllGameInstanceMappings = (): Record<
//   BfgGameInstanceId,
//   { gameRoomId: BfgGameRoomId; gameTableId: BfgGameTableId }
// > => {
//   try {
//     const rawTable = gameInstanceMappingStore.getTable(TB_GAME_INSTANCE_MAPPING_TABLE_KEY);
//     const result: Record<BfgGameInstanceId, { gameRoomId: BfgGameRoomId; gameTableId: BfgGameTableId }> = {};

//     Object.entries(rawTable).forEach(([gameInstanceId, rawData]) => {
//       const parseResult = GameInstanceMappingTbTableRowForZodSchema.safeParse(rawData);
//       if (parseResult.success) {
//         result[gameInstanceId as BfgGameInstanceId] = {
//           gameRoomId: parseResult.data.gameRoomId as BfgGameRoomId,
//           gameTableId: parseResult.data.gameTableId as BfgGameTableId,
//         };
//       } else {
//         console.warn(`Invalid game instance mapping for ${gameInstanceId}:`, parseResult.error);
//       }
//     });

//     return result;
//   } catch (error) {
//     console.error('Error getting all game instance mappings:', error);
//     return {};
//   }
// };


// export const useGameInstanceIdsFromGameRoomId = (gameInstanceId: BfgGameInstanceId): GameInstanceMapping => {
//   const rawTable = useTable(TB_GAME_INSTANCE_MAPPING_TABLE_KEY, gameInstanceMappingStore);
  
//   // Find the first row where gameRoomId matches
//   const matchingEntry = Object.entries(rawTable).find(([_gameInstanceId, rowData]) => {
//     const tbModel = rowData as GameInstanceMappingTinybaseTableColumns;
//     return tbModel.gameInstanceId === gameInstanceId;
//   });
  
//   if (!matchingEntry) {
//     throw new Error(`No game instance mapping found for game room ID: ${gameInstanceId}`);
//   }
  
//   const [_gameInstanceId, rowData] = matchingEntry;
//   const tbModel = rowData as GameInstanceMappingTinybaseTableColumns;
//   const gameInstanceMapping = convertTbModelToGameInstanceMapping(tbModel);
  
//   return gameInstanceMapping;
// };