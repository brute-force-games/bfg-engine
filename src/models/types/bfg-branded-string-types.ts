import z from "zod";
import { createBfgBrandedStringToolbox } from "./bfg-branded-string-utils";
// import { GameTableEventForWatcherP2pSchema, GameTableEventForPlayerP2pSchema, GameTableEventForHostP2pSchema } from "../p2p/game-table-event-p2p";

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


// export const GameTableEventForWatcherP2pSchemaToolbox = createBfgBrandedStringToolboxForSchema(GameTableEventForWatcherP2pSchema);
// export type GameTableEventForWatcherP2pString = z.infer<typeof GameTableEventForWatcherP2pSchemaToolbox.brand>;


export const BfgGameActionHostOutcomeStrToolbox = createBfgBrandedStringToolbox("BfgGameActionHostOutcomeStr");
export type BfgGameActionHostOutcomeStr = z.infer<typeof BfgGameActionHostOutcomeStrToolbox.schema>;

export const BfgGameActionPlayerOutcomeStrToolbox = createBfgBrandedStringToolbox('BfgGameActionPlayerOutcomeStr');
export type BfgGameActionPlayerOutcomeStr = z.infer<typeof BfgGameActionPlayerOutcomeStrToolbox.schema>;

export const BfgGameActionWatcherOutcomeStrToolbox = createBfgBrandedStringToolbox("BfgGameActionWatcherOutcomeStr");
export type BfgGameActionWatcherOutcomeStr = z.infer<typeof BfgGameActionWatcherOutcomeStrToolbox.schema>;

export const BfgStringifiedRoomStateStrToolbox = createBfgBrandedStringToolbox("BfgStringifiedRoomStateStr");
export type BfgStringifiedRoomStateStr = z.infer<typeof BfgStringifiedRoomStateStrToolbox.schema>;

export const BfgStringifiedBoardTransitionsStrToolbox = createBfgBrandedStringToolbox("BfgStringifiedLatestBoardTransitionStr");
export type BfgStringifiedBoardTransitionsStr = z.infer<typeof BfgStringifiedBoardTransitionsStrToolbox.schema>;

// export const BfgStringifiedGameStepStrToolbox = createBfgBrandedStringToolbox("BfgStringifiedGameStepStr");
// export type BfgStringifiedGameStepStr = z.infer<typeof BfgStringifiedGameStepStrToolbox.schema>;

// export const GameTableEventForWatcherP2pStringSchema = BfgBrandedStringSchema
//   .brand(GameTableEventForWatcherP2pSchema.description ?? OrphanedBfgBrandedStringType);
// export type GameTableEventForWatcherP2pString = z.infer<typeof GameTableEventForWatcherP2pStringSchema>;


// export class GameTableEventForWatcherP2pStringInstance {
// 	constructor(readonly value: GameTableEventForWatcherP2pString) {}

// 	getAssociatedSchema = () => GameTableEventForWatcherP2pSchema;

// 	toString = (): string => this.value;
// }

// export const gameTableEventForPlayerP2pSchemaToolbox = createBfgBrandedStringToolboxForSchema(GameTableEventForPlayerP2pSchema);
// export type GameTableEventForPlayerP2pString = z.infer<typeof gameTableEventForPlayerP2pSchemaToolbox.brand>;


// export const gameTableEventForHostP2pSchemaToolbox = createBfgBrandedStringToolboxForSchema(GameTableEventForHostP2pSchema);
// export type GameTableEventForHostP2pString = z.infer<typeof gameTableEventForHostP2pSchemaToolbox.brand>;


export const PerfectInformationGameEventSummaryStrToolbox = createBfgBrandedStringToolbox("PerfectInformationGameEventSummaryStr");
export type PerfectInformationGameEventSummaryStr = z.infer<typeof PerfectInformationGameEventSummaryStrToolbox.schema>;

export const PlayerInformationGameEventSummaryStrToolbox = createBfgBrandedStringToolbox("PlayerInformationGameEventSummaryStr");
export type PlayerInformationGameEventSummaryStr = z.infer<typeof PlayerInformationGameEventSummaryStrToolbox.schema>;

export const WatcherInformationGameEventSummaryStrToolbox = createBfgBrandedStringToolbox("WatcherInformationGameEventSummaryStr");
export type WatcherInformationGameEventSummaryStr = z.infer<typeof WatcherInformationGameEventSummaryStrToolbox.schema>;

export const BfgGameActionTypeStrToolbox = createBfgBrandedStringToolbox("BfgGameActionTypeStr");
export type BfgGameActionTypeStr = z.infer<typeof BfgGameActionTypeStrToolbox.schema>;

export const BfgStringifiedGameActionDataStrToolbox = createBfgBrandedStringToolbox("BfgStringifiedGameActionDataStr");
export type BfgStringifiedGameActionDataStr = z.infer<typeof BfgStringifiedGameActionDataStrToolbox.schema>;

export const BfgStringifiedGameActionOutcomeStrToolbox = createBfgBrandedStringToolbox("BfgStringifiedGameActionOutcomeStr");
export type BfgStringifiedGameActionOutcomeStr = z.infer<typeof BfgStringifiedGameActionOutcomeStrToolbox.schema>;

export const BfgStringifiedNextGameStateStrToolbox = createBfgBrandedStringToolbox("BfgStringifiedNextGameStateStr");
export type BfgStringifiedNextGameStateStr = z.infer<typeof BfgStringifiedNextGameStateStrToolbox.schema>;

export const BfgStringifiedNextToActPlayersStrToolbox = createBfgBrandedStringToolbox("BfgStringifiedNextToActPlayersStr");
export type BfgStringifiedNextToActPlayersStr = z.infer<typeof BfgStringifiedNextToActPlayersStrToolbox.schema>;

// stringifiedGameActionData: BfgStringifiedActionDataStrToolbox.schema,
// stringifiedActionOutcome: BfgStringifiedActionOutcomeStrToolbox.schema,
// stringifiedNextGameState: BfgStringifiedGameStateStrToolbox.schema,
// stringifiedNextToActPlayers: BfgStringifiedNextToActPlayersStrToolbox.schema,

