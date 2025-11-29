import { getGameMetadata } from "../../../../game-metadata/games-registry";
import type { PrivatePlayerProfile } from "../../../../models/internal/player-profile/private-player-profile";
import { EmptyP2pDetails } from "../../p2p-types";
import { useGamePerspectiveDetailsFromRawP2pRoom } from "../game-perspective-details-from-raw-p2p-room-hook";
import type { GameRoomModeP2pOnlyAccess, IBfgGameTableForObserver, IPublicBfgGameDetails } from "../p2p-game-types";


export const usePublicGameTableForObserverFromP2p = (
  gameRoomForP2p: GameRoomModeP2pOnlyAccess,
  myDefaultPlayerProfile: PrivatePlayerProfile | null,
): IBfgGameTableForObserver => {

  const p2pRawRoom = gameRoomForP2p.p2pRawRoom;

  const gamePerspectiveDetails = useGamePerspectiveDetailsFromRawP2pRoom(p2pRawRoom);

  // If the role is not 'watcher', return a structure with null values to indicate data isn't ready yet
  if (gamePerspectiveDetails.role !== 'watcher') {
    console.log('🔍 Observer: Role is not watcher, current role:', gamePerspectiveDetails.role);
    const retVal: IBfgGameTableForObserver = {
      gameInstanceId: p2pRawRoom.gameInstanceId,
      gameMetadata: null,
      accessLevel: 'observer',
      maxAllowedAccessLevel: 'observer',
      allowedLevels: ['observer'],
      myObserverProfile: myDefaultPlayerProfile,
      p2pDetails: EmptyP2pDetails,
      publicGameDetails: null,
    };
    return retVal;
  }

  console.log('🔍 Observer: Role is watcher, processing game data');

  const publicGameRoom = gamePerspectiveDetails.gameRoom;
  const publicGameMetadata = getGameMetadata(publicGameRoom.gameTitle);
  if (!publicGameMetadata) {
    // Return null metadata if game metadata not found
    const retVal: IBfgGameTableForObserver = {
      gameInstanceId: p2pRawRoom.gameInstanceId,
      gameMetadata: null,
      accessLevel: 'observer',
      maxAllowedAccessLevel: 'observer',
      allowedLevels: ['observer'],
      myObserverProfile: myDefaultPlayerProfile,
      p2pDetails: EmptyP2pDetails,
      publicGameDetails: null,
    };
    return retVal;
  }

  const watcherGameEvents = gamePerspectiveDetails.watcherGameHistory;
  console.log('🔍 Observer: watcherGameEvents length:', watcherGameEvents.length);
  const latestWatcherGameEvent = watcherGameEvents[watcherGameEvents.length - 1];
  console.log('🔍 Observer: latestWatcherGameEvent:', latestWatcherGameEvent ? 'exists' : 'missing');

  if (!latestWatcherGameEvent) {
    console.warn('🔍 Observer: No watcher game events available, returning null publicGameDetails');
    const retVal: IBfgGameTableForObserver = {
      gameInstanceId: p2pRawRoom.gameInstanceId,
      gameMetadata: publicGameMetadata,
      accessLevel: 'observer',
      maxAllowedAccessLevel: 'observer',
      allowedLevels: ['observer'],
      myObserverProfile: myDefaultPlayerProfile,
      p2pDetails: EmptyP2pDetails,
      publicGameDetails: null,
    };
    return retVal;
  }

  const publicGameDetails: IPublicBfgGameDetails = {
    gameMetadata: publicGameMetadata,
    gameRoom: publicGameRoom,
    latestWatcherGameEvent,
    watcherGameEvents,
    allPlayerProfiles: new Map(),
  }
  
  console.log('🔍 Observer: Created publicGameDetails successfully');

  const retVal: IBfgGameTableForObserver = {
    gameInstanceId: p2pRawRoom.gameInstanceId,
    gameMetadata: publicGameMetadata,
    accessLevel: 'observer',
    maxAllowedAccessLevel: 'observer',
    allowedLevels: ['observer'],
    myObserverProfile: myDefaultPlayerProfile,
    p2pDetails: EmptyP2pDetails,
    publicGameDetails,
  }

  return retVal;
  

  // const myGamePlayerProfile = publicGameDetails?.gameRoom.players
  //   .find(player => player.playerProfile.id === myDefaultPlayerProfile?.id)?.playerProfile ?? null;
  // const myGameHostProfile = publicGameDetails?.gameRoom.players
  //   .find(player => player.playerProfile.id === myDefaultPlayerProfile?.id)?.playerProfile ?? null;

  // const myPlayerProfile = myGamePlayerProfile !== null ? myDefaultPlayerProfile : null;
  // const myHostProfile = myGameHostProfile !== null ? myDefaultPlayerProfile : null;

  // const roomUserDetails: RoomUserDetails = {
  //   currentAccessLevel: 'observer',
  //   maxAllowedAccessLevel: 'observer',
  //   allowedLevels: ['observer'],
  //   myPlayerProfile,
  //   myHostProfile,
  // };

  // const retVal: IBfgGameTableForObserver = {
  //   gameInstanceId: p2pRawRoom.gameInstanceId,
  //   gameMetadata: publicGameDetails?.gameMetadata ?? null,

  //   accessLevel: 'observer',
  //   maxAllowedAccessLevel: roomUserDetails.maxAllowedAccessLevel,
  //   allowedLevels: roomUserDetails.allowedLevels,

  //   myObserverProfile: null,

  //   p2pDetails,
  //   publicGameDetails,
  // }

  // return retVal;
}
