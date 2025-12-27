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
export const PublicPlayerProfileTbSchema = z.object({
  id: BfgPlayerProfileIdToolbox.idSchema,
  handle: z.string().min(4, "Handle must be at least 4 characters long"),
  avatarImageUrl: z.string().optional(),

  stringifiedCryptoDetails: z.string(),
  
  createdAt: BfgTimestampSchema,
  updatedAt: BfgTimestampSchema,
});

export type PublicPlayerProfileTb = z.infer<typeof PublicPlayerProfileTbSchema>;


// // First create a branded schema from the object schema
// // const PublicPlayerProfileBrandedSchema = z.string().brand('PublicPlayerProfile');
// // Then create the JSON schema from the branded schema
// // export const PublicPlayerProfileJsonStrSchema = createBrandedJsonSchema(PublicPlayerProfileBrandedSchema);
// // export type PublicPlayerProfileJsonStr = z.infer<typeof PublicPlayerProfileJsonStrSchema>;


// export const SharedPublicPlayerProfileSchema = PublicPlayerProfileSchema.extend({
//   // isShared: z.boolean().default(false),
// });

// export type SharedPublicPlayerProfile = z.infer<typeof SharedPublicPlayerProfileSchema>;
