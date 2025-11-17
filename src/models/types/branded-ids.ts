import { BfgIdBrand, type BfgNumberIndexMethodType, type BfgNumberIndexPrefixType } from "./bfg-id-prefixes";
import { createBfgBrandedPrefixKeyStringToolbox, type IBfgBrandedPrefixKeyStringToolbox, type IKeyMethodology, type RegexableString } from "./branded-prefix-key-str";
// import type { BfgNumberIndexMethodType } from "./prefix-key-methods";
// import { BfgNumberIndexMethodTypeSchema } from "./branded-uuids";


const NumberIndexRegexString = "[0-9]+" as RegexableString;
const generateNumberIndexKey = () => {
  const key = Math.floor(Math.random() * 10000000);
  return key.toString() as BfgNumberIndexMethodType;
}

// const createNumberIndexRegex = (prefix: BfgIdBrand) => {
//   return new RegExp(
//     `^${prefix}_${NumberIndexRegexString}$`
//   );
// };


// export const createRawBrandedNumberIndexIdSchema = <T extends BfgIdBrand>(idPrefix: T) => {
  
//   // const idPrefixRegexStr = `^${idPrefix}` as RegexString;
//   const createIdPrefixRegexStr = (idPrefix: BfgNumberIndexPrefixType) => `^${idPrefix}` as RegexableString;

//   const keyMethodology: IKeyMethodology<BfgNumberIndexPrefixType, BfgNumberIndexMethodType> = {
//     idPrefix: idPrefix as BfgNumberIndexPrefixType,
//     createIdPrefixRegexStr,
//     separatorStr: "_" as RegexableString,
//     keyRegexStr: NumberIndexRegexString,
//     generateRandomKey: generateNumberIndexKey,
//   };
  
//   const retVal = createRawBrandedPrefixKeyStringSchema(keyMethodology);
//   return retVal;
// };

// export type BrandedNumberIndexSchema<T extends BfgIdBrand> = ReturnType<typeof createRawBrandedNumberIndexIdSchema<T>>;

// export type BrandedNumberIndex<T extends BfgIdBrand> = z.infer<BrandedNumberIndexSchema<T>>;

// export type RawBrandedNumberIndexSchema = ReturnType<typeof createRawBrandedNumberIndexIdSchema<BfgIdBrand>>;


// export interface IBfgBrandedNumberIndex<T extends BfgIdBrand> {
//   createId: () => BrandedNumberIndex<T>;
//   createdIdForKey: (key: BfgNumberIndexMethodType) => BrandedNumberIndex<T>;
//   parseId: (id: string) => BrandedNumberIndex<T>;

//   idSchema: BrandedNumberIndexSchema<T>;
//   idPrefix: T;
// }


export const createBfgBrandedNumberIndexToolbox = <
T extends BfgIdBrand,
> (idPrefix: T): IBfgBrandedPrefixKeyStringToolbox<BfgNumberIndexPrefixType, BfgNumberIndexMethodType> => {

  // const idPrefixRegexStr = `^${idPrefix}` as RegexString;
  const createIdPrefixRegexStr = (idPrefix: BfgNumberIndexPrefixType) => `^${idPrefix}` as RegexableString;

  const numberKeyMethodology: IKeyMethodology<BfgNumberIndexPrefixType, BfgNumberIndexMethodType> = {
    idPrefix,
    createIdPrefixRegexStr,
    separatorStr: "" as RegexableString,
    keyRegexStr: NumberIndexRegexString,
    generateRandomKey: generateNumberIndexKey,
  };

  const toolbox = createBfgBrandedPrefixKeyStringToolbox(numberKeyMethodology);

  return toolbox;
};

export type BfgBrandedNumberIndexToolbox = ReturnType<typeof createBfgBrandedNumberIndexToolbox>;


// export const parseBrandedNumberIndexValueFromSchema = <T extends BfgIdBrand>(schema: BrandedNumberIndexSchema<T>, id: BfgIdBrand): BrandedNumberIndex<T> => {
//   const retVal = schema.parse(id);
//   return retVal as BrandedNumberIndex<T>;
// };

  
// export const createBrandedNumberIndex = <T extends BfgIdBrand>(brandSchema: BrandedNumberIndexSchema<T>): BrandedNumberIndex<T> => {
//   const numberIndex = Math.floor(Math.random() * 10000000);
//   const id = `${brandSchema}_${numberIndex}`;
//   const retVal = brandSchema.parse(id);
//   return retVal as BrandedNumberIndex<T>;
// }


// export const isValidBrandedNumberIndex = <T extends BfgIdBrand>(id: string, prefix: T): id is BrandedNumberIndex<T> => {
//   const idRegex = createNumberIndexRegex(prefix);
//   return idRegex.test(id);
// }
