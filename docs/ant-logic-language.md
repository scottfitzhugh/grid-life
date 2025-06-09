# Enhanced Ant Logic Language Reference

The Enhanced Ant Logic Language is a JSON-based rule system that defines how ants behave in the Grid Life simulation. Each ant follows a set of rules that determine their actions based on current conditions.

## New Features

### Enhanced Variable References
- **Ant Variables**: `ant.r`, `ant.g`, `ant.b`, `ant.direction`
- **Current Cell Variables**: `cell.r`, `cell.g`, `cell.b`  
- **Surrounding Cell Variables**: `up.r`, `down.g`, `left.b`, `right.r`, `up-left.g`, etc.

### OR/AND Condition Groups
- **OR Groups**: Any condition in the group must match
- **AND Groups**: All conditions in the group must match
- Can be nested and combined for complex logic

---

## Rule Structure

Each rule consists of two parts:
- **Condition**: Defines when the rule should trigger (now supports OR/AND groups)
- **Action**: Defines what the ant should do when the condition is met

```json
{
  "condition": { /* enhanced condition with OR/AND support */ },
  "action": { /* actions to perform */ }
}
```

## Rule Execution

- Rules are evaluated in order from top to bottom
- The **first matching rule** is executed, then evaluation stops
- If no rules match, the ant does nothing that step

---

## Enhanced Conditions

### Basic Conditions (Backward Compatible)

```json
{
  "condition": {
    "antState": { "direction": "up", "r": 255 },
    "cellState": { "r": 240, "g": 240, "b": 240 },
    "surroundingCells": {
      "up": { "r": 255, "g": 0, "b": 0 }
    }
  }
}
```

### OR Condition Groups

Any condition in the `or` array must match:

```json
{
  "condition": {
    "or": [
      {
        "cellState": { "r": 255, "g": 0, "b": 0 }
      },
      {
        "cellState": { "r": 0, "g": 255, "b": 0 }
      },
      {
        "cellState": { "r": 0, "g": 0, "b": 255 }
      }
    ]
  }
}
```

### AND Condition Groups

All conditions in the `and` array must match:

```json
{
  "condition": {
    "and": [
      {
        "antState": { "direction": "up" }
      },
      {
        "cellState": { "r": 240, "g": 240, "b": 240 }
      },
      {
        "surroundingCells": {
          "up": { "r": 255, "g": 0, "b": 0 }
        }
      }
    ]
  }
}
```

### Complex Nested Conditions

You can combine OR and AND groups:

```json
{
  "condition": {
    "and": [
      {
        "antState": { "direction": "up" }
      },
      {
        "or": [
          {
            "cellState": { "r": 255, "g": 0, "b": 0 }
          },
          {
            "surroundingCells": {
              "up": { "r": 255, "g": 0, "b": 0 }
            }
          }
        ]
      }
    ]
  }
}
```

---

## Enhanced Variable References

### Current Cell Variables

Reference the cell the ant is currently on:

```json
// Trigger when ant's red matches current cell's red
{
  "condition": {
    "antState": { "r": "cell.r" }
  }
}

// Action: Set cell to ant's color
{
  "action": {
    "setCellState": { "r": "ant.r", "g": "ant.g", "b": "ant.b" }
  }
}

// Mix cell and ant variables
{
  "action": {
    "setAntState": { 
      "r": "cell.g",  // Set ant red to cell's green
      "g": "cell.b",  // Set ant green to cell's blue
      "b": "cell.r"   // Set ant blue to cell's red
    }
  }
}
```

### Surrounding Cell Variables

Reference neighboring cells directly:

```json
// Trigger when cell above has same red as ant
{
  "condition": {
    "antState": { "r": "up.r" }
  }
}

// Complex surrounding cell logic
{
  "condition": {
    "or": [
      { "antState": { "r": "up.r" } },
      { "antState": { "g": "down.g" } },
      { "antState": { "b": "left.b" } },
      { "antState": { "r": "right.r" } }
    ]
  }
}

// Action using surrounding cell values
{
  "action": {
    "setCellState": { 
      "r": "up.r", 
      "g": "down.g", 
      "b": "left.b" 
    }
  }
}
```

### All Available Cell References

**Cardinal Directions:**
- `up.r`, `up.g`, `up.b`
- `down.r`, `down.g`, `down.b`
- `left.r`, `left.g`, `left.b`
- `right.r`, `right.g`, `right.b`

**Diagonal Directions:**
- `up-left.r`, `up-left.g`, `up-left.b`
- `up-right.r`, `up-right.g`, `up-right.b`
- `down-left.r`, `down-left.g`, `down-left.b`
- `down-right.r`, `down-right.g`, `down-right.b`

### Variable References with Tolerance

Works with all variable types:

```json
// Current cell with tolerance
{
  "condition": {
    "antState": { 
      "r": { "value": "cell.r", "tolerance": 50 }
    }
  }
}

// Surrounding cells with tolerance
{
  "condition": {
    "antState": { 
      "g": { "value": "up.g", "tolerance": 25 }
    }
  }
}

// Direct numeric values with tolerance
{
  "condition": {
    "cellState": {
      "r": { "value": 128, "tolerance": 30 }
    }
  }
}
```

This last example matches when the cell's red value is between 98 and 158 (128 ± 30).

---

## Mathematical Expressions

You can use mathematical expressions in both conditions and actions. Expressions can include variable references, numbers, and basic operators.

### Supported Operators

- **Addition**: `+`
- **Subtraction**: `-`
- **Multiplication**: `*`
- **Division**: `/`
- **Modulo**: `%`
- **Parentheses**: `()` for grouping

### Expression Examples

```json
// Set cell red to ant's red plus 10
{
  "action": {
    "setCellState": { "r": "ant.r + 10" }
  }
}

// Set ant color to mix of current cell and ant colors
{
  "action": {
    "setAntState": { 
      "r": "ant.r * cell.r / 255",
      "g": "(ant.g + cell.g) / 2",
      "b": "ant.b - 20"
    }
  }
}

// Condition using mathematical expression
{
  "condition": {
    "cellState": { "r": "ant.r * 2" }
  }
}

// Complex expression with surrounding cells
{
  "action": {
    "setCellState": {
      "r": "(up.r + down.r) / 2",
      "g": "left.g * right.g / 255",
      "b": "ant.b % 50 + 100"
    }
  }
}

// Expression with tolerance
{
  "condition": {
    "cellState": {
      "r": { 
        "value": "ant.r + ant.g", 
        "tolerance": 25 
      }
    }
  }
}
```

### Expression Rules

1. **Automatic Clamping**: Results are automatically clamped to 0-255 range for RGB values
2. **Integer Results**: Results are rounded to integers
3. **Error Handling**: Invalid expressions default to 0
4. **Division Safety**: Division by zero results in 0
5. **Variable Types**: Only numeric variables (r, g, b) can be used in expressions

### Operator Precedence

Mathematical expressions follow standard operator precedence:
1. **Parentheses** `()` - highest priority
2. **Multiplication, Division, Modulo** `* / %`
3. **Addition, Subtraction** `+ -` - lowest priority

---

## Enhanced Example Rules

### Color-Gradient Following Ant

```json
[
  {
    "condition": {
      "or": [
        { "antState": { "r": { "value": "up.r", "tolerance": 30 } } },
        { "antState": { "g": { "value": "up.g", "tolerance": 30 } } },
        { "antState": { "b": { "value": "up.b", "tolerance": 30 } } }
      ]
    },
    "action": {
      "setAntState": { "direction": "up" },
      "move": true
    }
  },
  {
    "condition": {
      "or": [
        { "antState": { "r": { "value": "right.r", "tolerance": 30 } } },
        { "antState": { "g": { "value": "right.g", "tolerance": 30 } } },
        { "antState": { "b": { "value": "right.b", "tolerance": 30 } } }
      ]
    },
    "action": {
      "setAntState": { "direction": "right" },
      "move": true
    }
  }
]
```

### Cell-Color Mixing Ant

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
  },
  {
    "condition": {
      "and": [
        { "cellState": { "r": "ant.r" } },
        { "cellState": { "g": "up.g" } }
      ]
    },
    "action": {
      "setAntState": { 
        "r": "cell.g", 
        "g": "cell.b", 
        "b": "cell.r" 
      },
      "turn": "right",
      "move": true
    }
  }
]
```

### Smart Pathfinding Ant

```json
[
  {
    "condition": {
      "and": [
        {
          "or": [
            { "surroundingCells": { "up": { "r": 0, "g": 0, "b": 0 } } },
            { "surroundingCells": { "up": { "r": 255, "g": 255, "b": 255 } } }
          ]
        },
        { "antState": { "direction": "up" } }
      ]
    },
    "action": {
      "turn": "right",
      "move": true
    }
  },
  {
    "condition": {
      "or": [
        { "cellState": { "r": "up.r", "g": "up.g", "b": "up.b" } },
        { "cellState": { "r": "down.r", "g": "down.g", "b": "down.b" } }
      ]
    },
    "action": {
      "setCellState": { "r": "ant.r", "g": "ant.g", "b": "ant.b" },
      "turn": "left",
      "move": true
    }
  }
]
```

### Pattern-Detection Ant

```json
[
  {
    "condition": {
      "and": [
        { "cellState": { "r": "up.r" } },
        { "cellState": { "g": "down.g" } },
        { "cellState": { "b": "left.b" } },
        { "antState": { "r": "right.r" } }
      ]
    },
    "action": {
      "setCellState": { "r": 255, "g": 255, "b": 0 },
      "setAntState": { "r": 255, "g": 255, "b": 0 },
      "turn": "reverse",
      "move": true
    }
  }
]
```

---

## Migration Guide

### Old Format (Still Supported)
```json
{
  "condition": {
    "antState": { "r": "ant.g" },
    "cellState": { "r": 240, "g": 240, "b": 240 }
  }
}
```

### New Enhanced Format
```json
{
  "condition": {
    "and": [
      { "antState": { "r": "ant.g" } },
      { "cellState": { "r": 240, "g": 240, "b": 240 } }
    ]
  }
}
```

### Adding Cell Variables
```json
// Old: Only ant variables
{ "action": { "setCellState": { "r": "ant.r" } } }

// New: Cell and surrounding variables
{ "action": { "setCellState": { "r": "cell.g", "g": "up.b", "b": "down.r" } } }
```

---

## Performance Notes

- OR conditions short-circuit (stop at first match)
- AND conditions short-circuit (stop at first failure)  
- Cell variable resolution is optimized and cached per step
- Complex nested conditions may impact performance with many ants

---

## Error Handling

### Common Errors
- **Invalid variable reference**: `cell.invalid` → Use `cell.r`, `cell.g`, or `cell.b`
- **Unknown direction**: `north.r` → Use `up.r`, `down.r`, `left.r`, `right.r`, etc.
- **Mixed condition formats**: Don't mix basic and OR/AND in same condition
- **Empty condition groups**: OR/AND arrays must not be empty

### Validation
- Rules are validated when applied
- Invalid variable references default to 0
- Invalid rules are skipped with warnings
- Malformed JSON shows parse errors

---

*The enhanced ant logic system provides powerful new capabilities while maintaining backward compatibility with existing rules.* 