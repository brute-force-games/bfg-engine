import { Card, Stack, Typography, Avatar } from '@bfg-engine/ui/bfg-ui';
import { GameTableSeat, } from '@bfg-engine/models/internal/game-room-base';
import { type GameRoomP2p } from '@bfg-engine/models/p2p/game-room-p2p';
import styles from './PlayerBox.module.css';
import { ArrowLeft } from '../../icons';
import type { BfgGameStateForWatcher } from '../../../../game-metadata/metadata-types/game-state-types';
// import { BfgPublicGameImplState } from '../../../../models/game-engine/bfg-game-engine-types';


export interface PlayerBoxProps<GSW extends BfgGameStateForWatcher> {
  playerSeat: GameTableSeat;
  gameRoom: GameRoomP2p;
  gameState: GSW;
  playerDetailsLineFn: (gameRoom: GameRoomP2p, gameState: GSW, playerSeat: GameTableSeat) => React.ReactNode;
  // playerSymbol: string;
  // gameState: TGameState;
  playerName: string;
  playerAvatar?: string;
  isPlayerNextToAct: boolean;
  isMyPlayer: boolean;
  isGameOver: boolean;
}

export const PlayerBox = <GSW extends BfgGameStateForWatcher>({
  playerSeat,
  gameRoom,
  gameState,
  playerDetailsLineFn,
  // gameState,
  isPlayerNextToAct,
  playerName,
  playerAvatar,
  isMyPlayer,
  isGameOver,
}: PlayerBoxProps<GSW>) => {

  const playerDetailsLine = playerDetailsLineFn(gameRoom, gameState, playerSeat);

  return (
    <Card className={[styles.playerBox, isPlayerNextToAct ? styles.currentPlayer : ''].filter(Boolean).join(' ')}>
      <Stack direction="row" alignItems="center">
        {/* Player Avatar */}
        <div className={styles.avatarContainer}>
          <Avatar 
            className={[styles.playerAvatar, isMyPlayer ? styles.myPlayerAvatar : ''].filter(Boolean).join(' ')}
            src={playerAvatar}
          >
            {/* {playerName ? playerName[0].toUpperCase() : playerSeat.toUpperCase()} */}
            {playerSeat.toUpperCase()}
          </Avatar>
        </div>

        {/* Fixed slot for turn indicator to the right of the avatar */}
        <div className={styles.turnTriangleSlot}>
          {isPlayerNextToAct && !isGameOver ? (
            <ArrowLeft width={10} height={20} style={{padding: 5 }} />
          ) : (
            <span style={{ width: 20, height: '100%', display: 'block' }} />
          )}
        </div>

        <Stack direction="column" spacing={1}>
          {/* Player Name */}
          <Typography variant="body2" className={styles.playerName}>
            {playerName}
          </Typography>

          {/* Player Symbol */}
          <Typography variant="h4" className={styles.playerSymbol}>
            {playerDetailsLine}
          </Typography>
        </Stack>


        {/* Turn Indicator */}
        {/* {isPlayerNextToAct && !isGameOver && (
          <Typography variant="caption" className={styles.turnIndicator}>
            Your Turn
          </Typography>
        )} */}

        {/* Game Status */}
        {/* {isGameOver && typeof gameState === 'object' && gameState !== null && 'resolution' in gameState && (
          <Typography variant="caption" className={styles.gameStatus}>
            {gameState.resolution === 'game-over-x-wins' && playerSymbol === 'X' && 'Winner!'}
            {gameState.resolution === 'game-over-o-wins' && playerSymbol === 'O' && 'Winner!'}
            {gameState.resolution === 'game-over-draw' && 'Draw'}
            {gameState.resolution === 'game-over-x-wins' && playerSymbol === 'O' && 'Lost'}
            {gameState.resolution === 'game-over-o-wins' && playerSymbol === 'X' && 'Lost'}
          </Typography>
        )} */}

        {/* Move Count */}
        <Typography variant="caption" className={styles.moveCount}>
          {/* {playerMoves} moves */}
        </Typography>
      </Stack>
    </Card>
  );
};
