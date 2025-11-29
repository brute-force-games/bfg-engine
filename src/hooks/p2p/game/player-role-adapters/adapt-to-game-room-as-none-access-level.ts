import { GTAL_NONE } from "../../../../models/internal/user-game-perspective";
import { EmptyP2pDetails } from "../../p2p-types";
import type { GameRoomModeWithAccess, IBfgGameTableForAccessLevelNone } from "../p2p-game-types";


export const adaptToGameRoomAsNoneAccessLevel = (
  gameRoomUnknown: GameRoomModeWithAccess,
): IBfgGameTableForAccessLevelNone => {

  const retVal: IBfgGameTableForAccessLevelNone = {
    gameInstanceId: gameRoomUnknown.gameInstanceId,
    gameMetadata: null,
    accessLevel: GTAL_NONE,
    maxAllowedAccessLevel: GTAL_NONE,
    allowedLevels: [GTAL_NONE],
    p2pDetails: EmptyP2pDetails,
    gameRoom: null,
    publicGameDetails: null,
  };

  return retVal;
}
