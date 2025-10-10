import { BrandedId, createBfgBrandedIdMetadata } from "./branded-ids";
import { 
  BfgBrand,
  GameFriendIdPrefix,
  PlayerProfileIdPrefix,
  GameLobbyIdPrefix,
  GameMoveIdPrefix,
  CommMessageChannelIdPrefix,
  GameTableIdPrefix,
  GameTableActionIdPrefix,
  GamingGroupIdPrefix,
} from "./bfg-id-prefixes";


export const BfgBrandedIdMetadata = createBfgBrandedIdMetadata;


export const BfgGameFriendId = createBfgBrandedIdMetadata(GameFriendIdPrefix);
export const BfgPlayerProfileId = createBfgBrandedIdMetadata(PlayerProfileIdPrefix);
export const BfgGameLobbyId = createBfgBrandedIdMetadata(GameLobbyIdPrefix);
export const BfgGameMoveId = createBfgBrandedIdMetadata(GameMoveIdPrefix);
export const BfgCommMessageChannelId = createBfgBrandedIdMetadata(CommMessageChannelIdPrefix);
export const BfgGameTableId = createBfgBrandedIdMetadata(GameTableIdPrefix);
export const BfgGameTableActionId = createBfgBrandedIdMetadata(GameTableActionIdPrefix);
export const BfgGamingGroupId = createBfgBrandedIdMetadata(GamingGroupIdPrefix);


export type GameFriendId = typeof BfgGameFriendId;
export type GameMoveId = typeof BfgGameMoveId;

export type PlayerProfileId = BrandedId<typeof BfgPlayerProfileId.idPrefix>;
export type CommMessageChannelId = BrandedId<typeof BfgCommMessageChannelId.idPrefix>;
export type GameTableId = BrandedId<typeof BfgGameTableId.idPrefix>;
export type GameTableActionId = BrandedId<typeof BfgGameTableActionId.idPrefix>;
export type GameLobbyId = BrandedId<typeof BfgGameLobbyId.idPrefix>;


export const createPlayerProfileId = (): PlayerProfileId => {
  return BfgPlayerProfileId.createId() as PlayerProfileId;
}
