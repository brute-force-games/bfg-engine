import { z } from "zod";
import { BfgGameTableIdToolbox } from "../types/bfg-branded-uuids";
import { AllAssignedBfgGameStateForPlayersSchema, AssignedBfgGameStateForPlayerSchema, BfgGameStateForHostSchema, BfgGameStateForWatcherSchema } from "../../game-metadata/metadata-types/game-state-types";
import { BfgGameActionOutcomeSchema, BfgGameActionSchema } from "../../game-metadata/metadata-types/game-action-types";




export const GameTableEventForHostP2pSchema = z.object({
  gameTableId: BfgGameTableIdToolbox.idSchema,
  createdAt: z.number(),
  stepIndex: z.number(),

  event: BfgGameActionSchema,
  outcome: BfgGameActionOutcomeSchema,

  nextGameHostState: BfgGameStateForHostSchema,
  nextGamePlayerStates: AllAssignedBfgGameStateForPlayersSchema,
  nextGameWatcherState: BfgGameStateForWatcherSchema
});

export type GameTableEventForHostP2p = z.infer<typeof GameTableEventForHostP2pSchema>;


// export type GameTableEventWithTransitionForHost = {
//   gameRoomId: BfgGameRoomId,
//   gameTableId: BfgGameTableId,
//   stepIndex: number,
//   hostTransitionData: GameTableEventWithTransition,
// }



export const GameTableEventForPlayerP2pSchema = GameTableEventForHostP2pSchema.omit({
  nextGameHostState: true,
  nextGamePlayerStates: true,
}).extend({
  nextGamePlayerState: AssignedBfgGameStateForPlayerSchema,
});

export type GameTableEventForPlayerP2p = z.infer<typeof GameTableEventForPlayerP2pSchema>;



export const GameTableEventForWatcherP2pSchema = GameTableEventForHostP2pSchema.omit({
  nextGameHostState: true,
  nextGamePlayerStates: true,
});

export type GameTableEventForWatcherP2p = z.infer<typeof GameTableEventForWatcherP2pSchema>;


export type GameTableEventWithTransitionForWatcherP2p = GameTableEventForWatcherP2p;




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
