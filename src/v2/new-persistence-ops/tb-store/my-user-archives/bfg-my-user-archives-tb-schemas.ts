import z from "zod";
import { BfgPlayerProfileIdToolbox } from "@bfg-engine/models/types/bfg-branded-uuids";
import { BfgTimestampSchema } from "@bfg-engine/models/types/bfg-versions";


export const MyPlayerProfileTbZodSchema = z.object({
    id: BfgPlayerProfileIdToolbox.idSchema,
    
    handle: z.string().min(4, "Handle must be at least 4 characters long"),
    avatarImageUrl: z.string().optional(),
  
    stringifiedCryptoDetails: z.string(),

    createdAt: BfgTimestampSchema,
    updatedAt: BfgTimestampSchema,
});


export const BfgMyUserArchivesTbSchema = {
  myPlayerProfiles: MyPlayerProfileTbZodSchema,
}
