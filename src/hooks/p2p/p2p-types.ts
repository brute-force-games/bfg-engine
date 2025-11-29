import { z } from "zod";
import type { IP2pDetails } from "./game/p2p-game-types";

export const PeerIdSchema = z.string().brand<"PeerId">();
export type PeerId = z.infer<typeof PeerIdSchema>;

export const PlayerP2pActionStrSchema = z.string().brand<"PlayerP2pAction">();
export type PlayerP2pActionStr = z.infer<typeof PlayerP2pActionStrSchema>;

export const UserGameRoomPerspectiveStrSchema = z.string().brand<"UserGameRoomPerspective">();
export type UserGameRoomPerspectiveStr = z.infer<typeof UserGameRoomPerspectiveStrSchema>;

export const PrivatePlayerKnowledgeStrSchema = z.string().brand<"PrivatePlayerKnowledge">();
export type PrivatePlayerKnowledgeStr = z.infer<typeof PrivatePlayerKnowledgeStrSchema>;


export const HostP2pActionStrSchema = z.string().brand<"HostP2pAction">();
export type HostP2pActionStr = z.infer<typeof HostP2pActionStrSchema>;


export interface ConnectionEvent {
  type: 'initialized' | 'peer-joined' | 'peer-left' | 'auto-refresh' | 'join-error'
  timestamp: Date
  peerCount: number
  message: string
}



export const EmptyP2pDetails: IP2pDetails = {
  peerIds: [],
  peerIdsToPlayerIds: new Map(),
  allPlayerProfiles: new Map(),
  myPeerProfile: null,
  connectionStatus: 'disconnected',
  connectionEvents: [],
};
