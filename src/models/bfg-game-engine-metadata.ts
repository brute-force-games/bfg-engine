import React from "react";
import { z } from "zod";
import { GameTable } from "./game-table/game-table";
import { BfgSupportedGameTitle } from "./game-box-definition";
import { 
  BfgGameEngineProcessor, 
  BfgGameEngineRendererFactory,
  GameStateJson,
  GameActionJson,
  GameStateHostComponentProps,
  GameStateActionInputProps,
  GameStateCombinationRepresentationAndInputProps,
  GameHistoryComponentProps,
  GameStateRepresentationProps
} from "./game-engine/bfg-game-engines";
import { BfgGameSpecificTableAction } from "./game-table/game-table-action";
import { GameTableActionResult } from "./game-table/table-phase";


export interface IBfgGameEngineProcessor<
  GS extends z.ZodTypeAny,
  GA extends z.ZodTypeAny
> {

  gameTitle: BfgSupportedGameTitle,

  applyGameAction: (
    tableState: GameTable,
    gameState: z.infer<GS>,
    gameAction: z.infer<GA>
  ) => GameTableActionResult<z.infer<GS>>,

  createInitialGameSpecificState: (initialGameSpecificAction: z.infer<GA>) => z.infer<GS>,
  createInitialGameTableAction: (gameTable: GameTable) => BfgGameSpecificTableAction<z.infer<GA>>,

  createGameStateHostComponent: (
    props: GameStateHostComponentProps<GS, GA>,
    // gameTable: GameTable,
    // gameState: z.infer<GS>,
    // mostRecentAction: z.infer<GA>,
    // onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void
  ) => React.ReactNode,

  createGameStateRepresentationComponent: (
    props: GameStateRepresentationProps<GS, GA>,
    // myPlayerSeat: GameTableSeat,
    // gameState: z.infer<GS>,
    // mostRecentAction: z.infer<GA>
  ) => React.ReactNode,

  createGameStateActionInputComponent: (
    props: GameStateActionInputProps<GS, GA>,
    // myPlayerSeat: GameTableSeat,
    // gameState: z.infer<GS>, 
    // mostRecentAction: z.infer<GA>,
    // onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void
  ) => React.ReactNode,

  createGameStateCombinationRepresentationAndInputComponent?: (
    props: GameStateCombinationRepresentationAndInputProps<GS, GA>,
    // myPlayerSeat: GameTableSeat,
    // gameState: z.infer<GS>, 
    // mostRecentAction: z.infer<GA>,
    // onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void
  ) => React.ReactNode | undefined,

  createGameHistoryComponent?: (
    props: GameHistoryComponentProps<GS, GA>,
    // myPlayerSeat: GameTableSeat,
    // gameState: z.infer<GS>,
    // gameActions: BfgGameSpecificTableAction<z.infer<GA>>[]
  ) => React.ReactNode,
}


export const createBfgGameEngineProcessor = <
  GS extends z.ZodTypeAny,
  GA extends z.ZodTypeAny
>(
  _gameTitle: BfgSupportedGameTitle,
  gameStateSchema: GS,
  gameActionSchema: GA,
  processorImplementation: IBfgGameEngineProcessor<GS, GA>,
  rendererFactory: BfgGameEngineRendererFactory<GS, GA>,
): BfgGameEngineProcessor<GS, GA> => {

  type TGameStateInferred = z.infer<GS>;
  type TGameActionInferred = z.infer<GA>;

  const createBrandedGameStateJsonValue = (obj: TGameStateInferred): GameStateJson<GS> => {
    const json = JSON.stringify(obj);
    console.log("createBrandedGameStateJsonValue", json);
    return json as GameStateJson<GS>;
  }

  const createBrandedGameActionJsonValue = (obj: TGameActionInferred): GameActionJson<GA> => {
    const json = JSON.stringify(obj);
    return json as GameActionJson<GA>;
  }

  const createBfgInitialGameState = (initialGameTableAction: BfgGameSpecificTableAction<z.infer<GA>>): z.infer<GS> => {
    const initialGameSpecificState = processorImplementation.createInitialGameSpecificState(initialGameTableAction.gameSpecificAction);
    
    return initialGameSpecificState;
  }


  // const narrowGameStateToValidGameActions = (
  //   tableState: GameTable,
  //   gameState: z.infer<GS>,
  // ): BfgGameSpecificTableAction<GA>[] => {

  //   const retVal: BfgGameSpecificTableAction<GA>[] = [];

  //   // for (const gameAction of gameActions) {

  //   //   const gameSpecificActionJson = JSON.parse(gameAction.actionJson);
  //   //   const parsedGameSpecificAction = gameActionSchema.parse(gameSpecificActionJson);

  //   //   const bfgAction: BfgGameSpecificTableAction<GA> = {
  //   //     gameTableActionId: gameAction.id,
  //   //     source: gameAction.source,
  //   //     actionType: gameAction.actionType,
  //   //     gameSpecificAction: parsedGameSpecificAction,
  //   //   };

  //   //   retVal.push(bfgAction);
  //   // }

  //   return retVal;
  // }


  const processor: BfgGameEngineProcessor<GS, GA> = {

    ...processorImplementation,

    rendererFactory,

    createBfgInitialGameSpecificState: createBfgInitialGameState,
    createBfgGameSpecificInitialGameTableAction: processorImplementation.createInitialGameTableAction,

    createGameSpecificGameStateJson: (obj: TGameStateInferred) => createBrandedGameStateJsonValue(obj),
    parseGameSpecificGameStateJson: (jsonString: GameStateJson<GS>) => {
      const json = JSON.parse(jsonString);
      return gameStateSchema.parse(json) as z.infer<GS>;
    },

    createGameSpecificActionJson: (obj: TGameActionInferred) => createBrandedGameActionJsonValue(obj),
    parseGameSpecificActionJson: (jsonString: GameActionJson<GA>) => {
      const json = JSON.parse(jsonString);
      return gameActionSchema.parse(json) as z.infer<GA>;
    },

    // narrowGameStateToValidGameActions,

    gameStateJsonSchema: gameStateSchema,
    gameActionJsonSchema: gameActionSchema,
  };

  return processor;
}
