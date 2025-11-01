import { useCallback } from 'react';
import { useValues } from 'tinybase/ui-react';
import { 
  appSettingsStore,
  updateAppSettings,
  resetAppSettings,
  parseRawAppSettings,
  AppSettings,
  GameSpineLocation,
} from '../../tb-store/app-settings-store';

/**
 * Hook to get app settings with reactive updates
 */
export const useAppSettings = (): AppSettings => {
  const rawSettings = useValues(appSettingsStore);
  
  // parseRawAppSettings handles empty objects and returns DEFAULT_APP_SETTINGS if needed
  const parsedSettings = parseRawAppSettings(rawSettings);
  
  // parseRawAppSettings always returns a valid AppSettings (never null)
  return parsedSettings;
};

/**
 * Hook to get the game spine location with reactive updates
 */
export const useGameSpineLocation = (): GameSpineLocation => {
  const settings = useAppSettings();
  return settings.gameSpineLocation;
};

/**
 * Hook for app settings management actions
 */
export const useAppSettingsActions = () => {
  const updateSettings = useCallback((updates: Partial<AppSettings>): boolean => {
    return updateAppSettings(updates);
  }, []);

  const updateGameSpineLocation = useCallback((location: GameSpineLocation): boolean => {
    return updateAppSettings({ gameSpineLocation: location });
  }, []);

  const resetSettings = useCallback((): boolean => {
    return resetAppSettings();
  }, []);

  return {
    updateSettings,
    updateGameSpineLocation,
    resetSettings,
  };
};

