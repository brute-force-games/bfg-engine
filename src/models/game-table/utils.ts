import { PeerId } from "@bfg-engine/hooks/p2p/p2p-types";
import { PublicPlayerProfile } from "../player-profile/public-player-profile";
import { PlayerProfileId } from "../types/bfg-branded-uuids";
import { GameRoomDb } from "./game-room-p2p";
import { GameTableActionSource, HostActionSources, PlayerActionSources } from "./game-table-event";


export const isHostActionSource = (source: GameTableActionSource | undefined): source is typeof HostActionSources[number] => { 
  return HostActionSources.includes(source as any);
}

export const isPlayerActionSource = (source: GameTableActionSource | undefined): source is typeof PlayerActionSources[number] => { 
  return PlayerActionSources.includes(source as any);
}

export const isProfileIdOkForPlayerAccess = (playerId: PlayerProfileId | null, gameTable: GameRoomDb): boolean => {
  if (!playerId) {
    return false;
  }

  return gameTable.players.some(player => player.playerProfileId === playerId);

  // return (
  //   playerId === gameTable.p1 ||
  //   playerId === gameTable.p2 ||
  //   playerId === gameTable.p3 ||
  //   playerId === gameTable.p4 ||
  //   playerId === gameTable.p5 ||
  //   playerId === gameTable.p6 ||
  //   playerId === gameTable.p7 ||
  //   playerId === gameTable.p8
  // );
}

export const isProfileOkForHostAccess = (playerProfile: PublicPlayerProfile, gameTable: GameRoomDb): boolean => {
  return playerProfile.id === gameTable.gameHostPlayerProfileId;
}


export const isMessageFromHost = (_peerId: PeerId): boolean => {
  return true;
  // return message.source === 'host';
}


// export const getTableAccessRoleForProfile = (
//   playerId: PlayerProfileId | null, 
//   gameTable: GameTable | null,
//   requestedRole: GameTableAccessRole
// ): GameTableAccessRole => {

//   if (!gameTable || !playerId) {
//     return 'observer';
//   }

//   const okForPlayerAccess = isProfileIdOkForPlayerAccess(playerId, gameTable);
//   const okForHostAccess = isProfileIdOkForHostAccess(playerId, gameTable);

//   if (requestedRole === 'player' && (
//       okForPlayerAccess || okForHostAccess))
//   {
//     return 'player';
//   }

//   if (requestedRole === 'host' && okForHostAccess) {
//     return 'host';
//   }
  
//   return 'observer';
// }


// export const hasTableAccessRoleForProfile = (
//   playerId: PlayerProfileId | null, 
//   gameTable: GameTable | null,
//   requestedRole: GameTableAccessRole
// ): boolean => {

//   if (!gameTable || !playerId) {
//     return false;
//   }

//   const okForPlayerAccess = isProfileIdOkForPlayerAccess(playerId, gameTable);
//   const okForHostAccess = isProfileIdOkForHostAccess(playerId, gameTable);

//   if (requestedRole === 'player' && (
//       okForPlayerAccess || okForHostAccess))
//   {
//     return true;
//   }

//   if (requestedRole === 'host' && okForHostAccess) {
//     return true;
//   }
  
//   return false;
// }