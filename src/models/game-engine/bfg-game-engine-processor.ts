import { z } from "zod";
import { BfgSupportedGameTitle } from "../game-box-definition";
import { GameTable, GameTableSeat } from "../game-table/game-table";
import { GameTableActionResult } from "../game-table/table-phase";
import { BfgAllPublicKnowledgeGameEngineComponents, BfgGameImplHostAction, BfgGameImplPlayerAction, BfgPublicGameImplState } from "./bfg-game-engine-types";
import { GameLobby } from "../p2p-lobby";
import { BfgGameSpecificTableAction } from "../game-table/game-table-action";


export interface IBfgAllPublicKnowledgeGameProcessor<
  GIS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction
> {
  gameTitle: BfgSupportedGameTitle,

  createGameSpecificInitialAction: (gameTable: GameTable, lobbyState: GameLobby) => BfgGameSpecificTableAction<GHA>,
  createGameSpecificInitialState: (gameTable: GameTable, gameSpecificInitialAction: BfgGameSpecificTableAction<GHA>) => GIS,

  applyPlayerAction: (
    tableState: GameTable,
    gameState: GIS,
    playerAction: GPA
  ) => Promise<GameTableActionResult<GIS>>,

  applyHostAction: (
    tableState: GameTable,
    gameState: GIS,
    hostAction: GHA
  ) => Promise<GameTableActionResult<GIS>>,

  getNextToActPlayers: (gameTable: GameTable, gameState: GIS) => GameTableSeat[],
  getPlayerDetailsLine: (gameState: GIS, playerSeat: GameTableSeat) => React.ReactNode,
}


export interface IBfgAllPublicKnowledgeGameEngine<
  GIS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction
> {
  gameTitle: BfgSupportedGameTitle,
  
  gameSpecificStateSchema: z.ZodType<GIS>,
  playerActionSchema: z.ZodType<GPA>,
  hostActionSchema: z.ZodType<GHA>,

  processor: IBfgAllPublicKnowledgeGameProcessor<GIS, GPA, GHA>,
  components: BfgAllPublicKnowledgeGameEngineComponents<GIS, GPA, GHA>,
}
