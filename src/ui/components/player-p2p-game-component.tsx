import { PlayerGameView } from "../components/player-game-view"
import { IPlayerBfgGameDetails } from "@bfg-engine/hooks/p2p/game/p2p-game-types";


export const PlayerP2pGameComponent = (props: IPlayerBfgGameDetails) => {
  const {
    gameRoom,
    // gameActions,
    watcherGameEvents,
    playerGameEvents,
    gameMetadata,
    myPlayerProfile,
    myPlayerSeat,
    // myPrivatePlayerKnowledgeStr,
    onPlayerAction,
    allPlayerProfiles,
  } = props;

  if (!gameRoom) {
    return (
      <div>
        Oops! Loading P2P Game...
      </div>
    )
  }

  if (!myPlayerSeat) {
    return <div>You do not have a seat in this game.</div>;
  }

  const latestWatcherGameEvent = watcherGameEvents[watcherGameEvents.length - 1];
  const latestPlayerGameEvent = playerGameEvents[playerGameEvents.length - 1];

  return (
    <PlayerGameView
      myPlayerProfile={myPlayerProfile}
      myPlayerSeat={myPlayerSeat}
      gameRoom={gameRoom}
      gameMetadata={gameMetadata}
      allPlayerProfiles={allPlayerProfiles}
      // gameActions={gameActions}
      // myPrivatePlayerKnowledgeStr={myPrivatePlayerKnowledgeStr}
      latestWatcherGameEvent={latestWatcherGameEvent}
      latestPlayerGameEvent={latestPlayerGameEvent}
      watcherGameEvents={watcherGameEvents}
      playerGameEvents={playerGameEvents}
      onPlayerAction={onPlayerAction}
    />
  )
}
