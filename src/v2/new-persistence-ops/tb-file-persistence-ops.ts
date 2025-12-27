import { PrivatePlayerProfile } from "@bfg-engine/models/internal/player-profile/private-player-profile";
import { PublicPlayerProfile } from "@bfg-engine/models/internal/player-profile/public-player-profile";
import { GameStepPersist } from "@bfg-engine/models/persist/game-step-persist";
import type { BfgGameInstanceId, BfgGameRoomId, BfgGameTableId, PlayerProfileId } from "../../models/types/bfg-branded-uuids";
import { TbPersistenceMappers } from "./tb-persistence-mappers";
import { IGameHostPersistenceOps, IMyProfilesPersistenceOps, IPersistenceOps, IUserPersistenceOps } from "./persistence-ops";


// const createNewUserPersistenceOps = (): IUserPersistenceOps => {
//   return {
//     addPublicUserProfile: async (
//       userProfile: PublicPlayerProfile,
//     ) => {
//       return await addPublicUserProfile(userProfile);
//     },
//     updatePublicUserProfile: async (
//       userProfile: PublicPlayerProfile,
//     ) => {
//       return await updatePublicUserProfile(userProfile);
//     },
//     deletePublicUserProfile: async (
//       userProfile: PublicPlayerProfile,
//     ) => {
//       return await deletePublicUserProfile(userProfile);
//     },
//     getPublicUserProfile: async (
//       profileId: PlayerProfileId,
//     ) => {
//       return await getPublicUserProfile(profileId);
//     },
//     getAllPublicUserProfiles: async () => {
//       return await getAllPublicUserProfiles();
//     },
//   }
// }


const createNewMyProfilesPersistenceOps = (): IMyProfilesPersistenceOps => {
  return {
    addProfile: async (
      userProfile: PrivatePlayerProfile,
    ) => {
      return await addPrivateUserProfile(userProfile);
    },
    updateProfile: async (
      userProfile: PrivatePlayerProfile,
    ) => {
      return await updatePrivateUserProfile(userProfile);
    },
    deleteProfile: async (
      userProfile: PrivatePlayerProfile,
    ) => {
      return await deletePrivateUserProfile(userProfile);
    },
    getProfile: async (
      profileId: PlayerProfileId,
    ) => {
      return await getPrivateUserProfile(profileId);
    },
    getAllProfiles: async () => {
      return await getAllPrivateUserProfiles();
    },
    setDefaultProfile: async (
      profileId: PlayerProfileId,
    ) => {
      return await setDefaultPrivateUserProfile(profileId);
    },
    getDefaultProfile: async () => {
      return await getDefaultPrivateUserProfile();
    },
  }
}


export const createNewGameHostPersistenceOps = (): IGameHostPersistenceOps => {
  return {
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
}


export const createNewTbFilePersistenceOps = (): IPersistenceOps => {

  const myProfilesPersistenceOps = createNewMyProfilesPersistenceOps();
  const gameHostPersistenceOps = createNewGameHostPersistenceOps();

  return {
    mappers: TbPersistenceMappers,

    myProfilesPersistenceOps,
    gameHostPersistenceOps,
  }
}


// export const TbFilePersistenceOps: IPersistenceOps = {
//   mappers: TbPersistenceMappers,
  
//   persistNewGameTable: async (
//     gameInstanceId: BfgGameInstanceId,
//     gameRoomId: BfgGameRoomId,
//     gameTableId: BfgGameTableId,
//     gameRoom: GameRoomPersist,
//     gameStep: GameStepPersist,
//   ) => {
//     return await saveNewGameTableToSqliteLocal(gameInstanceId, gameRoomId, gameTableId, gameRoom, gameStep);
//   },

//   persistLatestGameTable: async (
//     gameInstanceId: BfgGameInstanceId,
//     gameRoomId: BfgGameRoomId,
//     gameTableId: BfgGameTableId,
//     gameStep: GameStepPersist,
//   ) => {
//     return await updateLatestGameTableStepInSqliteLocal(gameInstanceId, gameRoomId, gameTableId, gameStep);
//   },

//   getLatestGameTable: async (
//     gameInstanceId: BfgGameInstanceId,
//     gameRoomId: BfgGameRoomId,
//     gameTableId: BfgGameTableId,
//   ) => {
//     return await getLatestGameTableFromSqliteLocal(gameInstanceId, gameRoomId, gameTableId);
//   },
// }
