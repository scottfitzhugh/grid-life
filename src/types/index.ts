/**
 * Core type definitions for Grid Life simulation
 */

export type Direction = 'up' | 'down' | 'left' | 'right';

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
		antState?: Partial<AntState>;
		cellState?: Partial<CellState>;
		surroundingCells?: { [key: string]: Partial<CellState> };
	};
	action: {
		setAntState?: Partial<AntState>;
		setCellState?: Partial<CellState>;
		move?: boolean;
	};
}

export interface SimulationSettings {
	speed: number; // milliseconds between updates
	isRunning: boolean;
} 