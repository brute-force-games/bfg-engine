import type { PrivatePlayerProfile } from "@bfg-engine/models/internal/player-profile/private-player-profile";
import type { PublicPlayerProfile } from "@bfg-engine/models/internal/player-profile/public-player-profile";
import type { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-uuids";

/**
 * Result type for player profile operations
 */
export type PlayerProfileResult<T = PrivatePlayerProfile> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Result type for operations that return a profile ID
 */
export type PlayerProfileIdResult = {
  success: boolean;
  profileId?: PlayerProfileId;
  error?: string;
};

/**
 * Result type for operations that return multiple profiles
 */
export type PlayerProfilesResult<T = PrivatePlayerProfile> = {
  success: boolean;
  profiles?: T[];
  error?: string;
};

/**
 * User operations interface for managing player profiles
 * This provides a clean abstraction over the player profile store
 */
export interface IUserOps {
  /**
   * Create a new player profile
   */
  createPlayerProfile: (
    handle: string,
    avatarImageUrl?: string
  ) => Promise<PlayerProfileIdResult>;

  /**
   * Get a player profile by ID (returns private profile with sensitive data)
   */
  getPlayerProfile: (
    profileId: PlayerProfileId
  ) => Promise<PlayerProfileResult<PrivatePlayerProfile>>;

  /**
   * Get the public version of a player profile (safe to share)
   */
  getPublicPlayerProfile: (
    profileId: PlayerProfileId
  ) => Promise<PlayerProfileResult<PublicPlayerProfile>>;

  /**
   * Update an existing player profile
   */
  updatePlayerProfile: (
    profileId: PlayerProfileId,
    updates: Partial<Omit<PrivatePlayerProfile, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<PlayerProfileResult<PrivatePlayerProfile>>;

  /**
   * Delete a player profile
   */
  deletePlayerProfile: (
    profileId: PlayerProfileId
  ) => Promise<{ success: boolean; error?: string }>;

  /**
   * Get all player profiles (private)
   */
  getAllPlayerProfiles: () => Promise<PlayerProfilesResult<PrivatePlayerProfile>>;

  /**
   * Get all public player profiles (safe to share)
   */
  getAllPublicPlayerProfiles: () => Promise<PlayerProfilesResult<PublicPlayerProfile>>;

  /**
   * Get the default player profile
   */
  getDefaultPlayerProfile: () => Promise<PlayerProfileResult<PrivatePlayerProfile>>;

  /**
   * Set the default player profile
   */
  setDefaultPlayerProfile: (
    profileId: PlayerProfileId
  ) => Promise<{ success: boolean; error?: string }>;
}