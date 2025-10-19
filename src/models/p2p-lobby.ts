import { z } from "zod";
import { BfgSupportedGameTitleSchema } from "./game-box-definition";
import { BfgGameLobbyId, BfgGameTableId, BfgPlayerProfileId } from "./types/bfg-branded-ids";
import { PublicPlayerProfileSchema } from "./player-profile/public-player-profile";


export const LobbyOptionsSchema = z.object({
  gameChoices: z.array(BfgSupportedGameTitleSchema),
});

export type LobbyOptions = z.infer<typeof LobbyOptionsSchema>;


export const InvalidLobbyReasonSchema = z.string().brand("InvalidLobbyReason");
export type InvalidLobbyReason = z.infer<typeof InvalidLobbyReasonSchema>;


export const LobbySchema = z.object({
  id: BfgGameLobbyId.idSchema,
  createdAt: z.number(),
  gameHostPlayerProfile: PublicPlayerProfileSchema,

  lobbyName: z.string(),
  currentStatusDescription: z.string(),
  isLobbyValid: z.boolean(),
  // invalidLobbyReasons: z.array(InvalidLobbyReasonSchema),

  gameTitle: BfgSupportedGameTitleSchema.optional(),

  gameTableId: BfgGameTableId.idSchema.optional(),
  gameLink: z.string().optional(),

  playerPool: z.array(BfgPlayerProfileId.idSchema),
  minNumPlayers: z.number(),
  maxNumPlayers: z.number(),

  updatedAt: z.number(),
});

export type GameLobby = z.infer<typeof LobbySchema>;
