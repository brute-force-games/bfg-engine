// import { BfgSupportedGameTitle } from "../game-box-definition";
// import { GameTable, GameTableSeat } from "../game-table/game-table";
// import { GameTableActionResult } from "../game-table/table-phase";
// import { BfgGameImplHostAction, BfgGameImplPlayerAction, BfgHostGameImplState, BfgPrivatePlayerKnowledgeImplState, BfgPublicGameImplState } from "./bfg-game-engine-types";
// import { GameLobby } from "../p2p-lobby";
// import { BfgGameSpecificHostActionOutcome, BfgGameSpecificPlayerActionOutcome, BfgGameSpecificTableAction, DbGameTableAction } from "../game-table/game-table-action";


// export interface IBfgGameProcessor<
//   PGS extends BfgPublicGameImplState,
//   GHS extends BfgHostGameImplState,
//   GPA extends BfgGameImplPlayerAction,
//   GPAO extends BfgGameSpecificPlayerActionOutcome | null,
//   GHA extends BfgGameImplHostAction,
//   GHAO extends BfgGameSpecificHostActionOutcome | null,
//   PPK extends BfgPrivatePlayerKnowledgeImplState | null
// > {
//   gameTitle: BfgSupportedGameTitle,

//   createGameSpecificInitialAction: (gameTable: GameTable, lobbyState: GameLobby) => BfgGameSpecificTableAction<GHA>,
//   createGameSpecificInitialState: (gameTable: GameTable, gameSpecificInitialAction: BfgGameSpecificTableAction<GHA>) => GHS,

//   applyPlayerAction: (
//     tableState: GameTable,
//     gameState: GHS,
//     playerAction: GPA
//   ) => Promise<GameTableActionResult<'player', GHS, GPAO>>,

//   applyHostAction: (
//     tableState: GameTable,
//     gameState: GHS,
//     hostAction: GHA
//   ) => Promise<GameTableActionResult<'host', GHS, GHAO>>,

//   getNextToActPlayers: (gameTable: GameTable, gameState: PGS) => GameTableSeat[],
//   getPlayerDetailsLine: (gameState: PGS, playerSeat: GameTableSeat) => React.ReactNode,

//   getAllPlayersPrivateKnowledge: (gameTable: GameTable, gameState: GHS) => Map<GameTableSeat, PPK> | null,

//   summarizeGameAction: (gameAction: DbGameTableAction) => string,
// }


// export type IBfgAllPublicKnowledgeGameProcessor<
//   GHS extends BfgPublicGameImplState,
//   GPA extends BfgGameImplPlayerAction,
//   GPAO extends BfgGameSpecificPlayerActionOutcome,
//   GHA extends BfgGameImplHostAction,
//   GHAO extends BfgGameSpecificHostActionOutcome
// > = IBfgGameProcessor<GHS, GHS, GPA, GPAO, GHA, GHAO, never>
