import type { GameTableAccessLevel } from "../../../models/internal/user-game-perspective";
import type { PublicPlayerProfile } from "../../../models/internal/player-profile/public-player-profile";
import type { HydratedLatestGameSnapshot } from "../../../models/internal/game-room-snapshot";


// export const getLatestGameSnapshot = (
//   hostedGameRoom: IHostedGameRoomValue | null,
//   p2pGameRoom: IP2pGameRoomValue,
// ): HydratedLatestGameSnapshot | null => {

//   if (hostedGameRoom !== null) {
//     const latestHostGameSnapshot = {
//       gameRoom: hostedGameRoom.hostedGame,
//       boardEvents: hostedGameRoom.hostedGameBoardEvents,
//       latestStepIndex: hostedGameRoom.latestStepIndex,
//     } satisfies HydratedLatestGameSnapshot;

//     return latestHostGameSnapshot;
//   }

//   const userGameRoom = p2pGameRoom.userGameRoom;
//   if (userGameRoom === null) {
//     return null;
//   }

//   const latestGameSnapshot = {
//     gameRoom: userGameRoom.gameRoom,
//     boardEvents: userGameRoom.boardEvents,
//     latestStepIndex: userGameRoom.latestStepIndex,
//   } satisfies HydratedLatestGameSnapshot;

//   return latestGameSnapshot;
// }


export const getAllowedRolesForPlayerProfile = (
  latestGameSnapshot: HydratedLatestGameSnapshot | null,
  playerProfile: PublicPlayerProfile | null,
): readonly GameTableAccessLevel[] => {

  if (latestGameSnapshot === null || playerProfile === null) {
    return ['observer'];
  }

  const allowedRoles: GameTableAccessLevel[] = ['observer'];

  const players = latestGameSnapshot.gameRoom.players;
  const player = players.find(player => player.playerProfile.id === playerProfile.id);
  if (player !== undefined) {
    allowedRoles.push('player');
  }

  if (latestGameSnapshot.gameRoom.gameHostPlayerProfileId === playerProfile.id) {
    allowedRoles.push('host');
  }
  
  return allowedRoles;
}
