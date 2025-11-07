import { GameTableId } from '~/models/types/bfg-branded-ids';
import { BfgSupportedGameTitle } from '~/models/game-box-definition';
import { UserGameSettings } from '~/models/user-game-settings';
import { getUserGameSettings } from './user-game-settings-store';
import { getUserGameTableSettings } from './user-game-table-settings-store';

/**
 * Get effective user game settings for a specific game table
 * Implements hierarchical lookup:
 * 1. First checks user-game-table-settings (most specific)
 * 2. Falls back to user-game-settings (game type defaults)
 * 3. Falls back to DEFAULT_USER_GAME_SETTINGS (system defaults)
 * 
 * @param gameTableId - The specific game table ID
 * @param gameTitle - The game type title
 * @returns The effective settings with hierarchy applied
 */
export const getEffectiveUserGameSettings = (
  gameTableId: GameTableId,
  gameTitle: BfgSupportedGameTitle
): UserGameSettings => {
  // Get game type defaults
  const gameDefaults = getUserGameSettings(gameTitle);
  
  // Get table-specific settings
  const tableSettings = getUserGameTableSettings(gameTableId);
  
  // Merge with table settings taking precedence
  // Only override fields that are explicitly set
  const effectiveSettings: UserGameSettings = {
    ...gameDefaults,
  };
  
  // Override with table settings if they are explicitly set
  if (tableSettings.gameSpineLocation !== undefined) {
    effectiveSettings.gameSpineLocation = tableSettings.gameSpineLocation;
  }
  
  if (tableSettings.gameLogPanelLocation !== undefined) {
    effectiveSettings.gameLogPanelLocation = tableSettings.gameLogPanelLocation;
  }
  
  if (tableSettings.playerAgentMode !== 'none' || gameDefaults.playerAgentMode === 'none') {
    effectiveSettings.playerAgentMode = tableSettings.playerAgentMode;
  }
  
  return effectiveSettings;
};

/**
 * Check if a game table has specific settings that override the game defaults
 * @param gameTableId - The game table ID to check
 * @param gameTitle - The game type title
 * @returns true if table has custom settings
 */
export const hasTableSpecificSettings = (
  gameTableId: GameTableId,
  gameTitle: BfgSupportedGameTitle
): boolean => {
  const gameDefaults = getUserGameSettings(gameTitle);
  const tableSettings = getUserGameTableSettings(gameTableId);
  
  // Check if any field differs from game defaults
  return (
    tableSettings.gameSpineLocation !== undefined && tableSettings.gameSpineLocation !== gameDefaults.gameSpineLocation ||
    tableSettings.gameLogPanelLocation !== undefined && tableSettings.gameLogPanelLocation !== gameDefaults.gameLogPanelLocation ||
    tableSettings.playerAgentMode !== gameDefaults.playerAgentMode
  );
};

