import { z } from "zod";
import { BfgGameTableActionId, BfgGameTableId } from "../types/bfg-branded-ids";
import { BfgEncodedStringSchema } from "../game-engine/encoders";


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


// export const GameTableActionTypeSchema = z.enum([
//   'game-table-action-host-starts-setup',
//   'game-table-action-host-setup-board',
//   'game-table-action-host-starts-game',
//   'game-table-action-host-event',

//   'game-table-action-player-action',
//   'game-table-action-host-action',
  
//   'game-table-action-host-declares-winner',
//   'game-table-action-host-declares-draw',
//   'game-table-action-host-eliminates-player',
//   'game-table-action-host-cancels-game',
// ]);

// export type GameTableActionType = z.infer<typeof GameTableActionTypeSchema>;

export const GameTableActionTypeSchema = z.enum([
  ...HostActionTypes,
  ...PlayerActionTypes,
] as const);


export type BfgGameSpecificTableAction<GA> = {
  gameTableActionId: z.infer<typeof BfgGameTableActionId.idSchema>,
  source: z.infer<typeof GameTableActionSourceSchema>,
  actionType: z.infer<typeof GameTableActionTypeSchema>,

  gameSpecificAction: GA;
}


export const BfgGameSpecificGameStateSchema = z.object({
  // gameTableActionId: BfgGameTableActionId.idSchema,
  // source: GameTableActionSourceSchema,
  // actionType: GameTableActionTypeSchema,
  // gameSpecificAction: z.any(),
})
// .brand('game-specific-game-state');

export type BfgGameSpecificGameState = z.infer<typeof BfgGameSpecificGameStateSchema>;


export const BfgGameSpecificActionSchema = z.object({
  // gameTableActionId: BfgGameTableActionId.idSchema,
  // source: GameTableActionSourceSchema,
  // actionType: GameTableActionTypeSchema,
  // gameSpecificAction: z.any(),
})
// .brand('game-specific-action');

export type BfgGameSpecificAction = z.infer<typeof BfgGameSpecificActionSchema>;


// export const BfgDataCustomRepresentationSchema = z.object({
//   repr: z.literal('custom'),
//   data: z.string(),
// });

// export const BfgDataJsonStringRepresentationSchema = z.object({
//   repr: z.literal('json-str'),
//   data: z.string(),
// });

// export const BfgDataJsonObjectRepresentationSchema = z.object({
//   repr: z.literal('json-obj'),
//   data: z.object({}),
// });

// export const BfgDataJsonZodRepresentationSchema = z.object({
//   repr: z.literal('json-zod'),
//   data: z.object({}),
// });

// export const BfgDataEncodingSchema = z.discriminatedUnion('repr', [
//   BfgDataCustomRepresentationSchema,
//   BfgDataJsonStringRepresentationSchema,
//   BfgDataJsonObjectRepresentationSchema,
//   BfgDataJsonZodRepresentationSchema,
// ]);

// export type BfgDataEncoding = z.infer<typeof BfgDataEncodingSchema>;


export const DbGameTableActionSchema = z.object({
  createdAt: z.number(),

  source: GameTableActionSourceSchema,
  actionType: GameTableActionTypeSchema,
  
  actionStr: BfgEncodedStringSchema,  // encoded complete action information that isn't necessarily public to every player
  nextGameStateStr: BfgEncodedStringSchema,  // encoded next game state information that is private to the host
  
  gameTableId: BfgGameTableId.idSchema,
});

export type DbGameTableAction = z.infer<typeof DbGameTableActionSchema>;


// export const createDbGameTableActionSchema = () => {

// }



export const validateAsHostDbGameTableAction = (action: DbGameTableAction): void => {
  if (action.source !== 'game-table-action-source-host') {
    throw new Error('Invalid source for host action: ' + action.source);
  }

  if (!HostActionTypes.includes(action.actionType as any)) {
    throw new Error('Invalid action type for host action: ' + action.actionType);
  }
};


export const validateAsPlayerDbGameTableAction = (action: DbGameTableAction): void => {
  if (!PlayerActionSources.includes(action.source as any)) {
    throw new Error('Invalid source for player action: ' + action.source);
  }

  if (!PlayerActionTypes.includes(action.actionType as any)) {
    throw new Error('Invalid action type for player action: ' + action.actionType);
  }
};