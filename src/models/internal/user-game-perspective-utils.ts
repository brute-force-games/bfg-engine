import { GameTableAccessAction, GameTableAccessLevel } from "./user-game-perspective";


export const convertGameTableAccessActionToGameTableAccessLevel = (accessAction: GameTableAccessAction): GameTableAccessLevel => {
  switch (accessAction) {
    case 'watch':
      return 'observer';
    case 'play':
      return 'player';
    case 'host':
      return 'host';
  }

  throw new Error('Invalid game table access action: ' + accessAction);
}
