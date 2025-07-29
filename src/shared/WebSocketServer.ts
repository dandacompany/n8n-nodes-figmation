import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export interface FigmaCommand {
  id: string;
  command: string;
  params?: any;
  timestamp: string;
}

export interface FigmaResponse {
  id: string;
  type: 'success' | 'error';
  result?: any;
  error?: string;
  timestamp: string;
}

export interface WebSocketServerConfig {
  port: number;
  host?: string;
}

export interface Channel {
  id: string;
  name: string;
  figmaClients: WebSocket[];
  n8nClients: WebSocket[];
  createdAt: string;
  lastActivity: string;
}

export class FigmaWebSocketServer extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private wsClient: WebSocket | null = null;
  private clients: Map<WebSocket, { id: string; type: 'figma' | 'n8n'; channelId?: string }> = new Map();
  private channels: Map<string, Channel> = new Map();
  private pendingCommands: Map<string, { resolve: Function; reject: Function; senderWs?: WebSocket }> = new Map();
  private serverUrl: string;
  private isServer: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  constructor(config: WebSocketServerConfig, mode: 'server' | 'client' = 'server', clientPurpose?: string, channelId?: string) {
    super();
    
    this.serverUrl = `ws://${config.host || 'localhost'}:${config.port}`;
    this.isServer = mode === 'server';
    
    if (this.isServer) {
      // Server mode: Create WebSocket server
      this.wss = new WebSocketServer({
        port: config.port,
        host: config.host || 'localhost'
      });
      
      this.setupServerEventHandlers();
      console.log(`🚀 Figma WebSocket Server started on ${this.serverUrl}`);
      console.log(`📡 Server is ready to accept connections from Figma plugins and n8n nodes`);
    } else {
      // Client mode: Connect to existing server
      this.connectAsClient(clientPurpose, channelId);
    }
  }

  private setupServerEventHandlers(): void {
    if (!this.wss) return;
    
    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log(`Client ${clientId} connected`);
      
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      ws.on('close', () => {
        const clientInfo = this.clients.get(ws);
        if (clientInfo) {
          console.log(`Client ${clientInfo.id} (${clientInfo.type}) disconnected from channel: ${clientInfo.channelId || 'none'}`);
          
          // Emit client disconnect event
          this.emit('clientDisconnected', {
            id: clientInfo.id,
            type: clientInfo.type,
            channelId: clientInfo.channelId,
            timestamp: new Date().toISOString()
          });
          
          // Remove client from channel
          if (clientInfo.channelId) {
            this.removeClientFromChannel(ws, clientInfo.channelId, clientInfo.type);
          }
          
          this.clients.delete(ws);
        } else {
          console.log(`Unregistered client disconnected`);
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  private connectAsClient(clientPurpose?: string, channelId?: string): void {
    console.log(`Connecting to WebSocket server at ${this.serverUrl}`);
    
    // Create connection Promise
    this.connectionPromise = new Promise((resolve, reject) => {
      this.wsClient = new WebSocket(this.serverUrl);
      
      this.wsClient.on('open', () => {
        console.log('Connected to WebSocket server as client');
        
        // Register as n8n client (use different client types based on purpose)
        const clientType = clientPurpose === 'get_channels' ? 'n8n_get_channels' : 'n8n';
        
        const registerMessage: any = {
          type: 'register',
          clientType: clientType,
          clientId: 'n8n_' + (clientPurpose || 'action') + '_' + Date.now(),
          message: `n8n ${clientPurpose || 'Action'} node connected`
        };
        
        // Add channel ID if not get_channels
        if (clientPurpose !== 'get_channels' && channelId) {
          registerMessage.channelId = channelId;
        }
        
        this.wsClient!.send(JSON.stringify(registerMessage));
        
        // Resolve on successful registration
        this.once('registration_success', () => {
          resolve();
        });
        
        // Reject on registration failure
        this.once('registration_error', (error) => {
          reject(new Error(error.error || 'Registration failed'));
        });
      });
      
      this.wsClient.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(message);
        } catch (error) {
          console.error('Error parsing client message:', error);
        }
      });
      
      this.wsClient.on('close', () => {
        console.log('Disconnected from WebSocket server');
        this.connectionPromise = null;
      });
      
      this.wsClient.on('error', (error) => {
        console.error('WebSocket client error:', error);
        reject(error);
      });
    });
  }

  private handleClientMessage(message: any): void {
    // Handle messages received from server in client mode
    console.log('Client received message:', message.type);
    
    if (message.type === 'command_result') {
      this.handleCommandResult(message);
    } else if (message.type === 'command_error') {
      this.handleCommandError(message);
    } else if (message.type === 'registration_success') {
      // Handle registration success response
      console.log('Registration successful:', message);
      this.emit('registration_success', message);
    } else if (message.type === 'registration_error') {
      // Handle registration error response
      console.error('Registration failed:', message.error);
      this.emit('registration_error', message);
    } else if (message.type === 'figma_connection_status') {
      // Figma connection status check response
      this.emit('figma_connection_status', message);
    } else if (message.type === 'channels_list') {
      // Channel list response
      this.emit('channels_list', message);
    } else {
      console.log('Unknown client message type:', message.type);
    }
  }

  private handleMessage(ws: WebSocket, message: any): void {
    switch (message.type) {
      case 'ping':
        // ping/pong handling
        ws.send(JSON.stringify({ type: 'pong' }));
        break;

      case 'register':
        const clientInfo = { 
          id: message.clientId || uuidv4(), 
          type: message.clientType,
          channelId: message.channelId
        };
        this.clients.set(ws, clientInfo);
        
        console.log(`Client ${clientInfo.id} (${clientInfo.type}) registering to channel: ${clientInfo.channelId}`);
        
        // Check if channel exists when channel ID is provided
        if (message.channelId) {
          const channel = this.getChannel(message.channelId);
          if (!channel) {
            console.log(`Client ${clientInfo.id} registration failed: Channel ${message.channelId} does not exist`);
            ws.send(JSON.stringify({
              type: 'registration_error',
              error: `Channel "${message.channelId}" does not exist. Please create the channel first using the trigger node.`
            }));
            return;
          }
          
          // Only one Figma client per channel allowed
          if (message.clientType === 'figma' && channel.figmaClients.length > 0) {
            console.log(`Client ${clientInfo.id} registration failed: Channel ${message.channelId} already has a Figma client`);
            ws.send(JSON.stringify({
              type: 'registration_error',
              error: `Channel "${message.channelId}" already has a Figma plugin connected. Only one Figma plugin per channel is allowed.`
            }));
            return;
          }
          
          // Add client to channel
          this.addClientToChannel(ws, message.channelId, message.clientType);
          
          console.log(`Client ${clientInfo.id} (${clientInfo.type}) successfully registered to channel: ${clientInfo.channelId}`);
          
          // Emit client connection event
          this.emit('clientConnected', {
            id: clientInfo.id,
            type: clientInfo.type,
            channelId: clientInfo.channelId,
            timestamp: new Date().toISOString()
          });
          
          ws.send(JSON.stringify({
            type: 'registration_success',
            clientId: clientInfo.id,
            channelId: clientInfo.channelId,
            serverUrl: this.serverUrl
          }));
        } else {
          // When no channel ID is provided
          if (message.clientType === 'n8n_get_channels') {
            // Only n8n_get_channels client can register without channel ID (for channel listing)
            console.log(`Client ${clientInfo.id} (${clientInfo.type}) registered without channel for channel listing`);
            ws.send(JSON.stringify({
              type: 'registration_success',
              clientId: clientInfo.id,
              serverUrl: this.serverUrl
            }));
          } else {
            // All other clients require channel ID
            console.log(`Client ${clientInfo.id} registration failed: Channel ID is required for ${message.clientType} clients`);
            ws.send(JSON.stringify({
              type: 'registration_error',
              error: `Channel ID is required for ${message.clientType} clients`
            }));
            return;
          }
        }
        break;

      case 'send_command':
        // Forward commands received from n8n clients to Figma clients in specific channel
        console.log('Received send_command from client:', message);
        const senderClientInfo = this.clients.get(ws);
        if (senderClientInfo) {
          // Store sender client info (for routing responses later)
          this.pendingCommands.set(message.id, { 
            resolve: () => {}, 
            reject: () => {},
            senderWs: ws  // Store n8n client WebSocket
          });
        }
        try {
          this.forwardCommandToFigma(message);
          // Don't send success response immediately - wait for actual response from Figma
        } catch (error) {
          // Send error response to client
          ws.send(JSON.stringify({
            type: 'command_error',
            commandId: message.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          }));
          // Remove pending command on error
          this.pendingCommands.delete(message.id);
        }
        break;

      case 'check_figma_connection':
        // Handle Figma connection status check request
        this.handleFigmaConnectionCheck(ws, message);
        break;

      case 'create_channel':
        // Handle channel creation request
        this.handleCreateChannel(ws, message).catch(error => {
          console.error('Error handling create_channel:', error);
        });
        break;

      case 'get_channels':
        // Handle channel list request
        this.handleGetChannels(ws).catch(error => {
          console.error('Error handling get_channels:', error);
        });
        break;

      case 'command_result':
        this.handleCommandResult(message);
        break;

      case 'command_error':
        this.handleCommandError(message);
        break;

      case 'figma_event':
        this.emit('figma_event', message);
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private forwardCommandToFigma(commandMessage: any): void {
    const channelId = commandMessage.channelId;
    console.log('=== Command Forwarding Debug ===');
    console.log('Command:', commandMessage.command);
    console.log('Channel ID:', channelId);
    console.log('Available channels:', Array.from(this.channels.keys()));
    console.log('All clients:', Array.from(this.clients.values()).map(c => ({ id: c.id, type: c.type, channelId: c.channelId })));
    
    if (!channelId) {
      console.log('❌ No channel ID provided in command');
      this.sendErrorToN8nClients(commandMessage.id, 'No channel ID provided');
      return;
    }

    const channel = this.getChannel(channelId);
    if (!channel) {
      console.log(`❌ Channel ${channelId} not found`);
      console.log('Available channels:', Array.from(this.channels.keys()));
      this.sendErrorToN8nClients(commandMessage.id, `Channel ${channelId} not found. Available channels: ${Array.from(this.channels.keys()).join(', ')}`);
      return;
    }

    console.log(`Channel ${channelId} found:`, {
      figmaClients: channel.figmaClients.length,
      n8nClients: channel.n8nClients.length,
      createdAt: channel.createdAt
    });

    if (channel.figmaClients.length === 0) {
      console.log(`❌ No Figma clients in channel ${channelId}`);
      console.log('All connected Figma clients:', Array.from(this.clients.values()).filter(c => c.type === 'figma'));
      this.sendErrorToN8nClients(commandMessage.id, `No Figma plugin connected to channel ${channelId}. Please ensure the Figma plugin is connected to this specific channel.`);
      return;
    }

    // Send command to Figma clients in the specified channel
    channel.figmaClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'command',
          id: commandMessage.id,
          command: commandMessage.command,
          params: commandMessage.params,
          timestamp: commandMessage.timestamp,
          channelId: channelId
        }));
      }
    });

    // Emit command sent event
    this.emit('figma_event', {
      type: 'command',
      id: commandMessage.id,
      command: commandMessage.command,
      params: commandMessage.params,
      channelId: channelId,
      timestamp: commandMessage.timestamp
    });

    channel.lastActivity = new Date().toISOString();
  }

  private sendErrorToN8nClients(commandId: string, error: string): void {
    const n8nClients = Array.from(this.clients.entries())
      .filter(([_, clientInfo]) => clientInfo.type === 'n8n')
      .map(([ws]) => ws);
    
    n8nClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'command_error',
          commandId: commandId,
          error: error
        }));
      }
    });
  }

  private async handleCreateChannel(ws: WebSocket, message: any): Promise<void> {
    const { channelId, channelName } = message;
    
    if (!channelId) {
      ws.send(JSON.stringify({
        type: 'channel_creation_error',
        error: 'Channel ID is required'
      }));
      return;
    }

    try {
      await this.createChannel(channelId, channelName);
      ws.send(JSON.stringify({
        type: 'channel_created',
        channelId: channelId,
        channelName: channelName || channelId
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'channel_creation_error',
        channelId: channelId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }

  private async handleGetChannels(ws: WebSocket): Promise<void> {
    // Return channel list directly in server mode
    const channels = Array.from(this.channels.values());
    const channelList = channels.map(channel => ({
      id: channel.id,
      name: channel.name,
      figmaClients: channel.figmaClients.length,
      n8nClients: channel.n8nClients.length,
      createdAt: channel.createdAt,
      lastActivity: channel.lastActivity
    }));

    console.log('Sending channel list to client:', channelList);
    ws.send(JSON.stringify({
      type: 'channels_list',
      channels: channelList
    }));
  }

  private handleFigmaConnectionCheck(ws: WebSocket, message: any): void {
    const figmaClients = Array.from(this.clients.values()).filter(client => client.type === 'figma');
    const connected = figmaClients.length > 0;
    
    console.log('Figma connection check:', { connected, figmaClients: figmaClients.length });
    
    ws.send(JSON.stringify({
      type: 'figma_connection_status',
      id: message.id,
      connected,
      figmaClients: figmaClients.length
    }));
  }

  private handleCommandResult(message: any): void {
    console.log('📨 Command result received:', message);
    const commandId = message.id || message.commandId;
    
    // Emit command result event
    this.emit('figma_event', {
      type: 'command_result',
      id: commandId,
      result: message.result,
      timestamp: message.timestamp || new Date().toISOString()
    });
    
    const pending = this.pendingCommands.get(commandId);
    if (pending) {
      console.log('✅ Resolving command:', commandId);
      
      // Forward Figma's actual response to n8n clients
      if (pending.senderWs && pending.senderWs.readyState === WebSocket.OPEN) {
        pending.senderWs.send(JSON.stringify({
          type: 'command_result',
          commandId: commandId,
          result: message.result,  // Actual object information returned from Figma
          timestamp: message.timestamp || new Date().toISOString()
        }));
      }
      
      pending.resolve(message.result);
      this.pendingCommands.delete(commandId);
    } else {
      console.log('❌ No pending command found for ID:', commandId);
      console.log('Available pending commands:', Array.from(this.pendingCommands.keys()));
    }
  }

  private handleCommandError(message: any): void {
    console.log('📨 Command error received:', message);
    const commandId = message.id || message.commandId;
    const pending = this.pendingCommands.get(commandId);
    if (pending) {
      console.log('❌ Rejecting command:', commandId);
      
      // Forward error response to n8n clients
      if (pending.senderWs && pending.senderWs.readyState === WebSocket.OPEN) {
        pending.senderWs.send(JSON.stringify({
          type: 'command_error',
          commandId: commandId,
          error: message.error,
          timestamp: message.timestamp || new Date().toISOString()
        }));
      }
      
      pending.reject(new Error(message.error));
      this.pendingCommands.delete(commandId);
    } else {
      console.log('❌ No pending command found for ID:', commandId);
      console.log('Available pending commands:', Array.from(this.pendingCommands.keys()));
    }
  }

  public async sendCommandToFigma(command: string, params: any = {}, channelId?: string): Promise<any> {
    console.log('sendCommandToFigma called with:', { command, params });
    
    if (this.isServer) {
      // 서버 모드: 직접 클라이언트들에게 명령 전송
      console.log('Current clients:', Array.from(this.clients.values()));
      
      const figmaClients = Array.from(this.clients.entries())
        .filter(([_, clientInfo]) => clientInfo.type === 'figma')
        .map(([ws]) => ws);

      console.log('Figma clients found:', figmaClients.length);

      if (figmaClients.length === 0) {
        console.log('No Figma clients connected. Available clients:', Array.from(this.clients.values()));
        throw new Error('No Figma plugin connected');
      }

      const commandId = uuidv4();
      const commandData: FigmaCommand = {
        id: commandId,
        command,
        params,
        timestamp: new Date().toISOString()
      };

      return new Promise((resolve, reject) => {
        this.pendingCommands.set(commandId, { resolve, reject });

        // 모든 Figma 클라이언트에 명령 전송
        figmaClients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'command',
              ...commandData
            }));
          }
        });

        // 10초 타임아웃
        setTimeout(() => {
          if (this.pendingCommands.has(commandId)) {
            this.pendingCommands.delete(commandId);
            reject(new Error('Command timeout'));
          }
        }, 10000);
      });
    } else {
      // 클라이언트 모드: 서버에 명령 전송 요청
      console.log('=== Client Mode: sendCommandToFigma ===');
      console.log('WebSocket client state:', this.wsClient?.readyState);
      console.log('Command:', command);
      console.log('Params:', params);
      console.log('Channel ID:', channelId);
      
      if (!this.wsClient || this.wsClient.readyState !== WebSocket.OPEN) {
        console.error('WebSocket client not ready. State:', this.wsClient?.readyState);
        throw new Error('Not connected to WebSocket server');
      }

      const commandId = uuidv4();
      const commandData: FigmaCommand = {
        id: commandId,
        command,
        params,
        timestamp: new Date().toISOString()
      };

      const sendMessage = {
        type: 'send_command',
        ...commandData,
        channelId: channelId
      };

      console.log('Sending message to server:', sendMessage);

      return new Promise((resolve, reject) => {
        this.pendingCommands.set(commandId, { resolve, reject });

        // 서버에 명령 전송 요청 (채널 ID 포함)
        this.wsClient!.send(JSON.stringify(sendMessage));
        console.log('Message sent to server successfully');

        // 10초 타임아웃
        setTimeout(() => {
          if (this.pendingCommands.has(commandId)) {
            console.error('Command timeout - no response from server');
            this.pendingCommands.delete(commandId);
            reject(new Error('Command timeout - no response from server'));
          }
        }, 10000);
      });
    }
  }

  public getServerUrl(): string {
    return this.serverUrl;
  }

  // 채널별 명령 전송 메서드 (새로 추가)
  public async sendCommandToChannel(channelId: string, command: string, params: any = {}): Promise<any> {
    console.log('sendCommandToChannel called with:', { channelId, command, params });
    
    if (this.isServer) {
      // 서버 모드: 지정된 채널의 Figma 클라이언트들에게 명령 전송
      const channel = this.getChannel(channelId);
      if (!channel) {
        throw new Error(`Channel not found: ${channelId}`);
      }

      const figmaClients = channel.figmaClients.filter(client => client.readyState === WebSocket.OPEN);
      console.log(`Figma clients in channel ${channelId}:`, figmaClients.length);

      if (figmaClients.length === 0) {
        throw new Error(`No Figma clients connected to channel: ${channelId}`);
      }

      const commandId = uuidv4();
      const commandData: FigmaCommand = {
        id: commandId,
        command,
        params,
        timestamp: new Date().toISOString()
      };

      return new Promise((resolve, reject) => {
        this.pendingCommands.set(commandId, { resolve, reject });

        // 지정된 채널의 모든 Figma 클라이언트에 명령 전송
        figmaClients.forEach(client => {
          client.send(JSON.stringify({
            type: 'command',
            ...commandData
          }));
        });

        // 10초 타임아웃
        setTimeout(() => {
          if (this.pendingCommands.has(commandId)) {
            this.pendingCommands.delete(commandId);
            reject(new Error('Command timeout'));
          }
        }, 10000);
      });
    } else {
      // 클라이언트 모드: 서버에 채널별 명령 전송 요청
      console.log('=== Client Mode: sendCommandToChannel ===');
      console.log('WebSocket client state:', this.wsClient?.readyState);
      console.log('Channel ID:', channelId);
      console.log('Command:', command);
      console.log('Params:', params);
      
      if (!this.wsClient || this.wsClient.readyState !== WebSocket.OPEN) {
        console.error('WebSocket client not ready. State:', this.wsClient?.readyState);
        throw new Error('Not connected to WebSocket server');
      }

      const commandId = uuidv4();
      const commandData: FigmaCommand = {
        id: commandId,
        command,
        params,
        timestamp: new Date().toISOString()
      };

      const sendMessage = {
        type: 'send_command_to_channel',
        ...commandData,
        channelId: channelId
      };

      console.log('Sending message to server:', sendMessage);

      return new Promise((resolve, reject) => {
        this.pendingCommands.set(commandId, { resolve, reject });

        // 서버에 채널별 명령 전송 요청
        this.wsClient!.send(JSON.stringify(sendMessage));
        console.log('Message sent to server successfully');

        // 10초 타임아웃
        setTimeout(() => {
          if (this.pendingCommands.has(commandId)) {
            console.error('Command timeout - no response from server');
            this.pendingCommands.delete(commandId);
            reject(new Error('Command timeout - no response from server'));
          }
        }, 10000);
      });
    }
  }

  public getConnectedClients(): Array<{ id: string; type: string }> {
    return Array.from(this.clients.values());
  }

  public async isFigmaConnected(): Promise<boolean> {
    if (this.isServer) {
      // 서버 모드: 직접 클라이언트 목록 확인
      return Array.from(this.clients.values()).some(client => client.type === 'figma');
    } else {
      // 클라이언트 모드: 서버에 Figma 연결 상태 확인 요청
      if (!this.wsClient || this.wsClient.readyState !== WebSocket.OPEN) {
        return false;
      }

      return new Promise((resolve) => {
        const checkId = uuidv4();
        
        // 5초 타임아웃
        const timeout = setTimeout(() => {
          console.log('Figma connection check timeout');
          resolve(false);
        }, 5000);

        // 서버에 Figma 연결 상태 확인 요청
        this.wsClient!.send(JSON.stringify({
          type: 'check_figma_connection',
          id: checkId
        }));

        // 응답 처리
        const handleResponse = (message: any) => {
          if (message.type === 'figma_connection_status' && message.id === checkId) {
            clearTimeout(timeout);
            resolve(message.connected);
          }
        };

        // 임시 이벤트 리스너 추가
        this.once('figma_connection_status', handleResponse);
      });
    }
  }


  private getChannel(channelId: string): Channel | undefined {
    return this.channels.get(channelId);
  }

  private addClientToChannel(ws: WebSocket, channelId: string, clientType: 'figma' | 'n8n'): void {
    const channel = this.getChannel(channelId);
    if (!channel) {
      console.log(`Channel ${channelId} not found`);
      return;
    }

    if (clientType === 'figma' && !channel.figmaClients.includes(ws)) {
      channel.figmaClients.push(ws);
    } else if (clientType === 'n8n' && !channel.n8nClients.includes(ws)) {
      channel.n8nClients.push(ws);
    }

    channel.lastActivity = new Date().toISOString();
    console.log(`Added ${clientType} client to channel ${channelId}`);
  }

  private removeClientFromChannel(ws: WebSocket, channelId: string, clientType: 'figma' | 'n8n'): void {
    const channel = this.getChannel(channelId);
    if (!channel) return;

    if (clientType === 'figma') {
      channel.figmaClients = channel.figmaClients.filter(client => client !== ws);
    } else if (clientType === 'n8n') {
      channel.n8nClients = channel.n8nClients.filter(client => client !== ws);
    }

    channel.lastActivity = new Date().toISOString();
    console.log(`Removed ${clientType} client from channel ${channelId}`);
  }

  public async getChannels(): Promise<Channel[]> {
    if (this.isServer) {
      // 서버 모드: 직접 채널 목록 반환
      return Array.from(this.channels.values());
    } else {
      // 클라이언트 모드: 서버에 채널 목록 요청
      if (!this.wsClient) {
        throw new Error('WebSocket client not initialized');
      }
      
      // 연결 상태 확인 및 대기
      if (this.wsClient.readyState === WebSocket.CONNECTING) {
        console.log('WebSocket is still connecting, waiting...');
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Connection timeout'));
          }, 5000);
          
          this.wsClient!.onopen = () => {
            clearTimeout(timeout);
            resolve();
          };
          
          this.wsClient!.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Connection failed'));
          };
        });
      }
      
      if (this.wsClient.readyState !== WebSocket.OPEN) {
        console.log('WebSocket state:', this.wsClient.readyState);
        throw new Error('Not connected to WebSocket server');
      }

      console.log('Requesting channel list from server...');
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Channel list request timeout'));
        }, 5000);

        // 서버에 채널 목록 요청
        this.wsClient!.send(JSON.stringify({
          type: 'get_channels'
        }));

        // 응답 처리
        const handleResponse = (message: any) => {
          if (message.type === 'channels_list') {
            clearTimeout(timeout);
            console.log('Received channel list:', message.channels);
            resolve(message.channels);
          }
        };

        // 임시 이벤트 리스너 추가
        this.once('channels_list', handleResponse);
      });
    }
  }

  public async createChannel(channelId: string, channelName?: string): Promise<void> {
    if (this.isServer) {
      // 서버 모드: 직접 채널 생성
      if (this.channels.has(channelId)) {
        throw new Error(`Channel ${channelId} already exists`);
      }
      
      const channel: Channel = {
        id: channelId,
        name: channelName || channelId,
        figmaClients: [],
        n8nClients: [],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
      
      this.channels.set(channelId, channel);
      console.log(`Channel "${channelId}" created successfully with name: "${channel.name}"`);
      
      // 채널 생성 브로드캐스트 전송
      this.broadcastChannelCreated(channelId, channelName || channelId);
    } else {
      // 클라이언트 모드: 서버에 채널 생성 요청
      if (!this.wsClient || this.wsClient.readyState !== WebSocket.OPEN) {
        throw new Error('Not connected to WebSocket server');
      }

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Channel creation timeout'));
        }, 5000);

        // 서버에 채널 생성 요청
        this.wsClient!.send(JSON.stringify({
          type: 'create_channel',
          channelId,
          channelName
        }));

        // 응답 처리
        const handleResponse = (message: any) => {
          if (message.type === 'channel_created' && message.channelId === channelId) {
            clearTimeout(timeout);
            resolve();
          } else if (message.type === 'channel_creation_error' && message.channelId === channelId) {
            clearTimeout(timeout);
            reject(new Error(message.error));
          }
        };

        // 임시 이벤트 리스너 추가
        this.once('channel_created', handleResponse);
        this.once('channel_creation_error', handleResponse);
      });
    }
  }

  public send(message: string): void {
    if (this.wsClient && this.wsClient.readyState === WebSocket.OPEN) {
      this.wsClient.send(message);
    }
  }

  private broadcastChannelCreated(channelId: string, channelName: string): void {
    if (this.wss) {
      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'channel_created_broadcast',
            channelId: channelId,
            channelName: channelName,
            timestamp: new Date().toISOString()
          }));
        }
      });
      console.log(`Broadcasted channel creation: ${channelId} (${channelName})`);
    }
  }

  // MCP Tool에서 사용할 연결 대기 메서드
  public async waitForConnection(timeoutMs: number = 30000): Promise<void> {
    if (this.isServer) {
      // 서버 모드에서는 즉시 완료
      return Promise.resolve();
    }

    if (!this.connectionPromise) {
      throw new Error('Connection not initiated. Call connectAsClient first.');
    }

    // 타임아웃과 함께 연결 대기
    return Promise.race([
      this.connectionPromise,
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Connection timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  }

  public close(): void {
    if (this.wss) {
      this.wss.close();
      console.log('Figma WebSocket Server closed');
    }
    if (this.wsClient) {
      this.wsClient.close();
      console.log('Figma WebSocket Client closed');
    }
    this.connectionPromise = null;
  }
} 