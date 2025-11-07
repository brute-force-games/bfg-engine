import { useCallback } from 'react';
import { useRow } from 'tinybase/ui-react';
import { 
  userGameSettingsStore,
  TB_USER_GAME_SETTINGS_TABLE_KEY,
  updateUserGameSettings,
  resetUserGameSettings,
  parseRawUserGameSettings,
} from '../../tb-store/user-game-settings-store';
import { UserGameSettings } from '~/models/user-game-settings';
import { BfgSupportedGameTitle } from '~/models/game-box-definition';

/**
 * Hook to get user game settings for a specific game with reactive updates
 */
export const useUserGameSettings = (gameTitle: BfgSupportedGameTitle): UserGameSettings => {
  const rawSettings = useRow(TB_USER_GAME_SETTINGS_TABLE_KEY, gameTitle, userGameSettingsStore);
  
  // parseRawUserGameSettings handles empty objects and returns DEFAULT_USER_GAME_SETTINGS if needed
  const parsedSettings = parseRawUserGameSettings(rawSettings);
  
  return parsedSettings;
};

/**
 * Hook for user game settings management actions
 */
export const useUserGameSettingsActions = (gameTitle: BfgSupportedGameTitle) => {
  const updateSettings = useCallback((updates: Partial<UserGameSettings>): boolean => {
    return updateUserGameSettings(gameTitle, updates);
  }, [gameTitle]);

  const resetSettings = useCallback((): boolean => {
    return resetUserGameSettings(gameTitle);
  }, [gameTitle]);

  return {
    updateSettings,
    resetSettings,
  };
};

