import { AppBar, Toolbar, Typography } from "../../bfg-ui"
import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar"


export const NoActivityNoUserAppBar = () => {

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
