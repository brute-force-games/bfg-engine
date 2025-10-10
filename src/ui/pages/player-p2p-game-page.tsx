import { useMyDefaultPlayerProfile } from "~/hooks/stores/use-my-player-profiles-store";
import { PlayerP2pGameComponent } from "../components/player-p2p-game-component";
import { GameTableId } from "~/models/types/bfg-branded-ids";


interface PlayerGamePageProps {
  gameTableId: GameTableId;
}

export const PlayerGamePage = ({ gameTableId }: PlayerGamePageProps) => {
  // const { tableId } = Route.useParams() // tableId is now properly typed as GameTableId
  
  const myPlayerProfile = useMyDefaultPlayerProfile();

  if (!myPlayerProfile) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
        <div className="text-gray-600">Loading game details...</div>
      </div>
    )
  }

  return (
    <PlayerP2pGameComponent
      gameTableId={gameTableId}
      playerProfile={myPlayerProfile}
    />
  )
}
