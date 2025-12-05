import { GameRoomPersist } from "../tinybase/game-room-persist";
import { GameTableSeat } from "../internal/game-room-base";
import { PlayerProfileId } from "../types/bfg-branded-uuids";
// import type { GameTableEventForGameStep } from "../game-table/game-table-event";
import type { z } from "zod";

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

export interface GameHistoryComponentProps<HostGameStateSchema extends z.ZodType = z.ZodType> {
  playerSeat: GameTableSeat;
  gameState: z.infer<HostGameStateSchema>;
  gameActions: GameTableEventForGameStep[];
}

export interface GameStateHostComponentProps<
  HostGameStateSchema extends z.ZodType = z.ZodType,
  HostGameEventSchema extends z.ZodType = z.ZodType,
  HostGameActionSchema extends z.ZodType = z.ZodType,
> {
  hostPlayerProfileId: PlayerProfileId;
  myPlayerProfileId: PlayerProfileId | null;
  myPlayerSeat: GameTableSeat | null;
  gameTable: GameRoomPersist;
  gameState: z.infer<HostGameStateSchema>;
  mostRecentAction: z.infer<HostGameEventSchema>;
  onGameAction: (gameTable: GameRoomPersist, gameState: z.infer<HostGameStateSchema>, gameAction: z.infer<HostGameEventSchema>) => void;
  onHostAction: (gameTable: GameRoomPersist, gameState: z.infer<HostGameStateSchema>, hostAction: z.infer<HostGameActionSchema>) => void;
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
