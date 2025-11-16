// import type { BfgMetadataGameStateAccessTypes } from "./metadata-types";
// import type { GSH, GSP, GAP, GAH, GAPO, GAHO } from "./metadata-types";

// export interface IBfgGameCompleteEncoders<
//   GSH extends GSHExt,
//   // GSP,
//   // GSW,
//   // GAP,
//   // GAH,
//   // GAPO,
//   // GAHO,
// > {
//   // watcherGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSW>;
//   // playerGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSP>;
//   hostGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSH>;
  
//   // playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GAP>;
//   // hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GAH>;

//   // playerActionOutcomeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GAPO> | null;
//   // hostActionOutcomeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GAHO> | null;
  
//   // privatePlayerKnowledgeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, PPK> | null;
// }

// export interface PublicKnowledgeGameEncoders<
//   GSH extends GSHExt,
//   // GAP,
//   // GAH,
//   // GAPO,
//   // GAHO,
// > {
//   // publicGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSP>;
//   hostGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSH>;
//   // playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GAP>;
//   // hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GAH>;
//   // playerActionOutcomeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GAPO> | null;
//   // hostActionOutcomeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GAHO> | null;
//   // privatePlayerKnowledgeEncoder: null;
// }

// export interface PrivateKnowledgeGameEncoders<
//   GSH,
//   GSP,
//   GAP,
//   GAH,
//   GAPO,
//   GAHO,
// > {
//   publicGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSP>;
//   hostGameStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GSH>;
//   playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GAP>;
//   hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GAH>;
//   playerActionOutcomeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GAPO> | null;
//   hostActionOutcomeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GAHO> | null;
//   // privatePlayerKnowledgeEncoder: IBfgDataEncoder<BfgDataEncoderFormat, PPK>;
// }


// export const createCompleteGameEncoders = (
//   gameStateAccessTypes: BfgEngineMetadataSchemas<GSH, GSP, GSW>
// ) => {
  
//   return {
//     hostGameStateEncoder: createJsonZodObjectDataEncoder(gameStateAccessTypes.hostGameStateSchema),
//   };
// }

// export type CompleteGameEncoders = ReturnType<typeof createCompleteGameEncoders>;