/**
 * Core type definitions for Grid Life simulation
 */

export type Direction = 'up' | 'down' | 'left' | 'right';
export type Turn = 'left' | 'right' | 'reverse';

// Variable reference with optional tolerance for ranges
export interface VariableRef {
	value: string; // e.g., "ant.r", "ant.g", "ant.b", "ant.direction"
	tolerance?: number; // for numeric values, tolerance for range matching
}

// Allow either direct values, variable references, or variable refs with tolerance
export type ConditionValue = number | string | VariableRef;

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

export interface AntRule {
	condition: {
		antState?: { [key: string]: ConditionValue };
		cellState?: { [key: string]: ConditionValue };
		surroundingCells?: { [key: string]: { [key: string]: ConditionValue } };
	};
	action: {
		setAntState?: Partial<AntState>;
		setCellState?: Partial<CellState>;
		turn?: Turn;
		move?: boolean;
	};
}

export interface SimulationSettings {
	speed: number; // milliseconds between updates
	isRunning: boolean;
} 