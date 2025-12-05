import { UpdatedGameTable } from "../new-host-ops/new-host-ops";


export type TxGameTableToAllPlayersResult = {
  success: boolean;
  error?: string;
}

export interface ITxOps {
  initializeTx(startedGameTable: UpdatedGameTable): any;
  txGameTableToAllPlayers(gameStepPersist: any): TxGameTableToAllPlayersResult;
  // txPlayerActionStr: (data: PlayerP2pActionStr, peer: PeerId) => void;
}

export interface ITxOpsDependencies {
  // p2p: IP2p;
}

export const TxOps: ITxOps = {
  initializeTx: (startedGameTable: UpdatedGameTable) => {
    return {
      success: true,
      error: undefined,
    };
  },
  txGameTableToAllPlayers: (gameStepPersist: GameStepPersist) => {
    return {
      success: true,
      error: undefined,
    };
  },
  // txPlayerActionStr: (data: PlayerP2pActionStr, peer: PeerId) => {
  //   return () => {};
  // },
};
