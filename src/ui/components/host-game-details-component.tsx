import { useState } from "react"
import { useGameRegistry } from "~/hooks/games-registry/games-registry"
import { GameTable } from "../../models/game-table/game-table"
import { DbGameTableAction } from "../../models/game-table/game-table-action"
import { PrettyJsonObject } from "../bfg-ui/components/PrettyJsonObject/PrettyJsonObject"
import { GameActionHistoryComponent } from "./game-action-history-component"
import { Tabs, Tab, TabPanel } from "../bfg-ui/components/Tabs"
import { Settings, History, Gamepad } from "../bfg-ui/icons"
import { Paper, Stack, Typography, Box } from "../bfg-ui"


interface IHostedGameDetailsComponentProps {
  hostedGame: GameTable
  gameActions: DbGameTableAction[]
}

export const HostedGameDetailsComponent = ({
  hostedGame,
  gameActions,
}: IHostedGameDetailsComponentProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const latestGameSpecificStateStr = gameActions.length > 0 ? 
    gameActions[gameActions.length - 1].nextGameStateStr :
    null;

  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);
  const latestGameSpecificState = latestGameSpecificStateStr ?
    gameMetadata.gameSpecificStateEncoder.decode(latestGameSpecificStateStr) :
    null;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Paper elevation={2}>
        <Stack direction="column" spacing={0}>
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Game Details" icon={<Settings />} />
              <Tab label="Action History" icon={<History />} />
              <Tab label="Game State JSON" icon={<Gamepad />} />
            </Tabs>
          </Box>

        <TabPanel value={activeTab} index={0}>
          <Stack direction="column" spacing={4}>
            <Stack direction="column" spacing={2}>
              <Box>
                <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                  Game Title:
                </Typography>
                <Typography variant="body1" component="span" style={{ marginLeft: '8px' }}>
                  {hostedGame?.gameTitle}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                  Game ID:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px', fontFamily: 'monospace' }}>
                  {hostedGame?.id}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                  Status:
                </Typography>
                <Typography variant="body1" component="span" style={{ marginLeft: '8px' }}>
                  {hostedGame?.currentStatusDescription}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                  Phase:
                </Typography>
                <Typography variant="body1" component="span" style={{ marginLeft: '8px' }}>
                  {hostedGame?.tablePhase}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                  Created:
                </Typography>
                <Typography variant="body1" component="span" style={{ marginLeft: '8px' }}>
                  {hostedGame ? new Date(hostedGame.createdAt).toLocaleString() : ''}
                </Typography>
              </Box>
            </Stack>
            
            <Box style={{ marginTop: '24px' }}>
              <Typography variant="h6" gutterBottom>
                Raw Game Data
              </Typography>
              <PrettyJsonObject>
                {hostedGame}
              </PrettyJsonObject>
            </Box>
          </Stack>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box>
            <GameActionHistoryComponent gameActions={gameActions} />
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box>
            <PrettyJsonObject>
              {latestGameSpecificState}
            </PrettyJsonObject>
          </Box>
        </TabPanel>
        </Stack>
      </Paper>
    </Box>
  )
}