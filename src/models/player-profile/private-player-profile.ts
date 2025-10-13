import { z } from 'zod';
import { PublicPlayerProfileSchema, PublicPlayerProfile, PrivateJWKSchema, PublicJWKSchema } from './public-player-profile';
import { initializeNewWallet, initializeWalletFromExport } from '../../crypto/crypto-utils';
import { WebCryptoWallet } from '../../crypto/web-crypto-wallet';
import { IWebCryptoWallet } from '../../crypto/types';


// Type aliases for JWK types
export type PublicJWK = z.infer<typeof PublicJWKSchema>;
export type PrivateJWK = z.infer<typeof PrivateJWKSchema>;

// Exported wallet schema - properly typed JWKs with discriminated unions
const ExportedWalletSchema = z.object({
  signingKeyPair: z.object({
    privateKey: PrivateJWKSchema,
    publicKey: PublicJWKSchema,
  }),
  encryptionKeyPair: z.object({
    privateKey: PrivateJWKSchema,
    publicKey: PublicJWKSchema,
  }),
});

/**
 * Private player profile - extends public profile with sensitive data stored client-side only
 * Uses Web Crypto API wallet for all cryptographic operations
 */
export const PrivatePlayerProfileSchema = PublicPlayerProfileSchema.extend({
  // Web Crypto wallet keys (exported in JWK format)
  // This contains both private and public keys for signing and encryption
  webCryptoWallet: ExportedWalletSchema,
  
});

export type PrivatePlayerProfile = z.infer<typeof PrivatePlayerProfileSchema>;

// Export the wallet schema type for use in other modules
export type ExportedWallet = z.infer<typeof ExportedWalletSchema>;

/**
 * Convert a private player profile to a public one (removes sensitive data)
 */
export const privateToPublicProfile = (privateProfile: PrivatePlayerProfile): PublicPlayerProfile => {
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
 * Create a new private player profile with Web Crypto wallet
 * This is the default profile creation method
 */
export const createPrivatePlayerProfile = async (
  handle: string,
  avatarImageUrl?: string
): Promise<Omit<PrivatePlayerProfile, 'id' | 'createdAt' | 'updatedAt'>> => {
  // Import the crypto utils dynamically to avoid circular dependencies
  
  const walletData = await initializeNewWallet();
  
  return {
    handle,
    avatarImageUrl,
    signingPublicKey: walletData.signingPublicKey as PublicJWK,
    encryptionPublicKey: walletData.encryptionPublicKey as PublicJWK,
    webCryptoWallet: walletData.exportedWallet as ExportedWallet,
    identityType: 'webcrypto',
  };
};

/**
 * Create a private player profile from exported wallet keys
 */
export const createPlayerProfileFromExportedWallet = async (
  handle: string,
  exportedWallet: ExportedWallet,
  avatarImageUrl?: string
): Promise<Omit<PrivatePlayerProfile, 'id' | 'createdAt' | 'updatedAt'>> => {
  // Import the crypto utils dynamically to avoid circular dependencies
  
  const walletData = await initializeWalletFromExport(exportedWallet);
  
  return {
    handle,
    avatarImageUrl,
    signingPublicKey: walletData.signingPublicKey as PublicJWK,
    encryptionPublicKey: walletData.encryptionPublicKey as PublicJWK,
    webCryptoWallet: walletData.exportedWallet as ExportedWallet,
    identityType: 'webcrypto',
  };
};

/**
 * Get a Web Crypto wallet instance from a profile
 * Returns WebCryptoWallet instance with signing and encryption capabilities
 */
export const getWalletFromProfile = async (
  profile: PrivatePlayerProfile
): Promise<IWebCryptoWallet> => {
  return await WebCryptoWallet.fromExport(profile.webCryptoWallet);
};

// ============================================================================
// KEY ROTATION (for security)
// ============================================================================

/**
 * Rotate wallet keys by generating a new wallet
 * This creates entirely new signing and encryption key pairs
 */
export const rotateWalletKeys = async (
  profile: PrivatePlayerProfile
): Promise<PrivatePlayerProfile> => {
  
  const walletData = await initializeNewWallet();
  
  return {
    ...profile,
    signingPublicKey: walletData.signingPublicKey as PublicJWK,
    encryptionPublicKey: walletData.encryptionPublicKey as PublicJWK,
    webCryptoWallet: walletData.exportedWallet as ExportedWallet,
    updatedAt: Date.now(),
  };
};


