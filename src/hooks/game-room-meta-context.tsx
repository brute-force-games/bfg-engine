// import { createContext, useContext, useEffect, useState } from "react";
// import { GameTable } from "@bfg-engine/models/game-table/game-table";
// import { DbGameTableAction } from "@bfg-engine/models/game-table/game-table-action";
// import { useP2pGameRoomContext } from "./p2p/game/p2p-game-room-context";
// import { useGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry-hook";
// import { isMessageFromHost } from "@bfg-engine/models/game-table/utils";
// import type { BfgGameEngineMetadata } from "../game-metadata/metadata-types";
// import type { BfgGameActionByHost, BfgGameActionByPlayer } from "../game-metadata/metadata-types/game-action-types";
// import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../game-metadata/metadata-types/game-state-types";
// import type { GameTableAccessLevel } from "../models/game-roles";
// import type { GenericGameMetadata } from "../game-metadata/games-registry";


// export interface IGameRoomMetaValue<
//   GSH extends BfgGameStateForHost,
//   GSP extends BfgGameStateForPlayer,
//   GSW extends BfgGameStateForWatcher,
//   PGA extends BfgGameActionByPlayer,
//   HGA extends BfgGameActionByHost,
// > {
//   gameTable: GameTable;
//   // gameActions: DbGameTableAction[];

//   genericGameMetadata: GenericGameMetadata;
//   gameMetadata: BfgGameEngineMetadata<GSH, GSP, GSW, PGA, HGA>;

//   accessRole: GameTableAccessLevel;
//   maxAllowedAccessRole: GameTableAccessLevel;
//   allowedRoles: GameTableAccessLevel[];
// }


// export interface IGameRoomMetaContextProviderProps {
//   // gameTableId: BfgGameTableId;
//   // requestedRole: GameTableAccessLevel;
//   children: React.ReactNode;
// }


// type GameRoomMetaContextValue = IGameRoomMetaValue<
//   BfgGameStateForHost,
//   BfgGameStateForPlayer,
//   BfgGameStateForWatcher,
//   BfgGameActionByPlayer,
//   BfgGameActionByHost
// >;

// const GameRoomMetaContext = createContext<GameRoomMetaContextValue | null>(null);

// export const GameRoomMetaContextProvider = ({ 
//   children 
// }: IGameRoomMetaContextProviderProps) => {
//   const p2pGameRoom = useP2pGameRoomContext();
//   const gameRegistry = useGameRegistry();
//   const { requestedRole } = p2pGameRoom;

//   const [gameTable, setGameTable] = useState<GameTable | null>(null);
//   // const [gameActions, setGameActions] = useState<DbGameTableAction[]>([]);

//   // Fetch game metadata based on game table's game title
//   const genericGameMetadata = gameTable ? 
//     gameRegistry.getGameMetadata(gameTable.gameTitle) : 
//     null;

//   useEffect(() => {
//     // Subscribe to game table data updates
//     const rxPublicGameTableDataUnsubscribe = p2pGameRoom.rxPublicGameTableData((receivedGameTable, peerId) => {
//       const isFromHost = isMessageFromHost(peerId);
//       if (!isFromHost) {
//         console.log('🎮 Received game table data from non-host peer:', peerId, receivedGameTable);
//         return;
//       }
//       console.log('🎮 Received game table data from host:', peerId, receivedGameTable);
//       setGameTable(receivedGameTable);
//     });

//     // // Subscribe to game actions data updates
//     // const rxPublicGameActionsDataUnsubscribe = p2pGameRoom.rxPublicGameActionsData((receivedGameActions, peerId) => {
//     //   const isFromHost = isMessageFromHost(peerId);
//     //   if (!isFromHost) {
//     //     console.log('🎮 Received game actions data from non-host peer:', peerId, receivedGameActions);
//     //     return;
//     //   }
//     //   console.log('🎮 Received game actions data from host:', peerId, receivedGameActions);
//     //   setGameActions(receivedGameActions);
//     // });

//     // Clean up subscriptions on unmount
//     return () => {
//       rxPublicGameTableDataUnsubscribe();
//       // rxPublicGameActionsDataUnsubscribe();
//     };
//   }, [p2pGameRoom]);


//   const getReturnValue = (): GameRoomMetaContextValue | null => {
//     if (!gameTable || !genericGameMetadata) {
//       return null;
//     }
    

//     const returnValue: GameRoomMetaContextValue = {
//       gameTable,
//       genericGameMetadata,
//       gameMetadata: genericGameMetadata
      
//     };

//     return returnValue;
//   }

//   const retVal = getReturnValue();

//   return (
//     <GameRoomMetaContext.Provider value={retVal}>
//       {children}
//     </GameRoomMetaContext.Provider>
//   );
// }


// export const useGameRoomMetaContext = (): GameRoomMetaContextValue => {
//   const context = useContext(GameRoomMetaContext);
//   if (!context) {
//     throw new Error('useGameRoomMetaContext must be used within a GameRoomMetaContextProvider');
//   }
  
//   return context;
// }

