import { useMyDefaultPlayerProfile } from "../../../stores/use-my-player-profiles-store";
import { EmptyP2pDetails } from "../../p2p-types";
import { useP2pDetailsFromRawP2pRoom } from "../p2p-details-from-raw-p2p-room-hook";
import { IBfgGameTableForObserver, type IBfgGameTableForUnknown, type IP2pDetails } from "../p2p-game-types";
// import { adaptToGameRoomAsHostObserver } from "./adapt-to-game-room-as-host-observer";
import { usePublicGameTableForObserverFromHost } from "./use-public-game-details-from-host";
import { usePublicGameTableForObserverFromP2p } from "./use-public-game-details-from-p2p";


const combineGameRoomAndP2pDetails = (
  hostGameRoom: IBfgGameTableForObserver,
  p2pDetails: IP2pDetails,
): IBfgGameTableForObserver => {

  return {
    ...hostGameRoom,
    p2pDetails,
  };
}


export const adaptToGameRoomAsObserver = (gameRoomUnknown: IBfgGameTableForUnknown): IBfgGameTableForObserver => {

  const { accessMode } = gameRoomUnknown;

  const myDefaultPlayerProfile = useMyDefaultPlayerProfile();
  
  if (accessMode === 'host-only') {
    const p2pDetails = EmptyP2pDetails;
    const publicGameTableForObserver = usePublicGameTableForObserverFromHost(gameRoomUnknown);
    // const adaptedForHost = adaptToGameRoomAsHostObserver(gameRoomUnknown, p2pDetails);

    const gameTableForObserver = combineGameRoomAndP2pDetails(publicGameTableForObserver, p2pDetails);
    return gameTableForObserver;
  }

  if (accessMode === 'p2p-only') {
    const p2pDetails = useP2pDetailsFromRawP2pRoom(gameRoomUnknown.p2pRawRoom, myDefaultPlayerProfile);
    const publicGameTableForObserver = usePublicGameTableForObserverFromP2p(gameRoomUnknown, myDefaultPlayerProfile);
    // const adaptedForP2p = adaptToGameRoomAsP2pObserver(gameRoomUnknown, p2pDetails);
    // const p2pDetails = useP2pDetailsFromRawRoom(gameRoomUnknown.p2pRawRoom, myDefaultPlayerProfile);
    // const adaptedForP2p = adaptToP2pGameRoom(gameRoomUnknown.p2pRawRoom);
    const gameTableForObserver = combineGameRoomAndP2pDetails(publicGameTableForObserver, p2pDetails);
    return gameTableForObserver;
  }

  if (accessMode === 'host+p2p') {
    const p2pDetails = useP2pDetailsFromRawP2pRoom(gameRoomUnknown.p2pRawRoom, myDefaultPlayerProfile);
    // const adaptedForHost = adaptToGameRoomAsHostObserver(gameRoomUnknown, p2pDetails);
    const publicGameTableForObserver = usePublicGameTableForObserverFromHost(gameRoomUnknown);
    const gameTableForObserver = combineGameRoomAndP2pDetails(publicGameTableForObserver, p2pDetails);
    return gameTableForObserver;
    // const mergedGameRoom = combineHostGameRoomAndP2pDetails(adaptedForHost, p2pDetails);
    // return mergedGameRoom;
  }

  throw new Error(`Unknown game room mode: ${accessMode}`);
}
