import type { GameRoomPersist } from "../../models/tinybase/game-room-persist";
import type { GameStepPersist } from "../../models/tinybase/game-step-persist-tb";
import type { BfgGameInstanceId, BfgGameRoomId, BfgGameTableId } from "../../models/types/bfg-branded-uuids";
import type { IPersistenceOps } from "./persistence-ops";
import { TbPersistenceMappers } from "./tb-persistence-mappers";
import {
  saveNewGameTableToSqliteBrowser,
  updateLatestGameTableStepInSqliteBrowser,
  getLatestGameTableFromSqliteBrowser,
} from "./tb-store/sqlite-persistence-helpers";


export const BrowserTbPersistenceOps: IPersistenceOps = {
  mappers: TbPersistenceMappers,
  
  persistNewGameTable: async (
    gameInstanceId: BfgGameInstanceId,
    gameRoomId: BfgGameRoomId,
    gameTableId: BfgGameTableId,
    gameRoom: GameRoomPersist,
    gameStep: GameStepPersist,
  ) => {
    return await saveNewGameTableToSqliteBrowser(gameInstanceId, gameRoomId, gameTableId, gameRoom, gameStep);
  },

  persistLatestGameTable: async (
    gameInstanceId: BfgGameInstanceId,
    gameRoomId: BfgGameRoomId,
    gameTableId: BfgGameTableId,
    gameStep: GameStepPersist,
  ) => {
    return await updateLatestGameTableStepInSqliteBrowser(gameInstanceId, gameRoomId, gameTableId, gameStep);
  },

  getLatestGameTable: async (
    gameInstanceId: BfgGameInstanceId,
    gameRoomId: BfgGameRoomId,
    gameTableId: BfgGameTableId,
  ) => {
    return await getLatestGameTableFromSqliteBrowser(gameInstanceId, gameRoomId, gameTableId);
  },
}
