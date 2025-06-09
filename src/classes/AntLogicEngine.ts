import { 
	AntState, 
	CellState, 
	AntRule, 
	ConditionValue, 
	VariableRef, 
	EnhancedCondition, 
	BaseCondition,
	VariableContext,
	SurroundingDirection,
	Turn
} from '../types/index.js';
import { Grid } from './Grid.js';

/**
 * Enhanced Ant Logic Engine for parsing and executing ant behavior rules
 * Supports extended variable references and OR/AND condition groups
 */
export class AntLogicEngine {
	/**
	 * Execute ant behavior based on rules
	 */
	public static executeRules(ant: AntState, rules: AntRule[], grid: Grid): void {
		const context = this.buildVariableContext(ant, grid);

		for (const rule of rules) {
			if (this.evaluateCondition(rule.condition, context)) {
				this.executeAction(rule.action, ant, grid, context);
				break; // Execute only first matching rule
			}
		}
	}

	/**
	 * Build variable context for the ant
	 */
	private static buildVariableContext(ant: AntState, grid: Grid): VariableContext {
		const currentCell = grid.getCellState(ant.x, ant.y);
		const surroundingCells = grid.getSurroundingCells(ant.x, ant.y);

		return {
			ant,
			cell: currentCell,
			surrounding: surroundingCells
		};
	}

	/**
	 * Evaluate enhanced condition (supports OR/AND groups)
	 */
	private static evaluateCondition(condition: EnhancedCondition, context: VariableContext): boolean {
		// Handle OR condition group
		if ('or' in condition && condition.or) {
			return condition.or.some(subCondition => this.evaluateBaseCondition(subCondition, context));
		}

		// Handle AND condition group
		if ('and' in condition && condition.and) {
			return condition.and.every(subCondition => this.evaluateBaseCondition(subCondition, context));
		}

		// Handle base condition
		return this.evaluateBaseCondition(condition as BaseCondition, context);
	}

	/**
	 * Evaluate base condition
	 */
	private static evaluateBaseCondition(condition: BaseCondition, context: VariableContext): boolean {
		// Check ant state condition
		if (condition.antState) {
			for (const [key, expectedValue] of Object.entries(condition.antState)) {
				const actualValue = context.ant[key as keyof AntState];
				if (!this.valuesMatch(actualValue, expectedValue, context)) {
					return false;
				}
			}
		}

		// Check cell state condition
		if (condition.cellState) {
			for (const [key, expectedValue] of Object.entries(condition.cellState)) {
				const actualValue = context.cell[key as keyof CellState];
				if (!this.valuesMatch(actualValue, expectedValue, context)) {
					return false;
				}
			}
		}

		// Check surrounding cells condition
		if (condition.surroundingCells) {
			for (const [direction, expectedState] of Object.entries(condition.surroundingCells)) {
				const actualCell = context.surrounding[direction];
				if (!actualCell) return false; // Direction must exist
				
				for (const [key, expectedValue] of Object.entries(expectedState)) {
					const actualValue = actualCell[key as keyof CellState];
					if (!this.valuesMatch(actualValue, expectedValue, context)) {
						return false;
					}
				}
			}
		}

		return true;
	}

	/**
	 * Enhanced value matching with comprehensive variable resolution
	 */
	private static valuesMatch(actualValue: any, expectedValue: ConditionValue, context: VariableContext): boolean {
		// Handle direct value comparison
		if (typeof expectedValue === 'number' || typeof expectedValue === 'string') {
			// Check if it's a variable reference
			if (typeof expectedValue === 'string' && this.isVariableReference(expectedValue)) {
				const resolvedValue = this.resolveVariableReference(expectedValue, context);
				return actualValue === resolvedValue;
			}
			// Direct value comparison
			return actualValue === expectedValue;
		}

		// Handle variable reference with tolerance
		if (typeof expectedValue === 'object' && expectedValue.value) {
			const ref = expectedValue as VariableRef;
			if (this.isVariableReference(ref.value)) {
				const resolvedValue = this.resolveVariableReference(ref.value, context);
				
				if (typeof resolvedValue === 'number' && typeof actualValue === 'number') {
					if (ref.tolerance !== undefined) {
						// Range comparison with tolerance
						return Math.abs(actualValue - resolvedValue) <= ref.tolerance;
					} else {
						// Exact comparison
						return actualValue === resolvedValue;
					}
				} else {
					// Non-numeric comparison (exact match only)
					return actualValue === resolvedValue;
				}
			}
		}

		return false;
	}

	/**
	 * Check if string is a valid variable reference
	 */
	private static isVariableReference(value: string): boolean {
		return value.includes('.') && (
			value.startsWith('ant.') || 
			value.startsWith('cell.') ||
			this.isSurroundingCellReference(value)
		);
	}

	/**
	 * Check if string is a surrounding cell reference
	 */
	private static isSurroundingCellReference(value: string): boolean {
		const surroundingDirections: SurroundingDirection[] = [
			'up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right'
		];
		
		return surroundingDirections.some(direction => value.startsWith(`${direction}.`));
	}

	/**
	 * Resolve variable reference to actual value
	 */
	private static resolveVariableReference(reference: string, context: VariableContext): any {
		const parts = reference.split('.');
		if (parts.length !== 2) {
			console.warn(`Invalid variable reference: ${reference}`);
			return undefined;
		}

		const [source, property] = parts;

		switch (source) {
			case 'ant':
				return context.ant[property as keyof AntState];
			
			case 'cell':
				return context.cell[property as keyof CellState];
			
			default:
				// Check if it's a surrounding cell reference
				if (context.surrounding[source]) {
					return context.surrounding[source][property as keyof CellState];
				}
				console.warn(`Unknown variable source: ${source}`);
				return undefined;
		}
	}

	/**
	 * Execute rule action with enhanced variable resolution
	 */
	private static executeAction(
		action: AntRule['action'], 
		ant: AntState, 
		grid: Grid, 
		context: VariableContext
	): void {
		// Set ant state
		if (action.setAntState) {
			const resolvedState = this.resolveVariableReferences(action.setAntState, context);
			this.updateAntState(ant, resolvedState);
		}

		// Turn relative to current direction
		if (action.turn) {
			this.turnAnt(ant, action.turn);
		}

		// Set cell state
		if (action.setCellState) {
			const resolvedCellState = this.resolveVariableReferences(action.setCellState, context);
			grid.setCellState(ant.x, ant.y, resolvedCellState as CellState);
		}

		// Move ant
		if (action.move) {
			this.moveAnt(ant);
		}
	}

	/**
	 * Resolve variable references in an object
	 */
	private static resolveVariableReferences(obj: any, context: VariableContext): any {
		const resolved: any = {};
		
		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === 'string' && this.isVariableReference(value)) {
				// Variable reference - resolve to actual value
				resolved[key] = this.resolveVariableReference(value, context);
			} else {
				// Direct value - use as-is
				resolved[key] = value;
			}
		}
		
		return resolved;
	}

	/**
	 * Update ant state with validation
	 */
	private static updateAntState(ant: AntState, updates: any): void {
		for (const [key, value] of Object.entries(updates)) {
			if (key === 'direction') {
				if (['up', 'down', 'left', 'right'].includes(value as string)) {
					ant.direction = value as any;
				} else {
					console.warn(`Invalid direction: ${value}. Keeping current direction: ${ant.direction}`);
				}
			} else if (['r', 'g', 'b'].includes(key)) {
				// Clamp RGB values to 0-255
				const numValue = Number(value);
				if (!isNaN(numValue)) {
					(ant as any)[key] = Math.max(0, Math.min(255, numValue));
				}
			} else if (key !== 'id' && key !== 'x' && key !== 'y' && key !== 'rules') {
				// Allow other properties but skip core ones
				(ant as any)[key] = value;
			}
		}
	}

	/**
	 * Turn ant relative to current direction
	 */
	private static turnAnt(ant: AntState, turn: Turn): void {
		const directions = ['up', 'right', 'down', 'left'] as const;
		const currentIndex = directions.indexOf(ant.direction);
		
		switch (turn) {
			case 'right':
				ant.direction = directions[(currentIndex + 1) % 4];
				break;
			case 'left':
				ant.direction = directions[(currentIndex + 3) % 4]; // +3 is same as -1 with wrap
				break;
			case 'reverse':
				ant.direction = directions[(currentIndex + 2) % 4]; // Turn around 180 degrees
				break;
		}
	}

	/**
	 * Move ant one step in its current direction
	 */
	private static moveAnt(ant: AntState): void {
		switch (ant.direction) {
			case 'up':
				ant.y--;
				break;
			case 'down':
				ant.y++;
				break;
			case 'left':
				ant.x--;
				break;
			case 'right':
				ant.x++;
				break;
		}
	}

	/**
	 * Validate rule structure
	 */
	public static validateRule(rule: any): boolean {
		if (!rule || typeof rule !== 'object') return false;
		if (!rule.condition || !rule.action) return false;
		
		// Additional validation can be added here
		return true;
	}

	/**
	 * Parse and validate rules from JSON string
	 */
	public static parseRules(rulesJson: string): AntRule[] {
		try {
			const rules = JSON.parse(rulesJson);
			if (!Array.isArray(rules)) {
				console.warn('Rules must be an array');
				return [];
			}
			
			return rules.filter(rule => {
				if (this.validateRule(rule)) {
					return true;
				} else {
					console.warn('Invalid rule structure:', rule);
					return false;
				}
			});
		} catch (e) {
			console.warn('Invalid JSON in rules:', e);
			return [];
		}
	}
} 