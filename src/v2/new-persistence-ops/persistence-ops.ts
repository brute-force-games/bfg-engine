import type { GameRoomPersist } from "../../models/tinybase/game-room-persist";
import { GameStepPersistTbSchema, type GameStepPersistTb } from "../../models/tinybase/game-step-persist-tb";
// import type { GameStepPersist } from "../../models/tinybase/game-step-persist-tb";
import type { BfgGameInstanceId, BfgGameRoomId, BfgGameTableId, PlayerProfileId } from "../../models/types/bfg-branded-uuids";
import type { PublicPlayerProfile } from "@bfg-engine/models/internal/player-profile/public-player-profile";
import type { PrivatePlayerProfile } from "@bfg-engine/models/internal/player-profile/private-player-profile";


export interface IPersistenceMappers {
  mapToPersistPublicUserProfile: (userProfile: PublicPlayerProfile) => any;
  mapToPersistPrivateUserProfile: (userProfile: PrivatePlayerProfile) => any;

  mapToNewGameTableState: (gameStep: GameStep) => GameStepPersistTb;

  mapToPersistGameRoom: (gameRoom: GameRoom) => GameRoomPersist;
}


export interface IUserPersistenceOps {
  addPublicUserProfile: (
    userProfile: PublicPlayerProfile,
  ) => Promise<{ success: boolean; error?: string }>;
  updatePublicUserProfile: (
    userProfile: PublicPlayerProfile,
  ) => Promise<{ success: boolean; error?: string }>;
  deletePublicUserProfile: (
    userProfile: PublicPlayerProfile,
  ) => Promise<{ success: boolean; error?: string }>;
  getPublicUserProfile: (
    profileId: PlayerProfileId,
  ) => Promise<{ success: boolean; userProfile?: PublicPlayerProfile; error?: string }>;
  getAllPublicUserProfiles: () => Promise<{ success: boolean; userProfiles?: PublicPlayerProfile[]; error?: string }>;
}

export interface IMyProfilesPersistenceOps {
  addPrivateUserProfile: (
    userProfile: PrivatePlayerProfile,
  ) => Promise<{ success: boolean; error?: string }>;
  updatePrivateUserProfile: (
    userProfile: PrivatePlayerProfile,
  ) => Promise<{ success: boolean; error?: string }>;
  deletePrivateUserProfile: (
    userProfile: PrivatePlayerProfile,
  ) => Promise<{ success: boolean; error?: string }>;
  getPrivateUserProfile: (
    profileId: PlayerProfileId,
  ) => Promise<{ success: boolean; userProfile?: PrivatePlayerProfile; error?: string }>;
  getAllPrivateUserProfiles: () => Promise<{ success: boolean; userProfiles?: PrivatePlayerProfile[]; error?: string }>;
  setDefaultPrivateUserProfile: (
    profileId: PlayerProfileId,
  ) => Promise<{ success: boolean; error?: string }>;
  getDefaultPrivateUserProfile: () => Promise<{ success: boolean; userProfile?: PrivatePlayerProfile; error?: string }>;
}

export interface IGameHostPersistenceOps {
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


export interface IPersistenceOps {

  mappers: IPersistenceMappers;

  // userPersistenceOps: IUserPersistenceOps;
  myProfilesPersistenceOps: IMyProfilesPersistenceOps;

  gameHostPersistenceOps: IGameHostPersistenceOps;
}
