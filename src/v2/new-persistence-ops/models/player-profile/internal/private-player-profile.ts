import { z } from 'zod';
import { BfgTimestampSchema } from '@bfg-engine/models/types/bfg-versions';
import { BfgPlayerProfileIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids';


export const PrivatePlayerProfileTbSchema = z.object({
  
  id: BfgPlayerProfileIdToolbox.idSchema,
  handle: z.string().min(4, "Handle must be at least 4 characters long"),
  avatarImageUrl: z.string().optional(),

  stringifiedWalletDetails: z.string(),
  
  createdAt: BfgTimestampSchema,
  updatedAt: BfgTimestampSchema,
  
});

export type PrivatePlayerProfileTb = z.infer<typeof PrivatePlayerProfileTbSchema>;
