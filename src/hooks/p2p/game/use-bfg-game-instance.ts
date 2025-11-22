import { useMyDefaultPlayerProfile } from "@bfg-engine/hooks/stores/use-my-player-profiles-store";
import { useP2pGameRoomAsObserver } from "./use-p2p-game-room-as-observer";
import { useP2pGameRoomAsHost } from "./use-p2p-game-room-as-host";
import { useP2pGameRoomAsPlayer } from "./use-p2p-game-room-as-player";
import { isProfileIdOkForPlayerAccess, isProfileOkForHostAccess } from "@bfg-engine/models/game-table/utils";
import { GameTableAccessRole } from "@bfg-engine/models/game-roles";
import { type BfgGameInstanceId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { PrivatePlayerProfile } from "@bfg-engine/models/internal/player-profile/private-player-profile";
import { useP2pGameRoomContext } from "./p2p-game-room-context";
import type { IBfgGameRoomForRole } from "./p2p-game-types";
import { useLatestHostedGameSnapshot } from "../../../tb-store/games-archives-store";


interface RoomUserDetails {
  currentAccessRole: GameTableAccessRole;
  maxAllowedAccessRole: GameTableAccessRole;
  allowedRoles: GameTableAccessRole[];

  myPlayerProfile: PrivatePlayerProfile | null;
  myHostProfile: PrivatePlayerProfile | null;
}


export const useGameInstanceUserDetails = (gameInstanceId: BfgGameInstanceId, requestedRole: GameTableAccessRole): RoomUserDetails => {
  const myPlayerProfile = useMyDefaultPlayerProfile();
  const hostedGameSnapshot = useLatestHostedGameSnapshot(gameInstanceId);

  if (!myPlayerProfile) {
    return {
      currentAccessRole: 'watch',
      maxAllowedAccessRole: 'watch',
      allowedRoles: ['watch'],

      myPlayerProfile: null,
      myHostProfile: null,
    };
  }

  if (!hostedGameSnapshot) {
    return {
      currentAccessRole: 'watch',
      maxAllowedAccessRole: 'watch',
      allowedRoles: ['watch'],

      myPlayerProfile: null,
      myHostProfile: null,
    };
  }

  const hostedGame = hostedGameSnapshot.gameRoom;

  
  const amIHost = hostedGame !== null &&
    isProfileOkForHostAccess(myPlayerProfile, hostedGame);

  if (amIHost) {
    const amIPlayer = hostedGame !== null &&
      isProfileIdOkForPlayerAccess(myPlayerProfile.id, hostedGame);

    return {
      currentAccessRole: requestedRole,
      maxAllowedAccessRole: 'host',
      allowedRoles: amIPlayer ? ['host', 'play', 'watch'] : ['host', 'watch'],

      myPlayerProfile: amIPlayer ? myPlayerProfile : null,
      myHostProfile: myPlayerProfile,
    };
  }

  return {
    currentAccessRole: requestedRole,
    maxAllowedAccessRole: 'play',
    allowedRoles: ['play', 'watch'],
    myPlayerProfile: myPlayerProfile,
    myHostProfile: null,
  };
}


export const useBfgGameRoomForRole = (role: GameTableAccessRole): IBfgGameRoomForRole | null => {
  if (role === 'watch') {
    const observerGameRoom = useP2pGameRoomAsObserver();
    if (observerGameRoom === null) {
      // return null;
      throw new Error('You are not an observer in this game table');
    }
    return {
      role: 'watch',
      gameRoom: observerGameRoom,
    };
  }
  if (role === 'play') {
    const playerGameRoom = useP2pGameRoomAsPlayer();
    if (playerGameRoom === null) {
      // return null;
      throw new Error('You are not a player in this game table');
    }
    return {
      role: 'play',
      gameRoom: playerGameRoom,
    };
  }
  if (role === 'host') {
    const hostGameRoom = useP2pGameRoomAsHost();  
    if (hostGameRoom === null) {
      // return null;
      throw new Error('You are not a host in this game table');
    }
    return {
      role: 'host',
      gameRoom: hostGameRoom,
    };
  }

  throw new Error('Invalid role for getting BFG game room: ' + role);
}


// const adaptP2pGameRoomToRole = (p2pGameRoom: IP2pGameRoomValue, role: GameTableAccessRole): IBfgGameRoomForRole => {
//   if (role === 'watch') {
//     return {
//       role: 'watch',
//       gameRoom: p2pGameRoom,
//     };
//   }
  
//   if (role === 'play') {
//     return {
//       role: 'play',
//       gameRoom: p2pGameRoom,
//     };
//   }
  
//   if (role === 'host') {
//     return {
//       role: 'host',
//       gameRoom: p2pGameRoom,
//     };
//   }

//   throw new Error('Invalid role for adapting BFG game room: ' + role);
// }


export const useBfgGameRoomForContextRole = (): IBfgGameRoomForRole | null => {
  const p2pGameRoom = useP2pGameRoomContext();
  const { requestedRole } = p2pGameRoom;
  // const roomForRole = adaptP2pGameRoomToRole(p2pGameRoom, requestedRole);
  const roomForRole = useBfgGameRoomForRole(requestedRole);
  return roomForRole;
}
