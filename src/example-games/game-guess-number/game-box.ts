import { createNewBfgGameMetadata } from "../../v2/new-metadata/new-bfg-metadata-impl";
import { BfgSupportedGameTitle, type GameDefinition } from "../../models/game-box-definition";
import type { GameLobby } from "../../models/p2p-lobby";
import type { GameStepResult, type SourceGameRoleForHost } from "../../v2/new-metadata/new-metadata-types";
import type { GameTableSeatId } from "../../models/types/bfg-branded-ids";
import { type IBfgGameMetadataSchemas } from "../../v2/new-metadata/new-bfg-metadata";
import { GuessANumberInitializeGameActionDefinition } from "./actions/initialize-game-guess-number";
import type { IMyGameFunctions } from "../../v2/new-metadata/new-bfg-game-processor";
import {
  GuessANumberInitializeGameActionSchema,
  GuessANumberInitializeGameActionOutcomeSchema,
  GuessANumberPerfectInformationGameStateSchema,
  GuessANumberPlayerPerspectiveGameStateSchema,
  GuessANumberWatcherPerspectiveGameStateSchema,
  type GuessANumberInitializeGameActionDataSchema,
  type GuessANumberInitializeGameActionOutcome,
} from "./schemas";


const GuessANumberTitle = "Guess a Number" as BfgSupportedGameTitle;
const GuessANumberGameDefinition: GameDefinition = {
  title: GuessANumberTitle,
  minNumPlayersForGame: 2,
  maxNumPlayersForGame: 2,
};

export const GuessANumberGameSchemas: IBfgGameMetadataSchemas = {
  initializeGameActionSchema: GuessANumberInitializeGameActionSchema,
  initializeGameActionOutcomeSchema: GuessANumberInitializeGameActionOutcomeSchema,

  perfectInformationGameStateSchema: GuessANumberPerfectInformationGameStateSchema,
  playerPerspectiveGameStateSchema: GuessANumberPlayerPerspectiveGameStateSchema,
  watcherPerspectiveGameStateSchema: GuessANumberWatcherPerspectiveGameStateSchema,
};


export const GuessANumberMyGameFunctions: IMyGameFunctions<typeof GuessANumberGameSchemas> = {
  schemas: GuessANumberGameSchemas,

  // GameStepResult<GuessANumberInitializeGameActionOutcome, GuessANumberPerfectInformationGameState> = {
  initializeGame: (lobbyState: GameLobby): GameStepResult<
    SourceGameRoleForHost,
    'initialize-bfg-game',
    typeof GuessANumberInitializeGameActionDataSchema,
    typeof GuessANumberInitializeGameActionOutcomeSchema,
    typeof GuessANumberPerfectInformationGameStateSchema
  > => {

    const guesserSeat = 'p1' as GameTableSeatId;

    const retVal: GameStepResult<
      SourceGameRoleForHost,
      'initialize-bfg-game',
      typeof GuessANumberInitializeGameActionDataSchema,
      typeof GuessANumberInitializeGameActionOutcomeSchema,
      typeof GuessANumberPerfectInformationGameStateSchema
    > = {
      action: {
        source: 'host',
        actionType: 'initialize-bfg-game',
        actionData: null,
      },
      nextToActPlayers: ['p1' as GameTableSeatId],
      gameTableEvent: 'game-table-action-host-starts-setup',
      actionOutcome: {
        guesserSeat,
      },
      nextGameState: {
        targetNumber: 10,
        guesses: [],
        latestGuess: null,
        guesserSeat: 'p1' as GameTableSeatId,
        targetNumberGuessed: false,
      },
    };

    return retVal;
  },
};


export const GuessNumberGameMetadata = createNewBfgGameMetadata({
  gameTitle: GuessANumberTitle,
  definition: GuessANumberGameDefinition,
  hostStartsGameActionType: 'initialize-guess-a-number-game',
  myGameSchemas: GuessANumberGameSchemas,
  myGameFunctions: GuessANumberMyGameFunctions,
  myGameActions: [
    GuessANumberInitializeGameActionDefinition,
  ],
});
