import { z } from "zod";
import { BfgGameTableActionId, BfgGameTableId } from "../types/bfg-branded-ids";



export const GameTableActionSourceSchema = z.enum([
  'game-table-action-source-host',

  'game-table-action-source-player-p1',
  'game-table-action-source-player-p2',
  'game-table-action-source-player-p3',
  'game-table-action-source-player-p4',
  'game-table-action-source-player-p5',
  'game-table-action-source-player-p6',
  'game-table-action-source-player-p7',
  'game-table-action-source-player-p8',  
]);

export type GameTableActionSource = z.infer<typeof GameTableActionSourceSchema>;


export const GameTableActionTypeSchema = z.enum([
  'game-table-action-host-starts-setup',
  'game-table-action-host-starts-game',
  'game-table-action-host-setup-board',
  'game-table-action-host-event',

  'game-table-action-player-move',
  
  'game-table-action-host-declares-winner',
  'game-table-action-host-declares-draw',
  'game-table-action-host-eliminates-player',
  'game-table-action-host-ends-game',
]);

export type GameTableActionType = z.infer<typeof GameTableActionTypeSchema>;


export const DbGameTableActionSchema = z.object({
  createdAt: z.number(),

  source: GameTableActionSourceSchema,
  actionType: GameTableActionTypeSchema,
  
  actionJson: z.string(),
  actionOutcomeGameStateJson: z.string(),
  
  gameTableId: BfgGameTableId.idSchema,
});

export type DbGameTableAction = z.infer<typeof DbGameTableActionSchema>;


export type BfgGameSpecificTableAction<TA> = {
  gameTableActionId: z.infer<typeof BfgGameTableActionId.idSchema>,
  source: z.infer<typeof GameTableActionSourceSchema>,
  actionType: z.infer<typeof GameTableActionTypeSchema>,

  gameSpecificAction: TA;
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
