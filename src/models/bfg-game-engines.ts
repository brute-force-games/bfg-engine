// import { BfgGameImplHostAction, BfgGameImplPlayerAction, BfgHostGameImplState, BfgPrivatePlayerKnowledgeImplState, BfgPublicGameImplState } from "./game-engine/bfg-game-engine-types";
// import { IBfgDataEncoder } from "./game-engine/encoders";
// import { BfgDataEncoderFormat } from "./game-engine/encoders";
// import { BfgGameSpecificHostActionOutcome, BfgGameSpecificPlayerActionOutcome } from "./game-table/game-table-action";


// export interface PublicKnowledgeGameEncoders<
//   PGS extends BfgPublicGameImplState,
//   GPA extends BfgGameImplPlayerAction,
//   GPAO extends BfgGameSpecificPlayerActionOutcome | null,
//   GHA extends BfgGameImplHostAction,
//   GHAO extends BfgGameSpecificHostActionOutcome | null,
// > {
//   publicGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, PGS>;
//   hostGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, PGS>;
//   playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPA>;
//   hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GHA>;
//   playerActionOutcomeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPAO> | null;
//   hostActionOutcomeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GHAO> | null;
//   privatePlayerKnowledgeEncoder: null;
// }

// export interface PrivateKnowledgeGameEncoders<
//   HGS extends BfgHostGameImplState,
//   PGS extends BfgPublicGameImplState,
//   GPA extends BfgGameImplPlayerAction,
//   GPAO extends BfgGameSpecificPlayerActionOutcome | null,
//   GHA extends BfgGameImplHostAction,
//   GHAO extends BfgGameSpecificHostActionOutcome | null,
//   PPK extends BfgPrivatePlayerKnowledgeImplState | null,
// > {
//   publicGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, PGS>;
//   hostGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, HGS>;
//   playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPA>;
//   hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GHA>;
//   playerActionOutcomeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPAO> | null;
//   hostActionOutcomeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GHAO> | null;
//   privatePlayerKnowledgeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, PPK>;
// }


// // export type BfgGameKnowledgeType = 'public-knowledge' | 'private-player-knowledge';

// // export type TBfgGameEngineMetadata<
// //   GkType extends BfgGameKnowledgeType,
// //   HGS extends BfgHostGameImplState,
// //   PGS extends BfgPublicGameImplState,
// //   GPA extends BfgGameImplPlayerAction,
// //   GPAO extends BfgGameSpecificPlayerActionOutcome | null,
// //   GHA extends BfgGameImplHostAction,
// //   GHAO extends BfgGameSpecificHostActionOutcome | null,
// //   PPK extends BfgPrivatePlayerKnowledgeImplState | null,
// // > = {
// //   definition: GameDefinition;
  
// //   gameTitle: BfgSupportedGameTitle,

// //   gameKnowledgeType: GkType;

// //   zodSchemas: BfgGameEngineSchemas;

// //   encoders: GkType extends 'public-knowledge' ? 
// //     PublicKnowledgeGameEncoders<PGS, GPA, GPAO, GHA, GHAO> :
// //     GkType extends 'private-player-knowledge' ?
// //       PrivateKnowledgeGameEncoders<HGS, PGS, GPA, GPAO, GHA, GHAO, PPK> :
// //       never;

// //   engine: IBfgGameProcessor<PGS, HGS, GPA, GPAO, GHA, GHAO, PPK>,
// //   components: BfgGameEngineComponents<HGS, PGS, GPA, GHA, PPK>,
// // }


// // export type BfgAllPublicKnowledgeGameEngineMetadata<
// //   GPS extends BfgPublicGameImplState,
// //   GPA extends BfgGameImplPlayerAction,
// //   GHA extends BfgGameImplHostAction,
// // > = {
// //   definition: GameDefinition;
  
// //   gameTitle: BfgSupportedGameTitle,
  
// //   hostGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPS>;
// //   // publicGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPS>;
// //   playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPA>;
// //   hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GHA>;

// //   engine: IBfgGameProcessor<GPS, GPA, GHA, never>,
// //   components: BfgGameEngineComponents<GPS, GPA, GHA, never>,
// // };


// // export type BfgAllPublicKnowledgeGameEngineMetadata<
// //   GPS extends BfgPublicGameImplState,
// //   GPA extends BfgGameImplPlayerAction,
// //   GHA extends BfgGameImplHostAction,
// // > = BfgGameEngineMetadata<'public-knowledge', GPS, GPS, GPA, GHA, never> & {
// //   definition: GameDefinition;
  
// //   gameTitle: BfgSupportedGameTitle,
  
// //   // hostGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPS>;
// //   // // publicGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPS>;
// //   // playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPA>;
// //   // hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GHA>;

// //   engine: IBfgGameProcessor<GPS, GPA, GHA, never>,
// //   components: BfgGameEngineComponents<GPS, GPA, GHA, never>,
// // };


// // export type BfgAllPublicKnowledgeGameEngineMetadata<
// //   GPS extends BfgPublicGameImplState,
// //   GPA extends BfgGameImplPlayerAction,
// //   GHA extends BfgGameImplHostAction,
// //   GPAO extends BfgGameSpecificPlayerActionOutcome | null,
// //   GHAO extends BfgGameSpecificHostActionOutcome | null,
// // > = TBfgGameEngineMetadata<'public-knowledge', GPS, GPS, GPA, GPAO, GHA, GHAO, null>



// // export type PublicKnowledgeBfgGameEngineMetadata<
// //   PGS extends BfgPublicGameImplState = BfgPublicGameImplState,
// //   GPA extends BfgGameImplPlayerAction = BfgGameImplPlayerAction,
// //   GHA extends BfgGameImplHostAction = BfgGameImplHostAction,
// //   GPAO extends BfgGameSpecificPlayerActionOutcome | null = BfgGameSpecificPlayerActionOutcome | null,
// //   GHAO extends BfgGameSpecificHostActionOutcome | null = BfgGameSpecificHostActionOutcome | null,
// // > = TBfgGameEngineMetadata<
// //   'public-knowledge',
// //   PGS,
// //   PGS,
// //   GPA,
// //   GPAO,
// //   GHA,
// //   GHAO,
// //   null
// // >;


// // export type PrivatePlayerKnowledgeBfgGameEngineMetadata<
// //   HGS extends BfgHostGameImplState = BfgHostGameImplState,
// //   PGS extends BfgPublicGameImplState = BfgPublicGameImplState,
// //   GPA extends BfgGameImplPlayerAction = BfgGameImplPlayerAction,
// //   GPAO extends BfgGameSpecificPlayerActionOutcome | null = BfgGameSpecificPlayerActionOutcome | null,
// //   GHA extends BfgGameImplHostAction = BfgGameImplHostAction,
// //   GHAO extends BfgGameSpecificHostActionOutcome | null = BfgGameSpecificHostActionOutcome | null,
// //   PPK extends BfgPrivatePlayerKnowledgeImplState | null = BfgPrivatePlayerKnowledgeImplState | null,
// // > = TBfgGameEngineMetadata<
// //   'private-player-knowledge',
// //   HGS,
// //   PGS,
// //   GPA,
// //   GPAO,
// //   GHA,
// //   GHAO,
// //   PPK
// // >;


// // export type BfgGameEngineMetadata = PublicKnowledgeBfgGameEngineMetadata | PrivatePlayerKnowledgeBfgGameEngineMetadata;
