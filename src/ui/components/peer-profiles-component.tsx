import { useState } from "react";
import { 
  Typography, 
  Box, 
  IconButton, 
  Chip,
  Stack,
  Avatar,
  ExpandMore,
  People
} from "../bfg-ui";
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile"
import { PlayerProfileId } from "~/models/types/bfg-branded-ids"


interface IPeerProfilesComponentProps {
  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
}


const PeerProfileCard = ({ peerProfile }: { peerProfile: PublicPlayerProfile }) => {
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (handle: string) => {
    return handle.substring(0, 2).toUpperCase();
  };

  return (
    <Box style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#fff',
      transition: 'all 0.2s ease'
    }}>
      {/* Compact header - always visible */}
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between"
        style={{ padding: '16px' }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar 
            src={peerProfile.avatarImageUrl}
            style={{ width: 40, height: 40, fontSize: '1rem' }}
          >
            {!peerProfile.avatarImageUrl && getInitials(peerProfile.handle)}
          </Avatar>
          <Box>
            <Typography variant="h6" style={{ fontWeight: 600, lineHeight: 1.3, marginBottom: '2px' }}>
              {peerProfile.handle}
            </Typography>
            <Typography variant="caption" style={{ color: '#666' }}>
              Peer Profile
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip 
            label="Connected" 
            size="small" 
            color="success" 
            variant="outlined"
            style={{ height: 20, fontSize: '0.75rem' }}
          />
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
            style={{ 
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            <ExpandMore />
          </IconButton>
        </Stack>
      </Stack>

      {/* Expandable details */}
      {expanded && (
        <Box style={{ padding: '0 16px 16px' }}>
          <Stack spacing={1} style={{ marginBottom: '16px' }}>
            <Box>
              <Typography variant="caption" style={{ color: '#666' }}>
                Created
              </Typography>
              <Typography variant="body2">
                {formatDate(peerProfile.createdAt)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" style={{ color: '#666' }}>
                Updated
              </Typography>
              <Typography variant="body2">
                {formatDate(peerProfile.updatedAt)}
              </Typography>
            </Box>
          </Stack>
          
          <Box style={{
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '8px'
          }}>
            <Typography variant="caption" style={{ color: '#666', display: 'block', marginBottom: '4px' }}>
              Profile ID
            </Typography>
            <Typography 
              variant="caption" 
              style={{ 
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                fontSize: '0.75rem'
              }}
            >
              {peerProfile.id}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export const PeerProfilesComponent = ({ peerProfiles }: IPeerProfilesComponentProps) => {
  const peerProfileEntries = Array.from(peerProfiles.entries());
  const hasPeers = peerProfileEntries.length > 0;

  if (!hasPeers) {
    return (
      <Box style={{ 
        padding: '24px',
        textAlign: 'center',
        color: '#666'
      }}>
        <People style={{ opacity: 0.5, marginBottom: '16px' }} />
        <Typography variant="h6" style={{ marginBottom: '8px' }}>
          No peers connected
        </Typography>
        <Typography variant="body2" style={{ color: '#666' }}>
          Waiting for other players to join...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={1}
        style={{ marginBottom: '16px' }}
      >
        <People style={{ width: 20, height: 20, color: '#1976d2' }} />
        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
          Connected Peers
        </Typography>
        <Chip 
          label={peerProfileEntries.length.toString()} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      </Stack>

      {/* Peer cards - each with its own expand/collapse */}
      <Stack spacing={1}>
        {peerProfileEntries.map(([peerId, peerProfile]) => (
          <PeerProfileCard 
            key={peerId} 
            peerProfile={peerProfile} 
          />
        ))}
      </Stack>
    </Box>
  );
};