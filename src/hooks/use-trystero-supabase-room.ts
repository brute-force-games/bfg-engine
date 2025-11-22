import {useEffect, useRef} from 'react'
import {joinRoom} from 'trystero/supabase' // (trystero-supabase.min.js)
import { env } from '../../../../src/env/env-schema';

// import { TrysteroConfig } from '../models/trystero-config'

export const BfgStarterSupabaseTrysteroConfig: any = {
  appId: env.VITE_SUPABASE_URL,
  supabaseKey: env.VITE_SUPABASE_ANON_KEY,
}

export const useSupabaseRoom = (roomId: string) => {
  const roomConfig = BfgStarterSupabaseTrysteroConfig;
  console.log('calling useSupabaseRoom for room', roomId)

  const roomRef = useRef(joinRoom(roomConfig, roomId));
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
