// import { PrivatePlayerProfile } from "../../../models/player-profile/private-player-profile";
// import { BfgGameTableId, PlayerProfileId } from "../../../models/types/bfg-branded-ids";
// import { DbGameTableAction } from "../../../models/game-table/game-table-action";
// import { GameTable, GameTableSeat } from "../../../models/game-table/game-table";
// import { matchPlayerToSeat } from "../../../ops/game-table-ops/player-seat-utils";
// import { PublicPlayerProfile } from "../../../models/player-profile/public-player-profile";
// import { ConnectionEvent, PeerId, PlayerP2pActionStr, PrivatePlayerKnowledgeStr } from "../p2p-types";
// import { useP2pGameRoomContext } from "./p2p-game-room-context";
// import { useState } from "react";


// interface IPlayerP2pGame {
//   connectionStatus: string;
//   connectionEvents: ConnectionEvent[];
  
//   gameTable: GameTable | null;
//   gameActions: DbGameTableAction[];

//   peers: PeerId[];
//   peerPlayers: Map<PeerId, PublicPlayerProfile>
//   allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

//   myPlayerSeat: GameTableSeat | undefined;

//   txPlayerActionStr: (actionStr: PlayerP2pActionStr) => void
//   rxPlayerActionStr: (callback: (actionStr: PlayerP2pActionStr, peer: PeerId) => void) => void

//   myPrivatePlayerKnowledgeStr: PrivatePlayerKnowledgeStr | null;
  
//   refreshConnection: () => void
// }


// export const usePlayerP2pGame = (
//   gameTableId: BfgGameTableId,
//   myPlayerProfile: PrivatePlayerProfile,
// ): IPlayerP2pGame | null => {

//   const p2pGameRoom = useP2pGameRoomContext();

//   const { gameTable, rxPrivatePlayerKnowledgeStr } = p2pGameRoom;

//   const [myPrivatePlayerKnowledgeStr, setMyPrivatePlayerKnowledgeStr] = useState<PrivatePlayerKnowledgeStr | null>(null)
  
//   // if (!gameTable) {
//   //   console.warn("MISSING GAME TABLE");
//   //   return null;
//   // }

//   // const p2pGameTable = p2pGame.gameTable;

//   // if (p2pGameTable?.id !== BfgGameTableId) {
//   //   throw new Error('P2P game table ID does not match the game table ID: ' + p2pGameTable?.id + ' !== ' + BfgGameTableId);
//   // }

//   const myPlayerSeat = gameTable === null ? undefined : matchPlayerToSeat(myPlayerProfile.id, gameTable);

//   // rxPrivatePlayerKnowledgeStr((privatePlayerKnowledgeStr: PrivatePlayerKnowledgeStr, peer: PeerId) => {
//   //   console.log('🎮 Received private player knowledge data from peer:', peer, privatePlayerKnowledgeStr);
//   //   setMyPrivatePlayerKnowledgeStr(privatePlayerKnowledgeStr);
//   // });


//   const retVal: IPlayerP2pGame = {
//     ...p2pGame,
//     myPlayerSeat,
//     myPrivatePlayerKnowledgeStr,
//   };

//   return retVal;
// }
