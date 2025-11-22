import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { PublicPlayerProfile } from "../../models/internal/player-profile/public-player-profile";
import { Chip } from "../bfg-ui/components/Chip/Chip";


interface IPlayerProfileChipProps {
  playerProfileId: PlayerProfileId;
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  myPlayerProfile: PublicPlayerProfile | null;
}

export const PlayerProfileChip = ({
  playerProfileId,
  playerProfiles,
  myPlayerProfile,
}: IPlayerProfileChipProps) => {

  const playerProfile = playerProfiles.get(playerProfileId);
  const playerIsMe = playerProfileId === myPlayerProfile?.id;

  if (!playerProfile) {
    return (
      <Chip 
        key={playerProfileId}
        label={`${playerProfileId} (name not available)`}
        variant="outlined"
        color="error"
        size="small"
      />
    );
  }
  return (
    <Chip 
      key={playerProfileId}
      label={playerProfile.handle}
      variant={playerIsMe ? "outlined" : "filled"}
      color={playerIsMe ? "primary" : "default"}
      size="small"
    />
  )

  // return (
  //   <Chip 
  //     key={playerId}
  //     label={playerProfile.handle}
  //     variant="outlined"
  //     color="error"
  //     size="small"
  //   />
  // );
  // return (
  //   <Chip label={playerProfile.handle} variant="outlined" color="primary" size="small" />
  // )
}