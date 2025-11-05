import {useEffect, useRef} from 'react'
import {joinRoom} from 'trystero'

import { TrysteroConfig } from '../models/trystero-config'


export const useRoom = (roomConfig: TrysteroConfig, roomId: string) => {
  console.log('calling useRoom for room', roomId)

  const roomRef = useRef(joinRoom(roomConfig, roomId, (error: {
      error: string;
      appId: string;
      roomId: string;
      peerId: string;
    }) => {
      console.error('Join error:', error)
      // addConnectionEvent('join-error', `Join error: ${error.error}`, 0);
    }))
  const lastRoomIdRef = useRef(roomId)

  roomRef.current.onPeerJoin(peer => {
    console.log('ref peer joined', peer)
  })
  roomRef.current.onPeerLeave(peer => {
    console.log('ref peer left', peer)
  })

  useEffect(() => {
    if (roomId !== lastRoomIdRef.current) {
      void roomRef.current.leave()
      roomRef.current = joinRoom(roomConfig, roomId)
      lastRoomIdRef.current = roomId
    }

    return () => {
      console.log('leaving room', roomId)
      void roomRef.current.leave()
    }
  }, [roomConfig, roomId])

  return roomRef.current
}
