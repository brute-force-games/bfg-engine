import { useState } from "react";
import { 
  Typography, 
  Box, 
  Collapse, 
  IconButton, 
  Chip,
  Stack,
  Avatar
} from "@mui/material";
import { 
  ExpandMore, 
  ExpandLess,
  People
} from "@mui/icons-material";
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
    <Box sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      backgroundColor: 'background.paper',
      transition: 'all 0.2s ease',
      '&:hover': {
        boxShadow: 2,
        transform: 'translateY(-1px)'
      }
    }}>
      {/* Compact header - always visible */}
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between"
        sx={{ p: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar 
            src={peerProfile.avatarImageUrl}
            sx={{ width: 32, height: 32, fontSize: '0.875rem' }}
          >
            {!peerProfile.avatarImageUrl && getInitials(peerProfile.handle)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
              {peerProfile.handle}
            </Typography>
            <Typography variant="caption" color="text.secondary">
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
            sx={{ height: 20, fontSize: '0.75rem' }}
          />
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
            sx={{ 
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            <ExpandMore />
          </IconButton>
        </Stack>
      </Stack>

      {/* Expandable details */}
      <Collapse in={expanded}>
        <Box sx={{ px: 2, pb: 2 }}>
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body2">
                {formatDate(peerProfile.createdAt)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Updated
              </Typography>
              <Typography variant="body2">
                {formatDate(peerProfile.updatedAt)}
              </Typography>
            </Box>
          </Stack>
          
          <Box sx={{
            backgroundColor: 'grey.50',
            border: '1px solid',
            borderColor: 'grey.200',
            borderRadius: 1,
            p: 1
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Profile ID
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                fontSize: '0.75rem'
              }}
            >
              {peerProfile.id}
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export const PeerProfilesComponent = ({ peerProfiles }: IPeerProfilesComponentProps) => {
  const [expanded, setExpanded] = useState(false);
  const peerProfileEntries = Array.from(peerProfiles.entries());
  const hasPeers = peerProfileEntries.length > 0;

  const getInitials = (handle: string) => {
    return handle.substring(0, 2).toUpperCase();
  };

  if (!hasPeers) {
    return (
      <Box sx={{ 
        padding: 3,
        textAlign: 'center',
        color: 'text.secondary'
      }}>
        <People sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
          No peers connected
        </Typography>
        <Typography variant="body2" color="text.secondary">
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
        sx={{ mb: 2 }}
      >
        <People sx={{ fontSize: 20, color: 'primary.main' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Connected Peers
        </Typography>
        <Chip 
          label={peerProfileEntries.length} 
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