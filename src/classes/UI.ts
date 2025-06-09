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
				<div class="preset-section">
					<p><strong>Load Preset Behaviors:</strong></p>
					<div class="preset-buttons">
						<button class="preset-btn" data-preset="langton">🐜 Langton's Ant</button>
						<button class="preset-btn" data-preset="rainbow">🌈 Rainbow Trail</button>
						<button class="preset-btn" data-preset="colorMix">🎨 Color Mixer</button>
						<button class="preset-btn" data-preset="wallFollower">🧱 Wall Follower</button>
						<button class="preset-btn" data-preset="spiral">🌀 Spiral Builder</button>
						<button class="preset-btn" data-preset="heatSeeker">🔥 Heat Seeker</button>
						<button class="preset-btn" data-preset="gradient">🌄 Gradient Painter</button>
						<button class="preset-btn" data-preset="mathWave">📊 Math Wave</button>
						<button class="preset-btn" data-preset="averager">⚖️ Color Averager</button>
						<button class="preset-btn" data-preset="amplifier">🔆 Brightness Amplifier</button>
					</div>
				</div>
				<div class="rules-help">
					<p><strong>Quick Reference:</strong></p>
					<ul>
						<li><strong>Variables:</strong> "ant.r", "ant.g", "ant.b", "cell.r", "up.g", etc.</li>
						<li><strong>Math:</strong> "ant.r + 10", "(ant.r + cell.r) / 2", "ant.x % 50"</li>
						<li><strong>Tolerance:</strong> {"value": "ant.r", "tolerance": 50}</li>
						<li><strong>Turns:</strong> "left", "right", "reverse"</li>
						<li><strong>Logic:</strong> "or": [...], "and": [...]</li>
					</ul>
				</div>
			</div>
		`;

		document.body.appendChild(this.rulesPanel);

		// Get references to elements
		this.rulesTextarea = document.getElementById('rules-textarea') as HTMLTextAreaElement;

		// Add preset button event listeners
		this.setupPresetButtons();
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
	 * Set up preset button event listeners
	 */
	private setupPresetButtons(): void {
		const presetButtons = document.querySelectorAll('.preset-btn');
		presetButtons.forEach(button => {
			button.addEventListener('click', (e) => {
				const presetName = (e.target as HTMLElement).getAttribute('data-preset');
				if (presetName) {
					this.loadPreset(presetName);
				}
			});
		});
	}

	/**
	 * Load a preset rule set into the textarea
	 */
	private loadPreset(presetName: string): void {
		const presets = this.getPresetRules();
		const preset = presets[presetName];
		
		if (preset && this.rulesTextarea) {
			this.rulesTextarea.value = JSON.stringify(preset, null, 2);
			this.showMessage(`Loaded preset: ${this.getPresetDisplayName(presetName)}`, 'info');
		}
	}

	/**
	 * Get display name for preset
	 */
	private getPresetDisplayName(presetName: string): string {
		const names: { [key: string]: string } = {
			'langton': 'Langton\'s Ant',
			'rainbow': 'Rainbow Trail',
			'colorMix': 'Color Mixer',
			'wallFollower': 'Wall Follower',
			'spiral': 'Spiral Builder',
			'heatSeeker': 'Heat Seeker',
			'gradient': 'Gradient Painter',
			'mathWave': 'Math Wave',
			'averager': 'Color Averager',
			'amplifier': 'Brightness Amplifier'
		};
		return names[presetName] || presetName;
	}

	/**
	 * Get all preset rule definitions
	 */
	private getPresetRules(): { [key: string]: any[] } {
		return {
			langton: [
				{
					condition: {
						cellState: { r: 240, g: 240, b: 240 }
					},
					action: {
						setCellState: { r: 255, g: 0, b: 0 },
						turn: "right",
						move: true
					}
				},
				{
					condition: {
						cellState: { r: 255, g: 0, b: 0 }
					},
					action: {
						setCellState: { r: 240, g: 240, b: 240 },
						turn: "left",
						move: true
					}
				}
			],
			rainbow: [
				{
					action: {
						setCellState: { r: "ant.r", g: "ant.g", b: "ant.b" },
						setAntState: { 
							r: "ant.g", 
							g: "ant.b", 
							b: "ant.r" 
						},
						move: true
					}
				}
			],
			colorMix: [
				{
					action: {
						setCellState: {
							r: "up.r",
							g: "left.g", 
							b: "down.b"
						},
						setAntState: {
							r: "right.r",
							g: "up.g",
							b: "left.b"
						},
						turn: "right",
						move: true
					}
				}
			],
			wallFollower: [
				{
					condition: {
						and: [
							{ cellState: { r: 240, g: 240, b: 240 } },
							{ surroundingCells: { right: { r: 255, g: 0, b: 0 } } }
						]
					},
					action: {
						setCellState: { r: 255, g: 0, b: 0 },
						move: true
					}
				},
				{
					condition: {
						and: [
							{ cellState: { r: 240, g: 240, b: 240 } },
							{ surroundingCells: { right: { r: 240, g: 240, b: 240 } } }
						]
					},
					action: {
						setCellState: { r: 255, g: 0, b: 0 },
						turn: "right",
						move: true
					}
				},
				{
					condition: {
						cellState: { r: 255, g: 0, b: 0 }
					},
					action: {
						turn: "left",
						move: true
					}
				},
				{
					action: {
						turn: "right",
						move: true
					}
				}
			],
			spiral: [
				{
					condition: {
						surroundingCells: { right: { r: 255, g: 0, b: 0 } }
					},
					action: {
						setCellState: { r: 255, g: 0, b: 0 },
						turn: "left",
						move: true
					}
				},
				{
					condition: {
						surroundingCells: { up: { r: 255, g: 0, b: 0 } }
					},
					action: {
						setCellState: { r: 255, g: 0, b: 0 },
						turn: "right",
						move: true
					}
				},
				{
					action: {
						setCellState: { r: 255, g: 0, b: 0 },
						move: true
					}
				}
			],
			heatSeeker: [
				{
					condition: {
						or: [
							{ surroundingCells: { up: { r: { value: 200, tolerance: 55 } } } },
							{ surroundingCells: { down: { r: { value: 200, tolerance: 55 } } } },
							{ surroundingCells: { left: { r: { value: 200, tolerance: 55 } } } },
							{ surroundingCells: { right: { r: { value: 200, tolerance: 55 } } } }
						]
					},
					action: {
						setCellState: { r: 255, g: 100, b: 0 },
						move: true
					}
				},
				{
					condition: {
						cellState: { r: { value: 50, tolerance: 50 } }
					},
					action: {
						turn: "reverse",
						move: true
					}
				},
				{
					action: {
						setCellState: { r: 150, g: 150, b: 150 },
						turn: "right",
						move: true
					}
				}
			],
			gradient: [
				{
					condition: {
						antState: { x: { value: 0, tolerance: 10 } }
					},
					action: {
						setCellState: { r: 255, g: 0, b: 0 },
						setAntState: { r: 255, g: 0, b: 0 },
						turn: "right",
						move: true
					}
				},
				{
					condition: {
						antState: { x: { value: 20, tolerance: 10 } }
					},
					action: {
						setCellState: { r: 0, g: 255, b: 0 },
						setAntState: { r: 0, g: 255, b: 0 },
						turn: "right",
						move: true
					}
				},
				{
					action: {
						setCellState: { 
							r: { value: "ant.r", tolerance: 20 },
							g: { value: "ant.g", tolerance: 20 },
							b: { value: "ant.b", tolerance: 20 }
						},
						move: true
					}
				}
			],
			mathWave: [
				{
					action: {
						setCellState: {
							r: "ant.x % 50 * 5",
							g: "ant.y % 30 * 8",
							b: "(ant.x + ant.y) % 40 * 6"
						},
						setAntState: {
							r: "(ant.r + 10) % 255",
							g: "(ant.g + 15) % 255",
							b: "(ant.b + 5) % 255"
						},
						move: true
					}
				}
			],
			averager: [
				{
					action: {
						setCellState: {
							r: "(up.r + down.r + left.r + right.r) / 4",
							g: "(up.g + down.g + left.g + right.g) / 4", 
							b: "(up.b + down.b + left.b + right.b) / 4"
						},
						move: true
					}
				}
			],
			amplifier: [
				{
					condition: {
						cellState: {
							r: { value: "ant.r / 2", tolerance: 10 }
						}
					},
					action: {
						setCellState: {
							r: "cell.r * 2",
							g: "cell.g * 2",
							b: "cell.b * 2"
						},
						move: true
					}
				},
				{
					action: {
						setCellState: {
							r: "ant.r + 5",
							g: "ant.g + 5", 
							b: "ant.b + 5"
						},
						turn: "right",
						move: true
					}
				}
			]
		};
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
					condition: {
						cellState: { r: 240, g: 240, b: 240 }
					},
					action: {
						setCellState: { r: 255, g: 0, b: 0 },
						turn: "right",
						move: true
					}
				},
				{
					condition: {
						cellState: { r: "ant.r" }
					},
					action: {
						setCellState: { r: 240, g: 240, b: 240 },
						turn: "left",
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