import { z } from "zod";
import { BfgGameTableSeatIdToolbox, type GameTableSeatId } from "../types/bfg-branded-ids";
import { BfgPlayerProfileIdToolbox } from "../types/bfg-branded-uuids";
import { PublicPlayerProfileSchema } from "./player-profile/public-player-profile";



export const PlayerSeat1 = BfgGameTableSeatIdToolbox.createValidatedId('p1');
export const PlayerSeat2 = BfgGameTableSeatIdToolbox.createValidatedId('p2');
export const PlayerSeat3 = BfgGameTableSeatIdToolbox.createValidatedId('p3');
export const PlayerSeat4 = BfgGameTableSeatIdToolbox.createValidatedId('p4');
export const PlayerSeat5 = BfgGameTableSeatIdToolbox.createValidatedId('p5');
export const PlayerSeat6 = BfgGameTableSeatIdToolbox.createValidatedId('p6');
export const PlayerSeat7 = BfgGameTableSeatIdToolbox.createValidatedId('p7');
export const PlayerSeat8 = BfgGameTableSeatIdToolbox.createValidatedId('p8');

export const ALL_PLAYER_SEATS: GameTableSeatId[] = [
  PlayerSeat1,
  PlayerSeat2,
  PlayerSeat3,
  PlayerSeat4,
  PlayerSeat5,
  PlayerSeat6,
  PlayerSeat7,
  PlayerSeat8,
] as const;


export const GameTableSeatSchema = z.enum(ALL_PLAYER_SEATS);

export type GameTableSeat = z.infer<typeof GameTableSeatSchema>;


export const BfgPlayerSchema = z.object({
  role: GameTableSeatSchema,
  // playerName: z.string(),
  playerProfileId: BfgPlayerProfileIdToolbox.idSchema,
  playerProfile: PublicPlayerProfileSchema,
});

export type PlayerSeat = z.infer<typeof BfgPlayerSchema>;

export const BfgPlayersSchema = z.array(BfgPlayerSchema);
export type BfgPlayers = z.infer<typeof BfgPlayersSchema>;


