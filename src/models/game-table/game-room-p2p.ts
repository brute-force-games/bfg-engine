import { z } from "zod";
import { BfgGameRoomIdToolbox, BfgGameTableIdToolbox, BfgPlayerProfileIdToolbox } from "../types/bfg-branded-uuids";
import { BfgGameTableSeatIdToolbox, type GameTableSeatId } from "../types/bfg-branded-ids";
import { RoomPhaseEnumSchema } from "./table-phase";
import { BfgSupportedGameTitleSchema } from "../game-box-definition";
import type { BfgGameStateForHost } from "../../game-metadata/metadata-types/game-state-types";


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
  playerName: z.string(),
  playerProfileId: BfgPlayerProfileIdToolbox.idSchema,
});

export type PlayerSeat = z.infer<typeof BfgPlayerSchema>;

export const BfgPlayersSchema = z.array(BfgPlayerSchema);
export type BfgPlayers = z.infer<typeof BfgPlayersSchema>;
// export type BfgPlayersStringified = StringifiedJsonString<
//   typeof BfgPlayersStringifier.brand
// >;


export const GameRoomDbSchema = z.object({
  id: BfgGameRoomIdToolbox.idSchema,
  gameTableId: BfgGameTableIdToolbox.idSchema,

  gameTitle: BfgSupportedGameTitleSchema,
  tableName: z.string(),
  gameHostPlayerProfileId: BfgPlayerProfileIdToolbox.idSchema,
  latestRoomStatusDescription: z.string(),

  players: BfgPlayersSchema,

  latestGameStepIndex: z.number(),
  latestGameStatusDescription: z.string(),
  latestRoomPhase: RoomPhaseEnumSchema,

  createdAt: z.number(),
  lastUpdatedAt: z.number(),
});


// export const GameRoomSchemaForTbStore = GameRoomDbSchema.omit({
//   players: true,
// }).extend({
//   stringifiedPlayers: z.string(),
// });


export type GameRoomDbFields = z.infer<typeof GameRoomDbSchema>;

export type GameRoomDb = GameRoomDbFields;

// export type GameTableForTbStoreFields = z.infer<typeof GameRoomSchemaForTbStore>;

// export type GameTableForTbStore = EnsureCells<GameTableForTbStoreFields>;

// export type GameTableForTbStoreInvalidFields = AssertNever<
//   InvalidCellFields<GameTableForTbStoreFields>
// >;

// export const BfgPlayersStringifier = createStringifiedZod(
//   BfgPlayersSchema,
//   { brand: "GameTableBfgPlayersStringified" },
// );

// export type GameTableBfgPlayersStringified = StringifiedJsonString<
//   typeof BfgPlayersStringifier.brand
// >;


// export const createGameRoomDbSchemaForGame = (_gameMetadata: GenericGameMetadata) => {
//   // const { latestStepSchema } = gameMetadata.schemas;
//   const GameSpecificGameRoomDbSchema = GameRoomDbSchema.extend({
//     // latestStep: latestStepSchema,
//     // latestGameStatusDescription: z.string(),
//     // latestRoomPhase: RoomPhaseEnumSchema,
//   });

//   return GameSpecificGameRoomDbSchema;
// };

// export const serializeGameTableForTinybase = (
//   gameTable: GameTable,
// ): GameTableForTbStore => {
//   const { players, ...rest } = gameTable;
//   const bfgPlayersStr = BfgPlayersStringifier.stringify(players);

//   return GameRoomSchemaForTbStore.parse({
//     ...rest,
//     stringifiedPlayers: bfgPlayersStr,
//   });
// };

// export const deserializeGameTableFromTinybase = (
//   tinybaseRow: GameTableForTbStore,
// ): GameTable => {
//   const { stringifiedPlayers, ...rest } = tinybaseRow;
//   const players = BfgPlayersStringifier.parseString(stringifiedPlayers);

//   return GameRoomSchema.parse({
//     ...rest,
//     players,
//   });
// };


// export interface UpdatedGameRoom <GSH extends BfgGameStateForHost> {
//   gameRoom: GameRoomDb;
//   gameState: GSH;
//   // gameEvent: DbGameTableEvent;
//   // gameEventChange: GameEventChange;
//   // nextGameState: LatestGameState<GSH>;
// }
export interface UpdatedGameRoom {
  gameRoom: GameRoomDb;
  gameState: BfgGameStateForHost;
}






export const GameRoomP2pSchema = z.object({
  id: BfgGameRoomIdToolbox.idSchema,

  gameTitle: BfgSupportedGameTitleSchema,
  tableName: z.string(),
  gameHostPlayerProfileId: BfgPlayerProfileIdToolbox.idSchema,
  latestRoomStatusDescription: z.string(),

  players: BfgPlayersSchema,

  latestGameStepIndex: z.number(),
  latestGameStatusDescription: z.string(),
  latestRoomPhase: RoomPhaseEnumSchema,

  createdAt: z.number(),
  lastUpdatedAt: z.number(),
});

export type GameRoomP2p = z.infer<typeof GameRoomP2pSchema>;
