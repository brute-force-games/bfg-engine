import { z } from "zod";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { useGameRegistry } from "../../hooks/games-registry/games-registry";
import { Typography, Stack, Box } from "../bfg-ui";
import { GameHostComponentProps } from "~/models/game-engine/bfg-game-engine-types";
import { BfgEncodedString, IBfgJsonZodObjectDataEncoder } from "~/models/game-engine/encoders";
import { HostP2pActionStr, PeerId, PlayerP2pActionStr } from "~/hooks/p2p/p2p-types";


export interface HostedGameViewProps {
  myPlayerSeat: GameTableSeat | null;
  myPlayerProfile: PublicPlayerProfile;
  hostedGame: GameTable;
  gameActions: DbGameTableAction[];

  peerIds: PeerId[];
  peerPlayerIds: Map<PeerId, PlayerProfileId>;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  
  onActingAsPlayerGameAction: (actingAsPlayerSeat: GameTableSeat, playerAction: PlayerP2pActionStr) => void
  onHostGameAction: (hostAction: HostP2pActionStr) => void
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

  const onHostAction = (hostAction: z.infer<typeof zodHostActionSchema>) => {
    const encodedHostAction = zodHostActionEncoder.encode(hostAction);
    const encodedHostActionStr = encodedHostAction as unknown as HostP2pActionStr;
    onHostGameAction(encodedHostActionStr);
  }
  
  const hostComponentProps: GameHostComponentProps<
    z.infer<typeof zodGameSpecificStateSchema>,
    z.infer<typeof zodHostActionSchema>
  > = {
    gameState: gameSpecificState,
    gameTable: hostedGame,
    allPlayerProfiles: props.allPlayerProfiles,
    hostPlayerProfileId: props.myPlayerProfile.id,
    actingAsPlayerProfileId: props.myPlayerProfile.id,
    actingAsPlayerSeat: props.myPlayerSeat,
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
