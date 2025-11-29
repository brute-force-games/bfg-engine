import { GameRoomDbSchema } from "../tinybase/game-room-db";
import { getGameMetadata } from "../../game-metadata/games-registry";
import type { BfgStringifiedBoardTransitionsStr, BfgStringifiedRoomStateStr } from "../types/bfg-branded-string-types";
import { createBoardTransitionsArraySchema } from "../tinybase/game-board-event";


export const createHydratedLatestGameSnapshotFromStringifiedData = (
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

  const latestStepIndex = hydratedGameRoomState.latestGameStepIndex;
  if (latestStepIndex !== hydratedBoardEvents.length) {
    console.error("Latest step index does not match the number of board events");
    console.error("Latest step index: " + latestStepIndex);
    console.error("Number of board events: " + hydratedBoardEvents.length);
    console.error("Board events: " + JSON.stringify(hydratedBoardEvents));
    throw new Error("Latest step index does not match the number of board events");
  }

  const hydratedLatestGameSnapshot = {
    gameRoom: hydratedGameRoomState,
    boardEvents: hydratedBoardEvents,
    latestStepIndex,
  };

  return hydratedLatestGameSnapshot;
}

export type HydratedLatestGameSnapshot = ReturnType<typeof createHydratedLatestGameSnapshotFromStringifiedData>;
