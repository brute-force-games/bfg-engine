import { GameLobby } from "~/models/p2p-lobby"
import { PrivatePlayerProfile } from "~/models/player-profile/private-player-profile"
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Avatar,
  Link
} from '@mui/material'
import { 
  CheckCircle as CheckCircleIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material'


interface ILobbyPlayerJoinGameComponentProps {
  lobbyState: GameLobby
  currentPlayerProfile?: PrivatePlayerProfile
}

export const LobbyPlayerJoinGameComponent = ({ 
  lobbyState,
  // currentPlayerProfile,
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
      sx={{ 
        p: 3, 
        borderRadius: 2,
        textAlign: 'center'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Success Icon */}
        <Avatar 
          sx={{ 
            bgcolor: 'success.light', 
            mb: 2,
            width: 40,
            height: 40
          }}
        >
          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />
        </Avatar>
        
        {/* Main Message */}
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'text.primary',
            mb: 1
          }}
        >
          Game Has Started!
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            mb: 3
          }}
        >
          The game is now live and ready to play. Click the link below to join the action!
        </Typography>
        
        {/* Game Link Button */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            component={Link}
            href={lobbyState.gameLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            size="large"
            startIcon={<OpenInNewIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'medium',
              textTransform: 'none',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Join Game Now
          </Button>
          
          {/* Additional Info */}
          <Typography 
            variant="body2" 
            sx={{ color: 'text.disabled' }}
          >
            This link will open in a new tab
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}
