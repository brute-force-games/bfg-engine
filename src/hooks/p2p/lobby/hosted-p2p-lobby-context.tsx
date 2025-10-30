import { createContext, useContext, ReactNode } from 'react';
import { GameLobbyId } from '../../../models/types/bfg-branded-ids';
import { Container, Paper, Typography } from '~/ui/bfg-ui';
import { LobbyOptions } from '~/models/p2p-lobby';
import { useHostedP2pLobbyWithStore, IHostedP2pLobbyWithStoreData } from './use-hosted-p2p-lobby-with-store';
import { useRiskyMyDefaultPlayerProfile } from '~/hooks/stores/use-my-player-profiles-store';


// interface IHostedP2pLobbyContext extends IHostedP2pLobbyWithStoreData {
//   lobbyState: GameLobby;
//   lobbyOptions: LobbyOptions;
  
//   // setLobbyOptions: (lobbyOptions: LobbyOptions) => void;
//   // lobbyActions: IHostedLobbyActions;

//   onSelectGameChoice: (gameChoice: BfgSupportedGameTitle) => void;
//   onTakeSeat: () => void;
//   onLeaveSeat: () => void;

//   myHostPlayerProfile: PublicPlayerProfile;
// }

interface P2pHostedLobbyProviderProps {
  lobbyId: GameLobbyId;
  // hostPlayerProfile: PrivatePlayerProfile;
  children: ReactNode;
}

const P2pHostedLobbyContext = createContext<IHostedP2pLobbyWithStoreData | null>(null);

export const P2pHostedLobbyContextProvider = ({ 
  lobbyId,
  // hostPlayerProfile,
  children 
}: P2pHostedLobbyProviderProps) => {

  const hostPlayerProfile = useRiskyMyDefaultPlayerProfile();
  if (!hostPlayerProfile) {
    throw new Error('Host player profile is required');
  }

  const hostedLobby = useHostedP2pLobbyWithStore(lobbyId, hostPlayerProfile);
  const {
    lobbyState,
    lobbyOptions,
    setLobbyOptions,
    lobbyActions,
    onSelectGameChoice,
    onTakeSeat,
    onLeaveSeat,
  } = hostedLobby;

  if (!hostedLobby) {
    return (
      <Container maxWidth="sm" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <Paper elevation={2} style={{ padding: '32px', textAlign: 'center' }}>
          <Typography variant="h6" component="h3" style={{ marginBottom: '8px' }}>
            Setting up hosted lobby P2P connection...
          </Typography>
          <Typography variant="body2">
            Please wait while we establish the connection.
          </Typography>
        </Paper>
      </Container>
    )
  }

  if (!lobbyState) {
    return (
      <Container maxWidth="sm" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <Paper elevation={2} style={{ padding: '32px', textAlign: 'center' }}>
          <Typography variant="h6" component="h3" style={{ marginBottom: '8px' }}>
            Lobby not found
          </Typography>
        </Paper>
      </Container>
    )
  }

  const context: IHostedP2pLobbyWithStoreData = {
    p2pLobby: hostedLobby.p2pLobby,
    lobbyState,
    lobbyOptions,
    lobbyActions,
    
    lobbyDetails: hostedLobby.lobbyDetails,
    connectionStatus: hostedLobby.connectionStatus,
    connectionEvents: hostedLobby.connectionEvents,

    peers: hostedLobby.peers,
    peerPlayers: hostedLobby.peerPlayers,
    myHostPlayerProfile: hostedLobby.myHostPlayerProfile,
    allPlayerProfiles: hostedLobby.allPlayerProfiles,

    setLobbyOptions: (lobbyOptions: LobbyOptions) => {
      setLobbyOptions(lobbyOptions);
    },
    
    txLobbyData: hostedLobby.txLobbyData,
    txPlayerProfile: hostedLobby.txPlayerProfile,
    rxPlayerProfile: hostedLobby.rxPlayerProfile,
    refreshConnection: hostedLobby.refreshConnection,

    onSelectGameChoice,
    onTakeSeat,
    onLeaveSeat,
  };

  return (
    <P2pHostedLobbyContext.Provider value={context}>
      {children}
    </P2pHostedLobbyContext.Provider>
  );
};

export const useP2pHostedLobbyContext = (): IHostedP2pLobbyWithStoreData => {
  const context = useContext(P2pHostedLobbyContext);
  
  if (!context) {
    throw new Error('useP2pHostedLobbyContext must be used within a P2pHostedLobbyContextProvider');
  }
  
  return context;
};
