
export const GameFriendIdPrefix = "bfg_game_friend" as const;
export const GameLobbyIdPrefix = "bfg_game_lobby" as const;
export const PlayerProfileIdPrefix = "bfg_player_profile" as const;
export const GameMoveIdPrefix = "bfg_game_move" as const;
export const CommMessageChannelIdPrefix = "bfg_comm_message_channel" as const;
export const GameTableIdPrefix = "bfg_game_table" as const;
export const GameTableActionIdPrefix = "bfg_game_table_action" as const;
export const GamingGroupIdPrefix = "bfg_gaming_group" as const;


export type BfgBrand =
  typeof GameFriendIdPrefix |
  typeof GameLobbyIdPrefix |
  typeof PlayerProfileIdPrefix |
  typeof GameMoveIdPrefix |
  typeof CommMessageChannelIdPrefix |
  typeof GameTableIdPrefix |
  typeof GameTableActionIdPrefix |
  typeof GamingGroupIdPrefix;
