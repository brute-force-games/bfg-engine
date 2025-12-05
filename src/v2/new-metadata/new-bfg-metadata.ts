import { z } from "zod";
import type { BfgSupportedGameTitle, GameDefinition } from "../../models/game-box-definition";
import { createNewBfgGameProcessor, type IMyGameFunctions } from "./new-bfg-game-processor";


export interface IBfgGameMetadataSchemas {
  initializeGameActionSchema: z.ZodType<any>;
  initializeGameActionOutcomeSchema: z.ZodType<any>;

  perfectInformationGameStateSchema: z.ZodType<any>;
  playerPerspectiveGameStateSchema: z.ZodType<any>;
  watcherPerspectiveGameStateSchema: z.ZodType<any>;
}


export const createNewBfgGameMetadata = (
  gameTitle: BfgSupportedGameTitle,
  definition: GameDefinition,
  gameStateSchemas: IBfgGameMetadataSchemas,
  myGameFunctions: IMyGameFunctions<IBfgGameMetadataSchemas>,
) => {
  const retVal = {
    gameTitle,
    definition,
    gameStateSchemas,
    gameProcessor: createNewBfgGameProcessor(gameStateSchemas, myGameFunctions),
  };
  return retVal;
}
export type NewBfgGameMetadata = ReturnType<typeof createNewBfgGameMetadata>;
