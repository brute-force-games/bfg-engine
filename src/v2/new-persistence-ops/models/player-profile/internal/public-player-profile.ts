import { z } from 'zod';
import { BfgPlayerProfileIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids';
import { BfgTimestampSchema } from '@bfg-engine/models/types/bfg-versions';
import { PublicJWKSchema } from '../wallet/wallet-shared';


export const PublicCryptoDetailsSchema = z.object({
  signingPublicKey: JsonWebKeySchema,
  encryptionPublicKey: JsonWebKeySchema,
});

export const PrivateCryptoDetailsSchema = z.object({
  signingPrivateKey: PrivateJWKSchema,
  encryptionPrivateKey: PrivateJWKSchema,
});

/**
 * Public player profile - contains only public information
 * This can be shared with other players and includes the public keys for verification
 */
export const PublicPlayerProfileSchema = z.object({
  id: BfgPlayerProfileIdToolbox.idSchema,
  handle: z.string().min(4, "Handle must be at least 4 characters long"),
  avatarImageUrl: z.string().optional(),

  stringifiedCryptoDetails: z.string(),
  
  // // Web Crypto API public keys (JWK format)
  // signingPublicKey: JsonWebKeySchema.optional(), // JsonWebKey for RSA-PSS signing
  // encryptionPublicKey: JsonWebKeySchema.optional(), // JsonWebKey for RSA-OAEP encryption
  
  // // Legacy fields (kept for backward compatibility)
  // publicKey: z.string().optional(), // Legacy RSA public key
  // walletAddress: z.string().optional(), // Legacy BCH address
  // walletPublicKey: z.string().optional(), // Legacy BCH public key
  
  // Identity type to determine which authentication method to use
  // identityType: z.enum(['rsa', 'wallet', 'webcrypto']).default('webcrypto'),
  
  // Metadata - using numbers (milliseconds since epoch)
  createdAt: BfgTimestampSchema,
  updatedAt: BfgTimestampSchema,
});

export type PublicPlayerProfile = z.infer<typeof PublicPlayerProfileSchema>;


// First create a branded schema from the object schema
// const PublicPlayerProfileBrandedSchema = z.string().brand('PublicPlayerProfile');
// Then create the JSON schema from the branded schema
// export const PublicPlayerProfileJsonStrSchema = createBrandedJsonSchema(PublicPlayerProfileBrandedSchema);
// export type PublicPlayerProfileJsonStr = z.infer<typeof PublicPlayerProfileJsonStrSchema>;


export const SharedPublicPlayerProfileSchema = PublicPlayerProfileSchema.extend({
  // isShared: z.boolean().default(false),
});

export type SharedPublicPlayerProfile = z.infer<typeof SharedPublicPlayerProfileSchema>;
