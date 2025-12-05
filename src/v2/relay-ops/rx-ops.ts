import { PeerId, PlayerP2pActionStr } from "@bfg-engine/hooks/p2p/p2p-types";
import { UpdatedGameTable } from "../new-host-ops/new-host-ops";


export interface IRxOps {
  gatherNextPlayerActions(latestGameTable: { success: boolean; gameTable?: GameTablePersist; error?: string; }): any;
  initializeRx(startedGameTable: UpdatedGameTable): any;
  rxPlayerActionStr: (handler: (data: PlayerP2pActionStr, peer: PeerId) => void) => (() => void);
}

export interface IRxOpsDependencies {
  // p2p: IP2p;
}

export const RxOps: IRxOps = {
  initializeRx: () => ({}),
  rxPlayerActionStr: (handler: (data: PlayerP2pActionStr, peer: PeerId) => void) => {
    return () => {};
  },
};