# Grid Life - Ant Simulation

A sophisticated web-based ant simulation where you can program artificial ants using JSON rules to create complex emergent behaviors. Watch as your ants interact with an infinite grid, leaving trails of color and responding to their environment through your custom logic.

![Grid Life Demo](https://via.placeholder.com/800x400/2d3748/ffffff?text=Grid+Life+Demo)

## ✨ Features

- **🌐 Infinite Grid**: Smooth panning and zooming across an unlimited canvas
- **🤖 Programmable Ants**: Define ant behavior using a powerful JSON-based rule system
- **🧠 Advanced Logic**: Support for variable references, tolerance-based matching, and OR/AND conditions
- **🎨 Visual Feedback**: Real-time color-coded visualization of ant states and grid cells
- **🎮 Interactive Controls**: Click to place ants, select them to edit rules, and control simulation speed
- **💻 Modern UI**: Clean, responsive interface with floating control panels

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/grid-life.git
cd grid-life
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` and start placing ants with left-clicks!

## 📖 Documentation

- **🏁 [Getting Started Guide](docs/getting-started.md)** - Installation, basic usage, and first steps
- **📚 [Ant Logic Language](docs/ant-logic-language.md)** - Complete reference for programming ant behavior
- **🏗️ [Architecture Overview](docs/architecture.md)** - Technical structure and core classes
- **💡 [Behavior Examples](docs/examples.md)** - Collection of ready-to-use ant behaviors
- **🛠️ [Development Guide](DEVELOPMENT.md)** - Contributing and building the project

## 🐜 Simple Example

Classic Langton's Ant behavior:

```json
[
  {
    "condition": { "cellState": { "r": 240, "g": 240, "b": 240 } },
    "action": { "setCellState": { "r": 255, "g": 0, "b": 0 }, "turn": "right", "move": true }
  },
  {
    "condition": { "cellState": { "r": 255, "g": 0, "b": 0 } },
    "action": { "setCellState": { "r": 240, "g": 240, "b": 240 }, "turn": "left", "move": true }
  }
]
```

This creates an ant that turns right on white cells and left on red cells, eventually forming complex highway patterns.

## 🎮 Controls

| Action | Control |
|--------|---------|
| Place ant | Left click |
| Select ant | Click on ant |
| Pan camera | Right drag |
| Zoom | Mouse wheel |
| Play/Pause | Space |
| Reset | R |

## 🔧 Technology

- **TypeScript** for type safety
- **Vite** for fast development
- **Canvas API** for high-performance rendering
- **Modern ES modules** for clean architecture

## 🤝 Contributing

We welcome contributions! See our [Development Guide](DEVELOPMENT.md) for details on:

- Setting up the development environment
- Understanding the codebase architecture
- Running tests and builds
- Submitting pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Inspiration

Grid Life is inspired by:
- [Langton's Ant](https://en.wikipedia.org/wiki/Langton%27s_ant) - The classic cellular automaton
- [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) - Emergent complexity from simple rules
- Modern web technologies for interactive simulations

---

**Ready to create your own ant behaviors?** Start with our [Getting Started Guide](docs/getting-started.md)! 