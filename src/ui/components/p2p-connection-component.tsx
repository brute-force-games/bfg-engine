import { 
  Typography, 
  Chip, 
  Stack,
  Button,
  Box,
  Paper,
  CheckCircle,
  Refresh,
  History
} from "../bfg-ui"
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
      <Stack direction="row" alignItems="center" spacing={2} style={{ marginBottom: '16px' }}>
        <CheckCircle style={{ color: '#4caf50' }} />
        <Typography variant="h6" component="h2" style={{ fontWeight: 'bold' }}>
          Connection Status
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} style={{ marginBottom: '16px' }}>
        <Chip 
          label={`✓ ${connectionStatus}`}
          color="success"
          variant="outlined"
        />
        {onResendLobbyData && (
          <Button
            variant="outlined"
            onClick={onResendLobbyData}
            size="small"
          >
            <Refresh /> Resend Lobby Data
          </Button>
        )}
        {onRefreshConnection && (
          <Button
            variant="outlined"
            color="warning"
            onClick={onRefreshConnection}
            size="small"
          >
            <Refresh /> Refresh Connection
          </Button>
        )}
      </Stack>
      <Typography variant="body2" style={{ color: '#666', marginBottom: '16px' }}>
        Current P2P connection status and peer communication controls.
      </Typography>
      
      <PeerProfilesComponent
        peerProfiles={peerProfiles}
        playerProfiles={playerProfiles}
      />
      
      {connectionEvents.length > 0 && (
        <Box style={{ marginTop: '24px' }}>
          <Stack direction="row" alignItems="center" spacing={1} style={{ marginBottom: '8px' }}>
            <History />
            <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
              Connection Events
            </Typography>
          </Stack>
          <Paper variant="outlined" style={{ maxHeight: 200, overflow: 'auto', padding: '8px' }}>
            <Stack spacing={1}>
              {connectionEvents.slice().reverse().map((event, index) => (
                <Box key={index} style={{ padding: '8px', borderBottom: index < connectionEvents.length - 1 ? '1px solid #eee' : 'none' }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span>{getEventIcon(event.type)}</span>
                    <Typography variant="body2">{event.message}</Typography>
                    <Chip 
                      label={event.type} 
                      size="small" 
                      color={getEventColor(event.type)}
                      style={{ marginLeft: '8px' }}
                    />
                  </Stack>
                  <Typography variant="caption" style={{ color: '#999', marginTop: '4px', display: 'block' }}>
                    {event.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
      )}
    </>
  )
}
