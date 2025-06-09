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
					<button id="gui-builder">🔧 Visual Builder</button>
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
						<button class="preset-btn" data-preset="spawner">🐣 Ant Spawner</button>
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

		// Create GUI builder modal
		this.createGUIBuilder();
	}

	/**
	 * Create GUI rule builder modal
	 */
	private createGUIBuilder(): void {
		const builderModal = document.createElement('div');
		builderModal.id = 'gui-builder-modal';
		builderModal.className = 'modal hidden';
		builderModal.innerHTML = `
			<div class="modal-content">
				<div class="modal-header">
					<h3>Visual Rule Builder</h3>
					<button id="close-builder">×</button>
				</div>
				<div class="modal-body">
					<div class="builder-section">
						<h4>Rules</h4>
						<div id="rules-list">
							<!-- Rules will be added dynamically -->
						</div>
						<button id="add-rule" class="add-btn">+ Add Rule</button>
					</div>
				</div>
				<div class="modal-footer">
					<button id="builder-generate">Generate JSON</button>
					<button id="builder-cancel">Cancel</button>
				</div>
			</div>
		`;

		document.body.appendChild(builderModal);
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

		// GUI builder button
		const guiBuilderButton = document.getElementById('gui-builder');
		if (guiBuilderButton) {
			guiBuilderButton.addEventListener('click', () => {
				this.showGUIBuilder();
			});
		}

		// GUI builder modal events
		this.setupGUIBuilderEvents();
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
			'amplifier': 'Brightness Amplifier',
			'spawner': 'Ant Spawner'
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
			],
			spawner: [
				{
					condition: {
						cellState: { r: 240, g: 240, b: 240 }
					},
					action: {
						setCellState: { r: 100, g: 200, b: 100 },
						spawn: {
							direction: "right",
							antState: {
								r: "ant.g",
								g: "ant.b", 
								b: "ant.r"
							}
						},
						turn: "left",
						move: true
					}
				},
				{
					condition: {
						antState: { r: { value: 255, tolerance: 50 } }
					},
					action: {
						spawn: {
							direction: "up",
							antState: {
								r: 0,
								g: 255,
								b: 255
							}
						},
						turn: "reverse",
						move: true
					}
				},
				{
					action: {
						setCellState: { r: "ant.r", g: "ant.g", b: "ant.b" },
						turn: "right",
						move: true
					}
				}
			]
		};
	}

	/**
	 * Set up GUI builder event listeners
	 */
	private setupGUIBuilderEvents(): void {
		// Close builder modal
		const closeBuilderButton = document.getElementById('close-builder');
		if (closeBuilderButton) {
			closeBuilderButton.addEventListener('click', () => {
				this.hideGUIBuilder();
			});
		}

		// Cancel builder
		const cancelButton = document.getElementById('builder-cancel');
		if (cancelButton) {
			cancelButton.addEventListener('click', () => {
				this.hideGUIBuilder();
			});
		}

		// Generate JSON
		const generateButton = document.getElementById('builder-generate');
		if (generateButton) {
			generateButton.addEventListener('click', () => {
				this.generateJSONFromBuilder();
			});
		}

		// Add rule button
		const addRuleButton = document.getElementById('add-rule');
		if (addRuleButton) {
			addRuleButton.addEventListener('click', () => {
				this.addBuilderRule();
			});
		}
	}

	/**
	 * Show GUI builder modal
	 */
	private showGUIBuilder(): void {
		const modal = document.getElementById('gui-builder-modal');
		if (modal) {
			modal.classList.remove('hidden');
			this.initializeBuilder();
		}
	}

	/**
	 * Hide GUI builder modal
	 */
	private hideGUIBuilder(): void {
		const modal = document.getElementById('gui-builder-modal');
		if (modal) {
			modal.classList.add('hidden');
		}
	}

	/**
	 * Initialize builder with current rules if any
	 */
	private initializeBuilder(): void {
		const rulesList = document.getElementById('rules-list');
		if (rulesList) {
			rulesList.innerHTML = '';
			
			// Try to parse existing rules from textarea
			if (this.rulesTextarea && this.rulesTextarea.value.trim()) {
				try {
					const existingRules = JSON.parse(this.rulesTextarea.value);
					if (Array.isArray(existingRules)) {
						existingRules.forEach((rule, index) => {
							this.addBuilderRule(rule, index);
						});
					} else {
						this.addBuilderRule();
					}
				} catch (e) {
					// If parsing fails, start with empty rule
					this.addBuilderRule();
				}
			} else {
				// Start with one empty rule
				this.addBuilderRule();
			}
		}
	}

	/**
	 * Add a rule to the builder
	 */
	private addBuilderRule(existingRule?: any, index?: number): void {
		const rulesList = document.getElementById('rules-list');
		if (!rulesList) return;

		const ruleIndex = index !== undefined ? index : rulesList.children.length;
		const ruleDiv = document.createElement('div');
		ruleDiv.className = 'builder-rule';
		ruleDiv.innerHTML = `
			<div class="rule-header">
				<h5>Rule ${ruleIndex + 1}</h5>
				<button class="delete-rule" data-rule="${ruleIndex}">🗑️</button>
			</div>
			<div class="rule-content">
				<div class="condition-section">
					<h6>Condition (optional)</h6>
					<select class="condition-type">
						<option value="">No condition (always executes)</option>
						<option value="simple">Simple condition</option>
						<option value="and">AND group</option>
						<option value="or">OR group</option>
					</select>
					<div class="condition-builder"></div>
				</div>
				<div class="action-section">
					<h6>Action</h6>
					<div class="action-builder">
						<div class="action-group">
							<label><input type="checkbox" class="action-setCellState"> Set cell color</label>
							<div class="setCellState-inputs hidden">
								<input type="text" placeholder="Red (0-255 or expression)" class="cell-r">
								<input type="text" placeholder="Green (0-255 or expression)" class="cell-g">
								<input type="text" placeholder="Blue (0-255 or expression)" class="cell-b">
							</div>
						</div>
						<div class="action-group">
							<label><input type="checkbox" class="action-setAntState"> Set ant color</label>
							<div class="setAntState-inputs hidden">
								<input type="text" placeholder="Red (0-255 or expression)" class="ant-r">
								<input type="text" placeholder="Green (0-255 or expression)" class="ant-g">
								<input type="text" placeholder="Blue (0-255 or expression)" class="ant-b">
							</div>
						</div>
						<div class="action-group">
							<label>Turn:</label>
							<select class="action-turn">
								<option value="">No turn</option>
								<option value="left">Left</option>
								<option value="right">Right</option>
								<option value="reverse">Reverse</option>
							</select>
						</div>
						<div class="action-group">
							<label><input type="checkbox" class="action-move"> Move forward</label>
						</div>
						<div class="action-group">
							<label><input type="checkbox" class="action-spawn"> Spawn new ant</label>
							<div class="spawn-inputs hidden">
								<label>Direction:</label>
								<select class="spawn-direction">
									<option value="">Select direction</option>
									<option value="up">Up</option>
									<option value="down">Down</option>
									<option value="left">Left</option>
									<option value="right">Right</option>
									<option value="up-left">Up-Left</option>
									<option value="up-right">Up-Right</option>
									<option value="down-left">Down-Left</option>
									<option value="down-right">Down-Right</option>
								</select>
								<label>Spawned ant color (optional):</label>
								<input type="text" placeholder="Red (0-255 or expression)" class="spawn-r">
								<input type="text" placeholder="Green (0-255 or expression)" class="spawn-g">
								<input type="text" placeholder="Blue (0-255 or expression)" class="spawn-b">
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

		rulesList.appendChild(ruleDiv);

		// Set up event listeners for this rule
		this.setupRuleEvents(ruleDiv, ruleIndex);

		// If we have existing rule data, populate it
		if (existingRule) {
			this.populateRule(ruleDiv, existingRule);
		}
	}

	/**
	 * Set up event listeners for a specific rule
	 */
	private setupRuleEvents(ruleDiv: HTMLElement, _ruleIndex: number): void {
		// Delete rule button
		const deleteBtn = ruleDiv.querySelector('.delete-rule') as HTMLButtonElement;
		if (deleteBtn) {
			deleteBtn.addEventListener('click', () => {
				ruleDiv.remove();
				this.updateRuleNumbers();
			});
		}

		// Condition type change
		const conditionType = ruleDiv.querySelector('.condition-type') as HTMLSelectElement;
		if (conditionType) {
			conditionType.addEventListener('change', () => {
				this.updateConditionBuilder(ruleDiv, conditionType.value);
			});
		}

		// Action checkboxes
		const actionCheckboxes = ruleDiv.querySelectorAll('input[type="checkbox"]');
		actionCheckboxes.forEach(checkbox => {
			checkbox.addEventListener('change', () => {
				this.toggleActionInputs(checkbox as HTMLInputElement);
			});
		});
	}

	/**
	 * Update rule numbers after deletion
	 */
	private updateRuleNumbers(): void {
		const rulesList = document.getElementById('rules-list');
		if (!rulesList) return;

		const rules = rulesList.querySelectorAll('.builder-rule');
		rules.forEach((rule, index) => {
			const header = rule.querySelector('.rule-header h5');
			if (header) {
				header.textContent = `Rule ${index + 1}`;
			}
		});
	}

	/**
	 * Update condition builder based on type
	 */
	private updateConditionBuilder(ruleDiv: HTMLElement, conditionType: string): void {
		const conditionBuilder = ruleDiv.querySelector('.condition-builder') as HTMLElement;
		if (!conditionBuilder) return;

		conditionBuilder.innerHTML = '';

		if (conditionType === 'simple') {
			conditionBuilder.innerHTML = this.createSimpleConditionHTML();
		} else if (conditionType === 'and' || conditionType === 'or') {
			conditionBuilder.innerHTML = `
				<div class="condition-group">
					<div class="group-conditions"></div>
					<button class="add-condition-btn">+ Add ${conditionType.toUpperCase()} condition</button>
				</div>
			`;
			
			// Add initial condition
			const groupConditions = conditionBuilder.querySelector('.group-conditions');
			const addBtn = conditionBuilder.querySelector('.add-condition-btn') as HTMLButtonElement;
			
			if (groupConditions && addBtn) {
				this.addGroupCondition(groupConditions);
				
				addBtn.addEventListener('click', () => {
					this.addGroupCondition(groupConditions);
				});
			}
		}
	}

	/**
	 * Create HTML for simple condition
	 */
	private createSimpleConditionHTML(): string {
		return `
			<div class="simple-condition">
				<select class="condition-target">
					<option value="antState">Ant state</option>
					<option value="cellState">Current cell</option>
					<option value="surroundingCells">Surrounding cell</option>
				</select>
				<select class="condition-property">
					<option value="r">Red</option>
					<option value="g">Green</option>
					<option value="b">Blue</option>
					<option value="direction">Direction</option>
				</select>
				<select class="condition-operator">
					<option value="equals">Equals</option>
					<option value="tolerance">Equals (with tolerance)</option>
				</select>
				<input type="text" class="condition-value" placeholder="Value or expression">
				<input type="number" class="condition-tolerance hidden" placeholder="Tolerance" min="0" max="255">
				<select class="surrounding-direction hidden">
					<option value="up">Up</option>
					<option value="down">Down</option>
					<option value="left">Left</option>
					<option value="right">Right</option>
					<option value="up-left">Up-Left</option>
					<option value="up-right">Up-Right</option>
					<option value="down-left">Down-Left</option>
					<option value="down-right">Down-Right</option>
				</select>
			</div>
		`;
	}

	/**
	 * Add condition to group
	 */
	private addGroupCondition(container: Element): void {
		const conditionDiv = document.createElement('div');
		conditionDiv.className = 'group-condition-item';
		conditionDiv.innerHTML = `
			${this.createSimpleConditionHTML()}
			<button class="remove-condition-btn">Remove</button>
		`;
		
		container.appendChild(conditionDiv);
		
		// Set up remove button
		const removeBtn = conditionDiv.querySelector('.remove-condition-btn') as HTMLButtonElement;
		if (removeBtn) {
			removeBtn.addEventListener('click', () => {
				conditionDiv.remove();
			});
		}
		
		// Set up condition change events
		this.setupConditionEvents(conditionDiv);
	}

	/**
	 * Set up condition event listeners
	 */
	private setupConditionEvents(conditionDiv: HTMLElement): void {
		const target = conditionDiv.querySelector('.condition-target') as HTMLSelectElement;
		const property = conditionDiv.querySelector('.condition-property') as HTMLSelectElement;
		const operator = conditionDiv.querySelector('.condition-operator') as HTMLSelectElement;
		const tolerance = conditionDiv.querySelector('.condition-tolerance') as HTMLInputElement;
		const surroundingDir = conditionDiv.querySelector('.surrounding-direction') as HTMLSelectElement;

		if (target) {
			target.addEventListener('change', () => {
				if (target.value === 'surroundingCells') {
					surroundingDir?.classList.remove('hidden');
				} else {
					surroundingDir?.classList.add('hidden');
				}
				
				// Update property options
				if (target.value === 'antState') {
					property.innerHTML = `
						<option value="r">Red</option>
						<option value="g">Green</option>
						<option value="b">Blue</option>
						<option value="direction">Direction</option>
						<option value="x">X Position</option>
						<option value="y">Y Position</option>
					`;
				} else {
					property.innerHTML = `
						<option value="r">Red</option>
						<option value="g">Green</option>
						<option value="b">Blue</option>
					`;
				}
			});
		}

		if (operator) {
			operator.addEventListener('change', () => {
				if (operator.value === 'tolerance') {
					tolerance?.classList.remove('hidden');
				} else {
					tolerance?.classList.add('hidden');
				}
			});
		}
	}

	/**
	 * Toggle action input visibility
	 */
	private toggleActionInputs(checkbox: HTMLInputElement): void {
		const parent = checkbox.closest('.action-group');
		if (!parent) return;

		const inputs = parent.querySelector('.setCellState-inputs, .setAntState-inputs, .spawn-inputs') as HTMLElement;
		if (inputs) {
			if (checkbox.checked) {
				inputs.classList.remove('hidden');
			} else {
				inputs.classList.add('hidden');
			}
		}
	}

	/**
	 * Populate rule with existing data
	 */
	private populateRule(ruleDiv: HTMLElement, ruleData: any): void {
		if (!ruleData) return;

		// Populate conditions
		this.populateCondition(ruleDiv, ruleData.condition);

		// Populate actions
		this.populateActions(ruleDiv, ruleData.action);
	}

	/**
	 * Populate condition section of a rule
	 */
	private populateCondition(ruleDiv: HTMLElement, conditionData: any): void {
		const conditionType = ruleDiv.querySelector('.condition-type') as HTMLSelectElement;
		if (!conditionType || !conditionData) return;

		// Determine condition type
		if (conditionData.and) {
			conditionType.value = 'and';
			this.updateConditionBuilder(ruleDiv, 'and');
			this.populateGroupConditions(ruleDiv, conditionData.and);
		} else if (conditionData.or) {
			conditionType.value = 'or';
			this.updateConditionBuilder(ruleDiv, 'or');
			this.populateGroupConditions(ruleDiv, conditionData.or);
		} else {
			// Simple condition
			conditionType.value = 'simple';
			this.updateConditionBuilder(ruleDiv, 'simple');
			this.populateSimpleCondition(ruleDiv, conditionData);
		}
	}

	/**
	 * Populate simple condition
	 */
	private populateSimpleCondition(ruleDiv: HTMLElement, conditionData: any): void {
		// Try to find simple-condition either directly in ruleDiv or as a descendant
		let simpleCondition = ruleDiv.querySelector('.simple-condition');
		
		// If ruleDiv itself contains the condition fields, use it directly
		if (!simpleCondition && ruleDiv.querySelector('.condition-target')) {
			simpleCondition = ruleDiv;
		}
		
		if (!simpleCondition) return;

		const target = simpleCondition.querySelector('.condition-target') as HTMLSelectElement;
		const property = simpleCondition.querySelector('.condition-property') as HTMLSelectElement;
		const operator = simpleCondition.querySelector('.condition-operator') as HTMLSelectElement;
		const value = simpleCondition.querySelector('.condition-value') as HTMLInputElement;
		const tolerance = simpleCondition.querySelector('.condition-tolerance') as HTMLInputElement;
		const surroundingDirection = simpleCondition.querySelector('.surrounding-direction') as HTMLSelectElement;

		// Find which property is being checked
		let targetType = '';
		let propertyName = '';
		let propertyValue: any = '';
		let toleranceValue = '';
		let directionValue = '';

		if (conditionData.antState) {
			targetType = 'antState';
			for (const [prop, val] of Object.entries(conditionData.antState)) {
				if (prop.endsWith('Tolerance')) continue;
				propertyName = prop;
				propertyValue = val;
				const toleranceProp = prop + 'Tolerance';
				if (conditionData.antState[toleranceProp]) {
					toleranceValue = conditionData.antState[toleranceProp];
				}
				break;
			}
		} else if (conditionData.cellState) {
			targetType = 'cellState';
			for (const [prop, val] of Object.entries(conditionData.cellState)) {
				if (prop.endsWith('Tolerance')) continue;
				propertyName = prop;
				propertyValue = val;
				const toleranceProp = prop + 'Tolerance';
				if (conditionData.cellState[toleranceProp]) {
					toleranceValue = conditionData.cellState[toleranceProp];
				}
				break;
			}
		} else if (conditionData.surroundingCells) {
			targetType = 'surroundingCells';
			for (const [dir, cellData] of Object.entries(conditionData.surroundingCells)) {
				directionValue = dir;
				for (const [prop, val] of Object.entries(cellData as any)) {
					if (prop.endsWith('Tolerance')) continue;
					propertyName = prop;
					propertyValue = val;
					const toleranceProp = prop + 'Tolerance';
					if ((cellData as any)[toleranceProp]) {
						toleranceValue = (cellData as any)[toleranceProp];
					}
					break;
				}
				break;
			}
		}

		// Set form values
		if (target) target.value = targetType;
		if (property) property.value = propertyName;
		if (value) value.value = this.formatValue(propertyValue);
		
		// Set operator and tolerance
		if (toleranceValue && operator && tolerance) {
			operator.value = 'tolerance';
			tolerance.classList.remove('hidden');
			tolerance.value = toleranceValue.toString();
		} else if (operator) {
			operator.value = 'equals';
		}

		// Set surrounding direction
		if (directionValue && surroundingDirection) {
			surroundingDirection.classList.remove('hidden');
			surroundingDirection.value = directionValue;
		}

		// Trigger change events to update UI
		if (target) target.dispatchEvent(new Event('change'));
		if (operator) operator.dispatchEvent(new Event('change'));
	}

	/**
	 * Populate group conditions (AND/OR)
	 */
	private populateGroupConditions(ruleDiv: HTMLElement, conditionsArray: any[]): void {
		const conditionGroup = ruleDiv.querySelector('.condition-group');
		if (!conditionGroup) return;

		const groupConditions = conditionGroup.querySelector('.group-conditions');
		if (!groupConditions) return;

		// Clear existing conditions
		groupConditions.innerHTML = '';

		// Add each condition
		conditionsArray.forEach(conditionData => {
			this.addGroupCondition(groupConditions);
			const lastCondition = groupConditions.lastElementChild as HTMLElement;
			if (lastCondition) {
				// Set up events first, then populate
				this.setupConditionEvents(lastCondition);
				this.populateSimpleCondition(lastCondition, conditionData);
			}
		});
	}

	/**
	 * Populate actions section of a rule
	 */
	private populateActions(ruleDiv: HTMLElement, actionData: any): void {
		if (!actionData) return;

		// Set cell state action
		if (actionData.setCellState) {
			const setCellCheckbox = ruleDiv.querySelector('.action-setCellState') as HTMLInputElement;
			if (setCellCheckbox) {
				setCellCheckbox.checked = true;
				this.toggleActionInputs(setCellCheckbox);

				const cellR = ruleDiv.querySelector('.cell-r') as HTMLInputElement;
				const cellG = ruleDiv.querySelector('.cell-g') as HTMLInputElement;
				const cellB = ruleDiv.querySelector('.cell-b') as HTMLInputElement;

				if (cellR && actionData.setCellState.r !== undefined) {
					cellR.value = this.formatValue(actionData.setCellState.r);
				}
				if (cellG && actionData.setCellState.g !== undefined) {
					cellG.value = this.formatValue(actionData.setCellState.g);
				}
				if (cellB && actionData.setCellState.b !== undefined) {
					cellB.value = this.formatValue(actionData.setCellState.b);
				}
			}
		}

		// Set ant state action
		if (actionData.setAntState) {
			const setAntCheckbox = ruleDiv.querySelector('.action-setAntState') as HTMLInputElement;
			if (setAntCheckbox) {
				setAntCheckbox.checked = true;
				this.toggleActionInputs(setAntCheckbox);

				const antR = ruleDiv.querySelector('.ant-r') as HTMLInputElement;
				const antG = ruleDiv.querySelector('.ant-g') as HTMLInputElement;
				const antB = ruleDiv.querySelector('.ant-b') as HTMLInputElement;

				if (antR && actionData.setAntState.r !== undefined) {
					antR.value = this.formatValue(actionData.setAntState.r);
				}
				if (antG && actionData.setAntState.g !== undefined) {
					antG.value = this.formatValue(actionData.setAntState.g);
				}
				if (antB && actionData.setAntState.b !== undefined) {
					antB.value = this.formatValue(actionData.setAntState.b);
				}
			}
		}

		// Set turn action
		if (actionData.turn) {
			const turnSelect = ruleDiv.querySelector('.action-turn') as HTMLSelectElement;
			if (turnSelect) {
				turnSelect.value = actionData.turn;
			}
		}

		// Set move action
		if (actionData.move) {
			const moveCheckbox = ruleDiv.querySelector('.action-move') as HTMLInputElement;
			if (moveCheckbox) {
				moveCheckbox.checked = true;
			}
		}

		// Set spawn action
		if (actionData.spawn) {
			const spawnCheckbox = ruleDiv.querySelector('.action-spawn') as HTMLInputElement;
			if (spawnCheckbox) {
				spawnCheckbox.checked = true;
				this.toggleActionInputs(spawnCheckbox);

				const spawnDirection = ruleDiv.querySelector('.spawn-direction') as HTMLSelectElement;
				if (spawnDirection && actionData.spawn.direction) {
					spawnDirection.value = actionData.spawn.direction;
				}

				if (actionData.spawn.antState) {
					const spawnR = ruleDiv.querySelector('.spawn-r') as HTMLInputElement;
					const spawnG = ruleDiv.querySelector('.spawn-g') as HTMLInputElement;
					const spawnB = ruleDiv.querySelector('.spawn-b') as HTMLInputElement;

					if (spawnR && actionData.spawn.antState.r !== undefined) {
						spawnR.value = this.formatValue(actionData.spawn.antState.r);
					}
					if (spawnG && actionData.spawn.antState.g !== undefined) {
						spawnG.value = this.formatValue(actionData.spawn.antState.g);
					}
					if (spawnB && actionData.spawn.antState.b !== undefined) {
						spawnB.value = this.formatValue(actionData.spawn.antState.b);
					}
				}
			}
		}
	}

	/**
	 * Format value for display in form
	 */
	private formatValue(value: any): string {
		if (typeof value === 'number') {
			return value.toString();
		}
		return value || '';
	}

	/**
	 * Generate JSON from builder
	 */
	private generateJSONFromBuilder(): void {
		const rulesList = document.getElementById('rules-list');
		if (!rulesList) return;

		const rules: any[] = [];
		const ruleElements = rulesList.querySelectorAll('.builder-rule');

		ruleElements.forEach(ruleDiv => {
			const rule = this.extractRuleFromElement(ruleDiv as HTMLElement);
			if (rule) {
				rules.push(rule);
			}
		});

		if (this.rulesTextarea) {
			this.rulesTextarea.value = JSON.stringify(rules, null, 2);
			this.hideGUIBuilder();
			this.showMessage('Rules generated successfully!', 'success');
		}
	}

	/**
	 * Extract rule data from DOM element
	 */
	private extractRuleFromElement(ruleDiv: HTMLElement): any {
		const rule: any = { action: {} };

		// Extract condition
		const conditionType = ruleDiv.querySelector('.condition-type') as HTMLSelectElement;
		if (conditionType && conditionType.value) {
			if (conditionType.value === 'simple') {
				rule.condition = this.extractSimpleCondition(ruleDiv);
			} else if (conditionType.value === 'and' || conditionType.value === 'or') {
				rule.condition = this.extractGroupCondition(ruleDiv, conditionType.value);
			}
		}

		// Extract actions
		const setCellCheckbox = ruleDiv.querySelector('.action-setCellState') as HTMLInputElement;
		if (setCellCheckbox && setCellCheckbox.checked) {
			const cellR = (ruleDiv.querySelector('.cell-r') as HTMLInputElement)?.value;
			const cellG = (ruleDiv.querySelector('.cell-g') as HTMLInputElement)?.value;
			const cellB = (ruleDiv.querySelector('.cell-b') as HTMLInputElement)?.value;
			
			rule.action.setCellState = {};
			if (cellR) rule.action.setCellState.r = this.parseValue(cellR);
			if (cellG) rule.action.setCellState.g = this.parseValue(cellG);
			if (cellB) rule.action.setCellState.b = this.parseValue(cellB);
		}

		const setAntCheckbox = ruleDiv.querySelector('.action-setAntState') as HTMLInputElement;
		if (setAntCheckbox && setAntCheckbox.checked) {
			const antR = (ruleDiv.querySelector('.ant-r') as HTMLInputElement)?.value;
			const antG = (ruleDiv.querySelector('.ant-g') as HTMLInputElement)?.value;
			const antB = (ruleDiv.querySelector('.ant-b') as HTMLInputElement)?.value;
			
			rule.action.setAntState = {};
			if (antR) rule.action.setAntState.r = this.parseValue(antR);
			if (antG) rule.action.setAntState.g = this.parseValue(antG);
			if (antB) rule.action.setAntState.b = this.parseValue(antB);
		}

		const turnSelect = ruleDiv.querySelector('.action-turn') as HTMLSelectElement;
		if (turnSelect && turnSelect.value) {
			rule.action.turn = turnSelect.value;
		}

		const moveCheckbox = ruleDiv.querySelector('.action-move') as HTMLInputElement;
		if (moveCheckbox && moveCheckbox.checked) {
			rule.action.move = true;
		}

		const spawnCheckbox = ruleDiv.querySelector('.action-spawn') as HTMLInputElement;
		if (spawnCheckbox && spawnCheckbox.checked) {
			const spawnDirection = (ruleDiv.querySelector('.spawn-direction') as HTMLSelectElement)?.value;
			if (spawnDirection) {
				rule.action.spawn = { direction: spawnDirection };

				const spawnR = (ruleDiv.querySelector('.spawn-r') as HTMLInputElement)?.value;
				const spawnG = (ruleDiv.querySelector('.spawn-g') as HTMLInputElement)?.value;
				const spawnB = (ruleDiv.querySelector('.spawn-b') as HTMLInputElement)?.value;

				if (spawnR || spawnG || spawnB) {
					rule.action.spawn.antState = {};
					if (spawnR) rule.action.spawn.antState.r = this.parseValue(spawnR);
					if (spawnG) rule.action.spawn.antState.g = this.parseValue(spawnG);
					if (spawnB) rule.action.spawn.antState.b = this.parseValue(spawnB);
				}
			}
		}

		return rule;
	}

	/**
	 * Extract simple condition from rule element
	 */
	private extractSimpleCondition(ruleDiv: HTMLElement): any {
		const simpleCondition = ruleDiv.querySelector('.simple-condition');
		if (!simpleCondition) return null;

		const target = simpleCondition.querySelector('.condition-target') as HTMLSelectElement;
		const property = simpleCondition.querySelector('.condition-property') as HTMLSelectElement;
		const operator = simpleCondition.querySelector('.condition-operator') as HTMLSelectElement;
		const value = simpleCondition.querySelector('.condition-value') as HTMLInputElement;
		const tolerance = simpleCondition.querySelector('.condition-tolerance') as HTMLInputElement;
		const surroundingDirection = simpleCondition.querySelector('.surrounding-direction') as HTMLSelectElement;

		if (!target || !property || !value || !value.value.trim()) {
			return null;
		}

		const condition: any = {};
		
		if (target.value === 'surroundingCells' && surroundingDirection && surroundingDirection.value) {
			condition.surroundingCells = {
				[surroundingDirection.value]: {
					[property.value]: this.parseValue(value.value)
				}
			};
			
			if (operator.value === 'tolerance' && tolerance && tolerance.value) {
				condition.surroundingCells[surroundingDirection.value][property.value + 'Tolerance'] = parseInt(tolerance.value);
			}
		} else {
			condition[target.value] = {
				[property.value]: this.parseValue(value.value)
			};
			
			if (operator.value === 'tolerance' && tolerance && tolerance.value) {
				condition[target.value][property.value + 'Tolerance'] = parseInt(tolerance.value);
			}
		}

		return condition;
	}

	/**
	 * Extract group condition (AND/OR) from rule element
	 */
	private extractGroupCondition(ruleDiv: HTMLElement, groupType: string): any {
		const conditionGroup = ruleDiv.querySelector('.condition-group');
		if (!conditionGroup) return null;

		const conditionItems = conditionGroup.querySelectorAll('.group-condition-item');
		const conditions: any[] = [];

		conditionItems.forEach(item => {
			const condition = this.extractSimpleConditionFromElement(item as HTMLElement);
			if (condition) {
				conditions.push(condition);
			}
		});

		if (conditions.length === 0) return null;
		if (conditions.length === 1) return conditions[0];

		return { [groupType]: conditions };
	}

	/**
	 * Extract simple condition from any element
	 */
	private extractSimpleConditionFromElement(element: HTMLElement): any {
		const target = element.querySelector('.condition-target') as HTMLSelectElement;
		const property = element.querySelector('.condition-property') as HTMLSelectElement;
		const operator = element.querySelector('.condition-operator') as HTMLSelectElement;
		const value = element.querySelector('.condition-value') as HTMLInputElement;
		const tolerance = element.querySelector('.condition-tolerance') as HTMLInputElement;
		const surroundingDirection = element.querySelector('.surrounding-direction') as HTMLSelectElement;

		if (!target || !property || !value || !value.value.trim()) {
			return null;
		}

		const condition: any = {};
		
		if (target.value === 'surroundingCells' && surroundingDirection && surroundingDirection.value) {
			condition.surroundingCells = {
				[surroundingDirection.value]: {
					[property.value]: this.parseValue(value.value)
				}
			};
			
			if (operator.value === 'tolerance' && tolerance && tolerance.value) {
				condition.surroundingCells[surroundingDirection.value][property.value + 'Tolerance'] = parseInt(tolerance.value);
			}
		} else {
			condition[target.value] = {
				[property.value]: this.parseValue(value.value)
			};
			
			if (operator.value === 'tolerance' && tolerance && tolerance.value) {
				condition[target.value][property.value + 'Tolerance'] = parseInt(tolerance.value);
			}
		}

		return condition;
	}

	/**
	 * Parse value (number or string expression)
	 */
	private parseValue(value: string): string | number {
		const trimmed = value.trim();
		if (/^\d+$/.test(trimmed)) {
			return parseInt(trimmed);
		}
		return trimmed;
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