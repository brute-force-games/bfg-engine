import { RoomPhase } from "@bfg-engine/models/internal/table-phase";
import { GameLobby } from "@bfg-engine/models/p2p-lobby";
import { IGameIdentifiers } from "@bfg-engine/models/types/game-identifiers";


export type GameStepResult = {
  gameTablePhase: RoomPhase;
  saveResult: { success: boolean; error?: string };
  txAllPlayersResult: { success: boolean; error?: string };
  hostEvents: GameTableEventForGameStep[];
  playerEvents: GameTableEventForGameStep[];
}

export type FirstGameStepResult = {
  txInitResult: { success: boolean; error?: string };
  rxInitResult: { success: boolean; error?: string };
  gameStepResult: GameStepResult;
}


export interface IBfgGameOps {
  initializeGameOps(): Promise<void>;
  
  doFirstGameStep: (
    gameLobby: GameLobby,
    gameIdentifiers: IGameIdentifiers,
  ) => Promise<FirstGameStepResult>;
  
  doGameStep: (
    gameIdentifiers: IGameIdentifiers,
  ) => Promise<GameStepResult>;
}
