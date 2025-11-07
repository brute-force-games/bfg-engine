import { z } from "zod";
import { useGameRegistry } from "../../hooks/games-registry/games-registry";
import { Typography, Stack, Box } from "../bfg-ui";
import { GameHostComponentProps } from "~/models/game-engine/bfg-game-engine-types";
import { BfgEncodedString, IBfgJsonZodObjectDataEncoder } from "~/models/game-engine/encoders";
import { IBfgGameRoomForHost } from "~/hooks/p2p/game/p2p-game-types";


// export interface HostedGameViewProps {
//   myPlayerSeat: GameTableSeat | null;
//   myPlayerProfile: PublicPlayerProfile;
//   hostedGame: GameTable;
//   gameActions: DbGameTableAction[];

//   peerIds: PeerId[];
//   peerPlayerIds: Map<PeerId, PlayerProfileId>;
//   allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  
//   onActingAsPlayerGameAction: (actingAsPlayerSeat: GameTableSeat, playerAction: PlayerP2pActionStr) => void
//   onHostGameAction: (hostAction: HostP2pActionStr) => void
// }

// export const HostedGameView = (props: HostedGameViewProps) => {
export const HostedGameView = (props: IBfgGameRoomForHost) => {
  // const { hostedGame, gameActions, onHostGameAction, ...hostComponentProps } = props;
  const { hostGameDetails, p2pDetails } = props;
  const { gameTable, gameActions, onHostAction, myHostProfile } = hostGameDetails;
  const { allPlayerProfiles } = p2pDetails;
  const latestAction = gameActions[gameActions.length - 1];
  
  if (!gameTable) {
    return <Typography variant="body1">Game table not found...</Typography>;
  }

  if (!latestAction) {
    return <Typography variant="body1">No game actions yet...</Typography>;
  }
  
  const gameTitle = gameTable.gameTitle;

  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRegistry.getGameMetadata(gameTitle);

  const gameSpecificStateEncoder = gameMetadata.encoders.hostGameStateEncoder;
  if (gameSpecificStateEncoder.format !== 'json-zod-object-string') {
    throw new Error('Game specific state encoder format is not json-zod-object-string');
  }

  const zodGameSpecificStateEncoder = gameSpecificStateEncoder as IBfgJsonZodObjectDataEncoder<any>;
  const zodGameSpecificStateSchema = zodGameSpecificStateEncoder.schema as z.ZodTypeAny;

  const hostActionEncoder = gameMetadata.encoders.hostActionEncoder;
  if (hostActionEncoder.format !== 'json-zod-object-string') {
    throw new Error('Host action encoder format is not json-zod-object-string');
  }

  const zodHostActionEncoder = hostActionEncoder as IBfgJsonZodObjectDataEncoder<any>;
  const zodHostActionSchema = zodHostActionEncoder.schema as z.ZodTypeAny;

  const nextGameStateStr: BfgEncodedString = latestAction.nextGameStateStr as unknown as BfgEncodedString;
  const gameSpecificState = gameSpecificStateEncoder.decode(nextGameStateStr) as z.infer<typeof zodGameSpecificStateSchema> | null;

  // const onHostAction = (hostAction: z.infer<typeof zodHostActionSchema>) => {
  //   const encodedHostAction = zodHostActionEncoder.encode(hostAction);
  //   const encodedHostActionStr = encodedHostAction as unknown as HostP2pActionStr;
  //   onHostGameAction(encodedHostActionStr);
  //   onHostAction(hostAction);
  // }
  
  const hostComponentProps: GameHostComponentProps<
    z.infer<typeof zodGameSpecificStateSchema>,
    z.infer<typeof zodHostActionSchema>
  > = {
    gameState: gameSpecificState,
    gameTable,
    allPlayerProfiles,
    hostPlayerProfileId: myHostProfile.id,
    actingAsPlayerProfileId: null,
    actingAsPlayerSeat: null,
    latestGameAction: latestAction,
    onHostAction,
  };

  const hostRepresentation = gameMetadata.components.HostComponent(hostComponentProps);


  return (
    <Stack spacing={2}>
      <Box>
        {hostRepresentation}
      </Box>
    </Stack>
  );
};
