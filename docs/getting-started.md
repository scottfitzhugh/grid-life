# Getting Started with Grid Life

Grid Life is a web-based ant simulation where you can program artificial ants using JSON rules to create complex emergent behaviors. This guide will help you get up and running quickly.

## Prerequisites

- **Node.js 16+** and npm
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/grid-life.git
   cd grid-life
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000` (opens automatically)

## First Steps

### Navigating the Grid

- **Zoom**: Use mouse wheel to zoom in/out
- **Pan**: Right-click and drag to move around the infinite grid
- **Grid Cells**: Each cell can have an RGB color state (0-255 for each component)

### Placing Your First Ant

1. **Left-click** anywhere on the grid to place a new ant
2. Ants appear as colored circles (red by default)
3. Each ant has a direction indicator (small white dot)

### Controlling the Simulation

- **Play/Pause**: Use the floating control panel or press **Space**
- **Speed Control**: Adjust simulation speed with the slider
- **Reset**: Press **R** to clear all ants and start over

### Programming Ant Behavior

1. **Select an ant**: Click on any ant to select it (yellow ring appears)
2. **Edit rules**: The rules editor panel will appear on the right
3. **Test behavior**: Modify the JSON rules and watch your ant's behavior change

## Basic Ant Behavior Example

Here's the classic Langton's Ant behavior to get you started:

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

This creates an ant that:
- Turns right on white cells (240,240,240) and paints them red
- Turns left on red cells (255,0,0) and paints them white
- Always moves forward after turning

## Keyboard Shortcuts

- **Space**: Play/Pause simulation
- **R**: Reset simulation (clear all ants)
- **+/-**: Increase/decrease simulation speed
- **Arrow Keys**: Pan camera

## Next Steps

Once you're comfortable with the basics:

1. **📖 [Learn the Ant Logic Language](ant-logic-language.md)** - Master the JSON rule system
2. **🏗️ [Explore the Architecture](architecture.md)** - Understand how the system works
3. **💡 [Try Advanced Examples](examples.md)** - See complex behaviors in action
4. **🛠️ [Development Guide](development.md)** - Start contributing to the project

## Need Help?

- Check the browser console for errors
- Ensure your JSON rules are valid
- Start with simple rules and build complexity gradually
- See the [Examples](examples.md) for inspiration 