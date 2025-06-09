import { Grid } from './classes/Grid.js';
import { Camera } from './classes/Camera.js';
import { Ant } from './classes/Ant.js';
import { Simulation } from './classes/Simulation.js';
import { UI } from './classes/UI.js';

/**
 * Main application class that coordinates all components
 */
class GridLifeApp {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private grid: Grid;
	private camera: Camera;
	private simulation: Simulation;
	private ui: UI;
	private animationId: number | null = null;

	constructor() {
		this.canvas = this.createCanvas();
		this.ctx = this.canvas.getContext('2d')!;
		this.grid = new Grid(20); // 20px grid cells
		this.camera = new Camera(this.canvas);
		this.simulation = new Simulation(this.grid);
		this.ui = new UI(this.simulation);

		this.setupEventListeners();
		this.setupSimulation();
		this.startRenderLoop();
		this.resizeCanvas();
	}

	/**
	 * Create and setup canvas element
	 */
	private createCanvas(): HTMLCanvasElement {
		const canvas = document.createElement('canvas');
		canvas.id = 'canvas';
		document.body.appendChild(canvas);
		return canvas;
	}

	/**
	 * Setup event listeners for canvas interactions
	 */
	private setupEventListeners(): void {
		// Left click to place ants or select existing ants
		this.canvas.addEventListener('click', (e) => {
			if (e.button === 0) { // Left mouse button
				e.preventDefault();
				const worldPos = this.camera.screenToWorld({ x: e.clientX, y: e.clientY });
				
				// Check if clicking on an existing ant
				const clickedAnt = this.simulation.getAntAtPosition(worldPos.x, worldPos.y);
				if (clickedAnt) {
					this.simulation.selectAnt(clickedAnt);
					this.ui.showRulesPanel(clickedAnt);
				} else {
					// Place new ant
					const gridPos = this.grid.worldToGrid(worldPos.x, worldPos.y);
					const ant = new Ant(gridPos.x, gridPos.y);
					this.simulation.addAnt(ant);
					this.ui.hideRulesPanel();
				}
			}
		});

		// Window resize
		window.addEventListener('resize', () => {
			this.resizeCanvas();
		});

		// Keyboard shortcuts
		document.addEventListener('keydown', (e) => {
			// Don't process shortcuts if user is typing in an input field
			const activeElement = document.activeElement;
			const isTyping = activeElement && (
				activeElement.tagName === 'INPUT' ||
				activeElement.tagName === 'TEXTAREA'
			);

			switch (e.code) {
				case 'Space':
					if (!isTyping) {
						e.preventDefault();
						this.simulation.toggle();
						this.ui.update();
					}
					break;
				case 'KeyS':
					if ((e.ctrlKey || e.metaKey) && !isTyping) {
						e.preventDefault();
						this.simulation.step();
					}
					break;
				case 'Escape':
					this.ui.hideRulesPanel();
					break;
			}
		});
	}

	/**
	 * Setup simulation callbacks
	 */
	private setupSimulation(): void {
		this.simulation.setOnStep(() => {
			// Render is handled by the animation loop
		});
	}

	/**
	 * Resize canvas to fill window
	 */
	private resizeCanvas(): void {
		const dpr = window.devicePixelRatio || 1;
		const rect = this.canvas.getBoundingClientRect();

		// Set actual size in memory (scaled to account for extra pixel density)
		this.canvas.width = rect.width * dpr;
		this.canvas.height = rect.height * dpr;

		// Scale the drawing context so everything will work at the higher resolution
		this.ctx.scale(dpr, dpr);

		// Set the size in CSS pixels
		this.canvas.style.width = window.innerWidth + 'px';
		this.canvas.style.height = window.innerHeight + 'px';

		// Update canvas dimensions for coordinate calculations
		this.canvas.width = window.innerWidth * dpr;
		this.canvas.height = window.innerHeight * dpr;
		this.canvas.style.width = window.innerWidth + 'px';
		this.canvas.style.height = window.innerHeight + 'px';
	}

	/**
	 * Start the render loop
	 */
	private startRenderLoop(): void {
		const render = () => {
			this.render();
			this.animationId = requestAnimationFrame(render);
		};
		render();
	}

	/**
	 * Main render function
	 */
	private render(): void {
		// Clear canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Set high DPI scaling
		const dpr = window.devicePixelRatio || 1;
		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		// Render grid
		this.grid.render(this.ctx, this.camera);

		// Render ants
		const ants = this.simulation.getAnts();
		for (const ant of ants) {
			ant.render(this.ctx, this.grid, this.camera);
		}

		// Draw zoom level indicator
		this.drawZoomIndicator();
	}

	/**
	 * Draw zoom level indicator
	 */
	private drawZoomIndicator(): void {
		const cameraState = this.camera.getState();
		const zoomText = `Zoom: ${(cameraState.zoom * 100).toFixed(0)}%`;
		
		this.ctx.save();
		this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
		this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
		this.ctx.font = '12px monospace';
		this.ctx.fillText(zoomText, 10, this.canvas.height - 20);
		this.ctx.restore();
	}

	/**
	 * Cleanup resources
	 */
	public destroy(): void {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
		}
		this.simulation.stop();
	}
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	new GridLifeApp();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
	// Cleanup would go here if needed
}); 