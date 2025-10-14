import { z } from "zod";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { BfgGameEngineProcessor } from "../../models/game-engine/bfg-game-engines";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { useGameRegistry } from "../../hooks/games-registry/games-registry";


interface PlayerGameViewProps {
  myPlayerSeat: GameTableSeat;
  myPlayerProfile: PublicPlayerProfile;
  gameTable: GameTable;
  gameActions: DbGameTableAction[];
  
  onPlayerGameAction: (playerAction: any) => void
}

export const PlayerGameView = (props: PlayerGameViewProps) => {
  const { myPlayerSeat, gameTable, gameActions, onPlayerGameAction } = props;

  const latestAction = gameActions[gameActions.length - 1];
  
  if (!latestAction) {
    return <div>No game actions yet...</div>;
  }
  
  const gameTitle = gameTable.gameTitle;

  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRegistry.getGameMetadata(gameTitle);
  
  const gameEngine = gameMetadata.processor as BfgGameEngineProcessor<
    z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>,
    z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>
  >;
  const gameRendererFactory = gameEngine.rendererFactory;
  
  const gameSpecificState = gameEngine.parseGameSpecificGameStateJson(
    latestAction.actionOutcomeGameStateJson as any);

  const latestGameSpecificAction = gameEngine.parseGameSpecificActionJson(
    latestAction.actionJson as any);

  const onPlayerMoveAction = async (gameState: typeof gameSpecificState, gameAction: typeof latestGameSpecificAction) => {
    console.log("onGameAction", gameState, gameAction);

    const playerMoveJson = gameEngine.createGameSpecificActionJson(gameAction);
    onPlayerGameAction(playerMoveJson);
  }

  const gameRepresentation = gameRendererFactory.createGameStateCombinationRepresentationAndInputComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction, onPlayerMoveAction);


  if (!gameMetadata) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game Metadata...</h1>
        <div className="text-gray-600">Loading game metadata...</div>
      </div>
    )
  }

  return (
    <div>
      {gameRepresentation}
    </div>
  );
}
