import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { PrivatePlayerProfile, PrivatePlayerProfileSchema } from "@bfg-engine/models/player-profile/private-player-profile";
import { PublicPlayerProfile } from "@bfg-engine/models/player-profile/public-player-profile";
import { createPrivatePlayerProfile } from "@bfg-engine/models/player-profile/private-player-profile";
import { createPlayerProfileId, PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-ids";


/**
 * TinyBase store for player profiles
 * Provides reactive state management for player profile data
 */


export const TB_STORE_NAME = 'tinybase_player_profiles';

export const TB_PLAYER_PROFILES_TABLE_KEY = 'playerProfiles';

export const TB_DEFAULT_PROFILE_ID_KEY = 'defaultProfileId';
export const DEFAULT_PROFILE_ID_VALUE = '';


// Create the store
export const playerProfileStore = createStore();
const persister = createLocalPersister(playerProfileStore, 'tinybase_player_profiles');

// Create persister for automatic localStorage persistence
persister.startAutoLoad();
persister.startAutoSave();

// Set initial values only if store is empty (no existing data)
const hasExistingData = playerProfileStore.getTable(TB_PLAYER_PROFILES_TABLE_KEY) && 
  Object.keys(playerProfileStore.getTable('playerProfiles')).length > 0;

if (!hasExistingData) {
  playerProfileStore.setValue(TB_DEFAULT_PROFILE_ID_KEY, DEFAULT_PROFILE_ID_VALUE);
}


/**
 * Safely parse profile data from TinyBase store - now just validates the stored object
 */
export const parseRawProfileData = (profileId: PlayerProfileId, rawData: any): PrivatePlayerProfile | null => {
  // TinyBase stores complex nested objects as JSON strings, so we need to parse the webCryptoWallet field
  let parsedData = rawData;
  if (rawData.webCryptoWallet && typeof rawData.webCryptoWallet === 'string') {
    try {
      parsedData = {
        ...rawData,
        webCryptoWallet: JSON.parse(rawData.webCryptoWallet),
      };
    } catch (error) {
      console.error(`Error parsing webCryptoWallet for ${profileId}:`, error);
      return null;
    }
  }
  
  const result = PrivatePlayerProfileSchema.safeParse(parsedData);
  
  if (!result.success) {
    console.error(`Error validating profile data for ${profileId}:`, result.error);
    return null;
  }
  
  return result.data;
}


/**
 * Add a new player profile to the store
 */
export const addPlayerProfile = async (
  handle: string,
  avatarImageUrl?: string
): Promise<PlayerProfileId> => {
  try {
    // Create profile data using mnemonic-based wallet system
    const profileData = await createPrivatePlayerProfile(handle, avatarImageUrl);
    
    // Add required fields
    const now = Date.now();
    const profileId = createPlayerProfileId();
    
    const completeProfileData: PrivatePlayerProfile = {
      id: profileId,
      ...profileData,
      createdAt: now,
      updatedAt: now,
    };
    
    // Serialize webCryptoWallet as JSON string for TinyBase storage
    const storeData = {
      ...completeProfileData,
      webCryptoWallet: JSON.stringify(completeProfileData.webCryptoWallet),
    };
    
    // Add to store - store the entire profile object
    playerProfileStore.setRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId, storeData as any);
    
    return profileId;
  } catch (error) {
    console.error('Error adding player profile:', error);
    throw new Error('Failed to add player profile');
  }
};

/**
 * Update an existing player profile
 */
export const updatePlayerProfile = (
  profileId: PlayerProfileId,
  updates: Partial<Omit<PrivatePlayerProfile, 'id' | 'createdAt' | 'updatedAt'>>
): boolean => {
  try {
    const existingProfile = playerProfileStore.getRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId);
    if (!existingProfile) {
      return false;
    }
    
    // Serialize webCryptoWallet if it's being updated
    const serializedUpdates = updates.webCryptoWallet
      ? { ...updates, webCryptoWallet: JSON.stringify(updates.webCryptoWallet) }
      : updates;
    
    const updatedProfile = {
      ...existingProfile,
      ...serializedUpdates,
      updatedAt: Date.now(),
    };
    
    playerProfileStore.setRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId, updatedProfile as any);
    return true;
  } catch (error) {
    console.error('Error updating player profile:', error);
    return false;
  }
};

/**
 * Delete a player profile
 */
export const deletePlayerProfile = (profileId: PlayerProfileId): boolean => {
  try {
    const existingProfile = playerProfileStore.getRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId);
    if (!existingProfile) {
      return false;
    }
    
    // Remove from store
    playerProfileStore.delRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId);
    
    // If this was the default profile, clear the default
    const currentDefault = playerProfileStore.getValue(TB_DEFAULT_PROFILE_ID_KEY);
    if (currentDefault === profileId) {
      playerProfileStore.setValue(TB_DEFAULT_PROFILE_ID_KEY, DEFAULT_PROFILE_ID_VALUE);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting player profile:', error);
    return false;
  }
};

/**
 * Get a player profile by ID
 */
export const getPlayerProfile = (profileId: PlayerProfileId): PrivatePlayerProfile | null => {
  try {
    const rawProfileData = playerProfileStore.getRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId);
    if (!rawProfileData) {
      return null;
    }
    
    return parseRawProfileData(profileId, rawProfileData);
  } catch (error) {
    console.error('Error getting player profile:', error);
    return null;
  }
};

/**
 * Get all player profiles
 */
export const getAllPlayerProfiles = (): PrivatePlayerProfile[] => {
  try {
    const rawProfiles = playerProfileStore.getTable(TB_PLAYER_PROFILES_TABLE_KEY);
    const profiles: PrivatePlayerProfile[] = [];
    
    Object.entries(rawProfiles).forEach(([id, rawProfileData]) => {
      const parsedProfile = parseRawProfileData(id as PlayerProfileId, rawProfileData);
      if (parsedProfile) {
        profiles.push(parsedProfile);
      }
    });
    
    return profiles;
  } catch (error) {
    console.error('Error getting all player profiles:', error);
    return [];
  }
};

/**
 * Set the default player profile
 */
export const setDefaultProfile = async (profileId: PlayerProfileId): Promise<boolean> => {
  try {
    const profile = playerProfileStore.getRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId);
    if (!profile) {
      return false;
    }
    
    playerProfileStore.setValue(TB_DEFAULT_PROFILE_ID_KEY, profileId);
    
    return true;
  } catch (error) {
    console.error('Error setting default profile:', error);
    return false;
  }
};

/**
 * Get the default player profile
 */
export const getDefaultPlayerProfile = (): PrivatePlayerProfile | null => {
  try {
    const defaultId = playerProfileStore.getValue(TB_DEFAULT_PROFILE_ID_KEY);
    if (!defaultId || typeof defaultId !== 'string') {
      return null;
    }
    
    return getPlayerProfile(defaultId as PlayerProfileId);
  } catch (error) {
    console.error('Error getting default player profile:', error);
    return null;
  }
};

/**
 * Convert a private profile to public (for sharing)
 */
export const getPublicProfile = (profileId: PlayerProfileId): PublicPlayerProfile | null => {
  const privateProfile = getPlayerProfile(profileId);
  if (!privateProfile) {
    return null;
  }
  
  return {
    id: privateProfile.id,
    handle: privateProfile.handle,
    avatarImageUrl: privateProfile.avatarImageUrl,
    signingPublicKey: privateProfile.signingPublicKey,
    encryptionPublicKey: privateProfile.encryptionPublicKey,
    publicKey: privateProfile.publicKey, // Legacy
    walletAddress: privateProfile.walletAddress, // Legacy
    walletPublicKey: privateProfile.walletPublicKey, // Legacy
    identityType: privateProfile.identityType,
    createdAt: privateProfile.createdAt,
    updatedAt: privateProfile.updatedAt,
  };
};

/**
 * Get all public profiles (for sharing with other players)
 */
export const getAllPublicProfiles = (): PublicPlayerProfile[] => {
  return getAllPlayerProfiles().map(privateProfile => ({
    id: privateProfile.id,
    handle: privateProfile.handle,
    avatarImageUrl: privateProfile.avatarImageUrl,
    signingPublicKey: privateProfile.signingPublicKey,
    encryptionPublicKey: privateProfile.encryptionPublicKey,
    publicKey: privateProfile.publicKey, // Legacy
    walletAddress: privateProfile.walletAddress, // Legacy
    walletPublicKey: privateProfile.walletPublicKey, // Legacy
    identityType: privateProfile.identityType,
    createdAt: privateProfile.createdAt,
    updatedAt: privateProfile.updatedAt,
  }));
};

/**
 * Clear all player profiles (for testing/debugging)
 */
export const clearAllProfiles = (): void => {
  playerProfileStore.delTable(TB_PLAYER_PROFILES_TABLE_KEY);
  playerProfileStore.setValue(TB_DEFAULT_PROFILE_ID_KEY, DEFAULT_PROFILE_ID_VALUE);
};

