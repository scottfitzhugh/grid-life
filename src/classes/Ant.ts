import { AntState, Direction, AntRule, RGBColor, Turn } from '../types/index.js';
import { Grid } from './Grid.js';
import { Camera } from './Camera.js';
import { AntLogicEngine } from './AntLogicEngine.js';

/**
 * Ant class represents individual ants with state and behavior rules
 */
export class Ant {
	private state: AntState;
	private selected: boolean = false;

	constructor(x: number, y: number, id?: string) {
		this.state = {
			id: id || this.generateId(),
			x,
			y,
			direction: 'up',
			r: 255,
			g: 0,
			b: 0,
			rules: JSON.stringify([
				{
					condition: {
						cellState: { r: 240, g: 240, b: 240 }
					},
					action: {
						setCellState: { r: "ant.r", g: "ant.g", b: "ant.b" },
						turn: "right",
						move: true
					}
				},
				{
					condition: {
						cellState: { r: "ant.r", g: "ant.g", b: "ant.b" }
					},
					action: {
						setCellState: { r: 240, g: 240, b: 240 },
						turn: "left",
						move: true
					}
				}
			], null, 2)
		};
	}

	/**
	 * Get ant state
	 */
	public getState(): AntState {
		return { ...this.state };
	}

	/**
	 * Set ant state
	 */
	public setState(newState: Partial<AntState>): void {
		this.state = { ...this.state, ...newState };
		// Clamp RGB values
		this.state.r = Math.max(0, Math.min(255, this.state.r));
		this.state.g = Math.max(0, Math.min(255, this.state.g));
		this.state.b = Math.max(0, Math.min(255, this.state.b));
		
		// Validate direction
		if (newState.direction && !['up', 'down', 'left', 'right'].includes(newState.direction)) {
			console.warn(`Invalid direction: ${newState.direction}. Keeping current direction: ${this.state.direction}`);
			this.state.direction = this.state.direction; // Keep current direction
		}
	}

	/**
	 * Get ant rules as parsed JSON
	 */
	public getRules(): AntRule[] {
		return AntLogicEngine.parseRules(this.state.rules);
	}

	/**
	 * Set ant rules from JSON string
	 */
	public setRules(rules: string): void {
		this.state.rules = rules;
	}

	/**
	 * Execute ant behavior based on rules using enhanced logic engine
	 */
	public step(grid: Grid): void {
		const rules = this.getRules();
		AntLogicEngine.executeRules(this.state, rules, grid);
	}

	/**
	 * Render the ant
	 */
	public render(ctx: CanvasRenderingContext2D, grid: Grid, camera: Camera): void {
		camera.applyTransform(ctx);

		const worldPos = grid.gridToWorld(this.state.x, this.state.y);
		const cellSize = grid.getCellSize();
		const antRadius = (cellSize * 0.75) / 2; // 3/4 of cell diameter

		// Draw ant body
		ctx.fillStyle = this.rgbToString(this.state);
		ctx.beginPath();
		ctx.arc(worldPos.x, worldPos.y, antRadius, 0, 2 * Math.PI);
		ctx.fill();

		// Draw selection indicator
		if (this.selected) {
			ctx.strokeStyle = '#ffff00'; // Yellow selection ring
			ctx.lineWidth = 2 / camera.getState().zoom;
			ctx.beginPath();
			ctx.arc(worldPos.x, worldPos.y, antRadius + 3, 0, 2 * Math.PI);
			ctx.stroke();
		}

		// Draw direction indicator
		ctx.fillStyle = '#ffffff';
		const dirOffset = antRadius * 0.5;
		let dirX = worldPos.x;
		let dirY = worldPos.y;

		switch (this.state.direction) {
			case 'up':
				dirY -= dirOffset;
				break;
			case 'down':
				dirY += dirOffset;
				break;
			case 'left':
				dirX -= dirOffset;
				break;
			case 'right':
				dirX += dirOffset;
				break;
		}

		ctx.beginPath();
		ctx.arc(dirX, dirY, 2, 0, 2 * Math.PI);
		ctx.fill();
	}

	/**
	 * Check if point is inside ant (for selection)
	 */
	public containsPoint(worldX: number, worldY: number, grid: Grid): boolean {
		const worldPos = grid.gridToWorld(this.state.x, this.state.y);
		const cellSize = grid.getCellSize();
		const antRadius = (cellSize * 0.75) / 2;

		const dx = worldX - worldPos.x;
		const dy = worldY - worldPos.y;
		return Math.sqrt(dx * dx + dy * dy) <= antRadius;
	}

	/**
	 * Set selection state
	 */
	public setSelected(selected: boolean): void {
		this.selected = selected;
	}

	/**
	 * Get selection state
	 */
	public isSelected(): boolean {
		return this.selected;
	}

	/**
	 * Convert RGB to CSS string
	 */
	private rgbToString(color: RGBColor): string {
		return `rgb(${Math.floor(color.r)}, ${Math.floor(color.g)}, ${Math.floor(color.b)})`;
	}

	/**
	 * Turn relative to current direction
	 */
	public turn(turn: Turn): void {
		const directions: Direction[] = ['up', 'right', 'down', 'left'];
		const currentIndex = directions.indexOf(this.state.direction);
		
		switch (turn) {
			case 'right':
				this.state.direction = directions[(currentIndex + 1) % 4];
				break;
			case 'left':
				this.state.direction = directions[(currentIndex + 3) % 4]; // +3 is same as -1 with wrap
				break;
			case 'reverse':
				this.state.direction = directions[(currentIndex + 2) % 4]; // Turn around 180 degrees
				break;
		}
	}

	/**
	 * Get direction after turning
	 */
	public getDirectionAfterTurn(turn: Turn): Direction {
		const directions: Direction[] = ['up', 'right', 'down', 'left'];
		const currentIndex = directions.indexOf(this.state.direction);
		
		switch (turn) {
			case 'right':
				return directions[(currentIndex + 1) % 4];
			case 'left':
				return directions[(currentIndex + 3) % 4]; // +3 is same as -1 with wrap
			case 'reverse':
				return directions[(currentIndex + 2) % 4]; // Turn around 180 degrees
		}
	}

	/**
	 * Generate unique ID
	 */
	private generateId(): string {
		return `ant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
} 