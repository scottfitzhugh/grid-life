# Ant Behavior Examples

This collection showcases various ant behaviors you can create with the Grid Life ant logic system. Each example includes complete JSON rules and explanations of the resulting behavior.

## Classic Patterns

### Langton's Ant

The most famous cellular automaton ant - creates complex patterns from simple rules.

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

**Behavior**: On white cells, turn right and paint red. On red cells, turn left and paint white. Creates a complex "highway" pattern after ~10,000 steps.

### Rainbow Trail Ant

An ant that cycles through colors as it moves.

```json
[
  {
    "action": {
      "setCellState": { "r": "ant.r", "g": "ant.g", "b": "ant.b" },
      "setAntState": { 
        "r": "ant.g", 
        "g": "ant.b", 
        "b": "ant.r" 
      },
      "move": true
    }
  }
]
```

**Behavior**: Always paints the current cell with the ant's color, then cycles the ant's RGB values (red→green, green→blue, blue→red). Creates a colorful trail that gradually shifts through the spectrum.

## Advanced Color Logic

### Color-Matching Explorer

An ant that seeks out cells matching its own color.

```json
[
  {
    "condition": {
      "cellState": { "r": "ant.r", "g": "ant.g", "b": "ant.b" }
    },
    "action": {
      "setAntState": { 
        "r": 100, 
        "g": 150, 
        "b": 200 
      },
      "turn": "reverse",
      "move": true
    }
  },
  {
    "condition": {
      "or": [
        { "surroundingCells": { "up": { "r": "ant.r" } } },
        { "surroundingCells": { "down": { "r": "ant.r" } } },
        { "surroundingCells": { "left": { "r": "ant.r" } } },
        { "surroundingCells": { "right": { "r": "ant.r" } } }
      ]
    },
    "action": {
      "setCellState": { "r": "ant.r", "g": "ant.g", "b": "ant.b" },
      "move": true
    }
  },
  {
    "action": {
      "setCellState": { "r": "ant.r", "g": "ant.g", "b": "ant.b" },
      "turn": "right",
      "move": true
    }
  }
]
```

**Behavior**: When the ant finds a cell matching its color, it changes color and reverses direction. If it detects a matching color in surrounding cells, it moves toward it. Otherwise, it turns right and continues painting.

### Gradient Painter

Creates a smooth color gradient based on position.

```json
[
  {
    "condition": {
      "antState": { "x": { "value": 0, "tolerance": 10 } }
    },
    "action": {
      "setCellState": { "r": 255, "g": 0, "b": 0 },
      "setAntState": { "r": 255, "g": 0, "b": 0 },
      "turn": "right",
      "move": true
    }
  },
  {
    "condition": {
      "antState": { "x": { "value": 20, "tolerance": 10 } }
    },
    "action": {
      "setCellState": { "r": 0, "g": 255, "b": 0 },
      "setAntState": { "r": 0, "g": 255, "b": 0 },
      "turn": "right",
      "move": true
    }
  },
  {
    "action": {
      "setCellState": { 
        "r": { "value": "ant.r", "tolerance": 20 },
        "g": { "value": "ant.g", "tolerance": 20 },
        "b": { "value": "ant.b", "tolerance": 20 }
      },
      "move": true
    }
  }
]
```

**Behavior**: Changes color based on X coordinate position, creating zones of different colors with gradual transitions.

## Complex Behavioral Patterns

### Wall-Following Ant

An ant that follows walls and creates maze-like structures.

```json
[
  {
    "condition": {
      "and": [
        { "cellState": { "r": 240, "g": 240, "b": 240 } },
        { "surroundingCells": { "right": { "r": 255, "g": 0, "b": 0 } } }
      ]
    },
    "action": {
      "setCellState": { "r": 255, "g": 0, "b": 0 },
      "move": true
    }
  },
  {
    "condition": {
      "and": [
        { "cellState": { "r": 240, "g": 240, "b": 240 } },
        { "surroundingCells": { "right": { "r": 240, "g": 240, "b": 240 } } }
      ]
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
      "turn": "left",
      "move": true
    }
  },
  {
    "action": {
      "turn": "right",
      "move": true
    }
  }
]
```

**Behavior**: Follows the right wall when available, turns right when no wall is present, and turns left when hitting a wall. Creates maze-like patterns and complex pathways.

### Spiral Builder

Creates expanding spiral patterns.

```json
[
  {
    "condition": {
      "surroundingCells": { "right": { "r": 255, "g": 0, "b": 0 } }
    },
    "action": {
      "setCellState": { "r": 255, "g": 0, "b": 0 },
      "turn": "left",
      "move": true
    }
  },
  {
    "condition": {
      "surroundingCells": { "up": { "r": 255, "g": 0, "b": 0 } }
    },
    "action": {
      "setCellState": { "r": 255, "g": 0, "b": 0 },
      "turn": "right",
      "move": true
    }
  },
  {
    "action": {
      "setCellState": { "r": 255, "g": 0, "b": 0 },
      "move": true
    }
  }
]
```

**Behavior**: Creates expanding spiral patterns by changing direction based on painted cells in specific directions.

## Environmental Interaction

### Heat-Seeking Ant

Seeks out "hot" areas (high red values) and avoids "cold" areas.

```json
[
  {
    "condition": {
      "or": [
        { "surroundingCells": { "up": { "r": { "value": 200, "tolerance": 55 } } } },
        { "surroundingCells": { "down": { "r": { "value": 200, "tolerance": 55 } } } },
        { "surroundingCells": { "left": { "r": { "value": 200, "tolerance": 55 } } } },
        { "surroundingCells": { "right": { "r": { "value": 200, "tolerance": 55 } } } }
      ]
    },
    "action": {
      "setCellState": { "r": 255, "g": 100, "b": 0 },
      "move": true
    }
  },
  {
    "condition": {
      "cellState": { "r": { "value": 50, "tolerance": 50 } }
    },
    "action": {
      "turn": "reverse",
      "move": true
    }
  },
  {
    "action": {
      "setCellState": { "r": 150, "g": 150, "b": 150 },
      "turn": "right",
      "move": true
    }
  }
]
```

**Behavior**: Moves toward high-red areas, reverses when encountering low-red areas, and generally explores while painting moderate gray values.

### Color Mixer

Blends colors from surrounding cells.

```json
[
  {
    "action": {
      "setCellState": {
        "r": "up.r",
        "g": "left.g", 
        "b": "down.b"
      },
      "setAntState": {
        "r": "right.r",
        "g": "up.g",
        "b": "left.b"
      },
      "turn": "right",
      "move": true
    }
  }
]
```

**Behavior**: Takes RGB components from different surrounding cells to create mixed colors, both on the grid and for the ant itself. Creates interesting color-blending patterns.

## Swarm Behaviors

### Leader-Follower Ant

Works best with multiple ants - some become leaders, others follow.

```json
[
  {
    "condition": {
      "and": [
        { "antState": { "r": 255, "g": 0, "b": 0 } },
        { "cellState": { "r": 240, "g": 240, "b": 240 } }
      ]
    },
    "action": {
      "setCellState": { "r": 255, "g": 0, "b": 0 },
      "move": true
    }
  },
  {
    "condition": {
      "or": [
        { "surroundingCells": { "up": { "r": 255, "g": 0, "b": 0 } } },
        { "surroundingCells": { "down": { "r": 255, "g": 0, "b": 0 } } },
        { "surroundingCells": { "left": { "r": 255, "g": 0, "b": 0 } } },
        { "surroundingCells": { "right": { "r": 255, "g": 0, "b": 0 } } }
      ]
    },
    "action": {
      "setCellState": { "r": 0, "g": 255, "b": 0 },
      "setAntState": { "r": 0, "g": 255, "b": 0 },
      "move": true
    }
  },
  {
    "action": {
      "turn": "right",
      "move": true
    }
  }
]
```

**Behavior**: Red ants act as leaders, painting red trails. Other ants become green followers when they encounter red trails. Creates emergent flocking behavior.

## Debugging and Learning

### Diagnostic Ant

Useful for understanding the system - shows what it "sees" in its environment.

```json
[
  {
    "condition": {
      "antState": { "direction": "up" }
    },
    "action": {
      "setCellState": { "r": 255, "g": 0, "b": 0 },
      "turn": "right",
      "move": true
    }
  },
  {
    "condition": {
      "antState": { "direction": "right" }
    },
    "action": {
      "setCellState": { "r": 0, "g": 255, "b": 0 },
      "turn": "right",
      "move": true
    }
  },
  {
    "condition": {
      "antState": { "direction": "down" }
    },
    "action": {
      "setCellState": { "r": 0, "g": 0, "b": 255 },
      "turn": "right",
      "move": true
    }
  },
  {
    "condition": {
      "antState": { "direction": "left" }
    },
    "action": {
      "setCellState": { "r": 255, "g": 255, "b": 0 },
      "turn": "right",
      "move": true
    }
  }
]
```

**Behavior**: Paints different colors based on direction (red=up, green=right, blue=down, yellow=left). Useful for visualizing ant movement patterns and understanding direction logic.

## Tips for Creating Your Own Behaviors

### Start Simple
- Begin with one or two rules
- Test basic movement and painting
- Add complexity gradually

### Use Variables Creatively
- Reference ant properties: `"ant.r"`, `"ant.direction"`
- Read surrounding cells: `"up.g"`, `"down.b"`
- Mix current cell values: `"cell.r"`

### Combine Conditions
- Use `"or"` for multiple possible triggers
- Use `"and"` for complex requirements
- Nest groups for sophisticated logic

### Test with Multiple Ants
- Some behaviors only emerge with multiple ants
- Different starting positions create different patterns
- Observe interactions between ants

### Performance Considerations
- Complex nested conditions can slow simulation
- Many ants with complex rules may impact performance
- Use tolerance sparingly - exact matches are faster

### Common Patterns
- **State machines**: Change ant color to represent different states
- **Environmental response**: React to surrounding cell colors
- **Trail following**: Use painted cells to guide behavior
- **Boundary detection**: Check for specific patterns or edges 