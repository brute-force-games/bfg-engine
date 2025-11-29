import { useMyDefaultPlayerProfile } from "@bfg-engine/hooks/stores/use-my-player-profiles-store";
import { useGameRoomAsObserver } from "./use-game-room-as-observer";
import { useGameRoomAsHost } from "./use-game-room-as-host";
import { useGameRoomAsPlayer } from "./use-game-room-as-player";
import { isProfileIdOkForPlayerAccess, isProfileOkForHostAccess } from "@bfg-engine/models/game-table/utils";
import { GameTableAccessLevel } from "@bfg-engine/models/internal/user-game-perspective";
import { type BfgGameInstanceId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { PrivatePlayerProfile } from "@bfg-engine/models/internal/player-profile/private-player-profile";
import type { IBfgGameRoomForAccessLevel } from "./p2p-game-types";
import { useLatestHostedGameSnapshot } from "../../../tb-store/games-archives-store";


export interface RoomUserDetails {
  currentAccessLevel: GameTableAccessLevel;
  maxAllowedAccessLevel: GameTableAccessLevel;
  allowedLevels: GameTableAccessLevel[];

  myPlayerProfile: PrivatePlayerProfile | null;
  myHostProfile: PrivatePlayerProfile | null;
}


export const useGameInstanceUserDetails = (
  gameInstanceId: BfgGameInstanceId,
  requestedRole: GameTableAccessLevel,
): RoomUserDetails => {
  
  const myPlayerProfile = useMyDefaultPlayerProfile();
  const hostedGameSnapshot = useLatestHostedGameSnapshot(gameInstanceId);

  if (!myPlayerProfile) {
    return {
      currentAccessLevel: 'observer',
      maxAllowedAccessLevel: 'observer',
      allowedLevels: ['observer'],

      myPlayerProfile: null,
      myHostProfile: null,
    };
  }

  if (!hostedGameSnapshot) {
    return {
      currentAccessLevel: 'observer',
      maxAllowedAccessLevel: 'observer',
      allowedLevels: ['observer'],

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
      currentAccessLevel: requestedRole,
      maxAllowedAccessLevel: 'host',
      allowedLevels: amIPlayer ? ['host', 'player', 'observer'] : ['host', 'observer'],

      myPlayerProfile: amIPlayer ? myPlayerProfile : null,
      myHostProfile: myPlayerProfile,
    };
  }

  return {
    currentAccessLevel: requestedRole,
    maxAllowedAccessLevel: 'player',
    allowedLevels: ['player', 'observer'],
    myPlayerProfile: myPlayerProfile,
    myHostProfile: null,
  };
}


export const useBfgGameRoomForAccessLevel = (accessLevel: GameTableAccessLevel): IBfgGameRoomForAccessLevel | null => {
  if (accessLevel === 'observer') {
    const observerGameRoom = useGameRoomAsObserver();
    if (observerGameRoom.accessLevel === 'none') {
      // return null;
      throw new Error('You are not an observer in this game table');
    }
    return {
      accessLevel: 'observer',
      gameRoom: observerGameRoom,
    };
  }
  if (accessLevel === 'player') {
    const playerGameRoom = useGameRoomAsPlayer();
    if (playerGameRoom.accessLevel === 'none') {
      throw new Error('You are not a player in this game table');
    }
    return {
      accessLevel: 'player',
      gameRoom: playerGameRoom,
    };
  }
  if (accessLevel === 'host') {
    const hostGameRoom = useGameRoomAsHost();  
    if (hostGameRoom.accessLevel === 'none') {
      // return null;
      throw new Error('You are not a host in this game table');
    }
    return {
      accessLevel: 'host',
      gameRoom: hostGameRoom,
    };
  }

  throw new Error('Invalid role for getting BFG game room: ' + accessLevel);
}


// const adaptP2pGameRoomToRole = (p2pGameRoom: IP2pGameRoomValue, role: GameTableAccessLevel): IBfgGameRoomForAccessLevel => {
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


// export const useBfgGameRoomForContextRole = (): IBfgGameRoomForAccessLevel | null => {
//   const p2pGameRoom = useP2pGameRoomContext();
//   const { requestedRole } = p2pGameRoom;
//   // const roomForRole = adaptP2pGameRoomToRole(p2pGameRoom, requestedRole);
//   const roomForRole = useBfgGameRoomForRole(requestedRole);
//   return roomForRole;
// }
