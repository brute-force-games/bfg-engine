import { GameLobby } from "../../../models/p2p-lobby"
import { PublicPlayerProfile } from "../../../models/player-profile/public-player-profile"
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Avatar,
  CheckCircle as CheckCircleIcon,
  OpenInNew as OpenInNewIcon
} from '../../bfg-ui'


interface ILobbyPlayerJoinGameComponentProps {
  lobbyState: GameLobby
  currentPlayerProfile?: PublicPlayerProfile
}

export const LobbyPlayerJoinGameComponent = ({ 
  lobbyState,
}: ILobbyPlayerJoinGameComponentProps) => {

  // const handleGameChoice = (gameChoice: BfgSupportedGameTitles) => {
  //   console.log('Selecting game choice:', gameChoice);
  //   onSelectGameChoice(gameChoice);
  // };

  // const handleTakeSeat = () => {
  //   onTakeSeat();
  // };

  // const handleLeaveSeat = () => {
  //   onLeaveSeat();
  // };

  // Check if the current player is already in the lobby
  // const isPlayerAlreadyInLobby = currentPlayerProfile 
  //   ? lobbyState.playerPool.includes(currentPlayerProfile.id)
  //   : false;

  return (
    <Paper 
      elevation={3} 
      style={{ 
        padding: '24px', 
        borderRadius: '8px',
        textAlign: 'center'
      }}
    >
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Success Icon */}
        <Avatar 
          style={{ 
            backgroundColor: '#81c784', 
            marginBottom: '16px',
            width: 40,
            height: 40
          }}
        >
          <CheckCircleIcon />
        </Avatar>
        
        {/* Main Message */}
        <Typography 
          variant="h4" 
          component="h2" 
          style={{ 
            fontWeight: 'bold', 
            marginBottom: '8px'
          }}
        >
          Game Has Started!
        </Typography>
        
        <Typography 
          variant="h6" 
          style={{ 
            color: '#666',
            marginBottom: '24px'
          }}
        >
          The game is now live and ready to play. Click the link below to join the action!
        </Typography>
        
        {/* Game Link Button */}
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Button
            onClick={() => window.open(lobbyState.playGameLink, '_blank', 'noopener,noreferrer')}
            variant="contained"
            size="large"
            style={{
              padding: '12px 32px',
              fontSize: '1.1rem',
              fontWeight: '500',
              textTransform: 'none',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <OpenInNewIcon /> Join Game Now
          </Button>
          
          {/* Additional Info */}
          <Typography 
            variant="body2" 
            style={{ color: '#999' }}
          >
            This link will open in a new tab
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}
