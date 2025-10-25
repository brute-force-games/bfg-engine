import { createContext, useContext, ReactNode } from 'react';
import { GameTableId } from '../../models/types/bfg-branded-ids';
import { PrivatePlayerProfile } from '~/models/player-profile/private-player-profile';
import { IHostedP2pGameWithStoreData, useHostedP2pGameWithStore } from './use-hosted-p2p-game-with-store';
import { matchPlayerToSeat } from '~/ops/game-table-ops/player-seat-utils';
import { GameTable, GameTableSeat } from '~/models/game-table/game-table';
import { DbGameTableAction } from '~/models/game-table/game-table-action';
import { PublicPlayerProfile } from '~/models/player-profile/public-player-profile';
import { PlayerP2pActionStr } from './p2p-types';


interface IHostedP2pGameWithStoreContext extends IHostedP2pGameWithStoreData {

  myHostPlayerProfile: PublicPlayerProfile;
  gameTable: GameTable;
  myPlayerSeat: GameTableSeat;

  gameActions: DbGameTableAction[];
  onSelfPlayerActionStr: (actionStr: PlayerP2pActionStr) => Promise<void>;
}

interface P2pHostedGameProviderProps {
  gameTableId: GameTableId;
  hostPlayerProfile: PrivatePlayerProfile;
  children: ReactNode;
}

const P2pHostedGameContext = createContext<IHostedP2pGameWithStoreContext | null>(null);

export const P2pHostedGameContextProvider = ({ 
  gameTableId,
  hostPlayerProfile,
  children 
}: P2pHostedGameProviderProps) => {

  const hostedP2pGame = useHostedP2pGameWithStore(gameTableId, hostPlayerProfile);
  const {
    room,
    connectionStatus,
    connectionEvents,
    peerProfiles,
    otherPlayerProfiles,
    allPlayerProfiles,

    txGameTableData,
    txGameActionsData,
    rxPlayerActionStr,
    refreshConnection,
    
    gameTable,
    gameActions: hostedGameActions,
    onSelfPlayerActionStr,
    onHostActionStr,
  } = hostedP2pGame;

  if (!hostPlayerProfile) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Profile...</h1>
        <div className="text-gray-600">Loading profile details...</div>
      </div>
    )
  }

  if (!hostedP2pGame) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
        <div className="text-gray-600">Loading P2P game details...</div>
      </div>
    )
  }

  if (!gameTable) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
        <div className="text-gray-600">Loading game details...</div>
      </div>
    )
  }

  const myPlayerSeat = matchPlayerToSeat(hostPlayerProfile.id, gameTable);

  if (!myPlayerSeat) {
    console.log("You are not at this game table")
    console.log("hostedGame", hostedP2pGame)
    console.log("myPlayerSeat", myPlayerSeat)
    console.log("hostPlayerProfile.id", hostPlayerProfile.id)
    // console.log("hostedGame.gameHostPlayerProfileId", hostedP2pGame.gameHostPlayerProfileId)
    return <div>You are not at this game table</div>;
  }

  
  const context: IHostedP2pGameWithStoreContext = {
    room,
    connectionStatus,
    connectionEvents,
    peerProfiles,
    otherPlayerProfiles,
    allPlayerProfiles,

    txGameTableData,
    txGameActionsData,
    rxPlayerActionStr,
    refreshConnection,

    gameTable,
    myHostPlayerProfile: hostPlayerProfile,
    myPlayerSeat,
    gameActions: hostedGameActions ?? [],

    onSelfPlayerActionStr,
    onHostActionStr,
  };

  return (
    <P2pHostedGameContext.Provider value={context}>
      {children}
    </P2pHostedGameContext.Provider>
  );
};

export const useP2pHostedGameContext = (): IHostedP2pGameWithStoreContext => {
  const context = useContext(P2pHostedGameContext);
  
  if (!context) {
    throw new Error('useP2pHostedGameContext must be used within a P2pHostedGameContextProvider');
  }
  
  return context;
};
