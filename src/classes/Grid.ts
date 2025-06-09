import { CellState, RGBColor } from '../types/index.js';
import { Camera } from './Camera.js';

/**
 * Grid class manages the infinite grid of cells and their states
 */
export class Grid {
	private cells: Map<string, CellState> = new Map();
	private cellSize: number = 20; // Size of each grid cell in pixels
	private defaultCellColor: RGBColor = { r: 240, g: 240, b: 240 }; // Light gray

	constructor(cellSize: number = 20) {
		this.cellSize = cellSize;
	}

	/**
	 * Get cell state at given coordinates
	 */
	public getCellState(x: number, y: number): CellState {
		const key = this.getCellKey(x, y);
		return this.cells.get(key) || { ...this.defaultCellColor };
	}

	/**
	 * Set cell state at given coordinates
	 */
	public setCellState(x: number, y: number, state: CellState): void {
		const key = this.getCellKey(x, y);
		this.cells.set(key, { ...state });
	}

	/**
	 * Get surrounding cell states (8 neighbors)
	 */
	public getSurroundingCells(x: number, y: number): { [key: string]: CellState } {
		return {
			'up': this.getCellState(x, y - 1),
			'up-right': this.getCellState(x + 1, y - 1),
			'right': this.getCellState(x + 1, y),
			'down-right': this.getCellState(x + 1, y + 1),
			'down': this.getCellState(x, y + 1),
			'down-left': this.getCellState(x - 1, y + 1),
			'left': this.getCellState(x - 1, y),
			'up-left': this.getCellState(x - 1, y - 1)
		};
	}

	/**
	 * Convert world coordinates to grid coordinates
	 */
	public worldToGrid(worldX: number, worldY: number): { x: number; y: number } {
		return {
			x: Math.floor(worldX / this.cellSize),
			y: Math.floor(worldY / this.cellSize)
		};
	}

	/**
	 * Convert grid coordinates to world coordinates (center of cell)
	 */
	public gridToWorld(gridX: number, gridY: number): { x: number; y: number } {
		return {
			x: gridX * this.cellSize + this.cellSize / 2,
			y: gridY * this.cellSize + this.cellSize / 2
		};
	}

	/**
	 * Render the grid
	 */
	public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
		const bounds = camera.getVisibleBounds();
		
		// Calculate visible grid range
		const startX = Math.floor(bounds.left / this.cellSize);
		const endX = Math.ceil(bounds.right / this.cellSize);
		const startY = Math.floor(bounds.top / this.cellSize);
		const endY = Math.ceil(bounds.bottom / this.cellSize);

		// Apply camera transform
		camera.applyTransform(ctx);

		// Draw cells
		for (let x = startX; x <= endX; x++) {
			for (let y = startY; y <= endY; y++) {
				const cellState = this.getCellState(x, y);
				const worldPos = this.gridToWorld(x, y);

				// Draw cell background
				ctx.fillStyle = this.rgbToString(cellState);
				ctx.fillRect(
					worldPos.x - this.cellSize / 2,
					worldPos.y - this.cellSize / 2,
					this.cellSize,
					this.cellSize
				);

				// Draw grid lines
				ctx.strokeStyle = '#ccc';
				ctx.lineWidth = 1 / camera.getState().zoom; // Scale line width with zoom
				ctx.strokeRect(
					worldPos.x - this.cellSize / 2,
					worldPos.y - this.cellSize / 2,
					this.cellSize,
					this.cellSize
				);
			}
		}
	}

	/**
	 * Get cell size
	 */
	public getCellSize(): number {
		return this.cellSize;
	}

	/**
	 * Convert RGB color to CSS string
	 */
	private rgbToString(color: RGBColor): string {
		return `rgb(${Math.floor(color.r)}, ${Math.floor(color.g)}, ${Math.floor(color.b)})`;
	}

	/**
	 * Generate cell key from coordinates
	 */
	private getCellKey(x: number, y: number): string {
		return `${x},${y}`;
	}

	/**
	 * Clear all cells (reset to default state)
	 */
	public clear(): void {
		this.cells.clear();
	}

	/**
	 * Get all modified cells (for debugging/serialization)
	 */
	public getModifiedCells(): Map<string, CellState> {
		return new Map(this.cells);
	}
} 