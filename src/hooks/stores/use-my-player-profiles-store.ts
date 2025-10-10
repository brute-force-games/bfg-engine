import { useCallback } from 'react';
import { useTable, useValue } from 'tinybase/ui-react';
import { 
  playerProfileStore,
  addPlayerProfile,
  updatePlayerProfile,
  deletePlayerProfile,
  setDefaultProfile,
  clearAllProfiles,
  TB_PLAYER_PROFILES_TABLE_KEY,
  TB_DEFAULT_PROFILE_ID_KEY,
} from '~/tb-store/player-profile-store';
import { PrivatePlayerProfile, PrivatePlayerProfileSchema, privateToPublicProfile } from '~/models/player-profile/private-player-profile';
import { PlayerProfileId } from '~/models/types/bfg-branded-ids';
import { PublicPlayerProfile } from '~/models/player-profile/public-player-profile';


/**
 * Safely parse profile data from TinyBase reactive hooks - now just validates the stored object
 */
const parseRawProfileData = (profileId: string, rawData: any): PrivatePlayerProfile | null => {
  const result = PrivatePlayerProfileSchema.safeParse(rawData);
  
  if (!result.success) {
    console.error(`Error validating profile data for ${profileId}:`, result.error);
    return null;
  }
  
  return result.data;
};

/**
 * Hook to get all player profiles with reactive updates
 */
export const useMyPlayerProfiles = () => {
  const rawProfiles = useTable(TB_PLAYER_PROFILES_TABLE_KEY, playerProfileStore);
  
  return Object.entries(rawProfiles)
    .map(([id, rawProfileData]) => parseRawProfileData(id, rawProfileData))
    .filter((profile): profile is PrivatePlayerProfile => profile !== null);
};

/**
 * Hook to get the default player profile ID with reactive updates
 */
export const useMyDefaultProfileId = () => {
  return useValue(TB_DEFAULT_PROFILE_ID_KEY, playerProfileStore);
};

/**
 * Hook to get the default player profile with reactive updates
 */
export const useMyDefaultPlayerProfile = () => {
  const defaultId = useMyDefaultProfileId();
  const rawProfiles = useTable(TB_PLAYER_PROFILES_TABLE_KEY, playerProfileStore);
  
  if (!defaultId || typeof defaultId !== 'string' || !rawProfiles[defaultId]) {
    return null;
  }
  
  return parseRawProfileData(defaultId, rawProfiles[defaultId]);
};


export const useMyDefaultHostPlayerProfile = () => {
  return useMyDefaultPlayerProfile();
}


export const useMyDefaultPublicPlayerProfile = (): PublicPlayerProfile | null => {
  const defaultProfile = useMyDefaultPlayerProfile();
  if (!defaultProfile) {
    return null;
  }

  const retVal = privateToPublicProfile(defaultProfile);
  return retVal;
}

/**
 * Hook to get a specific player profile by ID
 */
export const usePlayerProfile = (profileId: PlayerProfileId) => {
  const rawProfiles = useTable(TB_PLAYER_PROFILES_TABLE_KEY, playerProfileStore);
  const rawProfileData = rawProfiles[profileId];
  
  if (!rawProfileData) {
    return null;
  }
  
  return parseRawProfileData(profileId, rawProfileData);
};

/**
 * Hook for player profile management actions
 */
export const usePlayerProfileActions = () => {
  const addProfile = useCallback(async (
    handle: string,
    avatarImageUrl?: string
  ): Promise<PlayerProfileId> => {
    return await addPlayerProfile(handle, avatarImageUrl);
  }, []);

  const updateProfile = useCallback((profileId: PlayerProfileId, updates: Partial<Omit<PrivatePlayerProfile, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return updatePlayerProfile(profileId, updates);
  }, []);

  const removeProfile = useCallback((profileId: PlayerProfileId) => {
    return deletePlayerProfile(profileId);
  }, []);

  const setDefault = useCallback(async (profileId: PlayerProfileId) => {
    return await setDefaultProfile(profileId);
  }, []);

  const clearAll = useCallback(() => {
    clearAllProfiles();
  }, []);

  return {
    addProfile,
    updateProfile,
    removeProfile,
    setDefault,
    clearAll,
  };
};

/**
 * Hook for public profile operations (for sharing)
 */
export const usePublicProfiles = () => {
  const rawProfiles = useTable(TB_PLAYER_PROFILES_TABLE_KEY, playerProfileStore);
  return Object.entries(rawProfiles)
    .map(([id, rawProfileData]) => parseRawProfileData(id, rawProfileData))
    .filter((profile): profile is PrivatePlayerProfile => profile !== null)
    .map(parsedProfile => ({
      id: parsedProfile.id,
      handle: parsedProfile.handle,
      avatarImageUrl: parsedProfile.avatarImageUrl,
      publicKey: parsedProfile.publicKey,
      createdAt: parsedProfile.createdAt,
      updatedAt: parsedProfile.updatedAt,
    }));
};

/**
 * Hook to get a specific public profile by ID
 */
export const usePublicProfile = (profileId: PlayerProfileId) => {
  const privateProfile = usePlayerProfile(profileId);
  
  if (!privateProfile) {
    return null;
  }
  
  return {
    id: privateProfile.id,
    handle: privateProfile.handle,
    avatarImageUrl: privateProfile.avatarImageUrl,
    publicKey: privateProfile.publicKey,
    createdAt: privateProfile.createdAt,
    updatedAt: privateProfile.updatedAt,
  };
};
