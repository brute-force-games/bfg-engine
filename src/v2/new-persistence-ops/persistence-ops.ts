import type { GameRoomPersist } from "../../models/tinybase/game-room-persist";
import type { GameStepPersist } from "../../models/tinybase/game-step-persist-tb";
import type { BfgGameInstanceId, BfgGameRoomId, BfgGameTableId } from "../../models/types/bfg-branded-uuids";


export interface IPersistenceMappers {
  mapToNewGameTableState: (gameStep: GameStep) => GameStepPersist;

  mapToPersistGameRoom: (gameRoom: GameRoom) => GameRoomPersist;
}

export interface IPersistenceOps {

  mappers: IPersistenceMappers;

  
  persistNewGameTable: (
    gameInstanceId: BfgGameInstanceId,
    gameRoomId: BfgGameRoomId,
    gameTableId: BfgGameTableId,
    gameRoom: GameRoomPersist,
    gameStep: GameStepPersist,
  ) => Promise<{ success: boolean; error?: string }>;

  persistLatestGameTable: (
    gameInstanceId: BfgGameInstanceId,
    gameRoomId: BfgGameRoomId,
    gameTableId: BfgGameTableId,
    gameStep: GameStepPersist,
  ) => Promise<{ success: boolean; error?: string }>;

  getLatestGameTable: (
    gameInstanceId: BfgGameInstanceId,
    gameRoomId: BfgGameRoomId,
    gameTableId: BfgGameTableId,
  ) => Promise<{ success: boolean; gameTable?: GameTablePersist; error?: string }>;
}
