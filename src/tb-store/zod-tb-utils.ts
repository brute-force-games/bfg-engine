
// import { z } from 'zod';
// import type { CellSchema, TablesSchema } from 'tinybase';

// // Extract a single table schema from TablesSchema
// // A single table schema is the value type of TablesSchema (i.e., {[cellId: Id]: CellSchema})
// export type TinybaseTableSchema = TablesSchema[string];
// // export type TinybaseRowSchema = RowsSchema[string];

// // Derive TypeScript type from TinyBase CellSchema
// type InferTypeFromCellSchema<T extends CellSchema> = T extends { type: 'string' }
//   ? string
//   : T extends { type: 'number' }
//   ? number
//   : T extends { type: 'boolean' }
//   ? boolean
//   : never;

// // Derive TypeScript type from TinyBase table schema definition
// export type InferTypeFromSchema<T extends TinybaseTableSchema> = {
//   [K in keyof T]: InferTypeFromCellSchema<T[K]>;
// };

// // Helper function to create a Zod schema from TinyBase table schema definition
// export const createZodSchemaFromTinyBaseSchema = <
//   T extends TinybaseTableSchema,
//   O extends Partial<Record<keyof T, z.ZodTypeAny>> = Partial<Record<keyof T, z.ZodTypeAny>>
// >(
//   schema: T,
//   fieldOverrides?: O
// ): z.ZodObject<{
//   [K in keyof T]: K extends keyof O
//     ? O[K] extends z.ZodTypeAny
//       ? O[K]
//       : T[K] extends { type: 'string' }
//       ? z.ZodString
//       : T[K] extends { type: 'number' }
//       ? z.ZodNumber
//       : T[K] extends { type: 'boolean' }
//       ? z.ZodBoolean
//       : z.ZodTypeAny
//     : T[K] extends { type: 'string' }
//     ? z.ZodString
//     : T[K] extends { type: 'number' }
//     ? z.ZodNumber
//     : T[K] extends { type: 'boolean' }
//     ? z.ZodBoolean
//     : z.ZodTypeAny;
// }> => {
//   const shape: {
//     [K in keyof T]?: z.ZodTypeAny;
//   } = {};
  
//   for (const [key, cellSchema] of Object.entries(schema)) {
//     // Use override if provided, otherwise derive from schema
//     if (fieldOverrides && key in fieldOverrides) {
//       shape[key as keyof T] = fieldOverrides[key as keyof T]!;
//     } else if (cellSchema.type === 'string') {
//       shape[key as keyof T] = z.string();
//     } else if (cellSchema.type === 'number') {
//       shape[key as keyof T] = z.number();
//     } else if (cellSchema.type === 'boolean') {
//       shape[key as keyof T] = z.boolean();
//     }
//   }
  
//   return z.object(shape as {
//     [K in keyof T]: K extends keyof O
//       ? O[K] extends z.ZodTypeAny
//         ? O[K]
//         : T[K] extends { type: 'string' }
//         ? z.ZodString
//         : T[K] extends { type: 'number' }
//         ? z.ZodNumber
//         : T[K] extends { type: 'boolean' }
//         ? z.ZodBoolean
//         : z.ZodTypeAny
//       : T[K] extends { type: 'string' }
//       ? z.ZodString
//       : T[K] extends { type: 'number' }
//       ? z.ZodNumber
//       : T[K] extends { type: 'boolean' }
//       ? z.ZodBoolean
//       : z.ZodTypeAny;
//   });
// };
