import {useEffect, useRef} from 'react'
import {joinRoom} from 'trystero/mqtt'

import { TrysteroConfig } from '../models/trystero-config'


export const useMqttRoom = (roomConfig: TrysteroConfig, roomId: string) => {
  console.log('calling useRoom for room', roomId)

  const roomRef = useRef(joinRoom(roomConfig, roomId))
  const lastRoomIdRef = useRef(roomId)

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
