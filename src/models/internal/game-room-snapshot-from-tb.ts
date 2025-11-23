import { GameRoomDbSchema } from "../tinybase/game-room-db";
import { getGameMetadata } from "../../game-metadata/games-registry";
import type { BfgStringifiedBoardTransitionsStr, BfgStringifiedRoomStateStr } from "../types/bfg-branded-string-types";
import { createBoardTransitionsArraySchema } from "../tinybase/game-board-event";


export const createHydratedLatestGameSnapshotFromTbData = (
  stringifiedGameRoomState: BfgStringifiedRoomStateStr,
  stringifiedBoardEvents: BfgStringifiedBoardTransitionsStr,
) => {
  
  const unstringifiedGameRoomState = JSON.parse(stringifiedGameRoomState);
  const hydratedGameRoomState = GameRoomDbSchema.parse(unstringifiedGameRoomState);

  const gameTitle = hydratedGameRoomState.gameTitle;
  const gameMetadata = getGameMetadata(gameTitle);
  if (!gameMetadata) {
    throw new Error("Game metadata not found for game title: " + gameTitle);
  }

  const unstringifiedBoardEvents = JSON.parse(stringifiedBoardEvents);
  const BoardTransitionsArraySchema = createBoardTransitionsArraySchema(gameMetadata.schemas);

  const hydratedBoardEventsParseResult = BoardTransitionsArraySchema.safeParse(unstringifiedBoardEvents);
  if (!hydratedBoardEventsParseResult.success) {
    console.error('Error validating board events:', hydratedBoardEventsParseResult.error);
    throw new Error("Error validating board events: " + hydratedBoardEventsParseResult.error.message);
  }

  const hydratedBoardEvents = hydratedBoardEventsParseResult.data;

  const hydratedLatestGameSnapshot = {
    gameRoom: hydratedGameRoomState,
    boardEvents: hydratedBoardEvents,
    // latestStepIndex: hydratedGameRoomState.latestGameStepIndex,
  };

  return hydratedLatestGameSnapshot;
}

export type HydratedLatestGameSnapshot = ReturnType<typeof createHydratedLatestGameSnapshotFromTbData>;
