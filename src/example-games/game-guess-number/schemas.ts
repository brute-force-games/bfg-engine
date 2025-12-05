import z from "zod";
import { GameTableSeatSchema } from "../../models/internal/game-room-base";
import { HostSourcedGameActionSchema } from "../../v2/new-metadata/new-metadata-types";

// Game Role Schemas
export const GuessANumberGameRoleEnumSchema = z.enum(['guesser', 'number-keeper']);

const GuessANumberGameRoleNumberKeeperSchema = z.object({
  gameRole: z.literal('number-keeper'),
  targetNumber: z.number(),
});

const GuessANumberGameRoleGuesserSchema = z.object({
  gameRole: z.literal('guesser'),
  guess: z.number().nullable(),
});

export const GuessANumberGameRoleSchema = z.discriminatedUnion('gameRole', [
  GuessANumberGameRoleNumberKeeperSchema,
  GuessANumberGameRoleGuesserSchema,
]);

// Game State Schemas
export const GuessANumberPerfectInformationGameStateSchema = z.object({
  targetNumber: z.number(),
  guesses: z.array(z.number()),
  latestGuess: z.number().nullable(),
  guesserSeat: GameTableSeatSchema,
  targetNumberGuessed: z.boolean(),
});
export type GuessANumberPerfectInformationGameState = z.infer<typeof GuessANumberPerfectInformationGameStateSchema>;

export const GuessANumberPlayerPerspectiveGameStateSchema = z.object({
  myState: GuessANumberGameRoleSchema,
});
export type GuessANumberPlayerPerspectiveGameState = z.infer<typeof GuessANumberPlayerPerspectiveGameStateSchema>;

export const GuessANumberWatcherPerspectiveGameStateSchema = z.object({
  guessesHistory: z.array(z.number()),
  guesserSeat: GameTableSeatSchema,
});
export type GuessANumberWatcherPerspectiveGameState = z.infer<typeof GuessANumberWatcherPerspectiveGameStateSchema>;

// Action Schemas
export const GuessANumberInitializeGameActionSchema = HostSourcedGameActionSchema.extend({
  actionType: z.literal('initialize-bfg-game'),
});
export type GuessANumberInitializeGameAction = z.infer<typeof GuessANumberInitializeGameActionSchema>;

export const GuessANumberInitializeGameActionDataSchema = z.object({}).loose().nullable();
export type GuessANumberInitializeGameActionData = z.infer<typeof GuessANumberInitializeGameActionDataSchema>;

export const GuessANumberInitializeGameActionOutcomeSchema = z.object({
  guesserSeat: GameTableSeatSchema,
});
export type GuessANumberInitializeGameActionOutcome = z.infer<typeof GuessANumberInitializeGameActionOutcomeSchema>;
