/**
 * Parameter mapping utilities for Figma commands
 * Handles conversion from n8n node parameters to Figma command parameters
 */

// Common color parameter interface
export interface ColorParams {
	r: number;
	g: number;
	b: number;
	a?: number;
}

// Shadow configuration interface
export interface ShadowParams {
	type: 'DROP_SHADOW' | 'INNER_SHADOW';
	color: ColorParams;
	offset: {
		x: number;
		y: number;
	};
	radius: number;
	spread?: number;
	visible?: boolean;
	blendMode?: string;
}

// Gradient configuration interface
export interface GradientParams {
	type: string;
	startColor: string;
	endColor: string;
	angle: number;
}

// Arc data for ellipses
export interface ArcDataParams {
	startingAngle: number;
	endingAngle: number;
	innerRadius: number;
}

// Base parameters for node creation
export interface BaseNodeParams {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	name?: string;
	parentId?: string | null;
	opacity?: number;
	rotation?: number;
	visible?: boolean;
	locked?: boolean;
	blendMode?: string;
}

// Extended parameters for visual styling
export interface StyledNodeParams extends BaseNodeParams {
	fillColor?: ColorParams;
	strokeColor?: ColorParams;
	strokeWeight?: number;
	cornerRadius?: number;
	shadows?: ShadowParams[];
	addDropShadow?: boolean;
}

// Frame-specific auto layout parameters
export interface FrameLayoutParams {
	layoutMode?: string;
	primaryAxisSizingMode?: string;
	counterAxisSizingMode?: string;
	paddingLeft?: number;
	paddingRight?: number;
	paddingTop?: number;
	paddingBottom?: number;
	itemSpacing?: number;
	primaryAxisAlignItems?: string;
	counterAxisAlignItems?: string;
	clipsContent?: boolean;
}

// Text-specific parameters
export interface TextNodeParams extends StyledNodeParams {
	text?: string;
	fontSize?: number;
	fontColor?: ColorParams;
	fontFamily?: string;
	fontWeight?: string;
	textCase?: string;
	textDecoration?: string;
	letterSpacing?: number;
	lineHeight?: number;
	paragraphIndent?: number;
	paragraphSpacing?: number;
	textAutoResize?: string;
	textAlignHorizontal?: string;
	textAlignVertical?: string;
}

// Individual corner radius parameters
export interface IndividualCornerRadiusParams {
	topLeftRadius?: number;
	topRightRadius?: number;
	bottomLeftRadius?: number;
	bottomRightRadius?: number;
}

/**
 * Helper function to create color parameters from individual RGB components
 */
export function createColorFromComponents(
	rParam?: number,
	gParam?: number,
	bParam?: number,
	aParam?: number
): ColorParams | undefined {
	if (rParam !== undefined || gParam !== undefined || bParam !== undefined || aParam !== undefined) {
		return {
			r: rParam || 0,
			g: gParam || 0,
			b: bParam || 0,
			a: aParam !== undefined ? aParam : 1,
		};
	}
	return undefined;
}

/**
 * Parse color from hex string to RGB components
 */
export function parseColor(color: string): ColorParams {
	// Remove # if present
	const hex = color.replace('#', '');
	
	// Parse hex to RGB
	let r = 0, g = 0, b = 0, a = 1;
	
	if (hex.length === 6) {
		r = parseInt(hex.substr(0, 2), 16) / 255;
		g = parseInt(hex.substr(2, 2), 16) / 255;
		b = parseInt(hex.substr(4, 2), 16) / 255;
	} else if (hex.length === 8) {
		r = parseInt(hex.substr(0, 2), 16) / 255;
		g = parseInt(hex.substr(2, 2), 16) / 255;
		b = parseInt(hex.substr(4, 2), 16) / 255;
		a = parseInt(hex.substr(6, 2), 16) / 255;
	} else if (hex.length === 3) {
		r = parseInt(hex.substr(0, 1) + hex.substr(0, 1), 16) / 255;
		g = parseInt(hex.substr(1, 1) + hex.substr(1, 1), 16) / 255;
		b = parseInt(hex.substr(2, 1) + hex.substr(2, 1), 16) / 255;
	}
	
	return { r, g, b, a };
}

/**
 * Helper function to create shadow parameters
 */
export function createShadowParams(
	parameters: any,
	shadowType: 'DROP_SHADOW' | 'INNER_SHADOW' = 'DROP_SHADOW',
	prefix: string = 'initial'
): ShadowParams[] | undefined {
	const prefixedOffsetX = `${prefix}ShadowOffsetX`;
	const prefixedOffsetY = `${prefix}ShadowOffsetY`;
	const prefixedBlur = `${prefix}ShadowBlur`;
	const prefixedColorR = `${prefix}ShadowColorR`;
	const prefixedColorG = `${prefix}ShadowColorG`;
	const prefixedColorB = `${prefix}ShadowColorB`;
	const prefixedColorA = `${prefix}ShadowColorA`;

	if (
		parameters.addDropShadow ||
		parameters[prefixedOffsetX] !== undefined ||
		parameters[prefixedOffsetY] !== undefined ||
		parameters[prefixedBlur] !== undefined ||
		parameters[prefixedColorR] !== undefined
	) {
		return [{
			type: shadowType,
			color: {
				r: parameters[prefixedColorR] !== undefined ? parameters[prefixedColorR] : 0,
				g: parameters[prefixedColorG] !== undefined ? parameters[prefixedColorG] : 0,
				b: parameters[prefixedColorB] !== undefined ? parameters[prefixedColorB] : 0,
				a: parameters[prefixedColorA] !== undefined ? parameters[prefixedColorA] : 0.25
			},
			offset: {
				x: parameters[prefixedOffsetX] !== undefined ? parameters[prefixedOffsetX] : 0,
				y: parameters[prefixedOffsetY] !== undefined ? parameters[prefixedOffsetY] : 4
			},
			radius: parameters[prefixedBlur] !== undefined ? parameters[prefixedBlur] : 4,
			spread: 0,
			visible: parameters.addDropShadow !== false,
			blendMode: 'NORMAL'
		}];
	}
	return undefined;
}

/**
 * Helper function to map parent ID from various parameter formats
 */
export function mapParentId(parameters: any): string | null {
	return parameters.parentIdForNode || 
		   parameters.Parent_Node_ID || 
		   parameters.parentId || 
		   parameters.parentIdForImage || 
		   null;
}

/**
 * Helper function to split comma-separated node IDs
 */
export function parseNodeIds(nodeIds: string): string[] {
	return nodeIds.split(',').map((id: string) => id.trim());
}

/**
 * Helper function to parse JSON parameters safely
 */
export function parseJsonParameter(jsonString: string, parameterName: string): any {
	try {
		return JSON.parse(jsonString || '{}');
	} catch (error) {
		throw new Error(`Invalid JSON format for ${parameterName}`);
	}
}

/**
 * Maps base node creation parameters
 */
export function mapBaseNodeParams(parameters: any, defaultName: string): BaseNodeParams {
	const result: BaseNodeParams = {
		x: parameters.x || 0,
		y: parameters.y || 0,
		width: parameters.width || 100,
		height: parameters.height || 100,
		name: parameters.name || defaultName,
		parentId: mapParentId(parameters),
	};

	// Add optional styling properties
	if (parameters.initialOpacity !== undefined) result.opacity = parameters.initialOpacity;
	if (parameters.initialRotation !== undefined) result.rotation = parameters.initialRotation;
	if (parameters.visible !== undefined) result.visible = parameters.visible;
	if (parameters.locked !== undefined) result.locked = parameters.locked;
	if (parameters.blendMode !== undefined) result.blendMode = parameters.blendMode;

	return result;
}

/**
 * Maps styled node parameters including colors and effects
 */
export function mapStyledNodeParams(parameters: any, defaultName: string): StyledNodeParams {
	const baseParams = mapBaseNodeParams(parameters, defaultName);
	const result: StyledNodeParams = { ...baseParams };

	// Map fill color
	const fillColor = createColorFromComponents(
		parameters.Fill_Color_R,
		parameters.Fill_Color_G,
		parameters.Fill_Color_B,
		parameters.Fill_Color_A
	);
	if (fillColor) result.fillColor = fillColor;

	// Map stroke color
	const strokeColor = createColorFromComponents(
		parameters.Stroke_Color_R,
		parameters.Stroke_Color_G,
		parameters.Stroke_Color_B,
		parameters.Stroke_Color_A
	);
	if (strokeColor) result.strokeColor = strokeColor;

	// Map other styling properties
	if (parameters.strokeWeight !== undefined) result.strokeWeight = parameters.strokeWeight;
	if (parameters.initialCornerRadius !== undefined) result.cornerRadius = parameters.initialCornerRadius;
	if (parameters.addDropShadow !== undefined) result.addDropShadow = parameters.addDropShadow;

	// Map shadow effects
	const shadows = createShadowParams(parameters);
	if (shadows) result.shadows = shadows;

	return result;
}

/**
 * Main parameter mapping function that dispatches to specific command mappers
 */
export function mapParametersForCommand(command: string, parameters: any): any {
	switch (command) {
		case 'get_channels':
			return {};

		case 'create_rectangle':
			return mapCreateRectangleParams(parameters);

		case 'create_frame':
			return mapCreateFrameParams(parameters);

		case 'create_ellipse':
			return mapCreateEllipseParams(parameters);

		case 'create_text':
			return mapCreateTextParams(parameters);

		case 'move_node':
			return mapMoveNodeParams(parameters);

		case 'resize_node':
			return mapResizeNodeParams(parameters);

		case 'delete_node':
			return mapDeleteNodeParams(parameters);

		case 'set_fill_color':
			return mapSetFillColorParams(parameters);

		case 'set_stroke_color':
			return mapSetStrokeColorParams(parameters);

		case 'clone_node':
			return mapCloneNodeParams(parameters);

		case 'export_node_as_image':
			return mapExportNodeAsImageParams(parameters);

		case 'get_node_info':
			return mapGetNodeInfoParams(parameters);

		case 'get_nodes_info':
			return mapGetNodesInfoParams(parameters);

		case 'set_text_content':
			return mapSetTextContentParams(parameters);


		case 'create_component':
			return mapCreateComponentFromNodesParams(parameters);

		case 'set_corner_radius':
			return mapSetCornerRadiusParams(parameters);

		case 'scan_text_nodes':
			return mapScanTextNodesParams(parameters);

		case 'scan_nodes_by_types':
			return mapScanNodesByTypesParams(parameters);

		case 'set_multiple_text_contents':
			return mapSetMultipleTextContentsParams(parameters);

		case 'delete_multiple_nodes':
			return mapDeleteMultipleNodesParams(parameters);

		case 'set_layout_mode':
			return mapSetLayoutModeParams(parameters);

		case 'set_padding':
			return mapSetPaddingParams(parameters);

		case 'set_axis_align':
			return mapSetAxisAlignParams(parameters);

		case 'set_layout_sizing':
			return mapSetLayoutSizingParams(parameters);

		case 'set_item_spacing':
			return mapSetItemSpacingParams(parameters);

		case 'get_annotations':
			return mapGetAnnotationsParams(parameters);

		case 'set_annotation':
			return mapSetAnnotationParams(parameters);

		case 'get_instance_overrides':
			return mapGetInstanceOverridesParams(parameters);

		case 'set_instance_overrides':
			return mapSetInstanceOverridesParams(parameters);

		case 'detach_instance':
			return mapDetachInstanceParams(parameters);

		case 'set_default_connector':
			return mapSetDefaultConnectorParams(parameters);

		case 'create_image_from_url':
			return mapCreateImageFromUrlParams(parameters);

		case 'create_vector_path':
			return mapCreateVectorPathParams(parameters);

		case 'create_boolean_operation':
			return mapCreateBooleanOperationParams(parameters);

		case 'create_design_from_svg':
			return mapCreateDesignFromSvgParams(parameters);

		case 'create_group':
			return mapCreateGroupParams(parameters);

		case 'create_instance':
			return mapCreateInstanceParams(parameters);

		case 'get_document_info':
		case 'get_selection':
		case 'get_styles':
		case 'get_local_components':
			return {};
			
		case 'search_available_fonts':
			return mapSearchAvailableFontsParams(parameters);

		case 'set_opacity':
			return mapSetOpacityParams(parameters);

		case 'set_rotation':
			return mapSetRotationParams(parameters);

		case 'add_drop_shadow':
		case 'add_inner_shadow':
			return mapAddShadowParams(parameters, command);

		case 'add_blur':
			return mapAddBlurParams(parameters);

		case 'set_individual_corner_radius':
			return mapSetIndividualCornerRadiusParams(parameters);

		case 'select_nodes':
			return mapSelectNodesParams(parameters);

		case 'select_nodes_by_type':
			return mapSelectNodesByTypeParams(parameters);

		case 'select_nodes_by_name':
			return mapSelectNodesByNameParams(parameters);

		case 'apply_styles_to_selection':
			return mapApplyStylesToSelectionParams(parameters);

		case 'apply_text_styles_to_selection':
			return mapApplyTextStylesToSelectionParams(parameters);

		case 'apply_styles_to_nodes':
			return mapApplyStylesToNodesParams(parameters);

		// Layer order commands
		case 'reorder_layer':
			return mapReorderLayerParams(parameters);

		case 'move_to_front':
			return mapMoveToFrontParams(parameters);

		case 'move_to_back':
			return mapMoveToBackParams(parameters);

		case 'move_forward':
			return mapMoveForwardParams(parameters);

		case 'move_backward':
			return mapMoveBackwardParams(parameters);

		case 'sort_layers_by_name':
			return mapSortLayersByNameParams(parameters);

		case 'sort_layers_by_position':
			return mapSortLayersByPositionParams(parameters);

		case 'reorder_multiple_layers':
			return mapReorderMultipleLayersParams(parameters);
			
		case 'get_components':
			return mapGetComponentsParams(parameters);

		case 'create_instance':
			return mapCreateInstanceParams(parameters);

		default:
			throw new Error(`Unknown command: ${command}`);
	}
}

// Individual parameter mapping functions for each command

function mapCreateRectangleParams(parameters: any): StyledNodeParams & IndividualCornerRadiusParams {
	const result = mapStyledNodeParams(parameters, `Rectangle ${Date.now()}`) as StyledNodeParams & IndividualCornerRadiusParams;
	
	// Add individual corner radius support
	if (parameters.topLeftRadius !== undefined) result.topLeftRadius = parameters.topLeftRadius;
	if (parameters.topRightRadius !== undefined) result.topRightRadius = parameters.topRightRadius;
	if (parameters.bottomLeftRadius !== undefined) result.bottomLeftRadius = parameters.bottomLeftRadius;
	if (parameters.bottomRightRadius !== undefined) result.bottomRightRadius = parameters.bottomRightRadius;
	
	return result;
}

function mapCreateFrameParams(parameters: any): StyledNodeParams & FrameLayoutParams {
	const result = mapStyledNodeParams(parameters, `Frame ${Date.now()}`) as StyledNodeParams & FrameLayoutParams;
	
	// Add frame-specific auto layout properties
	if (parameters.layoutMode !== undefined) result.layoutMode = parameters.layoutMode;
	if (parameters.primaryAxisSizingMode !== undefined) result.primaryAxisSizingMode = parameters.primaryAxisSizingMode;
	if (parameters.counterAxisSizingMode !== undefined) result.counterAxisSizingMode = parameters.counterAxisSizingMode;
	if (parameters.paddingLeft !== undefined) result.paddingLeft = parameters.paddingLeft;
	if (parameters.paddingRight !== undefined) result.paddingRight = parameters.paddingRight;
	if (parameters.paddingTop !== undefined) result.paddingTop = parameters.paddingTop;
	if (parameters.paddingBottom !== undefined) result.paddingBottom = parameters.paddingBottom;
	if (parameters.itemSpacing !== undefined) result.itemSpacing = parameters.itemSpacing;
	if (parameters.primaryAxisAlignItems !== undefined) result.primaryAxisAlignItems = parameters.primaryAxisAlignItems;
	if (parameters.counterAxisAlignItems !== undefined) result.counterAxisAlignItems = parameters.counterAxisAlignItems;
	if (parameters.clipsContent !== undefined) result.clipsContent = parameters.clipsContent;
	
	return result;
}

function mapCreateEllipseParams(parameters: any): StyledNodeParams & { arcData?: ArcDataParams } {
	const result = mapStyledNodeParams(parameters, `Ellipse ${Date.now()}`) as StyledNodeParams & { arcData?: ArcDataParams };
	
	// Ellipse-specific arc properties
	if (parameters.arcStartAngle !== undefined || parameters.arcEndAngle !== undefined || 
		parameters.arcInnerRadius !== undefined) {
		const startAngle = parameters.arcStartAngle || 0;
		const endAngle = parameters.arcEndAngle || (Math.PI * 2);
		const innerRadius = parameters.arcInnerRadius || 0;
		
		// Only apply arcData if it's not a complete circle (full 2π rotation)
		const isFullCircle = Math.abs((endAngle - startAngle) - (Math.PI * 2)) < 0.001 && innerRadius === 0;
		
		if (!isFullCircle) {
			result.arcData = {
				startingAngle: startAngle,
				endingAngle: endAngle,
				innerRadius: innerRadius,
			};
		}
	}
	
	return result;
}

function mapCreateTextParams(parameters: any): TextNodeParams {
	const result = mapStyledNodeParams(parameters, `Text ${Date.now()}`) as TextNodeParams;
	
	// Override default dimensions for text
	result.text = parameters.textContent || parameters.text || 'Hello World';
	result.fontSize = parameters.fontSize || 16;
	
	// Map font color
	const fontColor = createColorFromComponents(
		parameters.Font_Color_R,
		parameters.Font_Color_G,
		parameters.Font_Color_B,
		parameters.Font_Color_A
	);
	if (fontColor) result.fontColor = fontColor;
	
	// Text-specific properties
	if (parameters.fontFamily !== undefined) result.fontFamily = parameters.fontFamily;
	if (parameters.fontWeight !== undefined) result.fontWeight = parameters.fontWeight;
	if (parameters.textCase !== undefined) result.textCase = parameters.textCase;
	if (parameters.textDecoration !== undefined) result.textDecoration = parameters.textDecoration;
	if (parameters.letterSpacing !== undefined) result.letterSpacing = parameters.letterSpacing;
	if (parameters.lineHeight !== undefined) result.lineHeight = parameters.lineHeight;
	if (parameters.paragraphIndent !== undefined) result.paragraphIndent = parameters.paragraphIndent;
	if (parameters.paragraphSpacing !== undefined) result.paragraphSpacing = parameters.paragraphSpacing;
	if (parameters.textAutoResize !== undefined) result.textAutoResize = parameters.textAutoResize;
	if (parameters.textAlignHorizontal !== undefined) result.textAlignHorizontal = parameters.textAlignHorizontal;
	if (parameters.textAlignVertical !== undefined) result.textAlignVertical = parameters.textAlignVertical;
	
	return result;
}

function mapMoveNodeParams(parameters: any): { nodeId: string; x: number; y: number } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		x: parameters.x || 0,
		y: parameters.y || 0,
	};
}

function mapResizeNodeParams(parameters: any): { nodeId: string; width: number; height: number } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		width: parameters.width || 100,
		height: parameters.height || 100,
	};
}

function mapDeleteNodeParams(parameters: any): { nodeId: string } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
	};
}

function mapSetFillColorParams(parameters: any): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	
	const fillType = parameters.Fill_Type || 'solid';
	
	if (fillType === 'solid') {
		// Handle both hex color and RGB values
		if (parameters.color) {
			// Hex color format
			return {
				nodeId: parameters.nodeId,
				color: parameters.color,
			};
		} else {
			// RGB format
			return {
				nodeId: parameters.nodeId,
				color: {
					r: parameters.Red_Value || 1,
					g: parameters.Green_Value || 0,
					b: parameters.Blue_Value || 0,
					a: parameters.Alpha_Value || 1,
				},
			};
		}
	} else {
		// Gradient parameters
		return {
			nodeId: parameters.nodeId,
			gradient: {
				type: fillType.toUpperCase(), // 'linear_gradient' -> 'LINEAR_GRADIENT'
				startColor: parameters.Start_Color || parameters.Gradient_Start_Color || '#FF0000',
				endColor: parameters.End_Color || parameters.Gradient_End_Color || '#0000FF',
				angle: parameters.Angle || parameters.Gradient_Angle || 0,
			},
		};
	}
}

function mapSetStrokeColorParams(parameters: any): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		color: {
			r: parameters.Stroke_Red_Value || 1,
			g: parameters.Stroke_Green_Value || 0,
			b: parameters.Stroke_Blue_Value || 0,
			a: parameters.Stroke_Alpha_Value || 1,
		},
		removeStroke: parameters.Remove_Stroke || false,
	};
}

function mapCloneNodeParams(parameters: any): { nodeId: string; x?: number; y?: number } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		x: parameters.x,
		y: parameters.y,
	};
}

function mapExportNodeAsImageParams(parameters: any): { nodeId: string; scale: number; format: string } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		scale: parameters.scale || 1,
		format: parameters.format || 'PNG',
	};
}

function mapGetNodeInfoParams(parameters: any): { nodeId: string } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
	};
}

function mapGetNodesInfoParams(parameters: any): { nodeIds: string[] } {
	if (!parameters.nodeIds) {
		throw new Error('Node IDs are required.');
	}
	return {
		nodeIds: parseNodeIds(parameters.nodeIds),
	};
}

function mapSetTextContentParams(parameters: any): { nodeId: string; newContent: string } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		newContent: parameters.newTextContent || parameters.text || 'Hello World',
	};
}


function mapSetCornerRadiusParams(parameters: any): { nodeId: string; cornerRadius: number } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		cornerRadius: parameters.cornerRadius || 0,
	};
}

function mapScanTextNodesParams(parameters: any): { nodeId: string | null } {
	return {
		nodeId: parameters.nodeId || null,
	};
}

function mapScanNodesByTypesParams(parameters: any): { nodeTypes: string[]; nodeId: string | null } {
	return {
		nodeTypes: parameters.nodeTypes ? parseNodeIds(parameters.nodeTypes) : ['TEXT'],
		nodeId: parameters.nodeId || null,
	};
}

function mapSetMultipleTextContentsParams(parameters: any): { updates: any[] } {
	return {
		updates: parseJsonParameter(parameters.textUpdates, 'text updates'),
	};
}

function mapDeleteMultipleNodesParams(parameters: any): { nodeIds: string[] } {
	if (!parameters.nodeIds) {
		throw new Error('Node IDs are required.');
	}
	return {
		nodeIds: parseNodeIds(parameters.nodeIds),
	};
}

function mapSetLayoutModeParams(parameters: any): { nodeId: string; layoutMode: string } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		layoutMode: parameters.layoutMode || 'VERTICAL',
	};
}

function mapSetPaddingParams(parameters: any): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		paddingTop: parameters.paddingTop || 0,
		paddingRight: parameters.paddingRight || 0,
		paddingBottom: parameters.paddingBottom || 0,
		paddingLeft: parameters.paddingLeft || 0,
	};
}

function mapSetAxisAlignParams(parameters: any): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		primaryAxisAlignItems: parameters.primaryAxisAlignItems || 'CENTER',
		counterAxisAlignItems: parameters.counterAxisAlignItems || 'CENTER',
	};
}

function mapSetLayoutSizingParams(parameters: any): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		horizontalSizing: parameters.horizontalSizing || 'FIXED',
		verticalSizing: parameters.verticalSizing || 'FIXED',
	};
}

function mapSetItemSpacingParams(parameters: any): { nodeId: string; itemSpacing: number } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		itemSpacing: parameters.itemSpacing || 0,
	};
}

function mapGetAnnotationsParams(parameters: any): { nodeId: string | null } {
	return {
		nodeId: parameters.nodeId || null,
	};
}

function mapSetAnnotationParams(parameters: any): { nodeId: string; text: string } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		text: parameters.annotationText || '',
	};
}

function mapGetInstanceOverridesParams(parameters: any): { sourceInstanceId: string } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		sourceInstanceId: parameters.nodeId,
	};
}

function mapSetInstanceOverridesParams(parameters: any): { nodeId: string; overrides: any } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	
	// Build overrides object from structured inputs
	const overrides: any = {};
	
	// Handle component properties (variants) - Only this is supported by Figma Plugin API
	if (parameters.componentProperties?.property) {
		overrides.componentProperties = {};
		const properties = Array.isArray(parameters.componentProperties.property) 
			? parameters.componentProperties.property 
			: [parameters.componentProperties.property];
		
		properties.forEach((prop: any) => {
			if (prop.name && prop.value) {
				overrides.componentProperties[prop.name] = prop.value;
			}
		});
	}
	
	return {
		nodeId: parameters.nodeId,
		overrides: overrides,
	};
}

function mapSetDefaultConnectorParams(parameters: any): { connectorId: string } {
	if (!parameters.connectorId) {
		throw new Error('Connector ID is required.');
	}
	return {
		connectorId: parameters.connectorId,
	};
}

/**
 * Special async handler for create_image_from_url command
 * This requires access to n8n helpers and should be called from the main execution context
 */
export async function mapCreateImageFromUrlParamsAsync(
	parameters: any, 
	items: any[], 
	itemIndex: number, 
	helpers: any
): Promise<any> {
	const imageSourceType = parameters.imageSourceType || 'url';
	
	if (imageSourceType === 'url') {
		// 다양한 URL 파라미터 이름 지원
		const imageUrl = parameters.url || parameters.Image_URL || parameters.imageUrl;
		
		if (!imageUrl) {
			throw new Error('Image URL is required.');
		}
		
		// URL에서 이미지를 다운로드하고 base64로 변환
		try {
			const response = await helpers.httpRequest({
				method: 'GET',
				url: imageUrl,
				encoding: 'arraybuffer' as any, // 바이너리 데이터로 받기
				returnFullResponse: true,
			});
			
			if (response.statusCode !== 200) {
				throw new Error(`Failed to fetch image: HTTP ${response.statusCode}`);
			}
			
			// 바이너리 데이터를 base64로 변환
			const base64Data = Buffer.from(response.body as ArrayBuffer).toString('base64');
			const mimeType = response.headers['content-type'] || 'image/png';
			
			console.log('Image fetch result:', {
				url: imageUrl,
				statusCode: response.statusCode,
				mimeType: mimeType,
				bodyType: typeof response.body,
				bodySize: response.body ? (response.body as ArrayBuffer).byteLength : 0,
				base64Length: base64Data.length,
				base64Preview: base64Data.substring(0, 100)
			});
			
			return {
				base64Data: base64Data,
				mimeType: mimeType,
				x: parameters.x || parameters.X_Position || 0,
				y: parameters.y || parameters.Y_Position || 0,
				width: parameters.width || parameters.Width || 200,
				height: parameters.height || parameters.Height || 200,
				name: parameters.name || parameters.Name || `Image ${Date.now()}`,
				parentId: parameters.parentId || parameters.Parent_Node_ID || null,
				scaleMode: parameters.scaleMode || 'FILL',
				cornerRadius: parameters.cornerRadius || parameters.Image_Corner_Radius || 0,
			};
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			throw new Error(`Failed to download image from URL: ${errorMessage}`);
		}
	} else if (imageSourceType === 'binary') {
		const binaryProperty = parameters.binaryProperty || 'data';
		const binaryData = items[itemIndex].binary?.[binaryProperty];
		
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
		
		return {
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
	
	throw new Error('Invalid image source type');
}

function mapCreateImageFromUrlParams(parameters: any): any {
	// This function should not be called directly for create_image_from_url
	// Use mapCreateImageFromUrlParamsAsync instead
	throw new Error('create_image_from_url requires async parameter mapping. Use mapCreateImageFromUrlParamsAsync instead.');
}

function mapCreateVectorPathParams(parameters: any): any {
	if (!parameters.pathData) {
		throw new Error('SVG Path Data is required.');
	}
	return {
		pathData: parameters.pathData,
		x: parameters.x || 0,
		y: parameters.y || 0,
		name: parameters.name || `Vector Path ${Date.now()}`,
		parentId: mapParentId(parameters),
	};
}

function mapCreateBooleanOperationParams(parameters: any): any {
	const nodeIds = parameters.sourceNodeIds || parameters.Source_Node_IDs;
	if (!nodeIds) {
		throw new Error('Source Node IDs are required.');
	}
	return {
		operation: parameters.operation || parameters.Operation_Type || 'UNION',
		nodeIds: parseNodeIds(nodeIds), // Changed from sourceNodeIds to nodeIds
		name: parameters.name || `Boolean Operation ${Date.now()}`,
		parentId: mapParentId(parameters),
	};
}

function mapCreateDesignFromSvgParams(parameters: any): any {
	const svgContent = parameters.svgContent || parameters.SVG_Content || parameters.svg_content;
	
	if (!svgContent) {
		throw new Error('SVG Content is required.');
	}
	return {
		svgContent: svgContent,
		x: parameters.x || parameters.X || 0,
		y: parameters.y || parameters.Y || 0,
		width: parameters.width || parameters.Width || 100,
		height: parameters.height || parameters.Height || 100,
		name: parameters.name || parameters.Name || `Design ${Date.now()}`,
		parentId: mapParentId(parameters),
	};
}

function mapCreateGroupParams(parameters: any): any {
	if (!parameters.nodeIds) {
		throw new Error('Node IDs are required for group creation.');
	}
	return {
		nodeIds: parameters.nodeIds,
		name: parameters.name || `Group ${Date.now()}`,
		parentId: mapParentId(parameters),
	};
}

function mapSetOpacityParams(parameters: any): { nodeId: string; opacity: number } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		opacity: parameters.opacity !== undefined ? parameters.opacity : 1,
	};
}

function mapSetRotationParams(parameters: any): { nodeId: string; rotation: number } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		rotation: parameters.rotation || 0,
	};
}

function mapAddShadowParams(parameters: any, command: string): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
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
}

function mapAddBlurParams(parameters: any): { nodeId: string; radius: number } {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		radius: parameters.blurRadius || 4,
	};
}

function mapSetIndividualCornerRadiusParams(parameters: any): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
		topLeftRadius: parameters.topLeftRadius || 0,
		topRightRadius: parameters.topRightRadius || 0,
		bottomRightRadius: parameters.bottomRightRadius || 0,
		bottomLeftRadius: parameters.bottomLeftRadius || 0,
	};
}

function mapSelectNodesParams(parameters: any): any {
	return {
		nodeIds: parameters.nodeIds ? parseNodeIds(parameters.nodeIds) : [],
		scrollIntoView: parameters.scrollIntoView !== undefined ? parameters.scrollIntoView : true,
	};
}

function mapSelectNodesByTypeParams(parameters: any): any {
	if (!parameters.nodeType) {
		throw new Error('Node Type is required.');
	}
	return {
		nodeType: parameters.nodeType,
		inSelection: parameters.inSelection || false,
	};
}

function mapSelectNodesByNameParams(parameters: any): any {
	if (!parameters.namePattern) {
		throw new Error('Name Pattern is required.');
	}
	return {
		namePattern: parameters.namePattern,
		matchType: parameters.matchType || 'contains',
		caseSensitive: parameters.caseSensitive || false,
	};
}

function mapApplyStylesToSelectionParams(parameters: any): any {
	const result: any = {};
	
	// Map fill color
	const fillColor = createColorFromComponents(
		parameters.Fill_Color_R,
		parameters.Fill_Color_G,
		parameters.Fill_Color_B,
		parameters.Fill_Color_A
	);
	if (fillColor) result.fillColor = fillColor;
	
	// Map stroke color
	const strokeColor = createColorFromComponents(
		parameters.Stroke_Color_R,
		parameters.Stroke_Color_G,
		parameters.Stroke_Color_B,
		parameters.Stroke_Color_A
	);
	if (strokeColor) result.strokeColor = strokeColor;
	
	// Map stroke properties
	if (parameters.strokeWeight !== undefined) result.strokeWeight = parameters.strokeWeight;
	if (parameters.strokeAlign !== undefined) result.strokeAlign = parameters.strokeAlign;
	
	// Map other properties
	if (parameters.opacity !== undefined) result.opacity = parameters.opacity;
	if (parameters.cornerRadius !== undefined) result.cornerRadius = parameters.cornerRadius;
	if (parameters.addDropShadow !== undefined) result.addDropShadow = parameters.addDropShadow;
	if (parameters.addInnerShadow !== undefined) result.addInnerShadow = parameters.addInnerShadow;
	if (parameters.addBlur !== undefined) result.addBlur = parameters.addBlur;
	if (parameters.blurRadius !== undefined) result.blurRadius = parameters.blurRadius;
	
	return result;
}

function mapApplyTextStylesToSelectionParams(parameters: any): any {
	const result: any = {};
	
	// Map text properties
	if (parameters.fontSize !== undefined) result.fontSize = parameters.fontSize;
	if (parameters.fontFamily !== undefined) result.fontFamily = parameters.fontFamily;
	if (parameters.fontWeight !== undefined) result.fontWeight = parameters.fontWeight;
	
	// Map text color
	const textColor = createColorFromComponents(
		parameters.Font_Color_R,
		parameters.Font_Color_G,
		parameters.Font_Color_B,
		parameters.Font_Color_A
	);
	if (textColor) result.textColor = textColor;
	
	// Map text alignment and spacing
	if (parameters.textAlign !== undefined) result.textAlign = parameters.textAlign;
	if (parameters.letterSpacing !== undefined) result.letterSpacing = parameters.letterSpacing;
	if (parameters.lineHeight !== undefined) result.lineHeight = parameters.lineHeight;
	
	return result;
}

function mapApplyStylesToNodesParams(parameters: any): any {
	if (!parameters.nodeIds) {
		throw new Error('Node IDs are required.');
	}
	
	const result: any = {
		nodeIds: parseNodeIds(parameters.nodeIds),
	};
	
	// Map fill color
	const fillColor = createColorFromComponents(
		parameters.Fill_Color_R,
		parameters.Fill_Color_G,
		parameters.Fill_Color_B,
		parameters.Fill_Color_A
	);
	if (fillColor) result.fillColor = fillColor;
	
	// Map stroke color
	const strokeColor = createColorFromComponents(
		parameters.Stroke_Color_R,
		parameters.Stroke_Color_G,
		parameters.Stroke_Color_B,
		parameters.Stroke_Color_A
	);
	if (strokeColor) result.strokeColor = strokeColor;
	
	// Map stroke properties
	if (parameters.strokeWeight !== undefined) result.strokeWeight = parameters.strokeWeight;
	if (parameters.strokeAlign !== undefined) result.strokeAlign = parameters.strokeAlign;
	if (parameters.strokeCap !== undefined) result.strokeCap = parameters.strokeCap;
	if (parameters.strokeJoin !== undefined) result.strokeJoin = parameters.strokeJoin;
	if (parameters.dashPattern !== undefined) result.dashPattern = parameters.dashPattern;
	
	// Map other properties
	if (parameters.opacity !== undefined) result.opacity = parameters.opacity;
	if (parameters.cornerRadius !== undefined) result.cornerRadius = parameters.cornerRadius;
	
	return result;
}

// Layer order parameter mapping functions

function mapReorderLayerParams(parameters: any): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	if (parameters.targetIndex === undefined || parameters.targetIndex < 0) {
		throw new Error('Valid target index is required (0 or greater).');
	}
	return {
		nodeId: parameters.nodeId,
		targetIndex: parameters.targetIndex,
	};
}

function mapMoveToFrontParams(parameters: any): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
	};
}

function mapMoveToBackParams(parameters: any): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
	};
}

function mapMoveForwardParams(parameters: any): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
	};
}

function mapMoveBackwardParams(parameters: any): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	return {
		nodeId: parameters.nodeId,
	};
}

function mapSortLayersByNameParams(parameters: any): any {
	return {
		parentNodeId: parameters.parentNodeId || null,
		sortOrder: parameters.sortOrder || 'ascending',
		caseSensitive: parameters.caseSensitive !== undefined ? parameters.caseSensitive : true,
	};
}

function mapSortLayersByPositionParams(parameters: any): any {
	return {
		parentNodeId: parameters.parentNodeId || null,
		sortBy: parameters.sortBy || 'x',
		sortOrder: parameters.sortOrder || 'ascending',
	};
}

function mapReorderMultipleLayersParams(parameters: any): any {
	if (!parameters.nodeIds) {
		throw new Error('Node IDs are required.');
	}
	return {
		nodeIds: parseNodeIds(parameters.nodeIds),
		startIndex: parameters.startIndex || 0,
	};
}

function mapCreateComponentFromNodesParams(parameters: any): any {
	if (!parameters.nodeIds) {
		throw new Error('Node IDs are required.');
	}
	
	return {
		nodeIds: parseNodeIds(parameters.nodeIds),
		name: parameters.name || 'Component',
		description: parameters.description || '',
	};
}

function mapSearchAvailableFontsParams(parameters: any): any {
	return {
		keyword: parameters.keyword || parameters.Keyword || '',
	};
}

function mapGetComponentsParams(parameters: any): any {
	return {
		searchLocal: parameters.searchLocal !== false,
		searchRemote: parameters.searchRemote || false,
		includeVariants: parameters.includeVariants || false,
	};
}

function mapCreateInstanceParams(parameters: any): any {
	console.log('=== mapCreateInstanceParams Debug ===');
	console.log('Input parameters:', JSON.stringify(parameters, null, 2));
	
	if (!parameters.componentId) {
		throw new Error('Component ID is required.');
	}
	
	const result: any = {
		componentId: parameters.componentId,
		x: parameters.x || 0,
		y: parameters.y || 0,
	};
	
	// Optional name
	if (parameters.name) {
		result.name = parameters.name;
	}
	
	// Optional parent ID
	if (parameters.parentId) {
		result.parentId = parameters.parentId;
	}
	
	// Component properties (for variant overrides)
	if (parameters.componentProperties) {
		console.log('componentProperties type:', typeof parameters.componentProperties);
		console.log('componentProperties value:', parameters.componentProperties);
		
		result.componentProperties = {};
		
		// Handle both object and array formats
		if (Array.isArray(parameters.componentProperties.property)) {
			// Array format from fixedCollection
			console.log('Processing as array format');
			for (const propItem of parameters.componentProperties.property) {
				if (propItem.name && propItem.value !== undefined) {
					result.componentProperties[propItem.name] = propItem.value;
				}
			}
		} else if (typeof parameters.componentProperties === 'object') {
			// Direct object format
			console.log('Processing as direct object format');
			result.componentProperties = parameters.componentProperties;
		}
		
		console.log('Final componentProperties:', result.componentProperties);
	}
	
	return result;
}

function mapDetachInstanceParams(parameters: any): any {
	if (!parameters.nodeId) {
		throw new Error('Node ID is required.');
	}
	
	return {
		nodeId: parameters.nodeId,
	};
}