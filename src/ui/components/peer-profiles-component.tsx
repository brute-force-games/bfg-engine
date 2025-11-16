import { 
  Typography, 
  Box, 
  Chip,
  Stack,
  People
} from "../bfg-ui";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile"
import { PeerId } from "../../hooks/p2p/p2p-types"
import { PeerProfileCard } from "./peer-profile-card-component";
import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-uuids";


interface IPeerProfilesComponentProps {
  myPeerId: PeerId;
  myPeerProfile: PublicPlayerProfile | null;
  peerIds: PeerId[];
  peerIdsToPlayerIds: Map<PeerId, PlayerProfileId>;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
}

export const PeerProfilesComponent = ({
  myPeerId,
  myPeerProfile,
  peerIds,
  peerIdsToPlayerIds,
  allPlayerProfiles,
}: IPeerProfilesComponentProps) => {

  const peerProfileEntries = Array.from(peerIdsToPlayerIds.entries());
  // const hasPeers = peerProfileEntries.length > 0;

  // if (!hasPeers) {
  //   return (
  //     <Box style={{ 
  //       padding: '24px',
  //       textAlign: 'center',
  //       color: '#666'
  //     }}>
  //       <People style={{ opacity: 0.5, marginBottom: '16px' }} />
  //       <Typography variant="h6" style={{ marginBottom: '8px' }}>
  //         No peers connected
  //       </Typography>
  //       <Typography variant="body2" style={{ color: '#666' }}>
  //         Waiting for other players to join...
  //       </Typography>
  //     </Box>
  //   );
  // }

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
        {myPeerId && (
          <PeerProfileCard
            key={myPeerId}
            peerPlayer={myPeerProfile ?? undefined}
            isMe={true}
          />
        )}
        {
          peerIds.map((peerId: PeerId) => {
            const peerPlayerId = peerIdsToPlayerIds.get(peerId);
            if (!peerPlayerId) {
              return null;
            }
            const peerPlayer = allPlayerProfiles.get(peerPlayerId);
            return (
              <PeerProfileCard 
                key={peerId}
                peerPlayer={peerPlayer}
              />
            );
          })
        }
      </Stack>
    </Box>
  );
};