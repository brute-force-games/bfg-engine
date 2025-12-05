import { z } from "zod";
import { PerfectInformationGameStateSchema, type GameStepResult, type SourceGameRoleForHost } from "./new-metadata-types";
import type { IBfgGameMetadataSchemas } from "./new-bfg-metadata";
import type { GameLobby } from "../../models/p2p-lobby";
import { GameTableSeatSchema } from "../../models/internal/game-room-base";
import { GameTableEventTypeSchema } from "../../models/game-table/game-table-event";


export interface IMyGameFunctions <
  GMS extends IBfgGameMetadataSchemas,
> {
  schemas: GMS;

  initializeGame: (lobbyState: GameLobby) => GameStepResult<
    SourceGameRoleForHost,
    'initialize-bfg-game',
    z.infer<GMS['initializeGameActionSchema']>,
    z.infer<GMS['initializeGameActionOutcomeSchema']>,
    z.infer<GMS['perfectInformationGameStateSchema']>
  >;
}


export interface INewBfgGameProcessor <
  GMS extends IBfgGameMetadataSchemas,
> {
  
  bfgInitializeGame: (lobbyState: GameLobby) => GameStepResult<
    SourceGameRoleForHost,
    'initialize-bfg-game',
    z.infer<GMS['initializeGameActionSchema']>,
    z.infer<GMS['initializeGameActionOutcomeSchema']>,
    z.infer<GMS['perfectInformationGameStateSchema']>
  >;
}


export const createNewBfgGameProcessor = <
  GMS extends IBfgGameMetadataSchemas,
>(
  schemas: GMS,
  myGameFunctions: IMyGameFunctions<GMS>,
): INewBfgGameProcessor<GMS> => {

  const gameStepSchema = z.object({
    action: schemas.initializeGameActionSchema,
    actionOutcome: schemas.initializeGameActionOutcomeSchema,
    nextGameState: PerfectInformationGameStateSchema,
    gameTableEvent: GameTableEventTypeSchema,
    nextToActPlayers: z.array(GameTableSeatSchema),
  });

  type GameStep = z.infer<typeof gameStepSchema>;

  const bfgInitializeGame = (lobbyState: GameLobby): GameStepResult<
    SourceGameRoleForHost,
    'initialize-bfg-game',
    z.infer<GMS['initializeGameActionSchema']>,
    z.infer<GMS['initializeGameActionOutcomeSchema']>,
    z.infer<GMS['perfectInformationGameStateSchema']>
  > => {
    const initializeGameResult = myGameFunctions.initializeGame(lobbyState);
    return initializeGameResult;
  }

  const retVal = {
    schemas,
    gameStepSchema,

    bfgInitializeGame,
  }

  return retVal;
}

export type NewBfgGameProcessor = ReturnType<typeof createNewBfgGameProcessor>;
