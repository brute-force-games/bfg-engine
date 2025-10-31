// import { z } from "zod"
// import { useMemo, createContext, useContext, ReactNode } from "react"
// import { usePlayerP2pGame } from "./use-player-p2p-game"
// import { useGameRegistry } from "~/hooks/games-registry/games-registry"
// import { PrivatePlayerProfile } from "~/models/player-profile/private-player-profile"
// import { GameTableId } from "~/models/types/bfg-branded-ids"
// import { PlayerP2pActionStr } from "../p2p-types"
// import { BfgEncodedString, IBfgJsonZodObjectDataEncoder } from "~/models/game-engine/encoders"


// interface IPlayerP2pGameContextValue {
//   p2pGame: ReturnType<typeof usePlayerP2pGame> | null
//   gameTable: any | null
//   gameActions: any[]
//   latestAction: any | null
//   gameSpecificState: unknown | null
//   gameMetadata: any | null
//   myPlayerSeat: string | null
//   txPlayerActionStr: (action: PlayerP2pActionStr) => void
//   isLoading: boolean
// }

// const PlayerP2pGameContextInternal = createContext<IPlayerP2pGameContextValue | undefined>(undefined)

// interface PlayerP2pGameProviderProps {
//   gameTableId: GameTableId
//   playerProfile: PrivatePlayerProfile
//   children: ReactNode
// }

// export const PlayerP2pGameProvider = ({ gameTableId, playerProfile, children }: PlayerP2pGameProviderProps) => {
//   const p2pGame = usePlayerP2pGame(gameTableId, playerProfile)
//   const gameRegistry = useGameRegistry()

//   const value = useMemo<IPlayerP2pGameContextValue>(() => {
//     if (!p2pGame) {
//       return {
//         p2pGame: null,
//         gameTable: null,
//         gameActions: [],
//         latestAction: null,
//         gameSpecificState: null,
//         gameMetadata: null,
//         myPlayerSeat: null,
//         txPlayerActionStr: () => {},
//         isLoading: true,
//       }
//     }

//     const { gameTable, gameActions, myPlayerSeat, txPlayerActionStr } = p2pGame

//     if (!gameTable || !gameActions) {
//       return {
//         p2pGame,
//         gameTable: null,
//         gameActions: [],
//         latestAction: null,
//         gameSpecificState: null,
//         gameMetadata: null,
//         myPlayerSeat: myPlayerSeat ?? null,
//         txPlayerActionStr,
//         isLoading: true,
//       }
//     }

//     const latestAction = gameActions[gameActions.length - 1] ?? null
//     if (!latestAction) {
//       return {
//         p2pGame,
//         gameTable,
//         gameActions,
//         latestAction: null,
//         gameSpecificState: null,
//         gameMetadata: null,
//         myPlayerSeat: myPlayerSeat ?? null,
//         txPlayerActionStr,
//         isLoading: false,
//       }
//     }

//     const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle)
//     const gameSpecificStateEncoder = gameMetadata.gameSpecificStateEncoder
//     if (gameSpecificStateEncoder.format !== 'json-zod-object') {
//       throw new Error('Game specific state encoder format is not json-zod-object')
//     }

//     const zodGameSpecificStateEncoder = gameSpecificStateEncoder as IBfgJsonZodObjectDataEncoder<any>
//     const zodGameSpecificStateSchema = zodGameSpecificStateEncoder.schema as z.ZodTypeAny
//     const nextGameStateStr: BfgEncodedString = latestAction.nextGameStateStr as unknown as BfgEncodedString
//     const gameSpecificState = gameSpecificStateEncoder.decode(nextGameStateStr) as z.infer<typeof zodGameSpecificStateSchema> | null

//     return {
//       p2pGame,
//       gameTable,
//       gameActions,
//       latestAction,
//       gameSpecificState,
//       gameMetadata,
//       myPlayerSeat: myPlayerSeat ?? null,
//       txPlayerActionStr,
//       isLoading: false,
//     }
//   }, [p2pGame, gameRegistry])

//   return (
//     <PlayerP2pGameContextInternal.Provider value={value}>
//       {children}
//     </PlayerP2pGameContextInternal.Provider>
//   )
// }

// export const usePlayerP2pGameContext = (): IPlayerP2pGameContextValue => {
//   const ctx = useContext(PlayerP2pGameContextInternal)
//   if (!ctx) {
//     throw new Error('usePlayerP2pGameContext must be used within PlayerP2pGameProvider')
//   }
//   return ctx
// }
