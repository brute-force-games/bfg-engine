import { useGameHosting } from "~/hooks/games-registry/game-hosting";
import { AppBar, Toolbar, Typography } from "../../bfg-ui"
import { BruteForceGamesAppBar } from "./app-bar"


export const NoUserAppBar = () => {

  return (
    <BruteForceGamesAppBar 
      tabItems={[
        {
          id: "home",
          label: "Home"
        }
      ]}
      activeTabId="home"
      onTabChange={() => {}}
    />
  )
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">No Activity - No User</Typography>
      </Toolbar>
    </AppBar>
  )
}