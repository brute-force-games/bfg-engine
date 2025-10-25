import { z } from "zod";

export const PeerIdSchema = z.string().brand<"PeerId">();
export type PeerId = z.infer<typeof PeerIdSchema>;

export const PlayerP2pActionStrSchema = z.string().brand<"PlayerP2pAction">();
export type PlayerP2pActionStr = z.infer<typeof PlayerP2pActionStrSchema>;


export const HostP2pActionStrSchema = z.string().brand<"HostP2pAction">();
export type HostP2pActionStr = z.infer<typeof HostP2pActionStrSchema>;


export interface ConnectionEvent {
  type: 'initialized' | 'peer-joined' | 'peer-left' | 'auto-refresh' | 'join-error'
  timestamp: Date
  peerCount: number
  message: string
}
