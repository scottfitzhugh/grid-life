import { Point, CameraState } from '../types/index.js';

/**
 * Camera class handles viewport transformation, zoom, and pan operations
 */
export class Camera {
	private state: CameraState;
	private canvas: HTMLCanvasElement;
	private isDragging: boolean = false;
	private lastMousePos: Point = { x: 0, y: 0 };

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.state = {
			x: 0,
			y: 0,
			zoom: 1
		};

		this.setupEventListeners();
	}

	/**
	 * Set up mouse event listeners for pan and zoom
	 */
	private setupEventListeners(): void {
		// Mouse wheel for zoom
		this.canvas.addEventListener('wheel', (e) => {
			e.preventDefault();
			const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
			this.zoom(zoomFactor, { x: e.clientX, y: e.clientY });
		});

		// Right mouse button for panning
		this.canvas.addEventListener('mousedown', (e) => {
			if (e.button === 2) { // Right mouse button
				e.preventDefault();
				this.isDragging = true;
				this.lastMousePos = { x: e.clientX, y: e.clientY };
				this.canvas.style.cursor = 'grabbing';
			}
		});

		this.canvas.addEventListener('mousemove', (e) => {
			if (this.isDragging) {
				const deltaX = e.clientX - this.lastMousePos.x;
				const deltaY = e.clientY - this.lastMousePos.y;
				this.pan(deltaX, deltaY);
				this.lastMousePos = { x: e.clientX, y: e.clientY };
			}
		});

		this.canvas.addEventListener('mouseup', (e) => {
			if (e.button === 2) {
				this.isDragging = false;
				this.canvas.style.cursor = 'default';
			}
		});

		// Disable context menu on right click
		this.canvas.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		});
	}

	/**
	 * Zoom the camera by a factor around a point
	 */
	public zoom(factor: number, center: Point): void {
		const worldCenter = this.screenToWorld(center);
		this.state.zoom *= factor;
		this.state.zoom = Math.max(0.1, Math.min(10, this.state.zoom)); // Limit zoom range

		// Adjust position to keep the center point fixed
		const newWorldCenter = this.screenToWorld(center);
		this.state.x += (worldCenter.x - newWorldCenter.x);
		this.state.y += (worldCenter.y - newWorldCenter.y);
	}

	/**
	 * Pan the camera by screen-space pixels
	 */
	public pan(deltaX: number, deltaY: number): void {
		this.state.x -= deltaX / this.state.zoom;
		this.state.y -= deltaY / this.state.zoom;
	}

	/**
	 * Convert screen coordinates to world coordinates
	 */
	public screenToWorld(screenPos: Point): Point {
		return {
			x: (screenPos.x - this.canvas.width / 2) / this.state.zoom + this.state.x,
			y: (screenPos.y - this.canvas.height / 2) / this.state.zoom + this.state.y
		};
	}

	/**
	 * Convert world coordinates to screen coordinates
	 */
	public worldToScreen(worldPos: Point): Point {
		return {
			x: (worldPos.x - this.state.x) * this.state.zoom + this.canvas.width / 2,
			y: (worldPos.y - this.state.y) * this.state.zoom + this.canvas.height / 2
		};
	}

	/**
	 * Apply camera transformation to canvas context
	 */
	public applyTransform(ctx: CanvasRenderingContext2D): void {
		ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
		ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
		ctx.scale(this.state.zoom, this.state.zoom);
		ctx.translate(-this.state.x, -this.state.y);
	}

	/**
	 * Get the current camera state
	 */
	public getState(): CameraState {
		return { ...this.state };
	}

	/**
	 * Get the visible world bounds
	 */
	public getVisibleBounds(): { left: number; right: number; top: number; bottom: number } {
		const topLeft = this.screenToWorld({ x: 0, y: 0 });
		const bottomRight = this.screenToWorld({ x: this.canvas.width, y: this.canvas.height });

		return {
			left: topLeft.x,
			right: bottomRight.x,
			top: topLeft.y,
			bottom: bottomRight.y
		};
	}
} 