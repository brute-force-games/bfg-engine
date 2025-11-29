import z from "zod";
// import { PlayerProfileId, PublicPlayerProfile } from "@bfg-engine/index";
// import { GameTable, GameTableSeat } from "../game-table/game-table";
// import { DbGameTableAction } from "../game-table/game-table-action";
// import { BfgGameActionByHostSchema, BfgGameActionByPlayerSchema, type BfgGameActionByHost, type BfgGameActionByPlayer } from "../../game-metadata/metadata-types/game-action-types";


// export const BfgHostGameImplStateSchema = z.object({});
// export type BfgHostGameImplState = z.infer<typeof BfgHostGameImplStateSchema>;

// export const BfgPublicGameImplStateSchema = z.object({});
// export type BfgPublicGameImplState = z.infer<typeof BfgPublicGameImplStateSchema>;

// export const BfgPrivatePlayerKnowledgeImplStateSchema = z.object({});
// export type BfgPrivatePlayerKnowledgeImplState = z.infer<typeof BfgPrivatePlayerKnowledgeImplStateSchema>;


// export const BfgPrivateActionSchema = z.object({});
// export type BfgPrivateAction = z.infer<typeof BfgPrivateActionSchema>;


// export const BfgGameActionSchema = z.object({
//   source: z.enum(['player', 'host']),
//   actionType: z.string(),
// })


// export const BfgGameImplPlayerActionSchema = BfgGameActionSchema.extend({
//   source: z.literal('player'),
//   playerActionType: z.string(),
// });

// export type BfgGameImplPlayerAction = z.infer<typeof BfgGameImplPlayerActionSchema>;  


export const BfgGameImplHostActionSchema = z.object({
  source: z.literal('host'),
  hostActionType: z.enum([
    'game-table-action-host-initialize-game',
    'game-table-action-host-update-configuration',
    'game-table-action-host-starts-game',
  ]),
});

export type BfgGameImplHostAction = z.infer<typeof BfgGameImplHostActionSchema>;


// export const BfgGameActionSchema = z.discriminatedUnion('source', [
//   BfgGameActionByPlayerSchema,
//   BfgGameActionByHostSchema,
// ]);

// export type BfgGameAction = z.infer<typeof BfgGameActionSchema>;


export const BfgGameImplPublicHistoryActionSchema = z.object({});
export type BfgGameImplPublicHistoryAction = z.infer<typeof BfgGameImplPublicHistoryActionSchema>;


// export type GameAccessRole = 'observer-role' | 'host-role' | 'player-role';
export type ViewLevel = 'observer-level' | 'host-level' | 'player-level';


// export interface ObserverComponentProps<GIS extends BfgPublicGameImplState> {
//   gameTable: GameTable;
//   allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;

//   gameState: GIS
//   hostPlayerProfileId: PlayerProfileId
  
//   observedPlayerProfileId: PlayerProfileId | null
//   observedPlayerSeat: GameTableSeat | null

//   latestGameAction: DbGameTableAction | null
// }


// export interface PlayerComponentProps<
//   GIS extends BfgPublicGameImplState,
//   GA extends BfgGameActionByPlayer,
//   PPK extends BfgPrivatePlayerKnowledgeImplState | null,  
// > {
//   gameTable: GameTable;
//   allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;

//   gameState: GIS
//   myPrivatePlayerKnowledge: PPK | null
//   hostPlayerProfileId: PlayerProfileId

//   currentPlayerProfileId: PlayerProfileId
//   currentPlayerSeat: GameTableSeat

//   latestGameAction: DbGameTableAction | null
//   onPlayerAction: (playerAction: GA) => void
// }


// export interface GameHostComponentProps<
//   GIS extends BfgHostGameImplState,
//   GHA extends BfgGameActionByHost
// > {
//   gameTable: GameTable;
//   allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;

//   gameState: GIS
//   hostPlayerProfileId: PlayerProfileId

//   actingAsPlayerProfileId: PlayerProfileId | null
//   actingAsPlayerSeat: GameTableSeat | null

//   latestGameAction: DbGameTableAction | null
//   onHostAction: (hostAction: GHA) => void
// }

// export interface GameHistoryComponentProps {
//   gameActions: BfgGameImplPublicHistoryAction[];
// }

// export interface GameSpineComponentProps<GIS extends BfgPublicGameImplState> {
//   gameTable: GameTable;
//   allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
//   orientation: 'horizontal' | 'vertical';

//   gameState: GIS
// }


// export type BfgGameEngineComponents<
//   HGS extends BfgHostGameImplState,
//   PGS extends BfgPublicGameImplState,
//   GPA extends BfgGameActionByPlayer,
//   GHA extends BfgGameActionByHost,
//   PPK extends BfgPrivatePlayerKnowledgeImplState | null,
// > = {

//   ObserverComponent: (props: ObserverComponentProps<PGS>) => React.ReactNode;
//   PlayerComponent: (props: PlayerComponentProps<PGS, GPA, PPK>) => React.ReactNode;
//   HostComponent: (props: GameHostComponentProps<HGS, GHA>) => React.ReactNode;
//   HistoryComponent?: (props: GameHistoryComponentProps) => React.ReactNode;
//   GameSpineComponent?: (props: GameSpineComponentProps<PGS>) => React.ReactNode;
// }


// export type BfgAllPublicKnowledgeGameEngineComponents<
//   PGS extends BfgPublicGameImplState,
//   GPA extends BfgGameImplPlayerAction,
//   GHA extends BfgGameImplHostAction,
// > = BfgGameEngineComponents<PGS, PGS, GPA, GHA, null>;