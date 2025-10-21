import { GameLobbyId, PlayerProfileId } from "../../models/types/bfg-branded-ids";
import { useP2pLobby } from "./use-p2p-lobby";
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile";
import { HostP2pLobbyDetails, PlayerP2pLobbyMove } from "../../models/p2p-details";
import { P2P_LOBBY_DETAILS_ACTION_KEY } from "../../ui/components/constants";
import { IP2pLobby } from "./use-p2p-lobby";
import { ConnectionEvent, PeerId, PeerIdSchema } from "./p2p-types";
import { PrivatePlayerProfile } from "../../models/player-profile/private-player-profile";
import { BfgSupportedGameTitle } from "../../models/game-box-definition";
import { IHostedLobbyActions, useHostedLobby, useHostedLobbyActions } from "../stores/use-hosted-lobbies-store";
import { GameLobby, LobbyOptions } from "../../models/p2p-lobby";
import { useGameRegistry } from "../games-registry/games-registry";
import { useCallback, useEffect, useState } from "react";
import { playerSetGameChoice } from "~/ops/game-lobby-ops/player-set-game-choice";
import { playerTakeSeat } from "~/ops/game-lobby-ops/player-take-seat";
import { updateHostedLobbyPlayerPool } from "~/tb-store/hosted-lobbies-store";
import { playerLeaveSeat } from "~/ops/game-lobby-ops/player-leave-seat";


export interface IHostedP2pLobbyWithStoreData {
  p2pLobby: IP2pLobby
  
  lobbyDetails: HostP2pLobbyDetails | null
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  peerProfiles: Map<PeerId, PublicPlayerProfile>
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  sendLobbyData: (lobbyData: HostP2pLobbyDetails) => void
  getPlayerProfile: (callback: (playerProfile: PublicPlayerProfile, peer: PeerId) => void) => void
  refreshConnection: () => void

  lobbyState: GameLobby | null;
  lobbyOptions: LobbyOptions;
  
  setLobbyOptions: (lobbyOptions: LobbyOptions) => void;
  lobbyActions: IHostedLobbyActions;

  onSelectGameChoice: (gameChoice: BfgSupportedGameTitle) => void;
  onTakeSeat: () => void;
  onLeaveSeat: () => void;

}

export const useHostedP2pLobbyWithStore = (lobbyId: GameLobbyId, hostPlayerProfile: PrivatePlayerProfile): IHostedP2pLobbyWithStoreData => {

  const p2pLobby = useP2pLobby(lobbyId, hostPlayerProfile);
  const lobbyState = useHostedLobby(lobbyId);
  const lobbyActions = useHostedLobbyActions();
  const gameRegistry = useGameRegistry();

  const [lobbyOptions, setLobbyOptions] = useState<LobbyOptions>(() => {
    const gameChoices = gameRegistry.getAvailableGameTitles();
    return {
      gameChoices,  
      maxPlayers: 8,
    }
  });

  const {
    room,
    peerProfiles,
    otherPlayerProfiles,
    getPlayerProfile,
    getPlayerMove,
    connectionEvents,
    refreshConnection
  } = p2pLobby;
  const { updateLobby } = lobbyActions;

  const allPlayerProfiles = new Map<PlayerProfileId, PublicPlayerProfile>(otherPlayerProfiles);
  allPlayerProfiles.set(hostPlayerProfile.id, hostPlayerProfile);

  const applyPlayerMove = async (move: PlayerP2pLobbyMove, playerId: PlayerProfileId) => {
    console.log('applyPlayerMove', move, playerId);
    console.log('Received player move from peer:', playerId, move);

    if (!lobbyState) {
      console.error('Lobby state not found');
      return;
    }

    switch (move.move) {
      case 'set-game-choice':
        const updatedLobbyForGameChoice = await playerSetGameChoice(gameRegistry, lobbyState, playerId, move.gameChoice);
        if (updatedLobbyForGameChoice) {
          updateLobby(lobbyId, updatedLobbyForGameChoice);
        }
        break;

      case 'take-seat':
        const updatedLobbyForSeat = await playerTakeSeat(gameRegistry, lobbyState, playerId);
        console.log('updatedLobbyForSeat', updatedLobbyForSeat);
        if (updatedLobbyForSeat) {
          updateHostedLobbyPlayerPool(lobbyId, updatedLobbyForSeat.playerPool as PlayerProfileId[]);
          updateLobby(lobbyId, updatedLobbyForSeat);
        }
        break;

      case 'leave-seat':
        const updatedLobbyForLeaveSeat = await playerLeaveSeat(gameRegistry, lobbyState, playerId);
        console.log('updatedLobbyForLeaveSeat', updatedLobbyForLeaveSeat);
        if (updatedLobbyForLeaveSeat) {
          updateHostedLobbyPlayerPool(lobbyId, updatedLobbyForLeaveSeat.playerPool as PlayerProfileId[]);
          updateLobby(lobbyId, updatedLobbyForLeaveSeat);
        }
        break;
      
      default:
        console.error('Unknown player move:', move);
        break;
    }
  }

  const onSelectGameChoice = async (gameChoice: BfgSupportedGameTitle) => {
    applyPlayerMove({ move: 'set-game-choice', gameChoice: gameChoice }, hostPlayerProfile.id);
  }

  const onTakeSeat = async () => {
    applyPlayerMove({ move: 'take-seat' }, hostPlayerProfile.id);
  }
  
  const onLeaveSeat = async () => {
    applyPlayerMove({ move: 'leave-seat' }, hostPlayerProfile.id);
  }


  // Handle peer connections
  room.onPeerJoin((peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    console.log('Peer joined:', peerId)

    doSendLobbyData(peerId);
  })

  const [sendLobbyData] = room.makeAction<HostP2pLobbyDetails>(P2P_LOBBY_DETAILS_ACTION_KEY);

  const doSendLobbyData = useCallback((peerId: PeerId) => {
    if (lobbyState) {
      const lobbyData: HostP2pLobbyDetails = {
        hostPlayerProfile,
        lobbyOptions,
        lobbyState,
      }

      console.log('sending lobby data', lobbyData);
      sendLobbyData(lobbyData, peerId);
    } else {
      console.log('no lobby details to send');
    }
  }, [hostPlayerProfile, lobbyOptions, lobbyState, sendLobbyData]);

  const broadcastLobbyData = useCallback(() => {
    if (lobbyState) {
      const lobbyData: HostP2pLobbyDetails = {
        hostPlayerProfile: hostPlayerProfile,
        lobbyOptions: lobbyOptions,
        lobbyState: lobbyState,
      }
      sendLobbyData(lobbyData);
    } else {
      console.log('no lobby details to send');
    }
  }, [hostPlayerProfile, lobbyOptions, lobbyState, sendLobbyData]);


  getPlayerMove(async (move: PlayerP2pLobbyMove, peer: string) => {
    const peerId = PeerIdSchema.parse(peer);
    const playerProfileId = peerProfiles.get(peerId)?.id;
    if (!playerProfileId) {
      console.error('Player profile ID not found for peer:', peer);
      return;
    }
    await applyPlayerMove(move, playerProfileId);
  })

  const onSetLobbyOptions = (lobbyOptions: LobbyOptions) => {
    setLobbyOptions(lobbyOptions);
    broadcastLobbyData();
  }


  useEffect(() => {
    if (lobbyState) {
      sendLobbyData({
        hostPlayerProfile: hostPlayerProfile,
        lobbyState: lobbyState,
        lobbyOptions: lobbyOptions,
      });
    }
  }, [lobbyState]);

  const retVal: IHostedP2pLobbyWithStoreData = {
    p2pLobby: p2pLobby,
    lobbyDetails: p2pLobby.lobbyDetails,
    connectionStatus: p2pLobby.connectionStatus,
    connectionEvents,
    peerProfiles,
    allPlayerProfiles,
    
    sendLobbyData,
    getPlayerProfile: (callback: (playerProfile: PublicPlayerProfile, peer: PeerId) => void) => {
      getPlayerProfile((playerProfile: PublicPlayerProfile, peer: string) => {
        const peerId = PeerIdSchema.parse(peer);
        callback(playerProfile, peerId);
      });
    },
    refreshConnection,

    lobbyState,
    lobbyOptions,
    setLobbyOptions: onSetLobbyOptions,
    lobbyActions,

    onSelectGameChoice,
    onTakeSeat,
    onLeaveSeat,
  }
  
  return retVal;
}
