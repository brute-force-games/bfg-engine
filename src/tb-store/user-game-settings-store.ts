import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { 
  UserGameSettings, 
  UserGameSettingsSchema, 
  DEFAULT_USER_GAME_SETTINGS 
} from '../models/user-game-settings';
import { BfgSupportedGameTitle } from '../models/game-box-definition';

/**
 * TinyBase store for user game settings
 * Provides reactive state management for per-game-type settings
 * Each row is keyed by game title (BfgSupportedGameTitle)
 * These settings serve as defaults that can be overridden by user-game-table-settings
 */

export const TB_USER_GAME_SETTINGS_STORE_NAME = 'tinybase_user_game_settings';

export const TB_USER_GAME_SETTINGS_TABLE_KEY = 'userGameSettings';

// Create the store
export const userGameSettingsStore = createStore();
const persister = createLocalPersister(userGameSettingsStore, TB_USER_GAME_SETTINGS_STORE_NAME);

// Create persister for automatic localStorage persistence
persister.startAutoLoad();
persister.startAutoSave();

/**
 * Safely parse user game settings from TinyBase store
 * Returns defaults if parsing fails or data is empty
 */
export const parseRawUserGameSettings = (rawData: any): UserGameSettings => {
  // Handle empty objects or undefined
  if (!rawData || typeof rawData !== 'object' || Object.keys(rawData).length === 0) {
    return DEFAULT_USER_GAME_SETTINGS;
  }
  
  const result = UserGameSettingsSchema.safeParse(rawData);
  
  if (!result.success) {
    console.error('Error parsing user game settings:', result.error);
    // Return default settings if parsing fails
    return DEFAULT_USER_GAME_SETTINGS;
  }
  
  return result.data;
};

/**
 * Get user game settings for a specific game type
 * Returns default settings if none exist for the game
 */
export const getUserGameSettings = (gameTitle: BfgSupportedGameTitle): UserGameSettings => {
  try {
    const rawSettings = userGameSettingsStore.getRow(TB_USER_GAME_SETTINGS_TABLE_KEY, gameTitle);
    if (!rawSettings || Object.keys(rawSettings).length === 0) {
      return DEFAULT_USER_GAME_SETTINGS;
    }
    
    return parseRawUserGameSettings(rawSettings);
  } catch (error) {
    console.error('Error getting user game settings:', error);
    return DEFAULT_USER_GAME_SETTINGS;
  }
};

/**
 * Update user game settings for a specific game type
 * Creates new settings if none exist, otherwise merges with existing
 */
export const updateUserGameSettings = (
  gameTitle: BfgSupportedGameTitle,
  updates: Partial<UserGameSettings>
): boolean => {
  try {
    const currentSettings = getUserGameSettings(gameTitle);
    const updatedSettings = {
      ...currentSettings,
      ...updates,
    };
    
    // Remove undefined fields to allow proper inheritance
    // This ensures that optional fields are omitted rather than set to undefined
    Object.keys(updatedSettings).forEach((key) => {
      if (updatedSettings[key as keyof UserGameSettings] === undefined) {
        delete updatedSettings[key as keyof UserGameSettings];
      }
    });
    
    // Validate the updated settings
    const validationResult = UserGameSettingsSchema.safeParse(updatedSettings);
    if (!validationResult.success) {
      console.error('Error validating updated user game settings:', validationResult.error);
      return false;
    }
    
    userGameSettingsStore.setRow(TB_USER_GAME_SETTINGS_TABLE_KEY, gameTitle, updatedSettings as any);
    return true;
  } catch (error) {
    console.error('Error updating user game settings:', error);
    return false;
  }
};

/**
 * Reset user game settings for a specific game type to defaults
 */
export const resetUserGameSettings = (gameTitle: BfgSupportedGameTitle): boolean => {
  try {
    userGameSettingsStore.setRow(TB_USER_GAME_SETTINGS_TABLE_KEY, gameTitle, DEFAULT_USER_GAME_SETTINGS as any);
    return true;
  } catch (error) {
    console.error('Error resetting user game settings:', error);
    return false;
  }
};

/**
 * Delete user game settings for a specific game type
 */
export const deleteUserGameSettings = (gameTitle: BfgSupportedGameTitle): boolean => {
  try {
    userGameSettingsStore.delRow(TB_USER_GAME_SETTINGS_TABLE_KEY, gameTitle);
    return true;
  } catch (error) {
    console.error('Error deleting user game settings:', error);
    return false;
  }
};

/**
 * Get all user game settings (for debugging/admin purposes)
 * Returns a map of game title to settings
 */
export const getAllUserGameSettings = (): Record<BfgSupportedGameTitle, UserGameSettings> => {
  try {
    const rawSettings = userGameSettingsStore.getTable(TB_USER_GAME_SETTINGS_TABLE_KEY);
    const result: Record<BfgSupportedGameTitle, UserGameSettings> = {};
    
    Object.entries(rawSettings).forEach(([gameTitle, rawData]) => {
      const parsedSettings = parseRawUserGameSettings(rawData);
      result[gameTitle as BfgSupportedGameTitle] = parsedSettings;
    });
    
    return result;
  } catch (error) {
    console.error('Error getting all user game settings:', error);
    return {};
  }
};

/**
 * Clear all user game settings (for testing/debugging)
 */
export const clearAllUserGameSettings = (): void => {
  userGameSettingsStore.delTable(TB_USER_GAME_SETTINGS_TABLE_KEY);
};
