import { z } from "zod";
import { BfgIdTypePrefixBrandSchema, BfgUuidMethodBrandKey } from "./prefix-key-methods";


export const BfgUuidPrefixTypeSchema = BfgIdTypePrefixBrandSchema.brand(BfgUuidMethodBrandKey);
export type BfgUuidPrefixType = z.infer<typeof BfgUuidPrefixTypeSchema>;


export const BfgGameInstanceIdPrefix = "bfg_game" as BfgUuidPrefixType;
export const GameFriendIdPrefix = "bfg_game_friend" as BfgUuidPrefixType;
export const GameLobbyIdPrefix = "bfg_game_lobby" as BfgUuidPrefixType;
export const PlayerProfileIdPrefix = "bfg_player_profile" as BfgUuidPrefixType;
export const GameMoveIdPrefix = "bfg_game_move" as BfgUuidPrefixType;
export const CommMessageChannelIdPrefix = "bfg_comm_message_channel" as BfgUuidPrefixType;
export const BfgGameTableIdPrefix = "bfg_game_table" as BfgUuidPrefixType;
export const BfgGameRoomIdPrefix = "bfg_game_room" as BfgUuidPrefixType;
export const BfgGameStateIdPrefix = "bfg_game_state" as BfgUuidPrefixType;
export const GameTableHostStateIdPrefix = "bfg_game_table_host_state" as BfgUuidPrefixType;
export const GameTableEventIdPrefix = "bfg_game_table_event" as BfgUuidPrefixType;
export const GameTableEventOutcomeIdPrefix = "bfg_game_table_event_outcome" as BfgUuidPrefixType;
export const GamingGroupIdPrefix = "bfg_gaming_group" as BfgUuidPrefixType;


export type BfgUuidBrand =
  typeof BfgGameInstanceIdPrefix |
  typeof GameFriendIdPrefix |
  typeof GameLobbyIdPrefix |
  typeof PlayerProfileIdPrefix |
  typeof GameMoveIdPrefix |
  typeof CommMessageChannelIdPrefix |
  typeof BfgGameTableIdPrefix |
  typeof BfgGameRoomIdPrefix |
  typeof GameTableHostStateIdPrefix |
  typeof GameTableEventIdPrefix |
  typeof GameTableEventOutcomeIdPrefix |
  typeof GamingGroupIdPrefix;
