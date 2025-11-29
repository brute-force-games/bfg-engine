import { useEffect, useState } from "react";
import { selfId } from "trystero";
import type { PublicPlayerProfile } from "../../../models/internal/player-profile/public-player-profile";
import type { PlayerProfileId } from "../../../models/types/bfg-branded-uuids";
import { type PeerId, PeerIdSchema } from "../p2p-types";
import type { IP2pDetails } from "./p2p-game-types";
import type { IP2pRawRoomValue } from "./p2p-raw-room-context";


export const useP2pDetailsFromRawP2pRoom = (
  p2pRawRoom: IP2pRawRoomValue,
  myPlayerProfile: PublicPlayerProfile | null,
): IP2pDetails => {

  const { txPlayerProfile, onRoomPeerJoin, onRoomPeerLeave, rxPlayerProfile } = p2pRawRoom;

  const [peers, setPeers] = useState<PeerId[]>([]);
  const [peerIdsToPlayerIds, setPeerIdsToPlayerIds] = useState<Map<PeerId, PlayerProfileId>>(() => {
    const map = new Map<PeerId, PlayerProfileId>();
    if (myPlayerProfile) {
      const selfPeerId = PeerIdSchema.parse(selfId);
      map.set(selfPeerId, myPlayerProfile.id);
    }
    return map;
  });
  
  const [allPlayerProfiles, setAllPlayerProfiles] = useState<Map<PlayerProfileId, PublicPlayerProfile>>(new Map());

  useEffect(() => {
    // Send our profile immediately when joining
    if (myPlayerProfile) {
      console.log('🎮 Player: Broadcasting profile to all peers on join:', myPlayerProfile);
      txPlayerProfile(myPlayerProfile);
    }
    
    const onRoomPeerJoinUnsubscribe = p2pRawRoom.onRoomPeerJoin((peerId: PeerId) => {
      console.log('🎮 Player: Peer joined (likely host):', peerId);
      setPeers(prev => [...prev, peerId]);
      
      // Send our profile to the new peer as well
      if (myPlayerProfile) {
      console.log('🎮 Player: Sending profile to new peer:', peerId, myPlayerProfile);
        txPlayerProfile(myPlayerProfile, peerId);
      }
    });

    const onRoomPeerLeaveUnsubscribe = p2pRawRoom.onRoomPeerLeave((peerId: PeerId) => {
      console.log('🎮 Player: Peer left:', peerId);
      setPeers(prev => prev.filter(p => p !== peerId));
      
      // Clean up the peerPlayerIds mapping
      setPeerIdsToPlayerIds(prev => {
        const newMap = new Map(prev);
        newMap.delete(peerId);
        return newMap;
      });
    });

    const rxPlayerProfileUnsubscribe = p2pRawRoom.rxPlayerProfile((playerProfile, peerId) => {
      setAllPlayerProfiles(prev => {
        const newMap = new Map(prev);
        newMap.set(playerProfile.id, playerProfile);
        return newMap;
      });
      setPeerIdsToPlayerIds(prev => {
        const newMap = new Map(prev);
        newMap.set(peerId, playerProfile.id);
        return newMap;
      });
    });

    return () => {
      onRoomPeerJoinUnsubscribe();
      onRoomPeerLeaveUnsubscribe();
      rxPlayerProfileUnsubscribe();
    };
  }, [myPlayerProfile, txPlayerProfile, onRoomPeerJoin, onRoomPeerLeave, rxPlayerProfile]);

  const p2pDetails: IP2pDetails = {
    peerIds: peers,
    peerIdsToPlayerIds: peerIdsToPlayerIds,
    allPlayerProfiles: allPlayerProfiles,
    myPeerProfile: myPlayerProfile,
    connectionStatus: p2pRawRoom.connectionStatus,
    connectionEvents: p2pRawRoom.connectionEvents,
  };

  return p2pDetails;
}