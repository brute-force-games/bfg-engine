import { BfgSupportedGameTitle } from '../../../models/game-box-definition';
import { BfgGameTableId } from '../../../models/types/bfg-branded-uuids';

export interface OptionalGameContext {
  gameTitle: BfgSupportedGameTitle | null;
  gameTableId: BfgGameTableId | null;
  tableName: string | null;
}

/**
 * This interface allows passing game context to components that may not
 * be inside a P2pGameRoomContextProvider. Use this when you want to
 * conditionally enable features based on game context.
 * 
 * @example
 * ```tsx
 * // In a game page component that has access to game room
 * const gameRoom = useBfgGameRoomForContextRole();
 * const gameContext: OptionalGameContext = gameRoom?.publicGameDetails?.gameTable 
 *   ? {
 *       gameTitle: gameRoom.publicGameDetails.gameTable.gameTitle,
 *       gameTableId: gameRoom.gameTableId,
 *       tableName: gameRoom.publicGameDetails.gameTable.currentStatusDescription
 *     }
 *   : EMPTY_GAME_CONTEXT;
 * 
 * // Pass to components
 * <UserProfileAccessComponent gameContext={gameContext} />
 * ```
 */

/**
 * Default empty game context for when not in a game
 */
export const EMPTY_GAME_CONTEXT: OptionalGameContext = {
  gameTitle: null,
  gameTableId: null,
  tableName: null,
};

