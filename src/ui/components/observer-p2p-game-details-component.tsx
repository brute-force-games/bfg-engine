import { GameTableId } from "../../models/types/bfg-branded-ids"
import { Container, Typography } from "../bfg-ui"
import { useObserverP2pGame } from "../../hooks/p2p/game/use-observer-p2p-game"
import { ContentLoading } from "../bfg-ui/components/ContentLoading/ContentLoading"


// TODO: Delete this component; convert to context somehow... see HostObserverP2pGameComponent
interface IObserverP2pGameDetailsComponentProps {
  gameTableId: GameTableId
  // activeTabId: PlayerGameTabId
}

export const ObserverP2pGameDetailsComponent = ({ gameTableId }: IObserverP2pGameDetailsComponentProps) => {

  const p2pGame = useObserverP2pGame(gameTableId);
  // const [viewPerspective, setViewPerspective] = useState<GameTableSeat | null>(null);

  if (!p2pGame) {
    return (
      <ContentLoading
        message="Loading P2P Game Observer View..."
      />
    )
  }

  const { gameTable, gameActions } = p2pGame;

  if (!gameTable || !gameActions) {
    return (
      <ContentLoading
        message="Loading Game xDetails..."
      />
    )
  }

  // const gameRegistry = useGameRegistry();
  // const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
  
  const latestAction = gameActions[gameActions.length - 1];
  if (!latestAction) {
    return (
      <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
        <Typography variant="body1">No game actions yet...</Typography>
      </Container>
    );
  }

  // const gameSpecificStateEncoder = gameMetadata.gameSpecificStateEncoder;
  // if (gameSpecificStateEncoder.format !== 'json-zod-object') {
  //   throw new Error('Game specific state encoder format is not json-zod-object');
  // }

  // const zodGameSpecificStateEncoder = gameSpecificStateEncoder as IBfgJsonZodObjectDataEncoder<any>;
  // const zodGameSpecificStateSchema = zodGameSpecificStateEncoder.schema as z.ZodTypeAny;

  // const nextGameStateStr: BfgEncodedString = latestAction.nextGameStateStr as unknown as BfgEncodedString;
  // const gameSpecificState = gameSpecificStateEncoder.decode(nextGameStateStr) as z.infer<typeof zodGameSpecificStateSchema> | null;

  // const gameRepresentation = gameMetadata.components.ObserverComponent({
  //   gameState: gameSpecificState,
  //   gameTable: gameTable,
  //   allPlayerProfiles: p2pGame.allPlayerProfiles,
  //   latestGameAction: latestAction,
  //   hostPlayerProfileId: gameTable.gameHostPlayerProfileId,
  //   observedPlayerProfileId: null,
  //   observedPlayerSeat: viewPerspective,
  // });

  
  return (
    <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
      <div style={{ padding: '20px' }}>
        <h2>Game Details</h2>
        <div style={{ marginBottom: '16px' }}>
          <strong>Game Table ID:</strong> {gameTableId}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <strong>Game State:</strong>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '12px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(gameTable, null, 2)}
          </pre>
        </div>
        <div>
          <strong>Game Actions ({gameActions.length}):</strong>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '12px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(gameActions, null, 2)}
          </pre>
        </div>
      </div>
    </Container>
  )
}
