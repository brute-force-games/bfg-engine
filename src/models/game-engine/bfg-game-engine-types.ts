import z from "zod";
import { PlayerProfileId } from "~/index";
import { GameTableSeat } from "../game-table/game-table";
import { DbGameTableAction } from "../game-table/game-table-action";


export const BfgPrivateGameImplStateSchema = z.object({});
export type BfgPrivateGameImplState = z.infer<typeof BfgPrivateGameImplStateSchema>;

export const BfgPlayerGameImplStateSchema = z.object({});
export type BfgPlayerGameImplState = z.infer<typeof BfgPlayerGameImplStateSchema>;

export const BfgPublicGameImplStateSchema = z.object({});
export type BfgPublicGameImplState = z.infer<typeof BfgPublicGameImplStateSchema>;


export const BfgPrivateActionSchema = z.object({});
export type BfgPrivateAction = z.infer<typeof BfgPrivateActionSchema>;


export const BfgGameImplPlayerActionSchema = z.object({
  source: z.literal('player'),
  playerActionType: z.string(),
});

export type BfgGameImplPlayerAction = z.infer<typeof BfgGameImplPlayerActionSchema>;


export const BfgGameImplHostActionSchema = z.object({
  source: z.literal('host'),
  hostActionType: z.enum([
    'game-table-action-host-initialize-game',
    'game-table-action-host-update-configuration',
    'game-table-action-host-starts-game',
  ]),
});

export type BfgGameImplHostAction = z.infer<typeof BfgGameImplHostActionSchema>;


export const BfgGameImplActionSchema = z.discriminatedUnion('source', [
  BfgGameImplPlayerActionSchema,
  BfgGameImplHostActionSchema,
]);

export type BfgGameImplAction = z.infer<typeof BfgGameImplActionSchema>;


export const BfgGameImplPublicHistoryActionSchema = z.object({});
export type BfgGameImplPublicHistoryAction = z.infer<typeof BfgGameImplPublicHistoryActionSchema>;


export type GameAccessRole = 'observer-role' | 'host-role' | 'player-role';
export type ViewLevel = 'observer-level' | 'host-level' | 'player-level';


export interface ObserverComponentProps<GIS extends BfgPublicGameImplState> {
  gameState: GIS
  hostPlayerProfileId: PlayerProfileId
  
  observedPlayerProfileId: PlayerProfileId | null
  observedPlayerSeat: GameTableSeat | null

  latestGameAction: DbGameTableAction | null
}


export interface PlayerComponentProps<
  GIS extends BfgPlayerGameImplState,
  GA extends BfgGameImplPlayerAction
> {
  gameState: GIS
  hostPlayerProfileId: PlayerProfileId

  currentPlayerProfileId: PlayerProfileId
  currentPlayerSeat: GameTableSeat

  latestGameAction: DbGameTableAction | null
  onPlayerAction: (playerAction: GA) => void
}


export interface GameHostComponentProps<
  GIS extends BfgPrivateGameImplState,
  GHA extends BfgGameImplHostAction
> {
  gameState: GIS
  hostPlayerProfileId: PlayerProfileId

  actingAsPlayerProfileId: PlayerProfileId | null
  actingAsPlayerSeat: GameTableSeat | null

  latestGameAction: DbGameTableAction | null
  onHostAction: (hostAction: GHA) => void
}

export interface GameHistoryComponentProps {
  gameActions: BfgGameImplPublicHistoryAction[];
}


export type BfgAllPublicKnowledgeGameEngineComponents<
  GIS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction,
> = {

  ObserverComponent: (props: ObserverComponentProps<GIS>) => React.ReactNode;
  PlayerComponent: (props: PlayerComponentProps<GIS, GPA>) => React.ReactNode;
  HostComponent: (props: GameHostComponentProps<GIS, GHA>) => React.ReactNode;
  HistoryComponent?: (props: GameHistoryComponentProps) => React.ReactNode;
}
