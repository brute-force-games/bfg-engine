import { PlayerGameView } from "../components/player-game-view"
import { IPlayerBfgGameDetails } from "~/hooks/p2p/game/p2p-game-types";


export const PlayerP2pGameComponent = (props: IPlayerBfgGameDetails) => {
  const {
    gameTable,
    gameActions,
    gameMetadata,
    myPlayerProfile,
    myPlayerSeat,
    myPrivatePlayerKnowledgeStr,
    onPlayerAction,
    allPlayerProfiles,
  } = props;

  if (!gameTable || !gameActions) {
    return (
      <div>
        Oops! Loading P2P Game...
      </div>
    )
  }

  if (!myPlayerSeat) {
    return <div>You do not have a seat in this game.</div>;
  }
  
  return (
    <PlayerGameView
      myPlayerProfile={myPlayerProfile}
      myPlayerSeat={myPlayerSeat}
      gameTable={gameTable}
      gameMetadata={gameMetadata}
      allPlayerProfiles={allPlayerProfiles}
      gameActions={gameActions}
      myPrivatePlayerKnowledgeStr={myPrivatePlayerKnowledgeStr}
      onPlayerAction={onPlayerAction}
    />
  )
}
