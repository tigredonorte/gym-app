import { io, Socket } from 'socket.io-client';

export class WebSocketClient {
  private socket: Socket;
  private channelListeners = new Map<string, ((args: unknown) => void)[]>();
  private subscribedChannels = new Set<string>();

  constructor(serverUrl: string) {

    const url = new URL(serverUrl);
    const path = url.pathname === '/' ? '/ws' : url.pathname;
    const urlParsed = `${url.protocol}//${url.host}`;

    this.socket = io(urlParsed, {
      path: path,
      transports: ['websocket'],
      autoConnect: false
    });

    this.socket.on('connect', () => {
      console.info(`Connected to WebSocket server: ${this.socket.id}`);
    });

    this.socket.on('disconnect', () => {
      console.info(`Disconnected from WebSocket server: ${this.socket.id}`);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('reconnect_attempt', () => {
      console.log('Reconnecting...');
    });

    this.socket.onAny((event, args, ack) => {
      ack('Received event');
      this.channelListeners.get(event)?.forEach((listener) => {
        try {
          listener(args?.payload || args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    });
  }

  public connectionStatusChange(callback: (status: boolean) => void): void {
    this.socket.on('connect', () => callback(true));
    this.socket.on('disconnect', () => callback(false));
  }

  public connect(): void {
    this.socket.connect();
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public on<MessageType>(topic: string, listener: (message: MessageType) => void): void {
    if (!this.channelListeners.has(topic)) {
      this.channelListeners.set(topic, []);
    }

    if (this.channelListeners.get(topic)?.includes(listener as (message: unknown) => void)) {
      console.warn(`Listener already registered for topic ${topic}`);
      return;
    }

    this.channelListeners.get(topic)?.push(listener as (message: unknown) => void);
  }

  public channelSubscribe(channel: string): void {
    if (this.subscribedChannels.has(channel)) {
      console.warn(`Already subscribed to channel ${channel}`);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in local storage');
    }
    this.socket.emit('subscribe', { channel, token }, (response: { success: boolean; error?: string }) => {
      if (!response.success) {
        console.error(`Failed to subscribe to channel ${channel}: ${response.error}`);
        return;
      }

      this.subscribedChannels.add(channel);
    });
  }

  public channelClear(): void {
    this.subscribedChannels.forEach((channel) => this.channelUnsubscribe(channel));
  }

  public channelUnsubscribe(channel: string): void {
    this.socket.emit('unsubscribe', { channel }, (response: { success: boolean; error?: string }) => {
      if (!response.success) {
        console.error(`Failed to unsubscribe from channel ${channel}: ${response.error}`);
        return;
      }

      this.socket.off(channel);
    });
  }

  public channelEmit<MessageType>(channelAndTopic: string, message: MessageType): void {
    const data = channelAndTopic.split('.');
    if (data.length < 2) {
      throw new Error(`Invalid channel and topic: ${channelAndTopic}`);
    }

    const topic = data.pop();
    const channel = data.join('.');

    this.socket.emit('broadcast', { channel, topic, message }, (response: { success: boolean; error?: string }) => {
      if (!response.success) {
        console.error(`Failed to broadcast message to channel ${channel} on topic ${topic}: ${response.error}`);
      }
    });
  }
}
