/**
 * Core type definitions for Grid Life simulation
 */

export type Direction = 'up' | 'down' | 'left' | 'right';
export type Turn = 'left' | 'right' | 'reverse';
export type SurroundingDirection = 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';

// Enhanced variable reference system
export interface VariableRef {
	value: string | number; // e.g., "ant.r", "cell.g", "ant.r + 10", "ant.r * ant.g", etc., or direct numeric value
	tolerance?: number; // for numeric values, tolerance for range matching
}

// Allow either direct values, variable references, or variable refs with tolerance
export type ConditionValue = number | string | VariableRef;

// Enhanced condition system with OR/AND groups
export interface BaseCondition {
	antState?: { [key: string]: ConditionValue };
	cellState?: { [key: string]: ConditionValue };
	surroundingCells?: { [key: string]: { [key: string]: ConditionValue } };
}

export interface ConditionGroup {
	or?: BaseCondition[]; // Any condition in array must match
	and?: BaseCondition[]; // All conditions in array must match
}

export type EnhancedCondition = BaseCondition | ConditionGroup;

export interface Point {
	x: number;
	y: number;
}

export interface RGBColor {
	r: number; // 0-255
	g: number; // 0-255
	b: number; // 0-255
}

export interface CellState extends RGBColor {}

export interface AntState extends RGBColor {
	id: string;
	x: number;
	y: number;
	direction: Direction;
	rules: string; // JSON rules
}

export interface GridState {
	cells: Map<string, CellState>;
	ants: Map<string, AntState>;
}

export interface CameraState {
	x: number;
	y: number;
	zoom: number;
}

// Enhanced rule structure
export interface AntRule {
	condition?: EnhancedCondition; // Optional - rules without conditions always execute
	action: {
		setAntState?: { [key: string]: ConditionValue };
		setCellState?: { [key: string]: ConditionValue };
		turn?: Turn;
		move?: boolean;
	};
}

export interface SimulationSettings {
	speed: number; // milliseconds between updates
	isRunning: boolean;
}

// Context for variable resolution
export interface VariableContext {
	ant: AntState;
	cell: CellState;
	surrounding: { [key: string]: CellState };
} 