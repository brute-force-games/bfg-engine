import z from "zod";


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
  
  