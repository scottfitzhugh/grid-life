# Grid Life - Ant Simulation

A TypeScript webapp featuring an infinite grid canvas where users can place and control programmable "ants" that follow custom JSON-based rules. Watch as simple rules create complex emergent behaviors!

![Grid Life Demo](https://img.shields.io/badge/demo-live-green)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

### Core Functionality
- **Infinite Grid Canvas** - Smooth zoom and pan across an unlimited grid
- **Interactive Ant Placement** - Click to place programmable ants
- **Visual Rule Editor** - JSON-based rules system with live editing
- **Real-time Simulation** - Configurable speed simulation engine
- **Responsive Design** - Works on desktop and mobile devices

### Ant Behavior System
- **State-based Logic** - Ants have direction and RGB color states
- **Environmental Awareness** - Ants can read cell colors and surrounding environment
- **Rule-based Actions** - Modify ant state, change cell colors, or move based on conditions
- **Emergent Complexity** - Simple rules create complex patterns and behaviors

## 🚀 Quick Start

### Prerequisites
- Node.js (for TypeScript compilation)
- Python 3 (for local server)
- Modern web browser with ES2020 support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/grid-life.git
   cd grid-life
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   python3 serve.py
   ```

5. **Open in browser**
   Navigate to `http://localhost:8000`

## 🎮 Controls

### Mouse Controls
- **Left Click** - Place new ant or select existing ant
- **Right Drag** - Pan the view around the grid
- **Mouse Wheel** - Zoom in and out

### Keyboard Shortcuts
- **Space** - Play/Pause simulation
- **Ctrl+S** - Execute single simulation step
- **Escape** - Close rules editor panel

### UI Controls
- **Speed Slider** - Adjust simulation speed (50ms - 2000ms)
- **Play/Pause Button** - Toggle simulation state
- **Step Button** - Execute single simulation step
- **Clear Button** - Remove all ants from grid

## 🧬 Ant Rules System

Ants follow JSON-based rules that define their behavior. Each rule has a `condition` and an `action`.

### Basic Rule Structure
```json
[
  {
    "condition": {
      "antState": { "direction": "up" },
      "cellState": { "r": 240, "g": 240, "b": 240 },
      "surroundingCells": {
        "up": { "r": 100, "g": 100, "b": 100 }
      }
    },
    "action": {
      "setAntState": { "direction": "right", "r": 255 },
      "setCellState": { "r": 200, "g": 50, "b": 50 },
      "move": true
    }
  }
]
```

### Rule Components

#### Conditions
- **`antState`** - Check ant's current direction and RGB values
- **`cellState`** - Check the color of the cell the ant is on
- **`surroundingCells`** - Check colors of neighboring cells (`up`, `down`, `left`, `right`, `up-left`, `up-right`, `down-left`, `down-right`)

#### Actions
- **`setAntState`** - Modify ant's direction or RGB color values
- **`setCellState`** - Change the color of the current cell
- **`move`** - Move ant forward in its current direction

### Example Rules

#### Simple Walker
```json
[
  {
    "condition": {},
    "action": { "move": true }
  }
]
```

#### Color Trail
```json
[
  {
    "condition": {
      "cellState": { "r": 240, "g": 240, "b": 240 }
    },
    "action": {
      "setCellState": { "r": 255, "g": 0, "b": 0 },
      "move": true
    }
  }
]
```

#### Turning Behavior
```json
[
  {
    "condition": {
      "surroundingCells": {
        "up": { "r": 255, "g": 0, "b": 0 }
      }
    },
    "action": {
      "setAntState": { "direction": "right" },
      "move": true
    }
  }
]
```

## 🏗️ Architecture

The project follows a modular TypeScript architecture:

```
src/
├── classes/
│   ├── Grid.ts        # Infinite grid management
│   ├── Camera.ts      # Viewport and transformations
│   ├── Ant.ts         # Individual ant behavior
│   ├── Simulation.ts  # Game loop and ant coordination
│   └── UI.ts          # User interface controls
├── types/
│   └── index.ts       # TypeScript type definitions
├── styles/
│   └── main.css       # Application styling
├── main.ts            # Application entry point
└── index.html         # Main HTML file
```

### Key Classes

- **Grid** - Manages infinite grid state and rendering with efficient viewport culling
- **Camera** - Handles zoom, pan, and coordinate transformations
- **Ant** - Represents individual ants with state and rule execution
- **Simulation** - Coordinates the game loop and ant behavior
- **UI** - Provides controls and rules editor interface

## 🎨 Customization

### Creating Custom Behaviors

1. **Langton's Ant**
   ```json
   [
     {
       "condition": { "cellState": { "r": 240, "g": 240, "b": 240 } },
       "action": {
         "setCellState": { "r": 0, "g": 0, "b": 0 },
         "setAntState": { "direction": "right" },
         "move": true
       }
     },
     {
       "condition": { "cellState": { "r": 0, "g": 0, "b": 0 } },
       "action": {
         "setCellState": { "r": 240, "g": 240, "b": 240 },
         "setAntState": { "direction": "left" },
         "move": true
       }
     }
   ]
   ```

2. **Rainbow Trail**
   ```json
   [
     {
       "condition": {},
       "action": {
         "setCellState": { "r": 255, "g": 100, "b": 200 },
         "setAntState": { 
           "r": 200, 
           "g": 255, 
           "b": 100 
         },
         "move": true
       }
     }
   ]
   ```

## 🔧 Development

### Project Scripts
```bash
npm run build    # Compile TypeScript
npm run dev      # Watch mode compilation
npm run serve    # Start HTTP server
```

### File Structure
- Source files are in `src/`
- Compiled JavaScript goes to `dist/`
- Server serves from `src/` directory

### Adding Features
1. Modify TypeScript source files
2. Run `npm run build` to compile
3. Copy files to `src/` with `cp -r dist/* src/`
4. Refresh browser to see changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use tabs for indentation
- Follow TypeScript best practices
- Document all public methods
- Write descriptive variable names

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by cellular automata and artificial life simulations
- Built with modern web technologies for maximum compatibility
- Designed for educational exploration of emergent behavior

## 📊 Performance

- Efficient viewport culling for infinite grid
- Optimized rendering for smooth 60fps animation
- Scales to hundreds of ants with complex rule sets
- Memory-efficient sparse grid storage

---

**Explore the fascinating world of emergent behavior with Grid Life!** 🐜✨ 