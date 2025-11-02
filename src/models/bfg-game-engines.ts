import { BfgSupportedGameTitle, GameDefinition } from "../models/game-box-definition";
import { IBfgAllPublicKnowledgeGameProcessor } from "./game-engine/bfg-game-engine-processor";
import { BfgAllPublicKnowledgeGameEngineComponents, BfgGameImplHostAction, BfgGameImplPlayerAction, BfgPublicGameImplState } from "./game-engine/bfg-game-engine-types";
import { IBfgDataEncoder } from "./game-engine/encoders";
import { BfgDataEncoderFormat } from "./game-engine/encoders";


export type BfgGameEngineMetadata<
  GIS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction
> = {
  definition: GameDefinition;
  
  gameTitle: BfgSupportedGameTitle,
  
  gameSpecificStateEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GIS>;
  playerActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GPA>;
  hostActionEncoder: IBfgDataEncoder<BfgDataEncoderFormat, GHA>;

  engine: IBfgAllPublicKnowledgeGameProcessor<GIS, GPA, GHA>,
  components: BfgAllPublicKnowledgeGameEngineComponents<GIS, GPA, GHA>,
}
