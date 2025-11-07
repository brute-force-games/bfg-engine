import { z } from "zod";
import { PlayerAgentModeSchema, GameSpineLocationSchema, GameLogPanelLocationSchema } from './app-settings';

/**
 * User-specific game settings per game table
 * These settings are stored per gameTableId and persist across sessions
 * These are the most specific settings and override user-game-settings defaults
 */
export const UserGameTableSettingsSchema = z.object({
  gameSpineLocation: GameSpineLocationSchema.optional(),
  gameLogPanelLocation: GameLogPanelLocationSchema.optional(),
  playerAgentMode: PlayerAgentModeSchema,
  // Future fields can be added here
  // Example: showHints: z.boolean(), animationSpeed: z.number(), etc.
});
export type UserGameTableSettings = z.infer<typeof UserGameTableSettingsSchema>;

/**
 * Default user game table settings
 */
export const DEFAULT_USER_GAME_TABLE_SETTINGS: UserGameTableSettings = {
  playerAgentMode: 'none',
};

