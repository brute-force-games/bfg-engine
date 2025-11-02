import { z } from "zod";


/**
 * Game spine location options
 */
export const GameSpineLocationSchema = z.enum([
  'nav-bar',
  'top',
  'left',
  'right',
  'bottom',
  'hidden',
]);
export type GameSpineLocation = z.infer<typeof GameSpineLocationSchema>;


export const GameLogPanelLocationSchema = z.enum([
  'none',
  'left',
  'right',
]);
export type GameLogPanelLocation = z.infer<typeof GameLogPanelLocationSchema>;


export const PlayerAgentModeSchema = z.enum([
  'none',
  'chaotic-random',
  'try-to-win',
  'try-to-lose',
]);
export type PlayerAgentMode = z.infer<typeof PlayerAgentModeSchema>;

/**
 * App settings schema
 */
export const AppSettingsSchema = z.object({
  gameSpineLocation: GameSpineLocationSchema,
  gameLogPanelLocation: GameLogPanelLocationSchema,
  playerAgentMode: PlayerAgentModeSchema,
});
export type AppSettings = z.infer<typeof AppSettingsSchema>;
