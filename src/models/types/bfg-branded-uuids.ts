import { z } from "zod";
import { BrandedUuid, createBfgBrandedUuidToolbox } from "./branded-uuids";
import { 
  GameFriendIdPrefix,
  PlayerProfileIdPrefix,
  GameLobbyIdPrefix,
  GameMoveIdPrefix,
  CommMessageChannelIdPrefix,
  BfgGameTableIdPrefix,
  GamingGroupIdPrefix,
  GameTableEventIdPrefix,
  GameTableEventOutcomeIdPrefix,
  GameTableHostStateIdPrefix,
  BfgGameRoomIdPrefix,
  BfgGameInstanceIdPrefix,
  BfgGameStateIdPrefix,
} from "./bfg-uuid-prefixes";


export const BfgGameInstanceIdToolbox = createBfgBrandedUuidToolbox(BfgGameInstanceIdPrefix);
export const BfgGameFriendIdToolbox = createBfgBrandedUuidToolbox(GameFriendIdPrefix);
export const BfgPlayerProfileIdToolbox = createBfgBrandedUuidToolbox(PlayerProfileIdPrefix);
export const BfgGameLobbyIdToolbox = createBfgBrandedUuidToolbox(GameLobbyIdPrefix);
export const BfgGameMoveIdToolbox = createBfgBrandedUuidToolbox(GameMoveIdPrefix);
export const BfgCommMessageChannelIdToolbox = createBfgBrandedUuidToolbox(CommMessageChannelIdPrefix);
export const BfgGameTableIdToolbox = createBfgBrandedUuidToolbox(BfgGameTableIdPrefix);
export const BfgGameRoomIdToolbox = createBfgBrandedUuidToolbox(BfgGameRoomIdPrefix);
export const BfgGameStateIdToolbox = createBfgBrandedUuidToolbox(BfgGameStateIdPrefix);
export const BfgGameTableHostStateIdToolbox = createBfgBrandedUuidToolbox(GameTableHostStateIdPrefix);
export const BfgGameTableEventIdToolbox = createBfgBrandedUuidToolbox(GameTableEventIdPrefix);
export const BfgGameTableEventOutcomeIdToolbox = createBfgBrandedUuidToolbox(GameTableEventOutcomeIdPrefix);
export const BfgGamingGroupIdToolbox = createBfgBrandedUuidToolbox(GamingGroupIdPrefix);


export type BfgGameInstanceId = z.infer<typeof BfgGameInstanceIdToolbox.idSchema>;
export type GameFriendId = z.infer<typeof BfgGameFriendIdToolbox.idSchema>;
export type GameMoveId = z.infer<typeof BfgGameMoveIdToolbox.idSchema>;

export type PlayerProfileId = BrandedUuid<typeof BfgPlayerProfileIdToolbox.idPrefix>;
export type CommMessageChannelId = z.infer<typeof BfgCommMessageChannelIdToolbox.idSchema>;
// export type BfgGameTableId = BrandedUuid<typeof BfgGameTableIdToolbox.idPrefix>;
export type BfgGameTableId = z.infer<typeof BfgGameTableIdToolbox.idSchema>;
export type BfgGameRoomId = z.infer<typeof BfgGameRoomIdToolbox.idSchema>;
export type GameTableEventId = z.infer<typeof BfgGameTableEventIdToolbox.idSchema>;
export type GameTableEventOutcomeId = z.infer<typeof BfgGameTableEventOutcomeIdToolbox.idSchema>;

export type GameLobbyId = z.infer<typeof BfgGameLobbyIdToolbox.idSchema>;


export const createPlayerProfileId = (): PlayerProfileId => {
  return BfgPlayerProfileIdToolbox.createRandomId() as PlayerProfileId;
}
