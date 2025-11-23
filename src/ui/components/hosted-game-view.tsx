import { z } from "zod";
import { Typography, Stack, Box } from "../bfg-ui";
// import { GameHostComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
// import { BfgEncodedString } from "@bfg-engine/game-metadata/encoders";
// import type { IBfgJsonZodObjectDataEncoder } from "@bfg-engine/game-metadata/encoders";
import { IBfgGameTableForHost } from "@bfg-engine/hooks/p2p/game/p2p-game-types";
import { GameHostComponentProps } from "@bfg-engine/game-metadata/ui/bfg-game-components";
import { useGameMetadata } from "../../hooks/games-registry/use-game-metadata";
// import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../../game-metadata/metadata-types/game-state-types";


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
// export const HostedGameView = (props: IBfgGameRoomForHost<BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher, BfgGameActionByPlayer, BfgGameActionByHost>) => {
export const HostedGameView = (props: IBfgGameTableForHost) => {
  // const { hostedGame, gameActions, onHostGameAction, ...hostComponentProps } = props;
  const { hostGameDetails, p2pDetails } = props;
  const { gameRoom, latestHostGameEvent, hostGameEvents, onHostAction, myHostProfile } = hostGameDetails;
  const { allPlayerProfiles } = p2pDetails;
  // const latestAction = gameRoom.gameActions[gameRoom.gameActions.length - 1];
  // const latestEvent = hostGameEvents[hostGameEvents.length - 1];
  const latestEvent = latestHostGameEvent;

  const gameMetadata = useGameMetadata(gameRoom.gameTitle);
  
  if (!gameRoom) {
    return <Typography variant="body1">Game table not found...</Typography>;
  }

  if (!latestEvent) {
    return <Typography variant="body1">No game actions yet...</Typography>;
  }
  
  // const gameTitle = gameRoom.gameTitle;

  // const gameRegistry = useGameRegistry();
  // const gameMetadata = gameRegistry.getGameMetadata(gameTitle);

  // const gameSpecificStateEncoder = gameMetadata.encoders.hostGameStateEncoder;
  // if (gameSpecificStateEncoder.format !== 'json-zod-object-string') {
  //   throw new Error('Game specific state encoder format is not json-zod-object-string');
  // }

  // const zodGameSpecificStateEncoder = gameSpecificStateEncoder as IBfgJsonZodObjectDataEncoder<any>;
  // const zodGameSpecificStateSchema = zodGameSpecificStateEncoder.schema as z.ZodTypeAny;

  // const hostActionEncoder = gameMetadata.encoders.hostActionEncoder;
  // if (hostActionEncoder.format !== 'json-zod-object-string') {
  //   throw new Error('Host action encoder format is not json-zod-object-string');
  // }

  // const zodHostActionEncoder = hostActionEncoder as IBfgJsonZodObjectDataEncoder<any>;
  // const zodHostActionSchema = zodHostActionEncoder.schema as z.ZodTypeAny;

  // const nextGameStateStr: BfgEncodedString = latestAction.nextGameStateStr as unknown as BfgEncodedString;
  // const gameSpecificState = gameSpecificStateEncoder.decode(nextGameStateStr) as z.infer<typeof zodGameSpecificStateSchema> | null;

  // const onHostAction = (hostAction: z.infer<typeof zodHostActionSchema>) => {
  //   const encodedHostAction = zodHostActionEncoder.encode(hostAction);
  //   const encodedHostActionStr = encodedHostAction as unknown as HostP2pActionStr;
  //   onHostGameAction(encodedHostActionStr);
  //   onHostAction(hostAction);
  // }

  const { hostGameStateSchema } = gameMetadata.schemas;
  type HostGameState = z.infer<typeof hostGameStateSchema>;
  
  // Validate the gameState to ensure all required properties are present
  const gameStateParseResult = hostGameStateSchema.safeParse(latestEvent.nextGameHostState);
  if (!gameStateParseResult.success) {
    console.error('❌ Game state validation failed:', gameStateParseResult.error);
    console.error('❌ Raw game state:', latestEvent.nextGameHostState);
    throw new Error('Game state validation failed: ' + gameStateParseResult.error.message);
  }
  const gameState = gameStateParseResult.data;
  
  const hostComponentProps: GameHostComponentProps<HostGameState> = {
    gameState,
    gameRoom,
    allPlayerProfiles,
    hostPlayerProfileId: myHostProfile.id,
    actingAsPlayerProfileId: null,
    actingAsPlayerSeat: null,
    latestHostGameEvent,
    hostGameEvents,
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
