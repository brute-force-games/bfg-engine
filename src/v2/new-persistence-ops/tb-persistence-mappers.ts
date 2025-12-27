import type { IPersistenceMappers } from "./persistence-ops";


export const TbPersistenceMappers: IPersistenceMappers = {
  mapToPersistPublicUserProfile: (userProfile: PublicUserProfile) => {
    return {
      userProfile: userProfile,
    };
  },
  mapToPersistPrivateUserProfile: (userProfile: PrivateUserProfile) => {
    return {
      userProfile: userProfile,
    };
  },
  
  mapToPersistGameStep: (gameStep: GameStep) => {
    return {
      gameStep: gameStep,
    };
  },
  mapToPersistGameRoom: (gameRoom: GameRoom) => {
    return {
      gameRoom: gameRoom,
    };
  },
};
