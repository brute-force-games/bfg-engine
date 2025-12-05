import { z } from "zod";
import { createUserGameRoomDataForPlayerSchema, createUserGameRoomDataForWatcherSchema, createUserGameRoomDataForPerspectiveSchema } from "../../hooks/p2p/game/user-game-room-data";
import { BfgGameStepIndexSchema, BfgTimestampSchema } from "../../models/types/bfg-versions";
import { GameTableActionSourceSchema, GameTableEventTypeSchema } from "../../models/game-table/game-table-event";
import { GameTableSeatSchema, type GameTableSeat } from "../../models/internal/game-room-base";
import { PerfectInformationGameEventSummaryStrToolbox, PlayerInformationGameEventSummaryStrToolbox, WatcherInformationGameEventSummaryStrToolbox, type BfgGameActionTypeStr } from "../../models/types/bfg-branded-string-types";
import type { IBfgGameMetadataSchemas } from "./new-bfg-metadata";


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



export const GameActionSourceTypeSchema = z.enum(['other', 'host', 'player'] as const).describe(`GameActionSource`);
export type GameActionSourceType = z.infer<typeof GameActionSourceTypeSchema>;


export const SourceGameRoleBaseSchema = z.object({
  source: GameActionSourceTypeSchema,
});
export type SourceGameRoleBase = z.infer<typeof SourceGameRoleBaseSchema>;

export const SourceGameRoleForHostSchema = SourceGameRoleBaseSchema.extend({
  source: z.literal('host'),
});
export type SourceGameRoleForHost = z.infer<typeof SourceGameRoleForHostSchema>;

export const SourceGameRoleForPlayerSchema = SourceGameRoleBaseSchema.extend({
  source: z.literal('player'),
  playerSeat: GameTableSeatSchema,
});
export type SourceGameRoleForPlayer = z.infer<typeof SourceGameRoleForPlayerSchema>;


export const SourceGameRoleForOtherSchema = SourceGameRoleBaseSchema.extend({
  source: z.literal('other'),
  otherDescription: z.string().readonly(),
});
export type SourceGameRoleForOther = z.infer<typeof SourceGameRoleForOtherSchema>;


// export const SourceGameRoleSchema = z.discriminatedUnion('sourceType', [
//   SourceGameRoleForHostSchema,
//   SourceGameRoleForPlayerSchema,
//   SourceGameRoleForOtherSchema,
// ]);
// export type SourceGameRole = z.infer<typeof SourceGameRoleSchema>;

export const SourceGameRoleSchema = 
  SourceGameRoleForHostSchema
  .or(SourceGameRoleForPlayerSchema)
  .or(SourceGameRoleForOtherSchema);

export type SourceGameRole = z.infer<typeof SourceGameRoleSchema>;


export const GameActionSourceSchema = z.discriminatedUnion('sourceType', [
  SourceGameRoleForOtherSchema,
  SourceGameRoleForHostSchema,
  SourceGameRoleForPlayerSchema,
]);
export type GameActionSource = z.infer<typeof GameActionSourceSchema>;


export const PerfectInformationGameStateSchema = z.object({}).describe(`PerfectInformationGameState`);
export const PlayerRoleGameStateSchema = z.object({}).describe(`PlayerInformationGameState`);
export const WatcherRoleGameStateSchema = z.object({}).describe(`WatcherInformationGameState`);


const GameActionBaseSchema = z.object({
  source: GameActionSourceSchema,
  actionType: z.string(),
  actionData: z.object({}).describe(`GameAction`),
}).describe(`GameActionBase`);
export type GameActionBase = z.infer<typeof GameActionBaseSchema>;





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



export const OtherSourcedGameActionSchema = GameActionBaseSchema.extend({
  source: z.literal('other'),
  otherDescription: z.string().readonly(),
  actionType: z.string().readonly(),
  actionData: z.object({}).loose().nullable(),
}).describe(`OtherSourcedGameAction`);
// export const OtherSourcedGameActionOutcomeSchema = z.object({}).describe(`OtherSourcedGameActionOutcome`);

export const HostSourcedGameActionSchema = GameActionBaseSchema.extend({
  source: z.literal('host'),
  actionType: z.string().readonly(),
  actionData: z.object({}).loose().nullable(),
}).describe(`HostSourcedGameAction`);
export const HostSourcedGameActionOutcomeSchema = z.object({}).describe(`HostSourcedGameActionOutcome`);

export const PlayerSourcedGameActionSchema = GameActionBaseSchema.extend({
  source: z.literal('player'),
  playerSeat: GameTableSeatSchema,
  actionType: z.string().readonly(),
  actionData: z.object({}).loose().nullable(),
}).describe(`PlayerSourcedGameAction`);
// export const PlayerSourcedGameActionOutcomeSchema = z.object({}).describe(`PlayerSourcedGameActionOutcome`);

export const SourcedGameActionSchema = z.discriminatedUnion('source', [
  OtherSourcedGameActionSchema,
  HostSourcedGameActionSchema,
  PlayerSourcedGameActionSchema,
]).describe(`GameAction`);
export type SourcedGameAction = z.infer<typeof SourcedGameActionSchema>;


export type GameActionWithData<
  Source extends SourceGameRole,
  GameActionType extends BfgGameActionTypeStr,
  GameActionDataSchema extends z.ZodType,
> = {
  // source: Source;
  actionType: GameActionType;
  actionData: z.infer<GameActionDataSchema>;
} & Source;


export type HostSourcedGameActionWithData<
  GameActionType extends BfgGameActionTypeStr,
  GameActionDataSchema extends z.ZodType,
> = {
  source: 'host';
  actionType: GameActionType;
  actionData: z.infer<GameActionDataSchema>;
};


interface IGameStepResultSchemas <
  ActionWithDataSchema extends z.ZodType,
  ActionOutcomeSchema extends z.ZodType,
> {
  actionWithDataSchema: ActionWithDataSchema;
  actionOutcomeSchema: ActionOutcomeSchema;
  // playerInformationGameStateSchema: PlayerInformationGameStateSchema;
  // watcherInformationGameStateSchema: WatcherInformationGameStateSchema;
}


export type GameStepResult<
  ActionSource extends SourceGameRole,
  GameActionType extends BfgGameActionTypeStr,
  GameActionDataSchema extends z.ZodType<any>,
  ActionOutcomeSchema extends z.ZodType<any>,
  PerfectInformationGameStateSchema extends z.ZodType<any>,
>  = {
  schemas: IGameStepResultSchemas<GameActionDataSchema, ActionOutcomeSchema>,
  action: GameActionWithData<
    // ActionSource,
    // GameActionType,
    SourceGameRole,
    BfgGameActionTypeStr,
    GameActionDataSchema>,
  actionOutcome: z.infer<ActionOutcomeSchema>,
  nextGameState: z.infer<PerfectInformationGameStateSchema>,
  gameTableEvent: z.infer<typeof GameTableEventTypeSchema>;
  nextToActPlayers: GameTableSeat[],
}


export type FullGameStep<
  GameActionType extends BfgGameActionTypeStr,
  GameActionDataSchema extends z.ZodType,
  PerfectInformationPerspectiveGameStepSchema extends z.ZodType,
  PerfectInformationGameStateSchema extends z.ZodType,
>  = {
  gameAction: GameActionWithData<SourceGameRole, GameActionType, GameActionDataSchema>,
  actionOutcome: z.infer<PerfectInformationPerspectiveGameStepSchema>,
  nextGameState: z.infer<PerfectInformationGameStateSchema>,
}


export interface  IMyGameActionDefinition <
  // ActionSource extends SourceGameRole,
  // ActionType extends string,
  // ActionSchema extends z.ZodType<SourcedGameAction>,
  ActionDataSchema extends z.ZodType<any>,
  ActionOutcomeSchema extends z.ZodType<any>,
  BfgGameSchemas extends IBfgGameMetadataSchemas,
> {
  actionSource: SourceGameRole;
  actionType: BfgGameActionTypeStr;

  // gameActionSchema: typeof SourcedGameActionSchema;
  actionDataSchema: ActionDataSchema;
  actionOutcomeSchema: ActionOutcomeSchema;
  gameSchemas: BfgGameSchemas;
  // actionSchema: {
  //   actionType: string;
  //   actionData: z.infer<ActionDataSchema>;
  // } & SourceGameRole;

  processThisGameAction: (gameAction: z.infer<typeof SourcedGameActionSchema>) => 
    Promise<GameStepResult<
      SourceGameRole,
      BfgGameActionTypeStr,
      ActionDataSchema,
      ActionOutcomeSchema,
      BfgGameSchemas['perfectInformationGameStateSchema']
    >>;

  adaptForPlayerPerspective: (
    playerSeat: GameTableSeat,
    gameAction: SourcedGameAction,
    result: GameStepResult<
      SourceGameRole,
      BfgGameActionTypeStr,
      ActionDataSchema,
      ActionOutcomeSchema,
      BfgGameSchemas['perfectInformationGameStateSchema']
    >,
    nextGameState: z.infer<BfgGameSchemas['perfectInformationGameStateSchema']>,
  ) => z.infer<BfgGameSchemas['playerPerspectiveGameStateSchema']>;

  adaptForWatcherPerspective: (
    gameAction: SourcedGameAction,
    result: GameStepResult<
      SourceGameRole,
      BfgGameActionTypeStr,
      ActionDataSchema,
      ActionOutcomeSchema,
      BfgGameSchemas['perfectInformationGameStateSchema']
    >,
    nextGameState: z.infer<BfgGameSchemas['perfectInformationGameStateSchema']>,
  ) => z.infer<BfgGameSchemas['watcherPerspectiveGameStateSchema']>;
}



export const createBfgGameActionDefinition = <
  ActionSource extends SourceGameRole,
  ActionType extends BfgGameActionTypeStr,
  // ActionSchema extends z.ZodType<SourcedGameAction>,
  ActionDataSchema extends z.ZodType<any>,
  ActionOutcomeSchema extends z.ZodType<any>,
  BfgGameSchemas extends IBfgGameMetadataSchemas,
>({
  actionSource,
  actionType,

  // gameActionSchema,
  actionDataSchema,
  actionOutcomeSchema,
  gameSchemas,
  
  processThisGameAction,
  adaptForPlayerPerspective,
  adaptForWatcherPerspective,
}: IMyGameActionDefinition<ActionDataSchema, ActionOutcomeSchema, BfgGameSchemas>): _GameActionDefinitionReturn<ActionSource, ActionType, ActionDataSchema, ActionOutcomeSchema, BfgGameSchemas> => {

  // Construct the schema based on the action source
  const baseSchema = actionSource.source === 'host' 
    ? HostSourcedGameActionSchema
    : actionSource.source === 'player'
    ? PlayerSourcedGameActionSchema
    : OtherSourcedGameActionSchema;
  
  const actionSchema = baseSchema.extend({
    actionType: z.literal(actionType as ActionType),
    actionData: actionDataSchema,
  }) as unknown as z.ZodType<{
    actionType: ActionType;
    actionData: z.infer<ActionDataSchema>;
  } & ActionSource>;
  
  type ActionSchema = z.infer<typeof actionSchema>;

  const bfgProcessThisGameAction = async (gameAction: SourcedGameAction) => {
    const validatedGameAction = actionSchema.parse(gameAction) as ActionSchema;

    const result = await processThisGameAction(validatedGameAction);
    return result;
  };

  const bfgAdaptForPlayerPerspective = (
    playerSeat: GameTableSeat,
    gameAction: SourcedGameAction,
    result: GameStepResult<
      SourceGameRole,
      BfgGameActionTypeStr,
      ActionDataSchema,
      ActionOutcomeSchema,
      BfgGameSchemas['perfectInformationGameStateSchema']
    >,
    nextGameState: z.infer<BfgGameSchemas['perfectInformationGameStateSchema']>,
  ) => {
    const validatedGameAction = actionSchema.parse(gameAction) as ActionSchema;
    return adaptForPlayerPerspective(playerSeat, validatedGameAction, result, nextGameState);
  };

  const bfgAdaptForWatcherPerspective = (
    gameAction: SourcedGameAction,
    result: GameStepResult<
      SourceGameRole,
      BfgGameActionTypeStr,
      ActionDataSchema,
      ActionOutcomeSchema,
      BfgGameSchemas['perfectInformationGameStateSchema']
    >,
    nextGameState: z.infer<BfgGameSchemas['perfectInformationGameStateSchema']>,
  ) => {
    const validatedGameAction = actionSchema.parse(gameAction) as ActionSchema;
    return adaptForWatcherPerspective(validatedGameAction, result, nextGameState);
  };

  const retVal: _GameActionDefinitionReturn<ActionSource, ActionType, ActionDataSchema, ActionOutcomeSchema, BfgGameSchemas> = {
    actionSource: actionSource as ActionSource,
    actionType: actionType as ActionType,
    
    actionSchema,
    actionDataSchema,
    actionOutcomeSchema,
    gameSchemas,
    
    bfgProcessThisGameAction,
    bfgAdaptForPlayerPerspective,
    bfgAdaptForWatcherPerspective,
  };

  return retVal;
};

type _GameActionDefinitionReturn<
  ActionSource extends SourceGameRole,
  ActionType extends BfgGameActionTypeStr,
  ActionDataSchema extends z.ZodType<any>,
  ActionOutcomeSchema extends z.ZodType<any>,
  BfgGameSchemas extends IBfgGameMetadataSchemas,
> = {
  actionSource: ActionSource;
  actionType: ActionType;
  actionDataSchema: ActionDataSchema;
  actionSchema: z.ZodType<{
    actionType: ActionType;
    actionData: z.infer<ActionDataSchema>;
  } & ActionSource>;
  actionOutcomeSchema: ActionOutcomeSchema;
  gameSchemas: BfgGameSchemas;

  bfgProcessThisGameAction: (gameAction: SourcedGameAction) => Promise<GameStepResult<
    SourceGameRole,
    BfgGameActionTypeStr,
    ActionDataSchema,
    ActionOutcomeSchema,
    BfgGameSchemas['perfectInformationGameStateSchema']
  >>;

  bfgAdaptForPlayerPerspective: (
    playerSeat: GameTableSeat,
    gameAction: SourcedGameAction,
    result: GameStepResult<
      SourceGameRole,
      BfgGameActionTypeStr,
      ActionDataSchema,
      ActionOutcomeSchema,
      BfgGameSchemas['perfectInformationGameStateSchema']
    >,
    nextGameState: z.infer<BfgGameSchemas['perfectInformationGameStateSchema']>,
  ) => z.infer<BfgGameSchemas['playerPerspectiveGameStateSchema']>;

  bfgAdaptForWatcherPerspective: (
    gameAction: SourcedGameAction,
    result: GameStepResult<
      SourceGameRole,
      BfgGameActionTypeStr,
      ActionDataSchema,
      ActionOutcomeSchema,
      BfgGameSchemas['perfectInformationGameStateSchema']
    >,
    nextGameState: z.infer<BfgGameSchemas['perfectInformationGameStateSchema']>,
  ) => z.infer<BfgGameSchemas['watcherPerspectiveGameStateSchema']>;

};

// GameActionDefinition represents the return type of createBfgGameActionDefinition
// We use a helper type instead of ReturnType<typeof createBfgGameActionDefinition>
// because ReturnType doesn't preserve generic type parameters
export type GameActionDefinition<
  ActionSource extends SourceGameRole = SourceGameRole,
  ActionType extends BfgGameActionTypeStr = BfgGameActionTypeStr,
  ActionDataSchema extends z.ZodType<any> = z.ZodType<any>,
  ActionOutcomeSchema extends z.ZodType<any> = z.ZodType<any>,
  BfgGameSchemas extends IBfgGameMetadataSchemas = IBfgGameMetadataSchemas,
> = _GameActionDefinitionReturn<ActionSource, ActionType, ActionDataSchema, ActionOutcomeSchema, BfgGameSchemas>;






// export const createHostSourcedGameStepActionProcessor = <
//   GameActionType extends string,
//   GameActionDataSchema extends z.ZodType,
  
//   PerfectInformationGameStateSchema extends z.ZodType,

//   PerfectInformationPerspectiveGameStepSchema extends z.ZodType,
//   PlayerInformationPerspectiveGameStepSchema extends z.ZodType,
//   WatcherInformationPerspectiveGameStepSchema extends z.ZodType,
// >(
//   gameActionType: GameActionType,
//   gameActionDataSchema: GameActionDataSchema,
//   gameActionOutcomeSchema: PerfectInformationPerspectiveGameStepSchema,

//   // processGameAction: (
//   //   gameAction: HostSourcedGameActionWithData<GameActionType, GameActionDataSchema>,
//   //   actionOutcome: z.infer<PerfectInformationPerspectiveGameStepSchema>,
//   //   currentGameState: z.infer<PerfectInformationGameStateSchema>,
//   // ) => z.infer<PerfectInformationGameStateSchema>,

//   processGameAction: (gameAction: z.infer<ActionSchema>) => 
//     Promise<GameStepResult<ActionOutcomeSchema, NextGameStateSchema>>,

//   adaptForPlayerPerspective: (
//     playerSeat: GameTableSeat,
//     gameAction: HostSourcedGameActionWithData<GameActionType, GameActionDataSchema>,
//     nextGameState: z.infer<PerfectInformationGameStateSchema>,
//   ) => z.infer<PlayerInformationPerspectiveGameStepSchema>,

//   adaptForWatcherPerspective: (
//     gameAction: HostSourcedGameActionWithData<GameActionType, GameActionDataSchema>,
//     nextGameState: z.infer<PerfectInformationGameStateSchema>,
//   ) => z.infer<WatcherInformationPerspectiveGameStepSchema>,

// ): IGameActionProcessor => {

//   const hostSourcedGameActionSchema = GameActionBaseSchema.extend({
//     source: z.literal('host'),
//     actionType: z.literal(gameActionType),
//     actionData: gameActionDataSchema,
//     actionOutcome: gameActionOutcomeSchema,
//   }).describe(`HostSourcedGameAction`);

//   const gameActionProcessor: IGameActionProcessor = {
//     gameActionSchema: hostSourcedGameActionSchema,
//     createActionOutcome: createActionOutcome,
//     createNextGameState: createNextGameState,
//     adaptForPlayerPerspective,
//     adaptForWatcherPerspective,
//     // handle: (gameAction: z.infer<typeof hostSourcedGameActionSchema>) => Promise.resolve(createPlayerRolePerspectiveGameStep(gameAction)),
//     // createPlayerRolePerspectiveGameStep: (gameAction: z.infer<typeof hostSourcedGameActionSchema>) => createPlayerRolePerspectiveGameStep(gameAction),
//     // createWatcherRolePerspectiveGameStep: (gameAction: z.infer<typeof hostSourcedGameActionSchema>) => createWatcherRolePerspectiveGameStep(gameAction),
//   };

//   return gameActionProcessor;
// }



// type GameActionHandler = <T extends typeof SourcedGameActionSchema>(gameAction: T) => {
//   gameActionSchema: T;
//   handle: (gameAction: T) => Promise<PerfectInformationPerspectiveGameStep>;
//   createPlayerRolePerspectiveGameStep: (gameAction: T) => PlayerInformationPerspectiveGameStep;
//   createWatcherRolePerspectiveGameStep: (gameAction: T) => WatcherInformationPerspectiveGameStep;
// }

// export const createHostSourcedGameActionHandler = <
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


// export interface BfgGameEngineMetadata<BfgGameSchemas extends BfgCompleteEngineMetadataSchemasConstraint = BfgGenericEngineMetadataSchemas> {
//   metadataType: BfgGameMetadataType;
//   gameTitle: BfgSupportedGameTitle;
//   definition: GameDefinition;

//   schemas: BfgGameSchemas;
//   components: BfgGameEngineComponents<
//     BfgGameSchemas['watcherGameStatePerspectiveSchema'],
//     BfgGameSchemas['playerGameStatePerspectiveSchema'],
//     BfgGameSchemas['hostGameStateSchema'],
//     BfgGameSchemas['watcherPerspectiveForGameEventOutcomeSchema'],
//     BfgGameSchemas['playerPerspectiveForGameEventOutcomeSchema']
//   >;

//   gameProcessor: IBfgGameProcessor<
//     BfgGameSchemas['hostGameStateSchema'],
//     BfgGameSchemas['hostSourcedGameEventSchema'],
//     BfgGameSchemas['playerSourcedGameEventSchema'],
//     BfgGameSchemas['hostSourcedGameEventOutcomeSchema'],
//     BfgGameSchemas['playerPerspectiveForGameEventOutcomeSchema']
//   >;
//   gameStatePerspectiveAdapters: BfgGameStatePerspectiveAdapters;
//   gameEventOutcomePerspectiveAdapters: BfgGameEventOutcomePerspectiveAdapters;
// }
