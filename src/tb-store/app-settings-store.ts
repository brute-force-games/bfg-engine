import { z } from 'zod';
import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';

/**
 * TinyBase store for user app settings
 * Provides reactive state management for application settings
 */

export const TB_APP_SETTINGS_STORE_NAME = 'tinybase_app_settings';

// export const TB_APP_SETTINGS_VALUE_KEY = 'appSettings';

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
  playerAgentMode: PlayerAgentModeSchema,
});
export type AppSettings = z.infer<typeof AppSettingsSchema>;

/**
 * Default app settings
 */
export const DEFAULT_APP_SETTINGS: AppSettings = {
  gameSpineLocation: 'top',
  playerAgentMode: 'none',
};

// Create the store
export const appSettingsStore = createStore();
const persister = createLocalPersister(appSettingsStore, TB_APP_SETTINGS_STORE_NAME);

// Create persister for automatic localStorage persistence
persister.startAutoLoad();
persister.startAutoSave();

// Initialize with default settings if store is empty
const existingSettings = appSettingsStore.getValues();
if (!existingSettings || Object.keys(existingSettings).length === 0) {
  appSettingsStore.setValues(DEFAULT_APP_SETTINGS);
}

/**
 * Safely parse app settings from TinyBase store
 * Always returns a valid AppSettings (returns defaults if parsing fails or data is empty)
 */
export const parseRawAppSettings = (rawData: any): AppSettings => {
  // Handle empty objects or undefined
  if (!rawData || typeof rawData !== 'object' || Object.keys(rawData).length === 0) {
    return DEFAULT_APP_SETTINGS;
  }
  
  const result = AppSettingsSchema.safeParse(rawData);
  
  if (!result.success) {
    console.error('Error parsing app settings:', result.error);
    // Return default settings if parsing fails
    return DEFAULT_APP_SETTINGS;
  }
  
  return result.data;
};

/**
 * Get app settings from the store
 */
export const getAppSettings = (): AppSettings => {
  try {
    const rawSettings = appSettingsStore.getValues();
    if (!rawSettings || Object.keys(rawSettings).length === 0) {
      // Ensure defaults are set if store is empty
      appSettingsStore.setValues(DEFAULT_APP_SETTINGS);
      return DEFAULT_APP_SETTINGS;
    }
    
    return parseRawAppSettings(rawSettings) ?? DEFAULT_APP_SETTINGS;
  } catch (error) {
    console.error('Error getting app settings:', error);
    return DEFAULT_APP_SETTINGS;
  }
};

/**
 * Update app settings in the store
 */
export const updateAppSettings = (updates: Partial<AppSettings>): boolean => {
  try {
    const currentSettings = getAppSettings();
    const updatedSettings = {
      ...currentSettings,
      ...updates,
    };
    
    // Validate the updated settings
    const validationResult = AppSettingsSchema.safeParse(updatedSettings);
    if (!validationResult.success) {
      console.error('Error validating updated app settings:', validationResult.error);
      return false;
    }
    
    appSettingsStore.setValues(updatedSettings);
    return true;
  } catch (error) {
    console.error('Error updating app settings:', error);
    return false;
  }
};

/**
 * Reset app settings to defaults
 */
export const resetAppSettings = (): boolean => {
  try {
    appSettingsStore.setValues(DEFAULT_APP_SETTINGS);
    return true;
  } catch (error) {
    console.error('Error resetting app settings:', error);
    return false;
  }
};

