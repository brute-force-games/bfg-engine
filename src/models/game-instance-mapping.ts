import type { BfgGameInstanceId, BfgGameRoomId, BfgGameTableId } from "./types/bfg-branded-uuids";


export type GameInstanceMapping = {
  gameInstanceId: BfgGameInstanceId;
  gameTableId: BfgGameTableId;
  gameRoomId: BfgGameRoomId;
};
