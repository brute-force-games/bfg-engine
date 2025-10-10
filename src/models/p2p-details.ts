import { z } from "zod"
import { LobbyOptionsSchema, LobbySchema } from "./p2p-lobby"
import { PublicPlayerProfileSchema } from "./player-profile/public-player-profile"
import { BfgSupportedGameTitleSchema } from "./game-box-definition"


export const HostP2pLobbyDetailsSchema = z.object({
  hostPlayerProfile: PublicPlayerProfileSchema,
  lobbyState: LobbySchema,
  lobbyOptions: LobbyOptionsSchema,
})

export type HostP2pLobbyDetails = z.infer<typeof HostP2pLobbyDetailsSchema>;


export const PlayerP2pLobbySetGameChoiceMoveSchema = z.object({
  move: z.literal('set-game-choice'),
  gameChoice: BfgSupportedGameTitleSchema,
})

export const PlayerP2pLobbyTakeSeatMoveSchema = z.object({
  move: z.literal('take-seat'),
})

export const PlayerP2pLobbyLeaveSeatMoveSchema = z.object({
  move: z.literal('leave-seat'),
})


export const PlayerP2pLobbyMoveSchema = z.discriminatedUnion('move', [
  PlayerP2pLobbyTakeSeatMoveSchema,
  PlayerP2pLobbySetGameChoiceMoveSchema,
  PlayerP2pLobbyLeaveSeatMoveSchema,
])
export type PlayerP2pLobbyMove = z.infer<typeof PlayerP2pLobbyMoveSchema>;


export const PlayerP2pGameMoveSchema = z.string().brand<"PlayerP2pGameMove">();
export type PlayerP2pGameMove = z.infer<typeof PlayerP2pGameMoveSchema>;
