import { BfgGameRoomIdToolbox } from "../types/bfg-branded-uuids";
import { GameRoomDbSchema } from "./game-room-p2p";
import { createGameBoardEventForDbSchema } from "./game-table-event-db";
import { z } from "zod";
import type { BfgGenericEngineMetadataSchemas } from "../../game-metadata/metadata-types";


// export type GameRoomSnapshot = {
//   gameRoomId: BfgGameRoomId;

//   gameRoom: GameRoomDb;
//   latestBoardTransition: GameBoardTransition;

//   latestStepIndex: number;
//   createdAt: number;
//   lastUpdatedAt: number;
// }

export const createGameRoomSnapshotForDbSchema = (schemas: BfgGenericEngineMetadataSchemas) => {
  const GameBoardEventForDbSchema = createGameBoardEventForDbSchema(schemas);

  const GameRoomSnapshotForDbSchema = z.object({
    gameRoomId: BfgGameRoomIdToolbox.idSchema,
    
    gameRoom: GameRoomDbSchema,
    boardEvents: z.array(GameBoardEventForDbSchema),
    latestBoardEvent: GameBoardEventForDbSchema,

    latestStepIndex: z.number(),
    createdAt: z.number(),
    lastUpdatedAt: z.number(),
  });

  return GameRoomSnapshotForDbSchema;
}

// export type GameRoomSnapshot = ReturnType<typeof createGameRoomSnapshotSchema>;
export type GameRoomSnapshotForDb = z.infer<ReturnType<typeof createGameRoomSnapshotForDbSchema>>;
