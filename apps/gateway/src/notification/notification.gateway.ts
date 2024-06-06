import { OnModuleInit, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { Server, Socket } from 'socket.io';
import { WsCurrentUser, WsJwtAuthGuard } from '../utils';
import { NewNotificationDto } from './dto/newNotification.dto';

interface TokenPayload {
  id_user: string;
}

@WebSocketGateway({
  namespace: 'notification',
  cors: { origin: '*' },
})
export class NotificationGateway implements OnModuleInit {
  @WebSocketServer() server: Server;
  socketMap = new Map<string, string[]>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
  ) {}

  async onModuleInit() {
    this.server.on('connection', async (socket) => {
      try {
        const token = socket.handshake.headers.authorization.split(' ')[1];
        if (!token) throw new UnauthorizedException('Token not found');
        const payload = (await this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        })) as TokenPayload;
        if (!payload) throw new UnauthorizedException('Token not found');
        const socketId = socket.id;
        if (this.socketMap.has(payload.id_user)) {
          const socketIds = this.socketMap.get(payload.id_user);
          socketIds.push(socketId);
          this.socketMap.set(payload.id_user, socketIds);
        } else {
          this.socketMap.set(payload.id_user, [socketId]);
        }
        console.log(
          'User ',
          payload.id_user,
          'connected with socketId: ',
          socketId,
        );
        return socketId;
      } catch (error) {
        console.error('Error handling connection:', error.message);
        socket.disconnect(true);
      }
    });

    // Schedule a notification to be sent to all connected users every 10 seconds
    // this.setupScheduledNotification();
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      let userId: string | null = null;
      for (const [key, value] of this.socketMap.entries()) {
        if (value.includes(client.id)) {
          userId = key;
          break;
        }
      }
      if (userId) {
        const updatedSocketIds = this.socketMap
          .get(userId)
          .filter((socketId) => socketId !== client.id);
        if (updatedSocketIds.length > 0) {
          this.socketMap.set(userId, updatedSocketIds);
        } else {
          this.socketMap.delete(userId);
        }
        console.log(`User ${userId} disconnected from socket ${client.id}`);
      }
    } catch (error) {
      console.error('Error handling disconnection:', error.message);
      client.disconnect(true);
    }
  }

  @SubscribeMessage('newNotificationFamily')
  @UseGuards(WsJwtAuthGuard)
  async newNotification(
    @ConnectedSocket() client: Socket,
    @WsCurrentUser() user,
    @MessageBody() dto: NewNotificationDto,
  ) {
    try {
      const listReceiverId = await this.notificationService.getListReceiverId(
        user.id_user,
        dto.family_id,
      );
      const notifications = await this.notificationService.createNotification(
        user.id_user,
        dto,
        listReceiverId,
      );

      const emitPromises = notifications.flatMap((notification) => {
        const receiverSocketIds =
          this.socketMap.get(notification.id_user) || [];
        return receiverSocketIds.map(
          (socketId) =>
            new Promise(() => {
              client.to(socketId).emit('onNewNotificationFamily', {
                _id: notification._id,
                title: notification.title,
                content: notification.content,
                type: notification.type,
                data: notification.data,
                isRead: notification.isRead,
              });
            }),
        );
      });

      await Promise.all(emitPromises);
    } catch (error) {
      console.error('Error handling newNotification:', error.message);
    }
  }

  private async setupScheduledNotification() {
    setInterval(() => {
      this.emitToAllUsers(
        'This is a scheduled notification to all connected users!',
      );
    }, 10000);
  }

  private async emitToAllUsers(message: string) {
    this.server.emit('broadcastNotification', message);
  }
}
