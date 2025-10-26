import { z } from "zod";


export const BfgDataEncoderFormatSchema = z.enum([
  'custom-string',
  'json-string',
  'json-object',
  'json-zod-object',
] as const);
export type BfgDataEncoderFormat = z.infer<typeof BfgDataEncoderFormatSchema>;

export const BfgEncodedStringSchema = z.string().brand('BfgEncodedString');
export type BfgEncodedString = z.infer<typeof BfgEncodedStringSchema>;



export interface IBfgDataEncoder<E extends BfgDataEncoderFormat, D> {
  format: E;
  encode: (data: D) => BfgEncodedString;
  decode: (data: BfgEncodedString) => D | null;
}

export interface IBfgCustomStringDataEncoder<S extends string> extends IBfgDataEncoder<BfgDataEncoderFormat, S> {
  format: 'custom-string';
}

export interface IBfgJsonStringDataEncoder extends IBfgDataEncoder<BfgDataEncoderFormat, string> {
  format: 'json-string';
}

export interface IBfgJsonObjectDataEncoder extends IBfgDataEncoder<BfgDataEncoderFormat, object> {
  format: 'json-object';
}

export interface IBfgJsonZodObjectDataEncoder<TSchema extends z.ZodTypeAny> extends IBfgDataEncoder<BfgDataEncoderFormat, z.infer<TSchema>> {
  format: 'json-zod-object';
  schema: TSchema;
}



export const createCustomStringDataEncoder = <S extends string>(
  encode: (data: S) => BfgEncodedString,
  decode: (encoded: BfgEncodedString) => S,
): IBfgCustomStringDataEncoder<S> => {
  return {
    format: 'custom-string',
    encode,
    decode,
  };
}


export const createJsonZodObjectDataEncoder = <TSchema extends z.ZodTypeAny>(
  schema: TSchema
): IBfgJsonZodObjectDataEncoder<TSchema> => {
  return {
    format: 'json-zod-object',
    schema,
    encode: (data: z.infer<TSchema>) => JSON.stringify(data) as BfgEncodedString,
    decode: (encoded: BfgEncodedString) => {
      const parsedObject = JSON.parse(encoded);
      const parsedZodObject = schema.safeParse(parsedObject);
      if (!parsedZodObject.success) {
        const message = `Invalid JSON data for schema ${schema.description}: ${JSON.stringify(parsedZodObject.error)}`;
        console.error(message);
        return null;
      }
      return parsedZodObject.data as z.infer<TSchema>;
    },
  };
}
  