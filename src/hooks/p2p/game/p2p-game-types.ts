import { PublicPlayerProfile } from "@bfg-engine/models/player-profile/public-player-profile";
import { PeerId } from "../p2p-types";
import { ConnectionEvent } from "../p2p-types";
import { BfgGameTableId, PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { GameTableAccessRole } from "@bfg-engine/models/game-roles";
import { GameTableSeat, type GameRoomP2p } from "@bfg-engine/models/game-table/game-room-p2p";
import { PrivatePlayerProfile } from "@bfg-engine/models/player-profile/private-player-profile";
import type { BfgGameActionByPlayer, BfgGameActionByHost } from "../../../game-metadata/metadata-types/game-action-types";
import type { GenericGameMetadata } from "../../../game-metadata/games-registry";
import type { GameTableEventForHostP2p, GameTableEventForPlayerP2p, GameTableEventForWatcherP2p } from "../../../models/game-table/game-table-event-p2p";



export interface IP2pDetails {
  // room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  myPeerProfile: PublicPlayerProfile | null;

  peerIds: PeerId[];
  peerIdsToPlayerIds: Map<PeerId, PlayerProfileId>
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
}


export interface IBfgGameTableForUserBase <
  // GSH extends BfgGameStateForHost,
  // GSP extends BfgGameStateForPlayer,
  // GSW extends BfgGameStateForWatcher,
  // PGA extends BfgGameActionByPlayer,
  // HGA extends BfgGameActionByHost,
  // AllPGA extends AllPGAExt,
> {
  gameTableId: BfgGameTableId;
  gameMetadata: GenericGameMetadata | null;
  
  accessRole: GameTableAccessRole;
  maxAllowedAccessRole: GameTableAccessRole;
  allowedRoles: GameTableAccessRole[];
  
  p2pDetails: IP2pDetails;
  publicGameDetails: IPublicBfgGameDetails | null;
}



export interface IBfgGameDetailsBase <
  // GSH extends BfgGameStateForHost,
  // GSP extends BfgGameStateForPlayer,
  // GSW extends BfgGameStateForWatcher,
  // PGA extends BfgGameActionByPlayer,
  // HGA extends BfgGameActionByHost,
  // AllPGA extends AllPGAExt,
> {
  gameMetadata: GenericGameMetadata;
  gameRoom: GameRoomP2p;
  latestWatcherGameEvent: GameTableEventForWatcherP2p;
  watcherGameEvents: GameTableEventForWatcherP2p[];
}

export interface IPublicBfgGameDetails <
  // GSH extends BfgGameStateForHost,
  // GSP extends BfgGameStateForPlayer,
  // GSW extends BfgGameStateForWatcher,
  // PGA extends BfgGameActionByPlayer,
  // HGA extends BfgGameActionByHost,
  // AllPGA extends AllPGAExt,
> extends IBfgGameDetailsBase {
  // gameTable: GameTable;
  gameMetadata: GenericGameMetadata;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
}

export interface IPlayerBfgGameDetails <
  // GSH extends BfgGameStateForHost,
  // GSP extends BfgGameStateForPlayer,
  // GSW extends BfgGameStateForWatcher,
  // PGA extends BfgGameActionByPlayer,
  // HGA extends BfgGameActionByHost,
  // AllPGA extends AllPGAExt,
> extends IPublicBfgGameDetails {
  myPlayerProfile: PrivatePlayerProfile;
  myPlayerSeat: GameTableSeat;
  latestPlayerGameEvent: GameTableEventForPlayerP2p;
  playerGameEvents: GameTableEventForPlayerP2p[];
  // myPrivatePlayerKnowledgeStr: PrivatePlayerKnowledgeStr | null;
  onPlayerAction: (playerAction: BfgGameActionByPlayer) => Promise<void>;
}

export interface IHostBfgGameDetails <
  // GSH extends BfgGameStateForHost,
  // GSP extends BfgGameStateForPlayer,
  // GSW extends BfgGameStateForWatcher,
  // PGA extends BfgGameActionByPlayer,
  // HGA extends BfgGameActionByHost,
  // AllPGA extends AllPGAExt,
> extends IBfgGameDetailsBase {
  myHostProfile: PrivatePlayerProfile;
  latestHostGameEvent: GameTableEventForHostP2p;
  hostGameEvents: GameTableEventForHostP2p[];
  onHostAction: <HGA extends BfgGameActionByHost>(hostAction: HGA) => Promise<void>;
}


export interface IBfgGameTableForHost extends IBfgGameTableForUserBase {
  accessRole: 'host';
  myHostProfile: PrivatePlayerProfile;

  hostGameDetails: IHostBfgGameDetails;
  playerGameDetails: IPlayerBfgGameDetails | null;
}

export interface IBfgGameTableForPlayer extends IBfgGameTableForUserBase {
  accessRole: 'play';
  myPlayerProfile: PrivatePlayerProfile;

  playerGameDetails: IPlayerBfgGameDetails;
}

export interface IBfgGameTableForObserver <
  // GSH extends BfgGameStateForHost,
  // GSP extends BfgGameStateForPlayer,
  // GSW extends BfgGameStateForWatcher,
  // PGA extends BfgGameActionByPlayer,
  // HGA extends BfgGameActionByHost,
  // AllPGA extends AllPGAExt,
> extends IBfgGameTableForUserBase {
  accessRole: 'watch';
  myObserverProfile: PrivatePlayerProfile | null;

  // publicGameDetails: IPublicBfgGameDetails;
}

export type IBfgGameTableValue <
  // GSH extends BfgGameStateForHost,
  // GSP extends BfgGameStateForPlayer,
  // GSW extends BfgGameStateForWatcher,
  // PGA extends BfgGameActionByPlayer,
  // HGA extends BfgGameActionByHost,
  // AllPGA extends AllPGAExt,
> = IBfgGameTableForHost | IBfgGameTableForPlayer | IBfgGameTableForObserver;


export type IBfgGameRoomForRole <
  // GSH extends BfgGameStateForHost,
  // GSP extends BfgGameStateForPlayer,
  // GSW extends BfgGameStateForWatcher,
  // PGA extends BfgGameActionByPlayer,
  // HGA extends BfgGameActionByHost,
  // AllPGA extends AllPGAExt,
> = {
  role: 'host',
  gameRoom: IBfgGameTableForHost;
} | {
  role: 'play',
  gameRoom: IBfgGameTableForPlayer;
} | {
  role: 'watch',
  gameRoom: IBfgGameTableForObserver;
}
