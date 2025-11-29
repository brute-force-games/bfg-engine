import { useHostedGameRoomContextOptional, type IHostedGameRoomValue } from "./hosted-game-room-context";
import { useP2pRawRoomContext, type IP2pRawRoomValue } from "./p2p-raw-room-context";

export interface IGameRoomSources {
  roomFromHost: IHostedGameRoomValue | null;
  rawRoomFromP2p: IP2pRawRoomValue | null;
}

export const useGameRoomSources = (): IGameRoomSources => {
  // Use optional hook to handle cases where hosted game context might be null (e.g., observers without local snapshot)
  // This allows watch routes to work even when observers don't have the hosted game locally
  const roomFromHost = useHostedGameRoomContextOptional();
  const rawRoomFromP2p = useP2pRawRoomContext();

  return {
    roomFromHost,
    rawRoomFromP2p,
  } satisfies IGameRoomSources;
}
