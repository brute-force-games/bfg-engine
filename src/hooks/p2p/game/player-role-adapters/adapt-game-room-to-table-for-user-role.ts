import type { PrivatePlayerProfile } from "../../../..";
import type { UserGameRole } from "../../../../models/internal/user-game-perspective";
import type { GameRoomModeWithAccess, IBfgGameTableValue } from "../p2p-game-types";
import { adaptToGameRoomAsPlayer } from "../player/adapt-to-game-room-as-player";
import { adaptToGameRoomAsObserver } from "../watcher/adapt-to-game-room-as-observer";
import { adaptToGameRoomAsNoneAccessLevel } from "./adapt-to-game-room-as-none-access-level";


export const adaptGameRoomWithUnknownAccessModeToTableForUserRole = (
  gameRoomUnknown: GameRoomModeWithAccess,
  playerProfile: PrivatePlayerProfile,
  myRequestedGameRole: UserGameRole | null,

): IBfgGameTableValue => {

  if (myRequestedGameRole === null) {
    return adaptToGameRoomAsNoneAccessLevel(gameRoomUnknown);
  }

  if (myRequestedGameRole.accessLevel === 'observer') {
    const adaptedForObserver = adaptToGameRoomAsObserver(gameRoomUnknown);
    return adaptedForObserver;
  }

  if (myRequestedGameRole.accessLevel === 'player') {
    const adaptedForPlayer = adaptToGameRoomAsPlayer(gameRoomUnknown, playerProfile);
    return adaptedForPlayer;
  }

  throw new Error('Invalid game role: ' + myRequestedGameRole.accessLevel);
}