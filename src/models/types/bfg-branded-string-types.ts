import z from "zod";
import { createBfgBrandedStringToolbox, createBfgBrandedStringToolboxForSchema } from "./bfg-branded-string-utils";
import { GameTableEventForWatcherP2pSchema, GameTableEventForPlayerP2pSchema, GameTableEventForHostP2pSchema } from "../game-table/game-table-event-p2p";

// export const OrphanedBfgBrandedStringType = 'OrphanedBfgBrandedString' as const;
// import { GameTableEventForHostP2pSchema, GameTableEventForPlayerP2pSchema, GameTableEventForWatcherP2pSchema } from "../game-table/game-table-event-p2p";


// export const BfgBrandedStringSchema = z.string().brand('BfgBrandedString');
// export type BfgBrandedString = z.infer<typeof BfgBrandedStringSchema>;

// export interface IBfgBrandedStringToolbox<T extends z.ZodSchema<any>> {
//   schema: T;
//   brand: z.ZodString;

//   hydrateFromString: (value: string) => z.infer<T>;
//   createBrandedString: (value: string) => BfgBrandedString;
// }

// export const createBfgBrandedStringWithName = (name: string) => BfgBrandedStringSchema.brand(name);
// export type BfgBrandedStringWithName = z.infer<typeof createBfgBrandedStringWithName>;


// export const BfgGameActionPlayerOutcomeStrSchema = createBfgBrandedStringWithName('BfgGameActionPlayerOutcomeStr');
// export type BfgGameActionPlayerOutcomeStr = z.infer<typeof BfgGameActionPlayerOutcomeStrSchema>;




// // export interface IBfgBrandedStringToolbox<T extends z.ZodSchema<any>> {
// //   schema: T;
// //   brand: z.ZodString;

// //   hydrateFromString: (value: string) => z.infer<T>;
// // }

// export const createBfgBrandedStringToolboxForSchema = <T extends z.ZodSchema<any>>(schema: T): IBfgBrandedStringToolbox<T> => {
//   if (!schema.description) {
//     throw new Error('Schema for BFG branded string has no description');
//   }
  
//   const hydrateFromString = (value: string) => schema.parse(JSON.parse(value));
//   const createBrandedString = (value: string) => BfgBrandedStringSchema.brand(schema.description).parse(value);
  
//   return {
//     schema,
//     brand: BfgBrandedStringSchema.brand(schema.description),
//     hydrateFromString,
//     createBrandedString,
//   };
// };


export const GameTableEventForWatcherP2pSchemaToolbox = createBfgBrandedStringToolboxForSchema(GameTableEventForWatcherP2pSchema);
export type GameTableEventForWatcherP2pString = z.infer<typeof GameTableEventForWatcherP2pSchemaToolbox.brand>;


export const BfgGameActionHostOutcomeStrToolbox = createBfgBrandedStringToolbox("BfgGameActionHostOutcomeStr");
export type BfgGameActionHostOutcomeStr = z.infer<typeof BfgGameActionHostOutcomeStrToolbox.schema>;

export const BfgGameActionPlayerOutcomeStrToolbox = createBfgBrandedStringToolbox('BfgGameActionPlayerOutcomeStr');
export type BfgGameActionPlayerOutcomeStr = z.infer<typeof BfgGameActionPlayerOutcomeStrToolbox.schema>;

export const BfgGameActionWatcherOutcomeStrToolbox = createBfgBrandedStringToolbox("BfgGameActionWatcherOutcomeStr");
export type BfgGameActionWatcherOutcomeStr = z.infer<typeof BfgGameActionWatcherOutcomeStrToolbox.schema>;


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

