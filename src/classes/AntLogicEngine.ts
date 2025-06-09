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

// Callback type for spawning new ants
export type SpawnCallback = (x: number, y: number, state: Partial<AntState>) => void;

/**
 * Enhanced Ant Logic Engine for parsing and executing ant behavior rules
 * Supports extended variable references and OR/AND condition groups
 */
export class AntLogicEngine {
	/**
	 * Execute ant behavior based on rules
	 */
	public static executeRules(ant: AntState, rules: AntRule[], grid: Grid, spawnCallback?: SpawnCallback): void {
		const context = this.buildVariableContext(ant, grid);

		for (const rule of rules) {
			// Rules without conditions always execute
			const shouldExecute = !rule.condition || this.evaluateCondition(rule.condition, context);
			
			if (shouldExecute) {
				this.executeAction(rule.action, ant, grid, context, spawnCallback);
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
			if (typeof expectedValue === 'string') {
				if (this.isMathExpression(expectedValue)) {
					// Mathematical expression - evaluate it
					const resolvedValue = this.evaluateMathExpression(expectedValue, context);
					return actualValue === resolvedValue;
				} else if (this.isVariableReference(expectedValue)) {
					// Variable reference - resolve it
					const resolvedValue = this.resolveVariableReference(expectedValue, context);
					return actualValue === resolvedValue;
				}
				// Direct string value comparison
				return actualValue === expectedValue;
			}
			// Direct numeric value comparison
			return actualValue === expectedValue;
		}

			// Handle variable reference with tolerance
	if (typeof expectedValue === 'object' && expectedValue.value !== undefined) {
		const ref = expectedValue as VariableRef;
		let resolvedValue: any;
		
		// Check if value is a variable reference, math expression, or direct value
		if (typeof ref.value === 'string') {
			if (this.isMathExpression(ref.value)) {
				// Mathematical expression - evaluate it
				resolvedValue = this.evaluateMathExpression(ref.value, context);
			} else if (this.isVariableReference(ref.value)) {
				// Variable reference - resolve it
				resolvedValue = this.resolveVariableReference(ref.value, context);
			} else {
				// Direct string value
				resolvedValue = ref.value;
			}
		} else {
			// Direct numeric value
			resolvedValue = ref.value;
		}
		
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
	 * Check if string is a mathematical expression
	 */
	private static isMathExpression(value: string): boolean {
		// Check if string contains math operators and variable references
		const hasMathOperators = /[+\-*/%]/.test(value);
		const hasVariables = /\b(ant|cell|up|down|left|right|up-left|up-right|down-left|down-right)\.[rgb]\b/.test(value);
		return hasMathOperators && (hasVariables || /\d/.test(value));
	}

	/**
	 * Evaluate mathematical expression with variable substitution
	 */
	private static evaluateMathExpression(expression: string, context: VariableContext): number {
		try {
			// Replace variable references with their actual values
			let processedExpression = expression;
			
			// Find all variable references in the expression
			const variablePattern = /\b(ant|cell|up|down|left|right|up-left|up-right|down-left|down-right)\.[rgb]\b/g;
			const matches = processedExpression.match(variablePattern);
			
			if (matches) {
				for (const match of matches) {
					const value = this.resolveVariableReference(match, context);
					if (typeof value === 'number') {
						processedExpression = processedExpression.replace(new RegExp('\\b' + match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g'), value.toString());
					} else {
						console.warn(`Variable ${match} is not a number, cannot use in math expression`);
						return 0;
					}
				}
			}
			
			// Evaluate the mathematical expression safely
			const result = this.evaluateSafeMath(processedExpression);
			
			// Clamp result to valid RGB range for color values
			return Math.max(0, Math.min(255, Math.round(result)));
		} catch (error) {
			console.warn(`Error evaluating math expression "${expression}":`, error);
			return 0;
		}
	}

	/**
	 * Safely evaluate a mathematical expression (basic operations only)
	 */
	private static evaluateSafeMath(expression: string): number {
		// Remove whitespace
		expression = expression.replace(/\s+/g, '');
		
		// Only allow numbers, basic operators, and parentheses
		if (!/^[0-9+\-*/.()%]+$/.test(expression)) {
			throw new Error('Invalid characters in math expression');
		}
		
		// Simple recursive descent parser for basic math
		return this.parseExpression(expression, 0).value;
	}

	/**
	 * Parse mathematical expression (handles operator precedence)
	 */
	private static parseExpression(expr: string, pos: number): { value: number; pos: number } {
		let result = this.parseTerm(expr, pos);
		
		while (result.pos < expr.length) {
			const op = expr[result.pos];
			if (op === '+' || op === '-') {
				const right = this.parseTerm(expr, result.pos + 1);
				result.value = op === '+' ? result.value + right.value : result.value - right.value;
				result.pos = right.pos;
			} else {
				break;
			}
		}
		
		return result;
	}

	/**
	 * Parse term (handles * / % operators)
	 */
	private static parseTerm(expr: string, pos: number): { value: number; pos: number } {
		let result = this.parseFactor(expr, pos);
		
		while (result.pos < expr.length) {
			const op = expr[result.pos];
			if (op === '*' || op === '/' || op === '%') {
				const right = this.parseFactor(expr, result.pos + 1);
				if (op === '*') {
					result.value = result.value * right.value;
				} else if (op === '/') {
					if (right.value === 0) throw new Error('Division by zero');
					result.value = result.value / right.value;
				} else { // %
					if (right.value === 0) throw new Error('Modulo by zero');
					result.value = result.value % right.value;
				}
				result.pos = right.pos;
			} else {
				break;
			}
		}
		
		return result;
	}

	/**
	 * Parse factor (handles numbers and parentheses)
	 */
	private static parseFactor(expr: string, pos: number): { value: number; pos: number } {
		// Skip whitespace
		while (pos < expr.length && expr[pos] === ' ') pos++;
		
		if (pos >= expr.length) throw new Error('Unexpected end of expression');
		
		// Handle negative numbers
		if (expr[pos] === '-') {
			const result = this.parseFactor(expr, pos + 1);
			return { value: -result.value, pos: result.pos };
		}
		
		// Handle parentheses
		if (expr[pos] === '(') {
			const result = this.parseExpression(expr, pos + 1);
			if (result.pos >= expr.length || expr[result.pos] !== ')') {
				throw new Error('Missing closing parenthesis');
			}
			return { value: result.value, pos: result.pos + 1 };
		}
		
		// Parse number
		let numStr = '';
		while (pos < expr.length && /[0-9.]/.test(expr[pos])) {
			numStr += expr[pos];
			pos++;
		}
		
		if (numStr === '') throw new Error('Expected number');
		
		const value = parseFloat(numStr);
		if (isNaN(value)) throw new Error('Invalid number');
		
		return { value, pos };
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
		context: VariableContext,
		spawnCallback?: SpawnCallback
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
			
			// Ensure we have a complete cell state with all RGB values
			const currentCell = grid.getCellState(ant.x, ant.y);
			const completeCellState: CellState = {
				r: resolvedCellState.r !== undefined ? resolvedCellState.r : currentCell.r,
				g: resolvedCellState.g !== undefined ? resolvedCellState.g : currentCell.g,
				b: resolvedCellState.b !== undefined ? resolvedCellState.b : currentCell.b
			};
			
			grid.setCellState(ant.x, ant.y, completeCellState);
		}

		// Move ant
		if (action.move) {
			this.moveAnt(ant);
		}

		// Spawn new ant
		if (action.spawn && spawnCallback) {
			this.executeSpawn(action.spawn, ant, context, spawnCallback);
		}
	}

	/**
	 * Resolve variable references and mathematical expressions in an object
	 */
	private static resolveVariableReferences(obj: any, context: VariableContext): any {
		const resolved: any = {};
		
		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === 'string') {
				if (this.isMathExpression(value)) {
					// Mathematical expression - evaluate it
					const resolvedValue = this.evaluateMathExpression(value, context);
					resolved[key] = resolvedValue;
				} else if (this.isVariableReference(value)) {
					// Variable reference - resolve to actual value
					const resolvedValue = this.resolveVariableReference(value, context);
					resolved[key] = resolvedValue;
				} else {
					// Direct string value - use as-is
					resolved[key] = value;
				}
			} else {
				// Direct value (number, etc.) - use as-is
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
					const clampedValue = Math.max(0, Math.min(255, numValue));
					(ant as any)[key] = clampedValue;
				} else {
					console.warn(`Invalid numeric value for ${key}: ${value}`);
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
	 * Execute spawn action to create a new ant in the specified direction
	 */
	private static executeSpawn(
		spawnAction: NonNullable<AntRule['action']['spawn']>,
		parentAnt: AntState,
		context: VariableContext,
		spawnCallback: SpawnCallback
	): void {
		// Calculate spawn position based on direction
		const { direction } = spawnAction;
		let spawnX = parentAnt.x;
		let spawnY = parentAnt.y;

		// Apply direction offset
		switch (direction) {
			case 'up':
				spawnY--;
				break;
			case 'down':
				spawnY++;
				break;
			case 'left':
				spawnX--;
				break;
			case 'right':
				spawnX++;
				break;
			case 'up-left':
				spawnX--;
				spawnY--;
				break;
			case 'up-right':
				spawnX++;
				spawnY--;
				break;
			case 'down-left':
				spawnX--;
				spawnY++;
				break;
			case 'down-right':
				spawnX++;
				spawnY++;
				break;
		}

		// Prepare initial state for spawned ant
		const defaultState: Partial<AntState> = {
			r: parentAnt.r,
			g: parentAnt.g,
			b: parentAnt.b,
			direction: parentAnt.direction,
			rules: parentAnt.rules // Inherit parent's rules
		};

		// Override with specified ant state if provided
		if (spawnAction.antState) {
			const resolvedAntState = this.resolveVariableReferences(spawnAction.antState, context);
			Object.assign(defaultState, resolvedAntState);
		}

		// Call spawn callback to create the new ant
		spawnCallback(spawnX, spawnY, defaultState);
	}

	/**
	 * Validate rule structure
	 */
	public static validateRule(rule: any): boolean {
		if (!rule || typeof rule !== 'object') return false;
		if (!rule.action) return false; // Action is required, condition is optional
		
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

	/**
	 * Enable or disable variable debugging
	 */
	public static setDebugVariables(enabled: boolean): void {
		// Debug functionality can be enabled when needed for testing
		if (enabled) {
			console.log('Variable debugging enabled - for development use only');
		}
	}
} 