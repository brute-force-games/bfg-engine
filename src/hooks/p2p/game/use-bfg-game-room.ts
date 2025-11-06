import { IBfgGameRoomValue } from "./p2p-game-types";
import { useHostedGame } from "~/hooks/stores/use-hosted-games-store";
import { useMyDefaultPlayerProfile } from "~/hooks/stores/use-my-player-profiles-store";
import { useP2pGameRoomAsObserver } from "./use-p2p-game-room-as-observer";
import { useP2pGameRoomAsHost } from "./use-p2p-game-room-as-host";
import { useP2pGameRoomAsPlayer } from "./use-p2p-game-room-as-player";
import { isProfileIdOkForPlayerAccess, isProfileOkForHostAccess } from "~/models/game-table/utils";
import { GameTableAccessRole } from "~/models/game-roles";
import { GameTableId } from "~/models/types/bfg-branded-ids";
import { PrivatePlayerProfile } from "~/models/player-profile/private-player-profile";
import { useP2pGameRoomContext } from "./p2p-game-room-context";


// interface RoomObserverDetails {
//   maxAllowedAccessRole: 'watch';
//   allowedRoles: ['watch'];
// }

// interface RoomPlayerDetails {
//   maxAllowedAccessRole: 'play';
//   allowedRoles: ['play', 'watch'];
//   myPlayerProfile: PrivatePlayerProfile;
// }

// interface RoomHostDetails {
//   maxAllowedAccessRole: 'host';
//   allowedRoles: ['host', 'play', 'watch'];
//   myPlayerProfile: PrivatePlayerProfile | null;
//   myHostProfile: PrivatePlayerProfile;
// }

interface RoomUserDetails {
  currentAccessRole: GameTableAccessRole;
  maxAllowedAccessRole: GameTableAccessRole;
  allowedRoles: GameTableAccessRole[];

  myPlayerProfile: PrivatePlayerProfile | null;
  myHostProfile: PrivatePlayerProfile | null;
}


export const useRoomUserDetails = (gameTableId: GameTableId, requestedRole: GameTableAccessRole): RoomUserDetails => {
  const myPlayerProfile = useMyDefaultPlayerProfile();
  const hostedGame = useHostedGame(gameTableId);
  
  if (!myPlayerProfile) {
    return {
      currentAccessRole: 'watch',
      maxAllowedAccessRole: 'watch',
      allowedRoles: ['watch'],

      myPlayerProfile: null,
      myHostProfile: null,
    };
  }
  
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

// export const useBfgGameRoom = (requestedRole: GameTableAccessRole): IBfgGameRoomValue | null => {
//   const p2pGameRoom = useP2pGameRoomContext();

//   const myPlayerProfile = useMyDefaultPlayerProfile();
//   const { gameTableId } = p2pGameRoom;

//   const maxAllowedAccessRole = useMaxAllowedAccessRole(gameTableId, requestedRole);

//   if (!myPlayerProfile) {
//     const p2pGame = useP2pGameAsObserver(p2pGameRoom, 'watch');
//     return p2pGame;
//   }

//   // const hostedGame = useHostedGame(gameTableId);
//   // const amIHost = hostedGame !== null &&
//   //   isProfileOkForHostAccess(myPlayerProfile, hostedGame);

//   // const maxAllowedAccessRole = amIHost ? 'host' : 'play';

//   if (requestedRole === 'watch') {
//     const p2pGame = useP2pGameAsObserver(p2pGameRoom, maxAllowedAccessRole);
//     return p2pGame;
//   }

//   if (requestedRole === 'host') {
//     if (!amIHost) {
//       throw new Error('Not authorized to access this game as host');
//     }

//     const p2pGame = useP2pGameAsHost(p2pGameRoom, maxAllowedAccessRole);
//     return p2pGame;
//   }

//   if (requestedRole === 'play') {
//     const p2pGame = useP2pGameAsPlayer(p2pGameRoom, maxAllowedAccessRole);
//     return p2pGame;
//   }

//   throw new Error('Invalid requested role for game table: ' + gameTableId + ' and role: ' + requestedRole);
// }


// export const useP2pGameRoomAsObserver = (): IBfgGameRoomForObserver | null => {
//   const p2pGame = useP2pGameAsObserver();
//   return p2pGame as IBfgGameRoomForObserver | null;
// }

// export const useP2pGameRoomAsPlayer = (): IBfgGameRoomForPlayer | null => {
//   const p2pGame = useP2pGameAsPlayer();
//   return p2pGame as IBfgGameRoomForPlayer | null;
// }

// export const useP2pGameRoomAsHost = (): IBfgGameRoomForHost | null => {
//   const p2pGame = useP2pGameAsHost();
//   return p2pGame as IBfgGameRoomForHost | null;
// }


export const useBfgGameRoomForRole = (role: GameTableAccessRole): IBfgGameRoomValue | null => {
  if (role === 'watch') {
    return useP2pGameRoomAsObserver();
  }
  if (role === 'play') {
    return useP2pGameRoomAsPlayer();
  }
  if (role === 'host') {
    return useP2pGameRoomAsHost();
  }

  throw new Error('Invalid role for getting BFG game room: ' + role);
}


export const useBfgGameRoomForContextRole = (): IBfgGameRoomValue | null => {
  const p2pGameRoom = useP2pGameRoomContext();
  const { requestedRole } = p2pGameRoom;
  const roomForRole = useBfgGameRoomForRole(requestedRole);
  return roomForRole;
}
