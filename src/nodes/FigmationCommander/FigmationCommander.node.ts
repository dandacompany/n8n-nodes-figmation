import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { 
	createWebSocketClient, 
	sendFigmaCommand, 
	getFigmaChannels,
	WebSocketClient,
	WebSocketConnectionError,
	WebSocketTimeoutError 
} from './websocket-client';
import { mapParametersForCommand, mapCreateImageFromUrlParamsAsync } from './parameter-mapping';
import { figmationCommanderProperties } from './properties';
import { getSubtitleTemplate } from './subtitles';

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
		subtitle: getSubtitleTemplate(),
		properties: figmationCommanderProperties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const command = this.getNodeParameter('command', i) as string;
				const parameters = this.getNodeParameter('parameters.params', i, {}) as any;
				const port = this.getNodeParameter('port', i, 3055) as number;
				const channelId = command === 'get_channels' ? '' : this.getNodeParameter('channelId', i) as string;
				const host = 'localhost'; // Fixed to localhost

				if (!channelId && command !== 'get_channels') {
					throw new Error('Channel ID is required for this command.');
				}

				console.log('=== Figma WebSocket Command Debug ===');
				console.log('Host:', host);
				console.log('Port:', port);
				console.log('Channel ID:', channelId || 'N/A (get_channels)');
				console.log('Command:', command);
				console.log('Parameters:', parameters);

				// Build command parameters using modular parameter mapping
				let commandParams: any = {};

				// Handle special case for create_image_from_url which requires async operations
				if (command === 'create_image_from_url') {
					commandParams = await mapCreateImageFromUrlParamsAsync(parameters, items, i, this.helpers);
				} else {
					// Use the modular parameter mapping for all other commands
					commandParams = mapParametersForCommand(command, parameters);
				}

				// Execute command
				let result: any;
				let webSocketClient: WebSocketClient | null = null;

				try {
					if (command === 'get_channels') {
						console.log('Getting channel list...');
						result = await getFigmaChannels(host, port);
					} else {
						// Create WebSocket client for command execution
						webSocketClient = createWebSocketClient({
							host,
							port,
							channelId,
							timeout: 30000 // 30 seconds timeout
						});

						// Connect and send command
						await webSocketClient.connect();
						console.log('Sending Figma command:', command, commandParams);
						result = await webSocketClient.sendCommand(command, commandParams);
					}
				} finally {
					// Clean up WebSocket connection
					if (webSocketClient) {
						webSocketClient.disconnect();
					}
				}

				console.log('Command execution result:', result);

				// Return result
				returnData.push({
					json: {
						command,
						channelId,
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
				
				// Determine error type for better error reporting
				let errorType = 'unknown';
				let errorMessage = error instanceof Error ? error.message : String(error);
				
				if (error instanceof WebSocketConnectionError) {
					errorType = 'connection';
				} else if (error instanceof WebSocketTimeoutError) {
					errorType = 'timeout';
				} else if (error instanceof Error && error.message.includes('Channel')) {
					errorType = 'channel';
				}
				
				returnData.push({
					json: {
						command: this.getNodeParameter('command', i, 'unknown'),
						channelId: this.getNodeParameter('channelId', i, 'unknown'),
						error: errorMessage,
						errorType: errorType,
						timestamp: new Date().toISOString(),
						success: false,
					},
				});
			}
		}

		return [returnData];
	}

}