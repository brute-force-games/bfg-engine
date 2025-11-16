import { z } from "zod";


export const BfgIdTypePrefixBrandKey = "bfg-id-type-prefix" as const;
export const BfgIdTypeKeyMethodBrandKey = "bfg-id-type-key-method" as const;

export const BfgIdTypePrefixBrandSchema = z.string().brand(BfgIdTypePrefixBrandKey);
export type BfgIdTypePrefixBrand = z.infer<typeof BfgIdTypePrefixBrandSchema>;

export const BfgIdTypeKeyMethodBrandSchema = z.string().brand(BfgIdTypeKeyMethodBrandKey);
export type BfgIdTypeKeyMethodBrand = z.infer<typeof BfgIdTypeKeyMethodBrandSchema>;


// export const BfgUuidPrefixTypeSchema = BfgIdTypeKeyMethodBrandSchema.brand(BfgUuidMethodBrandKey);
// export type BfgUuidPrefixType = z.infer<typeof BfgUuidPrefixTypeSchema>;

// export const BfgUuidMethodSchema = BfgIdTypeKeyMethodBrandSchema.brand(BfgUuidMethodBrandKey);
// export type BfgUuidMethod = z.infer<typeof BfgUuidMethodSchema>;


// export const BfgUuidMethodKeyValueSchema = BfgIdTypeKeyMethodBrandSchema.brand(BfgUuidMethodBrandKey);
// export type BfgUuidMethodKeyValue = z.infer<typeof BfgUuidMethodKeyValueSchema>;

// export const BfgNumberIndexMethodTypeSchema = BfgIdTypeKeyMethodBrandSchema.brand(BfgNumberIndexMethodBrandKey);
// export type BfgNumberIndexMethodType = z.infer<typeof BfgNumberIndexMethodTypeSchema>;

export const BfgUuidMethodBrandKey = "bfg-uuid-methodology" as const;
export const BfgNumberIndexMethodBrandKey = "bfg-number-index-methodology" as const;

