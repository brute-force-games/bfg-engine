import { z } from "zod";
// import type { BfgGameStepIndex, BfgTimestamp } from "../types/bfg-versions";
import type { BfgGameEngineMetadata } from "../../game-metadata/metadata-types";

// Generic types for P2P game table events that preserve schema type information from game metadata
// These types reference the game metadata schemas directly for full type safety

// Helper type to extract schemas from game metadata
type GameMetadataSchemas = BfgGameEngineMetadata['schemas'];

// Watcher event type based on game metadata's watcher event perspective schema
export type GameTableEventForWatcherP2p<
  WatcherGameEventPerspectiveSchema extends z.ZodType = GameMetadataSchemas['watcherPerspectiveForGameEventOutcomeSchema']
> = {
  stepIndex: number;
  createdAt: number;
} & z.infer<WatcherGameEventPerspectiveSchema>;

// // Host event type based on game metadata's host schemas
// export type GameTableEventForHostP2p<
//   HostGameEventSchema extends z.ZodType = GameMetadataSchemas['hostGameEventSchema'],
//   HostGameEventOutcomeSchema extends z.ZodType = GameMetadataSchemas['hostGameEventOutcomeSchema'],
//   HostGameStateSchema extends z.ZodType = GameMetadataSchemas['hostGameStateSchema']
// > = {
//   stepIndex: BfgGameStepIndex;
//   createdAt: BfgTimestamp;
//   event: z.infer<HostGameEventSchema>;
//   outcome: z.infer<HostGameEventOutcomeSchema>;
//   nextGameHostState: z.infer<HostGameStateSchema>;
// };

// Player event type based on game metadata's player event perspective schema
export type GameTableEventForPlayerP2p<
  PlayerGameEventPerspectiveSchema extends z.ZodType = GameMetadataSchemas['playerPerspectiveForGameEventOutcomeSchema']
> = {
  stepIndex: number;
  createdAt: number;
} & z.infer<PlayerGameEventPerspectiveSchema>;

// Alias for consistency
export type GameTableEventWithTransitionForWatcherP2p<
  WatcherGameEventPerspectiveSchema extends z.ZodType = GameMetadataSchemas['watcherPerspectiveForGameEventOutcomeSchema']
> = GameTableEventForWatcherP2p<WatcherGameEventPerspectiveSchema>;





// export const GameTableEventForHostP2pSchema = z.object({
//   // gameTableId: BfgGameTableIdToolbox.idSchema,
//   createdAt: z.number(),
//   stepIndex: z.number(),

//   event: BfgGameEventSchema,
//   outcome: BfgGameActionOutcomeSchema,
//   nextGameHostState: BfgGameStateForHostSchema,
// }).describe("GameTableEventForHostP2p");

// export type GameTableEventForHostP2p = z.infer<typeof GameTableEventForHostP2pSchema>;


// export type GameTableEventWithTransitionForHost = {
//   gameRoomId: BfgGameRoomId,
//   gameTableId: BfgGameTableId,
//   stepIndex: number,
//   hostTransitionData: GameTableEventWithTransition,
// }



// export const GameTableEventForPlayerP2pSchema = GameTableEventForHostP2pSchema.omit({
//   nextGameHostState: true,
//   nextGamePlayerStates: true,
// }).extend({
//   nextGamePlayerState: AssignedBfgGameStateForPlayerSchema,
// }).describe("GameTableEventForPlayerP2p");

// export type GameTableEventForPlayerP2p = z.infer<typeof GameTableEventForPlayerP2pSchema>;



// export const GameTableEventForWatcherP2pSchema = GameTableEventForHostP2pSchema.omit({
//   nextGameHostState: true,
//   nextGamePlayerStates: true,
// }).extend({
//   nextGameWatcherState: BfgGameStateForWatcherSchema,
// }).describe("GameTableEventForWatcherP2p");

// export type GameTableEventForWatcherP2p = z.infer<typeof GameTableEventForWatcherP2pSchema>;


// export type GameTableEventWithTransitionForWatcherP2p = GameTableEventForWatcherP2p;




// export type GameTableEventForPlayerP2pSchema



// export const GameTableStepHostP2pSchema = z.object({
//   gameTableId: BfgGameTableIdToolbox.idSchema,
//   createdAt: z.number(),
//   stepIndex: z.number(),

//   event: BfgGameActionSchema,
//   outcome: BfgGameActionOutcomeSchema,
//   nextGameHostState: BfgGameStateForHostSchema,
//   // nextGamePlayerStates: BfgGameStateForPlayerSchema,
//   nextGameWatcherState: BfgGameStateForWatcherSchema
// });

// export type GameTableStepHostP2p = z.infer<typeof GameTableStepHostP2pSchema>;
