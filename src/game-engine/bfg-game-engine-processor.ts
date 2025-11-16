

// export interface IBfgCompleteGameEngineHandlers<
//   GSH extends BfgGameStateForHost,
//   // GSP extends BfgGameStateForPlayerSchema,
//   // GSW extends BfgGameStateForWatcherSchema,

//   // PGS extends BfgPublicGameImplState,
//   // GHS extends BfgHostGameImplState,
//   GPA extends BfgGameActionByPlayer,
//   GHA extends BfgGameActionByHost,
//   GHASchema extends z.ZodType<GHA>,

//   GPAO extends BfgGameSpecificPlayerActionOutcome,
//   GHAO extends BfgGameSpecificHostActionOutcome,
//   // PPK extends BfgPrivatePlayerKnowledgeImplState | null
// > {
//   gameTitle: BfgSupportedGameTitle,

//   createGameSpecificInitialAction: (gameTable: GameRoom, lobbyState: GameLobby) => BfgGameSpecificTableEvent<GHASchema>,
//   createGameSpecificInitialState: (gameTable: GameRoom, gameSpecificInitialAction: BfgGameSpecificTableEvent<GHASchema>) => GSH,

//   applyPlayerAction: (
//     tableState: GameRoom,
//     gameState: GSH,
//     playerAction: GPA
//   ) => Promise<GameTableEventResult<'player', GSH, GPAO>>,

//   applyHostAction: (
//     tableState: GameRoom,
//     gameState: GSH,
//     hostAction: GHA
//   ) => Promise<GameTableEventResult<'host', GSH, GHAO>>,

//   getNextToActPlayers: (gameTable: GameRoom, gameState: GSH) => GameTableSeat[],
//   getPlayerDetailsLine: (gameState: GSH, playerSeat: GameTableSeat) => React.ReactNode,

//   // getAllPlayersPrivateKnowledge: (gameTable: GameTable, gameState: GSH) => Map<GameTableSeat, PPK> | null,

//   summarizeGameEvent: (gameAction: DbGameTableEvent) => string,
// }


// export type IBfgAllPublicKnowledgeGameProcessor<
//   GHS extends BfgPublicGameImplState,
//   GPA extends BfgGameImplPlayerAction,
//   GPAO extends BfgGameSpecificPlayerActionOutcome,
//   GHA extends BfgGameImplHostAction,
//   GHAO extends BfgGameSpecificHostActionOutcome
// > = IBfgCompleteGameProcessor<GHS, GHS, GPA, GPAO, GHA, GHAO, never>
