import type { GameRoomPersist } from "../../models/tinybase/game-room-persist";
import type { GameStepPersist } from "../../models/tinybase/game-step-persist-tb";
import type { BfgGameInstanceId, BfgGameRoomId, BfgGameTableId } from "../../models/types/bfg-branded-uuids";
import type { IPersistenceOps } from "./persistence-ops";
import { TbPersistenceMappers } from "./tb-persistence-mappers";
import {
  saveNewGameTableToSqliteLocal,
  updateLatestGameTableStepInSqliteLocal,
  getLatestGameTableFromSqliteLocal,
} from "./tb-store/sqlite-local-persistence-helpers";


export const LocalTbPersistenceOps: IPersistenceOps = {
  mappers: TbPersistenceMappers,
  
  persistNewGameTable: async (
    gameInstanceId: BfgGameInstanceId,
    gameRoomId: BfgGameRoomId,
    gameTableId: BfgGameTableId,
    gameRoom: GameRoomPersist,
    gameStep: GameStepPersist,
  ) => {
    return await saveNewGameTableToSqliteLocal(gameInstanceId, gameRoomId, gameTableId, gameRoom, gameStep);
  },

  persistLatestGameTable: async (
    gameInstanceId: BfgGameInstanceId,
    gameRoomId: BfgGameRoomId,
    gameTableId: BfgGameTableId,
    gameStep: GameStepPersist,
  ) => {
    return await updateLatestGameTableStepInSqliteLocal(gameInstanceId, gameRoomId, gameTableId, gameStep);
  },

  getLatestGameTable: async (
    gameInstanceId: BfgGameInstanceId,
    gameRoomId: BfgGameRoomId,
    gameTableId: BfgGameTableId,
  ) => {
    return await getLatestGameTableFromSqliteLocal(gameInstanceId, gameRoomId, gameTableId);
  },
}
