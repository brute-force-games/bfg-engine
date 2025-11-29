export { useGameRegistry, } from './hooks/games-registry/games-registry-hook';
export { registerGame } from './game-metadata/games-registry';
export type { BfgSupportedGameTitle, GameDefinition } from './models/game-box-definition';
export type { SiteHostingContextType as GameHostingContextType, Environment, EnvSettings } from './hooks/site-hosting';
export { SiteHostingProvider as GameHostingProvider, useSiteHosting } from './hooks/site-hosting';
export type { BfgGameTableId, GameFriendId, GameLobbyId, PlayerProfileId } from './models/types/bfg-branded-uuids';
export type { TrysteroConfig } from './p2p/trystero-config';
export { ProfileGuard } from './ui/components/profile-guard';
export { P2pConnectionComponent } from './ui/components/p2p-connection-component';
export { P2pHostedLobbyContextProvider, useP2pHostedLobbyContext } from './hooks/p2p/lobby/hosted-p2p-lobby-context';
export { LobbyPlayerJoinGameComponent } from './ui/components/lobby/lobby-player-join-game-component';
export { LobbyPlayerStateComponent } from './ui/components/lobby/lobby-player-state-component';
export { PlayerP2pGameComponent } from './ui/components/player-p2p-game-component';
export { ObserverP2pGameComponent } from './ui/components/observer-p2p-game-component';
export { useMyPlayerProfiles, useMyDefaultPlayerProfile, useRiskyMyDefaultPlayerProfile } from './hooks/stores/use-my-player-profiles-store';
export { GameTableSeatSchema } from './models/internal/game-room-base';
// export type { GameTableEventResult as GameTableActionResult } from './models/game-table/table-phase';
// export type { BfgGameSpecificTableAction } from './models/game-table/game-table-event';
// export type { BfgGameSpecificGameState } from './models/game-table/game-table-action';
// export type { BfgGameSpecificAction } from './models/game-table/game-table-action';
// export { useGameMetadata } from './hooks/games-registry/use-game-metadata';
export { useGameMetadata } from './hooks/games-registry/use-game-metadata';

// Crypto exports
export { WebCryptoWallet } from './crypto/web-crypto-wallet';
export type { SignedMessage, EncryptedMessage, ExportedWallet } from './crypto/web-crypto-wallet';
export type { IWebCryptoWallet } from './crypto/types';
export { createWalletSignedMove, verifySignedMove, initializeNewWallet, initializeWalletFromExport } from './crypto/crypto-utils';
export type { SignedMove } from './crypto/crypto-utils';

// Player profile exports
export type { PublicPlayerProfile } from './models/internal/player-profile/public-player-profile';
export type { PrivatePlayerProfile } from './models/internal/player-profile/private-player-profile';
export { getWalletFromProfile, createPrivatePlayerProfile, createPlayerProfileFromExportedWallet, rotateWalletKeys } from './models/internal/player-profile/private-player-profile';
export type { ExportedWallet as ProfileExportedWallet } from './models/internal/player-profile/private-player-profile';
export { PublicJWKSchema, PrivateJWKSchema } from './models/internal/player-profile/public-player-profile';

// UI Component exports
export * from './ui/bfg-ui';

// BFG Routes - for combining with app routes
export { combineBfgRoutesWithAppRoutes, getBfgRouteChildren } from './bfg-routes'

// User game settings exports (per game type - serves as defaults)
export type { UserGameSettings } from './models/user-game-settings';
export { DEFAULT_USER_GAME_SETTINGS } from './models/user-game-settings';
export { 
  getUserGameSettings,
  updateUserGameSettings,
  resetUserGameSettings,
  deleteUserGameSettings,
  getAllUserGameSettings,
  clearAllUserGameSettings,
  userGameSettingsStore
} from './tb-store/user-game-settings-store';
export {
  useUserGameSettings,
  useUserGameSettingsActions
} from './hooks/stores/use-user-game-settings-store';

// User game table settings exports (per game table - overrides game settings)
export type { UserGameTableSettings } from './models/user-game-table-settings';
export { DEFAULT_USER_GAME_TABLE_SETTINGS } from './models/user-game-table-settings';
export { 
  getUserGameTableSettings,
  updateUserGameTableSettings,
  resetUserGameTableSettings,
  deleteUserGameTableSettings,
  getAllUserGameTableSettings,
  clearAllUserGameTableSettings,
  userGameTableSettingsStore
} from './tb-store/user-game-table-settings-store';
export {
  useUserGameTableSettings,
  useUserGameTableSettingsActions
} from './hooks/stores/use-user-game-table-settings-store';

// User game settings helpers (hierarchical lookup)
export { 
  getEffectiveUserGameSettings,
  hasTableSpecificSettings
} from './tb-store/user-game-settings-helpers';

// Settings dialog components
export { AppSettingsDialog } from './ui/components/app-settings/app-settings-dialog';
export { GameSettingsDialog } from './ui/components/app-settings/game-settings-dialog';
export { TableSettingsDialog } from './ui/components/app-settings/table-settings-dialog';
export { SharedSettingsFields } from './ui/components/app-settings/shared-settings-fields';

// Game context utilities
export type { OptionalGameContext } from './hooks/p2p/game/use-optional-game-context';
export { EMPTY_GAME_CONTEXT } from './hooks/p2p/game/use-optional-game-context';
