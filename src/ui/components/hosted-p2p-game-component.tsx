import { Container, TabsContainerPanel, Groups, Wifi } from "../../ui/bfg-ui"
import { useCallback, useEffect } from "react"
import { useGameRegistry } from "../../hooks/games-registry/games-registry"
import { useHostedP2pGame } from "../../hooks/p2p/use-hosted-p2p-game"
import { useGameActions } from "../../hooks/stores/use-game-actions-store"
import { useHostedGame } from "../../hooks/stores/use-hosted-games-store"
import { useMyDefaultPublicPlayerProfile } from "../../hooks/stores/use-my-player-profiles-store"
import { GameTable } from "../../models/game-table/game-table"
import { GameTableId } from "../../models/types/bfg-branded-ids"
import { asHostApplyMoveFromPlayer } from "../../ops/game-table-ops/as-host-apply-move-from-player"
import { matchPlayerToSeat } from "../../ops/game-table-ops/player-seat-utils"
import { addGameAction } from "../../tb-store/hosted-game-actions-store"
import { updateHostedGame } from "../../tb-store/hosted-games-store"
import { P2pConnectionComponent } from "../../ui/components/p2p-connection-component"
import { PlayerGameView } from "../../ui/components/player-game-view"
import { HostedGameView } from "../../ui/components/hosted-game-view"
import { HostedGameDetailsComponent } from "../../ui/components/host-game-details-component"
import { HostedGameTabId } from "./bfg-tabs"



interface HostedP2pGameComponentProps {
  gameTableId: GameTableId
  activeTabId: HostedGameTabId
}


export const HostedP2pGameComponent = ({
  gameTableId,
  activeTabId,
}: HostedP2pGameComponentProps) => {

  const hostPlayerProfile = useMyDefaultPublicPlayerProfile();
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
  

  return (
    <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
      <TabsContainerPanel<HostedGameTabId>
        activeTabId={activeTabId}
        tabs={[
          {
            id: "game-admin",
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
            id: "player-game",
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
            id: "hosted-game-details",
            icon: <Groups />,
            content: (
              <HostedGameDetailsComponent
                hostedGame={hostedGame}
                gameActions={gameActions}
              />
            )
          },
          {
            id: "host-p2p-details",
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
      />
    </Container>
  )
}
