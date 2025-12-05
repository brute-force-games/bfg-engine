import type { GameTableSeat } from "../../../models/internal/game-room-base";
import type { GameTableSeatId } from "../../../models/types/bfg-branded-ids";
import { createBfgGameActionDefinition, type IMyGameActionDefinition, type GameStepResult, type SourceGameRoleForHost, type SourceGameRole, type SourcedGameAction } from "../../../v2/new-metadata/new-metadata-types";
import type { BfgGameActionTypeStr } from "../../../models/types/bfg-branded-string-types";
import type { IBfgGameMetadataSchemas } from "../../../v2/new-metadata/new-bfg-metadata";
import {
  GuessANumberInitializeGameActionSchema,
  GuessANumberInitializeGameActionDataSchema,
  GuessANumberInitializeGameActionOutcomeSchema,
  GuessANumberPerfectInformationGameStateSchema,
  GuessANumberPlayerPerspectiveGameStateSchema,
  GuessANumberWatcherPerspectiveGameStateSchema,
  type GuessANumberPerfectInformationGameState,
  type GuessANumberWatcherPerspectiveGameState,
  type GuessANumberInitializeGameActionOutcome,
} from "../schemas";

// Construct schemas object inline to avoid circular dependency
const GameSchemasForAction: IBfgGameMetadataSchemas = {
  initializeGameActionSchema: GuessANumberInitializeGameActionSchema,
  initializeGameActionOutcomeSchema: GuessANumberInitializeGameActionOutcomeSchema,
  perfectInformationGameStateSchema: GuessANumberPerfectInformationGameStateSchema,
  playerPerspectiveGameStateSchema: GuessANumberPlayerPerspectiveGameStateSchema,
  watcherPerspectiveGameStateSchema: GuessANumberWatcherPerspectiveGameStateSchema,
};

export const GuessANumberInitializeGameActionDefinitionImpl: IMyGameActionDefinition<
  typeof GuessANumberInitializeGameActionDataSchema,
  typeof GuessANumberInitializeGameActionOutcomeSchema,
  typeof GameSchemasForAction
> = {
  actionSource: { source: 'host' } as SourceGameRoleForHost,
  actionType: 'initialize-bfg-game' as BfgGameActionTypeStr,
  actionDataSchema: GuessANumberInitializeGameActionDataSchema,

  actionOutcomeSchema: GuessANumberInitializeGameActionOutcomeSchema,
  gameSchemas: GameSchemasForAction,

  processThisGameAction: async (gameAction: SourcedGameAction): 
    Promise<GameStepResult<
      SourceGameRole,
      BfgGameActionTypeStr,
      typeof GuessANumberInitializeGameActionDataSchema,
      typeof GuessANumberInitializeGameActionOutcomeSchema,
      typeof GameSchemasForAction['perfectInformationGameStateSchema']
    >> => {

      const actionOutcome: GuessANumberInitializeGameActionOutcome = {
        guesserSeat: 'p1' as GameTableSeatId,
      };

      const initialGameState: GuessANumberPerfectInformationGameState = {
        targetNumber: 10,
        guesses: [],
        latestGuess: null,
        guesserSeat: 'p1' as GameTableSeatId,
        targetNumberGuessed: false,
      };

      const gameStepResult: GameStepResult<
        SourceGameRole,
        'initialize-bfg-game',
        typeof GuessANumberInitializeGameActionDataSchema,
        typeof GuessANumberInitializeGameActionOutcomeSchema,
        typeof GameSchemasForAction['perfectInformationGameStateSchema']
      > = {
        action: {
          source: 'host',
          actionType: 'initialize-bfg-game',
          actionData: null,
        },
        actionOutcome: actionOutcome,
        nextGameState: initialGameState,
        gameTableEvent: 'game-table-action-host-starts-setup',
        nextToActPlayers: ['p1' as GameTableSeatId],
      };

      return Promise.resolve(gameStepResult);
  },

  adaptForPlayerPerspective: (
    playerSeat: GameTableSeat,
    _gameAction,
    _outcome,
    nextGameState: GuessANumberPerfectInformationGameState,
  ) => {
    
    if (playerSeat === 'p1') {
      return {
        myState: {
          gameRole: 'guesser' as const,
          guess: null,
        },
      };
    }

    return {
      myState: {
        gameRole: 'number-keeper' as const,
        guess: null,
      },
    };
  },

  adaptForWatcherPerspective: (
    _gameAction,
    _outcome,
    nextGameState: GuessANumberPerfectInformationGameState,
  ) => {

    const watcherPerspectiveGameState: GuessANumberWatcherPerspectiveGameState = {
      guessesHistory: nextGameState.guesses,
      guesserSeat: nextGameState.guesserSeat,
    };

    return watcherPerspectiveGameState;
  },
};

export const GuessANumberInitializeGameActionDefinition = createBfgGameActionDefinition(GuessANumberInitializeGameActionDefinitionImpl);

