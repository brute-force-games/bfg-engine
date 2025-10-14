import { z } from 'zod';
import { BfgPlayerProfileId } from '../../models/types/bfg-branded-ids';
// import { createBrandedJsonSchema } from "@bfg-engine/types/core/branded-values/branded-json";

// Temporary stub until branded-json module is implemented
const createBrandedJsonSchema = <T extends z.ZodBranded<z.ZodTypeAny, string>>(schema: T) => schema;

// Base JWK fields common to all key types
const BaseJWKSchema = z.object({
  use: z.string().optional(),
  key_ops: z.array(z.string()).optional(),
  alg: z.string().optional(),
  kid: z.string().optional(),
  x5u: z.string().optional(),
  x5c: z.array(z.string()).optional(),
  x5t: z.string().optional(),
  ext: z.boolean().optional(),
});

// RSA Public Key (only public components)
const RSAPublicJWKSchema = BaseJWKSchema.extend({
  kty: z.literal('RSA'),
  n: z.string(), // modulus
  e: z.string(), // exponent
});

// RSA Private Key (includes private components)
const RSAPrivateJWKSchema = RSAPublicJWKSchema.extend({
  d: z.string(), // private exponent
  p: z.string().optional(), // first prime factor
  q: z.string().optional(), // second prime factor
  dp: z.string().optional(), // first factor CRT exponent
  dq: z.string().optional(), // second factor CRT exponent
  qi: z.string().optional(), // first CRT coefficient
});

// Elliptic Curve Public Key
const ECPublicJWKSchema = BaseJWKSchema.extend({
  kty: z.literal('EC'),
  crv: z.string(), // curve name
  x: z.string(), // x coordinate
  y: z.string(), // y coordinate
});

// Elliptic Curve Private Key
const ECPrivateJWKSchema = ECPublicJWKSchema.extend({
  d: z.string(), // private key
});

// Symmetric Key (for completeness)
const OctJWKSchema = BaseJWKSchema.extend({
  kty: z.literal('oct'),
  k: z.string(), // key value
});

// Public JWK - discriminated union of public key types
export const PublicJWKSchema = z.discriminatedUnion('kty', [
  RSAPublicJWKSchema,
  ECPublicJWKSchema,
]);

// Private JWK - discriminated union including private key types
export const PrivateJWKSchema = z.discriminatedUnion('kty', [
  RSAPrivateJWKSchema,
  ECPrivateJWKSchema,
  OctJWKSchema,
]);

// For public player profiles, we only need public keys
const JsonWebKeySchema = PublicJWKSchema;

/**
 * Public player profile - contains only public information
 * This can be shared with other players and includes the public keys for verification
 */
export const PublicPlayerProfileSchema = z.object({
  id: BfgPlayerProfileId.idSchema,
  handle: z.string().min(4, "Handle must be at least 4 characters long"),
  avatarImageUrl: z.string().optional(),
  
  // Web Crypto API public keys (JWK format)
  signingPublicKey: JsonWebKeySchema.optional(), // JsonWebKey for RSA-PSS signing
  encryptionPublicKey: JsonWebKeySchema.optional(), // JsonWebKey for RSA-OAEP encryption
  
  // Legacy fields (kept for backward compatibility)
  publicKey: z.string().optional(), // Legacy RSA public key
  walletAddress: z.string().optional(), // Legacy BCH address
  walletPublicKey: z.string().optional(), // Legacy BCH public key
  
  // Identity type to determine which authentication method to use
  // identityType: z.enum(['rsa', 'wallet', 'webcrypto']).default('webcrypto'),
  
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
