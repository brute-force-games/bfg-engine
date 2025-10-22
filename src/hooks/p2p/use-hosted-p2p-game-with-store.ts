import { GameTableId, PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { useP2pGame } from "./use-p2p-game";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { Room } from "trystero";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { P2P_GAME_TABLE_ACTION_KEY, P2P_GAME_ACTIONS_ACTION_KEY } from "../../ui/components/constants";
import { ConnectionEvent, PeerId } from "./p2p-types";
import { useGameRegistry } from "../games-registry/games-registry";
import { useCallback, useEffect } from "react";
import { asHostApplyMoveFromPlayer } from "~/ops/game-table-ops/as-host-apply-move-from-player";
import { matchPlayerToSeat } from "~/ops/game-table-ops/player-seat-utils";
import { addGameAction } from "~/tb-store/hosted-game-actions-store";
import { updateHostedGame } from "~/tb-store/hosted-games-store";
import { useGameActions } from "../stores/use-game-actions-store";
import { useHostedGame } from "../stores/use-hosted-games-store";


export interface IHostedP2pGameWithStoreData {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]
  peerProfiles: Map<PeerId, PublicPlayerProfile>
  
  myHostPlayerProfile: PublicPlayerProfile | null
  otherPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  sendGameTableData: (gameTable: GameTable) => void
  sendGameActionsData: (gameActions: DbGameTableAction[]) => void

  getPlayerMove: (callback: (move: unknown, peer: PeerId) => void) => void
  
  refreshConnection: () => void

  gameTable: GameTable | null
  gameActions: DbGameTableAction[] | null
  myPlayerSeat: GameTableSeat | null
  handlePlayerMove: (move: unknown) => Promise<void>
}

export const useHostedP2pGameWithStore = (
  gameTableId: GameTableId,
  hostPlayerProfile: PublicPlayerProfile | null,
): IHostedP2pGameWithStoreData => {

  const gameTable = useHostedGame(gameTableId);
  const p2pGame = useP2pGame(gameTableId, hostPlayerProfile);

  if (!gameTable) {
    throw new Error('Game table is required');
  }

  if (!hostPlayerProfile) {
    throw new Error('Host player profile is required');
  }

  const { room, getPlayerMove } = p2pGame;

  // const gameTableId = gameTable.id;
  

  const [sendGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
  const [sendGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);

  // const hostPrivateProfile = useRiskyMyDefaultPlayerProfile();
  // const hostPlayerProfile = hostPrivateProfile ? convertPrivateToPublicProfile(hostPrivateProfile) : null;
  const gameRegistry = useGameRegistry();
  
  const hostedGame = useHostedGame(gameTableId);
  const gameActions = useGameActions(gameTableId);

  // console.log("LOADED GAME ACTIONS", gameActions);

  // const hostedP2pGame = useHostedP2pGame(hostedGame, hostPlayerProfile);
  // const { peerProfiles, playerProfiles, room, getPlayerMove, sendGameTableData, sendGameActionsData, connectionEvents, refreshConnection } = hostedP2pGame;

  // if (!hostPlayerProfile) {
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-3xl font-bold mb-6">Loading Profile...</h1>
  //       <div className="text-gray-600">Loading profile details...</div>
  //     </div>
  //   )
  // }

  // if (!hostedGame) {
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
  //       <div className="text-gray-600">Loading game details...</div>
  //     </div>
  //   )
  // }

  if (!hostedGame) {
    throw new Error('Hosted game is required');
  }

  const myPlayerSeat = matchPlayerToSeat(hostPlayerProfile.id, hostedGame);

  // if (!myPlayerSeat) {
  //   console.log("You are not at this game table")
  //   console.log("hostedGame", hostedGame)
  //   console.log("myPlayerSeat", myPlayerSeat)
  //   console.log("hostPlayerProfile.id", hostPlayerProfile.id)
  //   console.log("hostedGame.gameHostPlayerProfileId", hostedGame.gameHostPlayerProfileId)
  //   return <div>You are not at this game table</div>;
  // }

  // Get game metadata and validate the move with the schema
  const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);
  const gameActionSchema = gameMetadata.processor.gameActionJsonSchema;
  

  const doSendGameData = useCallback(() => {
    if (hostedGame && gameActions) {
      const gameData: GameTable = {
        ...hostedGame,
      }

      console.log('🎮 Host sending game data:', gameData)
      console.log('🎮 Host sending game actions:', gameActions)
      sendGameTableData(gameData);
      sendGameActionsData(gameActions);
    } else {
      console.log('🎮 Host cannot send game data - missing:', { hostedGame: !!hostedGame, gameActions: !!gameActions })
    }
  }, [hostedGame, gameActions, sendGameTableData, sendGameActionsData])

  useEffect(() => {
    doSendGameData();
  }, [doSendGameData])

  // Handle peer connections
  room.onPeerJoin((_peer: string) => {
    doSendGameData();
  })

  const handlePlayerMove = async (move: unknown) => {
    // Parse JSON string to object if needed
    let moveData = move;
    if (typeof move === 'string') {
      try {
        moveData = JSON.parse(move);
      } catch (e) {
        console.error('❌ Failed to parse move JSON:', e);
        console.error('Move data:', move);
        return;
      }
    }

    // Validate and parse the move using the game's action schema
    const parseResult = gameActionSchema.safeParse(moveData);
    
    if (!parseResult.success) {
      console.error('❌ Invalid move received:', parseResult.error);
      console.error('Move data:', moveData);
      return;
    }
    
    const validatedMove = parseResult.data;
    console.log('✅ HOST RECEIVED validated move:', validatedMove);
    
    const moveResult = await asHostApplyMoveFromPlayer(gameRegistry, hostedGame, gameActions, hostPlayerProfile.id, validatedMove);
    if (moveResult) {
      const updatedGameTable = moveResult.gameTable;
      const updatedGameAction = moveResult.gameAction;
      updateHostedGame(hostedGame.id, updatedGameTable);
      addGameAction(hostedGame.id, updatedGameAction);
    }
  }

  
  getPlayerMove(async (move: unknown, peer: string) => {
    console.log('Received player move from peer:', peer, move);
    await handlePlayerMove(move);
  })


  const retVal = {
    ...p2pGame,
    gameActions,
    myHostPlayerProfile: hostPlayerProfile ?? null,
    sendGameTableData,
    sendGameActionsData,
    gameTable: hostedGame ?? null,
    myPlayerSeat: myPlayerSeat ?? null,
    handlePlayerMove,
    // otherPlayerProfiles: p2pGame.otherPlayerProfiles,
    // allPlayerProfiles: p2pGame.allPlayerProfiles,
  } satisfies IHostedP2pGameWithStoreData;
  
  return retVal;
}
