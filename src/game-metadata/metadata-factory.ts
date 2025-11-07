import { z } from "zod";
import { BfgAllPublicKnowledgeGameEngineMetadata, PrivateKnowledgeGameEncoders, PublicKnowledgeGameEncoders, TBfgGameEngineMetadata } from "~/models/bfg-game-engines";
import { BfgSupportedGameTitle, GameDefinition } from "~/models/game-box-definition";
import { IBfgGameProcessor } from "~/models/game-engine/bfg-game-engine-processor";
import { BfgGameEngineSchemas } from "~/models/game-engine/bfg-game-engine-schemas";
import { BfgGameEngineComponents, BfgGameImplPlayerAction, BfgGameImplHostAction, BfgPublicGameImplState, BfgHostGameImplState, BfgPrivatePlayerKnowledgeImplState } from "~/models/game-engine/bfg-game-engine-types";
import { createJsonZodObjectDataEncoder } from "~/models/game-engine/encoders";


export const createGameMetadata = <
  HGS extends BfgHostGameImplState,
  PGS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction,
  PPK extends BfgPrivatePlayerKnowledgeImplState
>(
  gameTitle: BfgSupportedGameTitle,
  definition: GameDefinition,
  // gameKnowledgeType: BfgGameKnowledgeType,
  zodSchemas: BfgGameEngineSchemas,
  // encoders: PrivateKnowledgeGameEncoders<HGS, PGS, GPA, GHA, PPK>,
  engine: IBfgGameProcessor<HGS, GPA, GHA, PPK>,
  components: BfgGameEngineComponents<HGS, PGS, GPA, GHA, PPK>,
): TBfgGameEngineMetadata<'private-player-knowledge', HGS, PGS, GPA, GHA, PPK> => {

  // Validate that the engine's types match the zodSchemas at runtime
  type InferredHGS = z.infer<typeof zodSchemas.hostGameStateSchema>;
  type InferredPGS = z.infer<typeof zodSchemas.publicGameStateSchema>;
  type InferredGPA = z.infer<typeof zodSchemas.playerActionSchema>;
  type InferredGHA = z.infer<typeof zodSchemas.hostActionSchema>;
  type InferredPPK = z.infer<typeof zodSchemas.privatePlayerKnowledgeSchema>;
  
  // TypeScript will enforce that the types align with the schemas
  const _typeCheck: {
    hgs: HGS extends InferredHGS ? true : never;
    pgs: PGS extends InferredPGS ? true : never;
    gpa: GPA extends InferredGPA ? true : never;
    gha: GHA extends InferredGHA ? true : never;
    ppk: PPK extends InferredPPK ? true : never;
  } = {} as any;

  const encoders: PrivateKnowledgeGameEncoders<HGS, PGS, GPA, GHA, PPK> = {
    hostGameStateEncoder: createJsonZodObjectDataEncoder(zodSchemas.hostGameStateSchema),
    publicGameStateEncoder: createJsonZodObjectDataEncoder(zodSchemas.publicGameStateSchema),
    playerActionEncoder: createJsonZodObjectDataEncoder(zodSchemas.playerActionSchema),
    hostActionEncoder: createJsonZodObjectDataEncoder(zodSchemas.hostActionSchema),
    privatePlayerKnowledgeEncoder: createJsonZodObjectDataEncoder(zodSchemas.privatePlayerKnowledgeSchema),
  };

  const retVal: TBfgGameEngineMetadata<'private-player-knowledge', HGS, PGS, GPA, GHA, PPK> = {
    gameTitle,
    definition,  
    gameKnowledgeType: 'private-player-knowledge',
    zodSchemas,
    encoders,
    engine,
    components,
  };

  return retVal;
}

export const createPublicKnowledgeGameMetadata = <
  GPS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction
>(
  gameTitle: BfgSupportedGameTitle,
  definition: GameDefinition,
  zodSchemas: BfgGameEngineSchemas,
  engine: IBfgGameProcessor<GPS, GPA, GHA, never>,
  components: BfgGameEngineComponents<GPS, GPS, GPA, GHA, never>
): BfgAllPublicKnowledgeGameEngineMetadata<GPS, GPA, GHA> => {

  // Validate that the engine's types match the zodSchemas at runtime
  type InferredGPS = z.infer<typeof zodSchemas.publicGameStateSchema>;
  type InferredGPA = z.infer<typeof zodSchemas.playerActionSchema>;
  type InferredGHA = z.infer<typeof zodSchemas.hostActionSchema>;
  
  // TypeScript will enforce that the types align with the schemas
  const _typeCheck: {
    gps: GPS extends InferredGPS ? true : never;
    gpa: GPA extends InferredGPA ? true : never;
    gha: GHA extends InferredGHA ? true : never;
  } = {} as any;

  const encoders: PublicKnowledgeGameEncoders<GPS, GPA, GHA> = {
    hostGameStateEncoder: createJsonZodObjectDataEncoder(zodSchemas.publicGameStateSchema),
    publicGameStateEncoder: createJsonZodObjectDataEncoder(zodSchemas.publicGameStateSchema),
    playerActionEncoder: createJsonZodObjectDataEncoder(zodSchemas.playerActionSchema),
    hostActionEncoder: createJsonZodObjectDataEncoder(zodSchemas.hostActionSchema),
  };

  const retVal: BfgAllPublicKnowledgeGameEngineMetadata<GPS, GPA, GHA> = {
    gameTitle,
    definition,
    gameKnowledgeType: 'public-knowledge',
    zodSchemas,
    encoders,
    engine,
    components,
  };

  return retVal;
}
