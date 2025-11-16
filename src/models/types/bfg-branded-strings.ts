import z from "zod";
import { GameTableEventForHostP2pSchema, GameTableEventForPlayerP2pSchema, GameTableEventForWatcherP2pSchema } from "../game-table/game-table-event-p2p";

export const OrphanedBfgBrandedStringType = 'OrphanedBfgBrandedString' as const;


export const BfgBrandedStringSchema = z.string().brand('BfgBrandedString');
export type BfgBrandedString = z.infer<typeof BfgBrandedStringSchema>;

export interface IBfgBrandedStringToolbox<T extends z.ZodSchema<any>> {
  schema: T;
  brand: z.ZodString;

  hydrateFromString: (value: string) => z.infer<T>;
}

export const createBfgBrandedStringToolboxForSchema = <T extends z.ZodSchema<any>>(schema: T): IBfgBrandedStringToolbox<T> => {
  if (!schema.description) {
    throw new Error('Schema for BFG branded string has no description');
  }
  
  const hydrateFromString = (value: string) => schema.parse(JSON.parse(value));
  
  return {
    schema,
    brand: BfgBrandedStringSchema.brand(schema.description),
    hydrateFromString,
  };
};


export const GameTableEventForWatcherP2pSchemaToolbox = createBfgBrandedStringToolboxForSchema(GameTableEventForWatcherP2pSchema);
export type GameTableEventForWatcherP2pString = z.infer<typeof GameTableEventForWatcherP2pSchemaToolbox.brand>;


// export const GameTableEventForWatcherP2pStringSchema = BfgBrandedStringSchema
//   .brand(GameTableEventForWatcherP2pSchema.description ?? OrphanedBfgBrandedStringType);
// export type GameTableEventForWatcherP2pString = z.infer<typeof GameTableEventForWatcherP2pStringSchema>;


// export class GameTableEventForWatcherP2pStringInstance {
// 	constructor(readonly value: GameTableEventForWatcherP2pString) {}

// 	getAssociatedSchema = () => GameTableEventForWatcherP2pSchema;

// 	toString = (): string => this.value;
// }

export const gameTableEventForPlayerP2pSchemaToolbox = createBfgBrandedStringToolboxForSchema(GameTableEventForPlayerP2pSchema);
export type GameTableEventForPlayerP2pString = z.infer<typeof gameTableEventForPlayerP2pSchemaToolbox.brand>;


export const gameTableEventForHostP2pSchemaToolbox = createBfgBrandedStringToolboxForSchema(GameTableEventForHostP2pSchema);
export type GameTableEventForHostP2pString = z.infer<typeof gameTableEventForHostP2pSchemaToolbox.brand>;
