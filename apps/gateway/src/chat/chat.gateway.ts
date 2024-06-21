import { OnModuleInit, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { WsCurrentUser, WsJwtAuthGuard } from '../utils';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { NewMessageDto } from './dto/newMessage.dto';
import { NewFamilyMessageDto } from './dto/newFamilyMessage.dto';
// import { NewImageMessageDto } from './dto/newImageMessage.dto';
import { NewFamilyImageMessageDto } from './dto/newFamilyImageMessage.dto';

interface TokenPayload {
  id_user: string;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
})
export class ChatGateway implements OnModuleInit {
  @WebSocketServer() server: Server;
  socketMap = new Map<string, string[]>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
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

  async emitMessageToUser(userId: string, message: any) {
    try {
      const receiverSocketIds = this.socketMap.get(userId);
      if (receiverSocketIds) {
        for (const socketId of receiverSocketIds) {
          this.server.to(socketId).emit('onNewMessage', message);
        }
      }
    } catch (error) {
      console.error('Error emitting message:', error.message);
    }
  }

  async emitFamilyMessageToUser(
    id_user: string,
    id_family: number,
    message: any,
  ) {
    try {
      const listReceiverId = await this.chatService.getListReceiverId(
        id_user,
        id_family,
      );
      await Promise.all(
        listReceiverId.map(async (receiverId) => {
          const receiverSocketIds = this.socketMap.get(receiverId) || [];
          receiverSocketIds.forEach((socketId) => {
            this.server.to(socketId).emit('onNewFamilyMessage', {
              ...message,
              familyId: id_family,
            });
          });
        }),
      );
    } catch (error) {
      console.error('Error emitting message:', error.message);
    }
  }

  @SubscribeMessage('newMessage')
  @UseGuards(WsJwtAuthGuard)
  async emitMessage(
    @ConnectedSocket() client: Socket,
    @WsCurrentUser() user,
    @MessageBody() message: NewMessageDto,
  ) {
    try {
      const receiverMessage = await this.chatService.saveMessage(
        user.id_user,
        message,
      );
      const receiverSocketIds = this.socketMap.get(message.receiverId);
      if (receiverSocketIds) {
        for (const socketId of receiverSocketIds) {
          client.to(socketId).emit('onNewMessage', receiverMessage);
        }
      }
      return 'Message sent';
    } catch (error) {
      console.error('Error emitting message:', error.message);
    }
  }

  @SubscribeMessage('newFamilyMessage')
  @UseGuards(WsJwtAuthGuard)
  async emitFamilyMessage(
    @ConnectedSocket() client: Socket,
    @WsCurrentUser() user,
    @MessageBody() message: NewFamilyMessageDto,
  ) {
    try {
      const receiverMessage = await this.chatService.saveFamilyMessage(
        user.id_user,
        message,
      );
      const listReceiverId = await this.chatService.getListReceiverId(
        user.id_user,
        message.familyId,
      );
      await Promise.all(
        listReceiverId.map(async (receiverId) => {
          const receiverSocketIds = this.socketMap.get(receiverId) || [];
          receiverSocketIds.forEach((socketId) => {
            client.to(socketId).emit('onNewFamilyMessage', {
              ...receiverMessage,
              familyId: message.familyId,
            });
          });
        }),
      );
    } catch (error) {
      console.error('Error emitting message:', error.message);
    }
  }

  // @SubscribeMessage('newFamilyImageMessage')
  // @UseGuards(WsJwtAuthGuard)
  // async emitFamilyImageMessage(
  //   @ConnectedSocket() client: Socket,
  //   @WsCurrentUser() user,
  //   @MessageBody() message: NewFamilyImageMessageDto,
  // ) {
  //   try {
  //     const receiverMessage = await this.chatService.saveFamilyImageMessage(
  //       user.id_user,
  //       message,
  //     );
  //     const listReceiverId = await this.chatService.getListReceiverId(
  //       user.id_user,
  //       message.familyId,
  //     );
  //     await Promise.all(
  //       listReceiverId.map(async (receiverId) => {
  //         const receiverSocketIds = this.socketMap.get(receiverId) || [];
  //         receiverSocketIds.forEach((socketId) => {
  //           client.to(socketId).emit('onNewFamilyImageMessage', {
  //             ...receiverMessage,
  //             familyId: message.familyId,
  //           });
  //         });
  //       }),
  //     );
  //   } catch (error) {
  //     console.error('Error emitting message:', error.message);
  //   }
  // }

  // @SubscribeMessage('newImageMessage')
  // @UseGuards(WsJwtAuthGuard)
  // async emitImageMessage(
  //   @ConnectedSocket() client: Socket,
  //   @WsCurrentUser() user,
  //   @MessageBody() message: NewImageMessageDto,
  // ) {
  //   try {
  //     const receiverMessage = await this.chatService.saveImageMessage(
  //       user.id_user,
  //       message,
  //     );
  //     const receiverSocketIds = this.socketMap.get(message.receiverId);
  //     if (receiverSocketIds) {
  //       for (const socketId of receiverSocketIds) {
  //         client.to(socketId).emit('onNewImageMessage', receiverMessage);
  //       }
  //     }
  //     return 'Message sent';
  //   } catch (error) {
  //     console.error('Error emitting message:', error.message);
  //   }
  // }
}
