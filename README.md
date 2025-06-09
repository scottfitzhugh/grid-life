# Grid Life - Ant Simulation

A sophisticated web-based ant simulation where you can program artificial ants using JSON rules to create complex emergent behaviors. Watch as your ants interact with an infinite grid, leaving trails of color and responding to their environment through your custom logic.

## Features

- **Infinite Grid**: Smooth panning and zooming across an unlimited canvas
- **Programmable Ants**: Define ant behavior using a powerful JSON-based rule system
- **Advanced Logic**: Support for variable references, tolerance-based matching, and complex conditions
- **Visual Feedback**: Real-time color-coded visualization of ant states and grid cells
- **Interactive Controls**: Click to place ants, select them to edit rules, and control simulation speed
- **Modern UI**: Clean, responsive interface with floating control panels

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/grid-life.git
   cd grid-life
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` (opens automatically)

### Basic Usage

1. **Navigate**: Use mouse wheel to zoom, right-click and drag to pan
2. **Place Ants**: Left-click anywhere on the grid to place a new ant
3. **Edit Rules**: Click on an ant to select it and edit its behavior rules
4. **Control Simulation**: Use the floating control panel to play/pause and adjust speed
5. **Program Behavior**: Write JSON rules to define how ants respond to their environment

## Ant Logic Language

Ants are programmed using a JSON-based rule system that allows you to define complex behaviors. Each ant follows a set of rules that determine its actions based on current conditions.

### 📖 [Complete Language Reference](docs/ant-logic-language.md)

The comprehensive documentation includes:
- All condition types (`antState`, `cellState`, `surroundingCells`)
- Variable references (`ant.r`, `ant.g`, `ant.b`, `ant.direction`)
- Tolerance-based matching for fuzzy logic
- Action types (`setAntState`, `setCellState`, `turn`, `move`)
- Complete examples and advanced patterns

### Quick Example

Classic Langton's Ant behavior:
```json
[
  {
    "condition": {
      "cellState": { "r": 240, "g": 240, "b": 240 }
    },
    "action": {
      "setCellState": { "r": 255, "g": 0, "b": 0 },
      "turn": "right",
      "move": true
    }
  },
  {
    "condition": {
      "cellState": { "r": 255, "g": 0, "b": 0 }
    },
    "action": {
      "setCellState": { "r": 240, "g": 240, "b": 240 },
      "turn": "left",
      "move": true
    }
  }
]
```

### Advanced Features

- **Variable References**: Use `"ant.r"` to reference the ant's red color component in both conditions and actions
- **Tolerance Matching**: `{"value": "ant.r", "tolerance": 50}` for fuzzy color matching
- **Relative Turns**: `"turn": "left"` for direction changes relative to current heading
- **Multi-Condition Rules**: Combine multiple condition types for complex behaviors
- **Dynamic Actions**: Paint cells with ant colors using `"setCellState": {"r": "ant.r"}`

## Controls

### Mouse Controls
- **Left Click**: Place a new ant
- **Right Click + Drag**: Pan the camera
- **Mouse Wheel**: Zoom in/out
- **Click on Ant**: Select ant to edit its rules

### Keyboard Shortcuts
- **Space**: Play/Pause simulation
- **R**: Reset simulation (clear all ants)
- **+/-**: Increase/decrease simulation speed
- **Arrow Keys**: Pan camera

## Architecture

The project is built with modern TypeScript and follows a modular architecture:

### Core Classes

- **`Grid`**: Manages the infinite sparse grid and cell states
- **`Camera`**: Handles viewport transformations, zooming, and panning
- **`Ant`**: Individual ant logic, rule processing, and rendering
- **`Simulation`**: Game loop, ant management, and timing control
- **`UI`**: User interface, control panels, and event handling

### File Structure

```
grid-life/
├── src/
│   ├── classes/          # Core simulation classes
│   ├── types/            # TypeScript type definitions
│   ├── styles/           # CSS stylesheets
│   └── main.ts           # Application entry point
├── docs/                 # Documentation
├── dist/                 # Production build output
├── index.html            # Main HTML file
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Development

### Available Scripts

The project uses Vite for fast development and TypeScript compilation:

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check without emitting files
npm run type-check
```

### Project Structure

- Type definitions in `src/types/`
- Core classes in `src/classes/`
- Utility functions in `src/utils/`
- Main application logic in `src/main.ts`

### Key Components

1. **Infinite Grid System**: Sparse storage with viewport culling for performance
2. **Camera System**: Smooth zooming and panning with coordinate transformations
3. **Rule Engine**: JSON-based programming language with variable references
4. **Rendering Pipeline**: Efficient canvas drawing with selective updates
5. **Event System**: Comprehensive input handling for mouse and keyboard
6. **Development Stack**: Vite for fast builds, TypeScript for type safety, ES modules for modern JavaScript

## Advanced Examples

### Color-Matching Ant
```json
[
  {
    "condition": {
      "cellState": { "r": "ant.r" }
    },
    "action": {
      "setAntState": { "g": 255 },
      "turn": "right",
      "move": true
    }
  }
]
```

### Gradient-Following Ant
```json
[
  {
    "condition": {
      "surroundingCells": {
        "up": { "r": { "value": "ant.r", "tolerance": 30 } }
      }
    },
    "action": {
      "setAntState": { "direction": "up" },
      "move": true
    }
  }
]
```

## Performance

- **Infinite Grid**: Efficient sparse storage handles unlimited world size
- **Viewport Culling**: Only renders visible cells and ants
- **Optimized Rendering**: Selective canvas updates for smooth performance
- **Rule Caching**: Compiled rule evaluation for fast execution
- **Fast Development**: Vite provides instant hot module replacement and fast builds

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Maintain consistent code style (tabs for indentation)
- Add comprehensive documentation
- Test new features thoroughly
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Langton's Ant and cellular automata
- Built with modern web technologies
- Designed for educational and creative exploration

---

**Explore the fascinating world of emergent behavior with Grid Life!** 🐜✨ 