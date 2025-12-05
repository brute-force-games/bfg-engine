import { z } from "zod";
import type { PlayerProfileId, PublicPlayerProfile } from "../..";
import type { BfgGameImplPublicHistoryAction } from "../../models/game-engine/bfg-game-engine-types";
import type { GameRoomP2p } from "../../models/p2p/game-room-p2p";
import type { GameTableSeat } from "../../models/internal/game-room-base";
import type { BfgGameActionByPlayer, BfgGameActionByHost } from "../metadata-types/game-action-types";
import type { GameTableEventForPlayerP2p, GameTableEventForWatcherP2p } from "../../models/p2p/game-table-event-p2p";
import type { BfgGameStep } from "../../models/types/bfg-versions";



export interface ObserverScreenComponentProps<
  WatcherGamePerspectiveSchema extends z.ZodType = z.ZodType,
  WatcherGameEventPerspectiveSchema extends z.ZodType = z.ZodType
> {
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;

  gameState: z.infer<WatcherGamePerspectiveSchema>
  hostPlayerProfileId: PlayerProfileId
  
  observedPlayerProfileId: PlayerProfileId | null
  observedPlayerSeat: GameTableSeat | null

  latestWatcherGameEvent: GameTableEventForWatcherP2p<WatcherGameEventPerspectiveSchema>
  watcherGameEvents: GameTableEventForWatcherP2p<WatcherGameEventPerspectiveSchema>[]
}


export interface PlayerScreenComponentProps<
  PlayerGamePerspectiveSchema extends z.ZodType = z.ZodType,
  PlayerGameEventPerspectiveSchema extends z.ZodType = z.ZodType
> {
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;

  gameState: z.infer<PlayerGamePerspectiveSchema>
  hostPlayerProfileId: PlayerProfileId

  currentPlayerProfileId: PlayerProfileId
  currentPlayerSeat: GameTableSeat

  latestPlayerGameEvent: GameTableEventForPlayerP2p<PlayerGameEventPerspectiveSchema>
  playerGameEvents: GameTableEventForPlayerP2p<PlayerGameEventPerspectiveSchema>[]
  
  onPlayerAction: <PGA extends BfgGameActionByPlayer>(playerAction: PGA) => void
}


export interface GameHostScreenComponentProps<
  HostGameStateSchema extends z.ZodType = z.ZodType
> {
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;

  gameState: z.infer<HostGameStateSchema>
  hostPlayerProfileId: PlayerProfileId

  actingAsPlayerProfileId: PlayerProfileId | null
  actingAsPlayerSeat: GameTableSeat | null

  latestHostGameEvent: BfgGameStep
  hostGameEvents: BfgGameStep[]
  
  onHostAction: <HGA extends BfgGameActionByHost>(hostAction: HGA) => void
}

export interface GameHistoryComponentProps {
  gameActions: BfgGameImplPublicHistoryAction[];
}

export interface GameSpineComponentProps<
  WatcherGamePerspectiveSchema extends z.ZodType = z.ZodType
> {
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  orientation: 'horizontal' | 'vertical';

  gameState: z.infer<WatcherGamePerspectiveSchema>
}


// export type BfgGameEngineComponents<
//   GSH extends GSHExt,
//   GSP extends GSPExt,
//   GSW extends GSWExt,
// > = {
//   ObserverComponent: (props: ObserverComponentProps<z.infer<GSW>>) => React.ReactNode;
//   PlayerComponent: (props: PlayerComponentProps<z.infer<GSP>, BfgGameActionByPlayer>) => React.ReactNode;
//   HostComponent: (props: GameHostComponentProps<z.infer<GSH>, BfgGameActionByHost>) => React.ReactNode;
//   HistoryComponent?: (props: GameHistoryComponentProps) => React.ReactNode;
//   GameSpineComponent?: (props: GameSpineComponentProps<z.infer<GSW>>) => React.ReactNode;
// }


// export const createBfgGameEngineComponents = <
//   GameStateAccessTypes extends BfgMetadataGameStateAccessTypes
// >(
//   // _metadataTypes: ICompleteTypesForGameMetadata & {
//   //   hostGameStateSchema: HostGameStateSchema;
//   //   playerGameStateSchema: PlayerGameStateSchema;
//   //   watcherGameStateSchema: WatcherGameStateSchema;
//   // },
//   // _gameActionHandlers: ReadonlyArray<unknown>,
//   gameStateAccessTypes: GameStateAccessTypes,
//   observerComponent: (props: ObserverComponentProps<z.infer< typeof gameStateAccessTypes.watcherGameStateSchema>>) => React.ReactNode,
//   playerComponent: (props: PlayerComponentProps<z.infer< typeof gameStateAccessTypes.playerGameStateSchema>, BfgGameActionByPlayer>) => React.ReactNode,
//   hostComponent: (props: GameHostComponentProps<z.infer< typeof gameStateAccessTypes.hostGameStateSchema>, BfgGameActionByHost>) => React.ReactNode,
//   historyComponent: (props: GameHistoryComponentProps) => React.ReactNode,
//   gameSpineComponent: (props: GameSpineComponentProps<z.infer<GameStateAccessTypes['watcherGameStateSchema']>>) => React.ReactNode,
// ) => {
//   // const { hostGameStateSchema, playerGameStateSchema, watcherGameStateSchema } = metadataTypes;

//   return {
//     ObserverComponent: observerComponent,
//     PlayerComponent: playerComponent,
//     HostComponent: hostComponent,
//     HistoryComponent: historyComponent,
//     GameSpineComponent: gameSpineComponent,
//   };
// }

// export type BfgGameEngineComponents = ReturnType<typeof createBfgGameEngineComponents>;


// export type PlayerSeatGameState<
//   GSP extends BfgGameStateForPlayer,
// > = {
//   playerSeat: GameTableSeat,
//   playerGameState: GSP,
// };

// export interface IBfgGameEngineAccessLevelConverters
// // <
// //   GSH extends BfgGameStateForHost,
// //   GSP extends BfgGameStateForPlayer,
// //   GSW extends BfgGameStateForWatcher,
// // >
// {
//   hostToPlayerSeatGameStates: <
//     GSH extends BfgGameStateForHost,
//     GSP extends BfgGameStateForPlayer,
//   >(gameRoom: GameRoomDb, hostState: GSH) => ReadonlyArray<PlayerSeatGameState<GSP>>;

//   hostToWatcherAccessLevel: <
//     GSH extends BfgGameStateForHost,
//     GSW extends BfgGameStateForWatcher,
//   >(hostState: GSH) => GSW;
// }


// export interface IBfgGameEngineComponents<
//   GSH extends BfgGameStateForHost,
//   GSP extends BfgGameStateForPlayer,
//   GSW extends BfgGameStateForWatcher,
//   // GPA extends BfgGameActionByPlayer,
//   // GAH extends BfgGameActionByHost,
// > {
//   ObserverComponent: (props: ObserverComponentProps<GSW>) => React.ReactNode;
//   PlayerComponent: (props: PlayerComponentProps<GSP>) => React.ReactNode;
//   HostComponent: (props: GameHostComponentProps<GSH>) => React.ReactNode;
//   HistoryComponent: (props: GameHistoryComponentProps) => React.ReactNode;
//   GameSpineComponent: (props: GameSpineComponentProps<GSW>) => React.ReactNode;
// }



export type BfgGameEngineComponents<
  WatcherGamePerspectiveSchema extends z.ZodType = z.ZodType,
  PlayerGamePerspectiveSchema extends z.ZodType = z.ZodType,
  HostGameStateSchema extends z.ZodType = z.ZodType,
  WatcherGameEventPerspectiveSchema extends z.ZodType = z.ZodType,
  PlayerGameEventPerspectiveSchema extends z.ZodType = z.ZodType
> = {
  ObserverScreenComponent: (props: ObserverScreenComponentProps<WatcherGamePerspectiveSchema, WatcherGameEventPerspectiveSchema>) => React.ReactNode;
  PlayerScreenComponent: (props: PlayerScreenComponentProps<PlayerGamePerspectiveSchema, PlayerGameEventPerspectiveSchema>) => React.ReactNode;
  HostScreenComponent: (props: GameHostScreenComponentProps<HostGameStateSchema>) => React.ReactNode;
  HistoryComponent?: (props: GameHistoryComponentProps) => React.ReactNode;
  GameSpineComponent: (props: GameSpineComponentProps<WatcherGamePerspectiveSchema>) => React.ReactNode;
}
