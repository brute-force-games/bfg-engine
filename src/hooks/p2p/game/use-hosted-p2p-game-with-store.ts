import { GameTableId, PlayerProfileId } from "../../../models/types/bfg-branded-ids";
import { PublicPlayerProfile } from "../../../models/player-profile/public-player-profile";
import { IP2pGameRoomEventHandlers, useP2pGame } from "./use-p2p-game";
import { GameTable, GameTableSeat } from "../../../models/game-table/game-table";
import { Room } from "trystero";
import { DbGameTableAction } from "../../../models/game-table/game-table-action";
import { P2P_GAME_TABLE_ACTION_KEY, P2P_GAME_ACTIONS_ACTION_KEY } from "../../../ui/components/constants";
import { ConnectionEvent, HostP2pActionStr, HostP2pActionStrSchema, PeerId, PeerIdSchema, PlayerP2pActionStr, PlayerP2pActionStrSchema } from "../p2p-types";
import { useGameRegistry } from "../../games-registry/games-registry";
import { useCallback, useEffect } from "react";
import { asHostApplyMoveFromPlayer } from "~/ops/game-table-ops/as-host-apply-move-from-player";
import { matchPlayerToSeat } from "~/ops/game-table-ops/player-seat-utils";
import { updateHostedGame } from "~/tb-store/hosted-games-store";
import { useGameActions } from "../../stores/use-game-actions-store";
import { useHostedGame } from "../../stores/use-hosted-games-store";
import { addGameHostAction, addGamePlayerAction } from "~/tb-store/hosted-game-actions-store";
import { BfgEncodedString } from "~/models/game-engine/encoders";
import { asHostApplyHostAction } from "~/ops/game-table-ops/as-host-apply-host-action";
import { GameTableAccessRole } from "~/models/game-roles";
import { IP2pGame } from "./use-p2p-game";
import { PrivatePlayerProfile } from "~/models/player-profile/private-player-profile";


export interface IHostedP2pGameWithStoreData extends IP2pGame {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  peers: PeerId[]
  peerPlayers: Map<PeerId, PublicPlayerProfile>
  
  myHostPlayerProfile: PublicPlayerProfile | null
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  txGameTableData: (gameTable: GameTable) => void
  txGameActionsData: (gameActions: DbGameTableAction[]) => void

  rxPlayerActionStr: (callback: (actionStr: PlayerP2pActionStr, peer: PeerId) => void) => void
  
  refreshConnection: () => void

  gameTable: GameTable | null
  // gameActions: DbGameTableAction[] | null
  myPlayerSeat: GameTableSeat | null
  myGameTableAccess: GameTableAccessRole

  onSelfPlayerActionStr: (actionStr: PlayerP2pActionStr) => Promise<void>
  onHostActionStr: (actionStr: HostP2pActionStr) => Promise<void>
}


export const useHostedP2pGameWithStore = (
  gameTableId: GameTableId,
  hostPlayerProfile: PrivatePlayerProfile | null,
): IHostedP2pGameWithStoreData => {

  const roomEventHandlers: IP2pGameRoomEventHandlers = {
    onPeerJoin: (_peer: PeerId) => {
      doSendGameData();
    },
  }

  const hostedGame = useHostedGame(gameTableId);
  const p2pGame = useP2pGame({ 
    gameTableId, 
    myPlayerProfile: hostPlayerProfile, 
    requestedRole: 'host',
  });
  // const p2pGame = useP2pGameContext();

  if (hostedGame === null) {
    throw new Error('Host game table could not be found: ' + gameTableId);
  }

  if (gameTableId !== hostedGame.id) {
    throw new Error('Route game table ID does not match the hosted game table ID: ' + gameTableId + ' !== ' + hostedGame.id);
  }

  // if (gameTable?.id !== undefined && p2pGame.gameTable?.id !== gameTableId) {
  //   throw new Error('P2P game table ID does not match the game table ID: ' + p2pGame.gameTable?.id + ' !== ' + gameTableId);
  // }

  const gameTableHostPlayerProfileId = hostedGame?.gameHostPlayerProfileId;
  if (gameTableHostPlayerProfileId !== hostPlayerProfile?.id) {
    throw new Error('P2P my player profile ID does not match the host player profile ID: ' + gameTableHostPlayerProfileId + ' !== ' + hostPlayerProfile?.id);
  }

  p2pGame.setRoomEventHandlers(roomEventHandlers);

  if (!hostedGame) {
    throw new Error('Game table is required');
  }

  if (!hostPlayerProfile) {
    throw new Error('Host player profile is required');
  }

  const { room, rxPlayerActionStr } = p2pGame;  

  const [txGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
  const [txGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);

  const gameRegistry = useGameRegistry();
  
  // const hostedGame = useHostedGame(gameTableId);
  const gameActions = useGameActions(gameTableId);

  // if (!hostedGame) {
  //   throw new Error('Hosted game is required');
  // }

  const myPlayerSeat = matchPlayerToSeat(hostPlayerProfile.id, hostedGame);

  const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);

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

  const handleSelfPlayerActionStr = async (actionStr: PlayerP2pActionStr) => {
    const validationResult = PlayerP2pActionStrSchema.safeParse(actionStr);
    if (!validationResult.success) {
      console.error('❌ Invalid player action received:', actionStr);
      return;
    }

    const validatedActionStr = validationResult.data;

    console.log('🎮 HOST RECEIVED self player action:', validatedActionStr);

    const playerActionEncoder = gameMetadata.playerActionEncoder;
    const p2pToBfgEncoded: BfgEncodedString = validatedActionStr as unknown as BfgEncodedString;
    const validatedAction = playerActionEncoder.decode(p2pToBfgEncoded);

    if (!validatedAction) {
      console.error('❌ Invalid move received:', validatedActionStr);
      return;
    }
    
    const moveResult = await asHostApplyMoveFromPlayer(gameRegistry, hostedGame, gameActions, hostPlayerProfile.id, validatedActionStr);
    if (moveResult) {
      const updatedGameTable = moveResult.gameTable;
      const updatedGameAction = moveResult.gameAction;
      updateHostedGame(hostedGame.id, updatedGameTable);
      addGamePlayerAction(hostedGame.id, updatedGameAction);
    }
  }

  const handleHostActionStr = async (hostActionStr: HostP2pActionStr) => {
    const validationResult = HostP2pActionStrSchema.safeParse(hostActionStr);
    if (!validationResult.success) {
      console.error('❌ Invalid host action received:', hostActionStr);
      return;
    }

    const validatedHostActionStr = validationResult.data;

    const moveResult = await asHostApplyHostAction(gameRegistry, hostedGame, gameActions, validatedHostActionStr);
    if (moveResult) {
      const updatedGameTable = moveResult.gameTable;
      const updatedGameAction = moveResult.gameAction;
      updateHostedGame(hostedGame.id, updatedGameTable);
      addGameHostAction(hostedGame.id, updatedGameAction);
    }
  }

  
  rxPlayerActionStr(async (actionStr: PlayerP2pActionStr, peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('Received player action from peer:', peerId, actionStr);
    await handleSelfPlayerActionStr(actionStr);
  })

  useEffect(() => {
    // console.log('P2P game table ID:', p2pGame.gameTable?.id);
    // console.log('Game table ID:', gameTableId);
    p2pGame.clearRoomEventHandlers();
  }, [p2pGame])


  const retVal: IHostedP2pGameWithStoreData = {
    ...p2pGame,
    gameActions,
    myHostPlayerProfile: hostPlayerProfile ?? null,
    myGameTableAccess: 'host',
    hasRequestedTableAccess: true,

    txGameTableData,
    txGameActionsData,
    rxPlayerActionStr,

    gameTable: hostedGame ?? null,
    myPlayerSeat: myPlayerSeat ?? null,
    
    onSelfPlayerActionStr: handleSelfPlayerActionStr,
    onHostActionStr: handleHostActionStr,
  };
  
  return retVal;
}
