import { z } from "zod";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { BfgGameEngineProcessor } from "../../models/game-engine/bfg-game-engines";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { useGameRegistry } from "../../hooks/games-registry/games-registry";
import { Container, Typography, Stack, Box } from "../bfg-ui";


interface PlayerGameViewProps {
  myPlayerSeat: GameTableSeat;
  myPlayerProfile: PublicPlayerProfile;
  gameTable: GameTable;
  gameActions: DbGameTableAction[];
  
  onPlayerGameAction: (playerAction: any) => void
}

export const PlayerGameView = (props: PlayerGameViewProps) => {
  const { myPlayerSeat, gameTable, gameActions, onPlayerGameAction } = props;

  const latestAction = gameActions[gameActions.length - 1];
  
  if (!latestAction) {
    return <Typography variant="body1">No game actions yet...</Typography>;
  }
  
  const gameTitle = gameTable.gameTitle;

  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRegistry.getGameMetadata(gameTitle);
  
  const gameEngine = gameMetadata.processor as BfgGameEngineProcessor<
    z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>,
    z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>
  >;
  const gameRendererFactory = gameEngine.rendererFactory;
  
  const gameSpecificState = gameEngine.parseGameSpecificGameStateJson(
    latestAction.actionOutcomeGameStateJson as any);

  const latestGameSpecificAction = gameEngine.parseGameSpecificActionJson(
    latestAction.actionJson as any);

  const onPlayerMoveAction = async (gameState: typeof gameSpecificState, gameAction: typeof latestGameSpecificAction) => {
    console.log("onGameAction", gameState, gameAction);

    const playerMoveJson = gameEngine.createGameSpecificActionJson(gameAction);
    onPlayerGameAction(playerMoveJson);
  }

  const gameRepresentation = gameRendererFactory.createGameStateCombinationRepresentationAndInputComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction, onPlayerMoveAction);


  if (!gameMetadata) {
    return (
      <Container sx={{ padding: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game Metadata...</Typography>
          <Typography variant="body1" color="text.secondary">
            Loading game metadata...
          </Typography>
        </Stack>
      </Container>
    )
  }

  return (
    <Box>
      {gameRepresentation}
    </Box>
  );
};
