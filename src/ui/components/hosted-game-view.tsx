import { z } from "zod";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { BfgGameEngineProcessor } from "../../models/game-engine/bfg-game-engines";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { useGameRegistry } from "../../hooks/games-registry/games-registry";


interface HostedGameViewProps {
  myPlayerSeat: GameTableSeat;
  myPlayerProfile: PublicPlayerProfile;
  hostedGame: GameTable;
  gameActions: DbGameTableAction[];

  peerProfiles: Map<string, PublicPlayerProfile>;
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  
  onPlayerGameAction: (playerAction: any) => void
}

export const HostedGameView = (props: HostedGameViewProps) => {
  const { hostedGame, gameActions, onPlayerGameAction } = props;

  const latestAction = gameActions[gameActions.length - 1];
  
  if (!latestAction) {
    return <div>No game actions yet...</div>;
  }
  
  const gameTitle = hostedGame.gameTitle;

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

  // Type-safe callback function that works with the specific game engine
  const onPlayerMoveAction = async (gameState: typeof gameSpecificState, gameAction: typeof latestGameSpecificAction) => {
    console.log("onGameAction", gameState, gameAction);
    const playerMoveJson = gameEngine.createGameSpecificActionJson(gameAction);
    onPlayerGameAction(playerMoveJson);
  }

  const createHostRepresentation = gameRendererFactory.createGameStateHostComponent;
  const hostRepresentation = createHostRepresentation(hostedGame, gameSpecificState, latestGameSpecificAction, onPlayerMoveAction);
  
  
  // const hostRepresentation = (gameRendererFactory as {
  //   createGameStateHostComponent: (
  //     gameTable: GameTable,
  //     gameState: GameStateType,
  //     mostRecentAction: GameActionType,
  //     onGameAction: (gameState: GameStateType, gameAction: GameActionType) => void
  //   ) => React.ReactNode;
  // }).createGameStateHostComponent(hostedGame, gameSpecificState, latestGameSpecificAction, onPlayerMoveAction);

  return (
    <div>
      <div>BFG Table Phase: {hostedGame.tablePhase}</div>
      {hostRepresentation}
      
      {/* <PeerProfilesComponent
        peerProfiles={peerProfiles}
        playerProfiles={playerProfiles}
      /> */}
    </div>
  );
}
