import { z } from "zod";
import { useGameRegistry } from "../../hooks/games-registry/games-registry";
import { Container, Typography, Stack, Box } from "../bfg-ui";
import { PlayerComponentProps } from "~/models/game-engine/bfg-game-engine-types";
import { IBfgJsonZodObjectDataEncoder, BfgEncodedString } from "~/models/game-engine/encoders";
import { IPlayerBfgGameDetails } from "~/hooks/p2p/game/p2p-game-types";


export const PlayerGameView = (props: IPlayerBfgGameDetails) => {
  const { gameTable, gameActions, myPrivatePlayerKnowledgeStr, onPlayerAction } = props;

  const latestAction = gameActions[gameActions.length - 1];
  
  if (!latestAction) {
    return <Typography variant="body1">No game actions yet...</Typography>;
  }
  
  const gameTitle = gameTable.gameTitle;

  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRegistry.getGameMetadata(gameTitle);
  
  const gameSpecificStateEncoder = gameMetadata.encoders.publicGameStateEncoder;
  if (gameSpecificStateEncoder.format !== 'json-zod-object-string') {
    throw new Error('Game specific state encoder format is not json-zod-object-string');
  }

  const zodGameSpecificStateEncoder = gameSpecificStateEncoder as IBfgJsonZodObjectDataEncoder<any>;
  const zodGameSpecificStateSchema = zodGameSpecificStateEncoder.schema as z.ZodTypeAny;

  const playerActionEncoder = gameMetadata.encoders.playerActionEncoder;
  if (playerActionEncoder.format !== 'json-zod-object-string') {
    throw new Error('Player action encoder format is not json-zod-object-string');
  }

  const zodPlayerActionEncoder = playerActionEncoder as IBfgJsonZodObjectDataEncoder<any>;
  const zodPlayerActionSchema = zodPlayerActionEncoder.schema as z.ZodTypeAny;

  const nextGameStateStr: BfgEncodedString = latestAction.nextGameStateStr as unknown as BfgEncodedString;
  const gameSpecificState = gameSpecificStateEncoder.decode(nextGameStateStr) as z.infer<typeof zodGameSpecificStateSchema> | null;

  const privatePlayerKnowledgeSchema = gameMetadata.gameKnowledgeType === 'private-player-knowledge' ?
    (gameMetadata.encoders.privatePlayerKnowledgeEncoder as IBfgJsonZodObjectDataEncoder<any>).schema as z.ZodTypeAny :
    z.never();

  let myPrivatePlayerKnowledge: z.infer<typeof privatePlayerKnowledgeSchema> | null = null;
  if (gameMetadata.gameKnowledgeType === 'private-player-knowledge') {
    const privatePlayerKnowledgeEncoder = gameMetadata.encoders.privatePlayerKnowledgeEncoder;
    if (privatePlayerKnowledgeEncoder.format !== 'json-zod-object-string') {
      throw new Error('Private player knowledge encoder format is not json-zod-object-string');
    }
    
    myPrivatePlayerKnowledge = myPrivatePlayerKnowledgeStr ?
      privatePlayerKnowledgeEncoder.decode(myPrivatePlayerKnowledgeStr as unknown as BfgEncodedString) :
      null;
  }

  // if (!gameMetadata) {
  //   return (
  //     <Container style={{ padding: '24px' }}>
  //       <Stack spacing={3}>
  //         <Typography variant="h3">Loading Game Metadata...</Typography>
  //         <Typography variant="body1" color="secondary">
  //           Loading game metadata...
  //         </Typography>
  //       </Stack>
  //     </Container>
  //   )
  // }

  if (!gameSpecificState) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game State...</Typography>
          <Typography variant="body1" color="secondary">
            Waiting for game state from host...
          </Typography>
        </Stack>
      </Container>
    )
  }

  const playerGameComponentProps: PlayerComponentProps<
    z.infer<typeof zodGameSpecificStateSchema>,
    z.infer<typeof zodPlayerActionSchema>,
    // z.infer<typeof zodPrivatePlayerKnowledgeSchema>
    // never
    z.infer<typeof privatePlayerKnowledgeSchema>
    // privatePlayerKnowledgeSchema
  > = {
    gameTable: props.gameTable,
    allPlayerProfiles: props.allPlayerProfiles,
    gameState: gameSpecificState,
    myPrivatePlayerKnowledge,
    hostPlayerProfileId: props.myPlayerProfile.id,
    currentPlayerProfileId: props.myPlayerProfile.id,
    currentPlayerSeat: props.myPlayerSeat,
    latestGameAction: latestAction,
    onPlayerAction,
  };
  const playerGameRepresentation = gameMetadata.components.PlayerComponent(playerGameComponentProps);

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
