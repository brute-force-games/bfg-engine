import { createContext, useContext, ReactNode } from 'react';
import { GameLobbyId } from '../../models/types/bfg-branded-ids';
import { PublicPlayerProfile } from '~/models/player-profile/public-player-profile';
import { Container, Paper, Typography } from '~/ui/bfg-ui';
import { PrivatePlayerProfile, privateToPublicProfile } from '~/models/player-profile/private-player-profile';
import { IHostedP2pLobbyData } from './use-hosted-p2p-lobby';
import { IHostedLobbyActions } from '../stores/use-hosted-lobbies-store';
import { GameLobby, LobbyOptions } from '~/models/p2p-lobby';
import { BfgSupportedGameTitle } from '~/models/game-box-definition';
import { useHostedP2pLobbyWithStore } from './use-hosted-p2p-lobby-with-store';


interface IHostedP2pLobbyContext extends IHostedP2pLobbyData {
  lobbyState: GameLobby;
  lobbyOptions: LobbyOptions;
  
  setLobbyOptions: (lobbyOptions: LobbyOptions) => void;
  lobbyActions: IHostedLobbyActions;

  onSelectGameChoice: (gameChoice: BfgSupportedGameTitle) => void;
  onTakeSeat: () => void;
  onLeaveSeat: () => void;

  myHostPlayerProfile: PublicPlayerProfile;
}

interface P2pHostedLobbyProviderProps {
  lobbyId: GameLobbyId;
  hostPlayerProfile: PrivatePlayerProfile;
  children: ReactNode;
}

const P2pHostedLobbyContext = createContext<IHostedP2pLobbyContext | null>(null);

export const P2pHostedLobbyContextProvider = ({ 
  lobbyId,
  hostPlayerProfile,
  children 
}: P2pHostedLobbyProviderProps) => {

  // const hostedLobby = useHostedP2pLobby(lobbyId, hostPlayerProfile);
  // const lobbyData = useHostedLobby(lobbyId);
  // const lobbyActions = useHostedLobbyActions();
  // const gameRegistry = useGameRegistry();

  // const [lobbyOptions, setLobbyOptions] = useState<LobbyOptions>(() => {
  //   const gameChoices = gameRegistry.getAvailableGameTitles();
  //   return {
  //     gameChoices,  
  //     maxPlayers: 8,
  //   }
  // });

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

  console.log("dddlobbyState", lobbyState);

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

  // const applyPlayerMove = async (move: PlayerP2pLobbyMove, playerId: PlayerProfileId) => {
  //   console.log('applyPlayerMove', move, playerId);
  //   console.log('Received player move from peer:', playerId, move);

  //   switch (move.move) {
  //     case 'set-game-choice':
  //       const updatedLobbyForGameChoice = await playerSetGameChoice(gameRegistry, lobbyState, playerId, move.gameChoice);
  //       if (updatedLobbyForGameChoice) {
  //         updateLobbyState(updatedLobbyForGameChoice);
  //       }
  //       break;

  //     case 'take-seat':
  //       const updatedLobbyForSeat = await playerTakeSeat(gameRegistry, lobbyState, playerId);
  //       console.log('updatedLobbyForSeat', updatedLobbyForSeat);
  //       if (updatedLobbyForSeat) {
  //         updateHostedLobbyPlayerPool(lobbyId, updatedLobbyForSeat.playerPool as PlayerProfileId[]);
  //         updateLobbyState(updatedLobbyForSeat);
  //       }
  //       break;

  //     case 'leave-seat':
  //       const updatedLobbyForLeaveSeat = await playerLeaveSeat(gameRegistry, lobbyState, playerId);
  //       console.log('updatedLobbyForLeaveSeat', updatedLobbyForLeaveSeat);
  //       if (updatedLobbyForLeaveSeat) {
  //         updateHostedLobbyPlayerPool(lobbyId, updatedLobbyForLeaveSeat.playerPool as PlayerProfileId[]);
  //         updateLobbyState(updatedLobbyForLeaveSeat);
  //       }
  //       break;
      
  //     default:
  //       console.error('Unknown player move:', move);
  //       break;
  //   }
  // }

  const publicHostPlayerProfile = privateToPublicProfile(hostPlayerProfile);


  // const onSelectGameChoice = async (gameChoice: BfgSupportedGameTitle) => {
  //   // sendPlayerMove({ move: 'set-game-choice', gameChoice: gameChoice });
  //   // asHostedLobbyUpdateLobbyData({ gameChoice });
  //   // await asHostApplyMoveFromPlayer({ move: 'set-game-choice', gameChoice: gameChoice }, hostPlayerProfile.id);
  //   applyPlayerMove({ move: 'set-game-choice', gameChoice: gameChoice }, hostPlayerProfile.id);
  // }

  // const onTakeSeat = async () => {
  //   // sendPlayerMove({ move: 'take-seat' });
  // }
  
  // const onLeaveSeat = async () => {
  //   // sendPlayerMove({ move: 'leave-seat' });
  // }

  
  const context: IHostedP2pLobbyContext = {
    p2pLobby: hostedLobby.p2pLobby,
    lobbyState,
    lobbyOptions,
    lobbyActions,
    
    lobbyDetails: hostedLobby.lobbyDetails,
    connectionStatus: hostedLobby.connectionStatus,
    connectionEvents: hostedLobby.connectionEvents,

    peerProfiles: hostedLobby.peerProfiles,
    myHostPlayerProfile: publicHostPlayerProfile,
    allPlayerProfiles: hostedLobby.allPlayerProfiles,

    // updateLobbyData: (lobbyUpdates: GameLobbyUpdateFields) => {
    //   lobbyActions.updateLobby(lobbyId, lobbyUpdates);
    // },
    
    setLobbyOptions: (lobbyOptions: LobbyOptions) => {
      setLobbyOptions(lobbyOptions);
    },
    
    sendLobbyData: hostedLobby.sendLobbyData,
    getPlayerProfile: hostedLobby.getPlayerProfile,
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

export const useP2pHostedLobbyContext = (): IHostedP2pLobbyContext => {
  const context = useContext(P2pHostedLobbyContext);
  
  if (!context) {
    throw new Error('useP2pHostedLobbyContext must be used within a P2pHostedLobbyContextProvider');
  }
  
  return context;
};

