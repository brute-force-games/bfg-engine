import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { 
  UserGameTableSettings, 
  UserGameTableSettingsSchema, 
  DEFAULT_USER_GAME_TABLE_SETTINGS 
} from '~/models/user-game-table-settings';
import { GameTableId } from '~/models/types/bfg-branded-ids';

/**
 * TinyBase store for user game table settings
 * Provides reactive state management for per-game-table settings
 * Each row is keyed by gameTableId
 * These settings are more specific than user-game-settings and take precedence
 */

export const TB_USER_GAME_TABLE_SETTINGS_STORE_NAME = 'tinybase_user_game_table_settings';

export const TB_USER_GAME_TABLE_SETTINGS_TABLE_KEY = 'userGameTableSettings';

// Create the store
export const userGameTableSettingsStore = createStore();
const persister = createLocalPersister(userGameTableSettingsStore, TB_USER_GAME_TABLE_SETTINGS_STORE_NAME);

// Create persister for automatic localStorage persistence
persister.startAutoLoad();
persister.startAutoSave();

/**
 * Safely parse user game table settings from TinyBase store
 * Returns defaults if parsing fails or data is empty
 */
export const parseRawUserGameTableSettings = (rawData: any): UserGameTableSettings => {
  // Handle empty objects or undefined
  if (!rawData || typeof rawData !== 'object' || Object.keys(rawData).length === 0) {
    return DEFAULT_USER_GAME_TABLE_SETTINGS;
  }
  
  const result = UserGameTableSettingsSchema.safeParse(rawData);
  
  if (!result.success) {
    console.error('Error parsing user game table settings:', result.error);
    // Return default settings if parsing fails
    return DEFAULT_USER_GAME_TABLE_SETTINGS;
  }
  
  return result.data;
};

/**
 * Get user game table settings for a specific game table
 * Returns default settings if none exist for the table
 */
export const getUserGameTableSettings = (gameTableId: GameTableId): UserGameTableSettings => {
  try {
    const rawSettings = userGameTableSettingsStore.getRow(TB_USER_GAME_TABLE_SETTINGS_TABLE_KEY, gameTableId);
    if (!rawSettings || Object.keys(rawSettings).length === 0) {
      return DEFAULT_USER_GAME_TABLE_SETTINGS;
    }
    
    return parseRawUserGameTableSettings(rawSettings);
  } catch (error) {
    console.error('Error getting user game table settings:', error);
    return DEFAULT_USER_GAME_TABLE_SETTINGS;
  }
};

/**
 * Update user game table settings for a specific game table
 * Creates new settings if none exist, otherwise merges with existing
 */
export const updateUserGameTableSettings = (
  gameTableId: GameTableId,
  updates: Partial<UserGameTableSettings>
): boolean => {
  try {
    const currentSettings = getUserGameTableSettings(gameTableId);
    const updatedSettings = {
      ...currentSettings,
      ...updates,
    };
    
    // Remove undefined fields to allow proper inheritance
    // This ensures that optional fields are omitted rather than set to undefined
    Object.keys(updatedSettings).forEach((key) => {
      if (updatedSettings[key as keyof UserGameTableSettings] === undefined) {
        delete updatedSettings[key as keyof UserGameTableSettings];
      }
    });
    
    // Validate the updated settings
    const validationResult = UserGameTableSettingsSchema.safeParse(updatedSettings);
    if (!validationResult.success) {
      console.error('Error validating updated user game table settings:', validationResult.error);
      return false;
    }
    
    userGameTableSettingsStore.setRow(TB_USER_GAME_TABLE_SETTINGS_TABLE_KEY, gameTableId, updatedSettings as any);
    return true;
  } catch (error) {
    console.error('Error updating user game table settings:', error);
    return false;
  }
};

/**
 * Reset user game table settings for a specific game table to defaults
 */
export const resetUserGameTableSettings = (gameTableId: GameTableId): boolean => {
  try {
    userGameTableSettingsStore.setRow(TB_USER_GAME_TABLE_SETTINGS_TABLE_KEY, gameTableId, DEFAULT_USER_GAME_TABLE_SETTINGS as any);
    return true;
  } catch (error) {
    console.error('Error resetting user game table settings:', error);
    return false;
  }
};

/**
 * Delete user game table settings for a specific game table
 */
export const deleteUserGameTableSettings = (gameTableId: GameTableId): boolean => {
  try {
    userGameTableSettingsStore.delRow(TB_USER_GAME_TABLE_SETTINGS_TABLE_KEY, gameTableId);
    return true;
  } catch (error) {
    console.error('Error deleting user game table settings:', error);
    return false;
  }
};

/**
 * Get all user game table settings (for debugging/admin purposes)
 * Returns a map of gameTableId to settings
 */
export const getAllUserGameTableSettings = (): Record<GameTableId, UserGameTableSettings> => {
  try {
    const rawSettings = userGameTableSettingsStore.getTable(TB_USER_GAME_TABLE_SETTINGS_TABLE_KEY);
    const result: Record<GameTableId, UserGameTableSettings> = {};
    
    Object.entries(rawSettings).forEach(([gameTableId, rawData]) => {
      const parsedSettings = parseRawUserGameTableSettings(rawData);
      result[gameTableId as GameTableId] = parsedSettings;
    });
    
    return result;
  } catch (error) {
    console.error('Error getting all user game table settings:', error);
    return {};
  }
};

/**
 * Clear all user game table settings (for testing/debugging)
 */
export const clearAllUserGameTableSettings = (): void => {
  userGameTableSettingsStore.delTable(TB_USER_GAME_TABLE_SETTINGS_TABLE_KEY);
};

