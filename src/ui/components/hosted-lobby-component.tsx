import { useState } from "react"
import { GameLobbyId, PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { useGameRegistry } from "../../hooks/games-registry/games-registry";
import { useRiskyMyDefaultPlayerProfile } from "../../hooks/stores/use-my-player-profiles-store";
import { convertPrivateToPublicProfile } from "../../models/player-profile/utils";
import { LobbyOptions, GameLobby } from "../../models/p2p-lobby";
import { useHostedLobby } from "../../hooks/stores/use-hosted-lobbies-store"
import { useHostedLobbyActions } from "../../hooks/stores/use-hosted-lobbies-store"
import { HostedP2pLobbyComponent } from "./hosted-p2p-lobby-component"
import { HostedLobbyTabId } from "./bfg-tabs";


interface HostedLobbyComponentProps {
  lobbyId: GameLobbyId;
  activeTabId: HostedLobbyTabId;
}

export const  HostedLobbyComponent = ({
  lobbyId,
  activeTabId,
}: HostedLobbyComponentProps) => {

  const lobby = useHostedLobby(lobbyId);
  const lobbyActions = useHostedLobbyActions();
  const hostPrivateProfile = useRiskyMyDefaultPlayerProfile();
  const myHostPlayerProfile = hostPrivateProfile ? convertPrivateToPublicProfile(hostPrivateProfile) : null;
  const gameRegistry = useGameRegistry();

  console.log('HostedLobbyPage - lobbyId:', lobbyId);
  console.log('HostedLobbyPage - lobby:', lobby);
  console.log('HostedLobbyPage - myHostPlayerProfile:', myHostPlayerProfile);

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

  if (!myHostPlayerProfile) {
    return (
      <div style={{ padding: '24px' }}>
        <h1>Loading...</h1>
        <p>Loading player profile...</p>
      </div>
    )
  }

  if (!lobby) {
    return (
      <div style={{ padding: '24px' }}>
        <h1>Lobby Not Found</h1>
        <p>This lobby does not exist or has been deleted.</p>
        <p>Lobby ID: {lobbyId}</p>
      </div>
    )
  }

  if (myHostPlayerProfile.id !== lobby.gameHostPlayerProfile.id) {
    return (
      <div style={{ padding: '24px' }}>
        <h1>Access Denied</h1>
        <p>You are not the host of this lobby.</p>
      </div>
    )
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
      activeTabId={activeTabId}
    />
  )
}
