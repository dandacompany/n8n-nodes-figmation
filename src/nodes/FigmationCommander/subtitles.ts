// Subtitle templates for FigmationCommander node

import { CommandType } from './types'

/**
 * Generate dynamic subtitle based on selected command and parameters
 */
export function getSubtitleTemplate(): string {
  const conditions = [
    '$parameter["command"] === "get_channels" ? "Get available channels"',
    '$parameter["command"] === "create_rectangle" ? "Create rectangle: " + ($parameter["width"] || "100") + "×" + ($parameter["height"] || "100")',
    '$parameter["command"] === "create_frame" ? "Create frame: " + ($parameter["width"] || "100") + "×" + ($parameter["height"] || "100")',
    '$parameter["command"] === "create_text" ? "Create text: \\"" + ($parameter["text"] || "Sample Text") + "\\""',
    '$parameter["command"] === "create_image_from_url" ? "Create image from: " + ($parameter["url"] || "URL")',
    '$parameter["command"] === "create_slider" ? "Create slider: " + ($parameter["minValue"] || "0") + "-" + ($parameter["maxValue"] || "100")',
    '$parameter["command"] === "create_ellipse" ? "Create ellipse: " + ($parameter["width"] || "100") + "×" + ($parameter["height"] || "100")',
    '$parameter["command"] === "create_vector_path" ? "Create vector path"',
    '$parameter["command"] === "create_button" ? "Create button: \\"" + ($parameter["text"] || "Button") + "\\""',
    '$parameter["command"] === "create_boolean_operation" ? "Boolean op: " + ($parameter["operation"] || "UNION")',
    '$parameter["command"] === "create_design_from_svg" ? "Create design from SVG"',
    '$parameter["command"] === "create_input_field" ? "Create input field: \\"" + ($parameter["placeholder"] || "Enter text...") + "\\""',
    '$parameter["command"] === "create_checkbox" ? "Create checkbox: \\"" + ($parameter["label"] || "Checkbox") + "\\""',
    '$parameter["command"] === "create_toggle" ? "Create toggle: \\"" + ($parameter["label"] || "Toggle") + "\\""',
    '$parameter["command"] === "create_symbol" ? "Create symbol from selection"',
    '$parameter["command"] === "create_avatar" ? "Create avatar: " + ($parameter["avatarSize"] || "48") + "px " + ($parameter["avatarType"] || "initials")',
    '$parameter["command"] === "create_progress_bar" ? "Create progress: " + ($parameter["progress"] || "50") + "%"',
    '$parameter["command"] === "get_document_info" ? "Get document information"',
    '$parameter["command"] === "get_selection" ? "Get selected elements"',
    '$parameter["command"] === "move_node" ? "Move to: (" + ($parameter["x"] || "0") + ", " + ($parameter["y"] || "0") + ")"',
    '$parameter["command"] === "resize_node" ? "Resize to: " + ($parameter["width"] || "100") + "×" + ($parameter["height"] || "100")',
    '$parameter["command"] === "delete_node" ? "Delete element"',
    '$parameter["command"] === "set_fill_color" ? "Fill color: " + ($parameter["color"] || "#FF5733")',
    '$parameter["command"] === "set_stroke_color" ? "Stroke color: " + ($parameter["color"] || "#000000")',
    '$parameter["command"] === "clone_node" ? "Clone element"',
    '$parameter["command"] === "export_node_as_image" ? "Export as image"',
    '$parameter["command"] === "reorder_layer" ? "Reorder layer to index: " + ($parameter["targetIndex"] || "0")',
    '$parameter["command"] === "move_to_front" ? "Move to front"',
    '$parameter["command"] === "move_to_back" ? "Move to back"',
    '$parameter["command"] === "move_forward" ? "Move forward"',
    '$parameter["command"] === "move_backward" ? "Move backward"',
    '$parameter["command"] === "sort_layers_by_name" ? "Sort layers by name (" + ($parameter["sortOrder"] || "asc") + ")"',
    '$parameter["command"] === "sort_layers_by_position" ? "Sort layers by position (" + ($parameter["sortBy"] || "x") + ")"',
    '$parameter["command"] === "reorder_multiple_layers" ? "Reorder multiple layers"',
    '$parameter["command"] === "search_available_fonts" ? "Search available fonts"',
    '$parameter["command"] || "Select command"'
  ]
  
  return '={{' + conditions.join(' : ') + '}}'
}

/**
 * Subtitle templates for specific commands
 */
export const SUBTITLE_TEMPLATES: Record<CommandType, (params: any) => string> = {
  get_channels: () => "Get available channels",
  create_rectangle: (params) => `Create rectangle: ${params.width || 100}×${params.height || 100}`,
  create_frame: (params) => `Create frame: ${params.width || 100}×${params.height || 100}`,
  create_text: (params) => `Create text: "${params.text || 'Sample Text'}"`,
  create_image_from_url: (params) => `Create image from: ${params.url || 'URL'}`,
  create_slider: (params) => `Create slider: ${params.minValue || 0}-${params.maxValue || 100}`,
  create_ellipse: (params) => `Create ellipse: ${params.width || 100}×${params.height || 100}`,
  create_vector_path: () => "Create vector path",
  create_button: (params) => `Create button: "${params.text || 'Button'}"`,
  create_boolean_operation: (params) => `Boolean op: ${params.operation || 'UNION'}`,
  create_design_from_svg: () => "Create design from SVG",
  create_input_field: (params) => `Create input field: "${params.placeholder || 'Enter text...'}"`,
  create_checkbox: (params) => `Create checkbox: "${params.label || 'Checkbox'}"`,
  create_toggle: (params) => `Create toggle: "${params.label || 'Toggle'}"`,
  create_symbol: () => "Create symbol from selection",
  create_avatar: (params) => `Create avatar: ${params.avatarSize || 48}px ${params.avatarType || 'initials'}`,
  create_progress_bar: (params) => `Create progress: ${params.progress || 50}%`,
  get_document_info: () => "Get document information",
  get_selection: () => "Get selected elements",
  move_node: (params) => `Move to: (${params.x || 0}, ${params.y || 0})`,
  resize_node: (params) => `Resize to: ${params.width || 100}×${params.height || 100}`,
  delete_node: () => "Delete element",
  set_fill_color: (params) => `Fill color: ${params.color || '#FF5733'}`,
  set_stroke_color: (params) => `Stroke color: ${params.color || '#000000'}`,
  clone_node: () => "Clone element",
  export_node_as_image: () => "Export as image",
  create_circle: (params) => `Create circle: ${params.radius || 50}px`,
  create_line: (params) => `Create line: ${params.length || 100}px`,
  create_star: (params) => `Create star: ${params.points || 5} points`,
  create_polygon: (params) => `Create polygon: ${params.sides || 6} sides`,
  create_auto_layout: () => "Create auto layout frame",
  create_component: (params) => `Create component: "${params.name || 'Component'}"`,
  create_instance: (params) => `Create instance of: ${params.componentId || 'component'}`,
  rotate_node: (params) => `Rotate: ${params.rotation || 0}°`,
  group_nodes: () => "Group selected nodes",
  ungroup_node: () => "Ungroup node",
  replace_image: () => "Replace image",
  boolean_union: () => "Boolean union",
  boolean_subtract: () => "Boolean subtract",
  boolean_intersect: () => "Boolean intersect",
  boolean_exclude: () => "Boolean exclude",
  get_node_info: () => "Get node info",
  search_nodes: (params) => `Search: "${params.query || 'query'}"`,
  get_page_info: () => "Get page info",
  set_layout_grid: () => "Set layout grid",
  set_opacity: (params) => `Set opacity: ${params.opacity || 100}%`,
  apply_effect: (params) => `Apply effect: ${params.effectType || 'effect'}`,
  set_corner_radius: (params) => `Corner radius: ${params.radius || 0}px`,
  update_text: (params) => `Update text: "${params.newContent || 'content'}"`,
  set_font: (params) => `Set font: ${params.fontFamily || 'Inter'}`,
  create_group: () => "Create group",
  // Layer order commands
  reorder_layer: (params) => `Reorder layer to index: ${params.targetIndex || 0}`,
  move_to_front: () => "Move to front",
  move_to_back: () => "Move to back",
  move_forward: () => "Move forward",
  move_backward: () => "Move backward",
  sort_layers_by_name: (params) => `Sort layers by name (${params.sortOrder || 'asc'})`,
  sort_layers_by_position: (params) => `Sort layers by position (${params.sortBy || 'x'})`,
  reorder_multiple_layers: () => "Reorder multiple layers",
  search_available_fonts: () => "Search available fonts"
}


/**
 * Get subtitle for a specific command
 */
export function getSubtitle(command: CommandType, params: any = {}): string {
  const template = SUBTITLE_TEMPLATES[command]
  return template ? template(params) : "Select command"
}