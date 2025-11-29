import type { GameRoomModeHostOnlyAccess, GameRoomModeHostPlusP2pAccess, IBfgGameTableForObserver, IPublicBfgGameDetails } from "../p2p-game-types";
import { useGameRegistry } from "../../../games-registry/games-registry-hook";
import { useLatestHostedGameSnapshot } from "../../../../tb-store/games-archives-store";
import { areAllSet } from "../../../../game-stock/mechanics/utils";
import type { GameTableAccessLevel } from "../../../../models/internal/user-game-perspective";
import { EmptyP2pDetails } from "../../p2p-types";


export const usePublicGameTableForObserverFromHost = (
  gameRoom: GameRoomModeHostOnlyAccess | GameRoomModeHostPlusP2pAccess,
): IBfgGameTableForObserver => {

  const latestHostedGameSnapshot = useLatestHostedGameSnapshot(gameRoom.gameInstanceId);

  const gameRegistry = useGameRegistry();
  const gameTitle = latestHostedGameSnapshot?.gameRoom.gameTitle;
  const gameMetadata = gameTitle ? gameRegistry.getGameMetadata(gameTitle) : null;

  const maxAllowedAccessLevel = 'host';
  const allowedLevels: GameTableAccessLevel[] = ['host', 'player', 'observer'];
  const p2pDetails = EmptyP2pDetails;

  const values = [latestHostedGameSnapshot, gameMetadata] as const;
  if (!areAllSet(values)) {
    const retVal: IBfgGameTableForObserver = {
      gameInstanceId: gameRoom.gameInstanceId,
      gameMetadata: null,

      accessLevel: 'observer',
      maxAllowedAccessLevel,
      allowedLevels,

      myObserverProfile: null,

      p2pDetails,
      publicGameDetails: null,
    };
    return retVal;
  }

  const [snapshot, metadata] = values;
  const watcherGameEvents = snapshot.boardEvents.map(boardEvent => 
    metadata.accessLevelAdapters.hostEventTransitionToWatcherAccessLevelAdapter(boardEvent)
  );
  const latestWatcherGameEvent = watcherGameEvents[watcherGameEvents.length - 1];

  const allPlayerProfiles = snapshot.gameRoom.players.map(player => player.playerProfile);
  const allPlayerProfilesMap = new Map(allPlayerProfiles.map(playerProfile => [playerProfile.id, playerProfile]));

  const publicGameDetails: IPublicBfgGameDetails = {
    gameMetadata: metadata,
    gameRoom: snapshot.gameRoom,
    latestWatcherGameEvent,
    watcherGameEvents,
    allPlayerProfiles: allPlayerProfilesMap,
  };

  const retVal: IBfgGameTableForObserver = {
    gameInstanceId: gameRoom.gameInstanceId,
    gameMetadata: metadata,

    accessLevel: 'observer',
    maxAllowedAccessLevel,
    allowedLevels,

    myObserverProfile: null,

    p2pDetails,
    publicGameDetails,
  }

  return retVal;
}
