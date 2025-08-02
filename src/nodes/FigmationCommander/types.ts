// Type definitions for FigmationCommander

export interface FigmaCommand {
  command: string
  serverId: string
  parameters: Record<string, any>
  timestamp: string
}

export interface FigmaCommandResult {
  success: boolean
  result?: any
  error?: string
  nodeId?: string
  name?: string
  type?: string
}

export interface WebSocketResponse {
  command: string
  serverId: string
  result?: FigmaCommandResult
  error?: string
  timestamp: string
  success: boolean
}

export type CommandType = 
  | 'get_channels'
  | 'create_rectangle'
  | 'create_frame'
  | 'create_text'
  | 'create_image_from_url'
  | 'create_slider'
  | 'create_ellipse'
  | 'create_vector_path'
  | 'create_button'
  | 'create_boolean_operation'
  | 'create_design_from_svg'
  | 'create_input_field'
  | 'create_checkbox'
  | 'create_toggle'
  | 'create_symbol'
  | 'create_avatar'
  | 'create_progress_bar'
  | 'get_document_info'
  | 'get_selection'
  | 'move_node'
  | 'resize_node'
  | 'delete_node'
  | 'set_fill_color'
  | 'set_stroke_color'
  | 'clone_node'
  | 'export_node_as_image'
  | 'create_circle'
  | 'create_line'
  | 'create_star'
  | 'create_polygon'
  | 'create_auto_layout'
  | 'create_component'
  | 'create_instance'
  | 'rotate_node'
  | 'group_nodes'
  | 'ungroup_node'
  | 'replace_image'
  | 'boolean_union'
  | 'boolean_subtract'
  | 'boolean_intersect'
  | 'boolean_exclude'
  | 'get_node_info'
  | 'search_nodes'
  | 'get_page_info'
  | 'set_layout_grid'
  | 'set_opacity'
  | 'apply_effect'
  | 'set_corner_radius'
  | 'update_text'
  | 'set_font'
  | 'create_group'
  | 'reorder_layer'
  | 'move_to_front'
  | 'move_to_back'
  | 'move_forward'
  | 'move_backward'
  | 'sort_layers_by_name'
  | 'sort_layers_by_position'
  | 'reorder_multiple_layers'
  | 'search_available_fonts'