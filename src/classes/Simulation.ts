import { SimulationSettings } from '../types/index.js';
import { Grid } from './Grid.js';
import { Ant } from './Ant.js';

/**
 * Simulation class manages the game loop and ant behavior execution
 */
export class Simulation {
	private grid: Grid;
	private ants: Map<string, Ant> = new Map();
	private settings: SimulationSettings;
	private intervalId: number | null = null;
	private onStep?: () => void;

	constructor(grid: Grid) {
		this.grid = grid;
		this.settings = {
			speed: 500, // milliseconds between steps
			isRunning: false
		};
	}

	/**
	 * Add an ant to the simulation
	 */
	public addAnt(ant: Ant): void {
		this.ants.set(ant.getState().id, ant);
	}

	/**
	 * Remove an ant from the simulation
	 */
	public removeAnt(antId: string): void {
		this.ants.delete(antId);
	}

	/**
	 * Get all ants
	 */
	public getAnts(): Ant[] {
		return Array.from(this.ants.values());
	}

	/**
	 * Get ant by ID
	 */
	public getAnt(antId: string): Ant | undefined {
		return this.ants.get(antId);
	}

	/**
	 * Find ant at world coordinates
	 */
	public getAntAtPosition(worldX: number, worldY: number): Ant | undefined {
		for (const ant of this.ants.values()) {
			if (ant.containsPoint(worldX, worldY, this.grid)) {
				return ant;
			}
		}
		return undefined;
	}

	/**
	 * Start the simulation
	 */
	public start(): void {
		if (this.intervalId !== null) {
			return; // Already running
		}

		this.settings.isRunning = true;
		this.intervalId = window.setInterval(() => {
			this.step();
		}, this.settings.speed);
	}

	/**
	 * Stop the simulation
	 */
	public stop(): void {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		this.settings.isRunning = false;
	}

	/**
	 * Toggle simulation running state
	 */
	public toggle(): void {
		if (this.settings.isRunning) {
			this.stop();
		} else {
			this.start();
		}
	}

	/**
	 * Execute one simulation step
	 */
	public step(): void {
		// Execute each ant's behavior
		for (const ant of this.ants.values()) {
			ant.step(this.grid);
		}

		// Notify observers
		if (this.onStep) {
			this.onStep();
		}
	}

	/**
	 * Set simulation speed
	 */
	public setSpeed(speed: number): void {
		this.settings.speed = Math.max(50, Math.min(2000, speed)); // Clamp between 50ms and 2s
		
		// Restart with new speed if running
		if (this.settings.isRunning) {
			this.stop();
			this.start();
		}
	}

	/**
	 * Get simulation speed
	 */
	public getSpeed(): number {
		return this.settings.speed;
	}

	/**
	 * Check if simulation is running
	 */
	public isRunning(): boolean {
		return this.settings.isRunning;
	}

	/**
	 * Set step callback
	 */
	public setOnStep(callback: () => void): void {
		this.onStep = callback;
	}

	/**
	 * Clear all ants
	 */
	public clearAnts(): void {
		this.ants.clear();
	}

	/**
	 * Get simulation settings
	 */
	public getSettings(): SimulationSettings {
		return { ...this.settings };
	}

	/**
	 * Deselect all ants
	 */
	public deselectAllAnts(): void {
		for (const ant of this.ants.values()) {
			ant.setSelected(false);
		}
	}

	/**
	 * Get selected ant
	 */
	public getSelectedAnt(): Ant | undefined {
		for (const ant of this.ants.values()) {
			if (ant.isSelected()) {
				return ant;
			}
		}
		return undefined;
	}

	/**
	 * Select ant and deselect others
	 */
	public selectAnt(ant: Ant): void {
		this.deselectAllAnts();
		ant.setSelected(true);
	}
} 