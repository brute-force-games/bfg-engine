// import { IBfgGameRoomValue } from "./p2p-game-types";
// import { useHostedGame } from "@bfg-engine/hooks/stores/use-hosted-games-store";
// import { useMyDefaultPlayerProfile } from "@bfg-engine/hooks/stores/use-my-player-profiles-store";
// import { useP2pGameRoomAsObserver } from "./use-p2p-game-room-as-observer";
// import { useP2pGameRoomAsHost } from "./use-p2p-game-room-as-host";
// import { useP2pGameRoomAsPlayer } from "./use-p2p-game-room-as-player";
// import { isProfileIdOkForPlayerAccess, isProfileOkForHostAccess } from "@bfg-engine/models/game-table/utils";
// import { GameTableAccessLevel } from "@bfg-engine/models/game-roles";
// import { BfgGameTableId } from "@bfg-engine/models/types/bfg-branded-uuids";
// import { PrivatePlayerProfile } from "@bfg-engine/models/player-profile/private-player-profile";
// import { useP2pGameRoomContext } from "./p2p-game-room-context";
// import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../../../game-metadata/metadata-types/game-state-types";
// import type { BfgGameActionByPlayer, BfgGameActionByHost } from "../../../game-metadata/metadata-types/game-action-types";
// import type { IBfgGameRoomForAccessLevel } from "./p2p-game-types";


// interface RoomUserDetails {
//   currentAccessRole: GameTableAccessLevel;
//   maxAllowedAccessRole: GameTableAccessLevel;
//   allowedRoles: GameTableAccessLevel[];

//   myPlayerProfile: PrivatePlayerProfile | null;
//   myHostProfile: PrivatePlayerProfile | null;
// }


// export const useRoomUserDetails = (gameTableId: BfgGameTableId, requestedRole: GameTableAccessLevel): RoomUserDetails => {
//   const myPlayerProfile = useMyDefaultPlayerProfile();
//   const hostedGame = useHostedGame(gameTableId);
  
//   if (!myPlayerProfile) {
//     return {
//       currentAccessRole: 'watch',
//       maxAllowedAccessRole: 'watch',
//       allowedRoles: ['watch'],

//       myPlayerProfile: null,
//       myHostProfile: null,
//     };
//   }
  
//   const amIHost = hostedGame !== null &&
//     isProfileOkForHostAccess(myPlayerProfile, hostedGame);

//   if (amIHost) {
//     const amIPlayer = hostedGame !== null &&
//       isProfileIdOkForPlayerAccess(myPlayerProfile.id, hostedGame);

//     return {
//       currentAccessRole: requestedRole,
//       maxAllowedAccessRole: 'host',
//       allowedRoles: amIPlayer ? ['host', 'play', 'watch'] : ['host', 'watch'],

//       myPlayerProfile: amIPlayer ? myPlayerProfile : null,
//       myHostProfile: myPlayerProfile,
//     };
//   }

//   return {
//     currentAccessRole: requestedRole,
//     maxAllowedAccessRole: 'play',
//     allowedRoles: ['play', 'watch'],
//     myPlayerProfile: myPlayerProfile,
//     myHostProfile: null,
//   };
// }


// export const useBfgGameRoomForRole = <
//   GSH extends BfgGameStateForHost,
//   GSP extends BfgGameStateForPlayer,
//   GSW extends BfgGameStateForWatcher,
//   PGA extends BfgGameActionByPlayer,
//   HGA extends BfgGameActionByHost,
// > (role: GameTableAccessLevel): IBfgGameRoomForAccessLevel<GSH, GSP, GSW, PGA, HGA> | null => {
//   if (role === 'watch') {
//     return useP2pGameRoomAsObserver();
//   }
//   if (role === 'play') {
//     return useP2pGameRoomAsPlayer();
//   }
//   if (role === 'host') {
//     return useP2pGameRoomAsHost();
//   }

//   throw new Error('Invalid role for getting BFG game room: ' + role);
// }


// // const adaptP2pGameRoomToRole = (p2pGameRoom: IP2pGameRoomValue, role: GameTableAccessLevel): IBfgGameRoomForAccessLevel => {
// //   if (role === 'watch') {
// //     return {
// //       role: 'watch',
// //       gameRoom: p2pGameRoom,
// //     };
// //   }
  
// //   if (role === 'play') {
// //     return {
// //       role: 'play',
// //       gameRoom: p2pGameRoom,
// //     };
// //   }
  
// //   if (role === 'host') {
// //     return {
// //       role: 'host',
// //       gameRoom: p2pGameRoom,
// //     };
// //   }

// //   throw new Error('Invalid role for adapting BFG game room: ' + role);
// // }


// export const useMetadataForRoomGame = <
//   GSH extends BfgGameStateForHost,
//   GSP extends BfgGameStateForPlayer,
//   GSW extends BfgGameStateForWatcher,
//   PGA extends BfgGameActionByPlayer,
//   HGA extends BfgGameActionByHost,
// > (): IBfgGameRoomValue<GSH, GSP, GSW, PGA, HGA> | null => {
//   const p2pGameRoom = useP2pGameRoomContext();
//   const { gameTable } = p2pGameRoom;
//   // const { requestedRole } = p2pGameRoom;
//   // const roomForRole = adaptP2pGameRoomToRole(p2pGameRoom, requestedRole);
//   const roomForRole = useBfgGameRoomForRole(requestedRole);
//   return roomForRole;
// }
