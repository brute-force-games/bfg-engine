import { GameTableActionSource } from "../../models/game-table/game-table-action";
import { PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { GameTable, PLAYER_SEATS } from "../../models/game-table/game-table";
import { GameTableSeat } from "../../models/game-table/game-table";
import { PeerId } from "~/hooks/p2p/p2p-types";


export const getPlayerActionSource = (
  gameTable: GameTable,
  playerId: PlayerProfileId
): GameTableActionSource => {

  if (gameTable.p1 === playerId) {
    return `game-table-action-source-player-p1` as GameTableActionSource;
  }
  if (gameTable.p2 === playerId) {
    return `game-table-action-source-player-p2` as GameTableActionSource;
  }
  if (gameTable.p3 === playerId) {
    return `game-table-action-source-player-p3` as GameTableActionSource;
  }
  if (gameTable.p4 === playerId) {
    return `game-table-action-source-player-p4` as GameTableActionSource;
  }
  if (gameTable.p5 === playerId) {
    return `game-table-action-source-player-p5` as GameTableActionSource;
  }
  if (gameTable.p6 === playerId) {
    return `game-table-action-source-player-p6` as GameTableActionSource;
  }
  if (gameTable.p7 === playerId) {
    return `game-table-action-source-player-p7` as GameTableActionSource;
  }
  if (gameTable.p8 === playerId) {
    return `game-table-action-source-player-p8` as GameTableActionSource;
  }
  
  throw new Error("Player not found");
}


export const getPlayerSeatForActionSource = (actionSource: GameTableActionSource): GameTableSeat => {
  switch (actionSource) {
    case `game-table-action-source-player-p1`:
      return 'p1';
    case `game-table-action-source-player-p2`:
      return 'p2';
    case `game-table-action-source-player-p3`:
      return 'p3';
    case `game-table-action-source-player-p4`:
      return 'p4';
    case `game-table-action-source-player-p5`:
      return 'p5';
    case `game-table-action-source-player-p6`:
      return 'p6';
    case `game-table-action-source-player-p7`:
      return 'p7';
    case `game-table-action-source-player-p8`:
      return 'p8';
    default:
      throw new Error(`Invalid action source: ${actionSource}`);
  }
}


export const isActionForMyPlayer = (actionSource: GameTableActionSource, playerId: PlayerProfileId, gameTable: GameTable): boolean => {
  switch (actionSource) {
    case `game-table-action-source-player-p1`:
      return playerId === gameTable.p1;
    case `game-table-action-source-player-p2`:
      return playerId === gameTable.p2;
    case `game-table-action-source-player-p3`:
      return playerId === gameTable.p3;
    case `game-table-action-source-player-p4`:
      return playerId === gameTable.p4;
    case `game-table-action-source-player-p5`:
      return playerId === gameTable.p5;
    case `game-table-action-source-player-p6`:
      return playerId === gameTable.p6;
    case `game-table-action-source-player-p7`:
      return playerId === gameTable.p7;
    case `game-table-action-source-player-p8`:
      return playerId === gameTable.p8;
    default:
      return false;
  }
}


export const isPlayerSeatedAtGameTable = (playerId: PlayerProfileId, gameTable: GameTable): boolean => {
  return gameTable.p1 === playerId ||
    gameTable.p2 === playerId ||
    gameTable.p3 === playerId ||
    gameTable.p4 === playerId ||
    gameTable.p5 === playerId ||
    gameTable.p6 === playerId ||
    gameTable.p7 === playerId ||
    gameTable.p8 === playerId;
}


export const isPlayerAtGameTable = (playerId: PlayerProfileId, gameTable: GameTable | null): boolean => {
  return matchPlayerToSeat(playerId, gameTable) !== null;
}


export const matchPlayerToSeat = (playerId: PlayerProfileId | null, gameTable: GameTable | null): GameTableSeat | null => {
  if (!gameTable) {
    return null;
  }

  if (gameTable.p1 === playerId) {
    return 'p1';
  }
  if (gameTable.p2 === playerId) {
    return 'p2';
  }
  if (gameTable.p3 === playerId) {
    return 'p3';
  }
  if (gameTable.p4 === playerId) {
    return 'p4';
  }
  if (gameTable.p5 === playerId) {
    return 'p5';
  }
  if (gameTable.p6 === playerId) {
    return 'p6';
  }
  if (gameTable.p7 === playerId) {
    return 'p7';
  }
  if (gameTable.p8 === playerId) {
    return 'p8';
  }

  return null;
}


export const getActivePlayerSeatsForGameTable = (gameTable: GameTable): GameTableSeat[] => {

  const playerSeats = PLAYER_SEATS.filter(seat => gameTable[seat] !== undefined);

  return playerSeats;
}


export const convertPlayerPoolToPlayerSeats = (playerPool: PlayerProfileId[]): GameTableSeat[] => {
  return playerPool.map((_, index) => PLAYER_SEATS[index]);
}


export const getPlayerIdForPlayerSeat = (playerSeat: GameTableSeat, gameTable: GameTable): PlayerProfileId | null => {
  const playerProfileId = gameTable[playerSeat];
  if (!playerProfileId) {
    return null;
  }
  return playerProfileId;
}


export const getPeerIdForPlayerSeat = (
  playerSeat: GameTableSeat,
  gameTable: GameTable,
  peerPlayerIds: Map<PeerId, PlayerProfileId>
): PeerId | null => {

  const seatPlayerProfileId = gameTable[playerSeat];
  if (!seatPlayerProfileId) {
    throw new Error('Player profile ID not found for player seat: ' + playerSeat);
  }

  peerPlayerIds.forEach((playerProfileId, peerId) => {
    if (seatPlayerProfileId === playerProfileId) {
      return peerId;
    }
  });
  
  console.warn('Player seat not found: ' + playerSeat);
  return null;
}
