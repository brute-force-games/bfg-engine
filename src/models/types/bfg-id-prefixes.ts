import { z } from "zod";
import { BfgIdTypeKeyMethodBrandSchema, BfgIdTypePrefixBrandSchema } from "./prefix-key-methods";


export const BfgNumberIndexMethodBrandKey = "bfg-number-index-methodology" as const;

// export const BfgUuidMethodKeyValueSchema = BfgIdTypeKeyMethodBrandSchema.brand(BfgUuidMethodBrandKey);
// export type BfgUuidMethodKeyValue = z.infer<typeof BfgUuidMethodKeyValueSchema>;


export const BfgNumberIndexMethodTypeSchema = BfgIdTypeKeyMethodBrandSchema.brand(BfgNumberIndexMethodBrandKey);
export type BfgNumberIndexMethodType = z.infer<typeof BfgNumberIndexMethodTypeSchema>;


export const BfgNumberIndexPrefixTypeSchema = BfgIdTypePrefixBrandSchema.brand(BfgNumberIndexMethodBrandKey);
export type BfgNumberIndexPrefixType = z.infer<typeof BfgNumberIndexPrefixTypeSchema>;

export const PlayerSeatPrefix = "p" as BfgNumberIndexPrefixType;

export type BfgIdBrand =
  typeof PlayerSeatPrefix 
  ;
