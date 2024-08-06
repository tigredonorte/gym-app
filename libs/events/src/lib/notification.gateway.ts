import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(5000, {
  cors: {
    origin: [process.env['FRONTEND_URL']],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private clients: { [key: string]: Socket } = {};

  constructor() {
    console.log('NotificationGateway created with CORS origin:', process.env['FRONTEND_URL']);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.clients[client.id] = client;
    client.on('error', (err) => console.error(`Client ${client.id} error:`, err));
    client.on('connect', () => console.log(`Client ${client.id} connected successfully`));
    client.on('disconnect', () => console.log(`Client ${client.id} disconnected`));
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    delete this.clients[client.id];
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { channel: string }, callback: (response: { success: boolean; error?: string }) => void): void {
    const { channel } = payload;
    console.log(`Client ${client.id} subscribing to channel ${channel}`);
    try {
      client.join(channel);
      callback?.({ success: true });
    } catch (error) {
      console.error(`Failed to subscribe client ${client.id} to channel ${channel}: ${error instanceof Error ? error.message : error}`);
      this.acknowledge({ error: error instanceof Error ? error.message : `${error}` }, callback);    }
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { channel: string }, callback: (response: { success: boolean; error?: string }) => void): void {
    const { channel } = payload;
    console.log(`Client ${client.id} unsubscribing from channel ${channel}`);
    try {
      client.leave(channel);
      this.acknowledge({ error: undefined }, callback);
      callback({ success: true });
    } catch (error) {
      console.error(`Failed to unsubscribe client ${client.id} from channel ${channel}: ${error instanceof Error ? error.message : error}`);
      this.acknowledge({ error: error instanceof Error ? error.message : `${error}` }, callback);
    }
  }

  emitToChannel<MessageType>(channelAndTopic: string, message: MessageType): void {
    console.log(`Emitting message to channel and topic ${channelAndTopic}`);
    try {
      const data = channelAndTopic.split('.');
      if (!data?.length || data.length < 2) {
        throw new Error(`Invalid channel and topic: ${channelAndTopic}`);
      }

      const topic = data.pop();
      if (!topic) {
        throw new Error('Invalid topic');
      }

      const channel = data.join('.');
      this.server.to(channel).emit(topic, message, (ack: { error?: string }) => this.acknowledge(ack));
    } catch (error) {
      console.error(`Failed to emit message to channel and topic ${channelAndTopic}: ${error instanceof Error ? error.message : error}`);
    }
  }

  @SubscribeMessage('broadcast')
  handleBroadcast<MessageType>(client: Socket, payload: { channel: string, topic: string, message: MessageType }, callback: (response: { success: boolean; error?: string }) => void): void {
    const { channel, topic, message } = payload;
    console.log(`Client ${client.id} broadcasting message to channel ${channel} on topic ${topic}`);
    try {
      this.server.to(channel).emit(topic, message, (ack: { error?: string }) => this.acknowledge(ack, callback));
    } catch (error) {
      console.error(`Failed to broadcast message to channel ${channel} on topic ${topic} from client ${client.id}: ${error instanceof Error ? error.message : error}`);
      callback({ success: false, error: error instanceof Error ? error.message : `${error}` });
    }
  }

  acknowledge (ack: { error?: string }, callback?: (response: { success: boolean; error?: string }) => void): void {
    try {
      if (ack?.error) {
        console.error(`Error from client acknowledgment: ${ack.error}`);
      }
      if (!callback) {
        console.warn('No callback provided for client acknowledgment');
        return;
      }
      callback({ success: !ack?.error , error: ack.error });
    } catch (error) {
      console.error(`Failed to acknowledge client: ${error instanceof Error ? error.message : error}`);
    }
  }
}
