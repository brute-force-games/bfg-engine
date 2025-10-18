import { useCallback, useEffect, useState } from "react"
import { Container, TabsContainerPanel, Groups, Wifi } from "../bfg-ui"
import { GameLobbyId, PlayerProfileId } from "../../models/types/bfg-branded-ids"
import { P2pConnectionComponent } from "../../ui/components/p2p-connection-component"
import { HostP2pLobbyDetails, PlayerP2pLobbyMove } from "../../models/p2p-details"
import { GameLobby, LobbyOptions } from "../../models/p2p-lobby"
import { playerTakeSeat } from "../../ops/game-lobby-ops/player-take-seat"
import { playerSetGameChoice } from "../../ops/game-lobby-ops/player-set-game-choice"
import { LobbyHostStateComponent } from "../../ui/components/lobby-host-state-component"
import { updateHostedLobbyPlayerPool } from "../../tb-store/hosted-lobbies-store"
import { playerLeaveSeat } from "../../ops/game-lobby-ops/player-leave-seat"
import { useHostedP2pLobby } from "../../hooks/p2p/use-hosted-p2p-lobby"
import { LobbyHostOptionsDialog } from "../../ui/components/dialogs/lobby-host-options-dialog"
import { LobbyPlayerStateComponent } from "../../ui/components/lobby-player-state-component"
import { BfgSupportedGameTitle } from "../../models/game-box-definition"
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile"
import { useGameRegistry } from "../../hooks/games-registry/games-registry"
import { HostedLobbyTabId } from "./bfg-tabs"


interface IHostedP2pLobbyComponentProps {
  lobbyId: GameLobbyId
  hostPlayerProfile: PublicPlayerProfile

  lobbyOptions: LobbyOptions
  lobbyState: GameLobby

  updateLobbyState: (lobbyState: GameLobby) => void

  setLobbyOptions: (lobbyOptions: LobbyOptions) => void
  setLobbyPlayerPool: (playerPool: PlayerProfileId[]) => void

  activeTabId: HostedLobbyTabId;
}

export const HostedP2pLobbyComponent = ({
  lobbyId,
  hostPlayerProfile,
  lobbyOptions,
  lobbyState,
  updateLobbyState,
  setLobbyPlayerPool,
  setLobbyOptions,
  activeTabId,
  }: IHostedP2pLobbyComponentProps) => {
  const [isLobbyOptionsDialogOpen, setIsLobbyOptionsDialogOpen] = useState(false);
  
  const hostedP2pLobby = useHostedP2pLobby(lobbyId, hostPlayerProfile);
  const { p2pLobby, connectionStatus, connectionEvents, peerProfiles, sendLobbyData, refreshConnection } = hostedP2pLobby;
  const { room, getPlayerMove, playerProfiles } = p2pLobby;
  const gameRegistry = useGameRegistry();


  const doSendLobbyData = useCallback(() => {
    if (lobbyState) {
      const lobbyData: HostP2pLobbyDetails = {
        hostPlayerProfile,
        lobbyOptions,
        lobbyState,
      }

      sendLobbyData(lobbyData);
    } else {
      console.log('no lobby details to send');
    }
  }, [hostPlayerProfile, lobbyOptions, lobbyState, sendLobbyData])

  useEffect(() => {
    doSendLobbyData();
  }, [doSendLobbyData])

  // Handle peer connections
  room.onPeerJoin((_peer: string) => {
    doSendLobbyData();
  })

  const applyPlayerMove = async (move: PlayerP2pLobbyMove, playerId: PlayerProfileId) => {
    console.log('applyPlayerMove', move, playerId);
    console.log('Received player move from peer:', playerId, move);

    switch (move.move) {
      case 'set-game-choice':
        const updatedLobbyForGameChoice = await playerSetGameChoice(gameRegistry, lobbyState, playerId, move.gameChoice);
        if (updatedLobbyForGameChoice) {
          updateLobbyState(updatedLobbyForGameChoice);
        }
        break;

      case 'take-seat':
        const updatedLobbyForSeat = await playerTakeSeat(gameRegistry, lobbyState, playerId);
        console.log('updatedLobbyForSeat', updatedLobbyForSeat);
        if (updatedLobbyForSeat) {
          updateHostedLobbyPlayerPool(lobbyId, updatedLobbyForSeat.playerPool as PlayerProfileId[]);
          updateLobbyState(updatedLobbyForSeat);
        }
        break;

      case 'leave-seat':
        const updatedLobbyForLeaveSeat = await playerLeaveSeat(gameRegistry, lobbyState, playerId);
        console.log('updatedLobbyForLeaveSeat', updatedLobbyForLeaveSeat);
        if (updatedLobbyForLeaveSeat) {
          updateHostedLobbyPlayerPool(lobbyId, updatedLobbyForLeaveSeat.playerPool as PlayerProfileId[]);
          updateLobbyState(updatedLobbyForLeaveSeat);
        }
        break;
      
      default:
        console.error('Unknown player move:', move);
        break;
    }
  }


  getPlayerMove(async (move: PlayerP2pLobbyMove, peer: string) => {
    const playerId = peerProfiles.get(peer)?.id;
    if (!playerId) {
      console.error('Player ID not found for peer:', peer);
      return;
    }
    await applyPlayerMove(move, playerId);
  })

  const onSetLobbyOptions = (lobbyOptions: LobbyOptions) => {
    setLobbyOptions(lobbyOptions);
    doSendLobbyData();
  }

  const handleOpenLobbyOptionsDialog = () => {
    setIsLobbyOptionsDialogOpen(true);
  };

  const handleCloseLobbyOptionsDialog = () => {
    setIsLobbyOptionsDialogOpen(false);
  };

  const handleSaveLobbyOptions = (updatedLobbyOptions: LobbyOptions) => {
    onSetLobbyOptions(updatedLobbyOptions);
  };

  const onSelectGameChoice = async (gameChoice: BfgSupportedGameTitle) => {
    await applyPlayerMove({ move: 'set-game-choice', gameChoice: gameChoice }, hostPlayerProfile.id);
    // sendPlayerMove({ move: 'set-game-choice', gameChoice: gameChoice });
  }
  const onTakeSeat = async () => {
    await applyPlayerMove({ move: 'take-seat' }, hostPlayerProfile.id);
    // sendPlayerMove({ move: 'take-seat' });
  }
  const onLeaveSeat = async () => {
    await applyPlayerMove({ move: 'leave-seat' }, hostPlayerProfile.id);
    // sendPlayerMove({ move: 'leave-seat' });
  }


  return (
    <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
      <TabsContainerPanel
        activeTabId={activeTabId}
        tabs={[
          {
            title: "Lobby Admin",
            id: 'lobby-admin',
            icon: <Groups />,
            content: (
              <LobbyHostStateComponent
                playerProfiles={playerProfiles}
                lobbyState={lobbyState}
                updateLobbyState={updateLobbyState}
                setLobbyPlayerPool={setLobbyPlayerPool}
                onOpenLobbyOptionsDialog={handleOpenLobbyOptionsDialog}
              />
            )
          },
          {
            title: "Player Lobby",
            id: 'player-lobby',
            icon: <Groups />,
            content: (
              <LobbyPlayerStateComponent
                playerProfiles={playerProfiles}
                lobbyState={lobbyState}
                currentPlayerProfile={hostPlayerProfile}
                lobbyOptions={lobbyOptions}
                onSelectGameChoice={onSelectGameChoice}
                onTakeSeat={onTakeSeat}
                onLeaveSeat={onLeaveSeat}
              />
            )
          },
          {
            title: "P2P",
            id: 'p2p',
            icon: <Wifi />,
            content: (
              <P2pConnectionComponent
                connectionStatus={connectionStatus}
                connectionEvents={connectionEvents}
                peerProfiles={peerProfiles}
                playerProfiles={playerProfiles}
                onResendLobbyData={doSendLobbyData}
                onRefreshConnection={refreshConnection}
              />
            )
          },
        ]}
        tabColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        // ariaLabel="hosted lobby tabs"
      />
      
      <LobbyHostOptionsDialog
        open={isLobbyOptionsDialogOpen}
        onClose={handleCloseLobbyOptionsDialog}
        onSave={handleSaveLobbyOptions}
        initialLobbyOptions={lobbyOptions}
      />
    </Container>
  )
}
