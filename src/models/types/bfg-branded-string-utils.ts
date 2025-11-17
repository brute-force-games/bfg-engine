import z from "zod";


// export const OrphanedBfgBrandedStringType = 'OrphanedBfgBrandedString' as const;

export const BfgBrandedStringSchema = z.string().brand('BfgBrandedString');
export type BfgBrandedString = z.infer<typeof BfgBrandedStringSchema>;


export const createBfgBrandedStringWithName = (name: string) => BfgBrandedStringSchema.brand(name);
export type BfgBrandedStringWithName = z.infer<typeof createBfgBrandedStringWithName>;

export interface IBfgBrandedStringToolbox {
  schema: z.ZodString;
  createBrandedString: <T extends z.ZodSchema<any>>(value: string) => z.infer<T>;
}

export const createBfgBrandedStringToolbox = (name: string): IBfgBrandedStringToolbox => {
  const schema = createBfgBrandedStringWithName(name)
    .describe(`BFG branded string: ${name}`);


  return {
    schema,
    createBrandedString: <T extends z.ZodSchema<any>>(value: string) => schema.parse(value) as z.infer<T>,
  };
};


export interface IBfgBrandedStringToolboxForSchema<T extends z.ZodSchema<any>> {
  schema: T;
  brand: z.ZodString;

  hydrateFromString: (value: string) => z.infer<T>;
  createBrandedString: (value: string) => z.infer<typeof createBfgBrandedStringWithName>;
}


export const createBfgBrandedStringToolboxForSchema = <
  T extends z.ZodSchema<any>
>(schema: T): IBfgBrandedStringToolboxForSchema<T> => {
  
  if (!schema.description) {
    throw new Error('Schema for BFG branded string has no description');
  }

  const brand = createBfgBrandedStringWithName(schema.description);
  const hydrateFromString = (value: string) => schema.parse(JSON.parse(value));
  const createBrandedString = (value: string) => BfgBrandedStringSchema.brand(schema.description).parse(value);
  
  return {
    schema,
    brand,
    hydrateFromString,
    createBrandedString,
  };
};

export type BfgBrandedStringToolbox<T extends z.ZodSchema<any>> = ReturnType<typeof createBfgBrandedStringToolboxForSchema<T>>;


// export const BfgGameActionPlayerOutcomeStrSchema = createBfgBrandedStringWithName('BfgGameActionPlayerOutcomeStr');
// export type BfgGameActionPlayerOutcomeStr = z.infer<typeof BfgGameActionPlayerOutcomeStrSchema>;
