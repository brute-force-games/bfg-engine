import { z } from 'zod';
import { PublicPlayerProfileSchema, PublicPlayerProfile } from './public-player-profile';
// import { KeyPurpose, WalletKey, IdentityKey, LobbyKey, GameKey, SigningKey } from '~/crypto/wallet-key-types';

// Temporary stub for crypto types until crypto module is implemented
type KeyPurpose = 'identity' | 'lobby' | 'game' | 'signing';
const KeyPurpose = {
  IDENTITY: 'identity' as KeyPurpose,
  LOBBY: 'lobby' as KeyPurpose,
  GAME: 'game' as KeyPurpose,
  SIGNING: 'signing' as KeyPurpose,
};
type WalletKey = any;
type IdentityKey = any;
type LobbyKey = any;
type GameKey = any;
type SigningKey = any;

/**
 * Private player profile - extends public profile with sensitive data stored client-side only
 * This includes the wallet mnemonic for deriving keys and wallet-based identity
 * Uses mnemonic-based HD key derivation for all cryptographic operations
 */
export const PrivatePlayerProfileSchema = PublicPlayerProfileSchema.extend({
  // Wallet mnemonic for wallet-based identity
  // This is the primary and only identity method
  walletMnemonic: z.string().min(1, "Wallet mnemonic is required"),
  
  // Current active key indices for different purposes
  // These can be incremented to rotate keys
  activeKeyIndices: z.object({
    identity: z.number().int().min(0).default(0),
    lobby: z.number().int().min(0).default(0),
    game: z.number().int().min(0).default(0),
    signing: z.number().int().min(0).default(0),
  }).default({
    identity: 0,
    lobby: 0,
    game: 0,
    signing: 0,
  }),
  
  // Retired key indices (for tracking which keys have been retired)
  retiredKeyIndices: z.array(z.object({
    purpose: z.string(),
    keyIndex: z.number(),
    retiredAt: z.number(),
  })).default([]),
});

export type PrivatePlayerProfile = z.infer<typeof PrivatePlayerProfileSchema>;

/**
 * Convert a private player profile to a public one (removes sensitive data)
 */
export const privateToPublicProfile = (privateProfile: PrivatePlayerProfile): PublicPlayerProfile => {
  return {
    id: privateProfile.id,
    handle: privateProfile.handle,
    avatarImageUrl: privateProfile.avatarImageUrl,
    publicKey: privateProfile.publicKey, // Legacy RSA public key (deprecated)
    walletAddress: privateProfile.walletAddress,
    walletPublicKey: privateProfile.walletPublicKey,
    identityType: privateProfile.identityType,
    createdAt: privateProfile.createdAt,
    updatedAt: privateProfile.updatedAt,
  };
};

/**
 * Create a new private player profile with mnemonic-based wallet identity
 * This is now the default profile creation method
 */
export const createPrivatePlayerProfile = async (
  handle: string,
  avatarImageUrl?: string
): Promise<Omit<PrivatePlayerProfile, 'id' | 'createdAt' | 'updatedAt'>> => {
  // Import the crypto utils dynamically to avoid circular dependencies
  const { initializeNewWallet } = await import('~/crypto/crypto-utils');
  
  const masterWallet = await initializeNewWallet();
  
  return {
    handle,
    avatarImageUrl,
    walletAddress: masterWallet.address,
    walletPublicKey: masterWallet.publicKey,
    walletMnemonic: masterWallet.mnemonic,
    identityType: 'wallet',
    activeKeyIndices: {
      identity: 0,
      lobby: 0,
      game: 0,
      signing: 0,
    },
    retiredKeyIndices: [],
  };
};

/**
 * Create a new private player profile with wallet-based identity
 */
export const createWalletBasedPlayerProfile = async (
  handle: string,
  avatarImageUrl?: string
): Promise<Omit<PrivatePlayerProfile, 'id' | 'createdAt' | 'updatedAt'>> => {
  // Import the crypto utils dynamically to avoid circular dependencies
  const { initializeNewWallet } = await import('~/crypto/crypto-utils');
  
  const masterWallet = await initializeNewWallet();
  
  return {
    handle,
    avatarImageUrl,
    walletAddress: masterWallet.address,
    walletPublicKey: masterWallet.publicKey,
    walletMnemonic: masterWallet.mnemonic,
    identityType: 'wallet',
    activeKeyIndices: {
      identity: 0,
      lobby: 0,
      game: 0,
      signing: 0,
    },
    retiredKeyIndices: [],
  };
};

/**
 * Create a private player profile from existing wallet mnemonic
 */
export const createPlayerProfileFromWallet = async (
  handle: string,
  mnemonic: string,
  avatarImageUrl?: string
): Promise<Omit<PrivatePlayerProfile, 'id' | 'createdAt' | 'updatedAt'>> => {
  // Import the crypto utils dynamically to avoid circular dependencies
  const { initializeWalletFromMnemonic } = await import('~/crypto/crypto-utils');
  
  const masterWallet = await initializeWalletFromMnemonic(mnemonic);
  
  return {
    handle,
    avatarImageUrl,
    walletAddress: masterWallet.address,
    walletPublicKey: masterWallet.publicKey,
    walletMnemonic: masterWallet.mnemonic,
    identityType: 'wallet',
    activeKeyIndices: {
      identity: 0,
      lobby: 0,
      game: 0,
      signing: 0,
    },
    retiredKeyIndices: [],
  };
};

/**
 * Create a private player profile from existing private key
 */
export const createPlayerProfileFromPrivateKey = async (
  handle: string,
  privateKey: string,
  avatarImageUrl?: string
): Promise<Omit<PrivatePlayerProfile, 'id' | 'createdAt' | 'updatedAt'>> => {
  // Import the crypto utils dynamically to avoid circular dependencies
  const { initializeWalletFromPrivateKey } = await import('~/crypto/crypto-utils');
  
  const masterWallet = await initializeWalletFromPrivateKey(privateKey);
  
  return {
    handle,
    avatarImageUrl,
    walletAddress: masterWallet.address,
    walletPublicKey: masterWallet.publicKey,
    walletMnemonic: masterWallet.mnemonic,
    identityType: 'wallet',
    activeKeyIndices: {
      identity: 0,
      lobby: 0,
      game: 0,
      signing: 0,
    },
    retiredKeyIndices: [],
  };
};

// ============================================================================
// KEY MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Derive a key for a specific purpose from a profile's mnemonic
 */
export const deriveKeyFromProfile = async (
  profile: PrivatePlayerProfile,
  purpose: KeyPurpose,
  keyIndex?: number
): Promise<WalletKey> => {
  // Import the wallet manager dynamically to avoid circular dependencies
  const { walletManager } = await import('~/crypto/wallet-manager');
  
  // Initialize wallet manager with the profile's mnemonic
  await walletManager.initializeFromMnemonic(profile.walletMnemonic);
  
  // Use the specified key index or the current active index for the purpose
  const index = keyIndex ?? profile.activeKeyIndices[purpose];
  
  return await walletManager.deriveKey({ purpose, keyIndex: index });
};

/**
 * Get the current active identity key for a profile
 */
export const getActiveIdentityKey = async (profile: PrivatePlayerProfile): Promise<IdentityKey> => {
  const walletKey = await deriveKeyFromProfile(profile, KeyPurpose.IDENTITY);
  return new IdentityKey(walletKey);
};

/**
 * Get the current active lobby key for a profile
 */
export const getActiveLobbyKey = async (profile: PrivatePlayerProfile): Promise<LobbyKey> => {
  const walletKey = await deriveKeyFromProfile(profile, KeyPurpose.LOBBY);
  return new LobbyKey(walletKey);
};

/**
 * Get the current active game key for a profile
 */
export const getActiveGameKey = async (profile: PrivatePlayerProfile): Promise<GameKey> => {
  const walletKey = await deriveKeyFromProfile(profile, KeyPurpose.GAME);
  return new GameKey(walletKey);
};

/**
 * Get the current active signing key for a profile
 */
export const getActiveSigningKey = async (profile: PrivatePlayerProfile): Promise<SigningKey> => {
  const walletKey = await deriveKeyFromProfile(profile, KeyPurpose.SIGNING);
  return new SigningKey(walletKey);
};

/**
 * Rotate a key for a specific purpose (increment the active key index)
 */
export const rotateKey = (
  profile: PrivatePlayerProfile,
  purpose: KeyPurpose
): PrivatePlayerProfile => {
  const currentIndex = profile.activeKeyIndices[purpose];
  
  // Add the current key to retired keys
  const retiredKey = {
    purpose,
    keyIndex: currentIndex,
    retiredAt: Date.now(),
  };
  
  return {
    ...profile,
    activeKeyIndices: {
      ...profile.activeKeyIndices,
      [purpose]: currentIndex + 1,
    },
    retiredKeyIndices: [...profile.retiredKeyIndices, retiredKey],
    updatedAt: Date.now(),
  };
};

/**
 * Rotate all keys for a profile (useful for security events)
 */
export const rotateAllKeys = (profile: PrivatePlayerProfile): PrivatePlayerProfile => {
  let updatedProfile = profile;
  
  // Rotate each key type
  updatedProfile = rotateKey(updatedProfile, KeyPurpose.IDENTITY);
  updatedProfile = rotateKey(updatedProfile, KeyPurpose.LOBBY);
  updatedProfile = rotateKey(updatedProfile, KeyPurpose.GAME);
  updatedProfile = rotateKey(updatedProfile, KeyPurpose.SIGNING);
  
  return updatedProfile;
};

/**
 * Get a specific key by purpose and index (useful for accessing retired keys)
 */
export const getKeyByIndex = async (
  profile: PrivatePlayerProfile,
  purpose: KeyPurpose,
  keyIndex: number
): Promise<WalletKey> => {
  return await deriveKeyFromProfile(profile, purpose, keyIndex);
};

/**
 * Check if a key index has been retired
 */
export const isKeyRetired = (
  profile: PrivatePlayerProfile,
  purpose: KeyPurpose,
  keyIndex: number
): boolean => {
  return profile.retiredKeyIndices.some(
    retired => retired.purpose === purpose && retired.keyIndex === keyIndex
  );
};

/**
 * Get all retired keys for a specific purpose
 */
export const getRetiredKeysForPurpose = (
  profile: PrivatePlayerProfile,
  purpose: KeyPurpose
) => {
  return profile.retiredKeyIndices.filter(retired => retired.purpose === purpose);
};

/**
 * Generate multiple keys for a specific purpose from a profile's mnemonic
 * Useful for batch key generation or key rotation preparation
 */
export const generateMultipleKeysFromProfile = async (
  profile: PrivatePlayerProfile,
  purpose: KeyPurpose,
  count: number,
  startIndex?: number
): Promise<WalletKey[]> => {
  if (count <= 0) {
    throw new Error('Count must be greater than 0');
  }
  
  if (count > 100) {
    throw new Error('Count cannot exceed 100 keys per batch');
  }

  const startIdx = startIndex ?? profile.activeKeyIndices[purpose];
  const keys: WalletKey[] = [];
  
  // Generate keys in parallel for better performance
  const promises = Array.from({ length: count }, async (_, i) => {
    const keyIndex = startIdx + i;
    return await deriveKeyFromProfile(profile, purpose, keyIndex);
  });
  
  const results = await Promise.all(promises);
  keys.push(...results);
  
  return keys;
};

/**
 * Generate multiple identity keys from a profile
 */
export const generateMultipleIdentityKeys = async (
  profile: PrivatePlayerProfile,
  count: number,
  startIndex?: number
): Promise<IdentityKey[]> => {
  const walletKeys = await generateMultipleKeysFromProfile(profile, KeyPurpose.IDENTITY, count, startIndex);
  return walletKeys.map(key => new IdentityKey(key));
};

/**
 * Generate multiple lobby keys from a profile
 */
export const generateMultipleLobbyKeys = async (
  profile: PrivatePlayerProfile,
  count: number,
  startIndex?: number
): Promise<LobbyKey[]> => {
  const walletKeys = await generateMultipleKeysFromProfile(profile, KeyPurpose.LOBBY, count, startIndex);
  return walletKeys.map(key => new LobbyKey(key));
};

/**
 * Generate multiple game keys from a profile
 */
export const generateMultipleGameKeys = async (
  profile: PrivatePlayerProfile,
  count: number,
  startIndex?: number
): Promise<GameKey[]> => {
  const walletKeys = await generateMultipleKeysFromProfile(profile, KeyPurpose.GAME, count, startIndex);
  return walletKeys.map(key => new GameKey(key));
};

/**
 * Generate multiple signing keys from a profile
 */
export const generateMultipleSigningKeys = async (
  profile: PrivatePlayerProfile,
  count: number,
  startIndex?: number
): Promise<SigningKey[]> => {
  const walletKeys = await generateMultipleKeysFromProfile(profile, KeyPurpose.SIGNING, count, startIndex);
  return walletKeys.map(key => new SigningKey(key));
};
