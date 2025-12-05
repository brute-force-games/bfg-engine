import { BfgGameInstanceId, BfgGameRoomId } from "./bfg-branded-uuids";
import { BfgGameTableId } from "./bfg-branded-uuids";


export interface IGameIdentifiers {
  gameInstanceId: BfgGameInstanceId;
  gameRoomId: BfgGameRoomId;
  gameTableId: BfgGameTableId;
}