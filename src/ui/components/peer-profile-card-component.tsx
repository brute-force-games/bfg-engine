import { useState } from "react";
import { 
  Typography, 
  Box, 
  IconButton, 
  Chip,
  Stack,
  Avatar,
  ExpandMore,
} from "../bfg-ui";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";

interface IPeerProfileCardProps {
  peerPlayer?: PublicPlayerProfile;
  isMe?: boolean;
}

export const PeerProfileCard = ({ peerPlayer: peerProfile, isMe }: IPeerProfileCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (timestamp?: number) => {
    if (!timestamp) {
      return 'unknown';
    }

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

  const avatarImageUrl = peerProfile?.avatarImageUrl;
  const handle = peerProfile?.handle || 'unknown';
  const createdAt = peerProfile?.createdAt;
  const updatedAt = peerProfile?.updatedAt;
  const id = peerProfile?.id;

  return (
    <Box style={{
      border: isMe ? '2px solid #1976d2' : '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: isMe ? '#e3f2fd' : '#fff',
      transition: 'all 0.2s ease',
      boxShadow: isMe ? '0 2px 8px rgba(25, 118, 210, 0.2)' : 'none'
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
            src={avatarImageUrl}
            style={{ width: 40, height: 40, fontSize: '1rem' }}
          >
            {!avatarImageUrl && getInitials(handle)}
          </Avatar>
          <Box>
            <Typography variant="h6" style={{ fontWeight: 600, lineHeight: 1.3, marginBottom: '2px' }}>
              {handle}
            </Typography>
            <Typography variant="caption" style={{ color: isMe ? '#1976d2' : '#666', fontWeight: isMe ? 600 : 400 }}>
              {isMe ? 'You' : 'Peer Profile'}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip 
            label={isMe ? "You" : "Connected"} 
            size="small" 
            color={isMe ? "primary" : "success"} 
            variant={isMe ? "filled" : "outlined"}
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
                {formatDate(createdAt)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" style={{ color: '#666' }}>
                Updated
              </Typography>
              <Typography variant="body2">
                {formatDate(updatedAt)}
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
              {id || 'unknown'}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
