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

3. **Enhanced Rules Engine**
   - JSON-based rules for ant behavior with advanced features
   - **Enhanced Variable References**: Access ant state, current cell, and surrounding cells
   - **OR/AND Condition Groups**: Complex conditional logic with nested support
   - **Optimized Execution Engine**: Dedicated AntLogicEngine class for performance
   - Actions: modify ant state/direction, change cell state, move forward
   - Configurable simulation speed

4. **UI Components**
   - Floating panel for ant rules editor with JSON textarea
   - **Visual Rule Builder**: GUI for constructing rules without writing JSON
   - Preset buttons for common ant behaviors
   - Speed control slider
   - Play/pause simulation

## Technical Architecture

### Core Classes
- `Grid`: Manages infinite grid state and rendering
- `Ant`: Represents individual ants with state and rules
- `AntLogicEngine`: Enhanced rule parsing and execution engine (NEW)
- `Simulation`: Handles game loop and rule execution
- `Camera`: Manages viewport, zoom, and pan
- `UI`: Handles user interface and controls

### File Structure
```
├── src/
│   ├── main.ts
│   ├── classes/
│   │   ├── Grid.ts
│   │   ├── Ant.ts
│   │   ├── AntLogicEngine.ts (NEW - Enhanced rule processor)
│   │   ├── Simulation.ts
│   │   ├── Camera.ts
│   │   └── UI.ts
│   ├── types/
│   │   └── index.ts (Enhanced with new condition types)
│   └── styles/
│       └── main.css
├── docs/
│   ├── ant-logic-language.md    # Enhanced language reference
│   ├── getting-started.md       # Installation and basic usage guide
│   ├── architecture.md          # Technical architecture overview
│   ├── examples.md              # Collection of ant behavior examples
│   └── development.md           # Development workflow and contributing guide
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.build.json
├── package.json
└── project-plan.md
```

### Enhanced Data Structures

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

#### Enhanced Rule Structure
```typescript
// Enhanced condition system supporting OR/AND groups
interface BaseCondition {
	antState?: { [key: string]: ConditionValue };
	cellState?: { [key: string]: ConditionValue };
	surroundingCells?: { [key: string]: { [key: string]: ConditionValue } };
}

interface ConditionGroup {
	or?: BaseCondition[]; // Any condition in array must match
	and?: BaseCondition[]; // All conditions in array must match
}

type EnhancedCondition = BaseCondition | ConditionGroup;

interface AntRule {
	condition: EnhancedCondition;
	action: {
		setAntState?: { [key: string]: ConditionValue };
		setCellState?: { [key: string]: ConditionValue };
		turn?: Turn;
		move?: boolean;
	};
}
```

#### Variable Context
```typescript
interface VariableContext {
	ant: AntState;
	cell: CellState;
	surrounding: { [key: string]: CellState };
}
```

### Enhanced Rule System Features

#### Variable References
1. **Ant Variables**: `ant.r`, `ant.g`, `ant.b`, `ant.direction`
2. **Current Cell Variables**: `cell.r`, `cell.g`, `cell.b`
3. **Surrounding Cell Variables**: 
   - Cardinal: `up.r`, `down.g`, `left.b`, `right.r`
   - Diagonal: `up-left.g`, `up-right.b`, `down-left.r`, `down-right.g`

#### Condition Groups
1. **OR Groups**: Execute if ANY condition matches
   ```json
   {
     "condition": {
       "or": [
         { "cellState": { "r": 255 } },
         { "cellState": { "g": 255 } }
       ]
     }
   }
   ```

2. **AND Groups**: Execute if ALL conditions match
   ```json
   {
     "condition": {
       "and": [
         { "antState": { "direction": "up" } },
         { "cellState": { "r": 240, "g": 240, "b": 240 } }
       ]
     }
   }
   ```

3. **Nested Groups**: Complex logic combinations
   ```json
   {
     "condition": {
       "and": [
         { "antState": { "direction": "up" } },
         {
           "or": [
             { "cellState": { "r": 255 } },
             { "surroundingCells": { "up": { "r": 255 } } }
           ]
         }
       ]
     }
   }
   ```

#### Performance Optimizations
- **Variable Context Caching**: Build context once per ant step
- **Short-Circuit Evaluation**: OR stops at first match, AND stops at first failure
- **Optimized Variable Resolution**: Direct property access with validation
- **Rule Validation**: Parse and validate rules with helpful error messages

### Grid State
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

### Phase 3: Enhanced Simulation Engine
- [x] Enhanced rule parsing and execution
- [x] Variable reference system (ant, cell, surrounding)
- [x] OR/AND condition groups
- [x] Optimized AntLogicEngine class
- [x] Simulation loop with enhanced rules
- [x] Speed controls

### Phase 4: Polish
- [x] UI improvements
- [x] Performance optimizations
- [x] Enhanced error handling
- [x] Updated documentation

## Current Status
- ✅ **COMPLETED**: Enhanced implementation finished
- ✅ **NEW**: Enhanced ant logic system with variable references and condition groups
- ✅ **NEW**: Optimized AntLogicEngine for better performance
- ✅ **NEW**: Comprehensive variable system (ant, cell, surrounding cells)
- ✅ **NEW**: OR/AND condition groups with nesting support
- All major features implemented and working
- Enhanced rule system provides powerful new capabilities
- Backward compatible with existing rule formats
- Ready for advanced testing and complex ant behaviors

### Usage Instructions
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Browser opens automatically to `http://localhost:3000`

### Development Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - TypeScript type checking

### Keyboard Shortcuts
- **Space**: Play/Pause simulation
- **Ctrl+S**: Single step simulation
- **Escape**: Close rules editor

### Mouse Controls
- **Left Click**: Place ant or select existing ant
- **Right Drag**: Pan the view
- **Mouse Wheel**: Zoom in/out

### Enhanced Rule Examples

#### Basic Enhanced Rule
```json
[
  {
    "condition": {
      "and": [
        { "cellState": { "r": 240, "g": 240, "b": 240 } },
        { "antState": { "direction": "up" } }
      ]
    },
    "action": {
      "setCellState": { "r": "ant.r", "g": "ant.g", "b": "ant.b" },
      "turn": "right",
      "move": true
    }
  }
]
```

#### Cell Color Mixing
```json
[
  {
    "condition": {
      "cellState": { "r": 240, "g": 240, "b": 240 }
    },
    "action": {
      "setCellState": { 
        "r": "ant.r", 
        "g": "up.g", 
        "b": "left.b" 
      },
      "move": true
    }
  }
]
```

#### Complex Pattern Detection
```json
[
  {
    "condition": {
      "or": [
        {
          "and": [
            { "cellState": { "r": "up.r" } },
            { "cellState": { "g": "down.g" } }
          ]
        },
        {
          "antState": { "r": { "value": "cell.r", "tolerance": 50 } }
        }
      ]
    },
    "action": {
      "setAntState": { "r": "cell.g", "g": "cell.b", "b": "cell.r" },
      "turn": "reverse",
      "move": true
    }
  }
]
```

## Major Updates

### Visual Rule Builder (Latest Addition)
- **Comprehensive GUI** for constructing ant rules without writing JSON
- **Modal interface** with professional design and responsive layout
- **Rule management**: Add/delete multiple rules with intuitive controls
- **Condition builder**: Support for simple, AND group, and OR group conditions
- **Action builder**: Checkboxes and form inputs for different action types
- **Smart population**: Automatically loads existing JSON values when opened
- **Full feature support**: Tolerance matching, mathematical expressions, surrounding cells
- **Seamless integration**: Generates valid JSON compatible with existing rule system
- **User-friendly workflow**: From visual form to JSON with one click

### Mathematical Expressions
- **Comprehensive parser** with proper operator precedence
- **Safety features**: Auto-clamping, error handling, division by zero protection
- **Examples**: `"ant.r + 10"`, `"(ant.r + cell.r) / 2"`, `"ant.g * 2 % 255"`

### Preset System
- **10 creative presets** with emojis and color-coded buttons
- **Feature demonstrations**: Each preset showcases different capabilities
- **Professional UI**: Grid layout with hover animations and gradients