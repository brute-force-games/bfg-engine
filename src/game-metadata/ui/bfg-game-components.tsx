import type { PlayerProfileId, PublicPlayerProfile } from "../..";
import type { BfgGameImplPublicHistoryAction } from "../../models/game-engine/bfg-game-engine-types";
import type { GameRoomDb, GameRoomP2p, GameTableSeat } from "../../models/game-table/game-room-p2p";
import { z } from "zod";
import type { BfgGameActionByPlayer, BfgGameActionByHost } from "../metadata-types/game-action-types";
import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../metadata-types/game-state-types";
import type { GameTableEventForHostP2p, GameTableEventForPlayerP2p, GameTableEventForWatcherP2p } from "../../models/game-table/game-table-event-p2p";



export interface ObserverComponentProps<GSW extends BfgGameStateForWatcher> {
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;

  gameState: z.infer<GSW>
  hostPlayerProfileId: PlayerProfileId
  
  observedPlayerProfileId: PlayerProfileId | null
  observedPlayerSeat: GameTableSeat | null

  latestWatcherGameEvent: GameTableEventForWatcherP2p
  watcherGameEvents: GameTableEventForWatcherP2p[]
}


export interface PlayerComponentProps<
  GSP extends BfgGameStateForPlayer,
  // GPA extends BfgGameActionByPlayer,
  // PPK extends BfgPrivatePlayerKnowledgeImplState | null = null,
> {
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;

  gameState: z.infer<GSP>
  // myPrivatePlayerKnowledge: PPK | null
  hostPlayerProfileId: PlayerProfileId

  currentPlayerProfileId: PlayerProfileId
  currentPlayerSeat: GameTableSeat

  latestPlayerGameEvent: GameTableEventForPlayerP2p
  playerGameEvents: GameTableEventForPlayerP2p[]
  
  onPlayerAction: <PGA extends BfgGameActionByPlayer>(playerAction: PGA) => void
}


export interface GameHostComponentProps<
  GSH extends BfgGameStateForHost,
  // GAH extends BfgGameActionByHost,
> {
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;

  gameState: GSH
  hostPlayerProfileId: PlayerProfileId

  actingAsPlayerProfileId: PlayerProfileId | null
  actingAsPlayerSeat: GameTableSeat | null

  latestHostGameEvent: GameTableEventForHostP2p
  hostGameEvents: GameTableEventForHostP2p[]
  
  onHostAction: <HGA extends BfgGameActionByHost>(hostAction: HGA) => void
}

export interface GameHistoryComponentProps {
  gameActions: BfgGameImplPublicHistoryAction[];
}

export interface GameSpineComponentProps<GSW extends BfgGameStateForWatcher> {
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  orientation: 'horizontal' | 'vertical';

  gameState: z.infer<GSW>
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


export type PlayerSeatGameState<
  GSP extends BfgGameStateForPlayer,
> = {
  playerSeat: GameTableSeat,
  playerGameState: GSP,
};

export interface IBfgGameEngineAccessLevelConverters<
  GSH extends BfgGameStateForHost,
  GSP extends BfgGameStateForPlayer,
  GSW extends BfgGameStateForWatcher,
> {
  hostToPlayerSeatGameStates: (gameTable: GameRoomDb, hostState: GSH) => ReadonlyArray<PlayerSeatGameState<GSP>>;
  hostToWatcherAccessLevel: (hostState: GSH) => GSW;
}


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



export type BfgGameEngineComponents = {
  ObserverComponent: <GSW extends BfgGameStateForWatcher>(props: ObserverComponentProps<GSW>) => React.ReactNode;
  PlayerComponent: <GSP extends BfgGameStateForPlayer>(props: PlayerComponentProps<GSP>) => React.ReactNode;
  HostComponent: <GSH extends BfgGameStateForHost>(props: GameHostComponentProps<GSH>) => React.ReactNode;
  HistoryComponent?: (props: GameHistoryComponentProps) => React.ReactNode;
  GameSpineComponent: <GSW extends BfgGameStateForWatcher>(props: GameSpineComponentProps<GSW>) => React.ReactNode;
}
