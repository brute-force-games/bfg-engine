import { z } from "zod";
import { BfgBrand } from "./bfg-id-prefixes";


export type BrandedIdSchema<T extends BfgBrand> = z.ZodBranded<z.ZodString, T>;

export type BrandedId<T extends BfgBrand> = z.infer<BrandedIdSchema<T>>;



export const createRawBrandedIdSchema = (prefix: BfgBrand): BrandedIdSchema<BfgBrand> => {
  const idRegex = new RegExp(`^${prefix}_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`);

  const retVal = z.string().regex(idRegex).brand(prefix);
  return retVal;
}

export type RawBrandedIdSchema = ReturnType<typeof createRawBrandedIdSchema>;


export interface IBfgBrandedId<T extends BfgBrand> {
  createId: () => BrandedId<T>;
  parseId: (id: string) => BrandedId<T>;

  idSchema: BrandedIdSchema<T>;
  idPrefix: T;
}


export const createBfgBrandedIdMetadata = <T extends BfgBrand>(prefix: T): IBfgBrandedId<T> => {


const idPrefix = z.literal(prefix);
const bfgBrandedSchema = createRawBrandedIdSchema(prefix);

const parseId = (id: string) => parseBrandedIdValueFromSchema(bfgBrandedSchema, id as T) as BrandedId<T>;

  const metadata: IBfgBrandedId<T> = {
    createId: () => createBrandedIdValue(idPrefix.value),
    parseId,
    idSchema: bfgBrandedSchema,
    idPrefix: prefix as T,
  } as const;

  return metadata;
}

export type BfgBrandedIdMetadata = ReturnType<typeof createBfgBrandedIdMetadata>;


export const createBrandedIdValue = <T extends BfgBrand>(idPrefix: BfgBrand): BrandedId<T> => {
  
  const uuid = crypto.randomUUID();
  const retVal = `${idPrefix}_${uuid}`;

  return retVal as BrandedId<T>;
}


export const parseBrandedIdValueFromSchema = <T extends BfgBrand>(schema: BrandedIdSchema<T>, id: BfgBrand): BrandedId<T> => {
  const retVal = schema.parse(id);
  return retVal as BrandedId<T>;
}


export const createBrandedId = <T extends BfgBrand>(brandSchema: BrandedIdSchema<T>): BrandedId<T> => {
  const uuid = crypto.randomUUID();
  const id = `${brandSchema}_${uuid}`;
  const retVal = brandSchema.parse(id);
  return retVal;
}


export const isValidBrandedId = <T extends BfgBrand>(id: string, prefix: T): id is BrandedId<T> => {
  const idRegex = new RegExp(`^${prefix}_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`);
  return idRegex.test(id);
}
