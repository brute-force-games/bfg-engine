import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile";
import { PeerId, PrivatePlayerKnowledgeStr } from "../p2p-types";
import { ConnectionEvent } from "../p2p-types";
import { GameTableId, PlayerProfileId } from "~/models/types/bfg-branded-ids";
import { BfgGameEngineMetadata } from "~/models/bfg-game-engines";
import { GameTableAccessRole } from "~/models/game-roles";
import { GameTable, GameTableSeat } from "~/models/game-table/game-table";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { PrivatePlayerProfile } from "~/models/player-profile/private-player-profile";
import { BfgGameImplHostAction, BfgGameImplPlayerAction } from "~/models/game-engine/bfg-game-engine-types";


export interface IP2pDetails {
  // room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  peerIds: PeerId[];
  peerPlayerIds: Map<PeerId, PlayerProfileId>
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
}


export interface IBfgGameRoomForUserBase {
  gameTableId: GameTableId;
  gameMetadata: BfgGameEngineMetadata | null;
  
  accessRole: GameTableAccessRole;
  maxAllowedAccessRole: GameTableAccessRole;
  allowedRoles: GameTableAccessRole[];
  
  p2pDetails: IP2pDetails;
  publicGameDetails: IPublicBfgGameDetails | null;
}



export interface IBfgGameDetailsBase {

  // maxAllowedRole: GameTableAccessRole;
  // allowedRoles: GameTableAccessRole[];
  // p2pDetails: IP2pDetails;


  // // room: Room
  // connectionStatus: string
  // connectionEvents: ConnectionEvent[]

  // peers: PeerId[];
  // peerPlayerIds: Map<PeerId, PlayerProfileId>
  // allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  gameMetadata: BfgGameEngineMetadata | null;
  gameTable: GameTable | null;
  gameActions: DbGameTableAction[];

  // myPlayerProfile: PrivatePlayerProfile | null;
  // hasRequestedTableAccess: boolean;
  // myGameTableAccess: GameTableAccessRole;

  // setRoomEventHandlers: (eventHandlers: IP2pGameRoomEventHandlers) => void
  // clearRoomEventHandlers: () => void

  // const [txGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
  // const [txGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);

  // txPublicGameTableData: (gameTable: GameTable) => void
  // txPublicGameActionsData: (gameActions: DbGameTableAction[]) => void

  // txPlayerActionStr: (actionStr: PlayerP2pActionStr) => void
  // rxPlayerActionStr: (callback: (actionStr: PlayerP2pActionStr, peer: PeerId) => void) => void
  
  // txPrivatePlayerKnowledgeStr: (privatePlayerKnowledge: PrivatePlayerKnowledgeStr, peer: PeerId) => void
  // rxPrivatePlayerKnowledgeStr: (callback: (privatePlayerKnowledge: PrivatePlayerKnowledgeStr, peer: PeerId) => void) => void
  
  // refreshConnection: () => void
}

export interface IPublicBfgGameDetails extends IBfgGameDetailsBase {
  gameTable: GameTable;
  gameActions: DbGameTableAction[];
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;

  // myObserverProfile: PrivatePlayerProfile | null;
}

export interface IPlayerBfgGameDetails extends IPublicBfgGameDetails {
  myPlayerProfile: PrivatePlayerProfile;
  myPlayerSeat: GameTableSeat;
  myPrivatePlayerKnowledgeStr: PrivatePlayerKnowledgeStr | null;
  onPlayerAction: (playerAction: BfgGameImplPlayerAction) => Promise<void>;
}

export interface IHostBfgGameDetails extends IBfgGameDetailsBase {
  myHostProfile: PrivatePlayerProfile;
  onHostAction: (hostAction: BfgGameImplHostAction) => Promise<void>;
}


export interface IBfgGameRoomForHost extends IBfgGameRoomForUserBase {
  accessRole: 'host';
  myHostProfile: PrivatePlayerProfile;

  hostGameDetails: IHostBfgGameDetails;
  playerGameDetails: IPlayerBfgGameDetails;
}

export interface IBfgGameRoomForPlayer extends IBfgGameRoomForUserBase {
  accessRole: 'play';
  myPlayerProfile: PrivatePlayerProfile;

  playerGameDetails: IPlayerBfgGameDetails;
}

export interface IBfgGameRoomForObserver extends IBfgGameRoomForUserBase {
  accessRole: 'watch';
  myObserverProfile: PrivatePlayerProfile | null;

  // publicGameDetails: IPublicBfgGameDetails;
}

export type IBfgGameRoomValue = IBfgGameRoomForHost | IBfgGameRoomForPlayer | IBfgGameRoomForObserver;
