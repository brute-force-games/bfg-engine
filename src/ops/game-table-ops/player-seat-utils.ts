import { GameTableActionSource } from "../../models/game-table/game-table-event";
import { PlayerProfileId } from "../../models/types/bfg-branded-uuids";
import { ALL_PLAYER_SEATS, PlayerSeat1, PlayerSeat2, PlayerSeat3, PlayerSeat4, PlayerSeat5, PlayerSeat6, PlayerSeat7, PlayerSeat8, } from "../../models/internal/game-room-base";
import { GameRoomDb } from "../../models/tinybase/game-room-db";
import { type GameRoomP2p } from "../../models/p2p/game-room-p2p";
import { GameTableSeat } from "../../models/internal/game-room-base";
import { PeerId } from "@bfg-engine/hooks/p2p/p2p-types";


export const getPlayerActionSource = (
  gameTable: GameRoomDb,
  playerId: PlayerProfileId
): GameTableActionSource => {

  const playerSeat = gameTable.players.find(player => player.playerProfileId === playerId);
  if (!playerSeat) {
    throw new Error("Player not found");
  }

  return `game-table-action-source-player-${playerSeat.role}` as GameTableActionSource;
//   if (gameTable.p1 === playerId) {
//     return `game-table-action-source-player-p1` as GameTableActionSource;
//   }
//   if (gameTable.p2 === playerId) {
//     return `game-table-action-source-player-p2` as GameTableActionSource;
//   }
//   if (gameTable.p3 === playerId) {
//     return `game-table-action-source-player-p3` as GameTableActionSource;
//   }
//   if (gameTable.p4 === playerId) {
//     return `game-table-action-source-player-p4` as GameTableActionSource;
//   }
//   if (gameTable.p5 === playerId) {
//     return `game-table-action-source-player-p5` as GameTableActionSource;
//   }
//   if (gameTable.p6 === playerId) {
//     return `game-table-action-source-player-p6` as GameTableActionSource;
//   }
//   if (gameTable.p7 === playerId) {
//     return `game-table-action-source-player-p7` as GameTableActionSource;
//   }
//   if (gameTable.p8 === playerId) {
//     return `game-table-action-source-player-p8` as GameTableActionSource;
//   }
  
//   throw new Error("Player not found");
}


export const getPlayerSeatForActionSource = (actionSource: GameTableActionSource): GameTableSeat => {
  switch (actionSource) {
    case `game-table-action-source-player-p1`:
      return PlayerSeat1;
    case `game-table-action-source-player-p2`:
      return PlayerSeat2;
    case `game-table-action-source-player-p3`:
      return PlayerSeat3;
    case `game-table-action-source-player-p4`:
      return PlayerSeat4;
    case `game-table-action-source-player-p5`:
      return PlayerSeat5;
    case `game-table-action-source-player-p6`:
      return PlayerSeat6;
    case `game-table-action-source-player-p7`:
      return PlayerSeat7;
    case `game-table-action-source-player-p8`:
      return PlayerSeat8;
    default:
      throw new Error(`Invalid action source: ${actionSource}`);
  }
}


export const isActionForMyPlayer = (actionSource: GameTableActionSource, playerId: PlayerProfileId, gameTable: GameRoomDb): boolean => {
  const playerSeat = gameTable.players.find(player => player.playerProfileId === playerId);
  if (!playerSeat) {
    return false;
  }

  return actionSource === `game-table-action-source-player-${playerSeat.role}`;

  // switch (actionSource) {
  //   case `game-table-action-source-player-p1`:
  //     return playerId === gameTable.p1;
  //   case `game-table-action-source-player-p2`:
  //     return playerId === gameTable.p2;
  //   case `game-table-action-source-player-p3`:
  //     return playerId === gameTable.p3;
  //   case `game-table-action-source-player-p4`:
  //     return playerId === gameTable.p4;
  //   case `game-table-action-source-player-p5`:
  //     return playerId === gameTable.p5;
  //   case `game-table-action-source-player-p6`:
  //     return playerId === gameTable.p6;
  //   case `game-table-action-source-player-p7`:
  //     return playerId === gameTable.p7;
  //   case `game-table-action-source-player-p8`:
  //     return playerId === gameTable.p8;
  //   default:
  //     return false;
  // }
}


export const isPlayerSeatedAtGameTable = (playerId: PlayerProfileId, gameTable: GameRoomDb): boolean => {
  return gameTable.players.some(player => player.playerProfileId === playerId);
  // return gameTable.p1 === playerId ||
  //   gameTable.p2 === playerId ||
  //   gameTable.p3 === playerId ||
  //   gameTable.p4 === playerId ||
  //   gameTable.p5 === playerId ||
  //   gameTable.p6 === playerId ||
  //   gameTable.p7 === playerId ||
  //   gameTable.p8 === playerId;
}


export const isPlayerAtGameTable = (playerId: PlayerProfileId, gameTable: GameRoomDb | null): boolean => {
  return matchPlayerToSeat(playerId, gameTable) !== null;
}


export const matchPlayerToSeat = (playerId: PlayerProfileId | null, gameTable: GameRoomDb | null): GameTableSeat | null => {
  if (!gameTable) {
    return null;
  }

  return gameTable.players.find(player => 
    player.playerProfileId === playerId)?.role ?? null;

  // if (gameTable.p1 === playerId) {
  //   return PlayerSeat1;
  // }
  // if (gameTable.p2 === playerId) {
  //   return PlayerSeat2;
  // }
  // if (gameTable.p3 === playerId) {
  //   return PlayerSeat3;
  // }
  // if (gameTable.p4 === playerId) {
  //   return PlayerSeat4;
  // }
  // if (gameTable.p5 === playerId) {
  //   return PlayerSeat5;
  // }
  // if (gameTable.p6 === playerId) {
  //   return PlayerSeat6;
  // }
  // if (gameTable.p7 === playerId) {
  //   return PlayerSeat7;
  // }
  // if (gameTable.p8 === playerId) {
  //   return PlayerSeat8;
  // }

  return null;
}


export const getActivePlayerSeatsForGameTable = (gameRoom: GameRoomP2p): GameTableSeat[] => {

  const playerSeats = ALL_PLAYER_SEATS.filter(seat => 
    gameRoom.players.some(player => player.role === seat));

  return playerSeats;
}


export const convertPlayerPoolToPlayerSeats = (playerPool: PlayerProfileId[]): GameTableSeat[] => {
  return playerPool.map((_, index) => ALL_PLAYER_SEATS[index]);
}


export const getPlayerIdForPlayerSeat = (playerSeat: GameTableSeat, gameTable: GameRoomDb): PlayerProfileId | null => {
  const player = gameTable.players.find(player => player.role === playerSeat);
  if (!player) {
    return null;
  }
  return player.playerProfileId;
  // const playerProfileId = gameTable[playerSeat];
  // if (!playerProfileId) {
  //   return null;
  // }
  // return playerProfileId;
}




export const getPeerIdForPlayerSeat = (
  playerSeat: GameTableSeat,
  gameTable: GameRoomDb,
  peerPlayerIds: Map<PeerId, PlayerProfileId>
): PeerId | null => {

  const seatPlayerProfileId = getPlayerIdForPlayerSeat(playerSeat, gameTable);
  if (!seatPlayerProfileId) {
    throw new Error('Player profile ID not found for player seat: ' + playerSeat);
  }

  // Use for...of loop instead of forEach so we can return properly
  for (const [peerId, playerProfileId] of peerPlayerIds.entries()) {
    if (seatPlayerProfileId === playerProfileId) {
      return peerId;
    }
  }
  
  console.warn('Peer ID not found for player seat:', playerSeat, 'with profile ID:', seatPlayerProfileId);
  console.warn('Available peer mappings:', Array.from(peerPlayerIds.entries()));
  return null;
}
