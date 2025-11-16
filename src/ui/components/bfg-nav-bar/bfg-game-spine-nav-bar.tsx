import type { BfgGameEngineMetadata } from "@bfg-engine/game-metadata/metadata-types";
import type { BfgGameStateForWatcher } from "@bfg-engine/game-metadata/metadata-types/game-state-types";
import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar";
import { type GameRoomP2p } from "@bfg-engine/models/game-table/game-room-p2p";
import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { PublicPlayerProfile } from "@bfg-engine/models/player-profile/public-player-profile";
import { BfgGameSpine } from "@bfg-engine/ui/bfg-ui";
import { OptionalGameContext } from "@bfg-engine/hooks/p2p/game/use-optional-game-context";


interface BfgGameSpineNavBarProps {
  gameMetadata: BfgGameEngineMetadata;
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  gameState: BfgGameStateForWatcher;
  gameContext?: OptionalGameContext;
}

export const BfgGameSpineNavBar = (props: BfgGameSpineNavBarProps) => {
  const { gameMetadata, gameRoom, allPlayerProfiles, gameState, gameContext } = props;

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

  const nextToActPlayers = gameMetadata.gameProcessor.getNextToActPlayers(gameRoom, gameState);
  const playerDetailsLineFn = gameMetadata.gameProcessor.getPlayerDetailsLine;

  return (
    <BruteForceGamesAppBar gameContext={gameContext}>
      {(_props) => (
        <>
          {/* {gameSpineComponent} */}
          {GameSpineComponent ?
            <GameSpineComponent
              gameRoom={gameRoom}
              allPlayerProfiles={allPlayerProfiles}
              gameState={gameState}
              orientation="horizontal"
            /> :
            <BfgGameSpine
              gameTitle={gameMetadata.gameTitle}
              // gameSourceUrl="https://github.com/brute-force-games/bfg-gdp-basic-games/tree/main/src/game-definitions/flip-a-coin"
              orientation="horizontal"
              gameRoom={gameRoom}
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
