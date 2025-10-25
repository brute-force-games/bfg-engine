import { z } from "zod";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { useGameRegistry } from "../../hooks/games-registry/games-registry";
import { Typography, Stack, Box } from "../bfg-ui";
import { GameHostComponentProps } from "~/models/game-engine/bfg-game-engine-types";
import { BfgEncodedString, IBfgJsonZodObjectDataEncoder } from "~/models/game-engine/encoders";


interface HostedGameViewProps {
  myPlayerSeat: GameTableSeat;
  myPlayerProfile: PublicPlayerProfile;
  hostedGame: GameTable;
  gameActions: DbGameTableAction[];

  peerProfiles: Map<string, PublicPlayerProfile>;
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  
  // onMyPlayerGameAction: (playerAction: any) => void
  onActingAsPlayerGameAction: (actingAsPlayerSeat: GameTableSeat, playerAction: any) => void
  onHostGameAction: (hostAction: any) => void
}

export const HostedGameView = (props: HostedGameViewProps) => {
  const { hostedGame, gameActions, onHostGameAction } = props;

  const latestAction = gameActions[gameActions.length - 1];
  
  if (!latestAction) {
    return <Typography variant="body1">No game actions yet...</Typography>;
  }
  
  const gameTitle = hostedGame.gameTitle;

  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRegistry.getGameMetadata(gameTitle);
  // const gameEngine = gameMetadata.engine;
  // const gameComponents = gameMetadata.components;

  // const nextGameStateJson = JSON.parse(latestAction.nextGameStateStr);
  // const gameSpecificState = gameMetadata.gameSpecificStateSchema.parse(nextGameStateJson);
  // const latestGameSpecificAction = gameMetadata.playerActionSchema.parse(latestAction.actionStr);
  
  // const { gameSpecificStateSchema, hostActionSchema } = gameMetadata;

  // const gameEngine = gameMetadata.processor as BfgGameEngineProcessor<
  //   z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>,
  //   z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>
  // >;
  // const gameRendererFactory = gameEngine.rendererFactory;

  // const gameSpecificState = gameEngine.parseGameSpecificGameStateJson(
  //   latestAction.actionOutcomeGameStateJson as any);

  // const latestGameSpecificAction = gameEngine.parseGameSpecificActionJson(
  //   latestAction.actionJson as any);

  // Type-safe callback function that works with the specific game engine
  // const onHostAction = async (gameState: typeof gameSpecificState, hostAction: typeof latestGameSpecificAction) => {
  //   console.log("onHostPlayerAction", gameState, hostAction);
  //   // const playerMoveJson = gameEngine.createGameSpecificActionJson(gameAction);
  //   // onPlayerGameAction(playerMoveJson);
  //   onHostGameAction(gameState, hostAction);
  // }

  console.log("gameMetadata", gameMetadata);

  const gameSpecificStateEncoder = gameMetadata.gameSpecificStateEncoder;
  if (gameSpecificStateEncoder.format !== 'json-zod-object') {
    throw new Error('Game specific state encoder format is not json-zod-object');
  }

  const zodGameSpecificStateEncoder = gameSpecificStateEncoder as IBfgJsonZodObjectDataEncoder<any>;
  const zodGameSpecificStateSchema = zodGameSpecificStateEncoder.schema as z.ZodTypeAny;

  const hostActionEncoder = gameMetadata.hostActionEncoder;
  if (hostActionEncoder.format !== 'json-zod-object') {
    throw new Error('Host action encoder format is not json-zod-object');
  }

  const zodHostActionEncoder = hostActionEncoder as IBfgJsonZodObjectDataEncoder<any>;
  const zodHostActionSchema = zodHostActionEncoder.schema as z.ZodTypeAny;

  const nextGameStateStr: BfgEncodedString = latestAction.nextGameStateStr as unknown as BfgEncodedString;
  const gameSpecificState = gameSpecificStateEncoder.decode(nextGameStateStr) as z.infer<typeof zodGameSpecificStateSchema> | null;

  const hostComponentProps: GameHostComponentProps<
    z.infer<typeof zodGameSpecificStateSchema>,
    z.infer<typeof zodHostActionSchema>
  > = {
    gameState: gameSpecificState,
    hostPlayerProfileId: props.myPlayerProfile.id,
    actingAsPlayerProfileId: props.myPlayerProfile.id,
    actingAsPlayerSeat: props.myPlayerSeat,
    onHostAction: onHostGameAction,
  };

  const hostRepresentation = gameMetadata.components.HostComponent(hostComponentProps);

  // const createHostRepresentationFn = gameRendererFactory.createGameStateHostComponent;
  // const hostRepresentationProps: GameStateHostComponentProps<typeof gameSpecificState, typeof latestGameSpecificAction> = {
  //   hostPlayerProfileId: props.myPlayerProfile.id,
  //   myPlayerProfileId: props.myPlayerProfile.id,
  //   myPlayerSeat: props.myPlayerSeat,
  //   gameTable: hostedGame,
  //   gameState: gameSpecificState,
  //   mostRecentAction: latestGameSpecificAction,
  //   onGameAction: onPlayerGameAction,
  //   onHostAction: onHostAction,
  // };
  // const hostRepresentation = createHostRepresentationFn(hostRepresentationProps);
  
  
  // const hostRepresentation = (gameRendererFactory as {
  //   createGameStateHostComponent: (
  //     gameTable: GameTable,
  //     gameState: GameStateType,
  //     mostRecentAction: GameActionType,
  //     onGameAction: (gameState: GameStateType, gameAction: GameActionType) => void
  //   ) => React.ReactNode;
  // }).createGameStateHostComponent(hostedGame, gameSpecificState, latestGameSpecificAction, onPlayerMoveAction);

  return (
    <Stack spacing={2}>
      <Typography variant="body1">BFG Table Phase: {hostedGame.tablePhase}</Typography>
      <Box>
        {hostRepresentation}
      </Box>
    </Stack>
  );
};
