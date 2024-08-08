import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface AckType {
  success: boolean
  error?: string
}
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

  constructor(
    private readonly jwtService: JwtService
  ) {
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
  handleSubscribe(client: Socket, payload: { channel: string, token: string }): AckType {
    const { channel, token } = payload;
    try {
      if (!channel) {
        throw new Error('Invalid channel');
      }

      this.jwtService.verify(token, { secret: process.env['JWT_SECRET'] });
      // @TODO: Add authorization logic here

      client.join(channel);
      console.log(`Client ${client.id} successfully subscribed to channel ${channel}`);
      return this.getAckResponse(undefined);
    } catch (error) {
      console.error(`Failed to subscribe client ${client.id} to channel ${channel}: ${error instanceof Error ? error.message : error}`);
      return this.getAckResponse(error);
    }
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { channel: string }): AckType {
    const { channel } = payload;
    console.log(`Client ${client.id} unsubscribing from channel ${channel}`);
    try {
      client.leave(channel);
      return this.getAckResponse(undefined);
    } catch (error) {
      console.error(`Failed to unsubscribe client ${client.id} from channel ${channel}: ${error instanceof Error ? error.message : error}`);
      return this.getAckResponse(error);
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
      console.log(`Emitting message to channel ${channel} on topic ${topic}`);
      this.server.to(channel).emit(channelAndTopic, message, (error: unknown) => this.getAckResponse(error));
    } catch (error) {
      console.error(`Failed to emit message to channel and topic ${channelAndTopic}: ${error instanceof Error ? error.message : error}`);
    }
  }

  @SubscribeMessage('broadcast')
  handleBroadcast<MessageType>(client: Socket, payload: { channel: string, topic: string, message: MessageType }): AckType {
    const { channel, topic, message } = payload;
    console.log(`Client ${client.id} broadcasting message to channel ${channel} on topic ${topic}`);
    try {
      this.server.to(channel).emit(topic, message, (ack: { error?: string }) => this.getAckResponse(ack.error));
      return this.getAckResponse(undefined);
    } catch (error) {
      console.error(`Failed to broadcast message to channel ${channel} on topic ${topic} from client ${client.id}: ${error instanceof Error ? error.message : error}`);
      return this.getAckResponse(error);
    }
  }

  getAckResponse = (error: unknown): AckType => {
    const err = error instanceof Error
      ? error.message : (typeof error === 'string')
        ? error
        : 'unknown error';
    return { success: !error, error: err };
  };
}
