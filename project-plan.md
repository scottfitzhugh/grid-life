# Grid Life - Ant Simulation Webapp

## Project Overview
A TypeScript webapp featuring an infinite grid canvas where users can place and control "ants" that follow programmable rules.

## Core Features
1. **Infinite Grid Canvas**
   - Full window canvas element
   - Zoom in/out with mouse scroll
   - Pan with right mouse button drag
   - Grid cells with RGB color states (0-255 for each component)

2. **Ant System**
   - Place ants with left mouse click
   - Ants appear as red dots (3/4 grid cell diameter)
   - Ant state: direction (up/down/left/right) + RGB color (3 numbers 0-255)
   - Click ant to select and show rules editor

3. **Rules Engine**
   - JSON-based rules for ant behavior
   - Ants can read their state and surrounding cell states
   - Actions: modify ant state/direction, change cell state, move forward
   - Configurable simulation speed

4. **UI Components**
   - Floating panel for ant rules editor
   - Speed control slider
   - Play/pause simulation

## Technical Architecture

### Core Classes
- `Grid`: Manages infinite grid state and rendering
- `Ant`: Represents individual ants with state and rules
- `Simulation`: Handles game loop and rule execution
- `Camera`: Manages viewport, zoom, and pan
- `UI`: Handles user interface and controls

### File Structure
```
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── classes/
│   │   ├── Grid.ts
│   │   ├── Ant.ts
│   │   ├── Simulation.ts
│   │   ├── Camera.ts
│   │   └── UI.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── main.css
├── package.json
├── tsconfig.json
└── project-plan.md
```

### Data Structures

#### Ant State
```typescript
interface AntState {
	id: string;
	x: number;
	y: number;
	direction: 'up' | 'down' | 'left' | 'right';
	r: number; // 0-255
	g: number; // 0-255
	b: number; // 0-255
	rules: string; // JSON rules
}
```

#### Cell State
```typescript
interface CellState {
	r: number; // 0-255
	g: number; // 0-255
	b: number; // 0-255
}
```

#### Grid State
```typescript
interface GridState {
	cells: Map<string, CellState>; // key: "x,y"
	ants: Map<string, AntState>;
}
```

## Implementation Plan

### Phase 1: Core Infrastructure
- [x] Project setup with TypeScript
- [x] Basic canvas rendering
- [x] Grid display with zoom/pan
- [x] Mouse interaction handlers

### Phase 2: Ant System
- [x] Ant placement and rendering
- [x] Ant selection system
- [x] Rules editor UI

### Phase 3: Simulation Engine
- [x] Rule parsing and execution
- [x] Simulation loop
- [x] Speed controls

### Phase 4: Polish
- [x] UI improvements
- [x] Performance optimizations
- [x] Error handling

## Current Status
- ✅ **COMPLETED**: Core implementation finished
- All major features implemented and working
- Ready for testing and usage

### Usage Instructions
1. Compile TypeScript: `npm run build`
2. Start server: `python3 serve.py`
3. Open browser to `http://localhost:8000`

### Keyboard Shortcuts
- **Space**: Play/Pause simulation
- **Ctrl+S**: Single step simulation
- **Escape**: Close rules editor

### Mouse Controls
- **Left Click**: Place ant or select existing ant
- **Right Drag**: Pan the view
- **Mouse Wheel**: Zoom in/out 