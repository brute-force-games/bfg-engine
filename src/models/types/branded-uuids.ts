import { z } from "zod";
import { BfgUuidBrand, type BfgUuidPrefixType } from "./bfg-uuid-prefixes";
import { createBfgBrandedPrefixKeyStringToolbox, createRawBrandedPrefixKeyStringSchema, type IBfgBrandedPrefixKeyStringToolbox, type IKeyMethodology } from "./branded-prefix-key-str";
import { BfgIdTypeKeyMethodBrandSchema, BfgUuidMethodBrandKey } from "./prefix-key-methods";


export const BfgUuidMethodKeyValueSchema = BfgIdTypeKeyMethodBrandSchema.brand(BfgUuidMethodBrandKey);
export type BfgUuidMethodKeyValue = z.infer<typeof BfgUuidMethodKeyValueSchema>;

const UuidRegexString = "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$" as const;
const generateUuidKey = () => crypto.randomUUID() as BfgUuidMethodKeyValue;



export const createRawBrandedUuidSchema = <T extends BfgUuidBrand>(idPrefix: T) => {
  const keyMethodology: IKeyMethodology<BfgUuidPrefixType, BfgUuidMethodKeyValue> = {
    idPrefix,
    generateRandomKey: generateUuidKey,
    keyRegexStr: UuidRegexString,
  };

  const retVal = createRawBrandedPrefixKeyStringSchema(keyMethodology);
  return retVal;
};

export type BrandedUuidSchema<T extends BfgUuidBrand> = ReturnType<typeof createRawBrandedUuidSchema<T>>;

export type BrandedUuid<T extends BfgUuidBrand> = z.infer<BrandedUuidSchema<T>>;

export type RawBrandedIdSchema = ReturnType<typeof createRawBrandedUuidSchema<BfgUuidBrand>>;



export const createBfgBrandedUuidToolbox = <
  T extends BfgUuidBrand,
> (idPrefix: T): IBfgBrandedPrefixKeyStringToolbox<BfgUuidPrefixType, BfgUuidMethodKeyValue> => {

  const uuidKeyMethodology: IKeyMethodology<BfgUuidPrefixType, BfgUuidMethodKeyValue> = {
    idPrefix,
    generateRandomKey: generateUuidKey,
    keyRegexStr: UuidRegexString,
  };

  const toolbox = createBfgBrandedPrefixKeyStringToolbox(uuidKeyMethodology);
  
  return toolbox;
};

export type BfgBrandedUuidToolbox = ReturnType<typeof createBfgBrandedUuidToolbox>;
