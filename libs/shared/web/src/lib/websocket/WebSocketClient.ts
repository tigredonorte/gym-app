import { io, Socket } from 'socket.io-client';

export class WebSocketClient {
  private socket: Socket;
  private subscribedChannels: Set<string> = new Set();

  constructor(serverUrl: string) {
    this.socket = io(serverUrl, {
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
  }

  public connect(): void {
    this.socket.connect();
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  subscribe<MessageType>(channel: string, callback: (message: MessageType) => void): void {
    if (this.subscribedChannels.has(channel)) {
      console.warn(`Already subscribed to channel ${channel}`);
      return;
    }

    console.info(`Subscribing to channel ${channel}`);
    this.socket.emit('subscribe', { channel }, (response: { success: boolean; error?: string }) => {
      if (response.success) {
        this.subscribedChannels.add(channel);
        console.log(`Subscribed to channel ${channel}`);
        this.socket.on(channel, callback);
      } else {
        console.error(`Failed to subscribe to channel ${channel}: ${response.error}`);
      }
    });
  }

  unsubscribe(channel: string): void {
    if (!this.subscribedChannels.has(channel)) {
      console.warn(`Not subscribed to channel ${channel}`);
      return;
    }

    console.log(`Unsubscribing from channel ${channel}`);
    this.socket.emit('unsubscribe', { channel }, (response: { success: boolean; error?: string }) => {
      if (response.success) {
        this.subscribedChannels.delete(channel);
        console.log(`Unsubscribed from channel ${channel}`);
        this.socket.off(channel);
      } else {
        console.error(`Failed to unsubscribe from channel ${channel}: ${response.error}`);
      }
    });
  }

  emitToChannel<MessageType>(channelAndTopic: string, message: MessageType): void {
    console.log(`Broadcasting message to channel ${channelAndTopic}`);
    const data = channelAndTopic.split('.');
    if (data.length < 2) {
      throw new Error(`Invalid channel and topic: ${channelAndTopic}`);
    }

    const topic = data.pop();
    const channel = data.join('.');

    this.socket.emit('broadcast', { channel, topic, message }, (response: { success: boolean; error?: string }) => {
      if (response.success) {
        console.log(`Message broadcasted to channel ${channel} on topic ${topic}`);
      } else {
        console.error(`Failed to broadcast message to channel ${channel} on topic ${topic}: ${response.error}`);
      }
    });
  }
}
