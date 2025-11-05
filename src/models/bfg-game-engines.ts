import { BfgSupportedGameTitle, GameDefinition } from "../models/game-box-definition";
import { IBfgGameProcessor } from "./game-engine/bfg-game-engine-processor";
import { BfgGameEngineSchemas } from "./game-engine/bfg-game-engine-schemas";
import { BfgGameEngineComponents, BfgGameImplHostAction, BfgGameImplPlayerAction, BfgHostGameImplState, BfgPrivatePlayerKnowledgeImplState, BfgPublicGameImplState } from "./game-engine/bfg-game-engine-types";
import { IBfgDataEncoder } from "./game-engine/encoders";
import { BfgDataEncoderFormat } from "./game-engine/encoders";


export interface PublicKnowledgeGameEncoders<
  PGS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction,
> {
  publicGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, PGS>;
  hostGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, PGS>;
  playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPA>;
  hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GHA>;
}

export interface PrivateKnowledgeGameEncoders<
  HGS extends BfgHostGameImplState,
  PGS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction,
  PPK extends BfgPrivatePlayerKnowledgeImplState,
> {
  publicGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, PGS>;
  hostGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, HGS>;
  playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPA>;
  hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GHA>;
  privatePlayerKnowledgeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, PPK>;
}


export type BfgGameKnowledgeType = 'public-knowledge' | 'private-player-knowledge';

export type TBfgGameEngineMetadata<
  GkType extends BfgGameKnowledgeType,
  HGS extends BfgHostGameImplState,
  PGS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction,
  PPK extends BfgPrivatePlayerKnowledgeImplState,
> = {
  definition: GameDefinition;
  
  gameTitle: BfgSupportedGameTitle,

  gameKnowledgeType: GkType;

  zodSchemas: BfgGameEngineSchemas;

  encoders: GkType extends 'public-knowledge' ? 
    PublicKnowledgeGameEncoders<PGS, GPA, GHA> :
    GkType extends 'private-player-knowledge' ?
      PrivateKnowledgeGameEncoders<HGS, PGS, GPA, GHA, PPK> :
      never;

  engine: IBfgGameProcessor<HGS, GPA, GHA, PPK>,
  components: BfgGameEngineComponents<HGS, GPA, GHA, PPK>,
}


// export type BfgAllPublicKnowledgeGameEngineMetadata<
//   GPS extends BfgPublicGameImplState,
//   GPA extends BfgGameImplPlayerAction,
//   GHA extends BfgGameImplHostAction,
// > = {
//   definition: GameDefinition;
  
//   gameTitle: BfgSupportedGameTitle,
  
//   hostGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPS>;
//   // publicGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPS>;
//   playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPA>;
//   hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GHA>;

//   engine: IBfgGameProcessor<GPS, GPA, GHA, never>,
//   components: BfgGameEngineComponents<GPS, GPA, GHA, never>,
// };


// export type BfgAllPublicKnowledgeGameEngineMetadata<
//   GPS extends BfgPublicGameImplState,
//   GPA extends BfgGameImplPlayerAction,
//   GHA extends BfgGameImplHostAction,
// > = BfgGameEngineMetadata<'public-knowledge', GPS, GPS, GPA, GHA, never> & {
//   definition: GameDefinition;
  
//   gameTitle: BfgSupportedGameTitle,
  
//   // hostGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPS>;
//   // // publicGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPS>;
//   // playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPA>;
//   // hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GHA>;

//   engine: IBfgGameProcessor<GPS, GPA, GHA, never>,
//   components: BfgGameEngineComponents<GPS, GPA, GHA, never>,
// };


export type BfgAllPublicKnowledgeGameEngineMetadata<
  GPS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction,
> = TBfgGameEngineMetadata<'public-knowledge', GPS, GPS, GPA, GHA, never>



export type PublicKnowledgeBfgGameEngineMetadata = TBfgGameEngineMetadata<
  'public-knowledge',
  BfgHostGameImplState,
  BfgPublicGameImplState,
  BfgGameImplPlayerAction,
  BfgGameImplHostAction,
  BfgPrivatePlayerKnowledgeImplState
>;


export type PrivatePlayerKnowledgeBfgGameEngineMetadata = TBfgGameEngineMetadata<
  'private-player-knowledge',
  BfgHostGameImplState,
  BfgPublicGameImplState,
  BfgGameImplPlayerAction,
  BfgGameImplHostAction,
  BfgPrivatePlayerKnowledgeImplState
>;


export type BfgGameEngineMetadata = PublicKnowledgeBfgGameEngineMetadata | PrivatePlayerKnowledgeBfgGameEngineMetadata;
