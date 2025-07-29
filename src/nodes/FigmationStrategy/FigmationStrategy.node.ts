import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class FigmationStrategy implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Figmation Strategy',
		name: 'figmationStrategy',
		icon: 'file:figmation.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["strategyType"] === "reaction_to_connector" ? "Prototype reactions → connector lines strategy" : $parameter["strategyType"] === "design_system" ? "Design system implementation strategy" : $parameter["strategyType"] === "component_library" ? "Component library organization strategy" : $parameter["strategyType"] === "custom" ? "Custom strategy: " + ($parameter["title"] || "Untitled") : "Select strategy type"}}',
		description: 'Provides strategic guidance and best practices for Figma design automation workflows. Acts as a knowledge resource for agents working with Figma design tasks.',
		defaults: {
			name: 'Figmation Strategy',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Strategy Type',
				name: 'strategyType',
				type: 'options',
				options: [
					{
						name: 'Prototype Reactions to Connectors',
						value: 'reaction_to_connector',
						description: 'Convert Figma prototype reactions to visual connector lines',
					},
					{
						name: 'Design System Implementation',
						value: 'design_system',
						description: 'Best practices for implementing design systems in Figma',
					},
					{
						name: 'Component Library Organization',
						value: 'component_library',
						description: 'Strategies for organizing and maintaining component libraries',
					},
					{
						name: 'Custom Strategy',
						value: 'custom',
						description: 'Define your own custom strategy or guidance',
					},
				],
				default: 'reaction_to_connector',
				description: 'Type of strategic guidance to provide',
			},
			{
				displayName: 'Custom Title',
				name: 'title',
				type: 'string',
				default: 'Custom Design Strategy',
				description: 'Title for your custom strategy',
				displayOptions: {
					show: {
						strategyType: ['custom'],
					},
				},
			},
			{
				displayName: 'Custom Strategy Content',
				name: 'customContent',
				type: 'string',
				typeOptions: {
					rows: 20,
				},
				default: `# Custom Design Strategy

## Goal
Define your custom strategy here...

## Process
1. Step one
2. Step two
3. Step three

## Best Practices
- Practice one
- Practice two

## Example
\`\`\`json
{
  "example": "data structure"
}
\`\`\``,
				description: 'Your custom strategy content in Markdown format',
				displayOptions: {
					show: {
						strategyType: ['custom'],
					},
				},
			},
			{
				displayName: 'Allow Modifications',
				name: 'allowModifications',
				type: 'boolean',
				default: true,
				description: 'Whether users can modify this strategy content',
			},
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				options: [
					{
						name: 'Full Strategy Document',
						value: 'full',
						description: 'Complete strategy with all sections',
					},
					{
						name: 'Process Steps Only',
						value: 'steps',
						description: 'Only the step-by-step process',
					},
					{
						name: 'Summary',
						value: 'summary',
						description: 'Brief summary of the strategy',
					},
				],
				default: 'full',
				description: 'How much detail to include in the output',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const strategyType = this.getNodeParameter('strategyType', i) as string;
			const title = this.getNodeParameter('title', i, '') as string;
			const customContent = this.getNodeParameter('customContent', i, '') as string;
			const allowModifications = this.getNodeParameter('allowModifications', i, true) as boolean;
			const outputFormat = this.getNodeParameter('outputFormat', i, 'full') as string;

			let strategyContent = '';
			let strategyTitle = '';
			let strategyDescription = '';

			switch (strategyType) {
				case 'reaction_to_connector':
					strategyTitle = 'Strategy: Convert Figma Prototype Reactions to Connector Lines';
					strategyDescription = 'Strategy for converting Figma prototype reactions to connector lines using the output of get_reactions';
					strategyContent = FigmationStrategy.getReactionToConnectorStrategy();
					break;

				case 'design_system':
					strategyTitle = 'Strategy: Design System Implementation in Figma';
					strategyDescription = 'Best practices and workflows for implementing and maintaining design systems';
					strategyContent = FigmationStrategy.getDesignSystemStrategy();
					break;

				case 'component_library':
					strategyTitle = 'Strategy: Component Library Organization';
					strategyDescription = 'Guidelines for organizing and maintaining Figma component libraries';
					strategyContent = FigmationStrategy.getComponentLibraryStrategy();
					break;

				case 'custom':
					strategyTitle = title || 'Custom Design Strategy';
					strategyDescription = 'User-defined custom strategy for Figma design workflows';
					strategyContent = customContent;
					break;

				default:
					throw new Error(`Unknown strategy type: ${strategyType}`);
			}

			// Format output based on outputFormat parameter
			let formattedContent = strategyContent;
			if (outputFormat === 'steps') {
				formattedContent = FigmationStrategy.extractStepsOnly(strategyContent);
			} else if (outputFormat === 'summary') {
				formattedContent = FigmationStrategy.extractSummary(strategyContent);
			}

			const result = {
				strategyType,
				title: strategyTitle,
				description: strategyDescription,
				content: formattedContent,
				allowModifications,
				outputFormat,
				timestamp: new Date().toISOString(),
			};

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		}

		return [returnData];
	}

	private static getReactionToConnectorStrategy(): string {
		return `# Strategy: Convert Figma Prototype Reactions to Connector Lines

## Goal
Process prototype reactions from Figma designs and automatically create visual connector lines that represent user flows. This strategy uses Figmation Commander commands in the correct sequence to achieve this visualization.

## Required n8n Workflow Setup
Use **Figmation Commander** nodes with the following commands in sequence:

## Step-by-Step Process

### 1. Preparation & Context Gathering
**Command:** \`get_document_info\`
- **Purpose:** Get basic document structure and verify access
- **Parameters:** None required
- **Expected Output:** Document ID, name, pages list

**Command:** \`get_selection\` 
- **Purpose:** Understand what's currently selected (if any)
- **Parameters:** None required
- **Expected Output:** Currently selected node IDs and types

### 2. Get Prototype Reactions Data
**Command:** \`get_reactions\`
- **Purpose:** Extract all prototype interactions from the design
- **Parameters:** 
  - \`nodeId\`: (optional) Specific node ID, or leave empty for all reactions
- **Expected Output:** JSON array of nodes with their reactions
\`\`\`json
{
  "nodes": [
    {
      "id": "node-id",
      "name": "Button",
      "reactions": [
        {
          "trigger": { "type": "ON_CLICK" },
          "action": {
            "type": "NAVIGATE",
            "destinationId": "destination-node-id"
          }
        }
      ]
    }
  ]
}
\`\`\`

### 3. Enhance Context with Node Information
**Command:** \`get_node_info\`
- **Purpose:** Get detailed information about source and destination nodes
- **Parameters:**
  - \`nodeId\`: Each node ID found in the reactions
- **Usage:** Call this for both source and destination nodes to get readable names
- **Expected Output:** Node details including name, type, position

### 4. Set Up Connector Default (One-time Setup)
**Command:** \`set_default_connector\`
- **Purpose:** Ensure a default connector style is available
- **Parameters:** None (checks if default exists)
- **Expected Responses:**
  - ✅ "Default connector is already set" → Proceed to Step 5
  - ❌ "No default connector set" → Manual setup required:
    1. Copy a connector from FigJam
    2. Paste it on current Figma page
    3. Select the connector
    4. Run \`set_default_connector\` with \`connectorId\`: "SELECTED_NODE_ID"

### 5. Create Visual Connections
**Command:** \`create_connections\`
- **Purpose:** Generate connector lines between prototype elements
- **Parameters:**
  - \`connections\`: Array of connection objects
\`\`\`json
{
  "connections": [
    {
      "startNodeId": "source-button-id",
      "endNodeId": "destination-screen-id", 
      "text": "On click → Navigate to Dashboard"
    },
    {
      "startNodeId": "menu-icon-id",
      "endNodeId": "overlay-id",
      "text": "On tap → Open menu overlay"
    }
  ]
}
\`\`\`

## Connection Text Generation Rules
Transform reaction data into readable connector labels:

- **ON_CLICK + NAVIGATE:** "On click → Navigate to [Destination Name]"
- **ON_HOVER + OPEN_OVERLAY:** "On hover → Show [Overlay Name]" 
- **ON_DRAG + SWAP_OVERLAY:** "On drag → Switch to [New Overlay]"
- **ON_KEY_DOWN + NAVIGATE:** "On [Key] press → Go to [Destination]"

## Filtering Rules for Reactions
**Include these action types:**
- \`NAVIGATE\` - Screen transitions
- \`OPEN_OVERLAY\` - Modal/overlay appearances
- \`SWAP_OVERLAY\` - Overlay state changes
- \`TOGGLE_OVERLAY\` - Show/hide overlays

**Exclude these action types:**
- \`CHANGE_TO\` - Component state changes (internal)
- \`CLOSE_OVERLAY\` - Simple dismissals
- \`RESET_COMPONENT\` - Component resets

## Example n8n Workflow Configuration

### Node 1: Get Reactions
- **Command:** \`get_reactions\`
- **Parameters:** Leave \`nodeId\` empty for all reactions

### Node 2: Process Data (Code/Function Node)
- Filter reactions by action type
- Extract source/destination pairs
- Generate connection text labels

### Node 3: Get Node Details (Loop)
- **Command:** \`get_node_info\`
- **Parameters:** \`nodeId\` from each source/destination
- **Loop through all unique node IDs**

### Node 4: Create Connectors
- **Command:** \`create_connections\`
- **Parameters:** \`connections\` array from processed data

## Troubleshooting Commands

**If connectors don't appear:**
- **Command:** \`get_selection\` - Check what's currently selected
- **Command:** \`set_default_connector\` - Verify connector setup

**If reactions are missing:**
- **Command:** \`get_document_info\` - Confirm document access
- **Command:** \`get_node_info\` - Verify prototype setup on nodes

## Success Validation
After running \`create_connections\`, verify results:
- **Command:** \`get_selection\` - Should show newly created connectors
- Visual inspection: Connector lines should connect prototype elements with readable labels

This workflow transforms prototype interactions into visual documentation automatically.`;
	}

	private static getDesignSystemStrategy(): string {
		return `# Strategy: Design System Implementation in Figma

## Goal
Build a comprehensive design system using Figmation Commander commands to create, organize, and maintain consistent design components across teams and projects.

## Required n8n Workflow Setup
Use **Figmation Commander** nodes to automate design system creation:

## Step-by-Step Process

### 1. Foundation Setup - Create Base Elements

**Command:** \`create_frame\`
- **Purpose:** Create main container for design system
- **Parameters:**
  - \`x\`: 0, \`y\`: 0
  - \`width\`: 1440, \`height\`: 1024
  - \`name\`: "Design System Foundation"
- **Usage:** This becomes the master frame for all design tokens

**Command:** \`create_rectangle\` (Color Swatches)
- **Purpose:** Create color palette swatches
- **Parameters for Primary Colors:**
  - \`x\`: 100, \`y\`: 100, \`width\`: 100, \`height\`: 100
  - \`name\`: "Primary-500", "Secondary-500", etc.
- **Repeat:** Create 5-8 color swatches for complete palette
- **Follow up with:** \`set_fill_color\` for each swatch

**Command:** \`create_text\` (Typography Scale)
- **Purpose:** Create text size examples
- **Parameters:**
  - \`x\`: 300, \`y\`: 100, \`text\`: "Heading 1"
  - \`fontSize\`: 32, \`fontWeight\`: "bold"
  - \`name\`: "Typography-H1"
- **Repeat:** Create H1-H6, body, caption text styles

### 2. Component Architecture - Build Atomic Components

**Command:** \`create_button\`
- **Purpose:** Create base button component
- **Parameters:**
  - \`x\`: 500, \`y\`: 200
  - \`width\`: 120, \`height\`: 40
  - \`text\`: "Primary Button"
  - \`buttonStyle\`: "primary"
- **Follow up:** Create variants with different styles

**Command:** \`create_input_field\`
- **Purpose:** Create form input components
- **Parameters:**
  - \`x\`: 500, \`y\`: 300
  - \`width\`: 200, \`height\`: 40
  - \`placeholder\`: "Enter text..."
  - \`inputType\`: "text"

**Command:** \`create_checkbox\` & \`create_toggle\`
- **Purpose:** Create form control components
- **Parameters:**
  - Position components systematically
  - Use consistent spacing (8px grid)

### 3. Create Symbol Components

**Command:** \`create_symbol\`
- **Purpose:** Convert created elements into reusable components
- **Usage:** Select each component and run command
- **Parameters:**
  - \`sourceNodeId\`: ID of the component to convert
  - \`name\`: "Button/Primary", "Input/Default", etc.
- **Result:** Creates master components for design system

### 4. Component Organization

**Command:** \`create_frame\` (Component Categories)
- **Purpose:** Organize components by category
- **Create frames for:**
  - "Atoms" - Basic elements (buttons, inputs, icons)
  - "Molecules" - Combined elements (search bar, form group)
  - "Organisms" - Complex components (header, card, table)

**Command:** \`move_node\`
- **Purpose:** Position components within category frames
- **Parameters:**
  - \`nodeId\`: Component to move
  - \`x\`, \`y\`: Position within category frame
  - \`parentId\`: Category frame ID

### 5. Documentation Creation

**Command:** \`create_text\` (Usage Guidelines)
- **Purpose:** Document component usage
- **Parameters:**
  - \`text\`: "Usage: Use primary buttons for main actions..."
  - Position near each component
- **Create documentation for:**
  - When to use each component
  - Spacing and sizing guidelines
  - Interaction states

**Command:** \`create_frame\` (Example Layouts)
- **Purpose:** Show components in context
- **Create example screens using the components**

### 6. Avatar and Progress Components

**Command:** \`create_avatar\`
- **Purpose:** Add user representation components
- **Parameters:**
  - \`avatarType\`: "initials", \`avatarSize\`: "medium"
  - Create multiple sizes: small, medium, large, xlarge
- **Usage:** Part of user interface components

**Command:** \`create_progress_bar\`
- **Purpose:** Add loading and progress indicators
- **Parameters:**
  - \`progressStyle\`: "linear" and "circular"
  - \`progress\`: Various percentage examples (25, 50, 75, 100)

## Example n8n Workflow for Component Creation

### Workflow 1: Color System Setup
1. **Command:** \`get_document_info\` - Verify document access
2. **Command:** \`create_frame\` - Create "Color Palette" container
3. **Loop through colors:**
   - \`create_rectangle\` - Create color swatch
   - \`set_fill_color\` - Apply specific color
   - \`create_text\` - Add color name/hex value

### Workflow 2: Button System Creation
1. **Command:** \`create_button\` - Create primary button
2. **Command:** \`clone_node\` - Duplicate for variants
3. **Command:** \`set_fill_color\` - Style secondary button
4. **Command:** \`create_symbol\` - Convert to reusable component

### Workflow 3: Component Library Organization
1. **Command:** \`get_local_components\` - List existing components
2. **Command:** \`create_frame\` - Create category containers
3. **Command:** \`move_node\` - Organize components by category
4. **Command:** \`create_text\` - Add category labels

## Validation Commands

**Command:** \`get_local_components\`
- **Purpose:** Verify all components are created and accessible
- **Usage:** Run after component creation to confirm library

**Command:** \`get_styles\`
- **Purpose:** Check text and color styles are properly defined
- **Usage:** Validate design tokens are available

## Maintenance Workflow Commands

**Command:** \`get_node_info\`
- **Purpose:** Audit existing components
- **Usage:** Check component properties and usage

**Command:** \`update_text_content\` 
- **Purpose:** Update component documentation
- **Usage:** Keep usage guidelines current

## Best Practices with Commands
- Use consistent naming: "Component/Variant/State"
- Position components on 8px grid using calculated x,y values
- Create master components in dedicated frames
- Document each component with adjacent text nodes
- Use \`clone_node\` for creating variants efficiently
- Validate with \`get_local_components\` after major changes

This systematic approach using Figmation commands ensures consistent, scalable design system creation.`;
	}

	private static getComponentLibraryStrategy(): string {
		return `# Strategy: Component Library Organization

## Goal
Create a well-organized, scalable component library using Figmation Commander commands to ensure easy discovery, consistent usage, and efficient maintenance across design teams.

## Required n8n Workflow Setup
Use **Figmation Commander** nodes to systematically build and organize your component library:

## Step-by-Step Process

### 1. Library Architecture Setup

**Command:** \`get_document_info\`
- **Purpose:** Verify access to component library file
- **Usage:** Run first to confirm you're in the right document

**Command:** \`create_frame\` (Master Container)
- **Purpose:** Create main organizational structure
- **Parameters:**
  - \`x\`: 0, \`y\`: 0
  - \`width\`: 2000, \`height\`: 1500
  - \`name\`: "Component Library Master"
- **Usage:** This becomes the container for all component categories

### 2. Category Framework Creation

**Command:** \`create_frame\` (Category Containers)
- **Purpose:** Create frames for each component category
- **Create these categories:**

#### Atoms Category
- **Parameters:** \`x\`: 100, \`y\`: 100, \`width\`: 800, \`height\`: 300
- \`name\`: "01-Atoms"
- **Components to include:** Buttons, inputs, icons, badges

#### Molecules Category  
- **Parameters:** \`x\`: 100, \`y\`: 450, \`width\`: 800, \`height\`: 300
- \`name\`: "02-Molecules"
- **Components to include:** Search bars, form groups, cards

#### Organisms Category
- **Parameters:** \`x\`: 100, \`y\`: 800, \`width\`: 800, \`height\`: 300
- \`name\`: "03-Organisms"
- **Components to include:** Headers, navigation, complex forms

### 3. Base Component Creation

**Command:** \`create_button\`
- **Purpose:** Create primary button component
- **Parameters:**
  - \`x\`: 150, \`y\`: 150 (within Atoms frame)
  - \`width\`: 120, \`height\`: 40
  - \`text\`: "Button", \`buttonStyle\`: "primary"
  - \`name\`: "Button/Primary/Default"

**Command:** \`clone_node\`
- **Purpose:** Create button variants
- **Parameters:** \`nodeId\`: Button ID from previous step
- **Follow up:** Modify cloned buttons for Secondary, Ghost, Disabled states
- **Naming:** "Button/Secondary/Default", "Button/Primary/Disabled"

**Command:** \`create_input_field\`
- **Purpose:** Create form input components
- **Parameters:**
  - \`x\`: 300, \`y\`: 150
  - \`width\`: 200, \`height\`: 40
  - \`placeholder\`: "Enter text...", \`inputType\`: "text"
  - \`name\`: "Input/Text/Default"

**Command:** \`create_checkbox\` & \`create_toggle\`
- **Purpose:** Create form controls
- **Position systematically within Atoms frame**
- **Naming:** "Checkbox/Default/Unchecked", "Toggle/Default/Off"

### 4. Advanced Component Assembly

**Command:** \`create_frame\` (Molecule Components)
- **Purpose:** Create complex components by combining atoms
- **Example - Search Bar:**
  - \`x\`: 150, \`y\`: 500, \`width\`: 300, \`height\`: 40
  - \`name\`: "SearchBar/Default"

**Command:** \`create_input_field\` + \`create_button\`
- **Purpose:** Combine input with search button
- **Use within the SearchBar frame**
- **Position components with 8px spacing**

**Command:** \`create_avatar\`
- **Purpose:** Add user representation to molecules
- **Parameters:**
  - \`avatarType\`: "initials", \`avatarSize\`: "medium"
  - \`name\`: "Avatar/User/Medium"

### 5. Symbol Conversion and Organization

**Command:** \`create_symbol\`
- **Purpose:** Convert components to reusable symbols
- **Process:** Select each completed component and run command
- **Parameters:**
  - \`sourceNodeId\`: Component frame ID
  - \`name\`: Follow naming convention "Category/Type/Variant"

**Command:** \`move_node\`
- **Purpose:** Organize symbols within appropriate category frames
- **Parameters:**
  - \`nodeId\`: Symbol ID
  - \`x\`, \`y\`: Position within category frame
  - \`parentId\`: Category frame ID

### 6. Documentation and Examples

**Command:** \`create_text\` (Component Documentation)
- **Purpose:** Add usage guidelines for each component
- **Parameters:**
  - \`text\`: "Usage: Primary buttons for main actions. Max 2 per screen."
  - Position adjacent to each component
  - \`fontSize\`: 12, \`name\`: "Doc-[ComponentName]"

**Command:** \`create_frame\` (Usage Examples)
- **Purpose:** Show components in realistic contexts
- **Create example layouts:**
  - Login form using Input + Button components
  - Dashboard header using Avatar + Navigation components
  - Card layout using multiple molecule components

### 7. Component Status System

**Command:** \`create_rectangle\` (Status Indicators)
- **Purpose:** Add visual status indicators
- **Create status badges:**
  - Green rectangle for "Ready" components
  - Yellow for "In Progress"  
  - Red for "Deprecated"
- **Parameters:** Small rectangles (60×20) positioned at component corners

**Command:** \`set_fill_color\`
- **Purpose:** Color-code status indicators
- **Colors:**
  - Ready: \`color\`: "#00C853" (green)
  - In Progress: \`color\`: "#FFB300" (yellow)
  - Deprecated: \`color\`: "#F44336" (red)

### 8. Progress Indicators and Feedback Components

**Command:** \`create_progress_bar\`
- **Purpose:** Add loading and progress components
- **Create variants:**
  - Linear: \`progressStyle\`: "linear", \`width\`: 200
  - Circular: \`progressStyle\`: "circular", \`width\`: 48
- **Progress values:** 0%, 25%, 50%, 75%, 100%

## Library Maintenance Workflows

### Workflow 1: Component Audit
1. **Command:** \`get_local_components\` - List all existing components
2. **Command:** \`get_node_info\` - Check each component's usage
3. **Decision:** Update, deprecate, or remove based on usage data

### Workflow 2: New Component Addition
1. **Command:** \`create_[component_type]\` - Create new component
2. **Command:** \`move_node\` - Position in appropriate category
3. **Command:** \`create_text\` - Add documentation
4. **Command:** \`create_symbol\` - Convert to reusable component

### Workflow 3: Version Update Process
1. **Command:** \`clone_node\` - Duplicate existing component
2. **Modify cloned component with updates**
3. **Command:** \`create_text\` - Add version notes
4. **Command:** \`set_fill_color\` - Update status indicator

## Quality Assurance Commands

**Command:** \`get_selection\`
- **Purpose:** Verify component selection for batch operations
- **Usage:** Before running bulk updates on multiple components

**Command:** \`resize_node\`
- **Purpose:** Ensure consistent component sizing
- **Standard sizes:**
  - Buttons: 120×40 (default), 160×48 (large)
  - Inputs: 200×40 (default), 300×40 (large)
  - Icons: 16×16, 24×24, 32×32

## Naming Convention Implementation

**Use this systematic approach:**
- **Category/Type/Variant/State**
- Examples:
  - "Atoms/Button/Primary/Default"
  - "Molecules/SearchBar/WithIcon/Focused"
  - "Organisms/Header/Navigation/Expanded"

## Validation Checklist Commands

**Run these commands to validate library quality:**

1. **Command:** \`get_local_components\` - Confirm all components are accessible
2. **Command:** \`get_styles\` - Verify consistent text and color styles
3. **Command:** \`get_document_info\` - Check overall document organization

## Best Practices with Commands

- Position components on 8px grid: use multiples of 8 for x,y coordinates
- Use consistent spacing between components: 40px minimum
- Create components left-to-right, top-to-bottom for logical flow
- Document immediately after creating each component
- Use \`clone_node\` for creating variants to maintain consistency
- Validate organization with \`get_local_components\` after major changes

This systematic approach using Figmation commands creates a scalable, maintainable component library that grows with your design system needs.`;
	}

	private static extractStepsOnly(content: string): string {
		const lines = content.split('\n');
		const stepLines: string[] = [];
		let inStepSection = false;

		for (const line of lines) {
			if (line.includes('Step-by-Step Process') || line.includes('Process')) {
				inStepSection = true;
				stepLines.push(line);
				continue;
			}

			if (inStepSection) {
				if (line.startsWith('##') && !line.includes('Step')) {
					break; // End of steps section
				}
				stepLines.push(line);
			}
		}

		return stepLines.join('\n');
	}

	private static extractSummary(content: string): string {
		const lines = content.split('\n');
		const summaryLines: string[] = [];
		
		// Extract title and goal
		for (const line of lines) {
			if (line.startsWith('#') || line.includes('Goal') || line.includes('## Goal')) {
				summaryLines.push(line);
				if (summaryLines.length >= 4) break; // Title + Goal + content
			}
		}

		// Add a brief process overview
		summaryLines.push('\n## Quick Overview');
		summaryLines.push('This strategy provides step-by-step guidance for implementing the specified workflow. Use the full version for detailed instructions.');

		return summaryLines.join('\n');
	}
}