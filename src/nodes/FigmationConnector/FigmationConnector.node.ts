import { ITriggerFunctions, ITriggerResponse, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { FigmaWebSocketServer } from '../../shared/WebSocketServer';
import * as net from 'net';
import { v4 as uuidv4 } from 'uuid';

interface WebSocketTriggerInstance {
	id: string;
	serverId: string;
	wsPort: number;
	wsHost: string;
	startTime: string;
	webSocketServer: FigmaWebSocketServer;
}

interface StaticData {
	triggers?: { [key: string]: WebSocketTriggerInstance };
}

// Function to check if port is available
async function isPortAvailable(port: number, host: string = 'localhost'): Promise<boolean> {
	return new Promise((resolve) => {
		const server = net.createServer();
		
		server.once('error', (err: any) => {
			if (err.code === 'EADDRINUSE') {
				console.log(`⚠️ Port ${port} is already in use.`);
				resolve(false);
			} else {
				console.log(`⚠️ Error checking port ${port}:`, err.message);
				resolve(false);
			}
		});
		
		server.once('listening', () => {
			server.close();
			console.log(`✅ Port ${port} is available.`);
			resolve(true);
		});
		
		server.listen(port, host);
	});
}

export class FigmationConnector implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Figmation Connector',
		name: 'figmationConnector',
		icon: 'file:figmation.png',
		group: ['trigger'],
		version: 1,
		description: 'Figma WebSocket server trigger - triggers on client connection and command reception',
		defaults: {
			name: 'Figmation Connector',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		eventTriggerDescription: 'Triggers workflow when a Figma client connects or a command is received',
		activationMessage: 'Figma WebSocket server has started.',
		properties: [
			{
				displayName: 'WebSocket Host',
				name: 'wsHost',
				type: 'string',
				default: '0.0.0.0',
				description: 'WebSocket server host (use 0.0.0.0 for all interfaces, localhost for local only)',
				required: true,
			},
			{
				displayName: 'WebSocket Port',
				name: 'wsPort',
				type: 'number',
				default: 3055,
				description: 'WebSocket server port',
				required: true,
			},
			{
				displayName: 'Server ID (Channel ID)',
				name: 'serverId',
				type: 'string',
				default: '',
				description: 'WebSocket server ID (leave empty to auto-generate, also used as channel ID)',
			},
			{
				displayName: 'Event Types',
				name: 'eventTypes',
				type: 'multiOptions',
				options: [
					{
						name: 'Client Connected',
						value: 'client_connected',
					},
					{
						name: 'Client Disconnected',
						value: 'client_disconnected',
					},
					{
						name: 'Command Received',
						value: 'command_received',
					},
					{
						name: 'Command Result',
						value: 'command_result',
					},
				],
				default: ['client_connected', 'command_received', 'command_result'],
				description: 'Event types to trigger on',
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		console.log('🚀 FigmaWebSocketTrigger trigger node activated');
		
		const wsHost = this.getNodeParameter('wsHost') as string;
		const wsPort = this.getNodeParameter('wsPort') as number;
		const serverId = this.getNodeParameter('serverId') as string;
		const eventTypes = this.getNodeParameter('eventTypes') as string[];

		// Auto-generate server ID (also used as channel ID)
		const finalServerId = serverId || `server_${uuidv4().substring(0, 8)}`;
		
		// Generate trigger instance ID
		const triggerId = `trigger_${finalServerId}_${Date.now()}`;

		console.log('📋 Trigger parameters:', {
			wsHost,
			wsPort,
			serverId: finalServerId,
			eventTypes,
			triggerId,
		});

		// Check WebSocket port availability
		console.log('🔍 Checking WebSocket port availability...');
		const wsPortAvailable = await isPortAvailable(wsPort, wsHost);

		if (!wsPortAvailable) {
			throw new Error(`WebSocket port ${wsPort} on host ${wsHost} is already in use.`);
		}

		// Create WebSocket server
		console.log('🚀 Creating WebSocket server...');
		const webSocketServer = new FigmaWebSocketServer({ port: wsPort, host: wsHost });
		console.log(`✅ WebSocket server created: ${webSocketServer.getServerUrl()}`);

		// Create channel (use server ID as channel ID)
		console.log(`📡 Creating channel: ${finalServerId}`);
		try {
			await webSocketServer.createChannel(finalServerId, finalServerId);
			console.log(`✅ Channel created: ${finalServerId}`);
		} catch (channelError) {
			console.error(`❌ Channel creation failed: ${finalServerId}`, channelError);
			throw new Error(`Channel creation failed: ${channelError}`);
		}

		// Define trigger function
		const triggerFunction = this.helpers.returnJsonArray;

		// Set up WebSocket event listeners
		webSocketServer.on('figma_event', (eventData) => {
			console.log('📨 Figma event received:', eventData);
			
			if (eventTypes.includes('command_received') && eventData.type === 'command') {
				const executionData: INodeExecutionData = {
					json: {
						eventType: 'command_received',
						timestamp: new Date().toISOString(),
						serverId: finalServerId,
						triggerId,
						command: eventData.command,
						params: eventData.params,
						commandId: eventData.id,
						sourceType: 'figma_plugin',
					}
				};
				
				triggerFunction([executionData]);
			}
			
			if (eventTypes.includes('command_result') && eventData.type === 'command_result') {
				const executionData: INodeExecutionData = {
					json: {
						eventType: 'command_result',
						timestamp: new Date().toISOString(),
						serverId: finalServerId,
						triggerId,
						commandId: eventData.id,
						result: eventData.result,
						sourceType: 'figma_plugin',
					}
				};
				
				triggerFunction([executionData]);
			}
		});

		// Client connect/disconnect events
		webSocketServer.on('clientConnected', (clientInfo) => {
			console.log('🔗 WebSocket client connected:', clientInfo);
			
			if (eventTypes.includes('client_connected')) {
				const executionData: INodeExecutionData = {
					json: {
						eventType: 'client_connected',
						timestamp: new Date().toISOString(),
						serverId: finalServerId,
						triggerId,
						clientInfo,
						connectedClients: webSocketServer.getConnectedClients(),
					}
				};
				
				triggerFunction([executionData]);
			}
		});

		webSocketServer.on('clientDisconnected', (clientInfo) => {
			console.log('🔌 WebSocket 클라이언트 연결 해제됨:', clientInfo);
			
			if (eventTypes.includes('client_disconnected')) {
				const executionData: INodeExecutionData = {
					json: {
						eventType: 'client_disconnected',
						timestamp: new Date().toISOString(),
						serverId: finalServerId,
						triggerId,
						clientInfo,
						connectedClients: webSocketServer.getConnectedClients(),
					}
				};
				
				triggerFunction([executionData]);
			}
		});

		// Save trigger instance
		const staticData = this.getWorkflowStaticData('node') as StaticData;
		if (!staticData.triggers) {
			staticData.triggers = {};
		}

		const triggerInstance: WebSocketTriggerInstance = {
			id: triggerId,
			serverId: finalServerId,
			wsPort,
			wsHost,
			startTime: new Date().toISOString(),
			webSocketServer,
		};

		staticData.triggers[triggerId] = triggerInstance;
		console.log(`💾 Trigger instance saved: ${triggerId}`);

		// Send initial activation event
		const initialExecutionData: INodeExecutionData = {
			json: {
				eventType: 'trigger_activated',
				timestamp: new Date().toISOString(),
				serverId: finalServerId,
				triggerId,
				websocketUrl: webSocketServer.getServerUrl(),
				status: 'Active',
				message: 'Figma WebSocket trigger has been successfully activated.',
				connectionInfo: {
					status: 'Active',
					websocketUrl: webSocketServer.getServerUrl(),
					serverId: finalServerId,
					note: 'Use the above server ID and WebSocket URL to connect.',
				},
			}
		};

		console.log('🎯 FigmaWebSocketTrigger node setup complete:');
		console.log(`   - WebSocket server: ${webSocketServer.getServerUrl()}`);
		console.log(`   - Server ID (Channel ID): ${finalServerId}`);
		console.log(`   - Trigger ID: ${triggerId}`);

		// Execute initial event immediately
		triggerFunction([initialExecutionData]);

		// Return trigger response
		return {
			closeFunction: async () => {
				console.log('🔒 FigmaWebSocketTrigger node shutting down...');
				
				// Close WebSocket server
				if (webSocketServer) {
					try {
						webSocketServer.close();
						console.log('✅ WebSocket server closed');
					} catch (error) {
						console.error('❌ Failed to close WebSocket server:', error);
					}
				}

				// Remove trigger instance
				if (staticData.triggers && staticData.triggers[triggerId]) {
					delete staticData.triggers[triggerId];
					console.log(`🗑️ Trigger instance removed: ${triggerId}`);
				}

				console.log('🔒 FigmaWebSocketTrigger node shutdown complete');
			},
		};
	}
}