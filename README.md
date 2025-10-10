# BFG Engine

Core infrastructure and logic library for Brute Force Games.

## Features

- **Game Engine**: Core game loop, state management, and scene system
- **TypeScript**: Full TypeScript support with type definitions
- **React Integration**: React components for easy integration
- **Event System**: Robust event handling and communication
- **Logging**: Comprehensive logging system with different levels
- **Modular Architecture**: Clean separation of concerns

## Installation

```bash
npm install @brute-force-games/bfg-engine
```

## Usage

### Basic Game Engine

```typescript
import { GameEngine, GameConfig } from '@brute-force-games/bfg-engine';

const config: GameConfig = {
  width: 800,
  height: 600,
  fps: 60,
  debug: true
};

const engine = new GameEngine(config);
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
engine.initialize(canvas);

// Add a scene
engine.addScene({
  name: 'main',
  objects: [],
  onEnter: () => console.log('Entered main scene'),
  onUpdate: (deltaTime) => {
    // Update game logic
  }
});

engine.setScene('main');
engine.start();
```

### React Integration

```tsx
import React, { useRef } from 'react';
import { GameCanvas, GameConfig } from '@brute-force-games/bfg-engine';

const config: GameConfig = {
  width: 800,
  height: 600,
  fps: 60
};

function Game() {
  const canvasRef = useRef<GameCanvasRef>(null);

  const handleEngineReady = (engine: GameEngine) => {
    // Configure your game
    engine.addScene({
      name: 'main',
      objects: [],
      onUpdate: (deltaTime) => {
        // Game logic
      }
    });
    engine.setScene('main');
  };

  return (
    <GameCanvas
      ref={canvasRef}
      config={config}
      onEngineReady={handleEngineReady}
    />
  );
}
```

## API Reference

### GameEngine

The main game engine class that manages the game loop, scenes, and rendering.

#### Methods

- `initialize(canvas: HTMLCanvasElement)`: Initialize the engine with a canvas
- `addScene(scene: Scene)`: Add a new scene to the engine
- `setScene(name: string)`: Switch to a different scene
- `start()`: Start the game loop
- `pause()`: Pause the game
- `resume()`: Resume the game
- `stop()`: Stop the game

### GameState

Manages the current state of the game including objects and properties.

### EventEmitter

Base class for event handling throughout the engine.

### Logger

Centralized logging system with different log levels.

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch mode for development
npm run dev

# Type checking
npm run type-check
```

## License

AGPL-3.0
