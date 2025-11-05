// import { createContext, useContext } from "react";
// import { IP2pGame, IP2pGameProps, useP2pGame } from "./use-p2p-game";
// import { GameTableAccessRole } from "~/models/game-roles";
// import { PrivatePlayerProfile } from "~/models/player-profile/private-player-profile";
// import { useHostedP2pGameWithStore } from "./use-hosted-p2p-game-with-store";


// export interface IP2pGameValue {
//   // myPlayerProfile: PrivatePlayerProfile | null;
//   // myGameTableAccess: GameTableAccessRole;
// }


// export interface IP2pGameContextProviderProps extends IP2pGameProps {
//   myPlayerProfile: PrivatePlayerProfile | null;
//   requestedRole: GameTableAccessRole;
//   children: React.ReactNode;
// }

// const P2pGameRoomContext = createContext<IP2pGameRoomValue | null>(null);

// export const P2pGameRoomContextProvider = ({ 
//   gameTableId,
//   myPlayerProfile,
//   requestedRole,
//   children 
// }: IP2pGameRoomContextProviderProps) => {

//   const isValidHost = requestedRole === 'host' && myPlayerProfile;

//   const p2pGame = isValidHost ? 
//     useHostedP2pGameWithStore(gameTableId, myPlayerProfile) : 
//     useP2pGame({
//       gameTableId,
//       myPlayerProfile,
//       requestedRole,
//     });

//   const retVal: IP2pGameValue = {
//     ...p2pGame,
//     myPlayerProfile,
//   };

//   return (
//     <P2pGameRoomContext.Provider value={retVal}>
//       {children}
//     </P2pGameRoomContext.Provider>
//   )
// }


// export const useP2pGameRoomContext = (): IP2pGameRoomValue => {
//   const context = useContext(P2pGameRoomContext);
//   if (!context) {
//     throw new Error('useP2pGameRoomContext must be used within a P2pGameRoomContextProvider');
//   }
//   return context;
// }
