import { Container, Groups, TabsContainerPanel, Wifi } from "../bfg-ui"
import { useCallback, useEffect } from "react"
import { HostedGameView } from "./hosted-game-view"
import { asHostApplyMoveFromPlayer } from "../../ops/game-table-ops/as-host-apply-move-from-player"
import { matchPlayerToSeat } from "../../ops/game-table-ops/player-seat-utils"
import { useHostedP2pGame } from "../../hooks/p2p/use-hosted-p2p-game"
import { useGameActions } from "../../hooks/stores/use-game-actions-store"
import { useHostedGame } from "../../hooks/stores/use-hosted-games-store"
import { useMyDefaultPlayerProfile } from "../../hooks/stores/use-my-player-profiles-store"
import { GameTable } from "../../models/game-table/game-table"
import { useGameRegistry } from "../../hooks/games-registry/games-registry"
import { addGameAction } from "../../tb-store/hosted-game-actions-store"
import { updateHostedGame } from "../../tb-store/hosted-games-store"
import { GameTableId } from "../../models/types/bfg-branded-ids"
import { PlayerGameView } from "./player-game-view"
import { P2pConnectionComponent } from "./p2p-connection-component"
import { HostedGameDetailsComponent } from "./host-game-details-component"


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

  // const gameTitle = hostedGame.gameTitle;
  // const gameMetadata = registry.getGameMetadata(gameTitle);
  // const gameEngine = gameMetadata.processor as BfgGameEngineProcessor<
  //   z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>,
  //   z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>
  // >;

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
  room.onPeerJoin(_peer => {
    doSendGameData();
  })

  const handlePlayerMove = async (move: unknown) => {

    const parseResult = gameActionSchema.safeParse(move);
    if (!parseResult.success) {
      console.error('Invalid player move', parseResult.error);
      return;
    }

    const validatedMove = parseResult.data;

    // const actionJson = move as BfgGameSpecificGameStateTypedJson<BfgSupportedGameTitle>;
    // const playerMoveJson = gameEngine.parseGameSpecificActionJson(actionJson);
    // console.log('HOST RECEIVED playerMoveJson', playerMoveJson);
    
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
    <Container maxWidth="lg" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
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
