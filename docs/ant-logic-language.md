# Ant Logic Language Reference

The Ant Logic Language is a JSON-based rule system that defines how ants behave in the Grid Life simulation. Each ant follows a set of rules that determine their actions based on current conditions.

## Rule Structure

Each rule consists of two parts:
- **Condition**: Defines when the rule should trigger
- **Action**: Defines what the ant should do when the condition is met

```json
{
  "condition": { /* condition criteria */ },
  "action": { /* actions to perform */ }
}
```

## Rule Execution

- Rules are evaluated in order from top to bottom
- The **first matching rule** is executed, then evaluation stops
- If no rules match, the ant does nothing that step

---

## Conditions

Conditions define when a rule should trigger. Multiple condition types can be combined in a single rule.

### `antState` - Check Ant Properties

Check the ant's current state (direction and color values).

**Properties:**
- `direction`: "up", "down", "left", "right"
- `r`, `g`, `b`: Color values (0-255)

**Examples:**

```json
// Trigger when ant is facing up
{
  "condition": {
    "antState": { "direction": "up" }
  }
}

// Trigger when ant is red (r=255)
{
  "condition": {
    "antState": { "r": 255 }
  }
}

// Trigger when ant is facing right and has specific colors
{
  "condition": {
    "antState": { 
      "direction": "right", 
      "r": 255, 
      "g": 0, 
      "b": 0 
    }
  }
}
```

### `cellState` - Check Current Cell Properties

Check the color of the cell the ant is currently on.

**Properties:**
- `r`, `g`, `b`: Color values (0-255)

**Examples:**

```json
// Trigger when on a light gray cell (default color)
{
  "condition": {
    "cellState": { "r": 240, "g": 240, "b": 240 }
  }
}

// Trigger when on a red cell
{
  "condition": {
    "cellState": { "r": 255, "g": 0, "b": 0 }
  }
}

// Trigger when cell's red component is 100
{
  "condition": {
    "cellState": { "r": 100 }
  }
}
```

### `surroundingCells` - Check Neighboring Cells

Check the colors of cells surrounding the ant.

**Directions:**
- `up`, `down`, `left`, `right`
- `up-left`, `up-right`, `down-left`, `down-right`

**Examples:**

```json
// Trigger when cell above is red
{
  "condition": {
    "surroundingCells": {
      "up": { "r": 255, "g": 0, "b": 0 }
    }
  }
}

// Trigger when multiple surrounding cells have specific colors
{
  "condition": {
    "surroundingCells": {
      "up": { "r": 255 },
      "right": { "g": 255 },
      "down": { "b": 255 }
    }
  }
}

// Check diagonal cells
{
  "condition": {
    "surroundingCells": {
      "up-right": { "r": 100, "g": 100, "b": 100 }
    }
  }
}
```

---

## Variable References

Instead of hard-coded values, you can reference the ant's current properties using variable references in both **conditions** and **actions**.

### Basic Variable References

**Available References:**
- `"ant.r"` - Ant's red color component
- `"ant.g"` - Ant's green color component  
- `"ant.b"` - Ant's blue color component
- `"ant.direction"` - Ant's current direction

**Examples in Conditions:**

```json
// Trigger when cell color matches ant's red component exactly
{
  "condition": {
    "cellState": { "r": "ant.r" }
  }
}

// Multiple variable references in conditions
{
  "condition": {
    "cellState": { 
      "r": "ant.r", 
      "g": "ant.g", 
      "b": "ant.b" 
    }
  }
}
```

**Examples in Actions:**

```json
// Paint cell with ant's current color
{
  "action": {
    "setCellState": { "r": "ant.r", "g": "ant.g", "b": "ant.b" }
  }
}

// Cycle ant colors (red->green, green->blue, blue->red)
{
  "action": {
    "setAntState": { 
      "r": "ant.g", 
      "g": "ant.b", 
      "b": "ant.r" 
    }
  }
}
```

### Variable References with Tolerance

For numeric values, you can specify a tolerance range for fuzzy matching.

**Syntax:**
```json
{
  "property": {
    "value": "ant.property",
    "tolerance": number
  }
}
```

**Examples:**

```json
// Trigger when cell red is within 50 of ant's red
{
  "condition": {
    "cellState": { 
      "r": { "value": "ant.r", "tolerance": 50 }
    }
  }
}

// Multiple tolerances
{
  "condition": {
    "cellState": {
      "r": { "value": "ant.r", "tolerance": 25 },
      "g": { "value": "ant.g", "tolerance": 10 },
      "b": "ant.b"  // Exact match for blue
    }
  }
}

// Surrounding cells with tolerance
{
  "condition": {
    "surroundingCells": {
      "up": { 
        "r": { "value": "ant.r", "tolerance": 30 }
      }
    }
  }
}
```

### Mixed Value Types

You can mix direct values, variable references, and tolerances in the same condition.

```json
{
  "condition": {
    "cellState": {
      "r": "ant.r",                              // Exact ant reference
      "g": { "value": "ant.g", "tolerance": 50 }, // Ant reference with tolerance
      "b": 100                                   // Direct value
    }
  }
}
```

---

## Actions

Actions define what the ant should do when a condition is met. Multiple actions can be performed in sequence.

### `setAntState` - Modify Ant Properties

Change the ant's direction or color values. Supports both direct values and variable references.

**Properties:**
- `direction`: "up", "down", "left", "right"
- `r`, `g`, `b`: Color values (0-255) or variable references

**Examples:**

```json
// Change ant direction
{
  "action": {
    "setAntState": { "direction": "right" }
  }
}

// Change ant color to red
{
  "action": {
    "setAntState": { "r": 255, "g": 0, "b": 0 }
  }
}

// Copy another ant property (useful in complex logic)
{
  "action": {
    "setAntState": { 
      "r": "ant.g",  // Set red to current green value
      "g": "ant.b",  // Set green to current blue value  
      "b": "ant.r"   // Set blue to current red value
    }
  }
}

// Mix direct values and variable references
{
  "action": {
    "setAntState": { 
      "direction": "left", 
      "r": "ant.r",  // Keep current red
      "g": 150       // Set green to 150
    }
  }
}
```

### `setCellState` - Modify Cell Properties

Change the color of the cell the ant is currently on. Supports both direct values and variable references.

**Properties:**
- `r`, `g`, `b`: Color values (0-255) or variable references

**Examples:**

```json
// Paint cell red
{
  "action": {
    "setCellState": { "r": 255, "g": 0, "b": 0 }
  }
}

// Paint cell with ant's current color
{
  "action": {
    "setCellState": { "r": "ant.r", "g": "ant.g", "b": "ant.b" }
  }
}

// Paint cell using ant's direction as a color component
{
  "action": {
    "setCellState": { 
      "r": "ant.r", 
      "g": 128, 
      "b": "ant.g" 
    }
  }
}

// Change only specific color components
{
  "action": {
    "setCellState": { "r": "ant.r" }  // Set red to ant's red, keep g,b unchanged
  }
}
```

### `turn` - Relative Direction Changes

Turn the ant relative to its current direction.

**Options:**
- `"left"`: Turn 90° counterclockwise
- `"right"`: Turn 90° clockwise
- `"reverse"`: Turn 180° around

**Examples:**

```json
// Turn right
{
  "action": {
    "turn": "right"
  }
}

// Turn left
{
  "action": {
    "turn": "left"
  }
}

// Turn around
{
  "action": {
    "turn": "reverse"
  }
}
```

### `move` - Move Forward

Move the ant one step in its current direction.

**Value:** `true` or `false`

**Examples:**

```json
// Move forward
{
  "action": {
    "move": true
  }
}

// Combined with other actions
{
  "action": {
    "turn": "right",
    "move": true
  }
}
```

---

## Complete Example Rules

### Classic Langton's Ant

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

### Color-Painting Ant

```json
[
  {
    "condition": {
      "cellState": { "r": 240, "g": 240, "b": 240 }
    },
    "action": {
      "setCellState": { "r": "ant.r", "g": "ant.g", "b": "ant.b" },
      "move": true
    }
  },
  {
    "condition": {
      "cellState": { "r": "ant.r", "g": "ant.g", "b": "ant.b" }
    },
    "action": {
      "setAntState": { 
        "r": "ant.g", 
        "g": "ant.b", 
        "b": "ant.r" 
      },
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
  },
  {
    "condition": {
      "surroundingCells": {
        "right": { "r": { "value": "ant.r", "tolerance": 30 } }
      }
    },
    "action": {
      "setAntState": { "direction": "right" },
      "move": true
    }
  },
  {
    "condition": {},
    "action": {
      "turn": "right",
      "move": true
    }
  }
]
```

### Bouncing Ant

```json
[
  {
    "condition": {
      "surroundingCells": {
        "up": { "r": 0, "g": 0, "b": 0 }
      },
      "antState": { "direction": "up" }
    },
    "action": {
      "turn": "reverse",
      "move": true
    }
  },
  {
    "condition": {
      "surroundingCells": {
        "down": { "r": 0, "g": 0, "b": 0 }
      },
      "antState": { "direction": "down" }
    },
    "action": {
      "turn": "reverse",
      "move": true
    }
  },
  {
    "condition": {},
    "action": {
      "move": true
    }
  }
]
```

---

## Advanced Patterns

### Multi-Condition Complex Rules

```json
[
  {
    "condition": {
      "antState": { "direction": "up", "r": 255 },
      "cellState": { "g": { "value": "ant.g", "tolerance": 25 } },
      "surroundingCells": {
        "left": { "b": 100 },
        "right": { "b": 200 }
      }
    },
    "action": {
      "setAntState": { "direction": "right", "b": 128 },
      "setCellState": { "r": 128, "g": 128, "b": 128 },
      "move": true
    }
  }
]
```

### Color-Swapping Ant

```json
[
  {
    "condition": {
      "cellState": { "r": 240, "g": 240, "b": 240 }
    },
    "action": {
      "setCellState": { "r": "ant.r", "g": "ant.g", "b": "ant.b" },
      "setAntState": { "r": 100, "g": 150, "b": 200 },
      "move": true
    }
  },
  {
    "condition": {},
    "action": {
      "setAntState": { "r": "ant.g", "g": "ant.b", "b": "ant.r" },
      "turn": "right",
      "move": true
    }
  }
]
```

### State Machine Ant

```json
[
  {
    "condition": {
      "antState": { "r": 255, "g": 0, "b": 0 }
    },
    "action": {
      "setAntState": { "r": 0, "g": 255, "b": 0 },
      "turn": "right",
      "move": true
    }
  },
  {
    "condition": {
      "antState": { "r": 0, "g": 255, "b": 0 }
    },
    "action": {
      "setAntState": { "r": 0, "g": 0, "b": 255 },
      "turn": "left",
      "move": true
    }
  },
  {
    "condition": {
      "antState": { "r": 0, "g": 0, "b": 255 }
    },
    "action": {
      "setAntState": { "r": 255, "g": 0, "b": 0 },
      "turn": "reverse",
      "move": true
    }
  }
]
```

---

## Tips and Best Practices

### Rule Order Matters
- Rules are evaluated top to bottom
- Put more specific conditions first
- Use a catch-all rule `{"condition": {}}` at the end for default behavior

### Performance Considerations
- Simpler conditions evaluate faster
- Avoid overly complex rule sets for better performance
- Consider the number of ants when designing rules

### Debugging Rules
- Use simple rules first, then add complexity
- Test one condition type at a time
- Use the browser's developer console to check for rule parsing errors

### Creative Patterns
- Combine multiple condition types for complex behaviors
- Use tolerance values to create fuzzy logic
- Create feedback loops where ants modify their environment and respond to changes
- Use variable references in actions to create dynamic color patterns and state transfers
- Mix variable references with direct values for flexible behaviors
- Create color cycling, painting, and coordination patterns

---

## Error Handling

### Common Errors
- **Invalid JSON**: Check brackets, commas, and quotes
- **Invalid directions**: Must be "up", "down", "left", "right"
- **Invalid color values**: Must be integers 0-255
- **Invalid variable references**: Must start with "ant."
- **Invalid tolerance**: Must be a positive number

### Validation
- Rules are validated when applied
- Invalid rules will show error messages
- Ants with invalid rules will not move

---

*For more examples and advanced techniques, see the Grid Life community wiki and example patterns.* 