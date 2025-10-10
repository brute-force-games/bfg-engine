import { Container, TabsContainerPanel } from "bfg-ui-components"

// Simple icon components
const Groups = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const Wifi = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
  </svg>
);
import { useCallback, useEffect } from "react"
import { useGameRegistry } from "~/hooks/games-registry/games-registry"
import { useHostedP2pGame } from "~/hooks/p2p/use-hosted-p2p-game"
import { useGameActions } from "~/hooks/stores/use-game-actions-store"
import { useHostedGame } from "~/hooks/stores/use-hosted-games-store"
import { useMyDefaultPlayerProfile } from "~/hooks/stores/use-my-player-profiles-store"
import { GameTable } from "~/models/game-table/game-table"
import { GameTableId } from "~/models/types/bfg-branded-ids"
import { asHostApplyMoveFromPlayer } from "~/ops/game-table-ops/as-host-apply-move-from-player"
import { matchPlayerToSeat } from "~/ops/game-table-ops/player-seat-utils"
import { addGameAction } from "~/tb-store/hosted-game-actions-store"
import { updateHostedGame } from "~/tb-store/hosted-games-store"
import { P2pConnectionComponent } from "../components/p2p-connection-component"
import { HostedGameView } from "../components/hosted-game-view"
import { PlayerGameView } from "../components/player-game-view"
import { HostedGameDetailsComponent } from "../components/host-game-details-component"


interface HostedP2pGameComponentProps {
  gameTableId: GameTableId
}


export const HostedP2pGameComponent = ({ gameTableId }: HostedP2pGameComponentProps) => {

  const hostPlayerProfile = useMyDefaultPlayerProfile();
  const gameRegistry = useGameRegistry();
  
  const hostedGame = useHostedGame(gameTableId);
  const gameActions = useGameActions(gameTableId);

  const hostedP2pGame = useHostedP2pGame(hostedGame, hostPlayerProfile);
  const { peerProfiles, playerProfiles, room, getPlayerMove, sendGameTableData, sendGameActionsData, connectionEvents, refreshConnection } = hostedP2pGame;

  if (!hostPlayerProfile) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Profile...</h1>
        <div className="text-gray-600">Loading profile details...</div>
      </div>
    )
  }

  if (!hostedGame) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
        <div className="text-gray-600">Loading game details...</div>
      </div>
    )
  }

  const myPlayerSeat = matchPlayerToSeat(hostPlayerProfile.id, hostedGame);

  if (!myPlayerSeat) {
    console.log("You are not at this game table")
    console.log("hostedGame", hostedGame)
    console.log("myPlayerSeat", myPlayerSeat)
    console.log("hostPlayerProfile.id", hostPlayerProfile.id)
    console.log("hostedGame.gameHostPlayerProfileId", hostedGame.gameHostPlayerProfileId)
    return <div>You are not at this game table</div>;
  }

  // Get game metadata and validate the move with the schema
  const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);
  const gameActionSchema = gameMetadata.processor.gameActionJsonSchema;
  

  const doSendGameData = useCallback(() => {
    if (hostedGame && gameActions) {
      const gameData: GameTable = {
        ...hostedGame,
      }

      console.log('🎮 Host sending game data:', gameData)
      console.log('🎮 Host sending game actions:', gameActions)
      sendGameTableData(gameData);
      sendGameActionsData(gameActions);
    } else {
      console.log('🎮 Host cannot send game data - missing:', { hostedGame: !!hostedGame, gameActions: !!gameActions })
    }
  }, [hostedGame, gameActions, sendGameTableData, sendGameActionsData])

  useEffect(() => {
    doSendGameData();
  }, [doSendGameData])

  // Handle peer connections
  room.onPeerJoin((_peer: string) => {
    doSendGameData();
  })

  const handlePlayerMove = async (move: unknown) => {
    // Parse JSON string to object if needed
    let moveData = move;
    if (typeof move === 'string') {
      try {
        moveData = JSON.parse(move);
      } catch (e) {
        console.error('❌ Failed to parse move JSON:', e);
        console.error('Move data:', move);
        return;
      }
    }

    // Validate and parse the move using the game's action schema
    const parseResult = gameActionSchema.safeParse(moveData);
    
    if (!parseResult.success) {
      console.error('❌ Invalid move received:', parseResult.error);
      console.error('Move data:', moveData);
      return;
    }
    
    const validatedMove = parseResult.data;
    console.log('✅ HOST RECEIVED validated move:', validatedMove);
    
    const moveResult = await asHostApplyMoveFromPlayer(gameRegistry, hostedGame, gameActions, hostPlayerProfile.id, validatedMove);
    if (moveResult) {
      const updatedGameTable = moveResult.gameTable;
      const updatedGameAction = moveResult.gameAction;
      updateHostedGame(hostedGame.id, updatedGameTable);
      addGameAction(hostedGame.id, updatedGameAction);
    }
  }

  
  getPlayerMove(async (move: unknown, peer: string) => {
    console.log('Received player move from peer:', peer, move);
    await handlePlayerMove(move);
  })


  // return (
  //   <HostedGameView
  //     myPlayerProfile={hostPlayerProfile}
  //     onPlayerGameAction={handlePlayerMove}
  //     myPlayerSeat={myPlayerSeat}
  //     hostedGame={hostedGame}
  //     gameActions={gameActions}
  //     peerProfiles={peerProfiles}
  //     playerProfiles={playerProfiles}
  //   />
  // )

  return (
    <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
      <TabsContainerPanel
        tabs={[
          {
            title: "Hosted Game",
            icon: <Groups />,
            content: (
              <HostedGameView
                myPlayerProfile={hostPlayerProfile}
                onPlayerGameAction={handlePlayerMove}
                myPlayerSeat={myPlayerSeat}
                hostedGame={hostedGame}
                gameActions={gameActions}
                peerProfiles={peerProfiles}
                playerProfiles={playerProfiles}
              />
            )
          },
          {
            title: "Player Game",
            icon: <Groups />,
            content: (
              <PlayerGameView
                myPlayerProfile={hostPlayerProfile}
                myPlayerSeat={myPlayerSeat}
                gameTable={hostedGame}
                gameActions={gameActions}
                onPlayerGameAction={handlePlayerMove}
              />

            )
          },
          {
            title: "Host Details",
            icon: <Groups />,
            content: (
              <HostedGameDetailsComponent
                hostedGame={hostedGame}
                gameActions={gameActions}
              />
            )
          },
          {
            title: "P2P",
            icon: <Wifi />,
            content: (
              <P2pConnectionComponent
                connectionStatus={hostedP2pGame.connectionStatus}
                connectionEvents={connectionEvents}
                peerProfiles={hostedP2pGame.peerProfiles}
                playerProfiles={hostedP2pGame.playerProfiles}
                onResendLobbyData={doSendGameData}
                onRefreshConnection={refreshConnection}
              />
            )
          },
        ]}
        tabColor="linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
        ariaLabel="player lobby tabs"
      />
    </Container>
  )
}
