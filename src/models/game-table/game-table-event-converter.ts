import type { z } from "zod";
import type { BfgGameEngineMetadata } from "../../game-metadata/metadata-types";
import type { GameTableEventForWatcherP2p, GameTableEventForHostP2p } from "../p2p/game-table-event-p2p";
import type { GameTableEventWithTransition } from "./game-table-event";
import { createGameTableEventWithTransitionSchema, GameTableActionSource, GameTableEventTypeSchema } from "./game-table-event";

type GameTableEventType = z.infer<typeof GameTableEventTypeSchema>;

// Maps BfgGameAction source to GameTableActionSource and GameTableEventType
const mapActionSourceToDbFormat = (action: { source: 'host' | 'player'; playerSeat?: string }): { source: GameTableActionSource; eventType: GameTableEventType } => {
  if (action.source === 'host') {
    return {
      source: 'game-table-action-source-host',
      eventType: 'game-table-action-host-event',
    };
  } else if (action.source === 'player' && action.playerSeat) {
    // Map player seat to source (e.g., 'p1' -> 'game-table-action-source-player-p1')
    const seatNumber = action.playerSeat.replace('p', '');
    return {
      source: `game-table-action-source-player-p${seatNumber}` as GameTableActionSource,
      eventType: 'game-table-action-player-action',
    };
  } else {
    // Fallback (should not happen)
    return {
      source: 'game-table-action-source-host',
      eventType: 'game-table-action-host-event',
    };
  }
};

/**
 * Converts a watcher P2P event to a DB board event format.
 * This is useful for displaying watcher events in components that expect GameTableEventWithTransition.
 * 
 * Note: This conversion uses watcher state as host state, which may be lossy since watcher state
 * is a subset of host state. For a complete conversion back to host state, use the access level adapters.
 */
export const convertWatcherEventToBoardEvent = (
  watcherEvent: GameTableEventForWatcherP2p,
  gameMetadata: BfgGameEngineMetadata
): GameTableEventWithTransition => {
  const { event, outcome, nextGameWatcherState, stepIndex, createdAt } = watcherEvent;
  
  const { source, eventType } = mapActionSourceToDbFormat(event);
  
  // Create transition - using watcher state as host state (they're related types)
  // The transition schema expects host state, but watcher state is derived from it
  // We cast watcher state to host state type since they share the same structure
  // Note: This is potentially lossy - watcher state is a subset of host state
  const transition = {
    event: event,
    change: outcome,
    nextBoardState: nextGameWatcherState as unknown as z.infer<typeof gameMetadata.schemas.hostGameStateSchema>,
  };
  
  // Create GameTableEventWithTransition using the gameMetadata schemas
  const GameTableEventWithTransitionSchema = createGameTableEventWithTransitionSchema(gameMetadata.schemas);
  const boardEvent = {
    stepIndex,
    source,
    eventType,
    createdAt,
    transitionForHost: transition,
  };
  
  return GameTableEventWithTransitionSchema.parse(boardEvent);
};

// /**
//  * Converts a player P2P event to a DB board event format.
//  * This is useful for displaying player events in components that expect GameTableEventWithTransition.
//  * 
//  * Note: This conversion uses watcher state as host state, which may be lossy since watcher state
//  * is a subset of host state. For a complete conversion back to host state, use the access level adapters.
//  */
// export const convertPlayerEventToBoardEvent = (
//   playerEvent: GameTableEventForPlayerP2p,
//   gameMetadata: BfgGameEngineMetadata
// ): GameTableEventWithTransition => {
//   const { event, outcome, stepIndex, createdAt } = playerEvent;
  
//   const { source, eventType } = mapActionSourceToDbFormat(event);
  
//   // Create transition - using watcher state as host state (they're related types)
//   // The transition schema expects host state, but watcher state is derived from it
//   // We cast watcher state to host state type since they share the same structure
//   // Note: This is potentially lossy - watcher state is a subset of host state
//   const transition = {
//     event: event,
//     change: outcome,
//     nextBoardState: nextGameWatcherState as unknown as z.infer<typeof gameMetadata.schemas.hostGameStateSchema>,
//   };
  
//   // Create GameTableEventWithTransition using the gameMetadata schemas
//   const GameTableEventWithTransitionSchema = createGameTableEventWithTransitionSchema(gameMetadata.schemas);
//   const boardEvent = {
//     stepIndex,
//     source,
//     eventType,
//     createdAt,
//     transitionForHost: transition,
//   };
  
//   return GameTableEventWithTransitionSchema.parse(boardEvent);
// };

/**
 * Converts a host P2P event to a DB board event format.
 * This is useful for displaying host events in components that expect GameTableEventWithTransition.
 * 
 * Note: This conversion preserves full host state information, so it's not lossy.
 */
export const convertHostEventToBoardEvent = (
  hostEvent: GameTableEventForHostP2p,
  gameMetadata: BfgGameEngineMetadata
): GameTableEventWithTransition => {
  const { event, outcome, nextGameHostState, stepIndex, createdAt } = hostEvent;
  
  const { source, eventType } = mapActionSourceToDbFormat(event);
  
  // Create transition - host state is the complete state, so this conversion is not lossy
  const transition = {
    event: event,
    change: outcome,
    nextBoardState: nextGameHostState as unknown as z.infer<typeof gameMetadata.schemas.hostGameStateSchema>,
  };
  
  // Create GameTableEventWithTransition using the gameMetadata schemas
  const GameTableEventWithTransitionSchema = createGameTableEventWithTransitionSchema(gameMetadata.schemas);
  const boardEvent = {
    stepIndex,
    source,
    eventType,
    createdAt,
    transitionForHost: transition,
  };
  
  return GameTableEventWithTransitionSchema.parse(boardEvent);
};

