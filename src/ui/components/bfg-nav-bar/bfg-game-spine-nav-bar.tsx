import { BfgGameEngineMetadata } from "~/models/bfg-game-engines";
import { BfgPublicGameImplState, BfgGameImplPlayerAction, BfgGameImplHostAction } from "~/models/game-engine/bfg-game-engine-types";
import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar";
import { GameTable } from "~/models/game-table/game-table";
import { PlayerProfileId } from "~/models/types/bfg-branded-ids";
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile";
import { BfgGameSpine } from "~/ui/bfg-ui";
import { OptionalGameContext } from "~/hooks/p2p/game/use-optional-game-context";


interface BfgGameSpineNavBarProps {
  gameMetadata: BfgGameEngineMetadata<BfgPublicGameImplState, BfgGameImplPlayerAction, BfgGameImplHostAction>;
  gameTable: GameTable;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  gameState: BfgPublicGameImplState;
  gameContext?: OptionalGameContext;
}

export const BfgGameSpineNavBar = (props: BfgGameSpineNavBarProps) => {
  const { gameMetadata, gameTable, allPlayerProfiles, gameState, gameContext } = props;

  // const gameSpineComponent = gameMetadata.components.GameSpineComponent?.({
  //   gameTable,
  //   allPlayerProfiles,
  //   gameState,
  // });

  const { GameSpineComponent } = gameMetadata.components;

  // return (
  //   <BfgGameSpine
  //     gameTitle={FlipACoinGameName}
  //     gameSourceUrl="https://github.com/brute-force-games/bfg-gdp-basic-games/tree/main/src/game-definitions/flip-a-coin"
  //     orientation="horizontal"
  //     gameTable={gameTable}
  //     allPlayerProfiles={allPlayerProfiles}
  //     nextToActPlayers={nextToActPlayers}
  //     gameState={gameState}
  //     playerDetailsLineFn={playerDetailsLineFn}
  //   />
  // );

  const nextToActPlayers = gameMetadata.engine.getNextToActPlayers(gameTable, gameState);
  const playerDetailsLineFn = gameMetadata.engine.getPlayerDetailsLine;

  return (
    <BruteForceGamesAppBar gameContext={gameContext}>
      {(_props) => (
        <>
          {/* {gameSpineComponent} */}
          {GameSpineComponent ?
            <GameSpineComponent
              gameTable={gameTable}
              allPlayerProfiles={allPlayerProfiles}
              gameState={gameState}
              orientation="horizontal"
            /> :
            <BfgGameSpine
              gameTitle={gameMetadata.gameTitle}
              // gameSourceUrl="https://github.com/brute-force-games/bfg-gdp-basic-games/tree/main/src/game-definitions/flip-a-coin"
              orientation="horizontal"
              gameTable={gameTable}
              allPlayerProfiles={allPlayerProfiles}
              nextToActPlayers={nextToActPlayers}
              gameState={gameState}
              playerDetailsLineFn={playerDetailsLineFn}
            />
          }
        </>
      )}
    </BruteForceGamesAppBar>
  );
};
