import { INodeProperties } from 'n8n-workflow';

// Command options for the main command selector
export const FIGMA_COMMANDS = [
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
		name: 'Create Instance',
		value: 'create_instance',
		description: 'Create an instance from a component',
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
		name: 'Detach Instance',
		value: 'detach_instance',
		description: 'Detach instance from its main component',
	},
	{
		name: 'Set Default Connector',
		value: 'set_default_connector',
		description: 'Set default connector',
	},
	{
		name: 'Create Image from URL',
		value: 'create_image_from_url',
		description: 'Create an image from a URL',
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
	{
		name: 'Select Nodes',
		value: 'select_nodes',
		description: 'Select multiple nodes by their IDs',
	},
	{
		name: 'Select Nodes by Type',
		value: 'select_nodes_by_type',
		description: 'Select all nodes of a specific type',
	},
	{
		name: 'Select Nodes by Name',
		value: 'select_nodes_by_name',
		description: 'Select nodes matching a name pattern',
	},
	{
		name: 'Apply Styles to Selection',
		value: 'apply_styles_to_selection',
		description: 'Apply styles to currently selected nodes',
	},
	{
		name: 'Apply Text Styles to Selection',
		value: 'apply_text_styles_to_selection',
		description: 'Apply text styles to selected text nodes',
	},
	{
		name: 'Search Available Fonts',
		value: 'search_available_fonts',
		description: 'Search for available fonts in Figma',
	},
	{
		name: 'Apply Styles to Nodes',
		value: 'apply_styles_to_nodes',
		description: 'Apply styles to specific nodes by their IDs',
	},
	// Layer order commands
	{
		name: 'Reorder Layer',
		value: 'reorder_layer',
		description: 'Move a layer to a specific index position',
	},
	{
		name: 'Move to Front',
		value: 'move_to_front',
		description: 'Move a layer to the front (top of layer stack)',
	},
	{
		name: 'Move to Back',
		value: 'move_to_back',
		description: 'Move a layer to the back (bottom of layer stack)',
	},
	{
		name: 'Move Forward',
		value: 'move_forward',
		description: 'Move a layer forward by one position',
	},
	{
		name: 'Move Backward',
		value: 'move_backward',
		description: 'Move a layer backward by one position',
	},
	{
		name: 'Sort Layers by Name',
		value: 'sort_layers_by_name',
		description: 'Sort layers alphabetically by name',
	},
	{
		name: 'Sort Layers by Position',
		value: 'sort_layers_by_position',
		description: 'Sort layers by their X/Y position',
	},
	{
		name: 'Reorder Multiple Layers',
		value: 'reorder_multiple_layers',
		description: 'Reorder multiple layers to a specific starting position',
	},
];

// Commands that require parameters
export const COMMANDS_WITH_PARAMETERS = [
	'create_rectangle',
	'create_frame',
	'create_instance',
	'create_text',
	'move_node',
	'resize_node',
	'delete_node',
	'set_fill_color',
	'set_stroke_color',
	'clone_node',
	'export_node_as_image',
	'get_node_info',
	'get_nodes_info',
	'set_text_content',
	'create_component',
	'set_corner_radius',
	'scan_text_nodes',
	'scan_nodes_by_types',
	'set_multiple_text_contents',
	'delete_multiple_nodes',
	'set_layout_mode',
	'set_padding',
	'set_axis_align',
	'set_layout_sizing',
	'set_item_spacing',
	'get_annotations',
	'set_annotation',
	'get_instance_overrides',
	'set_instance_overrides',
	'detach_instance',
	'get_reactions',
	'set_default_connector',
	'create_image_from_url',
	'create_ellipse',
	'create_vector_path',
	'create_boolean_operation',
	'create_design_from_svg',
	'create_group',
	'set_opacity',
	'set_rotation',
	'add_drop_shadow',
	'add_inner_shadow',
	'add_blur',
	'set_individual_corner_radius',
	'select_nodes',
	'select_nodes_by_type',
	'select_nodes_by_name',
	'apply_styles_to_selection',
	'apply_text_styles_to_selection',
	'apply_styles_to_nodes',
	'reorder_layer',
	'move_to_front',
	'move_to_back',
	'move_forward',
	'move_backward',
	'sort_layers_by_name',
	'sort_layers_by_position',
	'reorder_multiple_layers',
	'search_available_fonts',
];

// Parameter definitions for the parameters collection
export const PARAMETER_DEFINITIONS: INodeProperties[] = [
	// Position and size parameters
	{
		displayName: 'X Position',
		name: 'x',
		type: 'number',
		default: 100,
		description: 'X coordinate',
		displayOptions: {
			show: {
				'/command': ['create_design_from_svg', 'create_rectangle', 'create_frame', 'create_instance', 'create_text', 'move_node', 'create_image_from_url', 'create_ellipse'],
			},
		},
	},
	{
		displayName: 'Y Position',
		name: 'y',
		type: 'number',
		default: 100,
		description: 'Y coordinate',
		displayOptions: {
			show: {
				'/command': ['create_design_from_svg', 'create_rectangle', 'create_frame', 'create_instance', 'create_text', 'move_node', 'create_image_from_url', 'create_ellipse'],
			},
		},
	},
	{
		displayName: 'Width',
		name: 'width',
		type: 'number',
		default: 100,
		description: 'Width',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'resize_node', 'create_image_from_url', 'create_ellipse'],
			},
		},
	},
	{
		displayName: 'Height',
		name: 'height',
		type: 'number',
		default: 100,
		description: 'Height',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'resize_node', 'create_image_from_url', 'create_ellipse'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: 'New Layer',
		description: 'Object name',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_text', 'create_image_from_url', 'create_ellipse', 'create_group'],
			},
		},
	},
	{
		displayName: 'Instance Name',
		name: 'name',
		type: 'string',
		default: 'New Instance',
		description: 'Name for the new instance',
		displayOptions: {
			show: {
				'/command': ['create_instance'],
			},
		},
	},
	// Text parameters
	{
		displayName: 'Text Content',
		name: 'textContent',
		type: 'string',
		default: 'Hello World',
		description: 'Text content',
		displayOptions: {
			show: {
				'/command': ['create_text'],
			},
		},
	},
	{
		displayName: 'Font Size',
		name: 'fontSize',
		type: 'number',
		default: 16,
		description: 'Font size',
		displayOptions: {
			show: {
				'/command': ['create_text'],
			},
		},
	},
	// Node ID parameter
	{
		displayName: 'Node ID',
		name: 'nodeId',
		type: 'string',
		default: '',
		description: 'Target node ID',
		displayOptions: {
			show: {
				'/command': ['move_node', 'resize_node', 'delete_node', 'set_fill_color', 'set_stroke_color', 'clone_node', 'export_node_as_image', 'get_node_info', 'set_text_content', 'set_corner_radius', 'scan_text_nodes', 'scan_nodes_by_types', 'set_layout_mode', 'set_padding', 'set_axis_align', 'set_layout_sizing', 'set_item_spacing', 'get_annotations', 'set_annotation', 'get_instance_overrides', 'detach_instance', 'set_opacity', 'set_rotation', 'add_drop_shadow', 'add_inner_shadow', 'add_blur', 'set_individual_corner_radius', 'move_to_front', 'move_forward', 'move_backward', 'move_to_back'],
			},
		},
	},
	// Component ID parameter for create_instance
	{
		displayName: 'Component ID',
		name: 'componentId',
		type: 'string',
		default: '123:456',
		description: 'The ID of the component to create an instance from',
		displayOptions: {
			show: {
				'/command': ['create_instance'],
			},
		},
	},
	// New Text Content parameter for set_text_content command
	{
		displayName: 'New Text Content',
		name: 'newTextContent',
		type: 'string',
		default: 'Updated Text',
		description: 'New text content to set for the text node',
		displayOptions: {
			show: {
				'/command': ['set_text_content'],
			},
		},
	},
	// Fill Type selection
	{
		displayName: 'Fill Type',
		name: 'Fill_Type',
		type: 'options',
		default: 'solid',
		options: [
			{
				name: 'Solid Color',
				value: 'solid',
				description: 'Single solid color',
			},
			{
				name: 'Linear Gradient',
				value: 'linear_gradient',
				description: 'Linear gradient between colors',
			},
			{
				name: 'Radial Gradient',
				value: 'radial_gradient',
				description: 'Radial gradient from center',
			},
			{
				name: 'Angular Gradient',
				value: 'angular_gradient',
				description: 'Angular/conical gradient',
			},
			{
				name: 'Diamond Gradient',
				value: 'diamond_gradient',
				description: 'Diamond-shaped gradient',
			},
		],
		displayOptions: {
			show: {
				'/command': ['set_fill_color'],
			},
		},
	},
	// Solid Color parameters
	{
		displayName: 'Red Value',
		name: 'Red_Value',
		type: 'number',
		default: 0.5,
		description: 'Red value (0-1)',
		displayOptions: {
			show: {
				'/command': ['set_fill_color'],
				'Fill_Type': ['solid'],
			},
		},
	},
	{
		displayName: 'Stroke Red Value',
		name: 'Stroke_Red_Value',
		type: 'number',
		default: 0.5,
		description: 'Stroke red value (0-1)',
		displayOptions: {
			show: {
				'/command': ['set_stroke_color'],
			},
		},
	},
	{
		displayName: 'Green Value',
		name: 'Green_Value',
		type: 'number',
		default: 0.5,
		description: 'Green value (0-1)',
		displayOptions: {
			show: {
				'/command': ['set_fill_color'],
				'Fill_Type': ['solid'],
			},
		},
	},
	{
		displayName: 'Stroke Green Value',
		name: 'Stroke_Green_Value',
		type: 'number',
		default: 0.5,
		description: 'Stroke green value (0-1)',
		displayOptions: {
			show: {
				'/command': ['set_stroke_color'],
			},
		},
	},
	{
		displayName: 'Blue Value',
		name: 'Blue_Value',
		type: 'number',
		default: 0.5,
		description: 'Blue value (0-1)',
		displayOptions: {
			show: {
				'/command': ['set_fill_color'],
				'Fill_Type': ['solid'],
			},
		},
	},
	{
		displayName: 'Stroke Blue Value',
		name: 'Stroke_Blue_Value',
		type: 'number',
		default: 0.5,
		description: 'Stroke blue value (0-1)',
		displayOptions: {
			show: {
				'/command': ['set_stroke_color'],
			},
		},
	},
	{
		displayName: 'Alpha Value',
		name: 'Alpha_Value',
		type: 'number',
		default: 1,
		description: 'Alpha value (0-1)',
		displayOptions: {
			show: {
				'/command': ['set_fill_color'],
				'Fill_Type': ['solid'],
			},
		},
	},
	{
		displayName: 'Stroke Alpha Value',
		name: 'Stroke_Alpha_Value',
		type: 'number',
		default: 1,
		description: 'Stroke alpha value (0-1)',
		displayOptions: {
			show: {
				'/command': ['set_stroke_color'],
			},
		},
	},
	{
		displayName: 'Remove Stroke',
		name: 'Remove_Stroke',
		type: 'boolean',
		default: false,
		description: 'Remove stroke completely (overrides color settings)',
		displayOptions: {
			show: {
				'/command': ['set_stroke_color'],
			},
		},
	},
	// Gradient parameters
	{
		displayName: 'Gradient Start Color',
		name: 'Gradient_Start_Color',
		type: 'string',
		default: '#FF0000',
		description: 'Gradient start color (hex format)',
		displayOptions: {
			show: {
				'/command': ['set_fill_color'],
				'Fill_Type': ['linear_gradient', 'radial_gradient', 'angular_gradient', 'diamond_gradient'],
			},
		},
	},
	{
		displayName: 'Gradient End Color',
		name: 'Gradient_End_Color',
		type: 'string',
		default: '#0000FF',
		description: 'Gradient end color (hex format)',
		displayOptions: {
			show: {
				'/command': ['set_fill_color'],
				'Fill_Type': ['linear_gradient', 'radial_gradient', 'angular_gradient', 'diamond_gradient'],
			},
		},
	},
	{
		displayName: 'Gradient Angle',
		name: 'Gradient_Angle',
		type: 'number',
		default: 45,
		description: 'Gradient angle in degrees (0-360)',
		displayOptions: {
			show: {
				'/command': ['set_fill_color'],
				'Fill_Type': ['linear_gradient', 'angular_gradient'],
			},
		},
	},
	// Export parameters
	{
		displayName: 'Export Scale',
		name: 'scale',
		type: 'number',
		default: 1,
		description: 'Export scale',
		displayOptions: {
			show: {
				'/command': ['export_node_as_image'],
			},
		},
	},
	{
		displayName: 'Export Format',
		name: 'format',
		type: 'options',
		options: [
			{
				name: 'PNG',
				value: 'PNG',
			},
			{
				name: 'JPG',
				value: 'JPG',
			},
			{
				name: 'SVG',
				value: 'SVG',
			},
		],
		default: 'PNG',
		description: 'Export format',
		displayOptions: {
			show: {
				'/command': ['export_node_as_image'],
			},
		},
	},
	// Node IDs parameter
	{
		displayName: 'Node IDs',
		name: 'nodeIds',
		type: 'string',
		default: '123:456',
		description: 'Node IDs (comma separated)',
		displayOptions: {
			show: {
				'/command': ['get_nodes_info', 'delete_multiple_nodes', 'create_group'],
			},
		},
	},
	{
		displayName: 'Corner Radius',
		name: 'cornerRadius',
		type: 'number',
		default: 10,
		description: 'Corner radius',
		displayOptions: {
			show: {
				'/command': ['set_corner_radius', 'create_image_from_url', 'create_rectangle', 'create_frame'],
			},
		},
	},
	{
		displayName: 'Node Types',
		name: 'nodeTypes',
		type: 'string',
		default: 'TEXT,FRAME',
		description: 'Node types to search (comma separated, e.g. TEXT,FRAME)',
		displayOptions: {
			show: {
				'/command': ['scan_nodes_by_types'],
			},
		},
	},
	{
		displayName: 'Text Updates',
		name: 'textUpdates',
		type: 'string',
		default: '[{"nodeId":"123:456","text":"Hello"}]',
		description: 'Text updates array in JSON format',
		displayOptions: {
			show: {
				'/command': ['set_multiple_text_contents'],
			},
		},
	},
	{
		displayName: 'Layout Mode',
		name: 'layoutMode',
		type: 'options',
		options: [
			{
				name: 'NONE',
				value: 'NONE',
			},
			{
				name: 'HORIZONTAL',
				value: 'HORIZONTAL',
			},
			{
				name: 'VERTICAL',
				value: 'VERTICAL',
			},
		],
		default: 'VERTICAL',
		description: 'Layout mode',
		displayOptions: {
			show: {
				'/command': ['set_layout_mode'],
			},
		},
	},
	// Padding parameters
	{
		displayName: 'Padding Top',
		name: 'paddingTop',
		type: 'number',
		default: 10,
		description: 'Top padding',
		displayOptions: {
			show: {
				'/command': ['set_padding'],
			},
		},
	},
	{
		displayName: 'Padding Right',
		name: 'paddingRight',
		type: 'number',
		default: 10,
		description: 'Right padding',
		displayOptions: {
			show: {
				'/command': ['set_padding'],
			},
		},
	},
	{
		displayName: 'Padding Bottom',
		name: 'paddingBottom',
		type: 'number',
		default: 10,
		description: 'Bottom padding',
		displayOptions: {
			show: {
				'/command': ['set_padding'],
			},
		},
	},
	{
		displayName: 'Padding Left',
		name: 'paddingLeft',
		type: 'number',
		default: 10,
		description: 'Left padding',
		displayOptions: {
			show: {
				'/command': ['set_padding'],
			},
		},
	},
	{
		displayName: 'Item Spacing',
		name: 'itemSpacing',
		type: 'number',
		default: 10,
		description: 'Item spacing',
		displayOptions: {
			show: {
				'/command': ['set_item_spacing'],
			},
		},
	},
	{
		displayName: 'Annotation Text',
		name: 'annotationText',
		type: 'string',
		default: 'Hello',
		description: 'Annotation text',
		displayOptions: {
			show: {
				'/command': ['set_annotation'],
			},
		},
	},
	{
		displayName: 'Node ID',
		name: 'nodeId',
		type: 'string',
		default: '123:456',
		description: 'Instance node ID to apply overrides',
		displayOptions: {
			show: {
				'/command': ['set_instance_overrides'],
			},
		},
	},
	{
		displayName: 'Component Properties',
		name: 'componentProperties',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Component variant properties to override',
		displayOptions: {
			show: {
				'/command': ['set_instance_overrides', 'create_instance'],
			},
		},
		options: [
			{
				name: 'property',
				displayName: 'Property',
				values: [
					{
						displayName: 'Property Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name of the component property (e.g., State, Size)',
					},
					{
						displayName: 'Property Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value for the property (e.g., hover, large)',
					},
				],
			},
		],
	},
	{
		displayName: 'Connector ID',
		name: 'connectorId',
		type: 'string',
		default: '123:456',
		description: 'Connector node ID',
		displayOptions: {
			show: {
				'/command': ['set_default_connector'],
			},
		},
	},
	// Image source type selection
	{
		displayName: 'Image Source Type',
		name: 'imageSourceType',
		type: 'options',
		options: [
			{
				name: 'URL',
				value: 'url',
				description: 'Load image from URL',
			},
			{
				name: 'Binary Data',
				value: 'binary',
				description: 'Use binary image data from previous node',
			},
		],
		default: 'url',
		description: 'How to provide the image data',
		displayOptions: {
			show: {
				'/command': ['create_image_from_url'],
			},
		},
	},
	// Image from URL parameters
	{
		displayName: 'Image URL',
		name: 'url',
		type: 'string',
		default: 'https://example.com/image.png',
		description: 'URL of the image to load',
		required: true,
		displayOptions: {
			show: {
				'/command': ['create_image_from_url'],
				'imageSourceType': ['url'],
			},
		},
	},
	// Binary data parameters
	{
		displayName: 'Binary Property',
		name: 'binaryProperty',
		type: 'string',
		default: 'image',
		description: 'Name of the binary property containing the image',
		required: true,
		displayOptions: {
			show: {
				'/command': ['create_image_from_url'],
				'imageSourceType': ['binary'],
			},
		},
	},
	{
		displayName: 'Parent Node ID',
		name: 'parentIdForImage',
		type: 'string',
		default: '',
		description: 'ID of the parent node to place the object under (optional)',
		displayOptions: {
			show: {
				'/command': ['create_image_from_url'],
			},
		},
	},
	{
		displayName: 'Scale Mode',
		name: 'scaleMode',
		type: 'options',
		options: [
			{
				name: 'Fill',
				value: 'FILL',
				description: 'Fill the entire frame',
			},
			{
				name: 'Fit',
				value: 'FIT',
				description: 'Fit within the frame',
			},
			{
				name: 'Crop',
				value: 'CROP',
				description: 'Crop to fill the frame',
			},
			{
				name: 'Tile',
				value: 'TILE',
				description: 'Tile the image',
			},
		],
		default: 'FILL',
		description: 'How the image should be scaled within the frame',
		displayOptions: {
			show: {
				'/command': ['create_image_from_url'],
			},
		},
	},
	// Vector path parameters
	{
		displayName: 'SVG Path Data',
		name: 'pathData',
		type: 'string',
		default: 'M 0 0 L 100 0 L 100 100 Z',
		description: 'SVG path data for the vector shape',
		displayOptions: {
			show: {
				'/command': ['create_vector_path'],
			},
		},
	},
	{
		displayName: 'SVG Content',
		name: 'svgContent',
		type: 'string',
		default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M 0 0 L 100 0 L 100 100 Z" /></svg>',
		description: 'Complete SVG markup for icon creation or vector conversion',
		displayOptions: {
			show: {
				'/command': ['create_design_from_svg'],
			},
		},
	},
	// Boolean operation parameters
	{
		displayName: 'Operation Type',
		name: 'operation',
		type: 'options',
		options: [
			{
				name: 'Union',
				value: 'UNION',
				description: 'Combine shapes',
			},
			{
				name: 'Subtract',
				value: 'SUBTRACT',
				description: 'Subtract top shape from bottom',
			},
			{
				name: 'Intersect',
				value: 'INTERSECT',
				description: 'Keep only overlapping areas',
			},
			{
				name: 'Exclude',
				value: 'EXCLUDE',
				description: 'Remove overlapping areas',
			},
		],
		default: 'UNION',
		description: 'Type of boolean operation',
		displayOptions: {
			show: {
				'/command': ['create_boolean_operation'],
			},
		},
	},
	{
		displayName: 'Source Node IDs',
		name: 'sourceNodeIds',
		type: 'string',
		default: '123:456,456:789',
		description: 'Comma-separated list of node IDs to combine',
		displayOptions: {
			show: {
				'/command': ['create_boolean_operation'],
			},
		},
	},
	// Parent ID for new commands
	{
		displayName: 'Parent Node ID',
		name: 'parentIdForNode',
		type: 'string',
		default: '',
		description: 'ID of the parent node to place the object under (optional)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_instance', 'create_ellipse', 'create_text', 'create_vector_path', 'create_boolean_operation', 'create_icon_from_svg', 'create_group', 'create_design_from_svg'],
			},
		},
	},
	// Advanced Figma API Properties - Fill Color (simplified)
	{
		displayName: 'Fill Color (R)',
		name: 'Fill_Color_R',
		type: 'number',
		default: 0.5,
		description: 'Fill color red value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'apply_styles_to_selection', 'apply_styles_to_nodes'],
			},
		},
	},
	{
		displayName: 'Fill Color (G)',
		name: 'Fill_Color_G',
		type: 'number',
		default: 0.5,
		description: 'Fill color green value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'apply_styles_to_selection', 'apply_styles_to_nodes'],
			},
		},
	},
	{
		displayName: 'Fill Color (B)',
		name: 'Fill_Color_B',
		type: 'number',
		default: 0.5,
		description: 'Fill color blue value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'apply_styles_to_selection', 'apply_styles_to_nodes'],
			},
		},
	},
	{
		displayName: 'Fill Color (A)',
		name: 'Fill_Color_A',
		type: 'number',
		default: 1,
		description: 'Fill color alpha value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'apply_styles_to_selection', 'apply_styles_to_nodes'],
			},
		},
	},
	// Stroke Properties
	{
		displayName: 'Stroke Color (R)',
		name: 'Stroke_Color_R',
		type: 'number',
		default: 0,
		description: 'Stroke color red value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'apply_styles_to_selection', 'apply_styles_to_nodes'],
			},
		},
	},
	{
		displayName: 'Stroke Color (G)',
		name: 'Stroke_Color_G',
		type: 'number',
		default: 0,
		description: 'Stroke color green value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'apply_styles_to_selection', 'apply_styles_to_nodes'],
			},
		},
	},
	{
		displayName: 'Stroke Color (B)',
		name: 'Stroke_Color_B',
		type: 'number',
		default: 0,
		description: 'Stroke color blue value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'apply_styles_to_selection', 'apply_styles_to_nodes'],
			},
		},
	},
	{
		displayName: 'Stroke Color (A)',
		name: 'Stroke_Color_A',
		type: 'number',
		default: 1,
		description: 'Stroke color alpha value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'apply_styles_to_selection', 'apply_styles_to_nodes'],
			},
		},
	},
	{
		displayName: 'Stroke Weight',
		name: 'strokeWeight',
		type: 'number',
		default: 1,
		description: 'Stroke width in pixels',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'apply_styles_to_selection', 'apply_styles_to_nodes'],
			},
		},
	},
	// Text-specific properties
	{
		displayName: 'Font Color (R)',
		name: 'Font_Color_R',
		type: 'number',
		default: 0,
		description: 'Font color red value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_text', 'apply_text_styles_to_selection'],
			},
		},
	},
	{
		displayName: 'Font Color (G)',
		name: 'Font_Color_G',
		type: 'number',
		default: 0,
		description: 'Font color green value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_text', 'apply_text_styles_to_selection'],
			},
		},
	},
	{
		displayName: 'Font Color (B)',
		name: 'Font_Color_B',
		type: 'number',
		default: 0,
		description: 'Font color blue value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_text', 'apply_text_styles_to_selection'],
			},
		},
	},
	{
		displayName: 'Font Color (A)',
		name: 'Font_Color_A',
		type: 'number',
		default: 1,
		description: 'Font color alpha value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_text', 'apply_text_styles_to_selection'],
			},
		},
	},
	// Common properties
	{
		displayName: 'Opacity',
		name: 'initialOpacity',
		type: 'number',
		default: 1,
		description: 'Initial opacity value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'apply_styles_to_selection', 'apply_styles_to_nodes'],
			},
		},
	},
	{
		displayName: 'Rotation',
		name: 'initialRotation',
		type: 'number',
		default: 0,
		description: 'Initial rotation angle in degrees',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
			},
		},
	},
	{
		displayName: 'Initial Corner Radius',
		name: 'initialCornerRadius',
		type: 'number',
		default: 0,
		description: 'Initial corner radius for rectangles and frames',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'apply_styles_to_selection', 'apply_styles_to_nodes'],
			},
		},
	},
	{
		displayName: 'Visible',
		name: 'visible',
		type: 'boolean',
		default: true,
		description: 'Whether the node is visible',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
			},
		},
	},
	{
		displayName: 'Locked',
		name: 'locked',
		type: 'boolean',
		default: false,
		description: 'Whether the node is locked',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
			},
		},
	},
	// Drop Shadow Effect
	{
		displayName: 'Add Drop Shadow',
		name: 'addDropShadow',
		type: 'boolean',
		default: false,
		description: 'Add a drop shadow effect',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'apply_styles_to_selection'],
			},
		},
	},
	{
		displayName: 'Shadow Offset X',
		name: 'initialShadowOffsetX',
		type: 'number',
		default: 0,
		description: 'Shadow horizontal offset',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
				'addDropShadow': [true],
			},
		},
	},
	{
		displayName: 'Shadow Offset Y',
		name: 'initialShadowOffsetY',
		type: 'number',
		default: 4,
		description: 'Shadow vertical offset',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
				'addDropShadow': [true],
			},
		},
	},
	{
		displayName: 'Shadow Blur',
		name: 'initialShadowBlur',
		type: 'number',
		default: 8,
		description: 'Shadow blur radius',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
				'addDropShadow': [true],
			},
		},
	},
	{
		displayName: 'Shadow Color (R)',
		name: 'initialShadowColorR',
		type: 'number',
		default: 0,
		description: 'Shadow red value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
				'addDropShadow': [true],
			},
		},
	},
	{
		displayName: 'Shadow Color (G)',
		name: 'initialShadowColorG',
		type: 'number',
		default: 0,
		description: 'Shadow green value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
				'addDropShadow': [true],
			},
		},
	},
	{
		displayName: 'Shadow Color (B)',
		name: 'initialShadowColorB',
		type: 'number',
		default: 0,
		description: 'Shadow blue value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
				'addDropShadow': [true],
			},
		},
	},
	{
		displayName: 'Shadow Color (A)',
		name: 'initialShadowColorA',
		type: 'number',
		default: 0.25,
		description: 'Shadow alpha value (0-1)',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
				'addDropShadow': [true],
			},
		},
	},
	// Frame-specific Auto Layout properties
	{
		displayName: 'Layout Mode',
		name: 'initialLayoutMode',
		type: 'options',
		options: [
			{
				name: 'None',
				value: 'NONE',
			},
			{
				name: 'Horizontal',
				value: 'HORIZONTAL',
			},
			{
				name: 'Vertical',
				value: 'VERTICAL',
			},
		],
		default: 'NONE',
		description: 'Auto layout mode for frames',
		displayOptions: {
			show: {
				'/command': ['create_frame'],
			},
		},
	},
	{
		displayName: 'Padding Top',
		name: 'initialPaddingTop',
		type: 'number',
		default: 0,
		description: 'Top padding for auto layout frames',
		displayOptions: {
			show: {
				'/command': ['create_frame'],
				'initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
			},
		},
	},
	{
		displayName: 'Padding Right',
		name: 'initialPaddingRight',
		type: 'number',
		default: 0,
		description: 'Right padding for auto layout frames',
		displayOptions: {
			show: {
				'/command': ['create_frame'],
				'initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
			},
		},
	},
	{
		displayName: 'Padding Bottom',
		name: 'initialPaddingBottom',
		type: 'number',
		default: 0,
		description: 'Bottom padding for auto layout frames',
		displayOptions: {
			show: {
				'/command': ['create_frame'],
				'initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
			},
		},
	},
	{
		displayName: 'Padding Left',
		name: 'initialPaddingLeft',
		type: 'number',
		default: 0,
		description: 'Left padding for auto layout frames',
		displayOptions: {
			show: {
				'/command': ['create_frame'],
				'initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
			},
		},
	},
	{
		displayName: 'Item Spacing',
		name: 'initialItemSpacing',
		type: 'number',
		default: 0,
		description: 'Spacing between auto layout children',
		displayOptions: {
			show: {
				'/command': ['create_frame'],
				'initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
			},
		},
	},
	// Style command parameters - Opacity
	{
		displayName: 'Opacity',
		name: 'opacity',
		type: 'number',
		default: 0.5,
		description: 'Opacity value (0-1)',
		displayOptions: {
			show: {
				'/command': ['set_opacity'],
			},
		},
	},
	// Style command parameters - Rotation
	{
		displayName: 'Rotation Angle',
		name: 'rotation',
		type: 'number',
		default: 0,
		description: 'Rotation angle in degrees',
		displayOptions: {
			show: {
				'/command': ['set_rotation'],
			},
		},
	},
	// Shadow X Offset
	{
		displayName: 'Shadow X Offset',
		name: 'shadowOffsetX',
		type: 'number',
		default: 0,
		description: 'Shadow horizontal offset',
		displayOptions: {
			show: {
				'/command': ['add_drop_shadow', 'add_inner_shadow'],
			},
		},
	},
	// Shadow Y Offset
	{
		displayName: 'Shadow Y Offset',
		name: 'shadowOffsetY',
		type: 'number',
		default: 0,
		description: 'Shadow vertical offset',
		displayOptions: {
			show: {
				'/command': ['add_drop_shadow', 'add_inner_shadow'],
			},
		},
	},
	// Shadow Blur
	{
		displayName: 'Shadow Blur',
		name: 'shadowBlur',
		type: 'number',
		default: 0,
		description: 'Shadow blur radius',
		displayOptions: {
			show: {
				'/command': ['add_drop_shadow', 'add_inner_shadow'],
			},
		},
	},
	// Shadow Color
	{
		displayName: 'Shadow Color (R)',
		name: 'shadowColorR',
		type: 'number',
		default: 0,
		description: 'Shadow red value (0-1)',
		displayOptions: {
			show: {
				'/command': ['add_drop_shadow', 'add_inner_shadow'],
			},
		},
	},
	{
		displayName: 'Shadow Color (G)',
		name: 'shadowColorG',
		type: 'number',
		default: 0,
		description: 'Shadow green value (0-1)',
		displayOptions: {
			show: {
				'/command': ['add_drop_shadow', 'add_inner_shadow'],
			},
		},
	},
	{
		displayName: 'Shadow Color (B)',
		name: 'shadowColorB',
		type: 'number',
		default: 0,
		description: 'Shadow blue value (0-1)',
		displayOptions: {
			show: {
				'/command': ['add_drop_shadow', 'add_inner_shadow'],
			},
		},
	},
	{
		displayName: 'Shadow Color (A)',
		name: 'shadowColorA',
		type: 'number',
		default: 0.25,
		description: 'Shadow alpha value (0-1)',
		displayOptions: {
			show: {
				'/command': ['add_drop_shadow', 'add_inner_shadow'],
			},
		},
	},
	// Blur Effect Parameters
	{
		displayName: 'Blur Radius',
		name: 'blurRadius',
		type: 'number',
		default: 0,
		description: 'Blur effect radius',
		displayOptions: {
			show: {
				'/command': ['add_blur'],
			},
		},
	},
	// Individual Corner Radius Parameters
	{
		displayName: 'Top Left Radius',
		name: 'topLeftRadius',
		type: 'number',
		default: 0,
		description: 'Top left corner radius',
		displayOptions: {
			show: {
				'/command': ['set_individual_corner_radius'],
			},
		},
	},
	{
		displayName: 'Top Right Radius',
		name: 'topRightRadius',
		type: 'number',
		default: 0,
		description: 'Top right corner radius',
		displayOptions: {
			show: {
				'/command': ['set_individual_corner_radius'],
			},
		},
	},
	{
		displayName: 'Bottom Right Radius',
		name: 'bottomRightRadius',
		type: 'number',
		default: 0,
		description: 'Bottom right corner radius',
		displayOptions: {
			show: {
				'/command': ['set_individual_corner_radius'],
			},
		},
	},
	{
		displayName: 'Bottom Left Radius',
		name: 'bottomLeftRadius',
		type: 'number',
		default: 0,
		description: 'Bottom left corner radius',
		displayOptions: {
			show: {
				'/command': ['set_individual_corner_radius'],
			},
		},
	},
	// Advanced Figma API Properties
	{
		displayName: 'Blend Mode',
		name: 'blendMode',
		type: 'options',
		options: [
			{ name: 'Normal', value: 'NORMAL' },
			{ name: 'Multiply', value: 'MULTIPLY' },
			{ name: 'Screen', value: 'SCREEN' },
			{ name: 'Overlay', value: 'OVERLAY' },
			{ name: 'Soft Light', value: 'SOFT_LIGHT' },
			{ name: 'Hard Light', value: 'HARD_LIGHT' },
			{ name: 'Color Dodge', value: 'COLOR_DODGE' },
			{ name: 'Color Burn', value: 'COLOR_BURN' },
			{ name: 'Darken', value: 'DARKEN' },
			{ name: 'Lighten', value: 'LIGHTEN' },
			{ name: 'Difference', value: 'DIFFERENCE' },
			{ name: 'Exclusion', value: 'EXCLUSION' },
			{ name: 'Hue', value: 'HUE' },
			{ name: 'Saturation', value: 'SATURATION' },
			{ name: 'Color', value: 'COLOR' },
			{ name: 'Luminosity', value: 'LUMINOSITY' },
		],
		default: 'NORMAL',
		description: 'Blend mode for the node',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
			},
		},
	},
	{
		displayName: 'Horizontal Constraint',
		name: 'horizontalConstraint',
		type: 'options',
		options: [
			{ name: 'Left', value: 'LEFT' },
			{ name: 'Right', value: 'RIGHT' },
			{ name: 'Center', value: 'CENTER' },
			{ name: 'Left and Right', value: 'LEFT_RIGHT' },
			{ name: 'Scale', value: 'SCALE' },
		],
		default: 'LEFT',
		description: 'Horizontal layout constraint',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
			},
		},
	},
	{
		displayName: 'Vertical Constraint',
		name: 'verticalConstraint',
		type: 'options',
		options: [
			{ name: 'Top', value: 'TOP' },
			{ name: 'Bottom', value: 'BOTTOM' },
			{ name: 'Center', value: 'CENTER' },
			{ name: 'Top and Bottom', value: 'TOP_BOTTOM' },
			{ name: 'Scale', value: 'SCALE' },
		],
		default: 'TOP',
		description: 'Vertical layout constraint',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
			},
		},
	},
	{
		displayName: 'Stroke Cap',
		name: 'strokeCap',
		type: 'options',
		options: [
			{ name: 'None', value: 'NONE' },
			{ name: 'Round', value: 'ROUND' },
			{ name: 'Square', value: 'SQUARE' },
			{ name: 'Line Arrow', value: 'LINE_ARROW' },
			{ name: 'Triangle Arrow', value: 'TRIANGLE_ARROW' },
		],
		default: 'NONE',
		description: 'Type of cap to use for open paths',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
			},
		},
	},
	{
		displayName: 'Stroke Join',
		name: 'strokeJoin',
		type: 'options',
		options: [
			{ name: 'Miter', value: 'MITER' },
			{ name: 'Bevel', value: 'BEVEL' },
			{ name: 'Round', value: 'ROUND' },
		],
		default: 'MITER',
		description: 'Type of join to use for connecting stroke segments',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
			},
		},
	},
	{
		displayName: 'Stroke Align',
		name: 'strokeAlign',
		type: 'options',
		options: [
			{ name: 'Inside', value: 'INSIDE' },
			{ name: 'Outside', value: 'OUTSIDE' },
			{ name: 'Center', value: 'CENTER' },
		],
		default: 'INSIDE',
		description: 'Position of stroke relative to the vector outline',
		displayOptions: {
			show: {
				'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'apply_styles_to_selection', 'apply_styles_to_nodes'],
			},
		},
	},
	// Text-specific properties
	{
		displayName: 'Font Family',
		name: 'fontFamily',
		type: 'string',
		default: 'Inter',
		description: 'Font family name',
		displayOptions: {
			show: {
				'/command': ['create_text', 'apply_text_styles_to_selection'],
			},
		},
	},
	{
		displayName: 'Font Weight',
		name: 'fontWeight',
		type: 'options',
		options: [
			{ name: 'Thin (100)', value: 100 },
			{ name: 'Extra Light (200)', value: 200 },
			{ name: 'Light (300)', value: 300 },
			{ name: 'Regular (400)', value: 400 },
			{ name: 'Medium (500)', value: 500 },
			{ name: 'Semi Bold (600)', value: 600 },
			{ name: 'Bold (700)', value: 700 },
			{ name: 'Extra Bold (800)', value: 800 },
			{ name: 'Black (900)', value: 900 },
		],
		default: 400,
		description: 'Font weight',
		displayOptions: {
			show: {
				'/command': ['create_text', 'apply_text_styles_to_selection'],
			},
		},
	},
	{
		displayName: 'Letter Spacing',
		name: 'letterSpacing',
		type: 'number',
		default: 0,
		description: 'Letter spacing in pixels',
		displayOptions: {
			show: {
				'/command': ['create_text', 'apply_text_styles_to_selection'],
			},
		},
	},
	{
		displayName: 'Line Height',
		name: 'lineHeight',
		type: 'number',
		default: 1,
		description: 'Line height multiplier',
		displayOptions: {
			show: {
				'/command': ['create_text', 'apply_text_styles_to_selection'],
			},
		},
	},
	{
		displayName: 'Text Align Horizontal',
		name: 'textAlignHorizontal',
		type: 'options',
		options: [
			{ name: 'Left', value: 'LEFT' },
			{ name: 'Center', value: 'CENTER' },
			{ name: 'Right', value: 'RIGHT' },
			{ name: 'Justified', value: 'JUSTIFIED' },
		],
		default: 'LEFT',
		description: 'Horizontal text alignment',
		displayOptions: {
			show: {
				'/command': ['create_text'],
			},
		},
	},
	{
		displayName: 'Text Align Vertical',
		name: 'textAlignVertical',
		type: 'options',
		options: [
			{ name: 'Top', value: 'TOP' },
			{ name: 'Center', value: 'CENTER' },
			{ name: 'Bottom', value: 'BOTTOM' },
		],
		default: 'TOP',
		description: 'Vertical text alignment',
		displayOptions: {
			show: {
				'/command': ['create_text'],
			},
		},
	},
	{
		displayName: 'Text Auto Resize',
		name: 'textAutoResize',
		type: 'options',
		options: [
			{ name: 'None', value: 'NONE' },
			{ name: 'Width and Height', value: 'WIDTH_AND_HEIGHT' },
			{ name: 'Height', value: 'HEIGHT' },
			{ name: 'Truncate', value: 'TRUNCATE' },
		],
		default: 'WIDTH_AND_HEIGHT',
		description: 'Text auto-resize behavior',
		displayOptions: {
			show: {
				'/command': ['create_text'],
			},
		},
	},
	// Frame-specific Auto Layout properties
	{
		displayName: 'Primary Axis Sizing Mode',
		name: 'primaryAxisSizingMode',
		type: 'options',
		options: [
			{ name: 'Fixed', value: 'FIXED' },
			{ name: 'Auto', value: 'AUTO' },
		],
		default: 'AUTO',
		description: 'Primary axis sizing mode for auto layout',
		displayOptions: {
			show: {
				'/command': ['create_frame'],
				'initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
			},
		},
	},
	{
		displayName: 'Counter Axis Sizing Mode',
		name: 'counterAxisSizingMode',
		type: 'options',
		options: [
			{ name: 'Fixed', value: 'FIXED' },
			{ name: 'Auto', value: 'AUTO' },
		],
		default: 'AUTO',
		description: 'Counter axis sizing mode for auto layout',
		displayOptions: {
			show: {
				'/command': ['create_frame'],
				'initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
			},
		},
	},
	{
		displayName: 'Primary Axis Align Items',
		name: 'primaryAxisAlignItems',
		type: 'options',
		options: [
			{ name: 'Min', value: 'MIN' },
			{ name: 'Center', value: 'CENTER' },
			{ name: 'Max', value: 'MAX' },
			{ name: 'Space Between', value: 'SPACE_BETWEEN' },
		],
		default: 'MIN',
		description: 'Primary axis alignment for auto layout',
		displayOptions: {
			show: {
				'/command': ['create_frame'],
				'initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
			},
		},
	},
	{
		displayName: 'Counter Axis Align Items',
		name: 'counterAxisAlignItems',
		type: 'options',
		options: [
			{ name: 'Min', value: 'MIN' },
			{ name: 'Center', value: 'CENTER' },
			{ name: 'Max', value: 'MAX' },
		],
		default: 'MIN',
		description: 'Counter axis alignment for auto layout',
		displayOptions: {
			show: {
				'/command': ['create_frame'],
				'initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
			},
		},
	},
	// Ellipse-specific properties
	{
		displayName: 'Arc Start Angle',
		name: 'arcStartAngle',
		type: 'number',
		default: 0,
		description: 'Start angle for ellipse arc (in radians)',
		displayOptions: {
			show: {
				'/command': ['create_ellipse'],
			},
		},
	},
	{
		displayName: 'Arc End Angle',
		name: 'arcEndAngle',
		type: 'number',
		default: 0,
		description: 'End angle for ellipse arc (in radians, 6.28 = full circle)',
		displayOptions: {
			show: {
				'/command': ['create_ellipse'],
			},
		},
	},
	{
		displayName: 'Arc Inner Radius',
		name: 'arcInnerRadius',
		type: 'number',
		default: 0,
		description: 'Inner radius for ellipse arc (0 = filled circle)',
		displayOptions: {
			show: {
				'/command': ['create_ellipse'],
			},
		},
	},
	// Selection commands parameters
	{
		displayName: 'Node IDs',
		name: 'nodeIds',
		type: 'string',
		default: '123:456',
		description: 'Comma-separated list of node IDs to select',
		displayOptions: {
			show: {
				'/command': ['select_nodes', 'apply_styles_to_nodes'],
			},
		},
	},
	{
		displayName: 'Scroll Into View',
		name: 'scrollIntoView',
		type: 'boolean',
		default: true,
		description: 'Whether to scroll the selected nodes into view',
		displayOptions: {
			show: {
				'/command': ['select_nodes'],
			},
		},
	},
	{
		displayName: 'Node Type',
		name: 'nodeType',
		type: 'options',
		options: [
			{ name: 'Frame', value: 'FRAME' },
			{ name: 'Rectangle', value: 'RECTANGLE' },
			{ name: 'Ellipse', value: 'ELLIPSE' },
			{ name: 'Text', value: 'TEXT' },
			{ name: 'Line', value: 'LINE' },
			{ name: 'Vector', value: 'VECTOR' },
			{ name: 'Component', value: 'COMPONENT' },
			{ name: 'Instance', value: 'INSTANCE' },
			{ name: 'Group', value: 'GROUP' },
			{ name: 'Boolean Operation', value: 'BOOLEAN_OPERATION' },
		],
		default: 'FRAME',
		description: 'Type of nodes to select',
		displayOptions: {
			show: {
				'/command': ['select_nodes_by_type'],
			},
		},
	},
	{
		displayName: 'In Selection Only',
		name: 'inSelection',
		type: 'boolean',
		default: true,
		description: 'Whether to search only within current selection',
		displayOptions: {
			show: {
				'/command': ['select_nodes_by_type'],
			},
		},
	},
	{
		displayName: 'Name Pattern',
		name: 'namePattern',
		type: 'string',
		default: '*text*',
		description: 'Pattern to match node names',
		displayOptions: {
			show: {
				'/command': ['select_nodes_by_name'],
			},
		},
	},
	{
		displayName: 'Match Type',
		name: 'matchType',
		type: 'options',
		options: [
			{ name: 'Contains', value: 'contains' },
			{ name: 'Starts With', value: 'startsWith' },
			{ name: 'Ends With', value: 'endsWith' },
			{ name: 'Exact Match', value: 'exact' },
			{ name: 'Regex', value: 'regex' },
		],
		default: 'contains',
		description: 'How to match the name pattern',
		displayOptions: {
			show: {
				'/command': ['select_nodes_by_name'],
			},
		},
	},
	{
		displayName: 'Case Sensitive',
		name: 'caseSensitive',
		type: 'boolean',
		default: true,
		description: 'Whether the name matching should be case sensitive',
		displayOptions: {
			show: {
				'/command': ['select_nodes_by_name'],
			},
		},
	},
	// Batch style parameters (for apply_styles_to_selection)
	{
		displayName: 'Stroke Cap',
		name: 'strokeCap',
		type: 'options',
		options: [
			{ name: 'None', value: 'NONE' },
			{ name: 'Round', value: 'ROUND' },
			{ name: 'Square', value: 'SQUARE' },
			{ name: 'Arrow Lines', value: 'ARROW_LINES' },
			{ name: 'Arrow Equilateral', value: 'ARROW_EQUILATERAL' },
		],
		default: 'NONE',
		description: 'Cap style for stroke endpoints',
		displayOptions: {
			show: {
				'/command': ['apply_styles_to_nodes'],
			},
		},
	},
	{
		displayName: 'Dash Pattern',
		name: 'dashPattern',
		type: 'string',
		default: '',
		description: 'Comma-separated values for dash pattern (e.g., "10,5" for dashed line)',
		displayOptions: {
			show: {
				'/command': ['apply_styles_to_nodes'],
			},
		},
	},
	// Batch style effect parameters
	{
		displayName: 'Add Drop Shadow',
		name: 'addDropShadow',
		type: 'boolean',
		default: false,
		description: 'Whether to add a drop shadow effect',
		displayOptions: {
			show: {
				'/command': ['apply_styles_to_selection'],
			},
		},
	},
	{
		displayName: 'Add Inner Shadow',
		name: 'addInnerShadow',
		type: 'boolean',
		default: false,
		description: 'Whether to add an inner shadow effect',
		displayOptions: {
			show: {
				'/command': ['apply_styles_to_selection'],
			},
		},
	},
	{
		displayName: 'Add Blur',
		name: 'addBlur',
		type: 'boolean',
		default: false,
		description: 'Whether to add a blur effect',
		displayOptions: {
			show: {
				'/command': ['apply_styles_to_selection'],
			},
		},
	},
	{
		displayName: 'Blur Radius',
		name: 'blurRadius',
		type: 'number',
		default: 4,
		description: 'Radius for the blur effect',
		displayOptions: {
			show: {
				'/command': ['apply_styles_to_selection'],
				'addBlur': [true],
			},
		},
	},
	// Text style parameters
	{
		displayName: 'Text Align',
		name: 'textAlign',
		type: 'options',
		options: [
			{ name: 'Left', value: 'LEFT' },
			{ name: 'Center', value: 'CENTER' },
			{ name: 'Right', value: 'RIGHT' },
			{ name: 'Justified', value: 'JUSTIFIED' },
		],
		default: 'LEFT',
		description: 'Text alignment',
		displayOptions: {
			show: {
				'/command': ['apply_text_styles_to_selection'],
			},
		},
	},
	// Layer order parameters
	{
		displayName: 'Target Index',
		name: 'targetIndex',
		type: 'number',
		default: 0,
		description: 'Target index position for the layer (0 = bottom)',
		displayOptions: {
			show: {
				'/command': ['reorder_layer'],
			},
		},
	},
	{
		displayName: 'Parent Node ID',
		name: 'parentNodeId',
		type: 'string',
		default: '123:456',
		description: 'ID of parent node to sort children within (empty = current page)',
		displayOptions: {
			show: {
				'/command': ['sort_layers_by_name', 'sort_layers_by_position'],
			},
		},
	},
	{
		displayName: 'Sort Order',
		name: 'sortOrder',
		type: 'options',
		options: [
			{ name: 'Ascending', value: 'ascending' },
			{ name: 'Descending', value: 'descending' },
		],
		default: 'asc',
		description: 'Order to sort layers',
		displayOptions: {
			show: {
				'/command': ['sort_layers_by_name', 'sort_layers_by_position'],
			},
		},
	},
	{
		displayName: 'Case Sensitive',
		name: 'caseSensitive',
		type: 'boolean',
		default: true,
		description: 'Whether name sorting should be case sensitive',
		displayOptions: {
			show: {
				'/command': ['sort_layers_by_name'],
			},
		},
	},
	{
		displayName: 'Sort By',
		name: 'sortBy',
		type: 'options',
		options: [
			{ name: 'X Position', value: 'x' },
			{ name: 'Y Position', value: 'y' },
			{ name: 'Reading Order (Y then X)', value: 'xy' },
		],
		default: 'x',
		description: 'Criteria for position-based sorting',
		displayOptions: {
			show: {
				'/command': ['sort_layers_by_position'],
			},
		},
	},
	{
		displayName: 'Start Index',
		name: 'startIndex',
		type: 'number',
		default: 0,
		description: 'Starting index position for reordered layers',
		displayOptions: {
			show: {
				'/command': ['reorder_multiple_layers'],
			},
		},
	},
	// Create Component From Nodes parameters
	{
		displayName: 'Node IDs',
		name: 'nodeIds',
		type: 'string',
		default: '123:456',
		description: 'Comma-separated list of node IDs to convert to component (or single node ID)',
		displayOptions: {
			show: {
				'/command': ['create_component'],
			},
		},
	},
	{
		displayName: 'Component Name',
		name: 'name',
		type: 'string',
		default: 'New Component',
		description: 'Name for the new component',
		displayOptions: {
			show: {
				'/command': ['create_component'],
			},
		},
	},
	{
		displayName: 'Component Description',
		name: 'description',
		type: 'string',
		default: 'New Component Description',
		description: 'Description for the new component',
		displayOptions: {
			show: {
				'/command': ['create_component'],
			},
		},
	},
	// Search Available Fonts parameters
	{
		displayName: 'Keyword',
		name: 'keyword',
		type: 'string',
		default: 'Inter',
		description: 'Keyword to filter fonts (searches in font family and style names)',
		displayOptions: {
			show: {
				'/command': ['search_available_fonts'],
			},
		},
	},
];

// Main properties array for the node
export const figmationCommanderProperties: INodeProperties[] = [
	{
		displayName: 'Server Port',
		name: 'port',
		type: 'number',
		default: 3055,
		description: 'WebSocket server port (localhost only)',
		required: true,
	},
	{
		displayName: 'Channel ID',
		name: 'channelId',
		type: 'string',
		default: 'hellofigma',
		description: 'Target channel ID for WebSocket communication',
		required: true,
		displayOptions: {
			hide: {
				command: [
					'get_channels',
				],
			},
		},
	},
	{
		displayName: 'Command',
		name: 'command',
		type: 'options',
		options: FIGMA_COMMANDS,
		default: 'get_channels',
		description: 'Figma command to execute',
	},
	{
		displayName: 'Parameters',
		name: 'parameters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				'/command': COMMANDS_WITH_PARAMETERS,
			},
		},
		default: {},
		options: [
			{
				name: 'params',
				displayName: 'Parameters',
				values: PARAMETER_DEFINITIONS,
			},
		],
	},
];