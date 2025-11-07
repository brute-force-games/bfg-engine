import { useCallback } from 'react';
import { useRow } from 'tinybase/ui-react';
import { 
  userGameTableSettingsStore,
  TB_USER_GAME_TABLE_SETTINGS_TABLE_KEY,
  updateUserGameTableSettings,
  resetUserGameTableSettings,
  parseRawUserGameTableSettings,
} from '../../tb-store/user-game-table-settings-store';
import { UserGameTableSettings } from '~/models/user-game-table-settings';
import { GameTableId } from '~/models/types/bfg-branded-ids';

/**
 * Hook to get user game table settings for a specific game table with reactive updates
 */
export const useUserGameTableSettings = (gameTableId: GameTableId): UserGameTableSettings => {
  const rawSettings = useRow(TB_USER_GAME_TABLE_SETTINGS_TABLE_KEY, gameTableId, userGameTableSettingsStore);
  
  // parseRawUserGameTableSettings handles empty objects and returns DEFAULT_USER_GAME_TABLE_SETTINGS if needed
  const parsedSettings = parseRawUserGameTableSettings(rawSettings);
  
  return parsedSettings;
};

/**
 * Hook for user game table settings management actions
 */
export const useUserGameTableSettingsActions = (gameTableId: GameTableId) => {
  const updateSettings = useCallback((updates: Partial<UserGameTableSettings>): boolean => {
    return updateUserGameTableSettings(gameTableId, updates);
  }, [gameTableId]);

  const resetSettings = useCallback((): boolean => {
    return resetUserGameTableSettings(gameTableId);
  }, [gameTableId]);

  return {
    updateSettings,
    resetSettings,
  };
};

