import { z } from "zod";

export const PeerIdSchema = z.string().brand<"PeerId">();
export type PeerId = z.infer<typeof PeerIdSchema>;



export interface ConnectionEvent {
  type: 'initialized' | 'peer-joined' | 'peer-left' | 'auto-refresh' | 'join-error'
  timestamp: Date
  peerCount: number
  message: string
}
