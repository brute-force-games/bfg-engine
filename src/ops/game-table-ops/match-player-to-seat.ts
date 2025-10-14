// import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-ids";
// import { GameTable, GameTableSeat } from "@bfg-engine/models/game-table/game-table";


// export const isPlayerAtGameTable = (playerId: PlayerProfileId, gameTable: GameTable): boolean => {
//   return matchPlayerToSeat(playerId, gameTable) !== undefined;
// }


// export const matchPlayerToSeat = (playerId: PlayerProfileId, gameTable: GameTable): GameTableSeat | undefined => {
//   if (gameTable.p1 === playerId) {
//     return 'p1';
//   }
//   if (gameTable.p2 === playerId) {
//     return 'p2';
//   }
//   if (gameTable.p3 === playerId) {
//     return 'p3';
//   }
//   if (gameTable.p4 === playerId) {
//     return 'p4';
//   }
//   if (gameTable.p5 === playerId) {
//     return 'p5';
//   }
//   if (gameTable.p6 === playerId) {
//     return 'p6';
//   }
//   if (gameTable.p7 === playerId) {
//     return 'p7';
//   }
//   if (gameTable.p8 === playerId) {
//     return 'p8';
//   }
//   return undefined;
// }
