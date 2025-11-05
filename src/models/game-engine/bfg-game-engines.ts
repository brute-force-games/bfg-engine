import { z } from "zod";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { BfgGameSpecificTableAction } from "../../models/game-table/game-table-action";
import { GameTableActionResult } from "../../models/game-table/table-phase";
import { GameDefinition } from "../game-box-definition";
import { PlayerProfileId } from "../types/bfg-branded-ids";
import { ViewLevel } from "./bfg-game-engine-types";

// Branded types for JSON strings based on their schema
declare const GameStateJsonBrand: unique symbol;
declare const GameActionJsonBrand: unique symbol;

export type GameStateJson<GS extends z.ZodTypeAny> = string & { 
  [GameStateJsonBrand]: z.infer<GS> 
};

export type GameActionJson<GA extends z.ZodTypeAny> = string & { 
  [GameActionJsonBrand]: z.infer<GA> 
};


export interface GameStateRepresentationProps<GS extends z.ZodTypeAny, GA extends z.ZodTypeAny> {
  hostPlayerProfileId: PlayerProfileId;
  myPlayerProfileId: PlayerProfileId | null;
  myPlayerSeat: GameTableSeat | null;
  viewLevel: ViewLevel;
  gameState: z.infer<GS>;
  mostRecentAction: z.infer<GA>;
}

export interface GameStateActionInputProps<GS extends z.ZodTypeAny, GA extends z.ZodTypeAny> {
  myPlayerSeat: GameTableSeat;
  gameState: z.infer<GS>;
  mostRecentAction: z.infer<GA>;
  onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void;
}

export interface GameStateCombinationRepresentationAndInputProps<GS extends z.ZodTypeAny, GA extends z.ZodTypeAny> {
  hostPlayerProfileId: PlayerProfileId;
  myPlayerProfileId: PlayerProfileId | null;
  myPlayerSeat: GameTableSeat;
  gameState: z.infer<GS>;
  mostRecentAction: z.infer<GA>;
  onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void;
}

export interface GameHistoryComponentProps<GS extends z.ZodTypeAny, GA extends z.ZodTypeAny> {
  playerSeat: GameTableSeat;
  gameState: z.infer<GS>;
  gameActions: BfgGameSpecificTableAction<z.infer<GA>>[];
}

export interface GameStateHostComponentProps<GS extends z.ZodTypeAny, GA extends z.ZodTypeAny> {
  hostPlayerProfileId: PlayerProfileId;
  myPlayerProfileId: PlayerProfileId | null;
  myPlayerSeat: GameTableSeat | null;
  gameTable: GameTable;
  gameState: z.infer<GS>;
  mostRecentAction: z.infer<GA>;
  onGameAction: (gameTable: GameTable, gameState: z.infer<GS>, gameAction: z.infer<GA>) => void;
  onHostAction: (gameTable: GameTable, gameState: z.infer<GS>, hostAction: z.infer<GA>) => void;
}


// export type BfgGameEngineRendererFactory<
//   GS extends z.ZodTypeAny,
//   GA extends z.ZodTypeAny
// > = {
//   createGameStateRepresentationComponent: (
//     props: GameStateRepresentationProps<GS, GA>,
//     // gameState: z.infer<GS>,
//     // mostRecentAction: z.infer<GA>
//   ) => React.ReactNode;

//   createGameStateActionInputComponent: (
//     props: GameStateActionInputProps<GS, GA>,
//   ) => React.ReactNode;

//   createGameStateCombinationRepresentationAndInputComponent: (
//     props: GameStateCombinationRepresentationAndInputProps<GS, GA>,
//   ) => React.ReactNode | undefined,
  
//   createGameHistoryComponent?: (
//     props: GameHistoryComponentProps<GS, GA>,
//   ) => React.ReactNode;

//   createGameStateHostComponent: (
//     props: GameStateHostComponentProps<GS, GA>,
//   ) => React.ReactNode;
// }


export type BfgGameEngineProcessor<
  GS extends z.ZodTypeAny, 
  GA extends z.ZodTypeAny
> = {

  // rendererFactory: BfgGameEngineRendererFactory<GS, GA>;
  
  createBfgGameSpecificInitialGameTableAction: (
    gameTable: GameTable
  ) => BfgGameSpecificTableAction<z.infer<GA>>;  // Ensure this is inferred from Zod schema

  createBfgInitialGameSpecificState: (
    initialGameTableAction: BfgGameSpecificTableAction<z.infer<GA>>
  ) => z.infer<GS>;  // Ensure this is inferred from Zod schema

  createGameSpecificGameStateJson: (
    gameState: z.infer<GS>
  ) => GameStateJson<GS>;

  parseGameSpecificGameStateJson: (
    jsonString: GameStateJson<GS>
  ) => z.infer<GS>;

  createGameSpecificActionJson: (
    gameAction: z.infer<GA>
  ) => GameActionJson<GA>;
  
  parseGameSpecificActionJson: (
    jsonString: GameActionJson<GA>
  ) => z.infer<GA>;

  applyGameAction: (
    tableState: GameTable,
    gameState: z.infer<GS>,
    gameAction: z.infer<GA>
  ) => GameTableActionResult<z.infer<GS>>;

  gameStateJsonSchema: GS;
  gameActionJsonSchema: GA;
}



export type BfgGameEngineMetadata<
  GS extends z.ZodTypeAny,
  GA extends z.ZodTypeAny
> = {
  definition: GameDefinition;
  processor: BfgGameEngineProcessor<GS, GA>;
}
