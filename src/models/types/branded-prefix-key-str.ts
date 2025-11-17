import { z } from "zod";
import type { BfgIdTypeKeyMethodBrand, BfgIdTypePrefixBrand } from "./prefix-key-methods";
// import type { BfgUuidBrand } from "./bfg-uuid-prefixes";


// export const BfgIdPrefixSchema = z.string().brand("bfg-id-prefix");
// export type BfgIdPrefix = z.infer<typeof BfgIdPrefixSchema>;

// export const KeyMethodologyBrandSchema = z.string().brand("bfg-key-methodology");
// export type KeyMethodologyBrand = z.infer<typeof KeyMethodologyBrandSchema>;

export const RegexableStringSchema = z.string().brand("regexable-string");
export type RegexableString = z.infer<typeof RegexableStringSchema>;



export interface IKeyMethodology<
  P extends BfgIdTypePrefixBrand,
  KM extends BfgIdTypeKeyMethodBrand,
> {
  idPrefix: P;
  createIdPrefixRegexStr: (idPrefix: P) => RegexableString;

  separatorStr: RegexableString;

  keyRegexStr: RegexableString;
  generateRandomKey: () => KM;
}


export interface IBfgBrandedPrefixKeyStringToolbox<
  P extends BfgIdTypePrefixBrand, 
  KM extends BfgIdTypeKeyMethodBrand,
> {
  idSchema: BrandedPrefixKeyStringSchema<P, KM>;
  idPrefix: P;
  // idPrefixRegexStr: P;

  keyMethodology: IKeyMethodology<P, KM>;

  createValidatedId: (id: string) => BrandedPrefixKeyString<P, KM>;
  createRandomId: () => BrandedPrefixKeyString<P, KM>;
  createdIdForKey: (key: KM) => BrandedPrefixKeyString<P, KM>;
  parseId: (id: string) => BrandedPrefixKeyString<P, KM>;
}


const createPrefixKeyStringRegex = <P extends BfgIdTypePrefixBrand>(prefixStr: P, keyRegexStr: string) => {
  return new RegExp(
    `^${prefixStr}${keyRegexStr}$`
  );
};



// export interface IBfgBrandedPrefixKeyStr<T extends BfgUuidBrand> {
//   createId: () => BrandedUuid<T>;
//   parseId: (id: T) => BrandedUuid<T>;

//   idSchema: BrandedUuidSchema<T>;
//   idPrefix: T;
// }


export const createRawBrandedPrefixKeyStringSchema = <
  P extends BfgIdTypePrefixBrand,
  KM extends BfgIdTypeKeyMethodBrand
>(keyMethodology: IKeyMethodology<P, KM>) => {

  const { keyRegexStr } = keyMethodology;

  const { idPrefix, separatorStr } = keyMethodology;
  const idPrefixRegexStr = keyMethodology.createIdPrefixRegexStr(idPrefix);

  const keyRegex = new RegExp(
    `^${idPrefixRegexStr}${separatorStr}${keyRegexStr}$`
  );

  const retVal = z.string()
    .regex(keyRegex)
    .brand(idPrefixRegexStr)
    .brand(keyMethodology.keyRegexStr)
    .describe(`Branded prefix key string for '${idPrefixRegexStr}' [${separatorStr}] with key regex '${keyRegexStr}'`);

  return retVal;
};
  

export type BrandedPrefixKeyStringSchema<P extends BfgIdTypePrefixBrand, KM extends BfgIdTypeKeyMethodBrand> = 
  ReturnType<typeof createRawBrandedPrefixKeyStringSchema<P, KM>>;

export type BrandedPrefixKeyString<P extends BfgIdTypePrefixBrand, KM extends BfgIdTypeKeyMethodBrand> =
  z.infer<BrandedPrefixKeyStringSchema<P, KM>>;

export type RawBrandedPrefixKeyStringSchema<P extends BfgIdTypePrefixBrand, KM extends BfgIdTypeKeyMethodBrand> =
  ReturnType<typeof createRawBrandedPrefixKeyStringSchema<P, KM>>;


export const createBfgBrandedPrefixKeyStringToolbox = <P extends BfgIdTypePrefixBrand, KM extends BfgIdTypeKeyMethodBrand>(
  keyMethodology: IKeyMethodology<P, KM>
): IBfgBrandedPrefixKeyStringToolbox<P, KM> => {

  const { idPrefix, separatorStr } = keyMethodology;
  const bfgBrandedSchema = createRawBrandedPrefixKeyStringSchema(keyMethodology);

  const randomKeyValue = keyMethodology.generateRandomKey();

  const createValidatedId = (idValue: string) => createValidatedBrandedPrefixKeyStringValue(bfgBrandedSchema, idValue);
  const createId = () => createBrandedPrefixKeyStringValue(idPrefix, separatorStr, randomKeyValue);
  const createdIdForKey = (key: KM) => createBrandedPrefixKeyStringValue(idPrefix, separatorStr, key);
  const parseId = (id: string) => parseBrandedPrefixKeyStringValueFromSchema(bfgBrandedSchema, id as P);

  const toolbox: IBfgBrandedPrefixKeyStringToolbox<P, KM> = {
    keyMethodology,
    idSchema: bfgBrandedSchema,
    idPrefix,

    createValidatedId,
    createRandomId: createId,
    createdIdForKey,
    parseId,
  } as const;

  return toolbox;
};

export type BfgBrandedPrefixKeyStringToolbox = ReturnType<typeof createBfgBrandedPrefixKeyStringToolbox>;


export const createBrandedPrefixKeyStringValue = <
  P extends BfgIdTypePrefixBrand,
  KM extends BfgIdTypeKeyMethodBrand
>(
  idPrefix: P, 
  separatorStr: RegexableString,
  keyValue: KM
): BrandedPrefixKeyString<P, KM> => {

  const retVal = `${idPrefix}${separatorStr}${keyValue}`;
  return retVal as BrandedPrefixKeyString<P, KM>;
}


export const createValidatedBrandedPrefixKeyStringValue = <
  P extends BfgIdTypePrefixBrand,
  KM extends BfgIdTypeKeyMethodBrand
>(
  schema: BrandedPrefixKeyStringSchema<P, KM>,
  idValue: string
): BrandedPrefixKeyString<P, KM> => {
  
  // const retVal = schema.parse(idValue);
  const retVal = schema.safeParse(idValue);
  if (!retVal.success) {
    throw new Error(`Unable to create valid prefix key string value: ${idValue} against schema: ${schema.description}`);
  }
  return retVal.data as BrandedPrefixKeyString<P, KM>;
}


export const parseBrandedPrefixKeyStringValueFromSchema = <
  P extends BfgIdTypePrefixBrand,
  KM extends BfgIdTypeKeyMethodBrand
>(
  schema: BrandedPrefixKeyStringSchema<P, KM>,
  id: string
): BrandedPrefixKeyString<P, KM> => {
  const retVal = schema.parse(id);
  return retVal as BrandedPrefixKeyString<P, KM>;
};


export const isValidBrandedPrefixKeyStringValue = <
  P extends BfgIdTypePrefixBrand,
  KM extends BfgIdTypeKeyMethodBrand
>(id: string, prefix: P, key: KM): id is BrandedPrefixKeyString<P, KM> => {
  const idRegex = createPrefixKeyStringRegex(prefix, key);
  return idRegex.test(id);
}
