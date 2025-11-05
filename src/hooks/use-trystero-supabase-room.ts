import {useEffect, useRef} from 'react'
import {joinRoom} from 'trystero/supabase' // (trystero-supabase.min.js)

// import { TrysteroConfig } from '../models/trystero-config'

export const BfgStarterSupabaseTrysteroConfig: any = {
  appId: 'https://daqryoumnoqtafafupwz.supabase.co',
  
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcXJ5b3Vtbm9xdGFmYWZ1cHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODEzMDAsImV4cCI6MjA2Njk1NzMwMH0._gAsid1K4V64iO1EIIdhucrwjb7VIKg8jX6gggKbYhA',
  // supabaseKey: 'sb_publishable_45LWlYz6UL32br1_tn1Anw_ItkcFhCD',
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
