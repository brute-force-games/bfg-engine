import type { IGameRegistry } from "../../../game-metadata/games-registry";
import type { SiteHostingContextType } from "../../../hooks/site-hosting";
import type { GameLobby } from "../../../models/p2p-lobby";
import { BfgGameRoomIdToolbox, BfgGameTableIdToolbox, BfgGameInstanceIdToolbox, type BfgGameInstanceId } from "../../../models/types/bfg-branded-uuids";
import { generateUuidKey } from "../../../models/types/branded-uuids";
import { asHostStartNewGame } from "../../../ops/game-table-ops/as-host-start-game";
// import { addGameInstanceMapping } from "../../../tb-store/game-instance-store";


export type DoStartGameResult = {
  gameInstanceId: BfgGameInstanceId;
  playGameLink: string;
}

export const doStartGame = async (
  lobbyState: GameLobby,
  gameRegistry: IGameRegistry,
  siteHosting: SiteHostingContextType,
  updateLobbyState: (lobbyState: GameLobby) => void
): Promise<DoStartGameResult | null> => {

  if (!lobbyState.gameTitle) {
    alert('Please select a game title first');
    return null;
  }

  const newGameRoomGuid = generateUuidKey();
  const newGameRoomId = BfgGameRoomIdToolbox.createIdForKey(newGameRoomGuid);
  const newGameTableId = BfgGameTableIdToolbox.createIdForKey(newGameRoomGuid);
  const newGameInstanceId = BfgGameInstanceIdToolbox.createIdForKey(newGameRoomGuid);

  console.log("starting game", lobbyState);
  const gameTable = await asHostStartNewGame(gameRegistry, lobbyState, newGameInstanceId, newGameRoomId, newGameTableId);
  console.log("NEW GAME TABLE", gameTable);

  const playGameLink = siteHosting.createPlayerGameUrl(newGameInstanceId);
  updateLobbyState({ ...lobbyState, playGameLink, gameInstanceId: newGameInstanceId });

  const retVal: DoStartGameResult = {
    gameInstanceId: newGameInstanceId,
    playGameLink,
  }

  return retVal;
}
