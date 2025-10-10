import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { PrivatePlayerProfile, PrivatePlayerProfileSchema } from '~/models/player-profile/private-player-profile';
import { PublicPlayerProfile } from '~/models/player-profile/public-player-profile';
import { createPrivatePlayerProfile } from '~/models/player-profile/private-player-profile';
import { createPlayerProfileId, PlayerProfileId } from '~/models/types/bfg-branded-ids';


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
const parseRawProfileData = (profileId: PlayerProfileId, rawData: any): PrivatePlayerProfile | null => {
  const result = PrivatePlayerProfileSchema.safeParse(rawData);
  
  if (!result.success) {
    console.error(`Error validating profile data for ${profileId}:`, result.error);
    return null;
  }
  
  return result.data;
};


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
    
    // Add to store - store the entire profile object
    playerProfileStore.setRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId, completeProfileData);
    
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
    
    const updatedProfile = {
      ...existingProfile,
      ...updates,
      updatedAt: Date.now(),
    };
    
    playerProfileStore.setRow(TB_PLAYER_PROFILES_TABLE_KEY, profileId, updatedProfile);
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
    publicKey: privateProfile.publicKey, // Legacy RSA public key
    walletAddress: privateProfile.walletAddress,
    walletPublicKey: privateProfile.walletPublicKey,
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
    publicKey: privateProfile.publicKey, // Legacy RSA public key
    walletAddress: privateProfile.walletAddress,
    walletPublicKey: privateProfile.walletPublicKey,
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

