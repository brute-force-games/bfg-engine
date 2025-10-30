import { z } from "zod";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { useGameRegistry } from "../../hooks/games-registry/games-registry";
import { Container, Typography, Stack, Box } from "../bfg-ui";
import { PlayerComponentProps } from "~/models/game-engine/bfg-game-engine-types";
import { IBfgJsonZodObjectDataEncoder, BfgEncodedString } from "~/models/game-engine/encoders";
import { PeerId, PlayerP2pActionStr } from "~/hooks/p2p/p2p-types";
import { PlayerProfileId } from "~/models/types/bfg-branded-ids";


interface PlayerGameViewProps {
  myPlayerSeat: GameTableSeat;
  myPlayerProfile: PublicPlayerProfile;
  gameTable: GameTable;
  peers: PeerId[];
  peerPlayers: Map<PeerId, PublicPlayerProfile>;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  gameActions: DbGameTableAction[];
  
  onPlayerGameAction: (playerActionStr: PlayerP2pActionStr) => void
}

export const PlayerGameView = (props: PlayerGameViewProps) => {
  const { gameTable, gameActions, onPlayerGameAction } = props;

  const latestAction = gameActions[gameActions.length - 1];
  
  if (!latestAction) {
    return <Typography variant="body1">No game actions yet...</Typography>;
  }
  
  const gameTitle = gameTable.gameTitle;

  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRegistry.getGameMetadata(gameTitle);
  
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

  const onPlayerAction = (playerAction: z.infer<typeof zodHostActionSchema>) => {
    console.log('🎮 PLAYER SENDING ACTION:', playerAction);
    const encodedPlayerAction = zodHostActionEncoder.encode(playerAction);
    const encodedPlayerActionStr = encodedPlayerAction as unknown as PlayerP2pActionStr;
    onPlayerGameAction(encodedPlayerActionStr);
  }

  const playerGameComponentProps: PlayerComponentProps<
    z.infer<typeof zodGameSpecificStateSchema>,
    z.infer<typeof zodHostActionSchema>
  > = {
    gameTable: props.gameTable,
    allPlayerProfiles: props.allPlayerProfiles,
    gameState: gameSpecificState,
    hostPlayerProfileId: props.myPlayerProfile.id,
    currentPlayerProfileId: props.myPlayerProfile.id,
    currentPlayerSeat: props.myPlayerSeat,
    latestGameAction: latestAction,
    onPlayerAction,
  };
  const playerGameRepresentation = gameMetadata.components.PlayerComponent(playerGameComponentProps);

  
  if (!gameMetadata) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game Metadata...</Typography>
          <Typography variant="body1" color="secondary">
            Loading game metadata...
          </Typography>
        </Stack>
      </Container>
    )
  }

  return (
    <Box>
      {/* <Typography variant="body1">My Player Seat: {props.myPlayerSeat}</Typography> */}
      {/* <Typography variant="body1">Peers: {props.peers.length}
        {props.peers.map((peerId) => (
          <Typography variant="body1" key={peerId}>{peerId}</Typography>
        ))}
      </Typography>
      <Typography variant="body1">Peer players: {props.peerPlayers.size}
        {props.peers.map((peerId) => (
          <Typography variant="body1" key={peerId}>{peerId} [{props.peerPlayers.get(peerId)?.handle || 'unknown'}]</Typography>
        ))}
      </Typography>
      <Typography variant="body1">All player profiles: {props.allPlayerProfiles.size}</Typography>
      {Array.from(props.allPlayerProfiles.values()).map((profile) => (
          <Typography variant="body1" key={profile.id}>{profile.id}: {profile.handle}</Typography>
        ))} */}

      {/* {Array.from(props.allPlayerProfiles.values()).map((profile) => (
        <Typography variant="body1" key={profile.id}>{profile.id}: {profile.handle}</Typography>
      ))} */}

      {playerGameRepresentation}
    </Box>
  );
};
