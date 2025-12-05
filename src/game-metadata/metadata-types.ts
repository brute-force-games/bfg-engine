import { z } from "zod";
import type { BfgSupportedGameTitle, GameDefinition } from "../models/game-box-definition";
import type { BfgGameMetadataType } from "./metadata-defs";
import type { IBfgGameProcessor } from "./factories/complete-game-processor-factory";
import type { BfgGameEngineComponents } from "./ui/bfg-game-components";
import type { 
  BfgGameStatePerspectiveAdapters,
  BfgGameEventOutcomePerspectiveAdapters
} from "./factories/game-access-level-adapter-factory";
import { createUserGameRoomDataForPlayerSchema, createUserGameRoomDataForWatcherSchema, createUserGameRoomDataForPerspectiveSchema } from "../hooks/p2p/game/user-game-room-data";
import { BfgGameStepIndexSchema, BfgTimestampSchema } from "../models/types/bfg-versions";
import { GameTableActionSourceSchema, GameTableEventTypeSchema } from "../models/game-table/game-table-event";
import { GameTableSeatSchema, type GameTableSeat } from "../models/internal/game-room-base";
import { PerfectInformationGameEventSummaryStrToolbox, PlayerInformationGameEventSummaryStrToolbox, WatcherInformationGameEventSummaryStrToolbox } from "../models/types/bfg-branded-string-types";



export const GTAL_NONE = 'none' as const;
export const GTAL_HOST = 'host' as const;
export const GTAL_PLAYER = 'player' as const;
export const GTAL_OBSERVER = 'observer' as const;

export const GameTableAccessLevelSchema = z.enum([
  GTAL_HOST,
  GTAL_PLAYER,
  GTAL_OBSERVER,
  GTAL_NONE,
]);
export type GameTableAccessLevel = z.infer<typeof GameTableAccessLevelSchema>;

export const GameTableAccessActionSchema = z.enum([
  'watch',
  'play',
  'host',
]);
export type GameTableAccessAction = z.infer<typeof GameTableAccessActionSchema>;


// export const UserGameRoleEnumSchema = z.enum(['host', 'player', 'watcher']);
// export type UserGameRole = z.infer<typeof UserGameRoleEnumSchema>;


export const UserGameRoleBaseSchema = z.object({
  accessLevel: GameTableAccessLevelSchema,
});
export type UserGameRoleBase = z.infer<typeof UserGameRoleBaseSchema>;


export const UserGameRoleForHostSchema = UserGameRoleBaseSchema.extend({
  accessLevel: z.literal('host'),
});
export type UserGameRoleForHost = z.infer<typeof UserGameRoleForHostSchema>;

export const UserGameRoleForPlayerSchema = UserGameRoleBaseSchema.extend({
  accessLevel: z.literal('player'),
  playerSeat: GameTableSeatSchema,
});
export type UserGameRoleForPlayer = z.infer<typeof UserGameRoleForPlayerSchema>;

export const UserGameRoleForWatcherSchema = UserGameRoleBaseSchema.extend({
  accessLevel: z.literal('observer'),
});
export type UserGameRoleForWatcher = z.infer<typeof UserGameRoleForWatcherSchema>;


export const UserGameRoleSchema = z.discriminatedUnion('accessLevel', [
  UserGameRoleForHostSchema,
  UserGameRoleForPlayerSchema,
  UserGameRoleForWatcherSchema,
]);
export type UserGameRole = z.infer<typeof UserGameRoleSchema>;



export const GameActionSourceSchema = z.enum(['other', 'host', 'player']).describe(`GameActionSource`);
export type GameActionSource = z.infer<typeof GameActionSourceSchema>;


export const PerfectInformationGameStateSchema = z.object({}).describe(`PerfectInformationGameState`);
export const PlayerRoleGameStateSchema = z.object({}).describe(`PlayerInformationGameState`);
export const WatcherRoleGameStateSchema = z.object({}).describe(`WatcherInformationGameState`);


// export const PerfectInformationGameEventSchema = z.object({}).describe(`PerfectInformationGameEvent`);
// export const PlayerRolePerspectiveGameEventSchema = z.object({}).describe(`PlayerRolePerspectiveGameEvent`);
// export const WatcherRolePerspectiveGameEventSchema = z.object({}).describe(`WatcherRolePerspectiveGameEvent`);


// export const GameActionBaseSchema = z.object({
//   source: GameActionSourceSchema,
//   action: z.object({}).describe(`GameAction`),
// }).describe(`GameActionBase`);

// export const OtherSourcedGameActionSchema = GameActionBaseSchema.extend({
//   source: z.literal('other'),
// }).describe(`OtherSourcedGameAction`);
// export const OtherSourcedGameActionOutcomeSchema = z.object({}).describe(`OtherSourcedGameActionOutcome`);

// export const HostSourcedGameActionSchema = GameActionBaseSchema.extend({
//   source: z.literal('host'),
// }).describe(`HostSourcedGameAction`);
// export const HostSourcedGameActionOutcomeSchema = z.object({}).describe(`HostSourcedGameActionOutcome`);

// export const PlayerSourcedGameActionSchema = GameActionBaseSchema.extend({
//   source: z.literal('player'),
// }).describe(`PlayerSourcedGameAction`);
// export const PlayerSourcedGameActionOutcomeSchema = z.object({}).describe(`PlayerSourcedGameActionOutcome`);

// export const GameActionSchema = z.discriminatedUnion('source', [
//   OtherSourcedGameActionSchema,
//   HostSourcedGameActionSchema,
//   PlayerSourcedGameActionSchema,
// ]).describe(`GameAction`);



const GameActionBaseSchema = z.object({
  source: GameActionSourceSchema,
  actionType: z.string(),
  actionData: z.object({}).describe(`GameAction`),
}).describe(`GameActionBase`);

// const GameActionTypeAndDataSchema = z.object({
//   actionType: z.string(),
//   actionData: z.object({}).describe(`GameActionData`).optional(),
// }).describe(`GameActionTypeAndData`);



export const PerfectInformationGameActionOutcomeSchema = z.object({}).describe(`PerfectInformationGameActionOutcome`);

export const PerfectInformationGameEventSchema = z.object({
  gameAction: GameActionBaseSchema,
  actionOutcome: PerfectInformationGameActionOutcomeSchema,
  nextGameState: PerfectInformationGameStateSchema,
}).describe(`PerfectInformationGameActionOutcome`);


export const PerfectInformationPerspectiveGameStepSchema = z.object({
  role: UserGameRoleForHostSchema,
  gameEventSummary: PerfectInformationGameEventSummaryStrToolbox.schema,
  nextGameState: PerfectInformationGameStateSchema.loose(),
}).describe(`PerfectInformationRolePerspectiveForGameEvent`);
export type PerfectInformationPerspectiveGameStep = z.infer<typeof PerfectInformationPerspectiveGameStepSchema>;

export const PlayerInformationPerspectiveGameStepSchema = z.object({
  role: UserGameRoleForPlayerSchema,
  gameEventSummary: PlayerInformationGameEventSummaryStrToolbox.schema,
  nextGameState: PlayerRoleGameStateSchema.loose(),
}).describe(`PlayerRolePerspectiveForGameEvent`);
export type PlayerInformationPerspectiveGameStep = z.infer<typeof PlayerInformationPerspectiveGameStepSchema>;

export const WatcherInformationPerspectiveGameStepSchema = z.object({
  role: UserGameRoleForWatcherSchema,
  gameEventSummary: WatcherInformationGameEventSummaryStrToolbox.schema,
  nextGameState: WatcherRoleGameStateSchema.loose(),
}).describe(`WatcherRolePerspectiveForGameEvent`);
export type WatcherInformationPerspectiveGameStep = z.infer<typeof WatcherInformationPerspectiveGameStepSchema>;

export const RoleBasedPerspectiveForGameStepSchema = z.discriminatedUnion('role', [
  PerfectInformationPerspectiveGameStepSchema,
  PlayerInformationPerspectiveGameStepSchema,
  WatcherInformationPerspectiveGameStepSchema,
]).describe(`RoleBasedPerspectiveGameEventSummary`);

export type RoleBasedPerspectiveGameEventSummary = z.infer<typeof RoleBasedPerspectiveForGameStepSchema>;

// export const xxx = z.ZodSchema<RoleBasedPerspectiveGameEventSummary>().describe(`xxx`);



export interface IRoleBasedGamePerspectiveSchemas <
  PerfectInformationPerspectiveGameStateSchema extends z.ZodType,
  PerfectInformationGameStepSummarySchema extends z.ZodType,

  PlayerInformationPerspectiveGameStateSchema extends z.ZodType,
  PlayerInformationGameStepSummarySchema extends z.ZodType,

  WatcherInformationPerspectiveGameStateSchema extends z.ZodType,
  WatcherInformationGameStepSummarySchema extends z.ZodType
> {
  perfectInformationPerspectiveGameStateSchema: PerfectInformationPerspectiveGameStateSchema;
  perfectInformationGameStepSummarySchema: PerfectInformationGameStepSummarySchema;

  playerInformationPerspectiveGameStateSchema: PlayerInformationPerspectiveGameStateSchema;
  playerInformationGameStepSummarySchema: PlayerInformationGameStepSummarySchema;

  watcherInformationPerspectiveGameStateSchema: WatcherInformationPerspectiveGameStateSchema;
  watcherInformationGameStepSummarySchema: WatcherInformationGameStepSummarySchema;
}


// const createRoleBasedPerspectiveForGameStepSchemas = (
//   perfectInformationPerspectiveGameStepSchema: z.ZodType,
//   perfectInformationGameEventSummarySchema: z.ZodType,

//   playerInformationPerspectiveGameStepSchema: z.ZodType,
//   playerInformationGameEventSummarySchema: z.ZodType,

//   watcherInformationPerspectiveGameStepSchema: z.ZodType,
//   watcherInformationGameEventSummarySchema: z.ZodType,
// ) => {
// //   const perfectInformationRoleBasedPerspectiveForGameStepSchema = PerfectInformationGameStateSchema.extend({
// //   role: z.literal('host'),
// // });
// };



const OtherSourcedGameActionSchema = GameActionBaseSchema.extend({
  source: z.literal('other'),
  actionType: z.string().readonly(),
  actionData: z.object({}).loose().nullable(),
}).describe(`OtherSourcedGameAction`);
// export const OtherSourcedGameActionOutcomeSchema = z.object({}).describe(`OtherSourcedGameActionOutcome`);

const HostSourcedGameActionSchema = GameActionBaseSchema.extend({
  source: z.literal('host'),
  actionType: z.string(),
  actionData: z.object({}).loose().nullable(),
}).describe(`HostSourcedGameAction`);
export const HostSourcedGameActionOutcomeSchema = z.object({}).describe(`HostSourcedGameActionOutcome`);

const PlayerSourcedGameActionSchema = GameActionBaseSchema.extend({
  source: z.literal('player'),
  playerSeat: GameTableSeatSchema,
  actionType: z.string(),
  actionData: z.object({}).loose().nullable(),
}).describe(`PlayerSourcedGameAction`);
// export const PlayerSourcedGameActionOutcomeSchema = z.object({}).describe(`PlayerSourcedGameActionOutcome`);

const GameActionSchema = z.discriminatedUnion('source', [
  OtherSourcedGameActionSchema,
  HostSourcedGameActionSchema,
  PlayerSourcedGameActionSchema,
]).describe(`GameAction`);
export type GameAction = z.infer<typeof GameActionSchema>;


type HostSourcedGameActionWithData<
  GameActionType extends string,
  GameActionDataSchema extends z.ZodType,
> = {
  source: 'host';
  actionType: GameActionType;
  actionData: z.infer<GameActionDataSchema>;
};

const createHostSourcedGameStepActionSchema = <
  // GameStepActionSource extends GameActionSource,
  GameActionType extends string,
  GameActionDataSchema extends z.ZodType,
  // GameActionOutcomeSchema extends z.ZodType,
  
  PerfectInformationGameStateSchema extends z.ZodType,
  // PlayerRoleGameStateSchema extends z.ZodType,
  // WatcherRoleGameStateSchema extends z.ZodType,

  PerfectInformationPerspectiveGameStepSchema extends z.ZodType,
  PlayerInformationPerspectiveGameStepSchema extends z.ZodType,
  WatcherInformationPerspectiveGameStepSchema extends z.ZodType,
>(
  gameActionType: GameActionType,
  gameActionDataSchema: GameActionDataSchema,
  gameActionOutcomeSchema: PerfectInformationPerspectiveGameStepSchema,

  createOutcome: (
    // actionType: GameActionType,
    // gameActionData: z.infer<GameActionDataSchema>
    gameAction: HostSourcedGameActionWithData<GameActionType, GameActionDataSchema>,
  ) => z.infer<PerfectInformationPerspectiveGameStepSchema>,

  createNextGameState: (
    gameAction: HostSourcedGameActionWithData<GameActionType, GameActionDataSchema>,
    actionOutcome: z.infer<PerfectInformationPerspectiveGameStepSchema>,
    currentGameState: z.infer<PerfectInformationGameStateSchema>,
  ) => z.infer<PerfectInformationGameStateSchema>,

  adaptToPlayerRolePerspectiveGameStep: (
    playerSeat: GameTableSeat,
    gameAction: HostSourcedGameActionWithData<GameActionType, GameActionDataSchema>,
    nextGameState: z.infer<PerfectInformationGameStateSchema>,
  ) => z.infer<PlayerInformationPerspectiveGameStepSchema>,

  adaptToWatcherRolePerspectiveGameStep: (
    gameAction: HostSourcedGameActionWithData<GameActionType, GameActionDataSchema>,
    nextGameState: z.infer<PerfectInformationGameStateSchema>,
  ) => z.infer<WatcherInformationPerspectiveGameStepSchema>,
) => {

  const hostSourcedGameActionSchema = GameActionBaseSchema.extend({
    source: z.literal('host'),
    actionType: z.literal(gameActionType),
    actionData: gameActionDataSchema,
    actionOutcome: gameActionOutcomeSchema,
  }).describe(`HostSourcedGameAction`);

  return hostSourcedGameActionSchema;
}
export type HostSourcedGameStepActionSchema = ReturnType<typeof createHostSourcedGameStepActionSchema>;



type GameActionHandler = <T extends typeof GameActionSchema>(gameAction: T) => {
  gameActionSchema: T;
  handle: (gameAction: T) => Promise<PerfectInformationPerspectiveGameStep>;
  createPlayerRolePerspectiveGameStep: (gameAction: T) => PlayerInformationPerspectiveGameStep;
  createWatcherRolePerspectiveGameStep: (gameAction: T) => WatcherInformationPerspectiveGameStep;
}

// const createHostSourcedGameActionHandler = <
//   // GameActionType extends string,
//   GameActionDataSchema extends z.ZodType,
//   PerfectInformationPerspectiveGameStepSchema extends z.ZodType,
//   PlayerRolePerspectiveGameStepSchema extends z.ZodType,
//   WatcherRolePerspectiveGameStepSchema extends z.ZodType,
// >(
//   gameActionType: string,
//   gameActionDataSchema: GameActionDataSchema,
//   handle: (gameAction: z.infer<typeof HostSourcedGameActionSchema<GameActionDataSchema>>) => PerfectInformationPerspectiveGameStepSchema,
//   createPlayerRolePerspectiveGameStep: (gameAction: z.infer<typeof HostSourcedGameActionSchema<GameActionDataSchema>>) => PlayerRolePerspectiveGameStepSchema,
//   createWatcherRolePerspectiveGameStep: (gameAction: z.infer<typeof HostSourcedGameActionSchema<GameActionDataSchema>>) => WatcherRolePerspectiveGameStepSchema,
// ) => {

//   const gameActionSchema = HostSourcedGameActionSchema.extend({
//     actionType: z.literal(gameActionType),
//     actionData: gameActionDataSchema,
//   });

//   return {
//     gameActionSchema,
//     handle: (gameAction: z.infer<typeof gameActionSchema>) => Promise.resolve(createPlayerRolePerspectiveGameStep(gameAction)),
//     createPlayerRolePerspectiveGameStep: (gameAction: z.infer<typeof gameActionSchema>) => createPlayerRolePerspectiveGameStep(gameAction),
//     createWatcherRolePerspectiveGameStep: (gameAction: z.infer<typeof gameActionSchema>) => createWatcherRolePerspectiveGameStep(gameAction),
//   };
// };

// export const WatcherPerspectiveForGameEventOutcomeSchema = z.object({}).describe(`WatcherPerspectiveForGameEventOutcome`);


// export const PerfectInformationRoleEventSchemaBase = z.object({
//   infoRole: z.literal('host'),
//   gameAction: GameActionSchema,
//   actionOutcome: PerfectInformationGameActionOutcomeSchema,
//   nextGameState: PerfectInformationGameStateSchema,
// }).describe(`InfoRoleEventSchemaBase`);

// export const InfoRoleEventSchemaBase = z.object({
//   infoRole: 
// }).describe(`PerfectInformationRoleEvent`);



// export const createRoleBasedPerspectiveGameEventOutcomeSchema = <
//   EventSourceSchema extends z.ZodType<typeof GameActionSourceSchema>,
//   EventOutcomeSchema extends z.ZodType,
//   RoleSchema extends z.ZodType<z.infer<typeof GameActionSourceSchema>>,
// >(
//   eventSourceSchema: EventSourceSchema,
//   eventOutcomeSchema: EventOutcomeSchema,
//   roleSchema: RoleSchema,
// ) => {
//   return z.object({
//     eventSource: eventSourceSchema,
//     eventOutcome: eventOutcomeSchema,
//     role: roleSchema,
//   }).describe(`RoleBasedPerspectiveGameEventOutcome`);
// };


export interface IBfgEngineMetadataSchemas <
  HostGameStateSchema extends z.ZodType,
  PlayerGameStatePerspectiveSchema extends z.ZodType,
  WatcherGameStatePerspectiveSchema extends z.ZodType,
  
  HostSourcedGameEventSchema extends z.ZodType,
  HostSourcedGameEventOutcomeSchema extends z.ZodType,
  
  PlayerSourcedGameEventSchema extends z.ZodType,
  PlayerSourcedGameEventOutcomeSchema extends z.ZodType,

  PlayerPerspectiveForGameEventOutcomeSchema extends z.ZodType,
  WatcherPerspectiveForGameEventOutcomeSchema extends z.ZodType,
> {
  hostGameStateSchema: HostGameStateSchema;
  playerGameStatePerspectiveSchema: PlayerGameStatePerspectiveSchema;
  watcherGameStatePerspectiveSchema: WatcherGameStatePerspectiveSchema;
  
  hostSourcedGameEventSchema: HostSourcedGameEventSchema;
  hostSourcedGameEventOutcomeSchema: HostSourcedGameEventOutcomeSchema;
  
  playerSourcedGameEventSchema: PlayerSourcedGameEventSchema;
  playerSourcedGameEventOutcomeSchema: PlayerSourcedGameEventOutcomeSchema;
  
  playerPerspectiveForGameEventOutcomeSchema: PlayerPerspectiveForGameEventOutcomeSchema;
  watcherPerspectiveForGameEventOutcomeSchema: WatcherPerspectiveForGameEventOutcomeSchema;
}


export interface ICompleteBfgEngineMetadataSchemas <
  HostGameStateSchema extends z.ZodType,
  PlayerGameStatePerspectiveSchema extends z.ZodType,
  WatcherGameStatePerspectiveSchema extends z.ZodType,

  HostSourcedGameEventSchema extends z.ZodType,
  HostSourcedGameEventOutcomeSchema extends z.ZodType,
  
  PlayerSourcedGameEventSchema extends z.ZodType,
  PlayerSourcedGameEventOutcomeSchema extends z.ZodType,
  
  PlayerPerspectiveForGameEventOutcomeSchema extends z.ZodType,
  WatcherPerspectiveForGameEventOutcomeSchema extends z.ZodType,

  UserGameRoomDataForPlayerSchema extends z.ZodType,
  UserGameRoomDataForWatcherSchema extends z.ZodType,
> {
  hostGameStateSchema: HostGameStateSchema;
  playerGameStatePerspectiveSchema: PlayerGameStatePerspectiveSchema;
  watcherGameStatePerspectiveSchema: WatcherGameStatePerspectiveSchema;

  hostSourcedGameEventSchema: HostSourcedGameEventSchema;
  hostSourcedGameEventOutcomeSchema: HostSourcedGameEventOutcomeSchema;

  playerSourcedGameEventSchema: PlayerSourcedGameEventSchema;
  playerSourcedGameEventOutcomeSchema: PlayerSourcedGameEventOutcomeSchema;

  playerPerspectiveForGameEventOutcomeSchema: PlayerPerspectiveForGameEventOutcomeSchema;
  watcherPerspectiveForGameEventOutcomeSchema: WatcherPerspectiveForGameEventOutcomeSchema;

  userGameRoomDataForPlayerSchema: UserGameRoomDataForPlayerSchema;
  userGameRoomDataForWatcherSchema: UserGameRoomDataForWatcherSchema;
}


export const createCompleteBfgEngineMetadataSchemas = <
  HostGameStateSchema extends z.ZodType,
  PlayerGameStatePerspectiveSchema extends z.ZodType,
  WatcherGameStatePerspectiveSchema extends z.ZodType,

  HostSourcedGameEventSchema extends z.ZodType,
  HostSourcedGameEventOutcomeSchema extends z.ZodType,
  
  PlayerSourcedGameEventSchema extends z.ZodType,
  PlayerSourcedGameEventOutcomeSchema extends z.ZodType,
  
  PlayerPerspectiveForGameEventOutcomeSchema extends z.ZodType,
  WatcherPerspectiveForGameEventOutcomeSchema extends z.ZodType,
>({
  schemas,
}: {
  schemas: IBfgEngineMetadataSchemas<
    HostGameStateSchema,
    PlayerGameStatePerspectiveSchema,
    WatcherGameStatePerspectiveSchema,

    HostSourcedGameEventSchema,
    HostSourcedGameEventOutcomeSchema,

    PlayerSourcedGameEventSchema,
    PlayerSourcedGameEventOutcomeSchema,

    PlayerPerspectiveForGameEventOutcomeSchema,
    WatcherPerspectiveForGameEventOutcomeSchema
  >;
// })
// : ICompleteBfgEngineMetadataSchemas<HostGameStateSchema, PlayerGamePerspectiveSchema, WatcherGamePerspectiveSchema, GameEventSchema, HostGameEventOutcomeSchema, PlayerGameEventPerspectiveSchema, WatcherGameEventPerspectiveSchema> 
}) => {
  
  const userGameRoomDataForPlayerSchema = createUserGameRoomDataForPlayerSchema(
    schemas.playerPerspectiveForGameEventOutcomeSchema, schemas.playerGameStatePerspectiveSchema);
  
  const userGameRoomDataForWatcherSchema = createUserGameRoomDataForWatcherSchema(
    schemas.watcherPerspectiveForGameEventOutcomeSchema, schemas.watcherGameStatePerspectiveSchema);

  const userGameRoomDataForPerspectiveSchema = createUserGameRoomDataForPerspectiveSchema(
    userGameRoomDataForPlayerSchema,
    userGameRoomDataForWatcherSchema
  );

  const hostSourcedGameEventSchema = z.object({
    source: z.literal('host'),
    action: schemas.hostSourcedGameEventSchema,
    outcome: schemas.hostSourcedGameEventOutcomeSchema,
  }).describe(`HostSourcedGameEventSchema`);

  const playerSourcedGameEventSchema = z.object({
    source: z.literal('player'),
    action: schemas.playerSourcedGameEventSchema,
    outcome: schemas.playerSourcedGameEventOutcomeSchema,
  }).describe(`PlayerSourcedGameEventSchema`);

  const gameStepSchema = z.discriminatedUnion('source', [
    hostSourcedGameEventSchema,
    playerSourcedGameEventSchema,
  ]).describe(`GameStep`);

  const gameTableEventSchema = z.object({
    createdAt: BfgTimestampSchema,
    stepIndex: BfgGameStepIndexSchema,
    source: GameTableActionSourceSchema,
    eventType: GameTableEventTypeSchema,
  
    event: gameStepSchema,
    nextBoardState: schemas.hostGameStateSchema,
  }).describe(`BfgGameTableEvent`);

  return {
    ...schemas,

    gameStepSchema,
    gameTableEventSchema,
    
    userGameRoomDataForPlayerSchema,
    userGameRoomDataForWatcherSchema,
    userGameRoomDataForPerspectiveSchema,
  };
};

export type BfgGenericEngineMetadataSchemas = ReturnType<typeof createCompleteBfgEngineMetadataSchemas>;

export type GameTableEventForDb = z.infer<ReturnType<typeof createCompleteBfgEngineMetadataSchemas>['gameTableEventSchema']>;
export type BfgGameStep = z.infer<ReturnType<typeof createCompleteBfgEngineMetadataSchemas>['gameStepSchema']>;


// Type constraint that matches the structure of BfgGenericEngineMetadataSchemas
// This includes all the base schemas plus the user game room data schemas and game step schema
export type BfgCompleteEngineMetadataSchemasConstraint = {
  hostGameStateSchema: z.ZodType;
  playerGameStatePerspectiveSchema: z.ZodType;
  watcherGameStatePerspectiveSchema: z.ZodType;

  hostSourcedGameEventSchema: z.ZodType;
  hostSourcedGameEventOutcomeSchema: z.ZodType;

  playerSourcedGameEventSchema: z.ZodType;
  playerSourcedGameEventOutcomeSchema: z.ZodType;

  playerPerspectiveForGameEventOutcomeSchema: z.ZodType;
  watcherPerspectiveForGameEventOutcomeSchema: z.ZodType;
  
  gameStepSchema: z.ZodType;
  gameTableEventSchema: z.ZodType;
  
  userGameRoomDataForPlayerSchema: z.ZodType;
  userGameRoomDataForWatcherSchema: z.ZodType;
  userGameRoomDataForPerspectiveSchema: z.ZodType;
};


export interface BfgGameEngineMetadata<BfgGameSchemas extends BfgCompleteEngineMetadataSchemasConstraint = BfgGenericEngineMetadataSchemas> {
  metadataType: BfgGameMetadataType;
  gameTitle: BfgSupportedGameTitle;
  definition: GameDefinition;

  schemas: BfgGameSchemas;
  components: BfgGameEngineComponents<
    BfgGameSchemas['watcherGameStatePerspectiveSchema'],
    BfgGameSchemas['playerGameStatePerspectiveSchema'],
    BfgGameSchemas['hostGameStateSchema'],
    BfgGameSchemas['watcherPerspectiveForGameEventOutcomeSchema'],
    BfgGameSchemas['playerPerspectiveForGameEventOutcomeSchema']
  >;

  gameProcessor: IBfgGameProcessor<
    BfgGameSchemas['hostGameStateSchema'],
    BfgGameSchemas['hostSourcedGameEventSchema'],
    BfgGameSchemas['playerSourcedGameEventSchema'],
    BfgGameSchemas['hostSourcedGameEventOutcomeSchema'],
    BfgGameSchemas['playerPerspectiveForGameEventOutcomeSchema']
  >;
  gameStatePerspectiveAdapters: BfgGameStatePerspectiveAdapters;
  gameEventOutcomePerspectiveAdapters: BfgGameEventOutcomePerspectiveAdapters;
}
