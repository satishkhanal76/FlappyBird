# Game Systems

This document describes the main gameplay systems and how they interact.

## Game State

The game uses three high-level states:

```text
START
RUNNING
OVER
```

`GameGUI` controls the transitions caused by user input:

```text
START
  │
  │ flap
  ▼
RUNNING
  │
  │ collision / boundary
  ▼
OVER
  │
  │ flap
  ▼
START
```

The state is stored by `Game`, while `GameGUI` uses it to determine how input and rendering should behave.

## Game Loop

`GameLoop` is a reusable wrapper around `requestAnimationFrame`.

It calculates the elapsed time between frames and passes that value to the object it controls.

```text
requestAnimationFrame
        │
        ▼
   GameLoop
        │
        ├── deltaTime
        ├── frame count
        ├── FPS
        └── average FPS
        │
        ▼
 object.update(deltaTime)
```

Because the loop only requires an object with an `update()` method, it is not tied specifically to the game itself.

## Bird Physics

The bird uses velocity-based vertical movement.

When falling:

```text
velocity += gravity × deltaTime
```

When flapping:

```text
velocity -= flapForce × deltaTime
```

The velocity is bounded to prevent it from becoming excessively large in either direction.

The bird's position is then updated using the resulting velocity.

The implementation also models flapping as a temporary state. A flap lasts for a calculated number of frames based on the measured average FPS and configured flap duration.

## Pipe Movement

Pipes move horizontally while the game is running.

Their movement is based on:

```text
x -= speed × deltaTime
```

The speed is supplied by `Game`, allowing game difficulty to influence pipe movement without requiring `Pipe` to know how difficulty is calculated.

## Pipe Generation

The game starts with two `PipePair` objects.

Each pair contains:

```text
┌──────────────┐
│   Top Pipe   │
├──────────────┤
│              │
│     Gap      │
│              │
├──────────────┤
│ Bottom Pipe  │
└──────────────┘
```

The gap position is randomized vertically.

When a pair moves completely outside the left side of the screen, it is recycled and moved to the right side with a newly generated gap.

This avoids continuously allocating new pipe objects during gameplay.

## Collision Detection

Collision detection is handled by `PipePair`.

The bird is represented by a circular collision area using its center position and radius.

Each pipe is represented by its rectangular bounds.

A collision occurs when the bird's bounding extents overlap the pipe's rectangle.

The collision calculation is therefore independent from the pipe's image and from the canvas rendering system.

The project also exposes a runtime switch for collision detection, which is useful when testing other gameplay systems.

## Scoring

A pipe pair awards a point when the bird passes its scoring position.

`PipePair` keeps track of whether it has already awarded its point:

```text
pointsReceived
```

This prevents the same pipe pair from awarding multiple points.

Once the bird passes the relevant position, `Game` increments the score.

## Dynamic Difficulty

Pipe speed increases as the player's score increases.

The speed is calculated by `Game` using a logarithmic relationship with the current points.

This means the difficulty increases as the player progresses while avoiding a simple linear increase.

The resulting speed is passed to the pipe pairs, which then apply it to their individual pipes.

This is another example of keeping responsibilities separated:

```text
Game
 │
 │ calculates difficulty
 ▼
PipePair
 │
 │ applies speed
 ▼
Pipe
 │
 │ moves
 ▼
Position
```

## Background Scrolling

The background consists of two `Background` objects placed next to each other.

As the backgrounds move left:

```text
┌──────────────┐┌──────────────┐
│ Background 1 ││ Background 2 │
└──────────────┘└──────────────┘
       ◄────────────
```

When one completely leaves the screen, it is repositioned immediately after the other.

This creates continuous scrolling without requiring a large background image or an ever-growing list of objects.

## Rendering

The rendering pipeline is handled by `GameGUI`.

Each GUI object reads the current state of its corresponding logic object.

```text
Game state
   │
   ├── Bird ─────────► BirdGUI
   │
   ├── Pipe ─────────► PipeGUI
   │
   └── Background ───► Background
```

The renderer does not need to reproduce gameplay calculations. It simply translates the current state into canvas operations.

## Runtime Debugging

The debug menu provides a development-time interface for observing and changing the game.

Examples include:

- Bird radius
- Flap duration
- Flap force
- Gravity
- Pipe width
- Collision detection
- Game state
- Bird state
- FPS
- Score

This makes gameplay tuning significantly faster because parameters can be experimented with without repeatedly editing and reloading the source code.

## Extending the Systems

The existing structure provides several natural extension points.

### New Bird Mechanics

Add the behavior to `Bird` and expose only the state needed by its GUI representation.

### New Obstacles

Create a logic object responsible for movement and gameplay interaction, then create a separate GUI object responsible for rendering it.

### New Visual Themes

Replace or extend the GUI classes and assets without changing the underlying game rules.

### New Difficulty Systems

Modify the difficulty calculation in `Game` while keeping the actual movement implementation inside `Pipe`.

### New Debug Controls

Register additional values or actions with `DebugManager`.

The important principle is that new functionality should preferably be added to the system responsible for that behavior rather than expanding `GameGUI` or `Game` into a single monolithic class.