import { z } from "zod"
import { GameTableId } from "~/models/types/bfg-branded-ids"
import { useObserverP2pGame } from "./use-observer-p2p-game"
import { useGameRegistry } from "~/hooks/games-registry/games-registry"
import { useMemo, useState, useContext, createContext, ReactNode } from "react"
import { GameTableSeat } from "~/models/game-table/game-table"
import { BfgEncodedString, IBfgJsonZodObjectDataEncoder } from "~/models/game-engine/encoders"


// TODO: Delete previous UI component; this file now provides context only.

interface ObserverP2pGameContextValue {
  p2pGame: ReturnType<typeof useObserverP2pGame> | null
  gameTable: any | null
  gameActions: any[]
  latestAction: any | null
  gameSpecificState: unknown | null
  gameMetadata: any | null
  viewPerspective: GameTableSeat | null
  setViewPerspective: (seat: GameTableSeat | null) => void
  isLoading: boolean
}

const ObserverP2pGameContextInternal = createContext<ObserverP2pGameContextValue | undefined>(undefined)

interface ObserverP2pGameProviderProps {
  gameTableId: GameTableId
  children: ReactNode
}

export const ObserverP2pGameProvider = ({ gameTableId, children }: ObserverP2pGameProviderProps) => {
  const p2pGame = useObserverP2pGame(gameTableId)
  const [viewPerspective, setViewPerspective] = useState<GameTableSeat | null>(null)
  const gameRegistry = useGameRegistry()

  const { value } = useMemo(() => {
    if (!p2pGame || !p2pGame.gameTable || !p2pGame.gameActions) {
      return {
        value: {
          p2pGame: p2pGame ?? null,
          gameTable: null,
          gameActions: [],
          latestAction: null,
          gameSpecificState: null,
          gameMetadata: null,
          viewPerspective,
          setViewPerspective,
          isLoading: true,
        } as ObserverP2pGameContextValue,
      }
    }

    const gameTable = p2pGame.gameTable
    const gameActions = p2pGame.gameActions
    const latestAction = gameActions[gameActions.length - 1] ?? null

    if (!latestAction) {
      return {
        value: {
          p2pGame,
          gameTable,
          gameActions,
          latestAction: null,
          gameSpecificState: null,
          gameMetadata: null,
          viewPerspective,
          setViewPerspective,
          isLoading: false,
        } as ObserverP2pGameContextValue,
      }
    }

    const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle)
    const gameSpecificStateEncoder = gameMetadata.gameSpecificStateEncoder
    if (gameSpecificStateEncoder.format !== 'json-zod-object') {
      throw new Error('Game specific state encoder format is not json-zod-object')
    }

    const zodGameSpecificStateEncoder = gameSpecificStateEncoder as IBfgJsonZodObjectDataEncoder<any>
    const zodGameSpecificStateSchema = zodGameSpecificStateEncoder.schema as z.ZodTypeAny

    const nextGameStateStr: BfgEncodedString = latestAction.nextGameStateStr as unknown as BfgEncodedString
    const gameSpecificState = gameSpecificStateEncoder.decode(nextGameStateStr) as z.infer<typeof zodGameSpecificStateSchema> | null

    return {
      value: {
        p2pGame,
        gameTable,
        gameActions,
        latestAction,
        gameSpecificState,
        gameMetadata,
        viewPerspective,
        setViewPerspective,
        isLoading: false,
      } as ObserverP2pGameContextValue,
    }
  }, [p2pGame, gameRegistry, viewPerspective, setViewPerspective])

  return (
    <ObserverP2pGameContextInternal.Provider value={value}>
      {children}
    </ObserverP2pGameContextInternal.Provider>
  )
}

export const useObserverP2pGameContext = (): ObserverP2pGameContextValue => {
  const ctx = useContext(ObserverP2pGameContextInternal)
  if (!ctx) {
    throw new Error('useObserverP2pGameContext must be used within ObserverP2pGameProvider')
  }
  return ctx
}
