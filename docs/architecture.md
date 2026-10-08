# Architecture

The architecture of Flappy Bird is centered around one main idea:

> **Game state and game presentation should be separate systems.**

The project therefore divides the implementation into a logic layer, a client/rendering layer, a reusable game-loop abstraction, and a separate debugging system.

This makes the game easier to modify without coupling every gameplay change to its visual implementation.

## 1. High-Level Structure

```text
                       ┌─────────────────┐
                       │     main.js     │
                       │ Entry Point     │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │    GameGUI      │
                       │ Input + Render  │
                       └───────┬─────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │   Game Logic    │         │   GUI Objects   │
        │                 │         │                 │
        │ Game            │◄────────│ BirdGUI         │
        │ Bird            │         │ PipeGUI         │
        │ Pipe            │         │ Background      │
        │ PipePair        │         │ BackgroundHandler│
        └────────┬────────┘         └─────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │    GameLoop     │
        │ update(deltaTime)│
        └─────────────────┘
```

The important boundary is between the objects in `Logic/` and the objects in `Client/`.

## 2. Logic Layer

The logic layer contains objects representing the actual game.

### `Game`

`Game` is the main coordinator.

It owns:

- the current game state
- the bird
- the pipe pairs
- the score
- pipe speed
- collision detection configuration
- the game loop

The game has three primary states:

```text
START
RUNNING
OVER
```

Each update advances the bird and pipes, checks game-over conditions, handles scoring, and recycles pipes.

The game itself does not draw anything to the canvas.

### `Bird`

`Bird` owns the bird's physical and behavioral state.

Its state machine is:

```text
READY
  │
  ▼
FLAPPING ──────► FALLING
  │
  └─────────────────────► DEAD
```

Physics such as gravity, flap force, velocity, radius, and flap duration are encapsulated by the class.

This is particularly useful for extensibility because the rest of the game interacts with the bird through its public interface instead of directly manipulating its internal fields.

### `Pipe`

`Pipe` represents one physical pipe.

It stores its position, dimensions, direction (top or bottom), and movement speed.

Its `update()` method only concerns movement. Collision logic and pair-level behavior are handled by `PipePair`.

### `PipePair`

A playable obstacle is actually represented by a `PipePair`.

It owns:

- one top pipe
- one bottom pipe
- the vertical gap
- position
- width
- score state
- random gap generation

It also provides higher-level operations such as collision detection, scoring, and recycling.

This is a useful example of composing smaller objects into a higher-level gameplay object rather than putting every pipe-related responsibility inside `Game`.

## 3. Rendering Layer

The rendering layer mirrors the important logic objects.

```text
Bird       → BirdGUI
Pipe       → PipeGUI
Background → Background
```

### `BirdGUI`

`BirdGUI` receives a `Bird` object and renders its current state.

The GUI calculates visual rotation from the bird's velocity and uses the bird's radius and position to determine the sprite's size and location.

It does not implement bird physics.

### `PipeGUI`

`PipeGUI` receives a `Pipe` and an image URL.

The same GUI class can therefore render either a top or bottom pipe depending on which asset it receives.

That keeps the visual representation reusable rather than creating separate rendering implementations for each pipe orientation.

### `Background` and `BackgroundHandler`

The scrolling background is separated into two responsibilities.

`Background` represents one rendered background segment.

`BackgroundHandler` manages multiple segments and repositions them when they leave the screen, creating an effectively continuous scrolling background.

## 4. Two Game Loops

An interesting architectural choice is that the project uses `GameLoop` for both the game logic and the GUI.

The generic `GameLoop` accepts an object containing an `update()` method:

```text
new GameLoop(object)
```

It then repeatedly calls:

```text
object.update(deltaTime)
```

The `Game` therefore has its own loop, while `GameGUI` has a separate loop for presentation.

This keeps the timing abstraction reusable instead of embedding `requestAnimationFrame` directly inside every system. The loop also tracks frame count, delta time, current FPS, and average FPS.

## 5. Input Flow

Input is handled by `GameGUI`, while the actual gameplay action is delegated to the logic layer.

```text
Keyboard / Touch
       │
       ▼
   GameGUI
       │
       ▼
   handleFlap()
       │
       ├── START  → RUNNING
       ├── RUNNING → Bird.flap()
       └── OVER   → restart()
```

This keeps browser-specific input handling out of the `Bird` and `Game` classes.

The entry point also detects touch devices and attaches the appropriate event listener.

## 6. Debug System

Debugging is implemented as its own system rather than being hard-coded throughout the game.

`DebugManager` maintains debug items in a `Map`.

A debug item can expose:

- a displayed value
- a clickable action
- a changeable input
- a callback

This creates a small generic debugging framework that can be reused for additional game parameters without changing the core debug UI.

`GameGUI` uses this system to expose gameplay parameters such as bird radius, flap time, flap force, gravity, pipe width, and collision detection. Some of these values can be changed while the game is running.

## 7. Extensibility

Extensibility is one of the strongest architectural characteristics of the project.

The design makes several common modifications relatively localized.

### Changing bird behavior

Bird physics live in `Bird`.

A new movement mechanic can therefore be implemented primarily inside the bird's logic rather than inside rendering code.

### Changing visuals

Visual implementations live in the GUI classes.

A different bird sprite, pipe texture, or rendering behavior can be introduced without changing collision or movement logic.

### Adding a new obstacle

A new obstacle can follow the same general pattern:

```text
Obstacle
   │
   └── ObstacleGUI
```

The logic object owns position, dimensions, movement, and gameplay behavior, while the GUI object handles its representation.

### Adding a new background

The `Background` abstraction already accepts an image URL, while `BackgroundHandler` manages multiple background segments.

This makes changing the background or extending the scrolling-background system relatively localized.

### Adding new debug controls

New runtime parameters can be exposed through `DebugManager.addDebugItem()` without creating a new debug UI implementation.

## 8. Design Philosophy

The project does not attempt to implement a large game-engine framework. Instead, it extracts the abstractions that are actually useful for this game.

The result is a relatively small codebase where:

- gameplay objects own gameplay state
- GUI objects own presentation
- `GameLoop` owns frame scheduling
- `DebugManager` owns runtime inspection
- `Game` coordinates the game
- smaller objects encapsulate their own behavior

That separation is what makes the project easier to experiment with and expand.