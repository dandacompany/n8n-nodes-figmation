import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { FigmaWebSocketServer } from '../../shared/WebSocketServer';

export class FigmationCommander implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Figmation Commander',
		name: 'figmationCommander',
		icon: 'file:figmation.png',
		group: ['transform'],
		version: 1,
		description: 'Send design object creation commands to the Figma plugin',
		defaults: {
			name: 'Figmation Commander',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		subtitle: '={{$parameter["command"] === "get_channels" ? "Get available channels" : $parameter["command"] === "create_rectangle" ? "Create rectangle: " + ($parameter["width"] || "100") + "×" + ($parameter["height"] || "100") : $parameter["command"] === "create_frame" ? "Create frame: " + ($parameter["width"] || "100") + "×" + ($parameter["height"] || "100") : $parameter["command"] === "create_text" ? "Create text: \"" + ($parameter["text"] || "Sample Text") + "\"" : $parameter["command"] === "create_image_from_url" ? "Create image from: " + ($parameter["url"] || "URL") : $parameter["command"] === "create_slider" ? "Create slider: " + ($parameter["minValue"] || "0") + "-" + ($parameter["maxValue"] || "100") : $parameter["command"] === "create_ellipse" ? "Create ellipse: " + ($parameter["width"] || "100") + "×" + ($parameter["height"] || "100") : $parameter["command"] === "create_vector_path" ? "Create vector path" : $parameter["command"] === "create_button" ? "Create button: \"" + ($parameter["text"] || "Button") + "\"" : $parameter["command"] === "create_boolean_operation" ? "Boolean op: " + ($parameter["operation"] || "UNION") : $parameter["command"] === "create_icon_from_svg" ? "Create icon from SVG" : $parameter["command"] === "create_input_field" ? "Create input field: \"" + ($parameter["placeholder"] || "Enter text...") + "\"" : $parameter["command"] === "create_checkbox" ? "Create checkbox: \"" + ($parameter["label"] || "Checkbox") + "\"" : $parameter["command"] === "create_toggle" ? "Create toggle: \"" + ($parameter["label"] || "Toggle") + "\"" : $parameter["command"] === "create_symbol" ? "Create symbol from selection" : $parameter["command"] === "create_avatar" ? "Create avatar: " + ($parameter["avatarSize"] || "48") + "px " + ($parameter["avatarType"] || "initials") : $parameter["command"] === "create_progress_bar" ? "Create progress: " + ($parameter["progress"] || "50") + "%" : $parameter["command"] === "create_svg_to_vector" ? "Convert SVG to vector: " + ($parameter["name"] || "SVG Vector") : $parameter["command"] === "execute_custom_command" ? "Custom command: " + ($parameter["nodeType"] || "FRAME") : $parameter["command"] === "get_document_info" ? "Get document information" : $parameter["command"] === "get_selection" ? "Get selected elements" : $parameter["command"] === "move_node" ? "Move to: (" + ($parameter["x"] || "0") + ", " + ($parameter["y"] || "0") + ")" : $parameter["command"] === "resize_node" ? "Resize to: " + ($parameter["width"] || "100") + "×" + ($parameter["height"] || "100") : $parameter["command"] === "delete_node" ? "Delete element" : $parameter["command"] === "set_fill_color" ? "Fill color: " + ($parameter["color"] || "#FF5733") : $parameter["command"] === "set_stroke_color" ? "Stroke color: " + ($parameter["color"] || "#000000") : $parameter["command"] === "clone_node" ? "Clone element" : $parameter["command"] === "export_node_as_image" ? "Export as image" : $parameter["command"] || "Select command"}}',
		properties: [
			{
				displayName: 'Server Port',
				name: 'port',
				type: 'number',
				default: 3055,
				description: 'WebSocket server port (localhost only)',
				required: true,
			},
			{
				displayName: 'Server ID',
				name: 'serverId',
				type: 'string',
				default: '',
				description: 'Target WebSocket server ID (channel ID)',
				required: true,
			},
			{
				displayName: 'Command',
				name: 'command',
				type: 'options',
				options: [
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
						name: 'Get Local Components',
						value: 'get_local_components',
						description: 'Get the list of local components',
					},
					{
						name: 'Create Component Instance',
						value: 'create_component_instance',
						description: 'Create a component instance',
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
						name: 'Get Reactions',
						value: 'get_reactions',
						description: 'Get Figma prototype reactions',
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
						name: 'Create Icon from SVG',
						value: 'create_icon_from_svg',
						description: 'Create an icon from SVG data',
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
						name: 'Create SVG to Vector',
						value: 'create_svg_to_vector',
						description: 'Convert SVG content to Figma vector layers',
					},
					{
						name: 'Execute Custom Command',
						value: 'execute_custom_command',
						description: 'Execute custom Figma API command using JSON',
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
				],
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
						command: [
							'create_rectangle',
							'create_frame',
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
							'create_component_instance',
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
							'get_reactions',
							'set_default_connector',
							'create_connections',
							'create_image_from_url',
							'create_slider',
							'create_ellipse',
							'create_vector_path',
							'create_button',
							'create_boolean_operation',
							'create_icon_from_svg',
							'create_input_field',
							'create_checkbox',
							'create_toggle',
							'create_symbol',
							'create_avatar',
							'create_progress_bar',
						],
					},
				},
				default: {},
				options: [
					{
						name: 'params',
						displayName: 'Parameters',
						values: [
							// Position and size parameters
							{
								displayName: 'X Position',
								name: 'x',
								type: 'number',
								default: 0,
								description: 'X coordinate',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_text', 'move_node', 'create_image_from_url', 'create_component_instance', 'create_slider', 'create_ellipse', 'create_button', 'create_input_field', 'create_checkbox', 'create_toggle', 'create_symbol', 'create_avatar', 'create_progress_bar'],
									},
								},
							},
							{
								displayName: 'Y Position',
								name: 'y',
								type: 'number',
								default: 0,
								description: 'Y coordinate',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_text', 'move_node', 'create_image_from_url', 'create_component_instance', 'create_slider', 'create_ellipse', 'create_button', 'create_input_field', 'create_checkbox', 'create_toggle', 'create_symbol', 'create_avatar', 'create_progress_bar'],
									},
								},
							},
							{
								displayName: 'Width',
								name: 'width',
								type: 'number',
								default: 200,
								description: 'Width',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'resize_node', 'create_image_from_url', 'create_slider', 'create_ellipse', 'create_button', 'create_input_field', 'create_checkbox', 'create_toggle', 'create_avatar', 'create_progress_bar'],
									},
								},
							},
							{
								displayName: 'Height',
								name: 'height',
								type: 'number',
								default: 200,
								description: 'Height',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'resize_node', 'create_image_from_url', 'create_slider', 'create_ellipse', 'create_button', 'create_input_field', 'create_checkbox', 'create_toggle', 'create_avatar', 'create_progress_bar'],
									},
								},
							},
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Object name',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_text', 'create_image_from_url', 'create_component_instance', 'create_slider', 'create_ellipse', 'create_button', 'create_input_field', 'create_checkbox', 'create_toggle', 'create_symbol', 'create_avatar', 'create_progress_bar'],
									},
								},
							},
							// Text parameters
							{
								displayName: 'Text Content',
								name: 'text',
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
										'/command': ['move_node', 'resize_node', 'delete_node', 'set_fill_color', 'set_stroke_color', 'clone_node', 'export_node_as_image', 'get_node_info', 'set_text_content', 'set_corner_radius', 'scan_text_nodes', 'scan_nodes_by_types', 'set_layout_mode', 'set_padding', 'set_axis_align', 'set_layout_sizing', 'set_item_spacing', 'get_annotations', 'set_annotation', 'get_instance_overrides', 'set_opacity', 'set_rotation', 'add_drop_shadow', 'add_inner_shadow', 'add_blur', 'set_individual_corner_radius'],
									},
								},
							},
							// Color parameters
							{
								displayName: 'Red Value',
								name: 'Red_Value',
								type: 'number',
								default: 1,
								description: 'Red value (0-1)',
								displayOptions: {
									show: {
										'/command': ['set_fill_color', 'set_stroke_color'],
									},
								},
							},
							{
								displayName: 'Green Value',
								name: 'Green_Value',
								type: 'number',
								default: 0,
								description: 'Green value (0-1)',
								displayOptions: {
									show: {
										'/command': ['set_fill_color', 'set_stroke_color'],
									},
								},
							},
							{
								displayName: 'Blue Value',
								name: 'Blue_Value',
								type: 'number',
								default: 0,
								description: 'Blue value (0-1)',
								displayOptions: {
									show: {
										'/command': ['set_fill_color', 'set_stroke_color'],
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
										'/command': ['set_fill_color', 'set_stroke_color'],
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
							// New command parameters
							{
								displayName: 'Node IDs',
								name: 'nodeIds',
								type: 'string',
								default: '',
								description: 'Node IDs (comma separated)',
								displayOptions: {
									show: {
										'/command': ['get_nodes_info', 'delete_multiple_nodes'],
									},
								},
							},
							{
								displayName: 'Component Key',
								name: 'componentKey',
								type: 'string',
								default: '',
								description: 'Component key',
								displayOptions: {
									show: {
										'/command': ['create_component_instance'],
									},
								},
							},
							{
								displayName: 'Corner Radius',
								name: 'cornerRadius',
								type: 'number',
								default: 0,
								description: 'Corner radius',
								displayOptions: {
									show: {
										'/command': ['set_corner_radius', 'create_image_from_url'],
									},
								},
							},
							{
								displayName: 'Node Types',
								name: 'nodeTypes',
								type: 'string',
								default: 'TEXT',
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
								default: '[]',
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
							{
								displayName: 'Padding Top',
								name: 'paddingTop',
								type: 'number',
								default: 0,
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
								default: 0,
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
								default: 0,
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
								default: 0,
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
								default: 0,
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
								default: '',
								description: 'Annotation text',
								displayOptions: {
									show: {
										'/command': ['set_annotation'],
									},
								},
							},
							{
								displayName: 'Overrides Data',
								name: 'overridesData',
								type: 'string',
								default: '{}',
								description: 'Overrides data in JSON format',
								displayOptions: {
									show: {
										'/command': ['set_instance_overrides'],
									},
								},
							},
							{
								displayName: 'Connector ID',
								name: 'connectorId',
								type: 'string',
								default: '',
								description: 'Connector node ID',
								displayOptions: {
									show: {
										'/command': ['set_default_connector'],
									},
								},
							},
							{
								displayName: 'Connections',
								name: 'connections',
								type: 'string',
								default: '[]',
								description: 'Connections array in JSON format',
								displayOptions: {
									show: {
										'/command': ['create_connections'],
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
								default: '',
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
								default: 'data',
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
								name: 'parentId',
								type: 'string',
								default: '',
								description: 'ID of the parent node to place the object under (optional)',
								displayOptions: {
									show: {
										'/command': ['create_image_from_url', 'create_component_instance'],
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
							// Slider parameters
							{
								displayName: 'Min Value',
								name: 'minValue',
								type: 'number',
								default: 0,
								description: 'Minimum value for the slider',
								displayOptions: {
									show: {
										'/command': ['create_slider'],
									},
								},
							},
							{
								displayName: 'Max Value',
								name: 'maxValue',
								type: 'number',
								default: 100,
								description: 'Maximum value for the slider',
								displayOptions: {
									show: {
										'/command': ['create_slider'],
									},
								},
							},
							{
								displayName: 'Current Value',
								name: 'currentValue',
								type: 'number',
								default: 50,
								description: 'Current value of the slider',
								displayOptions: {
									show: {
										'/command': ['create_slider'],
									},
								},
							},
							{
								displayName: 'Parent Node ID',
								name: 'parentId',
								type: 'string',
								default: '',
								description: 'ID of the parent node to place the slider under (optional)',
								displayOptions: {
									show: {
										'/command': ['create_slider'],
									},
								},
							},
							// Button parameters
							{
								displayName: 'Button Text',
								name: 'text',
								type: 'string',
								default: 'Button',
								description: 'Text to display on the button',
								displayOptions: {
									show: {
										'/command': ['create_button'],
									},
								},
							},
							{
								displayName: 'Button Style',
								name: 'buttonStyle',
								type: 'options',
								options: [
									{
										name: 'Primary',
										value: 'primary',
										description: 'Primary button style',
									},
									{
										name: 'Secondary',
										value: 'secondary',
										description: 'Secondary button style',
									},
									{
										name: 'Outline',
										value: 'outline',
										description: 'Outline button style',
									},
								],
								default: 'primary',
								description: 'Button visual style',
								displayOptions: {
									show: {
										'/command': ['create_button'],
									},
								},
							},
							// Vector path parameters
							{
								displayName: 'SVG Path Data',
								name: 'pathData',
								type: 'string',
								default: 'M 10 10 L 90 10 L 90 90 L 10 90 Z',
								description: 'SVG path data string (d attribute)',
								displayOptions: {
									show: {
										'/command': ['create_vector_path', 'create_icon_from_svg'],
									},
								},
							},
							{
								displayName: 'SVG Content',
								name: 'svgContent',
								type: 'string',
								default: '<svg><path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/></svg>',
								description: 'Complete SVG markup for icon creation or vector conversion',
								displayOptions: {
									show: {
										'/command': ['create_icon_from_svg', 'create_svg_to_vector'],
									},
								},
							},
							// Custom JSON command parameter
							{
								displayName: 'Custom JSON',
								name: 'customJson',
								type: 'json',
								default: '{"type": "FRAME", "name": "Custom Node", "width": 100, "height": 100, "fills": [{"type": "SOLID", "color": {"r": 0.8, "g": 0.8, "b": 0.8}}]}',
								description: 'Custom Figma API properties in JSON format',
								displayOptions: {
									show: {
										'/command': ['execute_custom_command'],
									},
								},
							},
							{
								displayName: 'Node Type',
								name: 'nodeType',
								type: 'options',
								options: [
									{
										name: 'Frame',
										value: 'FRAME',
									},
									{
										name: 'Rectangle',
										value: 'RECTANGLE',
									},
									{
										name: 'Ellipse',
										value: 'ELLIPSE',
									},
									{
										name: 'Text',
										value: 'TEXT',
									},
									{
										name: 'Vector',
										value: 'VECTOR',
									},
									{
										name: 'Line',
										value: 'LINE',
									},
									{
										name: 'Star',
										value: 'STAR',
									},
									{
										name: 'Polygon',
										value: 'POLYGON',
									},
								],
								default: 'FRAME',
								description: 'Type of node to create (can be overridden by JSON)',
								displayOptions: {
									show: {
										'/command': ['execute_custom_command'],
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
								default: '',
								description: 'Comma-separated list of node IDs to combine',
								displayOptions: {
									show: {
										'/command': ['create_boolean_operation'],
									},
								},
							},
							// Input field parameters
							{
								displayName: 'Placeholder Text',
								name: 'placeholder',
								type: 'string',
								default: 'Enter text...',
								description: 'Placeholder text for the input field',
								displayOptions: {
									show: {
										'/command': ['create_input_field'],
									},
								},
							},
							{
								displayName: 'Input Type',
								name: 'inputType',
								type: 'options',
								options: [
									{
										name: 'Text',
										value: 'text',
										description: 'Standard text input',
									},
									{
										name: 'Password',
										value: 'password',
										description: 'Password input field',
									},
									{
										name: 'Email',
										value: 'email',
										description: 'Email input field',
									},
									{
										name: 'Number',
										value: 'number',
										description: 'Number input field',
									},
								],
								default: 'text',
								description: 'Type of input field',
								displayOptions: {
									show: {
										'/command': ['create_input_field'],
									},
								},
							},
							// Checkbox parameters
							{
								displayName: 'Checkbox Label',
								name: 'label',
								type: 'string',
								default: 'Checkbox',
								description: 'Label text for the checkbox',
								displayOptions: {
									show: {
										'/command': ['create_checkbox'],
									},
								},
							},
							{
								displayName: 'Checked State',
								name: 'checked',
								type: 'boolean',
								default: false,
								description: 'Initial checked state of the checkbox',
								displayOptions: {
									show: {
										'/command': ['create_checkbox'],
									},
								},
							},
							// Toggle parameters  
							{
								displayName: 'Toggle Label',
								name: 'label',
								type: 'string',
								default: 'Toggle',
								description: 'Label text for the toggle switch',
								displayOptions: {
									show: {
										'/command': ['create_toggle'],
									},
								},
							},
							{
								displayName: 'Enabled State',
								name: 'enabled',
								type: 'boolean',
								default: false,
								description: 'Initial enabled state of the toggle',
								displayOptions: {
									show: {
										'/command': ['create_toggle'],
									},
								},
							},
							// Symbol parameters
							{
								displayName: 'Source Node ID',
								name: 'sourceNodeId',
								type: 'string',
								default: '',
								description: 'Node ID to create symbol from (if empty, uses current selection)',
								displayOptions: {
									show: {
										'/command': ['create_symbol'],
									},
								},
							},
							// Avatar parameters
							{
								displayName: 'Avatar Type',
								name: 'avatarType',
								type: 'options',
								options: [
									{
										name: 'Initials',
										value: 'initials',
										description: 'Avatar with initials',
									},
									{
										name: 'Profile Picture',
										value: 'profile',
										description: 'Avatar with placeholder profile picture',
									},
									{
										name: 'Icon',
										value: 'icon',
										description: 'Avatar with user icon',
									},
								],
								default: 'initials',
								description: 'Type of avatar to create',
								displayOptions: {
									show: {
										'/command': ['create_avatar'],
									},
								},
							},
							{
								displayName: 'Avatar Text',
								name: 'avatarText',
								type: 'string',
								default: 'AB',
								description: 'Text to display in avatar (for initials type)',
								displayOptions: {
									show: {
										'/command': ['create_avatar'],
										'/avatarType': ['initials'],
									},
								},
							},
							{
								displayName: 'Avatar Size (px)',
								name: 'avatarSize',
								type: 'number',
								default: 48,
								description: 'Size of the avatar in pixels',
								displayOptions: {
									show: {
										'/command': ['create_avatar'],
									},
								},
							},
							// Progress bar parameters
							{
								displayName: 'Progress Value',
								name: 'progress',
								type: 'number',
								default: 50,
								description: 'Progress percentage (0-100)',
								displayOptions: {
									show: {
										'/command': ['create_progress_bar'],
									},
								},
							},
							{
								displayName: 'Progress Style',
								name: 'progressStyle',
								type: 'options',
								options: [
									{
										name: 'Linear',
										value: 'linear',
										description: 'Linear progress bar',
									},
									{
										name: 'Circular',
										value: 'circular',
										description: 'Circular progress indicator',
									},
								],
								default: 'linear',
								description: 'Style of progress bar',
								displayOptions: {
									show: {
										'/command': ['create_progress_bar'],
									},
								},
							},
							{
								displayName: 'Show Progress Text',
								name: 'showProgressText',
								type: 'boolean',
								default: true,
								description: 'Show percentage text on progress bar',
								displayOptions: {
									show: {
										'/command': ['create_progress_bar'],
									},
								},
							},
							// Parent ID for new commands
							{
								displayName: 'Parent Node ID',
								name: 'parentId',
								type: 'string',
								default: '',
								description: 'ID of the parent node to place the object under (optional)',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text', 'create_vector_path', 'create_button', 'create_boolean_operation', 'create_icon_from_svg', 'create_input_field', 'create_checkbox', 'create_toggle', 'create_symbol', 'create_avatar', 'create_progress_bar'],
									},
								},
							},
							// Advanced Figma API Properties - Fill Color (simplified)
							{
								displayName: 'Fill Color (R)',
								name: 'fillColorR',
								type: 'number',
								default: 0.2,
								description: 'Fill color red value (0-1)',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
									},
								},
							},
							{
								displayName: 'Fill Color (G)',
								name: 'fillColorG',
								type: 'number',
								default: 0.6,
								description: 'Fill color green value (0-1)',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
									},
								},
							},
							{
								displayName: 'Fill Color (B)',
								name: 'fillColorB',
								type: 'number',
								default: 1.0,
								description: 'Fill color blue value (0-1)',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
									},
								},
							},
							{
								displayName: 'Fill Color (A)',
								name: 'fillColorA',
								type: 'number',
								default: 1.0,
								description: 'Fill color alpha value (0-1)',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
									},
								},
							},
							// Stroke Properties
							{
								displayName: 'Stroke Color (R)',
								name: 'strokeColorR',
								type: 'number',
								default: 0,
								description: 'Stroke color red value (0-1)',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
									},
								},
							},
							{
								displayName: 'Stroke Color (G)',
								name: 'strokeColorG',
								type: 'number',
								default: 0,
								description: 'Stroke color green value (0-1)',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
									},
								},
							},
							{
								displayName: 'Stroke Color (B)',
								name: 'strokeColorB',
								type: 'number',
								default: 0,
								description: 'Stroke color blue value (0-1)',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
									},
								},
							},
							{
								displayName: 'Stroke Color (A)',
								name: 'strokeColorA',
								type: 'number',
								default: 1,
								description: 'Stroke color alpha value (0-1)',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse'],
									},
								},
							},
							// Text-specific properties
							{
								displayName: 'Font Color (R)',
								name: 'fontColorR',
								type: 'number',
								default: 0,
								description: 'Font color red value (0-1)',
								displayOptions: {
									show: {
										'/command': ['create_text'],
									},
								},
							},
							{
								displayName: 'Font Color (G)',
								name: 'fontColorG',
								type: 'number',
								default: 0,
								description: 'Font color green value (0-1)',
								displayOptions: {
									show: {
										'/command': ['create_text'],
									},
								},
							},
							{
								displayName: 'Font Color (B)',
								name: 'fontColorB',
								type: 'number',
								default: 0,
								description: 'Font color blue value (0-1)',
								displayOptions: {
									show: {
										'/command': ['create_text'],
									},
								},
							},
							{
								displayName: 'Font Color (A)',
								name: 'fontColorA',
								type: 'number',
								default: 1,
								description: 'Font color alpha value (0-1)',
								displayOptions: {
									show: {
										'/command': ['create_text'],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
									},
								},
							},
							{
								displayName: 'Corner Radius',
								name: 'initialCornerRadius',
								type: 'number',
								default: 0,
								description: 'Initial corner radius for rectangles and frames',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame'],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
										'/addDropShadow': [true],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
										'/addDropShadow': [true],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
										'/addDropShadow': [true],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
										'/addDropShadow': [true],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
										'/addDropShadow': [true],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
										'/addDropShadow': [true],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
										'/addDropShadow': [true],
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
										'/initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
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
										'/initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
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
										'/initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
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
										'/initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
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
										'/initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
									},
								},
							},
							// Style command parameters - Opacity
							{
								displayName: 'Opacity',
								name: 'opacity',
								type: 'number',
								default: 1,
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
								default: 4,
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
								default: 4,
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
								default: 4,
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
									},
								},
							},
							{
								displayName: 'Stroke Weight',
								name: 'strokeWeight',
								type: 'number',
								default: 1,
								description: 'Stroke weight in pixels',
								displayOptions: {
									show: {
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
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
										'/command': ['create_rectangle', 'create_frame', 'create_ellipse', 'create_text'],
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
										'/command': ['create_text'],
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
										'/command': ['create_text'],
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
										'/command': ['create_text'],
									},
								},
							},
							{
								displayName: 'Line Height',
								name: 'lineHeight',
								type: 'number',
								default: 1.2,
								description: 'Line height multiplier',
								displayOptions: {
									show: {
										'/command': ['create_text'],
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
										'/initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
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
										'/initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
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
										'/initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
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
										'/initialLayoutMode': ['HORIZONTAL', 'VERTICAL'],
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
								default: 6.28,
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
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const command = this.getNodeParameter('command', i) as string;
				const parameters = this.getNodeParameter('parameters.params', i, {}) as any;
				const port = this.getNodeParameter('port', i, 3055) as number;
				const serverId = this.getNodeParameter('serverId', i) as string;
				const host = 'localhost'; // Fixed to localhost

				if (!serverId) {
					throw new Error('Server ID is required.');
				}

				console.log('=== Figma WebSocket Command Debug ===');
				console.log('Host:', host);
				console.log('Port:', port);
				console.log('Server ID:', serverId);
				console.log('Command:', command);
				console.log('Parameters:', parameters);

				// Connect with WebSocket client
				const webSocketClient = new FigmaWebSocketServer({ host, port }, 'client', 'command', serverId);

				// Wait for connection to complete
				await webSocketClient.waitForConnection();

				// Build command parameters
				let commandParams: any = {};

				switch (command) {
					case 'get_channels':
						// No parameters
						break;

					case 'create_rectangle':
						commandParams = {
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: parameters.width || 100,
							height: parameters.height || 100,
							name: parameters.name || `Rectangle ${Date.now()}`,
						};
						
						// Add advanced Figma API properties if provided
						if (parameters.fillColorR !== undefined || parameters.fillColorG !== undefined || 
							parameters.fillColorB !== undefined || parameters.fillColorA !== undefined) {
							commandParams.fillColor = {
								r: parameters.fillColorR || 0,
								g: parameters.fillColorG || 0,
								b: parameters.fillColorB || 0,
								a: parameters.fillColorA !== undefined ? parameters.fillColorA : 1,
							};
						}
						
						if (parameters.strokeColorR !== undefined || parameters.strokeColorG !== undefined || 
							parameters.strokeColorB !== undefined || parameters.strokeColorA !== undefined) {
							commandParams.strokeColor = {
								r: parameters.strokeColorR || 0,
								g: parameters.strokeColorG || 0,
								b: parameters.strokeColorB || 0,
								a: parameters.strokeColorA !== undefined ? parameters.strokeColorA : 1,
							};
						}
						
						if (parameters.strokeWeight !== undefined) commandParams.strokeWeight = parameters.strokeWeight;
						if (parameters.opacity !== undefined) commandParams.opacity = parameters.opacity;
						if (parameters.rotation !== undefined) commandParams.rotation = parameters.rotation;
						if (parameters.cornerRadius !== undefined) commandParams.cornerRadius = parameters.cornerRadius;
						if (parameters.topLeftRadius !== undefined) commandParams.topLeftRadius = parameters.topLeftRadius;
						if (parameters.topRightRadius !== undefined) commandParams.topRightRadius = parameters.topRightRadius;
						if (parameters.bottomLeftRadius !== undefined) commandParams.bottomLeftRadius = parameters.bottomLeftRadius;
						if (parameters.bottomRightRadius !== undefined) commandParams.bottomRightRadius = parameters.bottomRightRadius;
						if (parameters.visible !== undefined) commandParams.visible = parameters.visible;
						if (parameters.locked !== undefined) commandParams.locked = parameters.locked;
						if (parameters.blendMode !== undefined) commandParams.blendMode = parameters.blendMode;
						break;

					case 'create_frame':
						commandParams = {
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: parameters.width || 100,
							height: parameters.height || 100,
							name: parameters.name || `Frame ${Date.now()}`,
						};
						
						// Add advanced Figma API properties if provided
						if (parameters.fillColorR !== undefined || parameters.fillColorG !== undefined || 
							parameters.fillColorB !== undefined || parameters.fillColorA !== undefined) {
							commandParams.fillColor = {
								r: parameters.fillColorR || 0,
								g: parameters.fillColorG || 0,
								b: parameters.fillColorB || 0,
								a: parameters.fillColorA !== undefined ? parameters.fillColorA : 1,
							};
						}
						
						if (parameters.strokeColorR !== undefined || parameters.strokeColorG !== undefined || 
							parameters.strokeColorB !== undefined || parameters.strokeColorA !== undefined) {
							commandParams.strokeColor = {
								r: parameters.strokeColorR || 0,
								g: parameters.strokeColorG || 0,
								b: parameters.strokeColorB || 0,
								a: parameters.strokeColorA !== undefined ? parameters.strokeColorA : 1,
							};
						}
						
						if (parameters.strokeWeight !== undefined) commandParams.strokeWeight = parameters.strokeWeight;
						if (parameters.opacity !== undefined) commandParams.opacity = parameters.opacity;
						if (parameters.rotation !== undefined) commandParams.rotation = parameters.rotation;
						if (parameters.cornerRadius !== undefined) commandParams.cornerRadius = parameters.cornerRadius;
						if (parameters.visible !== undefined) commandParams.visible = parameters.visible;
						if (parameters.locked !== undefined) commandParams.locked = parameters.locked;
						if (parameters.blendMode !== undefined) commandParams.blendMode = parameters.blendMode;
						
						// Frame-specific auto layout properties
						if (parameters.layoutMode !== undefined) commandParams.layoutMode = parameters.layoutMode;
						if (parameters.primaryAxisSizingMode !== undefined) commandParams.primaryAxisSizingMode = parameters.primaryAxisSizingMode;
						if (parameters.counterAxisSizingMode !== undefined) commandParams.counterAxisSizingMode = parameters.counterAxisSizingMode;
						if (parameters.paddingLeft !== undefined) commandParams.paddingLeft = parameters.paddingLeft;
						if (parameters.paddingRight !== undefined) commandParams.paddingRight = parameters.paddingRight;
						if (parameters.paddingTop !== undefined) commandParams.paddingTop = parameters.paddingTop;
						if (parameters.paddingBottom !== undefined) commandParams.paddingBottom = parameters.paddingBottom;
						if (parameters.itemSpacing !== undefined) commandParams.itemSpacing = parameters.itemSpacing;
						if (parameters.primaryAxisAlignItems !== undefined) commandParams.primaryAxisAlignItems = parameters.primaryAxisAlignItems;
						if (parameters.counterAxisAlignItems !== undefined) commandParams.counterAxisAlignItems = parameters.counterAxisAlignItems;
						if (parameters.clipsContent !== undefined) commandParams.clipsContent = parameters.clipsContent;
						break;

					case 'create_ellipse':
						commandParams = {
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: parameters.width || 100,
							height: parameters.height || 100,
							name: parameters.name || `Ellipse ${Date.now()}`,
						};
						
						// Add advanced Figma API properties if provided
						if (parameters.fillColorR !== undefined || parameters.fillColorG !== undefined || 
							parameters.fillColorB !== undefined || parameters.fillColorA !== undefined) {
							commandParams.fillColor = {
								r: parameters.fillColorR || 0,
								g: parameters.fillColorG || 0,
								b: parameters.fillColorB || 0,
								a: parameters.fillColorA !== undefined ? parameters.fillColorA : 1,
							};
						}
						
						if (parameters.strokeColorR !== undefined || parameters.strokeColorG !== undefined || 
							parameters.strokeColorB !== undefined || parameters.strokeColorA !== undefined) {
							commandParams.strokeColor = {
								r: parameters.strokeColorR || 0,
								g: parameters.strokeColorG || 0,
								b: parameters.strokeColorB || 0,
								a: parameters.strokeColorA !== undefined ? parameters.strokeColorA : 1,
							};
						}
						
						if (parameters.strokeWeight !== undefined) commandParams.strokeWeight = parameters.strokeWeight;
						if (parameters.opacity !== undefined) commandParams.opacity = parameters.opacity;
						if (parameters.rotation !== undefined) commandParams.rotation = parameters.rotation;
						if (parameters.visible !== undefined) commandParams.visible = parameters.visible;
						if (parameters.locked !== undefined) commandParams.locked = parameters.locked;
						if (parameters.blendMode !== undefined) commandParams.blendMode = parameters.blendMode;
						
						// Ellipse-specific arc properties
						if (parameters.arcStartAngle !== undefined || parameters.arcEndAngle !== undefined || 
							parameters.arcInnerRadius !== undefined) {
							commandParams.arcData = {
								startingAngle: parameters.arcStartAngle || 0,
								endingAngle: parameters.arcEndAngle || 6.28,
								innerRadius: parameters.arcInnerRadius || 0,
							};
						}
						break;

					case 'create_text':
						commandParams = {
							x: parameters.x || 0,
							y: parameters.y || 0,
							text: parameters.text || 'Hello World',
							fontSize: parameters.fontSize || 16,
							name: parameters.name || `Text ${Date.now()}`,
						};
						
						// Add advanced Figma API properties if provided
						if (parameters.fillColorR !== undefined || parameters.fillColorG !== undefined || 
							parameters.fillColorB !== undefined || parameters.fillColorA !== undefined) {
							commandParams.fillColor = {
								r: parameters.fillColorR || 0,
								g: parameters.fillColorG || 0,
								b: parameters.fillColorB || 0,
								a: parameters.fillColorA !== undefined ? parameters.fillColorA : 1,
							};
						}
						
						if (parameters.strokeColorR !== undefined || parameters.strokeColorG !== undefined || 
							parameters.strokeColorB !== undefined || parameters.strokeColorA !== undefined) {
							commandParams.strokeColor = {
								r: parameters.strokeColorR || 0,
								g: parameters.strokeColorG || 0,
								b: parameters.strokeColorB || 0,
								a: parameters.strokeColorA !== undefined ? parameters.strokeColorA : 1,
							};
						}
						
						if (parameters.strokeWeight !== undefined) commandParams.strokeWeight = parameters.strokeWeight;
						if (parameters.opacity !== undefined) commandParams.opacity = parameters.opacity;
						if (parameters.rotation !== undefined) commandParams.rotation = parameters.rotation;
						if (parameters.visible !== undefined) commandParams.visible = parameters.visible;
						if (parameters.locked !== undefined) commandParams.locked = parameters.locked;
						if (parameters.blendMode !== undefined) commandParams.blendMode = parameters.blendMode;
						
						// Text-specific properties
						if (parameters.fontFamily !== undefined) commandParams.fontFamily = parameters.fontFamily;
						if (parameters.fontWeight !== undefined) commandParams.fontWeight = parameters.fontWeight;
						if (parameters.textCase !== undefined) commandParams.textCase = parameters.textCase;
						if (parameters.textDecoration !== undefined) commandParams.textDecoration = parameters.textDecoration;
						if (parameters.letterSpacing !== undefined) commandParams.letterSpacing = parameters.letterSpacing;
						if (parameters.lineHeight !== undefined) commandParams.lineHeight = parameters.lineHeight;
						if (parameters.paragraphIndent !== undefined) commandParams.paragraphIndent = parameters.paragraphIndent;
						if (parameters.paragraphSpacing !== undefined) commandParams.paragraphSpacing = parameters.paragraphSpacing;
						if (parameters.textAutoResize !== undefined) commandParams.textAutoResize = parameters.textAutoResize;
						if (parameters.textAlignHorizontal !== undefined) commandParams.textAlignHorizontal = parameters.textAlignHorizontal;
						if (parameters.textAlignVertical !== undefined) commandParams.textAlignVertical = parameters.textAlignVertical;
						break;

					case 'move_node':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							x: parameters.x || 0,
							y: parameters.y || 0,
						};
						break;

					case 'resize_node':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							width: parameters.width || 100,
							height: parameters.height || 100,
						};
						break;

					case 'delete_node':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
						};
						break;

					case 'set_fill_color':
					case 'set_stroke_color':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							color: {
								r: parameters.Red_Value || 1,
								g: parameters.Green_Value || 0,
								b: parameters.Blue_Value || 0,
								a: parameters.Alpha_Value || 1,
							},
						};
						break;

					case 'clone_node':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							x: parameters.x,
							y: parameters.y,
						};
						break;

					case 'export_node_as_image':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							scale: parameters.scale || 1,
							format: parameters.format || 'PNG',
						};
						break;

					case 'get_node_info':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
						};
						break;

					case 'get_nodes_info':
						if (!parameters.nodeIds) {
							throw new Error('Node IDs are required.');
						}
						commandParams = {
							nodeIds: parameters.nodeIds.split(',').map((id: string) => id.trim()),
						};
						break;

					case 'set_text_content':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							text: parameters.text || 'Hello World',
						};
						break;

					case 'create_component_instance':
						if (!parameters.componentKey) {
							throw new Error('Component Key is required.');
						}
						commandParams = {
							componentKey: parameters.componentKey,
							x: parameters.x || 0,
							y: parameters.y || 0,
							name: parameters.name || `Instance ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'set_corner_radius':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							cornerRadius: parameters.cornerRadius || 0,
						};
						break;

					case 'scan_text_nodes':
						commandParams = {
							nodeId: parameters.nodeId || null,
						};
						break;

					case 'scan_nodes_by_types':
						commandParams = {
							nodeTypes: parameters.nodeTypes ? parameters.nodeTypes.split(',').map((type: string) => type.trim()) : ['TEXT'],
							nodeId: parameters.nodeId || null,
						};
						break;

					case 'set_multiple_text_contents':
						try {
							commandParams = {
								updates: JSON.parse(parameters.textUpdates || '[]'),
							};
						} catch (error) {
							throw new Error('Invalid JSON format for text updates');
						}
						break;

					case 'delete_multiple_nodes':
						if (!parameters.nodeIds) {
							throw new Error('Node IDs are required.');
						}
						commandParams = {
							nodeIds: parameters.nodeIds.split(',').map((id: string) => id.trim()),
						};
						break;

					case 'set_layout_mode':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							layoutMode: parameters.layoutMode || 'VERTICAL',
						};
						break;

					case 'set_padding':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							paddingTop: parameters.paddingTop || 0,
							paddingRight: parameters.paddingRight || 0,
							paddingBottom: parameters.paddingBottom || 0,
							paddingLeft: parameters.paddingLeft || 0,
						};
						break;

					case 'set_axis_align':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							primaryAxisAlignItems: parameters.primaryAxisAlignItems || 'CENTER',
							counterAxisAlignItems: parameters.counterAxisAlignItems || 'CENTER',
						};
						break;

					case 'set_layout_sizing':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							horizontalSizing: parameters.horizontalSizing || 'FIXED',
							verticalSizing: parameters.verticalSizing || 'FIXED',
						};
						break;

					case 'set_item_spacing':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							itemSpacing: parameters.itemSpacing || 0,
						};
						break;

					case 'get_annotations':
						commandParams = {
							nodeId: parameters.nodeId || null,
						};
						break;

					case 'set_annotation':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							text: parameters.annotationText || '',
						};
						break;

					case 'get_instance_overrides':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							sourceInstanceId: parameters.nodeId,
						};
						break;

					case 'set_instance_overrides':
						try {
							commandParams = {
								overrides: JSON.parse(parameters.overridesData || '{}'),
							};
						} catch (error) {
							throw new Error('Invalid JSON format for overrides data');
						}
						break;

					case 'get_reactions':
						commandParams = {
							nodeIds: parameters.nodeIds ? parameters.nodeIds.split(',').map((id: string) => id.trim()) : [],
						};
						break;

					case 'set_default_connector':
						if (!parameters.connectorId) {
							throw new Error('Connector ID is required.');
						}
						commandParams = {
							connectorId: parameters.connectorId,
						};
						break;

					case 'create_connections':
						try {
							commandParams = {
								connections: JSON.parse(parameters.connections || '[]'),
							};
						} catch (error) {
							throw new Error('Invalid JSON format for connections');
						}
						break;

					case 'create_image_from_url':
						const imageSourceType = parameters.imageSourceType || 'url';
						
						if (imageSourceType === 'url') {
							if (!parameters.url) {
								throw new Error('Image URL is required.');
							}
							commandParams = {
								url: parameters.url,
								x: parameters.x || 0,
								y: parameters.y || 0,
								width: parameters.width || 200,
								height: parameters.height || 200,
								name: parameters.name || `Image ${Date.now()}`,
								parentId: parameters.parentId || null,
								scaleMode: parameters.scaleMode || 'FILL',
								cornerRadius: parameters.cornerRadius || 0,
							};
						} else if (imageSourceType === 'binary') {
							const binaryProperty = parameters.binaryProperty || 'data';
							const binaryData = items[i].binary?.[binaryProperty];
							
							if (!binaryData) {
								throw new Error(`No binary data found in property "${binaryProperty}"`);
							}
							
							// Convert binary data to base64
							let base64Data: string;
							if (binaryData.data) {
								base64Data = binaryData.data;
							} else {
								throw new Error('Binary data is missing');
							}
							
							commandParams = {
								base64Data: base64Data,
								mimeType: binaryData.mimeType || 'image/png',
								x: parameters.x || 0,
								y: parameters.y || 0,
								width: parameters.width || 200,
								height: parameters.height || 200,
								name: parameters.name || `Image ${Date.now()}`,
								parentId: parameters.parentId || null,
								scaleMode: parameters.scaleMode || 'FILL',
								cornerRadius: parameters.cornerRadius || 0,
							};
						}
						break;

					case 'create_slider':
						commandParams = {
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: parameters.width || 200,
							height: parameters.height || 40,
							minValue: parameters.minValue || 0,
							maxValue: parameters.maxValue || 100,
							currentValue: parameters.currentValue || 50,
							name: parameters.name || `Slider ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'create_ellipse':
						commandParams = {
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: parameters.width || 100,
							height: parameters.height || 100,
							name: parameters.name || `Ellipse ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'create_vector_path':
						if (!parameters.pathData) {
							throw new Error('SVG Path Data is required.');
						}
						commandParams = {
							pathData: parameters.pathData,
							x: parameters.x || 0,
							y: parameters.y || 0,
							name: parameters.name || `Vector Path ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'create_button':
						commandParams = {
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: parameters.width || 120,
							height: parameters.height || 40,
							text: parameters.text || 'Button',
							buttonStyle: parameters.buttonStyle || 'primary',
							name: parameters.name || `Button ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'create_boolean_operation':
						if (!parameters.sourceNodeIds) {
							throw new Error('Source Node IDs are required.');
						}
						commandParams = {
							operation: parameters.operation || 'UNION',
							sourceNodeIds: parameters.sourceNodeIds.split(',').map((id: string) => id.trim()),
							name: parameters.name || `Boolean Operation ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'create_icon_from_svg':
						if (!parameters.svgContent && !parameters.pathData) {
							throw new Error('Either SVG Content or SVG Path Data is required.');
						}
						commandParams = {
							svgContent: parameters.svgContent,
							pathData: parameters.pathData,
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: parameters.width || 24,
							height: parameters.height || 24,
							name: parameters.name || `Icon ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'create_input_field':
						commandParams = {
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: parameters.width || 200,
							height: parameters.height || 40,
							placeholder: parameters.placeholder || 'Enter text...',
							inputType: parameters.inputType || 'text',
							name: parameters.name || `Input Field ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'create_checkbox':
						commandParams = {
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: parameters.width || 120,
							height: parameters.height || 24,
							label: parameters.label || 'Checkbox',
							checked: parameters.checked || false,
							name: parameters.name || `Checkbox ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'create_toggle':
						commandParams = {
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: parameters.width || 60,
							height: parameters.height || 32,
							label: parameters.label || 'Toggle',
							enabled: parameters.enabled || false,
							name: parameters.name || `Toggle ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'create_symbol':
						commandParams = {
							sourceNodeId: parameters.sourceNodeId || null,
							name: parameters.name || `Symbol ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'create_avatar':
						const avatarSize = Math.max(8, Math.min(512, parameters.avatarSize || 48)); // Clamp between 8-512px
						commandParams = {
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: avatarSize,
							height: avatarSize,
							avatarType: parameters.avatarType || 'initials',
							avatarText: parameters.avatarText || 'AB',
							name: parameters.name || `Avatar ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'create_progress_bar':
						commandParams = {
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: parameters.width || 200,
							height: parameters.height || (parameters.progressStyle === 'circular' ? 48 : 8),
							progress: parameters.progress || 50,
							progressStyle: parameters.progressStyle || 'linear',
							showProgressText: parameters.showProgressText !== undefined ? parameters.showProgressText : true,
							name: parameters.name || `Progress Bar ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'create_svg_to_vector':
						if (!parameters.svgContent) {
							throw new Error('SVG Content is required for SVG to vector conversion.');
						}
						commandParams = {
							svgContent: parameters.svgContent,
							x: parameters.x || 0,
							y: parameters.y || 0,
							width: parameters.width,
							height: parameters.height,
							name: parameters.name || `SVG Vector ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'execute_custom_command':
						if (!parameters.customJson) {
							throw new Error('Custom JSON is required for custom command execution.');
						}
						commandParams = {
							customJson: parameters.customJson,
							nodeType: parameters.nodeType || 'FRAME',
							x: parameters.x || 0,
							y: parameters.y || 0,
							name: parameters.name || `Custom Node ${Date.now()}`,
							parentId: parameters.parentId || null,
						};
						break;

					case 'get_document_info':
					case 'get_selection':
					case 'get_styles':
					case 'get_local_components':
						// No parameters
						break;

					// New style commands
					case 'set_opacity':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							opacity: parameters.opacity !== undefined ? parameters.opacity : 1,
						};
						break;

					case 'set_rotation':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							rotation: parameters.rotation || 0,
						};
						break;

					case 'add_drop_shadow':
					case 'add_inner_shadow':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							type: command === 'add_drop_shadow' ? 'DROP_SHADOW' : 'INNER_SHADOW',
							offset: {
								x: parameters.shadowOffsetX || 0,
								y: parameters.shadowOffsetY || 4,
							},
							blur: parameters.shadowBlur || 4,
							color: {
								r: parameters.shadowColorR || 0,
								g: parameters.shadowColorG || 0,
								b: parameters.shadowColorB || 0,
								a: parameters.shadowColorA || 0.25,
							},
						};
						break;

					case 'add_blur':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							radius: parameters.blurRadius || 4,
						};
						break;

					case 'set_individual_corner_radius':
						if (!parameters.nodeId) {
							throw new Error('Node ID is required.');
						}
						commandParams = {
							nodeId: parameters.nodeId,
							topLeftRadius: parameters.topLeftRadius || 0,
							topRightRadius: parameters.topRightRadius || 0,
							bottomRightRadius: parameters.bottomRightRadius || 0,
							bottomLeftRadius: parameters.bottomLeftRadius || 0,
						};
						break;

					default:
						throw new Error(`Unknown command: ${command}`);
				}

				// Execute command
				let result: any;

				if (command === 'get_channels') {
					console.log('Getting channel list...');
					result = await webSocketClient.getChannels();
				} else {
					console.log('Sending Figma command:', command, commandParams);
					result = await webSocketClient.sendCommandToFigma(command, commandParams, serverId);
				}

				console.log('Command execution result:', result);

				// Return result
				returnData.push({
					json: {
						command,
						serverId,
						host,
						port,
						parameters: commandParams,
						result,
						timestamp: new Date().toISOString(),
						success: true,
					},
				});

			} catch (error) {
				console.error('Figma WebSocket Command execution error:', error);
				
				returnData.push({
					json: {
						command: this.getNodeParameter('command', i, 'unknown'),
						serverId: this.getNodeParameter('serverId', i, 'unknown'),
						error: error instanceof Error ? error.message : String(error),
						timestamp: new Date().toISOString(),
						success: false,
					},
				});
			}
		}

		return [returnData];
	}

}