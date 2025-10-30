import { createContext, useContext, ReactNode } from 'react';
import { GameLobbyId, PlayerProfileId } from '../../../models/types/bfg-branded-ids';
import { useP2pLobby, IP2pLobby } from './use-p2p-lobby';
import { Container, Paper, Typography } from '~/ui/bfg-ui';
import { PublicPlayerProfile } from '~/models/player-profile/public-player-profile';
import { useRiskyMyDefaultPlayerProfile } from '~/hooks/stores/use-my-player-profiles-store';


export interface IP2pLobbyPlayerContext extends Omit<IP2pLobby, 'room'> {
  myPlayerProfile: PublicPlayerProfile;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
}

interface P2pLobbyPlayerProviderProps {
  lobbyId: GameLobbyId;
  // myPlayerProfile: PrivatePlayerProfile;
  children: ReactNode;
}

const P2pLobbyPlayerContext = createContext<IP2pLobbyPlayerContext | null>(null);

export const P2pLobbyPlayerContextProvider = ({ 
  lobbyId, 
  // myPlayerProfile, 
  children 
}: P2pLobbyPlayerProviderProps) => {

  const myPlayerProfile = useRiskyMyDefaultPlayerProfile();
  if (!myPlayerProfile) {
    throw new Error('My player profile is required');
  }

  const lobby = useP2pLobby(lobbyId, myPlayerProfile);

  if (!lobby) {
    return (
      <Container maxWidth="sm" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <Paper elevation={2} style={{ padding: '32px', textAlign: 'center' }}>
          <Typography variant="h6" component="h3" style={{ marginBottom: '8px' }}>
            Connecting to lobby...
          </Typography>
          <Typography variant="body2">
            Please wait while we establish the connection.
          </Typography>
        </Paper>
      </Container>
    )
  }

  const { room, ...lobbyWithoutRoom } = lobby;

  // const allPlayerProfiles = new Map<PlayerProfileId, PublicPlayerProfile>(
  //   [
  //     ...lobby.otherPlayerProfiles.entries(),
  //     [myPlayerProfile.id, myPlayerProfile]
  //   ]);
  
  const context: IP2pLobbyPlayerContext = {
    ...lobbyWithoutRoom,
    myPlayerProfile,
    // allPlayerProfiles,
  };

  return (
    <P2pLobbyPlayerContext.Provider value={context}>
      {children}
    </P2pLobbyPlayerContext.Provider>
  );
};

export const useP2pLobbyPlayerContext = (): IP2pLobbyPlayerContext => {
  const context = useContext(P2pLobbyPlayerContext);
  
  if (!context) {
    throw new Error('useP2pLobbyContext must be used within a P2pLobbyProvider');
  }
  
  return context;
};
