import { z } from "zod";
import { PublicJWKSchema, PrivateJWKSchema } from "./wallet-shared";

// Type aliases for JWK types
export type PublicJWK = z.infer<typeof PublicJWKSchema>;
export type PrivateJWK = z.infer<typeof PrivateJWKSchema>;

// Exported wallet schema - properly typed JWKs with discriminated unions
export const PrivateWalletSchema = z.object({
  signingKeyPair: z.object({
    privateKey: PrivateJWKSchema,
    publicKey: PublicJWKSchema,
  }),
  encryptionKeyPair: z.object({
    privateKey: PrivateJWKSchema,
    publicKey: PublicJWKSchema,
  }),
});
