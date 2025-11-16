import { z } from "zod";
import { BfgGameTableIdToolbox } from "../types/bfg-branded-uuids";
import { BfgGameStateForHostSchema, BfgGameStateForWatcherSchema } from "../../game-metadata/metadata-types/game-state-types";
import { BfgGameActionOutcomeSchema, BfgGameActionSchema } from "../../game-metadata/metadata-types/game-action-types";
import type { BfgGenericEngineMetadataSchemas } from "../../game-metadata/metadata-types";
import { createGameStateTransitionForDbSchema } from "./game-board-transition-db";


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



export const GameTableEventDataSchema = z.object({
  stepIndex: z.number(),
  // gameTableEventId: BfgGameTableEventIdToolbox.idSchema,
  source: GameTableActionSourceSchema,
  eventType: GameTableEventTypeSchema,
  createdAt: z.number(),
});
export type GameTableEventData = z.infer<typeof GameTableEventDataSchema>;


export const createGameTableEventWithTransitionSchema = (schemas: BfgGenericEngineMetadataSchemas) => {

  const GameStateTransitionSchema = createGameStateTransitionForDbSchema(schemas);

  const GameTableStepSchema = GameTableEventDataSchema.extend({
    transition: GameStateTransitionSchema,
  });

  return GameTableStepSchema;
};

export type GameTableEventWithTransition = z.infer<ReturnType<typeof createGameTableEventWithTransitionSchema>>;





// export type GameTableEventWithTransitionForHost = {
//   gameRoomId: BfgGameRoomId,
//   gameTableId: BfgGameTableId,
//   stepIndex: number,
//   hostTransitionData: GameTableEventWithTransition,
// }


// export type GameTableEventWithTransitionForWatcherP2p = {
//   gameRoomId: BfgGameRoomId,
//   gameTableId: BfgGameTableId,
//   stepIndex: number,
//   watcherTransitionData: GameTableEventWithTransition,

//   // createdAt: z.number(),
//   // stepIndex: z.number(),

//   // event: BfgGameActionSchema,
//   // outcome: BfgGameActionOutcomeSchema,
//   // // nextGameHostState: BfgGameStateForHostSchema,
//   // // nextGamePlayerStates: BfgGameStateForPlayerSchema,
//   // nextGameWatcherState: BfgGameStateForWatcherSchema
// }


// export type GameTableEventWithTransitionForPlayerP2p = {
//   gameRoomId: BfgGameRoomId,
//   gameTableId: BfgGameTableId,
//   stepIndex: number,
//   playerTransitionData: GameTableEventWithTransition,

//   // event: BfgGameActionSchema,
//   // outcome: BfgGameActionOutcomeSchema,
//   // // nextGameHostState: BfgGameStateForHostSchema,
//   // // nextGamePlayerStates: BfgGameStateForPlayerSchema,
//   // nextGameWatcherState: BfgGameStateForWatcherSchema
// }



// export const createGameTableEventSchema = <GED extends z.ZodType<GameTableEventData>>(
//   gameEventDataSchema: GED
// ) => GameTableEventDataSchema.extend({
//   eventData: gameEventDataSchema,
// });

// export type GameTableEvent<GED extends z.ZodType<GameTableEventData>> = z.infer<ReturnType<typeof createGameTableEventSchema<GED>>>;



// export const GameTableEventOutcomeDataSchema = z.object({
//   // outcomeId: BfgGameTableEventOutcomeIdToolbox.idSchema,
//   // outcomeData: z.any(),
// });
// export type GameTableEventOutcomeData = z.infer<typeof GameTableEventOutcomeDataSchema>;

// export const createBfgGameSpecificEventOutcomeSchema = <GSEO extends z.ZodType<GameTableEventOutcomeData>>(
//   gameEventOutcomeDataSchema: GSEO
// ) => GameTableEventOutcomeDataSchema.extend({
//   // outcomeId: BfgGameTableEventOutcomeIdToolbox.idSchema,
//   // outcomeData: gameEventOutcomeDataSchema,
//   outcomeData: gameEventOutcomeDataSchema,
// });

// export type BfgGameSpecificEventOutcomeSchema<GSEO extends z.ZodType<GameTableEventOutcomeData>> = z.infer<
//   ReturnType<typeof createBfgGameSpecificEventOutcomeSchema<GSEO>>>;




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



// export type BfgGameSpecificTableState<GSH extends z.ZodTypeAny> = {
//   // gameTableEventId: GameTableEventId,
//   // source: z.infer<typeof GameTableEventTypeSchema>,
//   // eventType: z.infer<typeof GameTableEventTypeSchema>,

//   stateData: z.infer<GSH>;
// }


// export const BfgGameSpecificGameStateSchema = z.object({})
// export type BfgGameSpecificGameState = z.infer<typeof BfgGameSpecificGameStateSchema>;


// export const BfgGameSpecificActionSchema = z.object({})
// export type BfgGameSpecificAction = z.infer<typeof BfgGameSpecificActionSchema>;


// export const BfgGameSpecificPlayerActionOutcomeSchema = z.object({});
// export type BfgGameSpecificPlayerActionOutcome = z.infer<typeof BfgGameSpecificPlayerActionOutcomeSchema>;


// export const BfgGameSpecificHostActionOutcomeSchema = z.object({});
// export type BfgGameSpecificHostActionOutcome = z.infer<typeof BfgGameSpecificHostActionOutcomeSchema>;



// export const GameTableStateStepDbSchema = z.object({
//   gameStateId: BfgGameStateIdToolbox.idSchema,
//   gameRoomId: BfgGameRoomIdToolbox.idSchema,
//   createdAt: z.number(),
//   stepIndex: z.number(),

//   // source: GameTableActionSourceSchema,
//   // eventType: GameTableEventTypeSchema,
  
//   eventId: BfgGameTableEventIdToolbox.idSchema,
//   outcomeId: BfgGameTableEventOutcomeIdToolbox.idSchema,
//   nextGameStateId: BfgGameTableHostStateIdToolbox.idSchema,
// });

// export type GameTableStateDbStep = z.infer<typeof GameTableStateStepDbSchema>;


// export const validateAsHostDbGameTableEvent = (event: GameTableDbStep): void => {
//   if (event.source !== 'game-table-action-source-host') {
//     throw new Error('Invalid source for host action: ' + event.source);
//   }

//   if (!HostActionTypes.includes(event.eventType as any)) {
//     throw new Error('Invalid event type for host event: ' + event.eventType);
//   }
// };


// export const validateAsPlayerDbGameTableEvent = (event: GameTableDbStep): void => {
//   if (!PlayerActionSources.includes(event.source as any)) {
//     throw new Error('Invalid source for player event: ' + event.source);
//   }

//   if (!PlayerActionTypes.includes(event.eventType as any)) {
//     throw new Error('Invalid event type for player event: ' + event.eventType);
//   }
// };



// export const createGameTableStepSchemaForGame = (schemas: BfgGenericEngineMetadataSchemas) => {
//   // const hostGameStateStringifier = gameMetadata.stringifiers.hostGameStateStringifier;
//   // const gameEventStringifier = gameMetadata.stringifiers.gameEventStringifier;
//   // const gameEventOutcomeStringifier = gameMetadata.stringifiers.gameEventOutcomeStringifier;

//   const { hostGameStateSchema, gameEventSchema, gameEventOutcomeSchema } = schemas;
//   // const gameEventSchema = gameMetadata.schemas.gameEventSchema;
//   // const gameEventOutcomeSchema = gameMetadata.schemas.gameEventOutcomeSchema;
//   // const gameEventOutcomeType = gameMetadata.schemas.gameEventOutcomeSchema;

//   const GameSpecificStepSchema = GameTableStateStepDbSchema.extend({
//     event: gameEventSchema,
//     eventOutcome: gameEventOutcomeSchema,
//     nextGameState: hostGameStateSchema,
//   });

//   return GameSpecificStepSchema;
// };





export const GameTableStepHostP2pSchema = z.object({
  gameTableId: BfgGameTableIdToolbox.idSchema,
  createdAt: z.number(),
  stepIndex: z.number(),

  event: BfgGameActionSchema,
  outcome: BfgGameActionOutcomeSchema,
  nextGameHostState: BfgGameStateForHostSchema,
  // nextGamePlayerStates: BfgGameStateForPlayerSchema,
  nextGameWatcherState: BfgGameStateForWatcherSchema
});

export type GameTableStepHostP2p = z.infer<typeof GameTableStepHostP2pSchema>;


// export const LatestWatcherAccessLevelGameStepP2pSchema = z.object({
//   publicEventData: z.any(),
//   publicOutcomeData: z.any(),
//   publicNextGameStateData: z.any(),
// });
// export type LatestWatcherAccessLevelGameStepP2p = z.infer<typeof LatestWatcherAccessLevelGameStepP2pSchema>;



// export type LatestHostAccessLevelGameEventP2p<
//   GED extends GameTableEventData,
//   GSEO extends GameTableEventOutcomeData,
//   GSH extends BfgGameStateForHost
// > = {
//   hostEventData: GED,
//   hostOutcomeData: GSEO,
//   hostNextGameStateData: GSH,
// };

// export const createLatestHostAccessLevelGameStepP2p = <
//   GED extends GameTableEventData,
//   GSEO extends GameTableEventOutcomeData,
//   GSH extends BfgGameStateForHost
// >(
//   hostEventData: GED,
//   hostOutcomeData: GSEO,
//   hostNextGameStateData: GSH
// ) => {
//   return {
//     hostEventData,
//     hostOutcomeData,
//     hostNextGameStateData,
//   };
// };

// export type BfgLatestHostAccessLevelGameStepP2p = ReturnType<typeof createLatestHostAccessLevelGameStepP2p>;
