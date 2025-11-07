import { z } from "zod";
import { PlayerAgentModeSchema, GameSpineLocationSchema, GameLogPanelLocationSchema } from './app-settings';

/**
 * User-specific game settings per game type
 * These settings are stored per game title (e.g., "Tic-Tac-Toe", "Go Fish")
 * and serve as defaults for all tables of that game type
 * User-game-table-settings override these when set
 */
export const UserGameSettingsSchema = z.object({
  gameSpineLocation: GameSpineLocationSchema.optional(),
  gameLogPanelLocation: GameLogPanelLocationSchema.optional(),
  playerAgentMode: PlayerAgentModeSchema,
  // Future fields can be added here
  // Example: showHints: z.boolean(), animationSpeed: z.number(), etc.
});
export type UserGameSettings = z.infer<typeof UserGameSettingsSchema>;

/**
 * Default user game settings
 */
export const DEFAULT_USER_GAME_SETTINGS: UserGameSettings = {
  playerAgentMode: 'none',
};
