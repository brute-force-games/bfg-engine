export { registerGame, useGameRegistry, } from './hooks/games-registry/games-registry';
export type { BfgSupportedGameTitle, GameDefinition } from './models/game-box-definition';
export type { GameHostingContextType } from './hooks/games-registry/game-hosting';
export { GameHostingProvider, useGameHosting } from './hooks/games-registry/game-hosting';
export type { GameTableId, GameFriendId, GameLobbyId, PlayerProfileId } from './models/types/bfg-branded-ids';
export type { TrysteroConfig } from './p2p/trystero-config';
export { ProfileGuard } from './ui/components/profile-guard';
export { P2pConnectionComponent } from './ui/components/p2p-connection-component';
export { P2pHostedLobbyContextProvider, useP2pHostedLobbyContext } from './hooks/p2p/lobby/hosted-p2p-lobby-context';
export { LobbyPlayerJoinGameComponent } from './ui/components/lobby-player-join-game-component';
export { LobbyPlayerStateComponent } from './ui/components/lobby-player-state-component';
export { PlayerP2pGameComponent } from './ui/components/player-p2p-game-component';
export { ObserverP2pGameComponent } from './ui/components/observer-p2p-game-component';
export { useMyPlayerProfiles, useMyDefaultPlayerProfile, useRiskyMyDefaultPlayerProfile } from './hooks/stores/use-my-player-profiles-store';
export type { BfgGameEngineProcessor, GameStateJson as GameStateJson, GameActionJson } from './models/game-engine/bfg-game-engines';
export { createBfgGameEngineProcessor } from './models/bfg-game-engine-metadata';
export type { IBfgGameEngineProcessor } from './models/bfg-game-engine-metadata';
export { GameTableSeatSchema } from './models/game-table/game-table';
export type { GameTableActionResult } from './models/game-table/table-phase';
export type { BfgGameSpecificTableAction } from './models/game-table/game-table-action';
export type { BfgGameSpecificGameState } from './models/game-table/game-table-action';
export type { BfgGameSpecificAction } from './models/game-table/game-table-action';
export { useGameMetadata } from './hooks/games-registry/use-game-metadata';

// Crypto exports
export { WebCryptoWallet } from './crypto/web-crypto-wallet';
export type { SignedMessage, EncryptedMessage, ExportedWallet } from './crypto/web-crypto-wallet';
export type { IWebCryptoWallet } from './crypto/types';
export { createWalletSignedMove, verifySignedMove, initializeNewWallet, initializeWalletFromExport } from './crypto/crypto-utils';
export type { SignedMove } from './crypto/crypto-utils';

// Player profile exports
export type { PublicPlayerProfile } from './models/player-profile/public-player-profile';
export type { PrivatePlayerProfile } from './models/player-profile/private-player-profile';
export { getWalletFromProfile, createPrivatePlayerProfile, createPlayerProfileFromExportedWallet, rotateWalletKeys } from './models/player-profile/private-player-profile';
export type { ExportedWallet as ProfileExportedWallet } from './models/player-profile/private-player-profile';
export { PublicJWKSchema, PrivateJWKSchema } from './models/player-profile/public-player-profile';

// UI Component exports
export * from './ui/bfg-ui';

// BFG Routes - for combining with app routes
export { combineBfgRoutesWithAppRoutes, getBfgRouteChildren } from './bfg-routes'
