import { Simulation } from './Simulation.js';
import { Ant } from './Ant.js';

/**
 * UI class manages user interface elements and controls
 */
export class UI {
	private simulation: Simulation;
	private rulesPanel: HTMLElement | null = null;
	private rulesTextarea: HTMLTextAreaElement | null = null;
	private controlsPanel: HTMLElement | null = null;
	private speedSlider: HTMLInputElement | null = null;
	private playPauseButton: HTMLButtonElement | null = null;
	private stepButton: HTMLButtonElement | null = null;
	private clearButton: HTMLButtonElement | null = null;

	constructor(simulation: Simulation) {
		this.simulation = simulation;
		this.createUI();
		this.setupEventListeners();
	}

	/**
	 * Create UI elements
	 */
	private createUI(): void {
		this.createControlsPanel();
		this.createRulesPanel();
	}

	/**
	 * Create controls panel
	 */
	private createControlsPanel(): void {
		this.controlsPanel = document.createElement('div');
		this.controlsPanel.className = 'controls-panel';
		this.controlsPanel.innerHTML = `
			<div class="controls-header">
				<h3>Grid Life Controls</h3>
			</div>
			<div class="controls-content">
				<div class="control-group">
					<label for="speed-slider">Speed (ms):</label>
					<input type="range" id="speed-slider" min="50" max="2000" value="500" step="50">
					<span id="speed-value">500</span>
				</div>
				<div class="control-group">
					<button id="play-pause-btn">Play</button>
					<button id="step-btn">Step</button>
					<button id="clear-btn">Clear</button>
				</div>
				<div class="instructions">
					<p><strong>Controls:</strong></p>
					<ul>
						<li>Left click: Place ant</li>
						<li>Right drag: Pan view</li>
						<li>Scroll: Zoom in/out</li>
						<li>Click ant: Select & edit rules</li>
					</ul>
				</div>
			</div>
		`;

		document.body.appendChild(this.controlsPanel);

		// Get references to elements
		this.speedSlider = document.getElementById('speed-slider') as HTMLInputElement;
		this.playPauseButton = document.getElementById('play-pause-btn') as HTMLButtonElement;
		this.stepButton = document.getElementById('step-btn') as HTMLButtonElement;
		this.clearButton = document.getElementById('clear-btn') as HTMLButtonElement;
	}

	/**
	 * Create rules editor panel
	 */
	private createRulesPanel(): void {
		this.rulesPanel = document.createElement('div');
		this.rulesPanel.className = 'rules-panel hidden';
		this.rulesPanel.innerHTML = `
			<div class="rules-header">
				<h3>Ant Rules Editor</h3>
				<button id="close-rules">×</button>
			</div>
			<div class="rules-content">
				<p>Edit the JSON rules for the selected ant:</p>
				<textarea id="rules-textarea" rows="15" cols="50" placeholder="Enter JSON rules..."></textarea>
				<div class="rules-actions">
					<button id="apply-rules">Apply</button>
					<button id="reset-rules">Reset</button>
				</div>
				<div class="rules-help">
					<p><strong>Example rule:</strong></p>
					<pre>{
  "condition": {
    "cellState": { "r": 240, "g": 240, "b": 240 }
  },
  "action": {
    "setCellState": { "r": 100, "g": 100, "b": 100 },
    "move": true
  }
}</pre>
				</div>
			</div>
		`;

		document.body.appendChild(this.rulesPanel);

		// Get references to elements
		this.rulesTextarea = document.getElementById('rules-textarea') as HTMLTextAreaElement;
	}

	/**
	 * Set up event listeners
	 */
	private setupEventListeners(): void {
		// Speed slider
		if (this.speedSlider) {
			this.speedSlider.addEventListener('input', (e) => {
				const speed = parseInt((e.target as HTMLInputElement).value);
				this.simulation.setSpeed(speed);
				const speedValue = document.getElementById('speed-value');
				if (speedValue) {
					speedValue.textContent = speed.toString();
				}
			});
		}

		// Play/Pause button
		if (this.playPauseButton) {
			this.playPauseButton.addEventListener('click', () => {
				this.simulation.toggle();
				this.updatePlayPauseButton();
			});
		}

		// Step button
		if (this.stepButton) {
			this.stepButton.addEventListener('click', () => {
				this.simulation.step();
			});
		}

		// Clear button
		if (this.clearButton) {
			this.clearButton.addEventListener('click', () => {
				this.simulation.clearAnts();
				this.hideRulesPanel();
			});
		}

		// Rules panel close button
		const closeRulesButton = document.getElementById('close-rules');
		if (closeRulesButton) {
			closeRulesButton.addEventListener('click', () => {
				this.hideRulesPanel();
			});
		}

		// Apply rules button
		const applyRulesButton = document.getElementById('apply-rules');
		if (applyRulesButton) {
			applyRulesButton.addEventListener('click', () => {
				this.applyRules();
			});
		}

		// Reset rules button
		const resetRulesButton = document.getElementById('reset-rules');
		if (resetRulesButton) {
			resetRulesButton.addEventListener('click', () => {
				this.resetRules();
			});
		}
	}

	/**
	 * Show rules panel for selected ant
	 */
	public showRulesPanel(ant: Ant): void {
		if (this.rulesPanel && this.rulesTextarea) {
			this.rulesTextarea.value = ant.getState().rules;
			this.rulesPanel.classList.remove('hidden');
		}
	}

	/**
	 * Hide rules panel
	 */
	public hideRulesPanel(): void {
		if (this.rulesPanel) {
			this.rulesPanel.classList.add('hidden');
		}
		this.simulation.deselectAllAnts();
	}

	/**
	 * Apply rules from textarea to selected ant
	 */
	private applyRules(): void {
		const selectedAnt = this.simulation.getSelectedAnt();
		if (selectedAnt && this.rulesTextarea) {
			try {
				// Validate JSON
				JSON.parse(this.rulesTextarea.value);
				selectedAnt.setRules(this.rulesTextarea.value);
				this.showMessage('Rules applied successfully!', 'success');
			} catch (e) {
				this.showMessage('Invalid JSON format. Please check your rules.', 'error');
			}
		}
	}

	/**
	 * Reset rules for selected ant
	 */
	private resetRules(): void {
		const selectedAnt = this.simulation.getSelectedAnt();
		if (selectedAnt && this.rulesTextarea) {
			const defaultRules = JSON.stringify([
				{
					condition: {},
					action: {
						move: true
					}
				}
			], null, 2);
			
			selectedAnt.setRules(defaultRules);
			this.rulesTextarea.value = defaultRules;
			this.showMessage('Rules reset to default.', 'info');
		}
	}

	/**
	 * Update play/pause button text
	 */
	private updatePlayPauseButton(): void {
		if (this.playPauseButton) {
			this.playPauseButton.textContent = this.simulation.isRunning() ? 'Pause' : 'Play';
		}
	}

	/**
	 * Show a temporary message
	 */
	private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
		const messageDiv = document.createElement('div');
		messageDiv.className = `message message-${type}`;
		messageDiv.textContent = message;
		messageDiv.style.cssText = `
			position: fixed;
			top: 20px;
			left: 50%;
			transform: translateX(-50%);
			padding: 10px 20px;
			border-radius: 4px;
			color: white;
			font-weight: bold;
			z-index: 1000;
			transition: opacity 0.3s ease;
		`;

		switch (type) {
			case 'success':
				messageDiv.style.backgroundColor = '#4CAF50';
				break;
			case 'error':
				messageDiv.style.backgroundColor = '#f44336';
				break;
			case 'info':
				messageDiv.style.backgroundColor = '#2196F3';
				break;
		}

		document.body.appendChild(messageDiv);

		setTimeout(() => {
			messageDiv.style.opacity = '0';
			setTimeout(() => {
				document.body.removeChild(messageDiv);
			}, 300);
		}, 2000);
	}

	/**
	 * Update UI state
	 */
	public update(): void {
		this.updatePlayPauseButton();
	}
} 