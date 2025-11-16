import { GameRoomDb, GameTableSeat } from "../game-table/game-room-p2p";
import { PlayerProfileId } from "../types/bfg-branded-uuids";
import type { GameTableEventWithTransition } from "../game-table/game-table-event";
import type { BfgGameStateForHost } from "../../game-metadata/metadata-types/game-state-types";
import type { BfgGameActionByHost, BfgGameEvent } from "../../game-metadata/metadata-types/game-action-types";

// // Branded types for JSON strings based on their schema
// declare const GameStateJsonBrand: unique symbol;
// declare const GameActionJsonBrand: unique symbol;

// export type GameStateJson<GS extends z.ZodTypeAny> = string & { 
//   [GameStateJsonBrand]: z.infer<GS> 
// };

// export type GameActionJson<GA extends z.ZodTypeAny> = string & { 
//   [GameActionJsonBrand]: z.infer<GA> 
// };


// export interface GameStateRepresentationProps<
//   GS extends z.ZodTypeAny,
//   GA extends z.ZodTypeAny,
// > {
//   hostPlayerProfileId: PlayerProfileId;
//   myPlayerProfileId: PlayerProfileId | null;
//   myPlayerSeat: GameTableSeat | null;
//   viewLevel: ViewLevel;
//   gameState: z.infer<GS>;
//   mostRecentAction: z.infer<GA>;
// }

// export interface GameStateActionInputProps<GS extends z.ZodTypeAny, GA extends z.ZodTypeAny> {
//   myPlayerSeat: GameTableSeat;
//   gameState: z.infer<GS>;
//   mostRecentAction: z.infer<GA>;
//   onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void;
// }

// export interface GameStateCombinationRepresentationAndInputProps<GS extends z.ZodTypeAny, GA extends z.ZodTypeAny> {
//   hostPlayerProfileId: PlayerProfileId;
//   myPlayerProfileId: PlayerProfileId | null;
//   myPlayerSeat: GameTableSeat;
//   gameState: z.infer<GS>;
//   mostRecentAction: z.infer<GA>;
//   onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void;
// }

export interface GameHistoryComponentProps<GSH extends BfgGameStateForHost> {
  playerSeat: GameTableSeat;
  gameState: GSH;
  gameActions: GameTableEventWithTransition[];
}

export interface GameStateHostComponentProps<
  GSH extends BfgGameStateForHost,
  GEv extends BfgGameEvent,
  GAH extends BfgGameActionByHost,
> {
  hostPlayerProfileId: PlayerProfileId;
  myPlayerProfileId: PlayerProfileId | null;
  myPlayerSeat: GameTableSeat | null;
  gameTable: GameRoomDb;
  gameState: GSH;
  mostRecentAction: GEv;
  onGameAction: (gameTable: GameRoomDb, gameState: GSH, gameAction: GEv) => void;
  onHostAction: (gameTable: GameRoomDb, gameState: GSH, hostAction: GAH) => void;
}


// export type BfgGameEngineProcessor<
//   GS extends z.ZodTypeAny, 
//   GA extends z.ZodTypeAny
// > = {
  
//   createBfgGameSpecificInitialGameTableAction: (
//     gameTable: GameTable
//   ) => BfgGameSpecificTableAction<z.infer<GA>>;  // Ensure this is inferred from Zod schema

//   createBfgInitialGameSpecificState: (
//     initialGameTableAction: BfgGameSpecificTableAction<z.infer<GA>>
//   ) => z.infer<GS>;  // Ensure this is inferred from Zod schema

//   createGameSpecificGameStateJson: (
//     gameState: z.infer<GS>
//   ) => GameStateJson<GS>;

//   parseGameSpecificGameStateJson: (
//     jsonString: GameStateJson<GS>
//   ) => z.infer<GS>;

//   createGameSpecificActionJson: (
//     gameAction: z.infer<GA>
//   ) => GameActionJson<GA>;
  
//   parseGameSpecificActionJson: (
//     jsonString: GameActionJson<GA>
//   ) => z.infer<GA>;

//   applyGameAction: (
//     tableState: GameTable,
//     gameState: z.infer<GS>,
//     gameAction: z.infer<GA>
//   ) => GameTableActionResult<z.infer<GS>>;

//   gameStateJsonSchema: GS;
//   gameActionJsonSchema: GA;
// }


// export type BfgGameEngineMetadata<
//   GS extends z.ZodTypeAny,
//   GA extends z.ZodTypeAny
// > = {
//   definition: GameDefinition;
//   processor: BfgGameEngineProcessor<GS, GA>;
// }
