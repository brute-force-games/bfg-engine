import type { PrivatePlayerProfile } from "@bfg-engine/models/internal/player-profile/private-player-profile";
import type { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-uuids";
import {
  addPlayerProfile as storeAddPlayerProfile,
  updatePlayerProfile as storeUpdatePlayerProfile,
  deletePlayerProfile as storeDeletePlayerProfile,
  getPlayerProfile as storeGetPlayerProfile,
  getAllPlayerProfiles as storeGetAllPlayerProfiles,
  getDefaultPlayerProfile as storeGetDefaultPlayerProfile,
  setDefaultProfile as storeSetDefaultProfile,
  getPublicProfile as storeGetPublicProfile,
  getAllPublicProfiles as storeGetAllPublicProfiles,
} from "@bfg-engine/tb-store/player-profile-store";
import type { IUserOps } from "./user-ops";

/**
 * Default implementation of IUserOps using the player profile store
 */
export const UserOps: IUserOps = {
  createPlayerProfile: async (handle: string, avatarImageUrl?: string) => {
    try {
      const profileId = await storeAddPlayerProfile(handle, avatarImageUrl);
      return {
        success: true,
        profileId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create player profile',
      };
    }
  },

  getPlayerProfile: async (profileId: PlayerProfileId) => {
    try {
      const profile = storeGetPlayerProfile(profileId);
      if (!profile) {
        return {
          success: false,
          error: `Player profile not found: ${profileId}`,
        };
      }
      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get player profile',
      };
    }
  },

  getPublicPlayerProfile: async (profileId: PlayerProfileId) => {
    try {
      const profile = storeGetPublicProfile(profileId);
      if (!profile) {
        return {
          success: false,
          error: `Player profile not found: ${profileId}`,
        };
      }
      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get public player profile',
      };
    }
  },

  updatePlayerProfile: async (
    profileId: PlayerProfileId,
    updates: Partial<Omit<PrivatePlayerProfile, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    try {
      const success = storeUpdatePlayerProfile(profileId, updates);
      if (!success) {
        return {
          success: false,
          error: `Failed to update player profile: ${profileId}`,
        };
      }
      const updatedProfile = storeGetPlayerProfile(profileId);
      if (!updatedProfile) {
        return {
          success: false,
          error: `Player profile not found after update: ${profileId}`,
        };
      }
      return {
        success: true,
        data: updatedProfile,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update player profile',
      };
    }
  },

  deletePlayerProfile: async (profileId: PlayerProfileId) => {
    try {
      const success = storeDeletePlayerProfile(profileId);
      if (!success) {
        return {
          success: false,
          error: `Failed to delete player profile: ${profileId}`,
        };
      }
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete player profile',
      };
    }
  },

  getAllPlayerProfiles: async () => {
    try {
      const profiles = storeGetAllPlayerProfiles();
      return {
        success: true,
        profiles,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get all player profiles',
      };
    }
  },

  getAllPublicPlayerProfiles: async () => {
    try {
      const profiles = storeGetAllPublicProfiles();
      return {
        success: true,
        profiles,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get all public player profiles',
      };
    }
  },

  getDefaultPlayerProfile: async () => {
    try {
      const profile = storeGetDefaultPlayerProfile();
      if (!profile) {
        return {
          success: false,
          error: 'No default player profile set',
        };
      }
      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get default player profile',
      };
    }
  },

  setDefaultPlayerProfile: async (profileId: PlayerProfileId) => {
    try {
      const success = await storeSetDefaultProfile(profileId);
      if (!success) {
        return {
          success: false,
          error: `Failed to set default player profile: ${profileId}`,
        };
      }
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to set default player profile',
      };
    }
  },
};
