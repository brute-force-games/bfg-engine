import { PublicPlayerProfile } from "@bfg-engine/models/internal/player-profile/public-player-profile";
import { EmptyP2pDetails, PeerId } from "../p2p-types";
import { ConnectionEvent } from "../p2p-types";
import { PlayerProfileId, type BfgGameInstanceId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { GameTableAccessLevel } from "../../../game-metadata/metadata-types";
import { GameTableSeat } from "@bfg-engine/models/internal/game-room-base";
import { type GameRoomP2p } from "@bfg-engine/models/p2p/game-room-p2p";
import { PrivatePlayerProfile } from "@bfg-engine/models/internal/player-profile/private-player-profile";
import type { BfgGameActionByPlayer, BfgGameActionByHost } from "../../../game-metadata/metadata-types/game-action-types";
import type { GenericGameMetadata } from "../../../game-metadata/games-registry";
import type { IHostedGameRoomValue } from "./hosted-game-room-context";
import type { IP2pRawRoomValue } from "./p2p-raw-room-context";
import type { z } from "zod";
// import type { BfgGameStep } from "../../../models/types/bfg-versions";
import type { GameTableEventForDb } from "../../../game-metadata/metadata-types";



export interface IP2pDetails {
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  myPeerProfile: PublicPlayerProfile | null;

  peerIds: PeerId[];
  peerIdsToPlayerIds: Map<PeerId, PlayerProfileId>
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
}


export interface IBfgGameTableForUserBase {
  gameInstanceId: BfgGameInstanceId;
  gameMetadata: GenericGameMetadata | null;
  
  accessLevel: GameTableAccessLevel;
  maxAllowedAccessLevel: GameTableAccessLevel;
  allowedLevels: GameTableAccessLevel[];
  
  p2pDetails: IP2pDetails;
  publicGameDetails: IPublicBfgGameDetails | null;
}



export interface IBfgGameDetailsBase {
  gameMetadata: GenericGameMetadata;
  gameRoom: GameRoomP2p;
  latestWatcherGameEvent: z.infer<GenericGameMetadata['schemas']['watcherPerspectiveForGameEventOutcomeSchema']>;
  watcherGameEvents: z.infer<GenericGameMetadata['schemas']['watcherPerspectiveForGameEventOutcomeSchema']>[];
}

export interface IPublicBfgGameDetails extends IBfgGameDetailsBase {
  gameMetadata: GenericGameMetadata;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
}

export interface IPlayerBfgGameDetails extends IPublicBfgGameDetails {
  myPlayerProfile: PrivatePlayerProfile;
  myPlayerSeat: GameTableSeat;
  latestPlayerGameEvent: z.infer<GenericGameMetadata['schemas']['playerPerspectiveForGameEventOutcomeSchema']>;
  playerGameEvents: z.infer<GenericGameMetadata['schemas']['playerPerspectiveForGameEventOutcomeSchema']>[];
  onPlayerAction: (playerAction: BfgGameActionByPlayer) => Promise<void>;
}

export interface IHostBfgGameDetails extends IBfgGameDetailsBase {
  myHostProfile: PrivatePlayerProfile;
  latestHostGameEvent: GameTableEventForDb;
  hostGameEvents: GameTableEventForDb[];
  onHostAction: <HGA extends BfgGameActionByHost>(hostAction: HGA) => Promise<void>;
}


export interface IBfgGameTableForHost extends IBfgGameTableForUserBase {
  accessLevel: 'host';
  myHostProfile: PrivatePlayerProfile;

  hostGameDetails: IHostBfgGameDetails;
  playerGameDetails: IPlayerBfgGameDetails | null;
}

export interface IBfgGameTableForPlayer extends IBfgGameTableForUserBase {
  accessLevel: 'player';
  myPlayerProfile: PrivatePlayerProfile;

  playerGameDetails: IPlayerBfgGameDetails;
}

export interface IBfgGameTableForObserver extends IBfgGameTableForUserBase {
  accessLevel: 'observer';
  myObserverProfile: PrivatePlayerProfile | null;
}

export interface IBfgGameTableForAccessLevelNone extends IBfgGameTableForUserBase {
  accessLevel: 'none';
  gameMetadata: null;
  gameRoom: null;
  publicGameDetails: null;
}

export type IBfgGameTableValue = IBfgGameTableForHost | IBfgGameTableForPlayer | IBfgGameTableForObserver | IBfgGameTableForAccessLevelNone;


export type IBfgGameRoomForAccessLevel = {
  accessLevel: 'host',
  gameRoom: IBfgGameTableForHost;
} | {
  accessLevel: 'player',
  gameRoom: IBfgGameTableForPlayer;
} | {
  accessLevel: 'observer',
  gameRoom: IBfgGameTableForObserver;
}


export type GameHostMode = 'host-only' | 'host+p2p';
export type P2pMode = 'p2p-only' | 'host+p2p';

export type GameRoomAccessMode = GameHostMode | P2pMode;

type GameRoomData = {
  gameInstanceId: BfgGameInstanceId;
  accessMode: GameRoomAccessMode;
  // allowedRoles: readonly GameTableAccessLevel[];
}


export type GameRoomModeHostOnlyAccess = {
  accessMode: 'host-only';
  hostedGameRoom: IHostedGameRoomValue;
} & GameRoomData

export type GameRoomModeHostPlusP2pAccess = {
  accessMode: 'host+p2p';
  hostedGameRoom: IHostedGameRoomValue;
  // hostedGameRoom: UserGameRoomDataForHost;
  p2pRawRoom: IP2pRawRoomValue;
} & GameRoomData

export type GameRoomModeP2pOnlyAccess = {
  accessMode: 'p2p-only';
  // p2pGameRoom: IP2pGameRoomValue;
  p2pRawRoom: IP2pRawRoomValue;
  // p2pOnlyGameRoom: IP2pOnlyGameRoomValue;
} & GameRoomData

export type GameRoomModeUnavailableAccess = {
  accessMode: 'unavailable';
  reason: string;
  gameInstanceId: BfgGameInstanceId;
  requestedAction: GameTableAccessAction;
}

export type GameRoomModeWithAccess = 
  | GameRoomModeHostOnlyAccess
  | GameRoomModeHostPlusP2pAccess
  | GameRoomModeP2pOnlyAccess
  | GameRoomModeUnavailableAccess;

export type IBfgGameTableForUnknown = GameRoomModeWithAccess



// export const DefaultBfgGameTableForAccessLevelNone: IBfgGameTableForAccessLevelNone = {
//   // gameInstanceId: null,
//   gameMetadata: null,
//   accessLevel: 'none',
//   maxAllowedAccessLevel: 'none',
//   allowedLevels: ['none'],
//   p2pDetails: EmptyP2pDetails,
//   gameRoom: null,
//   publicGameDetails: null,
// };

export const createBfgGameTableForAccessLevelNone = (gameInstanceId: BfgGameInstanceId): IBfgGameTableForAccessLevelNone => {
  return {
    gameInstanceId,
    gameMetadata: null,
    accessLevel: 'none',
    maxAllowedAccessLevel: 'none',
    allowedLevels: ['none'],
    p2pDetails: EmptyP2pDetails,
    gameRoom: null,
    publicGameDetails: null,
  };
}