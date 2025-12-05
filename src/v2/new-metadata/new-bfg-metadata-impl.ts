import type { BfgSupportedGameTitle, GameDefinition } from "../../models/game-box-definition";
import { createNewBfgGameProcessor, type IMyGameFunctions } from "./new-bfg-game-processor";
import type { IBfgGameMetadataSchemas } from "./new-bfg-metadata";
import type { GameActionDefinition } from "./new-metadata-types";


export interface ICreateNewBfgGameMetadataParams {
  gameTitle: BfgSupportedGameTitle;
  definition: GameDefinition;
  hostStartsGameActionType: string;
  myGameSchemas: IBfgGameMetadataSchemas;
  myGameFunctions: IMyGameFunctions<IBfgGameMetadataSchemas>;
  myGameActions: Array<GameActionDefinition<any, any, any, any, any>>;
}

export const createNewBfgGameMetadata = ({
  gameTitle,
  definition,
  hostStartsGameActionType,
  myGameSchemas,
  myGameFunctions,
  myGameActions,
}: ICreateNewBfgGameMetadataParams) => {

  const gameProcessor = createNewBfgGameProcessor(myGameSchemas, myGameFunctions);

  const newBfgGameMetadata = {
    gameTitle,
    definition,
    hostStartsGameActionType,
    myGameSchemas,
    gameProcessor,
    myGameActions,
  };

  return newBfgGameMetadata;
};

export type INewBfgGameMetadata = ReturnType<typeof createNewBfgGameMetadata>;
