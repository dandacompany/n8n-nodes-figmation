import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

// Interfaces for WebSocket communication
export interface WebSocketClientConfig {
	host: string;
	port: number;
	channelId: string;
	timeout?: number;
}

export interface FigmaMessage {
	id: string;
	command: string;
	params?: any;
	timestamp: string;
	channelId?: string;
}

export interface FigmaResponse {
	id?: string;
	commandId?: string;
	type: 'command_result' | 'command_error' | 'registration_success' | 'registration_error';
	result?: any;
	error?: string;
	timestamp: string;
	success?: boolean;
}

export interface ChannelInfo {
	id: string;
	name: string;
	figmaClients: number;
	n8nClients: number;
	createdAt: string;
	lastActivity: string;
}

export enum WebSocketConnectionState {
	Connecting = 0,
	Open = 1,
	Closing = 2,
	Closed = 3,
}

export class WebSocketConnectionError extends Error {
	constructor(message: string, public readonly state?: WebSocketConnectionState) {
		super(message);
		this.name = 'WebSocketConnectionError';
	}
}

export class WebSocketTimeoutError extends Error {
	constructor(message: string = 'WebSocket operation timed out') {
		super(message);
		this.name = 'WebSocketTimeoutError';
	}
}

export class WebSocketClient {
	private ws: WebSocket | null = null;
	private config: WebSocketClientConfig;
	private pendingCommands: Map<string, { resolve: Function; reject: Function; timestamp: number }> = new Map();
	private connectionPromise: Promise<void> | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 3;
	private reconnectDelay = 1000; // Start with 1 second

	constructor(config: WebSocketClientConfig) {
		this.config = {
			timeout: 30000, // Default 30 seconds timeout
			...config,
		};
	}

	/**
	 * Connect to WebSocket server with automatic registration
	 */
	public async connect(clientPurpose: string = 'command'): Promise<void> {
		if (this.connectionPromise) {
			return this.connectionPromise;
		}

		this.connectionPromise = this.performConnection(clientPurpose);
		return this.connectionPromise;
	}

	private performConnection(clientPurpose: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const serverUrl = `ws://${this.config.host}:${this.config.port}`;
			console.log(`🔗 Connecting to WebSocket server: ${serverUrl}`);

			this.ws = new WebSocket(serverUrl);

			// Connection timeout
			const connectionTimeout = setTimeout(() => {
				this.cleanup();
				reject(new WebSocketConnectionError('Connection timeout', WebSocketConnectionState.Connecting));
			}, this.config.timeout!);

			this.ws.on('open', () => {
				clearTimeout(connectionTimeout);
				console.log('✅ WebSocket connection established');

				// Register client with server
				this.registerClient(clientPurpose)
					.then(() => {
						this.reconnectAttempts = 0; // Reset on successful connection
						resolve();
					})
					.catch(reject);
			});

			this.ws.on('message', (data: Buffer) => {
				try {
					const message = JSON.parse(data.toString()) as FigmaResponse;
					this.handleMessage(message);
				} catch (error) {
					console.error('❌ Error parsing WebSocket message:', error);
				}
			});

			this.ws.on('close', (code: number, reason: Buffer) => {
				clearTimeout(connectionTimeout);
				console.log(`🔌 WebSocket connection closed. Code: ${code}, Reason: ${reason.toString()}`);
				this.connectionPromise = null;
				this.cleanup();
			});

			this.ws.on('error', (error: Error) => {
				clearTimeout(connectionTimeout);
				console.error('❌ WebSocket error:', error);
				this.connectionPromise = null;
				reject(new WebSocketConnectionError(`Connection failed: ${error.message}`, WebSocketConnectionState.Closed));
			});
		});
	}

	private registerClient(clientPurpose: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
				reject(new WebSocketConnectionError('WebSocket not connected', this.getConnectionState()));
				return;
			}

			const clientType = clientPurpose === 'get_channels' ? 'n8n_get_channels' : 'n8n';
			const clientId = `n8n_${clientPurpose}_${Date.now()}`;

			const registerMessage: any = {
				type: 'register',
				clientType: clientType,
				clientId: clientId,
				message: `n8n ${clientPurpose} node connected`,
			};

			// Add channel ID for non-channel-listing operations
			if (clientPurpose !== 'get_channels' && this.config.channelId) {
				registerMessage.channelId = this.config.channelId;
			}

			console.log(`📝 Registering client: ${clientId} (${clientType})`);
			this.ws.send(JSON.stringify(registerMessage));

			// Set up one-time listeners for registration response
			const registrationTimeout = setTimeout(() => {
				reject(new WebSocketTimeoutError('Registration timeout'));
			}, 10000); // 10 second registration timeout

			const handleRegistrationSuccess = () => {
				clearTimeout(registrationTimeout);
				console.log('✅ Client registration successful');
				resolve();
			};

			const handleRegistrationError = (error: string) => {
				clearTimeout(registrationTimeout);
				console.error('❌ Client registration failed:', error);
				reject(new Error(`Registration failed: ${error}`));
			};

			// Store handlers to remove them later
			const successHandler = (message: FigmaResponse) => {
				if (message.type === 'registration_success') {
					handleRegistrationSuccess();
				}
			};

			const errorHandler = (message: FigmaResponse) => {
				if (message.type === 'registration_error') {
					handleRegistrationError(message.error || 'Unknown registration error');
				}
			};

			// Add temporary message handlers
			this.addTemporaryMessageHandler('registration_success', successHandler);
			this.addTemporaryMessageHandler('registration_error', errorHandler);
		});
	}

	private temporaryHandlers: Map<string, Function[]> = new Map();

	private addTemporaryMessageHandler(messageType: string, handler: Function): void {
		if (!this.temporaryHandlers.has(messageType)) {
			this.temporaryHandlers.set(messageType, []);
		}
		this.temporaryHandlers.get(messageType)!.push(handler);
	}

	private removeTemporaryMessageHandler(messageType: string, handler: Function): void {
		const handlers = this.temporaryHandlers.get(messageType);
		if (handlers) {
			const index = handlers.indexOf(handler);
			if (index > -1) {
				handlers.splice(index, 1);
			}
		}
	}

	private handleMessage(message: FigmaResponse): void {
		console.log('📨 Received message:', message.type);

		// Handle temporary handlers first
		const handlers = this.temporaryHandlers.get(message.type);
		if (handlers) {
			handlers.forEach(handler => handler(message));
		}

		// Handle pending commands
		if (message.type === 'command_result' || message.type === 'command_error') {
			this.handleCommandResponse(message);
		}
	}

	private handleCommandResponse(message: FigmaResponse): void {
		const commandId = message.commandId || message.id;
		if (!commandId) {
			console.warn('⚠️ Received command response without ID');
			return;
		}

		const pending = this.pendingCommands.get(commandId);
		if (!pending) {
			console.warn(`⚠️ No pending command found for ID: ${commandId}`);
			return;
		}

		this.pendingCommands.delete(commandId);

		if (message.type === 'command_result') {
			console.log(`✅ Command ${commandId} completed successfully`);
			pending.resolve(message.result);
		} else {
			console.error(`❌ Command ${commandId} failed:`, message.error);
			pending.reject(new Error(message.error || 'Command execution failed'));
		}
	}

	/**
	 * Send a command to Figma through the WebSocket server
	 */
	public async sendCommand(command: string, params: any = {}): Promise<any> {
		await this.ensureConnected();

		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			throw new WebSocketConnectionError('WebSocket not connected', this.getConnectionState());
		}

		const commandId = uuidv4();
		const message: FigmaMessage = {
			id: commandId,
			command,
			params,
			timestamp: new Date().toISOString(),
			channelId: this.config.channelId,
		};

		console.log(`📤 Sending command: ${command} (ID: ${commandId})`);

		return new Promise((resolve, reject) => {
			// Store pending command with timeout
			const commandTimeout = setTimeout(() => {
				this.pendingCommands.delete(commandId);
				reject(new WebSocketTimeoutError(`Command timeout: ${command}`));
			}, this.config.timeout!);

			this.pendingCommands.set(commandId, {
				resolve: (result: any) => {
					clearTimeout(commandTimeout);
					resolve(result);
				},
				reject: (error: Error) => {
					clearTimeout(commandTimeout);
					reject(error);
				},
				timestamp: Date.now(),
			});

			// Send command to server
			const sendMessage = {
				type: 'command',
				...message,
			};

			this.ws!.send(JSON.stringify(sendMessage));
		});
	}

	/**
	 * Get list of available channels
	 */
	public async getChannels(): Promise<ChannelInfo[]> {
		// For channel listing, we need a special connection without channel ID
		const channelClient = new WebSocketClient({
			host: this.config.host,
			port: this.config.port,
			channelId: '', // No channel ID for listing
			timeout: this.config.timeout,
		});

		try {
			await channelClient.connect('get_channels');
			return await channelClient.requestChannels();
		} finally {
			channelClient.disconnect();
		}
	}

	private async requestChannels(): Promise<ChannelInfo[]> {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			throw new WebSocketConnectionError('WebSocket not connected', this.getConnectionState());
		}

		console.log('📋 Requesting channel list');

		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				reject(new WebSocketTimeoutError('Channel list request timeout'));
			}, this.config.timeout!);

			const handleChannelList = (message: any) => {
				if (message.type === 'channels_list') {
					clearTimeout(timeout);
					console.log('📋 Received channel list:', message.channels?.length || 0, 'channels');
					resolve(message.channels || []);
				}
			};

			this.addTemporaryMessageHandler('channels_list', handleChannelList);

			// Send request
			this.ws!.send(JSON.stringify({
				type: 'get_channels',
			}));
		});
	}

	/**
	 * Check if Figma plugin is connected to the server
	 */
	public async checkFigmaConnection(): Promise<boolean> {
		await this.ensureConnected();

		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			return false;
		}

		return new Promise((resolve) => {
			const checkId = uuidv4();
			const timeout = setTimeout(() => {
				console.log('⏰ Figma connection check timeout');
				resolve(false);
			}, 5000);

			const handleResponse = (message: any) => {
				if (message.type === 'figma_connection_status' && message.id === checkId) {
					clearTimeout(timeout);
					resolve(message.connected || false);
				}
			};

			this.addTemporaryMessageHandler('figma_connection_status', handleResponse);

			this.ws!.send(JSON.stringify({
				type: 'check_figma_connection',
				id: checkId,
			}));
		});
	}

	/**
	 * Wait for connection to be established
	 */
	public async waitForConnection(timeoutMs: number = 30000): Promise<void> {
		if (this.isConnected()) {
			return Promise.resolve();
		}

		if (!this.connectionPromise) {
			throw new WebSocketConnectionError('Connection not initiated. Call connect() first.');
		}

		return Promise.race([
			this.connectionPromise,
			new Promise<never>((_, reject) => {
				setTimeout(() => {
					reject(new WebSocketTimeoutError(`Connection timeout after ${timeoutMs}ms`));
				}, timeoutMs);
			}),
		]);
	}

	private async ensureConnected(): Promise<void> {
		if (this.isConnected()) {
			return;
		}

		if (this.connectionPromise) {
			await this.connectionPromise;
			return;
		}

		// Try to reconnect if not connected
		await this.reconnect();
	}

	private async reconnect(): Promise<void> {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			throw new WebSocketConnectionError(
				`Failed to reconnect after ${this.maxReconnectAttempts} attempts`
			);
		}

		console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
		
		this.reconnectAttempts++;
		
		// Exponential backoff
		const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
		await this.sleep(delay);

		try {
			await this.connect();
		} catch (error) {
			if (this.reconnectAttempts >= this.maxReconnectAttempts) {
				throw error;
			}
			// Try again
			return this.reconnect();
		}
	}

	private sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 * Check if WebSocket is currently connected
	 */
	public isConnected(): boolean {
		return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
	}

	/**
	 * Get current connection state
	 */
	public getConnectionState(): WebSocketConnectionState {
		if (!this.ws) {
			return WebSocketConnectionState.Closed;
		}
		return this.ws.readyState as WebSocketConnectionState;
	}

	/**
	 * Get connection info
	 */
	public getConnectionInfo() {
		return {
			host: this.config.host,
			port: this.config.port,
			channelId: this.config.channelId,
			connected: this.isConnected(),
			state: this.getConnectionState(),
			pendingCommands: this.pendingCommands.size,
		};
	}

	/**
	 * Clean up pending commands and clear timeouts
	 */
	private cleanup(): void {
		// Reject all pending commands
		for (const [commandId, pending] of this.pendingCommands) {
			pending.reject(new WebSocketConnectionError('Connection closed'));
		}
		this.pendingCommands.clear();
		this.temporaryHandlers.clear();
	}

	/**
	 * Disconnect and clean up resources
	 */
	public disconnect(): void {
		console.log('🔌 Disconnecting WebSocket client');
		
		this.cleanup();
		
		if (this.ws) {
			if (this.ws.readyState === WebSocket.OPEN) {
				this.ws.close();
			}
			this.ws = null;
		}
		
		this.connectionPromise = null;
		this.reconnectAttempts = 0;
	}

	/**
	 * Force terminate connection (for cleanup)
	 */
	public terminate(): void {
		console.log('⚡ Terminating WebSocket connection');
		
		this.cleanup();
		
		if (this.ws) {
			this.ws.terminate();
			this.ws = null;
		}
		
		this.connectionPromise = null;
		this.reconnectAttempts = 0;
	}
}

/**
 * Factory function to create a WebSocket client
 */
export function createWebSocketClient(config: WebSocketClientConfig): WebSocketClient {
	return new WebSocketClient(config);
}

/**
 * Utility function to create a client and send a single command
 */
export async function sendFigmaCommand(
	config: WebSocketClientConfig,
	command: string,
	params: any = {}
): Promise<any> {
	const client = createWebSocketClient(config);
	
	try {
		await client.connect();
		return await client.sendCommand(command, params);
	} finally {
		client.disconnect();
	}
}

/**
 * Utility function to get channels list
 */
export async function getFigmaChannels(host: string, port: number): Promise<ChannelInfo[]> {
	const client = createWebSocketClient({
		host,
		port,
		channelId: '', // No channel needed for listing
	});
	
	try {
		return await client.getChannels();
	} finally {
		client.disconnect();
	}
}