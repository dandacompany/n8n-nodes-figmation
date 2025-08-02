/**
 * Figma Command Options
 * Extracted from FigmationCommander.node.ts
 * Contains all available Figma commands with their values and descriptions
 */

export interface FigmaCommandOption {
	name: string;
	value: string;
	description: string;
}

export const FIGMA_COMMAND_OPTIONS: readonly FigmaCommandOption[] = [
	{
		name: 'Get Channels',
		value: 'get_channels',
		description: 'Get the list of available channels',
	},
	{
		name: 'Create Rectangle',
		value: 'create_rectangle',
		description: 'Create a rectangle in Figma',
	},
	{
		name: 'Create Frame',
		value: 'create_frame',
		description: 'Create a frame in Figma',
	},
	{
		name: 'Create Text',
		value: 'create_text',
		description: 'Create text in Figma',
	},
	{
		name: 'Get Document Info',
		value: 'get_document_info',
		description: 'Get information about the current document',
	},
	{
		name: 'Get Selection',
		value: 'get_selection',
		description: 'Get currently selected nodes',
	},
	{
		name: 'Move Node',
		value: 'move_node',
		description: 'Move node position',
	},
	{
		name: 'Resize Node',
		value: 'resize_node',
		description: 'Resize node',
	},
	{
		name: 'Delete Node',
		value: 'delete_node',
		description: 'Delete node',
	},
	{
		name: 'Set Fill Color',
		value: 'set_fill_color',
		description: 'Set node fill color',
	},
	{
		name: 'Set Stroke Color',
		value: 'set_stroke_color',
		description: 'Set node stroke color',
	},
	{
		name: 'Clone Node',
		value: 'clone_node',
		description: 'Clone node',
	},
	{
		name: 'Export Node as Image',
		value: 'export_node_as_image',
		description: 'Export node as image',
	},
	{
		name: 'Get Node Info',
		value: 'get_node_info',
		description: 'Get detailed information of a specific node',
	},
	{
		name: 'Get Nodes Info',
		value: 'get_nodes_info',
		description: 'Get detailed information of multiple nodes',
	},
	{
		name: 'Set Text Content',
		value: 'set_text_content',
		description: 'Change the content of a text node',
	},
	{
		name: 'Get Styles',
		value: 'get_styles',
		description: 'Get all styles in the document',
	},
	{
		name: 'Get Components',
		value: 'get_components',
		description: 'Get the list of components in the document',
	},
	{
		name: 'Create Component',
		value: 'create_component',
		description: 'Create a component from existing node IDs',
	},
	{
		name: 'Set Corner Radius',
		value: 'set_corner_radius',
		description: 'Set the corner radius of a node',
	},
	{
		name: 'Scan Text Nodes',
		value: 'scan_text_nodes',
		description: 'Scan all text nodes in the selected node',
	},
	{
		name: 'Scan Nodes by Types',
		value: 'scan_nodes_by_types',
		description: 'Scan nodes of specific types',
	},
	{
		name: 'Set Multiple Text Contents',
		value: 'set_multiple_text_contents',
		description: 'Batch update multiple text contents',
	},
	{
		name: 'Delete Multiple Nodes',
		value: 'delete_multiple_nodes',
		description: 'Batch delete multiple nodes',
	},
	{
		name: 'Set Layout Mode',
		value: 'set_layout_mode',
		description: 'Set the layout mode of a frame',
	},
	{
		name: 'Set Padding',
		value: 'set_padding',
		description: 'Set padding of an auto layout frame',
	},
	{
		name: 'Set Axis Align',
		value: 'set_axis_align',
		description: 'Set axis alignment of auto layout',
	},
	{
		name: 'Set Layout Sizing',
		value: 'set_layout_sizing',
		description: 'Set sizing mode of auto layout',
	},
	{
		name: 'Set Item Spacing',
		value: 'set_item_spacing',
		description: 'Set spacing between auto layout children',
	},
	{
		name: 'Get Annotations',
		value: 'get_annotations',
		description: 'Get annotations of document or node',
	},
	{
		name: 'Set Annotation',
		value: 'set_annotation',
		description: 'Create or update annotation',
	},
	{
		name: 'Get Instance Overrides',
		value: 'get_instance_overrides',
		description: 'Get override properties of a component instance',
	},
	{
		name: 'Set Instance Overrides',
		value: 'set_instance_overrides',
		description: 'Apply overrides to a component instance',
	},
	{
		name: 'Set Default Connector',
		value: 'set_default_connector',
		description: 'Set default connector',
	},
	{
		name: 'Create Connections',
		value: 'create_connections',
		description: 'Create connections between nodes',
	},
	{
		name: 'Create Image from URL',
		value: 'create_image_from_url',
		description: 'Create an image from a URL',
	},
	{
		name: 'Create Slider',
		value: 'create_slider',
		description: 'Create a slider UI component',
	},
	{
		name: 'Create Ellipse',
		value: 'create_ellipse',
		description: 'Create an ellipse/circle shape',
	},
	{
		name: 'Create Vector Path',
		value: 'create_vector_path',
		description: 'Create a custom vector path',
	},
	{
		name: 'Create Button',
		value: 'create_button',
		description: 'Create a button UI component',
	},
	{
		name: 'Create Boolean Operation',
		value: 'create_boolean_operation',
		description: 'Create complex shapes using boolean operations',
	},
	{
		name: 'Create Design from SVG',
		value: 'create_design_from_svg',
		description: 'Create a design from SVG data',
	},
	{
		name: 'Create Input Field',
		value: 'create_input_field',
		description: 'Create an input field UI component',
	},
	{
		name: 'Create Checkbox',
		value: 'create_checkbox',
		description: 'Create a checkbox UI component',
	},
	{
		name: 'Create Toggle',
		value: 'create_toggle',
		description: 'Create a toggle switch UI component',
	},
	{
		name: 'Create Symbol',
		value: 'create_symbol',
		description: 'Create a reusable symbol component',
	},
	{
		name: 'Create Avatar',
		value: 'create_avatar',
		description: 'Create an avatar placeholder',
	},
	{
		name: 'Create Progress Bar',
		value: 'create_progress_bar',
		description: 'Create a progress bar component',
	},
	{
		name: 'Create Group',
		value: 'create_group',
		description: 'Create a group from multiple nodes',
	},
	{
		name: 'Set Opacity',
		value: 'set_opacity',
		description: 'Set the opacity (transparency) of a node',
	},
	{
		name: 'Set Rotation',
		value: 'set_rotation',
		description: 'Set the rotation angle of a node in degrees',
	},
	{
		name: 'Add Drop Shadow',
		value: 'add_drop_shadow',
		description: 'Add a drop shadow effect to a node',
	},
	{
		name: 'Add Inner Shadow',
		value: 'add_inner_shadow',
		description: 'Add an inner shadow effect to a node',
	},
	{
		name: 'Add Blur',
		value: 'add_blur',
		description: 'Add a blur effect to a node',
	},
	{
		name: 'Set Individual Corner Radius',
		value: 'set_individual_corner_radius',
		description: 'Set different corner radius for each corner',
	},
] as const;

/**
 * Get command option by value
 */
export function getCommandByValue(value: string): FigmaCommandOption | undefined {
	return FIGMA_COMMAND_OPTIONS.find(option => option.value === value);
}

/**
 * Get all command values as an array
 */
export function getAllCommandValues(): string[] {
	return FIGMA_COMMAND_OPTIONS.map(option => option.value);
}

/**
 * Check if a command value is valid
 */
export function isValidCommandValue(value: string): boolean {
	return FIGMA_COMMAND_OPTIONS.some(option => option.value === value);
}

/**
 * Default command value
 */
export const DEFAULT_COMMAND = 'get_channels';