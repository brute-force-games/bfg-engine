# Settings Dialogs

This directory contains the settings dialog components that implement a hierarchical preference system for the BFG game engine.

## Overview

The settings system implements a three-tier hierarchy:

1. **App Settings** - Global defaults for all games
2. **Game Settings** - Per-game-type settings (overrides app settings)
3. **Table Settings** - Per-game-table settings (overrides game settings)

## Components

### AppSettingsDialog

The global settings dialog that sets defaults for all games. This is available in the global app bar user menu.

```typescript
import { AppSettingsDialog } from 'bfg-engine';

<AppSettingsDialog 
  open={isOpen} 
  onClose={() => setIsOpen(false)} 
/>
```

**Location**: Global app bar user menu → "App Settings"

### GameSettingsDialog

Settings dialog for a specific game type. Shows inherited values from app settings. This should be used **contextually** when viewing a specific game.

```typescript
import { GameSettingsDialog } from 'bfg-engine';

<GameSettingsDialog 
  open={isOpen} 
  onClose={() => setIsOpen(false)}
  gameTitle="Tic-Tac-Toe" 
/>
```

**Location**: 
- Should be added to game-specific screens (e.g., game lobby, game info page)
- The menu item appears in the global app bar but is **disabled** with a tooltip explaining it requires game context

### TableSettingsDialog

Settings dialog for a specific game table. Shows inherited values from game and app settings. This should be used **contextually** when playing at a specific table.

```typescript
import { TableSettingsDialog } from 'bfg-engine';

<TableSettingsDialog 
  open={isOpen} 
  onClose={() => setIsOpen(false)}
  BfgGameTableId={tableId}
  gameTitle="Tic-Tac-Toe" 
/>
```

**Location**: 
- Should be added to active game table screens (e.g., game play screen, table controls)
- The menu item appears in the global app bar but is **disabled** with a tooltip explaining it requires table context

## Menu Behavior

In the global app bar user menu:
- **App Settings** - Always enabled, opens immediately
- **Game Settings** - Disabled by default, enabled when gameContext contains a gameTitle
- **Table Settings** - Disabled by default, enabled when gameContext contains both gameTitle and BfgGameTableId

## Providing Game Context

### Automatic in BfgGameScreenFrame

If you're using `BfgGameScreenFrame`, game context is **automatically provided** to the app bar. The component extracts the game title and table ID from the `gameTable` prop and passes it to the navigation components.

```typescript
// In your game page component
<BfgGameScreenFrame
  tabsConfig={tabsConfig}
  gameMetadata={gameMetadata}
  gameTable={gameTable}  // ← Game context extracted from here
  allPlayerProfiles={allPlayerProfiles}
  gameState={gameState}
  gameActions={gameActions}
>
  {/* Your game UI */}
</BfgGameScreenFrame>
```

The settings menu will automatically show:
- "Game Settings (Tic-Tac-Toe)" - enabled
- "Table Settings (Tic-Tac-Toe)" - enabled

### Manual Configuration

For custom layouts outside of `BfgGameScreenFrame`, you can manually pass game context:

```typescript
import { 
  UserProfileAccessComponent, 
  EMPTY_GAME_CONTEXT,
  type OptionalGameContext 
} from 'bfg-engine';
import { useBfgGameRoomForContextRole } from '@bfg-engine/hooks/p2p/game/use-bfg-game-room';

// Example 1: In a game page with access to game room
function GamePage() {
  const gameRoom = useBfgGameRoomForContextRole();
  const gameContext: OptionalGameContext = gameRoom?.publicGameDetails?.gameTable 
    ? {
        gameTitle: gameRoom.publicGameDetails.gameTable.gameTitle,
        gameTableId: gameRoom.gameTableId,
        tableName: gameRoom.publicGameDetails.gameTable.currentStatusDescription
      }
    : EMPTY_GAME_CONTEXT;

  return (
    <UserProfileAccessComponent 
      myPlayerProfiles={profiles}
      myDefaultPlayerProfile={defaultProfile}
      gameContext={gameContext}  // ← Pass the context here
    />
  );
}

// Example 2: Outside game context (global menu)
function GlobalNav() {
  return (
    <UserProfileAccessComponent 
      myPlayerProfiles={profiles}
      myDefaultPlayerProfile={defaultProfile}
      // gameContext prop is optional, defaults to EMPTY_GAME_CONTEXT
    />
  );
}

// Example 3: Partial context (game lobby, no table yet)
function GameLobby() {
  const gameContext: OptionalGameContext = {
    gameTitle: 'Tic-Tac-Toe',
    gameTableId: null,
    tableName: null
  };
  
  return (
    <UserProfileAccessComponent 
      myPlayerProfiles={profiles}
      myDefaultPlayerProfile={defaultProfile}
      gameContext={gameContext}  // Game Settings enabled, Table Settings disabled
    />
  );
}
```

### Game Context Interface

```typescript
interface OptionalGameContext {
  gameTitle: BfgSupportedGameTitle | null;
  gameTableId: BfgGameTableId | null;
  tableName: string | null;
}
```

- **`gameTitle`**: null when not in a game context
- **`gameTableId`**: null when in a game lobby but not at a specific table
- **`tableName`**: The name of the game table (null when not at a table, otherwise the lobby name or custom table name)
- Both gameTitle and BfgGameTableId null: Only App Settings enabled
- gameTitle only: App Settings + Game Settings enabled
- Both present: All three settings dialogs enabled

### Dialog Titles

The dialog titles automatically adapt to the context:

- **App Settings**: Always shows "App Settings"
- **Game Settings**: Shows "Game Settings: {gameTitle}" (e.g., "Game Settings: Tic-Tac-Toe")
- **Table Settings**: 
  - With table name: "Table Settings - {gameTitle}: {tableName}" (e.g., "Table Settings - Tic-Tac-Toe: My Game Room")
  - Without table name: "Table Settings - {gameTitle}" (fallback if tableName is not available)

## Shared Fields

All three dialogs share the same settings fields:

- **Game Spine Location** - Where the game controls spine is displayed
  - Options: Navigation Bar, Top, Left, Right, Bottom, Hidden
  
- **Game Log Panel Location** - Where the game log panel is displayed
  - Options: None (Hidden), Left Side, Right Side
  
- **Player Agent Mode** - Auto-play mode for the player
  - Options: None (Manual Play), Chaotic Random, Try to Win, Try to Lose

## Preference Hierarchy

The system implements a cascading preference hierarchy:

```
App Settings (Global)
  ↓ (inherits if not set)
Game Settings (Per Game Type)
  ↓ (inherits if not set)
Table Settings (Per Game Table)
```

### Example

1. User sets App Settings: `gameSpineLocation = "left"`
2. User opens "Tic-Tac-Toe" and sets Game Settings: `gameSpineLocation = "right"`
3. User opens specific Tic-Tac-Toe table and sets Table Settings: `gameSpineLocation = "top"`

Result:
- All other games use "left" (from App Settings)
- Other Tic-Tac-Toe tables use "right" (from Game Settings)
- This specific table uses "top" (from Table Settings)

## Hooks

### useUserGameSettings

Hook to get and manage game-specific settings.

```typescript
import { useUserGameSettings, useUserGameSettingsActions } from 'bfg-engine';

const settings = useUserGameSettings('Tic-Tac-Toe');
const { updateSettings, resetSettings } = useUserGameSettingsActions('Tic-Tac-Toe');
```

### useUserGameTableSettings

Hook to get and manage table-specific settings.

```typescript
import { useUserGameTableSettings, useUserGameTableSettingsActions } from 'bfg-engine';

const settings = useUserGameTableSettings(tableId);
const { updateSettings, resetSettings } = useUserGameTableSettingsActions(tableId);
```

## Helper Functions

### getEffectiveUserGameSettings

Get the effective settings for a game table, respecting the hierarchy.

```typescript
import { getEffectiveUserGameSettings } from 'bfg-engine';

const effectiveSettings = getEffectiveUserGameSettings(tableId, 'Tic-Tac-Toe');
```

### hasTableSpecificSettings

Check if a table has custom settings that override game defaults.

```typescript
import { hasTableSpecificSettings } from 'bfg-engine';

const hasCustom = hasTableSpecificSettings(tableId, 'Tic-Tac-Toe');
```

## Implementation Details

### SharedSettingsFields Component

The common settings fields have been extracted into a reusable component that all three dialogs use. This ensures consistency and makes it easy to add new settings fields in the future.

The component supports showing inherited values:

```typescript
<SharedSettingsFields
  gameSpineLocation={value}
  gameLogPanelLocation={value}
  playerAgentMode={value}
  onGameSpineLocationChange={handler}
  onGameLogPanelLocationChange={handler}
  onPlayerAgentModeChange={handler}
  showInheritedValue={true}
  inheritedValues={{
    gameSpineLocation: inheritedValue,
    gameLogPanelLocation: inheritedValue,
    playerAgentMode: inheritedValue,
  }}
/>
```

## Storage

Settings are persisted using TinyBase stores with local storage:

- App Settings: `tinybase_app_settings`
- Game Settings: `tinybase_user_game_settings`
- Table Settings: `tinybase_user_game_table_settings`

## Adding New Settings Fields

To add a new settings field:

1. Add the field type to `models/app-settings.ts`
2. Update `AppSettingsSchema` in `models/app-settings.ts`
3. Update `UserGameSettingsSchema` in `models/user-game-settings.ts` (make it optional)
4. Update `UserGameTableSettingsSchema` in `models/user-game-table-settings.ts` (make it optional)
5. Add the field to `SharedSettingsFields` component
6. Update the hierarchy logic in `user-game-settings-helpers.ts`

