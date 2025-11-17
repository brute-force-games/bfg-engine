import { z } from "zod";
// import type { BfgDataEncoderFormat, IBfgDataEncoder } from "./encoders";
import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "./metadata-types/game-state-types";
import type { BfgSupportedGameTitle, GameDefinition } from "../models/game-box-definition";
// import type { CompleteGameProcessor } from "./factories/complete-game-processor-factory";
import type { BfgGameMetadataType } from "./metadata-defs";
import type { BfgGameEngineAccessLevelAdapters, IBfgGameEngineAccessLevelAdapters, IBfgGameProcessor } from "./factories/complete-game-processor-factory";
import type { BfgGameEngineComponents } from "./ui/bfg-game-components";
// import type { IBfgGameEngineAccessLevelConverters } from "./ui/bfg-game-components";




// export type BfgGameKnowledgeType = 'public-knowledge' | 'private-player-knowledge';
// export type BfgGameMetadataType = 'public-knowledge-game' | 'private-player-knowledge-game';


/**
 * Utility type that forces a type T to extend from base interface TBase.
 * This ensures type safety by requiring T to have all properties of TBase.
 */
// export type Extends<T, TBase> = T extends TBase ? T : never;

/**
 * Utility type that creates a new type that must extend the base interface
 * and can optionally add additional properties.
 */
// export type ForceExtend<TBase> = TBase & Record<string, unknown>;


// export type GSH = ForceExtend<z.ZodSchema<BfgGameStateForHost>>;
// export type GSP = ForceExtend<z.ZodSchema<BfgGameStateForPlayer>>;
// export type GSW = ForceExtend<z.ZodSchema<BfgGameStateForWatcher>>;

// export type GSHExt = ReturnType<typeof BfgGameStateForHostSchema.extend>;
// export type GSPExt = ReturnType<typeof BfgGameStateForPlayerSchema.extend>;
// export type GSWExt = ReturnType<typeof BfgGameStateForWatcherSchema.extend>;

// export type GSHExt = Extends<BfgGameStateForHost, typeof BfgGameStateForHostSchema>;
// export type GSPExt = Extends<BfgGameStateForPlayer, typeof BfgGameStateForPlayerSchema>;
// export type GSWExt = Extends<BfgGameStateForWatcher, typeof BfgGameStateForWatcherSchema>;

// export type HGAExt = ReturnType<typeof BfgGameActionByHostSchema.extend>;
// export type PGAExt = ReturnType<typeof BfgGameActionByPlayerSchema.extend>;
// export type HGAExt = Extends<BfgGameActionByHost, typeof BfgGameActionByHostSchema>;
// export type PGAExt = Extends<BfgGameActionByPlayer, typeof BfgGameActionByPlayerSchema>;

// export type AllPGAExt = z.ZodDiscriminatedUnion<readonly z.ZodTypeAny[], 'actionType'>;

// export type GAPOExt = ReturnType<typeof BfgGameSpecificPlayerActionOutcomeSchema.extend>;
// export type GAHOExt = ReturnType<typeof BfgGameSpecificHostActionOutcomeSchema.extend>;

// export type GAHOExt = BfgGameSpecificHostActionOutcome;
// export type GAPOExt = BfgGameSpecificPlayerActionOutcome;


export interface ICompleteTypesForGameMetadata <
  GSH extends BfgGameStateForHost,
  GSP extends BfgGameStateForPlayer,
  GSW extends BfgGameStateForWatcher,
  // PGA extends BfgGameActionByPlayer,
  // HGA extends BfgGameActionByHost,
> {
  hostGameStateSchema: GSH;
  playerGameStateSchema: GSP;
  watcherGameStateSchema: GSW;

  // playerActionSchema: PGA;
  // hostActionSchema: HGA;

  // playerActionOutcomeSchema: GAPOExt;
  // hostActionOutcomeSchema: GAHOExt;
}








// export type DataRoleSchemaAndEncoder<TSchema extends z.ZodTypeAny> = {
//   schema: TSchema;
//   encoder: IBfgDataEncoder<BfgDataEncoderFormat, z.infer<TSchema>>;
// }


// export const createBfgMetadataGameStateAccessTypes = <
//   HostGameStateSchema extends GSHExt,
//   PlayerGameStateSchema extends GSPExt,
//   WatcherGameStateSchema extends GSWExt
// >(
//   hostGameStateSchema: HostGameStateSchema,
//   playerGameStateSchema: PlayerGameStateSchema,
//   watcherGameStateSchema: WatcherGameStateSchema,
// ) => {
//   const retVal = {
//     hostGameStateSchema,
//     playerGameStateSchema,
//     watcherGameStateSchema,
//   };

//   return retVal;
// }

// export type CompleteTypesForBf  gGameMetadata = ReturnType<typeof createBfgMetadataGameStateAccessTypes>;
// export type BfgMetadataGameStateAccessTypes = ReturnType<typeof createBfgMetadataGameStateAccessTypes>;


// export type BfgEngineMetadataSchemas<
//   GSH extends z.ZodType<BfgGameStateForHost>,
//   GSP extends z.ZodType<BfgGameStateForPlayer>,
//   GSW extends z.ZodType<BfgGameStateForWatcher>,
//   GEV extends z.ZodType<BfgGameEvent>,
//   GEVO extends z.ZodType<BfgGameEventOutcome>,
// > = {
//   // hostGameStateSchema: z.ZodObject<{ hostGameState: GSH }>;
//   // playerGameStateSchema: z.ZodObject<{ playerGameState: GSP }>;
//   // watcherGameStateSchema: z.ZodObject<{ watcherGameState: GSW }>;
//   // gameEventSchema: z.ZodObject<{ gameEvent: GESchema }>;
//   // gameEventOutcomeSchema: z.ZodObject<{ gameEventOutcome: GEOSchema }>;
//   hostGameStateSchema: GSH;
//   playerGameStateSchema: GSP;
//   watcherGameStateSchema: GSW;
//   gameEventSchema: GEV;
//   gameEventOutcomeSchema: GEVO;
// };


// export const createBfgEngineMetadataSchemas = <
//   GSH extends z.ZodType<BfgGameStateForHost>,
//   GSP extends z.ZodType<BfgGameStateForPlayer>,
//   GSW extends z.ZodType<BfgGameStateForWatcher>,
//   // GEV extends z.ZodType<BfgGameEvent>,
//   // GEVO extends z.ZodType<BfgGameEventOutcome>,
//   // HGA extends z.ZodType<BfgGameActionByHost>,
//   // PGA extends z.ZodType<BfgGameActionByPlayer>,
// >({
//   hostGameStateSchema,
//   playerGameStateSchema,
//   watcherGameStateSchema,
//   // gameEventSchema,
//   // gameEventOutcomeSchema,
//   // hostActionSchema,
//   // playerActionSchema,
// }: {
//   hostGameStateSchema: GSH;
//   playerGameStateSchema: GSP;
//   watcherGameStateSchema: GSW;
//   // gameEventSchema: GEV;
//   // gameEventOutcomeSchema: GEVO;
//   // hostActionSchema: HGA;
//   // playerActionSchema: PGA;
// }) => {
//   return {
//     hostGameStateSchema,
//     playerGameStateSchema,
//     watcherGameStateSchema,
//     // gameEventSchema,
//     // gameEventOutcomeSchema,
//     // hostActionSchema,
//     // playerActionSchema,
//   };
// };

// export type BfgGenericEngineMetadataSchemas = ReturnType<typeof createBfgEngineMetadataSchemas>;


export const createBfgEngineMetadataSchemas = <
  GSH extends z.ZodType<BfgGameStateForHost>,
  GSP extends z.ZodType<BfgGameStateForPlayer>,
  GSW extends z.ZodType<BfgGameStateForWatcher>,
  // GEV extends z.ZodType<BfgGameEvent>,
  // GEVO extends z.ZodType<BfgGameEventOutcome>,
  // HGA extends z.ZodType<BfgGameActionByHost>,
  // PGA extends z.ZodType<BfgGameActionByPlayer>,
>({
  hostGameStateSchema,
  playerGameStateSchema,
  watcherGameStateSchema,
  // gameEventSchema,
  // gameEventOutcomeSchema,
  // hostActionSchema,
  // playerActionSchema,
}: {
  hostGameStateSchema: GSH;
  playerGameStateSchema: GSP;
  watcherGameStateSchema: GSW;
  // gameEventSchema: GEV;
  // gameEventOutcomeSchema: GEVO;
  // hostActionSchema: HGA;
  // playerActionSchema: PGA;
}) => {
  return {
    hostGameStateSchema,
    playerGameStateSchema,
    watcherGameStateSchema,
    // gameEventSchema,
    // gameEventOutcomeSchema,
    // hostActionSchema,
    // playerActionSchema,
  };
};
export type BfgGenericEngineMetadataSchemas = ReturnType<typeof createBfgEngineMetadataSchemas>;




export interface IBfgGenericEngineMetadataSchemas <
  GSH extends z.ZodType<BfgGameStateForHost>,
  GSP extends z.ZodType<BfgGameStateForPlayer>,
  GSW extends z.ZodType<BfgGameStateForWatcher>
> {
  hostGameStateSchema: GSH;
  playerGameStateSchema: GSP;
  watcherGameStateSchema: GSW;
}


// export type BfgGenericEngineMetadataSchemas <
//   GSH extends z.ZodType<BfgGameStateForHost>,
//   GSP extends BfgGameStateForPlayer,
//   GSW extends BfgGameStateForWatcher
// > = {
//   // schemas: {
//     hostGameStateSchema: GSH
//     playerGameStateSchema: GSP;
//     watcherGameStateSchema: GSW;
//     // watcherGameStateSchema: GSW;
//   // };
// };


// export type BfgGenericEngineMetadataSchemas <
//   GSH extends z.ZodType<BfgGameStateForHost>,
//   GSP extends z.ZodType<BfgGameStateForPlayer>,
//   GSW extends z.ZodType<BfgGameStateForWatcher>,
//   GEV extends z.ZodType<BfgGameEvent>,
//   GEVO extends z.ZodType<BfgGameEventOutcome>,
//   HGA extends z.ZodType<BfgGameActionByHost>,
//   PGA extends z.ZodType<BfgGameActionByPlayer>,
// >
// = {
//   hostGameStateSchema: GSH,
//   playerGameStateSchema: GSP,
//   watcherGameStateSchema: GSW,
//   gameEventSchema: GEV,
//   gameEventOutcomeSchema: GEVO,
//   hostActionSchema: HGA,
//   playerActionSchema: PGA,
// }


// export type BfgGenericEngineMetadataSchemas = {
//   hostGameStateSchema: z.ZodType<BfgGameStateForHost>;
//   playerGameStateSchema: z.ZodType<BfgGameStateForPlayer>;
//   watcherGameStateSchema: z.ZodType<BfgGameStateForWatcher>;
//   gameEventSchema: z.ZodType<BfgGameEvent>;
//   gameEventOutcomeSchema: z.ZodType<BfgGameEventOutcome>;
// };

// export interface IBfgEngineMetadataStringifiers<
//   GSH extends BfgGameStateForHost,
//   GSP extends BfgGameStateForPlayer,
//   GSW extends BfgGameStateForWatcher,
//   GSE extends BfgGameEvent,
//   GSEO extends BfgGameEventOutcome,
//   // PGA extends BfgGameActionByPlayer,
//   // HGA extends BfgGameActionByHost,
// > {
//   gameEventStringifier: StringifiedZod<z.ZodSchema<GSE>, 'gameEvent'>;
//   gameEventOutcomeStringifier: StringifiedZod<z.ZodSchema<GSEO>, 'gameEventOutcome'>;
//   // gameStateStringifier: StringifiedZod<z.ZodSchema<GSS>, 'gameState'>;
  
//   hostGameStateStringifier: StringifiedZod<z.ZodSchema<GSH>, 'hostGameState'>;
//   playerGameStateStringifier: StringifiedZod<z.ZodSchema<GSP>, 'playerGameState'>;
//   watcherGameStateStringifier: StringifiedZod<z.ZodSchema<GSW>, 'watcherGameState'>;
//   // hostActionStringifier: StringifiedZod<z.ZodSchema<HGA>, 'hostAction'>;
//   // playerActionStringifier: StringifiedZod<z.ZodSchema<PGA>, 'playerAction'>;
//   // hostActionOutcomeStringifier: StringifiedZod<z.ZodSchema<GHAO>, 'hostActionOutcome'>;
//   // playerActionOutcomeStringifier: StringifiedZod<z.ZodSchema<GAPO>, 'playerActionOutcome'>;
//   // watcherGameStateStringifier: StringifiedZod<GSW, 'watcherGameState'>;
//   // hostActionStringifier: StringifiedZod<HGA, 'hostAction'>;
//   // playerActionStringifier: StringifiedZod<PGA, 'playerAction'>;
//   // hostActionOutcomeStringifier: StringifiedZod<GHAO, 'hostActionOutcome'>;
//   // playerActionOutcomeStringifier: StringifiedZod<GAPO, 'playerActionOutcome'>;
// }


// export interface IBfgEngineMetadataEncoders<
//   GSH extends BfgGameStateForHost,
//   GSP extends BfgGameStateForPlayer,
//   GSW extends BfgGameStateForWatcher,
//   GSE extends BfgGameEvent,
//   GSEO extends BfgGameEventOutcome,
//   // PGA extends BfgGameActionByPlayer,
//   // HGA extends BfgGameActionByHost,
//   // AllPGA extends z.ZodTypeAny | null = null,
// > {
//   hostGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSH>;
//   hostActionOutcomeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSH>;
//   playerGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSP>;
//   watcherGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSW>;

//   gameEventEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSE>;
//   gameEventOutcomeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSEO>;
//   // hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, HGA>;
//   // playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, PGA>;
//   // playerActionsUnionEncoder?: AllPGA extends z.ZodTypeAny
//   //   ? IBfgDataEncoder<BfgDataEncoderFormat, z.infer<AllPGA>>
//   //   : undefined;
// }


// export interface IBfgGameCompleteMetadata 
// // <
// //   GSHSchema extends z.ZodType<BfgGameStateForHost>,
// //   GSPSchema extends z.ZodType<BfgGameStateForPlayer>,
// //   GSWSchema extends z.ZodType<BfgGameStateForWatcher>,
// //   GEVSchema extends z.ZodType<BfgGameEvent>,
// //   GEOVSchema extends z.ZodType<BfgGameEventOutcome>,
// //   // PGA extends BfgGameActionByPlayer,
// //   // HGA extends BfgGameActionByHost
// //   // AllPGA extends AllPGAExt,
// // > 
// {
//   metadataType: BfgGameMetadataType;
//   gameTitle: BfgSupportedGameTitle;
//   definition: GameDefinition;
//   // gameStateAccessTypes: ICompleteTypesForGameMetadata<GSH, GSP, GSW>;

//   schemas: BfgGenericEngineMetadataSchemas;
//   // encoders: IBfgEngineMetadataEncoders<GSHSchema, GSPSchema, GSWSchema, GESchema, GEOSchema>;
//   // stringifiers: IBfgEngineMetadataStringifiers<GSHSchema, GSPSchema, GSWSchema, GESchema, GEOSchema>;
//   // accessLevelConverters: IBfgGameEngineAccessLevelConverters<GSH, GSP, GSW>;

//   gameProcessor: IBfgGameProcessor;
//   // components: IBfgGameEngineComponents<GSH, GSP, GSW, PGA, HGA>;
// }

// export type BfgGameEngineMetadata <
//   GSH extends BfgGameStateForHost,
//   GSP extends BfgGameStateForPlayer,
//   GSW extends BfgGameStateForWatcher,
//   PGA extends BfgGameActionByPlayer,
//   HGA extends BfgGameActionByHost,
//   // AllPGA extends AllPGAExt,
// > = IBfgGameCompleteMetadata<GSH, GSP, GSW, PGA, HGA>;


export type BfgGameEngineMetadata = {
  metadataType: BfgGameMetadataType;
  gameTitle: BfgSupportedGameTitle;
  definition: GameDefinition;

  schemas: BfgGenericEngineMetadataSchemas;
  components: BfgGameEngineComponents;

  gameProcessor: IBfgGameProcessor;
  accessLevelAdapters: BfgGameEngineAccessLevelAdapters;

}
