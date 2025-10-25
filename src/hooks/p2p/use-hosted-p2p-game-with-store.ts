import { GameTableId, PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { useP2pGame } from "./use-p2p-game";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { Room } from "trystero";
import { DbGameTableAction } from "../../models/game-table/game-table-action";
import { P2P_GAME_TABLE_ACTION_KEY, P2P_GAME_ACTIONS_ACTION_KEY } from "../../ui/components/constants";
import { ConnectionEvent, HostP2pActionStr, PeerId, PeerIdSchema, PlayerP2pActionStr } from "./p2p-types";
import { useGameRegistry } from "../games-registry/games-registry";
import { useCallback, useEffect } from "react";
import { asHostApplyMoveFromPlayer } from "~/ops/game-table-ops/as-host-apply-move-from-player";
import { matchPlayerToSeat } from "~/ops/game-table-ops/player-seat-utils";
import { updateHostedGame } from "~/tb-store/hosted-games-store";
import { useGameActions } from "../stores/use-game-actions-store";
import { useHostedGame } from "../stores/use-hosted-games-store";
import { addGameHostAction, addGamePlayerAction } from "~/tb-store/hosted-game-actions-store";
import { BfgEncodedString } from "~/models/game-engine/encoders";
import { asHostApplyHostAction } from "~/ops/game-table-ops/as-host-apply-host-action";


export interface IHostedP2pGameWithStoreData {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]
  peerProfiles: Map<PeerId, PublicPlayerProfile>
  
  myHostPlayerProfile: PublicPlayerProfile | null
  otherPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  txGameTableData: (gameTable: GameTable) => void
  txGameActionsData: (gameActions: DbGameTableAction[]) => void

  rxPlayerActionStr: (callback: (actionStr: PlayerP2pActionStr, peer: PeerId) => void) => void
  
  refreshConnection: () => void

  gameTable: GameTable | null
  gameActions: DbGameTableAction[] | null
  myPlayerSeat: GameTableSeat | null

  onSelfPlayerActionStr: (actionStr: PlayerP2pActionStr) => Promise<void>
  onHostActionStr: (actionStr: HostP2pActionStr) => Promise<void>
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

  const { room, rxPlayerActionStr } = p2pGame;  

  const [txGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
  const [txGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);

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
  // const gameEngine = gameMetadata.engine;
  // const playerActionSchema = gameMetadata.playerActionSchema;

  const doSendGameData = useCallback(() => {
    if (hostedGame && gameActions) {
      const gameData: GameTable = {
        ...hostedGame,
      }

      console.log('🎮 Host sending game data:', gameData)
      console.log('🎮 Host sending game actions:', gameActions)
      txGameTableData(gameData);
      txGameActionsData(gameActions);
    } else {
      console.log('🎮 Host cannot send game data - missing:', { hostedGame: !!hostedGame, gameActions: !!gameActions })
    }
  }, [hostedGame, gameActions, txGameTableData, txGameActionsData])

  useEffect(() => {
    doSendGameData();
  }, [doSendGameData])

  // Handle peer connections
  room.onPeerJoin((_peer: string) => {
    doSendGameData();
  })

  const handleSelfPlayerActionStr = async (actionStr: PlayerP2pActionStr) => {
    console.log('🎮 HOST RECEIVED self player action:', actionStr);
    console.log(" PLAYER ACTION TYPE", typeof actionStr);

    const playerActionEncoder = gameMetadata.playerActionEncoder;
    const p2pToBfgEncoded: BfgEncodedString = actionStr as unknown as BfgEncodedString;
    const validatedAction = playerActionEncoder.decode(p2pToBfgEncoded);

    if (!validatedAction) {
      console.error('❌ Invalid move received:', actionStr);
      return;
    }
    
    const moveResult = await asHostApplyMoveFromPlayer(gameRegistry, hostedGame, gameActions, hostPlayerProfile.id, validatedAction);
    if (moveResult) {
      const updatedGameTable = moveResult.gameTable;
      const updatedGameAction = moveResult.gameAction;
      updateHostedGame(hostedGame.id, updatedGameTable);
      // addGameHostAction(hostedGame.id, updatedGameAction);
      addGamePlayerAction(hostedGame.id, updatedGameAction);
    }
  }

  const handleHostActionStr = async (hostActionStr: HostP2pActionStr) => {
    console.log('🎮 HOST RECEIVED host action:', hostActionStr);

    const hostActionEncoder = gameMetadata.hostActionEncoder;
    const p2pToBfgEncoded: BfgEncodedString = hostActionStr as unknown as BfgEncodedString;
    const validatedAction = hostActionEncoder.decode(p2pToBfgEncoded);

    if (!validatedAction) {
      console.error('❌ Invalid host move received:', hostActionStr);
      return;
    }

    const moveResult = await asHostApplyHostAction(gameRegistry, hostedGame, gameActions, hostPlayerProfile.id, validatedAction);
    if (moveResult) {
      const updatedGameTable = moveResult.gameTable;
      const updatedGameAction = moveResult.gameAction;
      updateHostedGame(hostedGame.id, updatedGameTable);
      // addGameHostAction(hostedGame.id, updatedGameAction);
      addGameHostAction(hostedGame.id, updatedGameAction);
    }
  }

  
  rxPlayerActionStr(async (actionStr: PlayerP2pActionStr, peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('Received player action from peer:', peerId, actionStr);
    await handleSelfPlayerActionStr(actionStr);
  })


  const retVal = {
    ...p2pGame,
    gameActions,
    myHostPlayerProfile: hostPlayerProfile ?? null,

    txGameTableData,
    txGameActionsData,
    rxPlayerActionStr,

    gameTable: hostedGame ?? null,
    myPlayerSeat: myPlayerSeat ?? null,
    
    onSelfPlayerActionStr: handleSelfPlayerActionStr,
    onHostActionStr: handleHostActionStr,
    
    // otherPlayerProfiles: p2pGame.otherPlayerProfiles,
    // allPlayerProfiles: p2pGame.allPlayerProfiles,
  } satisfies IHostedP2pGameWithStoreData;
  
  return retVal;
}
