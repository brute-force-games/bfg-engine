import { Box, Stack } from '@bfg-engine/ui/bfg-ui';
import { PlayerBox } from '../PlayerBox';
import { GameTable, GameTableSeat } from '@bfg-engine/models/game-table/game-table';
import { PublicPlayerProfile } from '@bfg-engine/models/player-profile/public-player-profile';
import { PlayerProfileId } from '@bfg-engine/models/types/bfg-branded-ids';
import { useMyDefaultPublicPlayerProfile } from '@bfg-engine/hooks/stores/use-my-player-profiles-store';
import styles from './PlayersRow.module.css';
import { isGameOver } from '~/models/game-table/table-phase';


export interface PlayersRowProps {
  // gameState: TGameState;
  gameTable: GameTable;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  nextToActPlayers: GameTableSeat[];
}

export const PlayersRow = ({
  // gameState,
  gameTable,
  allPlayerProfiles,
  nextToActPlayers,
}: PlayersRowProps) => {
  
  // Get all active players from the game table
  const activePlayers: GameTableSeat[] = [];
  if (gameTable.p1) activePlayers.push('p1');
  if (gameTable.p2) activePlayers.push('p2');
  if (gameTable.p3) activePlayers.push('p3');
  if (gameTable.p4) activePlayers.push('p4');
  if (gameTable.p5) activePlayers.push('p5');
  if (gameTable.p6) activePlayers.push('p6');
  if (gameTable.p7) activePlayers.push('p7');
  if (gameTable.p8) activePlayers.push('p8');


  const myProfile = useMyDefaultPublicPlayerProfile();
  const gameOver = isGameOver(gameTable.tablePhase);
  const isGameActive = !gameOver;

  return (
    <Box className={styles.playersRow} style={{ width: '100%' }}>
      <Stack spacing={2} direction="row" className={styles.playersGrid} style={{ width: '100%' }}>
        {activePlayers.map((playerSeat) => {
          const isPlayerNextToAct = isGameActive && nextToActPlayers.includes(playerSeat);
          // const isPlayerNextToAct = true;
          const playerProfileId = gameTable[playerSeat];

          const playerProfile = playerProfileId ? allPlayerProfiles.get(playerProfileId) : undefined;
          const playerHandle = playerProfile?.handle || `Player ${playerSeat.toUpperCase()}`;
          const isMyPlayer = !!playerProfileId && playerProfileId === myProfile?.id;

          return (
            <Box key={playerSeat} style={{ flex: 1, minWidth: 0 }}>
              <PlayerBox
                playerSeat={playerSeat}
                playerSymbol={'XXXXXXXXXX'}
                // gameState={gameState}
                isPlayerNextToAct={isPlayerNextToAct}
                playerName={playerHandle}
                playerAvatar={playerProfile?.avatarImageUrl}
                isMyPlayer={isMyPlayer}
                isGameOver={gameOver}
              />
            </Box>
          );
        })}

        {/* Game Status Summary */}
        {/* <Box className={styles.gameStatusSummary}>
          <Typography variant="body2" className={styles.statusText}>
            blah */}
            {/* Only show game status if gameState has resolution property */}
            {/* {typeof gameState === 'object' && gameState !== null && 'resolution' in gameState && gameState.resolution === 'game-in-progress' && (
              <>Current turn: <strong>{gameTable[currentPlayer] ? playerProfiles.get(gameTable[currentPlayer]!)?.handle || currentPlayer.toUpperCase() : currentPlayer.toUpperCase()}</strong></>
            )}
            {typeof gameState === 'object' && gameState !== null && 'resolution' in gameState && gameState.resolution === 'game-over-x-wins' && (
              <>🎉 <strong>{playerProfiles.get(gameTable.p1)?.handle || 'X'} wins!</strong></>
            )}
            {typeof gameState === 'object' && gameState !== null && 'resolution' in gameState && gameState.resolution === 'game-over-o-wins' && (
              <>🎉 <strong>{gameTable.p2 ? playerProfiles.get(gameTable.p2)?.handle || 'O' : 'O'} wins!</strong></>
            )}
            {typeof gameState === 'object' && gameState !== null && 'resolution' in gameState && gameState.resolution === 'game-over-draw' && (
              <>🤝 <strong>It's a draw!</strong></>
            )} */}
          {/* </Typography>
        </Box> */}
      </Stack>
    </Box>
  );
};
