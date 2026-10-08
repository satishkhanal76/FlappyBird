# Flappy Bird

A JavaScript recreation of Flappy Bird, built as an exercise in game programming, object-oriented design, and extensible game architecture.

The project intentionally separates **game logic from rendering**, making the underlying game systems easier to modify, debug, and extend without having to rewrite the entire game.

## Play

[Play the game on GitHub Pages](https://satishkhanal76.github.io/FlappyBird/)

### Controls

- **Space** — flap / start / restart
- **Touch** — flap / start / restart

The game also supports fullscreen behavior on touch devices.

## Architecture

The project is split into several layers:

```text
js/
├── classes/
│   └── GameLoop.js
├── Logic/
│   ├── Bird.js
│   ├── Game.js
│   ├── Pipe.js
│   └── PipePair.js
├── Client/
│   ├── Background.js
│   ├── BackgroundHandler.js
│   ├── BirdGUI.js
│   ├── GameGUI.js
│   └── PipeGUI.js
├── debug/
│   └── DebugManager.js
└── main.js
```

### Game Logic

The `Logic` classes contain the actual rules and state of the game.

- `Game` manages the overall game state, score, bird, pipes, collision detection, and difficulty.
- `Bird` handles movement, gravity, flapping, and its own state machine.
- `Pipe` represents an individual pipe.
- `PipePair` manages the top/bottom pipe combination, gap generation, scoring, recycling, and collision detection.

The logic layer does not need to know how the objects are visually represented.

### Rendering

The `Client` classes translate the game state into visuals.

For example:

- `BirdGUI` renders a `Bird`
- `PipeGUI` renders a `Pipe`
- `Background` renders an individual background segment
- `BackgroundHandler` manages the scrolling background
- `GameGUI` coordinates rendering and user interaction

This allows the game logic to remain independent from the visual representation.

## Designed for Extension

A major goal of the project is making new behavior easier to add.

For example, the bird's physical properties are encapsulated inside `Bird`, while the GUI only reads those properties. Likewise, pipe behavior is handled by `Pipe` and `PipePair`, while `PipeGUI` is responsible only for displaying them.

This means gameplay behavior can be changed without rewriting rendering code, and visual changes can be made without changing the underlying game rules.

The same idea is used for the game loop: `GameLoop` accepts any object with an `update()` method, allowing the same timing mechanism to drive different systems.

## Debugging

The game includes an interactive debug menu built around `DebugManager`.

It can expose runtime values such as:

- game state
- bird state
- FPS
- score
- bird radius
- flap time
- flap force
- gravity
- pipe width
- collision detection

Several values can be changed while the game is running, making it possible to experiment with gameplay parameters without modifying source code.

## Running Locally

Clone the repository, start a local web server, and open `index.html`.

A web server is recommended because the project uses JavaScript modules and browser APIs.

## Documentation

- [Architecture](docs/architecture.md)
- [Game Systems](docs/game-systems.md)

## Technologies

- JavaScript
- HTML5 Canvas
- CSS
- Browser APIs
- ES Modules
- `requestAnimationFrame`
- Local Storage