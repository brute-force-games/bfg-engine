import { 
  Typography, 
  Chip, 
  Stack,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper
} from "@mui/material"
import { 
  CheckCircle, 
  Refresh,
  History
} from "@mui/icons-material"
import { PeerProfilesComponent } from "~/ui/components/peer-profiles-component"
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile"
import { PlayerProfileId } from "~/models/types/bfg-branded-ids"
import { ConnectionEvent } from "~/hooks/p2p/use-p2p-lobby"


interface P2pConnectionComponentProps {
  connectionStatus: string
  connectionEvents?: ConnectionEvent[]
  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
  onResendLobbyData?: () => void
  onRefreshConnection?: () => void
}

export const P2pConnectionComponent = ({
  connectionStatus,
  connectionEvents = [],
  peerProfiles,
  playerProfiles,
  onResendLobbyData,
  onRefreshConnection
}: P2pConnectionComponentProps) => {
  
  const getEventColor = (type: ConnectionEvent['type']) => {
    switch (type) {
      case 'initialized': return 'primary';
      case 'peer-joined': return 'success';
      case 'peer-left': return 'warning';
      case 'auto-refresh': return 'info';
      default: return 'default';
    }
  };

  const getEventIcon = (type: ConnectionEvent['type']) => {
    switch (type) {
      case 'initialized': return '🚀';
      case 'peer-joined': return '👋';
      case 'peer-left': return '👋';
      case 'auto-refresh': return '🔄';
      default: return '📡';
    }
  };

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <CheckCircle sx={{ fontSize: 24, color: 'success.main' }} />
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
          Connection Status
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Chip 
          icon={<CheckCircle />}
          label={connectionStatus}
          color="success"
          variant="outlined"
        />
        {onResendLobbyData && (
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onResendLobbyData}
            size="small"
          >
            Resend Lobby Data
          </Button>
        )}
        {onRefreshConnection && (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<Refresh />}
            onClick={onRefreshConnection}
            size="small"
          >
            Refresh Connection
          </Button>
        )}
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Current P2P connection status and peer communication controls.
      </Typography>
      
      <PeerProfilesComponent
        peerProfiles={peerProfiles}
        playerProfiles={playerProfiles}
      />
      
      {connectionEvents.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <History sx={{ fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Connection Events
            </Typography>
          </Stack>
          <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
            <List dense>
              {connectionEvents.slice().reverse().map((event, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <span>{getEventIcon(event.type)}</span>
                        <Typography variant="body2">{event.message}</Typography>
                        <Chip 
                          label={event.type} 
                          size="small" 
                          color={getEventColor(event.type)}
                          sx={{ ml: 1 }}
                        />
                      </Stack>
                    }
                    secondary={event.timestamp.toLocaleTimeString()}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </>
  )
}
