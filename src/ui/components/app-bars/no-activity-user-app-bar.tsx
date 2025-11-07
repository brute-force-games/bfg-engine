import { Link } from "@tanstack/react-router";
import { PrivatePlayerProfile } from "../../../models/player-profile/private-player-profile";
import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar";
import { Typography, Button, Box } from "../../bfg-ui";


interface NoActivityUserAppBarProps {
  myPlayerProfiles: PrivatePlayerProfile[];
  myDefaultPlayerProfile: PrivatePlayerProfile | null;
}

export const NoActivityUserAppBar = (_props: NoActivityUserAppBarProps) => {

  return (
    <BruteForceGamesAppBar>
      <Box style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Brute Force Games
          </Link>
        </Typography>
        <Link to="/new-lobby" style={{ textDecoration: 'none' }}>
          <Button variant="text" style={{ color: 'inherit' }}>
            Create Lobby
          </Button>
        </Link>
      </Box>
    </BruteForceGamesAppBar>
  )
}
