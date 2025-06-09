# Architecture Overview

Grid Life is built with modern TypeScript and follows a modular architecture designed for performance, maintainability, and extensibility.

## Technology Stack

- **TypeScript**: Type-safe JavaScript with modern features
- **Vite**: Fast build tool and development server with HMR
- **Canvas API**: High-performance 2D graphics rendering
- **ES Modules**: Modern JavaScript module system
- **CSS**: Styling with modern features

## Core System Design

### Modular Architecture

The system is organized into focused, reusable classes that each handle specific responsibilities:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Simulation    │────│      Grid       │────│     Camera      │
│   (Game Loop)   │    │ (State Manager) │    │  (Viewport)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └─────────┬─────────────┼───────────────────────┘
                   │             │
         ┌─────────────────┐    ┌─────────────────┐
         │      Ant        │────│ AntLogicEngine  │
         │  (Individual)   │    │ (Rule Processor)│
         └─────────────────┘    └─────────────────┘
                   │
         ┌─────────────────┐
         │       UI        │
         │   (Interface)   │
         └─────────────────┘
```

## Core Classes

### Grid Class (`src/classes/Grid.ts`)

**Responsibility**: Manages the infinite sparse grid and cell states

**Key Features**:
- **Sparse Storage**: Only stores non-default cells in memory
- **Infinite Canvas**: Supports unlimited grid dimensions
- **Efficient Rendering**: Viewport culling for performance
- **Coordinate Conversion**: Grid ↔ world coordinate transformations

**Key Methods**:
```typescript
- getCellState(x, y): Get cell RGB state
- setCellState(x, y, state): Set cell RGB state
- gridToWorld(x, y): Convert grid coordinates to world position
- worldToGrid(x, y): Convert world position to grid coordinates
- render(): Draw visible grid cells
```

### Camera Class (`src/classes/Camera.ts`)

**Responsibility**: Handles viewport transformations, zooming, and panning

**Key Features**:
- **Smooth Transformations**: Fluid zoom and pan operations
- **Coordinate System**: Screen ↔ world coordinate conversion
- **Viewport Management**: Track what's visible for efficient rendering
- **Transform Stack**: Apply/restore canvas transformations

**Key Methods**:
```typescript
- zoom(factor, centerX, centerY): Zoom around a point
- pan(deltaX, deltaY): Move the viewport  
- screenToWorld(x, y): Convert screen to world coordinates
- applyTransform(ctx): Apply camera transform to canvas context
```

### Ant Class (`src/classes/Ant.ts`)

**Responsibility**: Individual ant logic, state management, and rendering

**Key Features**:
- **State Management**: Position, direction, RGB color, rules
- **Rule Execution**: Process JSON rules each simulation step
- **Visual Representation**: Render ant with direction indicator
- **Selection System**: Handle user interaction and selection

**Key Methods**:
```typescript
- step(grid): Execute ant behavior for one simulation step
- render(ctx, grid, camera): Draw the ant on canvas
- getRules(): Parse and return JSON rules
- containsPoint(x, y): Check if point intersects ant (for selection)
```

### AntLogicEngine Class (`src/classes/AntLogicEngine.ts`)

**Responsibility**: Enhanced rule parsing and execution engine

**Key Features**:
- **Variable Resolution**: Support for `ant.r`, `cell.g`, `up.b` references
- **Condition Groups**: OR/AND logic with nested support
- **Performance Optimization**: Cached parsing and short-circuit evaluation
- **Error Handling**: Comprehensive validation and error reporting

**Key Methods**:
```typescript
- parseRules(rulesJson): Parse and validate JSON rules
- executeRules(antState, rules, grid): Execute rules for an ant
- buildVariableContext(ant, grid): Create variable lookup context
- evaluateCondition(condition, context): Check if condition matches
```

### Simulation Class (`src/classes/Simulation.ts`)

**Responsibility**: Game loop, ant management, and timing control

**Key Features**:
- **Game Loop**: RequestAnimationFrame-based simulation loop
- **Ant Management**: Add, remove, and track all ants
- **Speed Control**: Configurable simulation speed
- **State Management**: Play/pause, reset functionality

**Key Methods**:
```typescript
- start(): Begin the simulation loop
- stop(): Pause the simulation
- step(): Execute one simulation step for all ants
- addAnt(x, y): Create new ant at position
- reset(): Clear all ants and reset grid
```

### UI Class (`src/classes/UI.ts`)

**Responsibility**: User interface, control panels, and event handling

**Key Features**:
- **Event Handling**: Mouse and keyboard input processing
- **Control Panels**: Floating UI elements for controls
- **Ant Selection**: Visual feedback and rule editing
- **Responsive Design**: Adaptive layout for different screen sizes

**Key Methods**:
```typescript
- setupEventHandlers(): Initialize mouse/keyboard events
- showRulesEditor(ant): Display rule editing interface
- updateControls(): Refresh UI state and controls
- handleMouseClick(x, y): Process mouse interactions
```

## Data Flow

### Simulation Step Flow

```
1. Simulation.step()
   ├── For each ant:
   │   ├── Get current cell state from Grid
   │   ├── AntLogicEngine.executeRules()
   │   │   ├── Build variable context (ant, cell, surrounding)
   │   │   ├── Evaluate conditions (OR/AND groups)
   │   │   ├── Execute first matching rule's actions
   │   │   └── Update ant state and grid cells
   │   └── Update ant position if moved
   └── Trigger UI refresh
```

### Rendering Pipeline

```
1. Main render loop (60 FPS)
   ├── Camera.applyTransform()
   ├── Grid.render() - Draw visible cells
   ├── For each ant:
   │   └── Ant.render() - Draw ant with direction
   └── UI.render() - Draw interface elements
```

### Event Handling Flow

```
1. User Input (mouse/keyboard)
   ├── UI.handleEvent()
   ├── Camera coordinate conversion
   ├── Grid coordinate conversion  
   ├── Check ant intersections
   └── Execute appropriate action:
       ├── Place new ant
       ├── Select existing ant
       ├── Pan/zoom camera
       └── Control simulation
```

## Performance Optimizations

### Memory Efficiency

- **Sparse Grid**: Only stores non-default cells
- **Object Pooling**: Reuse objects where possible
- **Efficient Data Structures**: Maps for O(1) lookups

### Rendering Optimization

- **Viewport Culling**: Only render visible elements
- **Canvas Optimization**: Minimize state changes
- **Transform Caching**: Reuse coordinate calculations

### Rule Engine Performance

- **Short-Circuit Evaluation**: Stop at first match/failure
- **Variable Context Caching**: Build once per ant step
- **Rule Validation**: Parse rules once, execute many times

## File Structure

```
src/
├── main.ts                 # Application entry point
├── classes/               # Core system classes
│   ├── Grid.ts           # Infinite grid management
│   ├── Camera.ts         # Viewport transformations  
│   ├── Ant.ts            # Individual ant logic
│   ├── AntLogicEngine.ts # Enhanced rule processor
│   ├── Simulation.ts     # Game loop and timing
│   └── UI.ts             # User interface
├── types/                # TypeScript definitions
│   └── index.ts          # All type definitions
└── styles/               # CSS stylesheets
    └── main.css          # Application styles
```

## Extension Points

The architecture is designed to be extensible:

### Adding New Condition Types
- Extend `BaseCondition` interface in `types/index.ts`
- Add evaluation logic in `AntLogicEngine.evaluateCondition()`

### Adding New Action Types  
- Extend `AntAction` interface in `types/index.ts`
- Add execution logic in `AntLogicEngine.executeAction()`

### Adding New UI Elements
- Extend `UI` class with new panels or controls
- Add event handlers and state management

### Performance Profiling
- Use browser DevTools Performance tab
- Monitor Canvas rendering performance
- Profile rule execution with console.time()

## Testing Strategy

### Development Testing
- Browser DevTools for real-time debugging
- TypeScript for compile-time error detection
- Console logging for rule execution tracing

### Performance Testing
- Large numbers of ants (1000+)
- Complex rule sets with deep nesting
- Extended simulation runs (hours)

### Browser Compatibility
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Different screen sizes and DPI settings 