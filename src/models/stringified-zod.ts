import { z, type ZodError } from "zod";

const DEFAULT_STRINGIFIED_BRAND = "StringifiedJson";

type SchemaDescription<Schema extends z.ZodTypeAny> = Schema["_def"] extends {
  description?: infer Description;
}
  ? Description extends string
    ? Description
    : undefined
  : undefined;

type ResolveBrand<
  Schema extends z.ZodTypeAny,
  Brand extends string | undefined,
> = Brand extends string
  ? Brand
  : SchemaDescription<Schema> extends string
    ? `${SchemaDescription<Schema>}Stringified`
    : typeof DEFAULT_STRINGIFIED_BRAND;

export interface CreateStringifiedZodOptions<Brand extends string | undefined> {
  readonly brand?: Brand;
}

export interface StringifiedZod<
  Schema extends z.ZodTypeAny,
  Brand extends string,
> {
  readonly brand: Brand;
  readonly schema: Schema;
  readonly stringValueSchema: z.ZodString;
  readonly fromStringSchema: z.ZodTypeAny;
  readonly parseString: (value: unknown) => z.infer<Schema>;
  readonly safeParseString: (
    value: unknown,
  ) => SafeParseResult<z.infer<Schema>>;
  readonly stringify: (
    value: z.input<Schema>,
  ) => StringifiedJsonString<Brand>;
}

export type SafeParseResult<Output> =
  | { success: true; data: Output }
  | { success: false; error: ZodError<Output> };

export type StringifiedJsonString<Brand extends string> = string & {
  readonly __brand: Brand;
};

const getSchemaDescription = (schema: z.ZodTypeAny): string | undefined => {
  const def = schema._def as { description?: string | undefined };
  return def.description;
};

const inferBrandValue = (
  schema: z.ZodTypeAny,
  explicitBrand?: string,
): string => {
  if (explicitBrand) {
    return explicitBrand;
  }

  const description = getSchemaDescription(schema);
  if (description) {
    return `${description}Stringified`;
  }

  const def = schema._def as { typeName?: { name?: string } | string };
  const typeName = def.typeName;
  if (typeName) {
    return `${String(typeName)}Stringified`;
  }

  return DEFAULT_STRINGIFIED_BRAND;
};

export const createStringifiedZod = <
  Schema extends z.ZodTypeAny,
  Brand extends string | undefined = undefined,
>(
  schema: Schema,
  options: CreateStringifiedZodOptions<Brand> = {},
): StringifiedZod<Schema, ResolveBrand<Schema, Brand>> => {
  type ResolvedBrand = ResolveBrand<Schema, Brand>;

  const brandValue = inferBrandValue(schema, options.brand) as ResolvedBrand;
  const stringValueSchema = z.string();

  const fromStringSchema = stringValueSchema.transform((value, ctx): z.infer<Schema> => {
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(value);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Unable to parse ${brandValue} JSON string`,
      });
      return z.NEVER;
    }

    const result = schema.safeParse(parsedJson);
    if (result.success) {
      return result.data;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: result.error.issues
        .map((issue) => {
          const path = issue.path.length === 0 ? "" : `${issue.path.join(".")}: `;
          return `${path}${issue.message}`;
        })
        .join("; "),
    });
    return z.NEVER;
  });

  const parseString = (value: unknown): z.infer<Schema> =>
    fromStringSchema.parse(value);

  const safeParseString = (
    value: unknown,
  ): SafeParseResult<z.infer<Schema>> => {
    const result = fromStringSchema.safeParse(value);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  };

  const stringify = (
    value: z.input<Schema>,
  ): StringifiedJsonString<ResolvedBrand> => {
    const parsedValue = schema.parse(value);
    const jsonString = JSON.stringify(parsedValue);
    stringValueSchema.parse(jsonString);
    return jsonString as StringifiedJsonString<ResolvedBrand>;
  };

  return {
    brand: brandValue as ResolveBrand<Schema, Brand>,
    schema,
    stringValueSchema,
    fromStringSchema,
    parseString,
    safeParseString,
    stringify,
  } satisfies StringifiedZod<Schema, ResolvedBrand>;
};

