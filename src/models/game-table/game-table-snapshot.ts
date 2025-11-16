import { z } from "zod";
// import { BfgGameTableIdToolbox, BfgGameTableEventIdToolbox, BfgGameTableEventOutcomeIdToolbox, BfgGameTableHostStateIdToolbox } from "../types/bfg-branded-uuids";
// import { type DbGameTableStep } from "./game-table-step";


export const HostActionSources = [
  'game-table-action-source-host',
] as const;

export const PlayerActionSources = [
  'game-table-action-source-player-p1',
  'game-table-action-source-player-p2',
  'game-table-action-source-player-p3',
  'game-table-action-source-player-p4',
  'game-table-action-source-player-p5',
  'game-table-action-source-player-p6',
  'game-table-action-source-player-p7',
  'game-table-action-source-player-p8',
] as const;


export const HostActionTypes = [
  'game-table-action-host-starts-setup',
  'game-table-action-host-setup-board',
  'game-table-action-host-starts-game',
  'game-table-action-host-event',
  'game-table-action-host-action',
  'game-table-action-host-declares-winner',
  'game-table-action-host-declares-draw',
  'game-table-action-host-eliminates-player',
  'game-table-action-host-cancels-game',
] as const;


export const PlayerActionTypes = [
  'game-table-action-player-action',
] as const;



export const GameTableActionSourceSchema = z.enum([
  ...HostActionSources,
  ...PlayerActionSources,
] as const);

export type GameTableActionSource = z.infer<typeof GameTableActionSourceSchema>;


export const GameTableEventTypeSchema = z.enum([
  ...HostActionTypes,
  ...PlayerActionTypes,
] as const);



// export const createBfgGameSpecificTableStateSchema = <GSH extends z.ZodTypeAny>(
//   gameStateDataSchema: GSH
// ) => z.object({
//   gameTableStateId: BfgGameTableHostStateIdToolbox.idSchema,
//   stateData: gameStateDataSchema,
// });

// export type BfgGameSpecificTableState<GSH extends z.ZodTypeAny> = z.infer<ReturnType<typeof createBfgGameSpecificTableStateSchema<GSH>>>;


// export const createBfgGameSpecificTableEventSchema = <GE extends z.ZodTypeAny>(
//   gameEventDataSchema: GE
// ) => z.object({
//   gameTableEventId: BfgGameTableEventIdToolbox.idSchema,
//   source: GameTableActionSourceSchema,
//   eventType: GameTableEventTypeSchema,
//   eventData: gameEventDataSchema,
// });

// export type BfgGameSpecificTableEvent<GSE extends z.ZodTypeAny> = z.infer<ReturnType<typeof createBfgGameSpecificTableEventSchema<GSE>>>;


// export const createBfgGameSpecificEventOutcomeSchema = <GSEO extends z.ZodTypeAny>(
//   gameEventOutcomeDataSchema: GSEO
// ) => z.object({
//   outcomeId: BfgGameTableEventOutcomeIdToolbox.idSchema,
//   outcomeData: gameEventOutcomeDataSchema,
// });

// export type BfgGameSpecificEventOutcomeSchema<GSEO extends z.ZodTypeAny> = z.infer<ReturnType<typeof createBfgGameSpecificEventOutcomeSchema<GSEO>>>;


// // export type BfgGameSpecificTableState<GSH extends z.ZodTypeAny> = {
// //   // gameTableEventId: GameTableEventId,
// //   // source: z.infer<typeof GameTableEventTypeSchema>,
// //   // eventType: z.infer<typeof GameTableEventTypeSchema>,

// //   stateData: z.infer<GSH>;
// // }


// // export const BfgGameSpecificGameStateSchema = z.object({})
// // export type BfgGameSpecificGameState = z.infer<typeof BfgGameSpecificGameStateSchema>;


// // export const BfgGameSpecificActionSchema = z.object({})
// // export type BfgGameSpecificAction = z.infer<typeof BfgGameSpecificActionSchema>;


// // export const BfgGameSpecificPlayerActionOutcomeSchema = z.object({});
// // export type BfgGameSpecificPlayerActionOutcome = z.infer<typeof BfgGameSpecificPlayerActionOutcomeSchema>;


// // export const BfgGameSpecificHostActionOutcomeSchema = z.object({});
// // export type BfgGameSpecificHostActionOutcome = z.infer<typeof BfgGameSpecificHostActionOutcomeSchema>;



// export const DbGameTableSnapshotSchema = z.object({
//   createdAt: z.number(),

//   source: GameTableActionSourceSchema,
//   eventType: GameTableEventTypeSchema,
  
//   // latestStep: DbGameTableStepSchema,
  
//   // eventId: BfgGameTableEventIdToolbox.idSchema,
//   // outcomeId: BfgGameTableEventOutcomeIdToolbox.idSchema,
//   // nextGameStateId: BfgGameTableHostStateIdToolbox.idSchema,

//   // actionStr: BfgEncodedStringSchema,  // encoded complete action information that isn't necessarily public to every player
//   // actionOutcomeStr: BfgEncodedStringOrEmptySchema,  // encoded outcome of the action that is private to the host
//   // nextGameStateStr: BfgEncodedStringSchema,  // encoded next game state information that is private to the host
  
//   gameTableId: BfgGameTableIdToolbox.idSchema,
// });

// export type DbGameTableSnapshot = z.infer<typeof DbGameTableSnapshotSchema>;



// export const createDbGameTableSnapshotSchemaForGame = (latestStepSchema: z.ZodSchema<DbGameTableStep>) => {

//   // const latestStepSchema = createDbGameTableStepSchemaForGame(gameMetadata);

//   const GameSpecificSnapshotSchema = DbGameTableSnapshotSchema.extend({
//     latestStep: latestStepSchema,
//   });

//   return GameSpecificSnapshotSchema;

//   // const hostSetsUpGameSetupAction: DbGameTableEvent = {
//   //   gameTableId: tableId,
//   //   createdAt: now,

//   //   source: "game-table-action-source-host",
//   //   eventType: "game-table-action-host-starts-setup",

//   //   actionStr,
//   //   actionOutcomeStr,
//   //   nextGameStateStr,
//   // }

//   // // const hostGameStateStringifier = gameMetadata.stringifiers.hostGameStateStringifier;
//   // // const gameEventStringifier = gameMetadata.stringifiers.gameEventStringifier;
//   // // const gameEventOutcomeStringifier = gameMetadata.stringifiers.gameEventOutcomeStringifier;

//   // const { hostGameStateSchema, gameEventSchema, gameEventOutcomeSchema } = gameMetadata.schemas;
//   // // const gameEventSchema = gameMetadata.schemas.gameEventSchema;
//   // // const gameEventOutcomeSchema = gameMetadata.schemas.gameEventOutcomeSchema;
//   // // const gameEventOutcomeType = gameMetadata.schemas.gameEventOutcomeSchema;

//   // const GameSpecificStepSchema = DbGameTableStepSchema.extend({
//   //   nextGameState: hostGameStateSchema,
//   //   event: gameEventSchema,
//   //   eventOutcome: gameEventOutcomeSchema,
//   //   // stringifiedEvent: gameEventStringifier.stringValueSchema,
//   //   // stringifiedEventOutcome: gameEventOutcomeStringifier.stringValueSchema,
//   //   // stringifiedNextGameState: hostGameStateStringifier.stringValueSchema,
//   // });

//   // return GameSpecificStepSchema;
// };


// export const validateAsHostDbGameTableEvent = (event: DbGameTableEvent): void => {
//   if (event.source !== 'game-table-action-source-host') {
//     throw new Error('Invalid source for host action: ' + event.source);
//   }

//   if (!HostActionTypes.includes(event.eventType as any)) {
//     throw new Error('Invalid event type for host event: ' + event.eventType);
//   }
// };


// export const validateAsPlayerDbGameTableEvent = (event: DbGameTableEvent): void => {
//   if (!PlayerActionSources.includes(event.source as any)) {
//     throw new Error('Invalid source for player event: ' + event.source);
//   }

//   if (!PlayerActionTypes.includes(event.eventType as any)) {
//     throw new Error('Invalid event type for player event: ' + event.eventType);
//   }
// };
