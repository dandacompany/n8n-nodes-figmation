// Default value utilities for FigmationCommander node
// Provides different default values for tool usage vs regular usage

/**
 * Simplified conditional default - uses fromAI for tool mode, static for regular mode
 * Currently always returns fromAI format (can be enhanced later for conditional logic)
 */
export function toolOrStatic(
  paramName: string,
  description: string,
  paramType: 'string' | 'number' | 'boolean',
  staticValue: string | number | boolean
): string {
  const fromAI = `/*n8n-auto-generated-fromAI-override*/ $fromAI('${paramName}', \`${description}\`, '${paramType}')`
  
  // For now, always use fromAI format (tool-friendly)
  // TODO: Add conditional logic for tool vs regular node detection
  return `={{ ${fromAI} }}`
}

/**
 * Common parameter defaults for Figma commands
 */
export const PARAMETER_DEFAULTS = {
  // Position and dimensions
  X_POSITION: {
    paramName: 'X_Position',
    description: 'The X coordinate position in pixels where the object should be placed on the Figma canvas',
    type: 'number' as const,
    staticValue: 100
  },
  Y_POSITION: {
    paramName: 'Y_Position', 
    description: 'The Y coordinate position in pixels where the object should be placed on the Figma canvas',
    type: 'number' as const,
    staticValue: 100
  },
  WIDTH: {
    paramName: 'Width',
    description: 'The width in pixels for the object',
    type: 'number' as const,
    staticValue: 100
  },
  HEIGHT: {
    paramName: 'Height',
    description: 'The height in pixels for the object', 
    type: 'number' as const,
    staticValue: 100
  },
  
  // Content and styling
  NAME: {
    paramName: 'Name',
    description: 'A descriptive name for the layer in Figma',
    type: 'string' as const,
    staticValue: 'New Layer'
  },
  TEXT_CONTENT: {
    paramName: 'Text_Content',
    description: 'The text content to be displayed in the text node',
    type: 'string' as const,
    staticValue: 'Hello World'
  },
  FONT_SIZE: {
    paramName: 'Font_Size',
    description: 'The font size in pixels for the text',
    type: 'number' as const,
    staticValue: 16
  },
  
  // Node operations
  NODE_ID: {
    paramName: 'Node_ID',
    description: 'The unique ID of the target node in Figma to perform the operation on',
    type: 'string' as const,
    staticValue: ''
  },
  NEW_TEXT_CONTENT: {
    paramName: 'New_Text_Content',
    description: 'The new text content to set for the text node',
    type: 'string' as const,
    staticValue: 'Updated Text'
  }
}

/**
 * Generate default value for a parameter
 */
export function getParameterDefault(paramKey: keyof typeof PARAMETER_DEFAULTS): string {
  const param = PARAMETER_DEFAULTS[paramKey]
  return toolOrStatic(param.paramName, param.description, param.type, param.staticValue)
}