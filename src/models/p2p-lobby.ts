import { z } from "zod";
import { BfgSupportedGameTitleSchema } from "./game-box-definition";
import { BfgGameLobbyIdToolbox, BfgGameTableIdToolbox } from "./types/bfg-branded-uuids";
import { PublicPlayerProfileSchema, SharedPublicPlayerProfileSchema } from "./player-profile/public-player-profile";
import {
  createStringifiedZod,
  type StringifiedJsonString,
} from "./stringified-zod";


export const LobbyOptionsSchema = z.object({
  gameChoices: z.array(BfgSupportedGameTitleSchema),
});

export type LobbyOptions = z.infer<typeof LobbyOptionsSchema>;


export const InvalidLobbyReasonSchema = z.string().brand("InvalidLobbyReason");
export type InvalidLobbyReason = z.infer<typeof InvalidLobbyReasonSchema>;


export const GameLobbySchema = z.object({
  id: BfgGameLobbyIdToolbox.idSchema,
  createdAt: z.number(),
  gameHostPlayerProfile: PublicPlayerProfileSchema,

  lobbyName: z.string(),
  currentStatusDescription: z.string(),
  isLobbyValid: z.boolean(),
  // invalidLobbyReasons: z.array(InvalidLobbyReasonSchema),

  gameTitle: BfgSupportedGameTitleSchema.optional(),

  gameTableId: BfgGameTableIdToolbox.idSchema.optional(),
  playGameLink: z.string().optional(),

  playerPool: z.array(SharedPublicPlayerProfileSchema),
  minNumPlayers: z.number(),
  maxNumPlayers: z.number(),

  updatedAt: z.number(),
});

export type GameLobby = z.infer<typeof GameLobbySchema>;

export const GameLobbySchemaForTbStore = GameLobbySchema.omit({
  gameHostPlayerProfile: true,
  playerPool: true,
  gameTitle: true,
  gameTableId: true,
  playGameLink: true,
}).extend({
  stringifiedGameHostPlayerProfile: z.string(),
  stringifiedPlayerPool: z.string(),
  gameTitle: z.string(),
  gameTableId: z.string(),
  playGameLink: z.string(),
});

export const GameHostPlayerProfileStringifier = createStringifiedZod(
  PublicPlayerProfileSchema,
  { brand: "GameLobbyGameHostPlayerProfileStringified" },
);

export type GameLobbyGameHostPlayerProfileStringified = StringifiedJsonString<
  typeof GameHostPlayerProfileStringifier.brand
>;

export const PlayerPoolStringifier = createStringifiedZod(
  z.array(SharedPublicPlayerProfileSchema),
  { brand: "GameLobbyPlayerPoolStringified" },
);

export type GameLobbyPlayerPoolStringified = StringifiedJsonString<
  typeof PlayerPoolStringifier.brand
>;
