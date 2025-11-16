
import { z } from 'zod';
import type { CellSchema, TablesSchema } from 'tinybase';

// Extract a single table schema from TablesSchema
// A single table schema is the value type of TablesSchema (i.e., {[cellId: Id]: CellSchema})
export type TinybaseTableSchema = TablesSchema[string];
// export type TinybaseRowSchema = RowsSchema[string];

// Derive TypeScript type from TinyBase CellSchema
type InferTypeFromCellSchema<T extends CellSchema> = T extends { type: 'string' }
  ? string
  : T extends { type: 'number' }
  ? number
  : T extends { type: 'boolean' }
  ? boolean
  : never;

// Derive TypeScript type from TinyBase table schema definition
export type InferTypeFromSchema<T extends TinybaseTableSchema> = {
  [K in keyof T]: InferTypeFromCellSchema<T[K]>;
};

// Helper function to create a Zod schema from TinyBase table schema definition
export const createZodSchemaFromTinyBaseSchema = <T extends TinybaseTableSchema>(
  schema: T,
  fieldOverrides?: Partial<Record<keyof T, z.ZodTypeAny>>
): z.ZodObject<{
  [K in keyof T]: T[K] extends { type: 'string' }
    ? z.ZodString
    : T[K] extends { type: 'number' }
    ? z.ZodNumber
    : T[K] extends { type: 'boolean' }
    ? z.ZodBoolean
    : z.ZodTypeAny;
}> => {
  const shape: Record<string, z.ZodTypeAny> = {};
  
  for (const [key, cellSchema] of Object.entries(schema)) {
    // Use override if provided, otherwise derive from schema
    if (fieldOverrides && key in fieldOverrides) {
      shape[key] = fieldOverrides[key as keyof T]!;
    } else if (cellSchema.type === 'string') {
      shape[key] = z.string();
    } else if (cellSchema.type === 'number') {
      shape[key] = z.number();
    } else if (cellSchema.type === 'boolean') {
      shape[key] = z.boolean();
    }
  }
  
  return z.object(shape) as any;
};
