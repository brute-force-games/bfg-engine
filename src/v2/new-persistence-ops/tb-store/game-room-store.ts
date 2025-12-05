import type { useRow } from 'tinybase/ui-react';
import { z } from 'zod';
import { BfgSupportedGameTitleSchema } from '../../../models/game-box-definition';
import type { HydratedLatestGameSnapshot } from '../../../models/internal/game-room-snapshot';
import type { PerfectInformationGameJournal } from '../../../models/perspective-oriented/perfect-information/game-log';
import { createTableTransitionsArraySchema } from '../../../models/tinybase/game-board-event';
import type { GameRoomPersist, GameRoomPersistSchema } from '../../../models/tinybase/game-room-persist';
import { GameRoomSnapshotTbTableRowForZodSchema, type GameRoomSnapshotTbTableRow } from '../../../models/tinybase/game-snapshot';
import { BfgStringifiedBoardTransitionsStrToolbox } from '../../../models/types/bfg-branded-string-types';
import type { BfgGameTableIdToolbox, BfgGameTableId, BfgGameInstanceId, BfgGameRoomId } from '../../../models/types/bfg-branded-uuids';
import type { BfgGameRoomInstance, BfgGameRoomVersionIndex, BfgGameTableLog, BfgTimestamp } from '../../../models/types/bfg-versions';
import type { TB_GAME_INSTANCES_TABLE_NAME, TB_GAME_ROOMS_TABLE_NAME, TB_GAME_EVENTS_TABLE_NAME } from '../../../tb-store/tb-constants';
import { type TinybaseTableSchema, type InferTypeFromSchema, createZodSchemaFromTinyBaseSchema } from '../../../tb-store/zod-tb-utils';
import type { getGameMetadata } from '../../new-game-registry/new-game-registry';
import type { GameTableEventForDb } from '../../new-metadata/new-metadata-types';
import { GameInstanceMappingsForZodSchema, getGameInstanceMapping, type GameInstanceMappingsTinybaseTableColumns } from './game-instance-store';
import type { gameArchivesStore } from './games-archives-store';


const BoardTransitionTinybaseTableColumnsSchema = {
  gameTableId: { type: 'string' as const },
  gameTitle: { type: 'string' as const },
  stringifiedBoardTransitions: { type: 'string' as const },
} as const satisfies TinybaseTableSchema;

export type BoardTransitionTinybaseTableColumns = InferTypeFromSchema<typeof BoardTransitionTinybaseTableColumnsSchema>;

export const BoardTransitionTbTableRowForZodSchema = createZodSchemaFromTinyBaseSchema(BoardTransitionTinybaseTableColumnsSchema, {
  gameTitle: BfgSupportedGameTitleSchema,
  gameTableId: BfgGameTableIdToolbox.idSchema,
  stringifiedBoardTransitions: BfgStringifiedBoardTransitionsStrToolbox.schema,
});

export type BoardTransitionTbTableRow = z.infer<typeof BoardTransitionTbTableRowForZodSchema>;


export const getAllHostedGames = (): GameRoomPersist[] => {
  try {
    const games: GameRoomPersist[] = [];
    const parsedGameTableIds = new Set<BfgGameTableId>();

    // Get all row IDs from gameArchivesStore and parse them
    const archiveTable = gameArchivesStore.getTable('gameArchives');
    Object.keys(archiveTable).forEach((rowId) => {
      const parseResult = BfgGameTableIdToolbox.idSchema.safeParse(rowId);
      if (parseResult.success) {
        parsedGameTableIds.add(parseResult.data);
      } else {
        console.warn(`Invalid game table ID in archive store: ${rowId}`, parseResult.error);
      }
    });

    // For each parsed game table ID, get the GameTable from archive data
    parsedGameTableIds.forEach((gameTableId) => {
      const archiveRow = gameArchivesStore.getRow('gameArchives', gameTableId);
      if (archiveRow && typeof archiveRow.stringifiedLatestTableState === 'string') {
        try {
          const parsedTableState = JSON.parse(archiveRow.stringifiedLatestTableState);
          const gameTable = GameRoomPersistSchema.parse(parsedTableState);
          games.push(gameTable);
        } catch (error) {
          console.error(`Error parsing game table state for ${gameTableId}:`, error);
        }
      }
    });
    
    return games;
  } catch (error) {
    console.error('Error getting all hosted games:', error);
    return [];
  }
};


// export const useGameInstanceIdsFromGameRoomId = (gameInstanceId: BfgGameInstanceId): GameInstanceMapping => {
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


export const useLatestHostedGameSnapshot = (gameInstanceId: BfgGameInstanceId): HydratedLatestGameSnapshot | null => {

  // Check if game instance mapping exists in store first (for observers who don't have it yet)
  const gameIdentifiersTbRow = useRow(TB_GAME_INSTANCES_TABLE_NAME, gameInstanceId, gameArchivesStore);
  
  // useRow returns an empty object {} when the row doesn't exist, not null
  // Check if the object is empty or doesn't have required fields
  if (!gameIdentifiersTbRow || Object.keys(gameIdentifiersTbRow).length === 0 || !gameIdentifiersTbRow.gameInstanceId) {
    // Game instance mapping not found in local store - this is expected for observers
    // They will get the game data via P2P instead
    return null;
  }

  // Parse the mapping
  const gameInstanceMappingParseResult = GameInstanceMappingsForZodSchema.safeParse(gameIdentifiersTbRow);
  if (!gameInstanceMappingParseResult.success) {
    console.error('Error parsing game instance mapping:', gameInstanceMappingParseResult.error);
    return null;
  }
  const gameIdentifiers = gameInstanceMappingParseResult.data;

  const gameRoomId = gameIdentifiers.gameRoomId;
  const gameTableId = gameIdentifiers.gameTableId;

  const hostedGameRoomSnapshot = useRow(TB_GAME_ROOMS_TABLE_NAME, gameRoomId, gameArchivesStore);
  const hostedGameEvents = useRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId, gameArchivesStore);

  const gameRoomSnapshotParseResult = GameRoomSnapshotTbTableRowForZodSchema.safeParse(hostedGameRoomSnapshot);
  if (!gameRoomSnapshotParseResult.success) {
    console.error('Error validating existing game room snapshot:', gameRoomSnapshotParseResult.error);
    return null;
  }
  const gameRoomSnapshotTbTableRow = gameRoomSnapshotParseResult.data;

  const parsedRoomState = JSON.parse(gameRoomSnapshotTbTableRow.stringifiedRoomState);

  const hydratedRoomState = GameRoomPersistSchema.parse(parsedRoomState);
  const gameTitle = hydratedRoomState.gameTitle;
  if (!gameTitle) {
    throw new Error("Game title not found");
  }

  const gameMetadata = getGameMetadata(gameTitle);

  const gameEventsParseResult = BoardTransitionTbTableRowForZodSchema.safeParse(hostedGameEvents);
  if (!gameEventsParseResult.success) {
    console.error('Error validating existing game events:', gameEventsParseResult.error);
    return null;
  }
  const gameEvents = gameEventsParseResult.data;

  const BoardTransitionsArraySchema = createTableTransitionsArraySchema(gameMetadata.schemas);

  const unstringifiedBoardTransitions = JSON.parse(gameEvents.stringifiedBoardTransitions);
  const parsedAllBoardTransitions = BoardTransitionsArraySchema.safeParse(unstringifiedBoardTransitions);
  if (!parsedAllBoardTransitions.success) {
    console.error('Error parsing all board transitions:', parsedAllBoardTransitions.error);
    return null;
  }

  const allBoardEvents = parsedAllBoardTransitions.data;

  // const GameBoardTransitionSchema = createGameBoardEventForDbSchema(gameMetadata.schemas);
  // const hydratedLatestBoardEventParseResult = GameBoardTransitionSchema.safeParse(parsedLatestBoardTransition);

  // if (!hydratedLatestBoardEventParseResult.success) {
  //   console.error('Error validating latest board transition:', hydratedLatestBoardEventParseResult.error);
  //   return null;
  // }
  // const hydratedLatestBoardEvent = hydratedLatestBoardEventParseResult.data;
  
  // const GameRoomSnapshotSchema = createGameRoomSnapshotForP2pSchema(gameMetadata.schemas);
  // type GameRoomSnapshot = z.infer<typeof GameRoomSnapshotSchema>;

  // TODO: this needs to be populated (from the game steps table?)
  // const boardEvents: GameBoardEventForDb[] = [];

  // console.warn("empty boardEvents for now", boardEvents);
  
  const gameRoomSnapshot: HydratedLatestGameSnapshot = {
    // gameRoomId,
    // latestStepIndex: gameRoomSnapshotTbTableRow.latestStepIndex,
    gameRoom: hydratedRoomState,
    // createdAt: gameRoomSnapshotTbTableRow.createdAt,
    boardEvents: allBoardEvents,
    latestStepIndex: allBoardEvents.length,
  }

  return gameRoomSnapshot;
};


export const useLatestPerfectInformationGameJournal = (gameInstanceId: BfgGameInstanceId): PerfectInformationGameJournal | null => {

  const latestHostedGameSnapshot = useLatestHostedGameSnapshot(gameInstanceId);
  if (!latestHostedGameSnapshot) {
    return null;
  }

  const gameRoomInstance: BfgGameRoomInstance = {
    roomVersion: {
      roomId: latestHostedGameSnapshot.gameRoom.id,
      stepIndex: 0 as BfgGameRoomVersionIndex,
    },
    roomData: latestHostedGameSnapshot.gameRoom,
  };

  const gameMetadata = getGameMetadata(latestHostedGameSnapshot.gameRoom.gameTitle);
  const GameTableEventSchema = gameMetadata.schemas.gameTableEventSchema; 

  const history: z.infer<typeof GameTableEventSchema>[] = latestHostedGameSnapshot.boardEvents.map((boardEvent) => {
    return GameTableEventSchema.parse(boardEvent);
  });
  
  const gameTableLog: BfgGameTableLog<typeof GameTableEventSchema> = {
    gameTableId: latestHostedGameSnapshot.gameRoom.id,
    gameTitle: latestHostedGameSnapshot.gameRoom.gameTitle,
    history,
  };

  const perfectInformationGameJournal: PerfectInformationGameJournal = {
    gameRoomLog: [gameRoomInstance],
    gameTableLog,
  };
  return perfectInformationGameJournal;
}


export const updateHostedGameWithNewNextBoardState = async (
  gameInstanceId: BfgGameInstanceId,
  latestStepIndex: number,
  updatedGameEvent: GameTableEventForDb,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const gameInstanceMapping = getGameInstanceMapping(gameInstanceId);
    const gameTableId = gameInstanceMapping.gameTableId;

    const gameTableHistoryRowTb = gameArchivesStore.getRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId);
    if (!gameTableHistoryRowTb) {
      throw new Error("No game table history row found for game table: " + gameTableId);
    }

    const gameTableHistoryRowParseResult = BoardTransitionTbTableRowForZodSchema.safeParse(gameTableHistoryRowTb);
    if (!gameTableHistoryRowParseResult.success) {
      console.error('Error parsing game table history row:', gameTableHistoryRowParseResult.error);
      throw new Error("Error parsing game table history row: " + gameTableId);
    }

    const gameTableHistoryRow = gameTableHistoryRowParseResult.data;

    const boardTransitions = JSON.parse(gameTableHistoryRow.stringifiedBoardTransitions);

    if (latestStepIndex !== boardTransitions.length) {
      console.error("Current step index does not match the number of board transitions");
      console.error("Current step index: " + latestStepIndex);
      console.error("Number of board transitions: " + boardTransitions.length);
      console.error("Board transitions: " + JSON.stringify(boardTransitions));
      console.error("Updated game event: " + JSON.stringify(updatedGameEvent));
      throw new Error("Current step index does not match the number of board transitions");
    }

    boardTransitions.push(updatedGameEvent);
    const stringifiedBoardTransitions = JSON.stringify(boardTransitions);
    
    const updatedGameTableHistoryRow: BoardTransitionTbTableRow = {
      ...gameTableHistoryRow,
      stringifiedBoardTransitions,
    };

    gameArchivesStore.setRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId, updatedGameTableHistoryRow);

    return { success: true };

  } catch (error) {
    console.error('Error updating hosted game with new next board state:', error);
    return { success: false, error: 'Failed to update hosted game with new next board state' };
  }
}

export const clearAllGameArchives = (): void => {
  gameArchivesStore.delTable(TB_GAME_ROOMS_TABLE_NAME);
  gameArchivesStore.delTable(TB_GAME_EVENTS_TABLE_NAME);
  gameArchivesStore.delTable(TB_GAME_INSTANCES_TABLE_NAME);
  console.log('Game archives cleared successfully');
};


export const clearGameArchive = (gameInstanceId: BfgGameInstanceId): void => {
  const gameIdentifers = gameArchivesStore.getRow(TB_GAME_INSTANCES_TABLE_NAME, gameInstanceId);
  if (!gameIdentifers) {
    return;
  }

  const gameRoomId = gameIdentifers.gameRoomId as BfgGameRoomId;
  const gameTableId = gameIdentifers.gameTableId as BfgGameTableId;
  
  gameArchivesStore.delRow(TB_GAME_ROOMS_TABLE_NAME, gameRoomId);
  gameArchivesStore.delRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId);
  gameArchivesStore.delRow(TB_GAME_INSTANCES_TABLE_NAME, gameInstanceId);
  
  console.log('Game archive cleared successfully');
};


export const saveNewHostedGame = async (
  gameInstanceId: BfgGameInstanceId,
  gameRoomId: BfgGameRoomId,
  gameTableId: BfgGameTableId,
  gameRoom: GameRoomPersist,
  initialGameStep: GameTableEventForDb,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const now = Date.now() as BfgTimestamp;
    const stringifiedRoomState = JSON.stringify(gameRoom);
    
    const gameRoomSnapshotTbRow: GameRoomSnapshotTbTableRow = {
      gameInstanceId,
      gameRoomId,
      gameTableId,
      stringifiedRoomState,
      createdAt: now,
      lastUpdatedAt: now,
    };

    const gameMetadata = getGameMetadata(gameRoom.gameTitle);
    const GameTableEventSchema = gameMetadata.schemas.gameTableEventSchema;

    const validatedGameRoomEvent = GameTableEventSchema.parse(initialGameStep);
    
    // Initialize with an array containing the initial transition
    const initialBoardTransitions: GameTableEventForDb[] = [validatedGameRoomEvent];
    const stringifiedBoardTransitions = JSON.stringify(initialBoardTransitions);

    const newGameStepsRow: BoardTransitionTbTableRow = {
      gameTableId,
      gameTitle: gameRoom.gameTitle,
      stringifiedBoardTransitions,
    };

    const gameInstanceMappingTbRow: GameInstanceMappingsTinybaseTableColumns = {
      gameInstanceId,
      gameRoomId,
      gameTableId,
      gameTitle: gameRoom.gameTitle,
      latestStepIndex: 0,
      createdAt: now,
      lastUpdatedAt: now,
    };

    gameArchivesStore.transaction(
      () => {
        gameArchivesStore.setRow(TB_GAME_INSTANCES_TABLE_NAME, gameInstanceId, gameInstanceMappingTbRow);
        gameArchivesStore.setRow(TB_GAME_ROOMS_TABLE_NAME, gameRoomId, gameRoomSnapshotTbRow);
        gameArchivesStore.setRow(TB_GAME_EVENTS_TABLE_NAME, gameTableId, newGameStepsRow);
      },
    );

    return { success: true };

  } catch (error) {
    console.error('Error adding new hosted game room:', error);
    return { success: false, error: 'Failed to add new hosted game room' };
  }
};
