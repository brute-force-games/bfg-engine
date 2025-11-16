// import { z } from "zod";
// import type { BfgGameEngineMetadata } from "../../game-metadata/metadata-types";
// import type { BfgGameActionByHost, BfgGameActionByPlayer } from "../../game-metadata/metadata-types/game-action-types";
// import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../../game-metadata/metadata-types/game-state-types";
// import { useGameRegistry } from "./games-registry-hook";
// import { BfgSupportedGameTitle } from "@bfg-engine/models/game-box-definition";

import type { BfgGameEngineMetadata } from "../../game-metadata/metadata-types";
import type { BfgSupportedGameTitle } from "../../models/game-box-definition";
import { useGameRegistry } from "./games-registry-hook";


// export const useGameMetadata = <
//   GSH extends BfgGameStateForHost,
//   GSP extends BfgGameStateForPlayer,
//   GSW extends BfgGameStateForWatcher,
//   PGA extends BfgGameActionByPlayer,
//   HGA extends BfgGameActionByHost,
// >(gameTitle: BfgSupportedGameTitle): BfgGameEngineMetadata<GSH, GSP, GSW, PGA, HGA> => 
// {
//   const registry = useGameRegistry();
//   const genericMetadata = registry.getGameMetadata(gameTitle);
//   if (!genericMetadata) {
//     throw new Error(`Game metadata not found for: ${gameTitle}`);
//   }

//   const hostGameStateSchema = z.infer<typeof gameMetadata.schemas.hostGameStateSchema>;
//   const playerGameStateSchema = z.infer<typeof gameMetadata.schemas.playerGameStateSchema>;
//   const watcherGameStateSchema = z.infer<typeof gameMetadata.schemas.watcherGameStateSchema>;

//   const gameMetadata = {
//     ...genericMetadata,
//     schemas: {
//       hostGameStateSchema,
//       playerGameStateSchema,
//       watcherGameStateSchema,
//     },
//   };

//   return gameMetadata;
// }


export const useGameMetadata = (gameTitle: BfgSupportedGameTitle): BfgGameEngineMetadata => {
  const registry = useGameRegistry();
  const genericMetadata = registry.getGameMetadata(gameTitle);
  if (!genericMetadata) {
    throw new Error(`Game metadata not found for: ${gameTitle}`);
  }
  return genericMetadata;
}