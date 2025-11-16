// import type { BfgGameTableId } from "../../models/types/bfg-branded-uuids";
// import { useHostedGame } from "./use-hosted-games-store";
// import type { LatestGameState } from "../../models/game-table/latest-game-state";


// export const useLatestGameStateForHost = (gameTableId: BfgGameTableId) => {
//   // const [gameState, setGameState] = useState<BfgGameStateForHost | null>(null);
//   // const hostedGameActions = useHostedGameActions();
//   const hostedGame = useHostedGame(gameTableId);

//   if (!hostedGame) {
//     return null;
//   }

//   const { latestActionId, latestOutcomeId, latestNextGameStateId } = hostedGame;

//   const latestAction = useHostedGameAction(latestActionId);
//   const latestNextGameState = useHostedGameState(latestNextGameStateId);

//   const latestGameState: LatestGameState = {
//     gameTableId,
//     gameTable: hostedGame,
//     latestAction,
//     // latestOutcome,
//     latestNextGameState,
//   };

//   return latestGameState;
// }