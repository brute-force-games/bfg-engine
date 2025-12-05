import type { IPersistenceMappers } from "./persistence-ops";


export const TbPersistenceMappers: IPersistenceMappers = {
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
