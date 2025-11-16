import { BfgGameRoomIdToolbox } from "../types/bfg-branded-uuids";
import { GameRoomDbSchema } from "./game-room-p2p";
import { createGameBoardEventForDbSchema } from "./game-board-transition-db";
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

export const createGameRoomSnapshotForP2pSchema = (schemas: BfgGenericEngineMetadataSchemas) => {
  const GameBoardTransitionForP2pSchema = createGameBoardEventForDbSchema(schemas);

  const GameRoomSnapshotForDbSchema = z.object({
    gameRoomId: BfgGameRoomIdToolbox.idSchema,
    
    gameRoom: GameRoomDbSchema,
    latestBoardTransition: GameBoardTransitionForP2pSchema,

    latestStepIndex: z.number(),
    createdAt: z.number(),
    lastUpdatedAt: z.number(),
  });

  return GameRoomSnapshotForDbSchema;
}

// export type GameRoomSnapshot = ReturnType<typeof createGameRoomSnapshotSchema>;
export type GameRoomSnapshotForP2p = z.infer<ReturnType<typeof createGameRoomSnapshotForP2pSchema>>;
