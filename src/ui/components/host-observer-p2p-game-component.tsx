import { z } from "zod"
import { Container, Box, Typography, Select, Option } from "../bfg-ui"
import { useGameRegistry } from "../../hooks/games-registry/games-registry"
import { ContentLoading } from "../bfg-ui/components/ContentLoading/ContentLoading"
import { useState } from "react"
import { GameTable, GameTableSeat, PLAYER_SEATS } from "../../models/game-table/game-table"
import { DbGameTableAction } from "../../models/game-table/game-table-action"
import { IBfgJsonZodObjectDataEncoder, BfgEncodedString } from "~/models/game-engine/encoders"
import { ObserverComponentProps } from "~/models/game-engine/bfg-game-engine-types"


interface IHostObserverP2pGameComponentProps {
  hostedGame: GameTable
  gameActions: DbGameTableAction[]
}

export const HostObserverP2pGameComponent = ({ hostedGame, gameActions }: IHostObserverP2pGameComponentProps) => {

  const [viewPerspective, setViewPerspective] = useState<GameTableSeat | null>(null);

  if (!hostedGame || !gameActions) {
    return (
      <ContentLoading
        message="Loading Game xDetails..."
      />
    )
  }

  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);
  
  const latestAction = gameActions[gameActions.length - 1];
  if (!latestAction) {
    return (
      <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
        <Typography variant="body1">No game actions yet...</Typography>
      </Container>
    );
  }
  
  const gameSpecificStateEncoder = gameMetadata.gameSpecificStateEncoder;
  if (gameSpecificStateEncoder.format !== 'json-zod-object') {
    throw new Error('Game specific state encoder format is not json-zod-object');
  }

  const zodGameSpecificStateEncoder = gameSpecificStateEncoder as IBfgJsonZodObjectDataEncoder<any>;
  const zodGameSpecificStateSchema = zodGameSpecificStateEncoder.schema as z.ZodTypeAny;

  const nextGameStateStr: BfgEncodedString = latestAction.nextGameStateStr as unknown as BfgEncodedString;
  const gameSpecificState = gameSpecificStateEncoder.decode(nextGameStateStr) as z.infer<typeof zodGameSpecificStateSchema> | null;

  const observerComponentProps: ObserverComponentProps<z.infer<typeof zodGameSpecificStateSchema>> = {
    gameState: gameSpecificState,
    hostPlayerProfileId: hostedGame.gameHostPlayerProfileId,
    observedPlayerProfileId: null,
    observedPlayerSeat: viewPerspective,
    latestGameAction: latestAction,
  };
  const observerRepresentation = gameMetadata.components.ObserverComponent(observerComponentProps);

  return (
    <Box>
      <Box style={{ marginBottom: '24px' }}>
        <Select
          label="View Perspective"
          value={viewPerspective || ''}
          onChange={(e) => {
            const value = e.target.value;
            setViewPerspective(value === '' ? null : value as GameTableSeat);
          }}
          fullWidth
        >
          <Option value="">No Player (Observer)</Option>
          {PLAYER_SEATS.map((seat) => {
            const playerId = hostedGame[seat];
            if (!playerId) return null;
            return (
              <Option key={seat} value={seat}>
                {seat.toUpperCase()} - {playerId.substring(0, 16)}...
              </Option>
            );
          })}
        </Select>
      </Box>
      
      {observerRepresentation}
    </Box>
  )
}
