import { z } from 'zod';
import { BfgPlayerProfileId } from '~/models/types/bfg-branded-ids';
// import { createBrandedJsonSchema } from '~/types/core/branded-values/branded-json';

// Temporary stub until branded-json module is implemented
const createBrandedJsonSchema = <T extends z.ZodBranded<any, any>>(schema: T) => schema;

/**
 * Public player profile - contains only public information
 * This can be shared with other players and includes the public key for verification
 * Supports both traditional RSA keys and BCH/SLP wallet-based identity
 */
export const PublicPlayerProfileSchema = z.object({
  id: BfgPlayerProfileId.idSchema,
  handle: z.string().min(4, "Handle must be at least 4 characters long"),
  avatarImageUrl: z.string().optional(),
  
  // Public key for verifying signatures (RSA PEM format)
  publicKey: z.string().optional(),
  
  // Wallet-based identity (BCH address and public key)
  walletAddress: z.string().optional(),
  walletPublicKey: z.string().optional(),
  
  // Identity type to determine which authentication method to use
  identityType: z.enum(['rsa', 'wallet']).default('rsa'),
  
  // Metadata - using numbers (milliseconds since epoch)
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type PublicPlayerProfile = z.infer<typeof PublicPlayerProfileSchema>;


// First create a branded schema from the object schema
const PublicPlayerProfileBrandedSchema = z.string().brand('PublicPlayerProfile');
// Then create the JSON schema from the branded schema
export const PublicPlayerProfileJsonStrSchema = createBrandedJsonSchema(PublicPlayerProfileBrandedSchema);
export type PublicPlayerProfileJsonStr = z.infer<typeof PublicPlayerProfileJsonStrSchema>;
