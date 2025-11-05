import { BfgSupportedGameTitle } from "../game-box-definition";
import { GameTable, GameTableSeat } from "../game-table/game-table";
import { GameTableActionResult } from "../game-table/table-phase";
import { BfgGameImplHostAction, BfgGameImplPlayerAction, BfgHostGameImplState, BfgPrivatePlayerKnowledgeImplState } from "./bfg-game-engine-types";
import { GameLobby } from "../p2p-lobby";
import { BfgGameSpecificTableAction } from "../game-table/game-table-action";


export interface IBfgGameProcessor<
  GHS extends BfgHostGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction,
  PPK extends BfgPrivatePlayerKnowledgeImplState
> {
  gameTitle: BfgSupportedGameTitle,

  createGameSpecificInitialAction: (gameTable: GameTable, lobbyState: GameLobby) => BfgGameSpecificTableAction<GHA>,
  createGameSpecificInitialState: (gameTable: GameTable, gameSpecificInitialAction: BfgGameSpecificTableAction<GHA>) => GHS,

  applyPlayerAction: (
    tableState: GameTable,
    gameState: GHS,
    playerAction: GPA
  ) => Promise<GameTableActionResult<GHS>>,

  applyHostAction: (
    tableState: GameTable,
    gameState: GHS,
    hostAction: GHA
  ) => Promise<GameTableActionResult<GHS>>,

  getNextToActPlayers: (gameTable: GameTable, gameState: GHS) => GameTableSeat[],
  getPlayerDetailsLine: (gameState: GHS, playerSeat: GameTableSeat) => React.ReactNode,

  getAllPlayersPrivateKnowledge: (gameTable: GameTable, gameState: GHS) => Map<GameTableSeat, PPK> | null,
}


export type IBfgAllPublicKnowledgeGameProcessor<
  GHS extends BfgHostGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction
> = IBfgGameProcessor<GHS, GPA, GHA, never>
