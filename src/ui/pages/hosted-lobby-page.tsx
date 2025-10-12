import { useState } from "react"
import { HostedP2pLobbyComponent } from "~/ui/components/hosted-p2p-lobby-component"
import { useHostedLobby, useHostedLobbyActions } from "~/hooks/stores/use-hosted-lobbies-store"
import { useMyDefaultPublicPlayerProfile } from "~/hooks/stores/use-my-player-profiles-store"
import { GameLobby, LobbyOptions } from "~/models/p2p-lobby"
import { useGameRegistry } from "~/hooks/games-registry/games-registry"
import { GameLobbyId, PlayerProfileId } from "~/models/types/bfg-branded-ids"


interface HostedLobbyPageProps {
  lobbyId: GameLobbyId;
}

export const HostedLobbyPage = ({ lobbyId }: HostedLobbyPageProps) => {

  const lobby = useHostedLobby(lobbyId);
  const lobbyActions = useHostedLobbyActions();
  const myHostPlayerProfile = useMyDefaultPublicPlayerProfile();
  const gameRegistry = useGameRegistry();

  const [lobbyOptions, setLobbyOptions] = useState<LobbyOptions>(() => {
    const gameChoices = gameRegistry.getAvailableGameTitles();
    return {
      gameChoices,  
      maxPlayers: 8,
    }
  });

  const setLobbyState = (lobbyState: GameLobby) => {
    console.log('setting lobby state', lobbyState);
    lobbyActions.updateLobby(lobbyId, lobbyState);
  }

  const setLobbyPlayerPool = (playerPool: PlayerProfileId[]) => {
    lobbyActions.updateLobbyPlayerPool(lobbyId, playerPool);
    if (playerPool.length === 0) {
      lobbyActions.updateLobby(lobbyId, {
        isLobbyValid: false,
      });
    }
  }

  if (!lobby) {
    return (
      <div>
        Loading lobby...
      </div>
    )
  }

  if (myHostPlayerProfile?.id !== lobby.gameHostPlayerProfile.id) {
    throw new Error('You are not the host of this lobby');
  }

  return (
    <HostedP2pLobbyComponent
      lobbyId={lobbyId}
      hostPlayerProfile={myHostPlayerProfile}
      lobbyOptions={lobbyOptions}
      lobbyState={lobby}
      updateLobbyState={setLobbyState}
      setLobbyOptions={setLobbyOptions}
      setLobbyPlayerPool={setLobbyPlayerPool}
    />
  )
}
