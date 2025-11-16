

// type InferHostGameState<Schema extends z.ZodTypeAny> = z.infer<Schema> & BfgGameStateForHost;
// type InferPublicGameState<Schema extends z.ZodTypeAny> = z.infer<Schema> & BfgGameStateForPlayer;
// type InferWatcherGameState<Schema extends z.ZodTypeAny> = z.infer<Schema> & BfgGameStateForWatcher;
// type InferPlayerAction<Schema extends z.ZodTypeAny> = z.infer<Schema> & BfgGameActionByPlayer;
// type InferHostAction<Schema extends z.ZodTypeAny> = z.infer<Schema> & BfgGameActionByHost;

// const createBfgGameDataEncoder = <
//   Schema extends z.ZodTypeAny,
//   TValue extends z.infer<Schema>
// >(
//   schema: Schema,
// ): IBfgDataEncoder<BfgDataEncoderFormat, TValue> => {
//   const encoder = createJsonZodObjectDataEncoder(schema);

//   return {
//     format: encoder.format,
//     encode: (data: TValue) => encoder.encode(data as z.infer<Schema>),
//     decode: (encoded) => {
//       const decoded = encoder.decode(encoded);
//       if (decoded === null) {
//         return null;
//       }

//       return decoded as TValue;
//     },
//   };
// };

// const getOccupiedSeats = (gameTable: GameTable): GameTableSeat[] => {
//   // const seatAssignments = [
//   //   { seat: ALL_PLAYER_SEATS[0] as GameTableSeat, playerId: gameTable.p1 },
//   //   { seat: ALL_PLAYER_SEATS[1] as GameTableSeat, playerId: gameTable.p2 },
//   //   { seat: ALL_PLAYER_SEATS[2] as GameTableSeat, playerId: gameTable.p3 },
//   //   { seat: ALL_PLAYER_SEATS[3] as GameTableSeat, playerId: gameTable.p4 },
//   //   { seat: ALL_PLAYER_SEATS[4] as GameTableSeat, playerId: gameTable.p5 },
//   //   { seat: ALL_PLAYER_SEATS[5] as GameTableSeat, playerId: gameTable.p6 },
//   //   { seat: ALL_PLAYER_SEATS[6] as GameTableSeat, playerId: gameTable.p7 },
//   //   { seat: ALL_PLAYER_SEATS[7] as GameTableSeat, playerId: gameTable.p8 },
//   // ];

//   // return seatAssignments
//   //   .filter(({ playerId }) => playerId !== undefined)
//   //   .map(({ seat }) => seat);

//   return gameTable.players.map((player) => player.role);
// };

// export const createPublicKnowledgeGameMetadata = <
//   HostGameStateSchema extends z.ZodType<BfgGameStateForHost>,
//   PublicGameStateSchema extends z.ZodType<BfgGameStateForPlayer>,
//   PlayerActionSchema extends z.ZodType<BfgGameActionByPlayer>,
//   HostActionSchema extends z.ZodType<BfgGameActionByHost>,
//   TProcessor extends IBfgGameProcessor<InferHostAction<HostActionSchema>, HostGameStateSchema>,
//   TComponents extends IBfgGameEngineComponents<
//     InferHostGameState<HostGameStateSchema>,
//     InferPublicGameState<PublicGameStateSchema>,
//     InferWatcherGameState<PublicGameStateSchema>,
//     InferPlayerAction<PlayerActionSchema>,
//     InferHostAction<HostActionSchema>
//   >,
// >(
//   gameTitle: BfgSupportedGameTitle,
//   definition: GameDefinition,
//   zodSchemas: BfgGameEngineSchemas<
//     HostGameStateSchema,
//     PublicGameStateSchema,
//     PlayerActionSchema,
//     HostActionSchema
//   >,
//   gameProcessor: TProcessor,
//   components: TComponents,
// ): IBfgGameCompleteMetadata<
//   InferHostGameState<HostGameStateSchema>,
//   InferPublicGameState<PublicGameStateSchema>,
//   InferWatcherGameState<PublicGameStateSchema>,
//   InferPlayerAction<PlayerActionSchema>,
//   InferHostAction<HostActionSchema>
// > => {
//   type HostGameState = InferHostGameState<HostGameStateSchema>;
//   type PlayerGameState = InferPublicGameState<PublicGameStateSchema>;
//   type WatcherGameState = InferWatcherGameState<PublicGameStateSchema>;
//   type PlayerAction = InferPlayerAction<PlayerActionSchema>;
//   type HostAction = InferHostAction<HostActionSchema>;

//   const ensurePublicState = (hostState: HostGameState): PlayerGameState => {
//     const parsed = zodSchemas.publicGameStateSchema.safeParse(hostState);
//     if (!parsed.success) {
//       throw new Error(
//         `Host state is not compatible with public game state schema for ${gameTitle}: ${parsed.error.message}`,
//       );
//     }
//     return parsed.data as PlayerGameState;
//   };

//   const schemas: BfgEngineMetadataSchemas<
//     HostGameStateSchema,
//     PublicGameStateSchema,
//     WatcherGameStateSchema,
//     GameEventSchema,
//     GameEventOutcomeSchema,
//     // HostActionSchema,
//   > = {
//     hostGameStateSchema: zodSchemas.hostGameStateSchema,
//     playerGameStateSchema: zodSchemas.publicGameStateSchema,
//     watcherGameStateSchema: zodSchemas.publicGameStateSchema,
//   };

//   const encoders: IBfgEngineMetadataEncoders<
//     HostGameState,
//     PlayerGameState,
//     WatcherGameState,
//     PlayerAction,
//     HostAction
//   > = {
//     hostGameStateEncoder: createBfgGameDataEncoder<HostGameStateSchema, HostGameState>(
//       zodSchemas.hostGameStateSchema,
//     ),
//     playerGameStateEncoder: createBfgGameDataEncoder<PublicGameStateSchema, PlayerGameState>(
//       zodSchemas.publicGameStateSchema,
//     ),
//     watcherGameStateEncoder: createBfgGameDataEncoder<PublicGameStateSchema, WatcherGameState>(
//       zodSchemas.publicGameStateSchema,
//     ),
//     playerActionEncoder: createBfgGameDataEncoder<PlayerActionSchema, PlayerAction>(
//       zodSchemas.playerActionSchema,
//     ),
//     hostActionEncoder: createBfgGameDataEncoder<HostActionSchema, HostAction>(
//       zodSchemas.hostActionSchema,
//     ),
//   };

//   const accessLevelConverters: IBfgGameEngineAccessLevelConverters<
//     HostGameState,
//     PlayerGameState,
//     WatcherGameState
//   > = {
//     hostToPlayerSeatGameStates: (
//       gameTable: GameTable,
//       hostState: HostGameState,
//     ): PlayerSeatGameState<PlayerGameState>[] => {
//       const playerGameState = ensurePublicState(hostState);
//       return getOccupiedSeats(gameTable).map((seat) => ({
//         playerSeat: seat,
//         playerGameState,
//       }));
//     },
//     hostToWatcherAccessLevel: (hostState: HostGameState): WatcherGameState => {
//       return ensurePublicState(hostState) as WatcherGameState;
//     },
//   };

//   const metadata: IBfgGameCompleteMetadata<
//     HostGameState,
//     PlayerGameState,
//     WatcherGameState,
//     PlayerAction,
//     HostAction
//   > = {
//     metadataType: "public-knowledge-game",
//     gameTitle,
//     definition,
//     schemas,
//     encoders,
//     accessLevelConverters,
//     gameProcessor,
//     components,
//   };

//   return metadata;
// };

// export type PublicKnowledgeGameMetadata = ReturnType<typeof createPublicKnowledgeGameMetadata>;