

// updatedGameState: BfgGameStateForPlayerSchema,
// watcherSummary: BfgGameActionPublicOutcomeStrSchema,
// playerSeatSummaries: z.record(GameTableSeatSchema, BfgGameActionPlayerOutcomeStrSchema),
// hostSummary: BfgGameActionHostOutcomeStrSchema,


// export const createPlayerActionDefinition = <
//   GSH extends BfgGameStateForHost,
//   // GPAExt,
//   GPAO extends BfgGameSpecificPlayerActionOutcome,
// >(
//   actionSchema: PGAExt,
//   gameChanger: (tableState: GameRoom, gameState: GSH, action: z.infer<PGAExt>) => Promise<GSH>,
//   actionHandler: (tableState: GameRoom, gameState: GSH, action: z.infer<PGAExt>) => Promise<GPAO>,
// ) => {

//   // type InferredActionType = z.infer<PGAExt>;

//   return {
//     actionSchema,
//     gameChanger,
//     actionHandler,
//   };
// };

// export type PlayerActionDefinition<
//   GSH extends BfgGameStateForHost,
//   GPAO extends BfgGameSpecificPlayerActionOutcome,
// > = ReturnType<typeof createPlayerActionDefinition<GSH, GPAO>>;



// export const createHostActionDefinition = <
//   GSH extends BfgGameStateForHost,
//   HostAction extends BfgGameActionByHost,
//   GHAO,
// >(
//   actionSchema: z.ZodType<HostAction>,
//   gameChanger: (tableState: GameRoom, gameState: GSH, action: HostAction) => Promise<GSH>,
//   actionHandler: (tableState: GameRoom, gameState: GSH, action: HostAction) => Promise<GHAO>,
// ) => {

//   return {
//     actionSchema,
//     gameChanger,
//     actionHandler,
//   };
// };

// export type HostActionDefinition<
//   GSH extends BfgGameStateForHost,
//   HostAction extends BfgGameActionByHost,
//   GHAO extends BfgGameSpecificHostActionOutcome,
// > = ReturnType<typeof createHostActionDefinition<GSH, HostAction, GHAO>>;
