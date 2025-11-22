import { Box, Stack } from '@bfg-engine/ui/bfg-ui';
import { PlayerBox } from '../PlayerBox';
import { GameTableSeat, } from '@bfg-engine/models/internal/game-room-base';
import { type GameRoomP2p } from '@bfg-engine/models/p2p/game-room-p2p';
import { PublicPlayerProfile } from '@bfg-engine/models/internal/player-profile/public-player-profile';
import { PlayerProfileId } from '@bfg-engine/models/types/bfg-branded-uuids';
import { useMyDefaultPublicPlayerProfile } from '@bfg-engine/hooks/stores/use-my-player-profiles-store';
import styles from './PlayersRow.module.css';
import { isGameOver } from '../../../../models/internal/table-phase';
import { BfgGameStateForWatcher } from '@bfg-engine/game-metadata/metadata-types/game-state-types';
import { useMemo } from 'react';
import { getActivePlayerSeatsForGameTable } from '../../../../ops/game-table-ops/player-seat-utils';


export interface PlayersRowProps<GSW extends BfgGameStateForWatcher> {
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  nextToActPlayers: GameTableSeat[];
  gameState: GSW;
  playerDetailsLineFn: (gameRoom: GameRoomP2p, gameState: GSW, playerSeat: GameTableSeat) => React.ReactNode;
}

export const PlayersRow = <GSW extends BfgGameStateForWatcher>({
  gameRoom,
  allPlayerProfiles,
  nextToActPlayers,
  gameState,
  playerDetailsLineFn,
}: PlayersRowProps<GSW>) => {

  // Get all active players from the game table
  // const activePlayers: GameTableSeat[] = [];
  // if (gameTable.p1) activePlayers.push('p1');
  // if (gameTable.p2) activePlayers.push('p2');
  // if (gameTable.p3) activePlayers.push('p3');
  // if (gameTable.p4) activePlayers.push('p4');
  // if (gameTable.p5) activePlayers.push('p5');
  // if (gameTable.p6) activePlayers.push('p6');
  // if (gameTable.p7) activePlayers.push('p7');
  // if (gameTable.p8) activePlayers.push('p8');

  const activePlayers = useMemo(() => {
    return getActivePlayerSeatsForGameTable(gameRoom);
  }, [gameRoom]);

  const myProfile = useMyDefaultPublicPlayerProfile();
  const gameOver = isGameOver(gameRoom.latestRoomPhase);
  const isGameActive = !gameOver;

  return (
    <Box className={styles.playersRow} style={{ width: '100%' }}>
      <Stack spacing={2} direction="row" className={styles.playersGrid} style={{ width: '100%' }}>
        {activePlayers.map((playerSeat) => {
          const isPlayerNextToAct = isGameActive && nextToActPlayers.includes(playerSeat);
          const playerProfileId = gameRoom.players.find(player => player.role === playerSeat)?.playerProfileId ?? null;

          const playerProfile = playerProfileId ? allPlayerProfiles.get(playerProfileId) : undefined;
          const playerHandle = playerProfile?.handle || `Player ${playerSeat.toUpperCase()}`;
          const isMyPlayer = !!playerProfileId && playerProfileId === myProfile?.id;

          return (
            <Box key={playerSeat} style={{ flex: 1, minWidth: 0 }}>
              <PlayerBox
                playerSeat={playerSeat}
                isPlayerNextToAct={isPlayerNextToAct}
                playerName={playerHandle}
                playerAvatar={playerProfile?.avatarImageUrl}
                isMyPlayer={isMyPlayer}
                isGameOver={gameOver}
                gameState={gameState}
                gameRoom={gameRoom}
                playerDetailsLineFn={playerDetailsLineFn}
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
