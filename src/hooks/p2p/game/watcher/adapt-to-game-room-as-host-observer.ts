// import { IBfgGameTableForObserver, IPublicBfgGameDetails, type GameRoomModeHostOnlyAccess, type GameRoomModeHostPlusP2pAccess, type IP2pDetails } from "../p2p-game-types";
// import { useGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry-hook";
// import { useGameInstanceUserDetails } from "../use-bfg-game-instance";
// import { useLatestHostedGameSnapshot } from "../../../../tb-store/games-archives-store";
// import { areAllSet } from "../../../../game-stock/mechanics/utils";


// export const adaptToGameRoomAsHostObserver = (
//   gameRoomForHost: GameRoomModeHostOnlyAccess | GameRoomModeHostPlusP2pAccess,
//   p2pDetails: IP2pDetails,
// ): IBfgGameTableForObserver => {

//   const p2pGameRoom = gameRoomForHost;
//   const roomUserDetails = useGameInstanceUserDetails(p2pGameRoom.gameInstanceId, 'observer');

//   const latestHostedGameSnapshot = useLatestHostedGameSnapshot(p2pGameRoom.gameInstanceId);

//   const gameRegistry = useGameRegistry();
//   const gameTitle = latestHostedGameSnapshot?.gameRoom.gameTitle;
//   const gameMetadata = gameTitle ? gameRegistry.getGameMetadata(gameTitle) : null;

//   const values = [latestHostedGameSnapshot, gameMetadata] as const;
//   if (!areAllSet(values)) {
//     const retVal: IBfgGameTableForObserver = {
//       gameInstanceId: p2pGameRoom.gameInstanceId,
//       gameMetadata: null,

//       accessLevel: 'observer',
//       maxAllowedAccessLevel: roomUserDetails.maxAllowedAccessLevel,
//       allowedLevels: roomUserDetails.allowedLevels,

//       myObserverProfile: null,

//       p2pDetails,
//       publicGameDetails: null,
//     };
//     return retVal;
//   }

//   const [snapshot, metadata] = values;
//   const watcherGameEvents = snapshot.boardEvents.map(boardEvent => 
//     metadata.accessLevelAdapters.hostEventTransitionToWatcherAccessLevelAdapter(boardEvent)
//   );
//   const latestWatcherGameEvent = watcherGameEvents[watcherGameEvents.length - 1];

//   const allPlayerProfiles = snapshot.gameRoom.players.map(player => player.playerProfile);
//   const allPlayerProfilesMap = new Map(allPlayerProfiles.map(playerProfile => [playerProfile.id, playerProfile]));

//   const publicGameDetails: IPublicBfgGameDetails = {
//     gameMetadata: metadata,
//     gameRoom: snapshot.gameRoom,
//     latestWatcherGameEvent,
//     watcherGameEvents,
//     allPlayerProfiles: allPlayerProfilesMap,
//   };

//   const retVal: IBfgGameTableForObserver = {
//     gameInstanceId: p2pGameRoom.gameInstanceId,
//     gameMetadata: metadata,

//     accessLevel: 'observer',
//     maxAllowedAccessLevel: roomUserDetails.maxAllowedAccessLevel,
//     allowedLevels: roomUserDetails.allowedLevels,

//     myObserverProfile: null,

//     p2pDetails,
//     publicGameDetails,
//   }

//   return retVal;
// }
