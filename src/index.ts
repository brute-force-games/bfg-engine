export { registerGame, useGameRegistry, } from './hooks/games-registry/games-registry';
export type { BfgSupportedGameTitle, GameDefinition } from './models/game-box-definition';
export type { GameHostingContextType } from './hooks/games-registry/game-hosting';
export { GameHostingProvider, useGameHosting } from './hooks/games-registry/game-hosting';
export type { GameTableId, GameFriendId, GameLobbyId, PlayerProfileId } from './models/types/bfg-branded-ids';
export type { TrysteroConfig } from './p2p/trystero-config';
export { NewLobbyPage } from './ui/pages/new-lobby-page';
export { ProfileGuard } from './ui/components/profile-guard';
export { useMyPlayerProfiles } from './hooks/stores/use-my-player-profiles-store';
export type { BfgGameEngineProcessor, GameStateJson, GameActionJson } from './models/game-engine/bfg-game-engines';
export { createBfgGameEngineProcessor } from './models/bfg-game-engine-metadata';
export type { IBfgGameEngineProcessor } from './models/bfg-game-engine-metadata';
export { GameTableSeatSchema } from './models/game-table/game-table';
export type { GameTableActionResult } from './models/game-table/table-phase';
export type { BfgGameSpecificTableAction } from './models/game-table/game-table-action';
export type { BfgGameSpecificGameState } from './models/game-table/game-table-action';
export type { BfgGameSpecificAction } from './models/game-table/game-table-action';

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
