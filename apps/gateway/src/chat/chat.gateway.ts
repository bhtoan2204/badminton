import {
  Inject,
  OnModuleInit,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { WsCurrentUser, WsJwtAuthGuard } from '../utils';

interface TokenPayload {
  id_user: string;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
})
export class ChatGateway implements OnModuleInit {
  @WebSocketServer() server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async onModuleInit() {
    this.server.on('connection', async (socket) => {
      try {
        const token = socket.handshake.headers.authorization.split(' ')[1];
        console.log(socket.handshake);
        if (!token) throw new UnauthorizedException('Token not found');
        const payload = (await this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        })) as TokenPayload;
        if (!payload) throw new UnauthorizedException('Token not found');
        const socketId = socket.id;
        const userId = payload.id_user;

        const socketIds: string[] = (await this.cacheManager.get(userId)) || [];
        socketIds.push(socketId);
        await this.cacheManager.set(userId, socketIds);

        console.log(
          'User ',
          payload.id_user,
          'connected with socketId:',
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
      const keys = await this.cacheManager.store.keys();
      for (const key of keys) {
        const socketIds: string[] = await this.cacheManager.get(key);
        if (socketIds.includes(client.id)) {
          const filteredSocketIds = socketIds.filter((id) => id !== client.id);
          if (filteredSocketIds.length > 0) {
            await this.cacheManager.set(key, filteredSocketIds);
          } else {
            await this.cacheManager.del(key);
          }
          console.log(`User ${key} disconnected from socket ${client.id}`);
          break;
        }
      }
    } catch (error) {
      console.error('Error handling disconnection:', error.message);
    }
  }

  async emitMessageToUser(userId: string, message: any) {
    try {
      const receiverSocketIds: string[] = await this.cacheManager.get(userId);
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
          const receiverSocketIds: string[] =
            (await this.cacheManager.get(receiverId)) || [];
          receiverSocketIds.forEach((socketId) => {
            this.server.to(socketId).emit('onNewFamilyMessage', message);
          });
        }),
      );
    } catch (error) {
      console.error('Error emitting message:', error.message);
    }
  }

  async emitNotificationToUser(userId: string, notification: any) {
    try {
      const receiverSocketIds: string[] = await this.cacheManager.get(userId);
      if (receiverSocketIds) {
        const emitPromises = receiverSocketIds.map((socketId) =>
          this.server.to(socketId).emit('onNewNotification', notification),
        );
        await Promise.all(emitPromises);
      }
    } catch (error) {
      console.error('Error emitting notification:', error.message);
    }
  }

  async emitLogoutToUser(userId: string) {
    try {
      const receiverSocketIds: string[] = await this.cacheManager.get(userId);
      if (receiverSocketIds) {
        for (const socketId of receiverSocketIds) {
          this.server
            .to(socketId)
            .emit('onLogout', { logout: true, id_user: userId });
        }
      }
    } catch (error) {
      console.error('Error emitting logout:', error.message);
    }
  }

  @SubscribeMessage('joinRoom')
  @UseGuards(WsJwtAuthGuard)
  async handleJoinRoom(
    @WsCurrentUser() currentUser,
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.rooms.has(roomId)) {
      client.join(roomId);
      this.server
        .to(roomId)
        .emit('userJoined', { clientId: client.id, user: currentUser });
      console.log(
        `User ${currentUser.id_user} (${currentUser.firstname} ${currentUser.lastname}) joined room ${roomId}`,
      );
    }
    const room = this.server.in(roomId);
    const roomSockets = await room.fetchSockets();
    console.log(
      'Join Room:',
      roomSockets.map((socket: any) => socket.user.id_user),
    );
  }

  @SubscribeMessage('leaveRoom')
  @UseGuards(WsJwtAuthGuard)
  async handleLeaveRoom(
    @WsCurrentUser() currentUser,
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
    this.server
      .to(roomId)
      .emit('userLeft', { clientId: client.id, user: currentUser });
    console.log(
      `User ${currentUser.id_user} (${currentUser.firstname} ${currentUser.lastname}) left room ${roomId}`,
    );
    const room = this.server.in(roomId);
    const roomSockets = await room.fetchSockets();
    console.log(
      'Leave room',
      roomSockets.map((socket: any) => socket.user.id_user),
    );
  }

  @SubscribeMessage('offer')
  @UseGuards(WsJwtAuthGuard)
  handleOffer(
    @WsCurrentUser() currentUser,
    @MessageBody() data: { roomId: string; offer: RTCSessionDescriptionInit },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(data.roomId).emit('offer', {
      clientId: client.id,
      offer: data.offer,
      user: currentUser,
    });
    console.log(
      `User ${currentUser.id_user} (${currentUser.firstname} ${currentUser.lastname}) sent offer to room ${data.roomId}`,
    );
  }

  @SubscribeMessage('answer')
  @UseGuards(WsJwtAuthGuard)
  handleAnswer(
    @WsCurrentUser() currentUser,
    @MessageBody() data: { roomId: string; answer: RTCSessionDescriptionInit },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(data.roomId).emit('answer', {
      clientId: client.id,
      answer: data.answer,
      user: currentUser,
    });
    console.log(
      `User ${currentUser.id_user} (${currentUser.firstname} ${currentUser.lastname}) sent answer to room ${data.roomId}`,
    );
  }

  // @SubscribeMessage('iceCandidate')
  // @UseGuards(WsJwtAuthGuard)
  // handleIceCandidate(
  //   @WsCurrentUser() currentUser,
  //   @MessageBody() data: { roomId: string; candidate: RTCIceCandidateInit },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   this.server.to(data.roomId).emit('iceCandidate', {
  //     clientId: client.id,
  //     candidate: data.candidate,
  //     user: currentUser,
  //   });
  //   console.log(
  //     `User ${currentUser.id_user} (${currentUser.firstname} ${currentUser.lastname}) sent ICE candidate to room ${data.roomId}`,
  //   );
  // }

  @SubscribeMessage('callUser')
  @UseGuards(WsJwtAuthGuard)
  async handleCallUser(
    @WsCurrentUser() currentUser,
    @MessageBody() data: { userId: string; roomId: string },
  ) {
    const { userId, roomId } = data;
    const receiverSocketIds: string[] = await this.cacheManager.get(userId);
    if (receiverSocketIds) {
      const emitPromises = receiverSocketIds.map((socketId) =>
        this.server.to(socketId).emit('incomingCall', {
          from: currentUser,
          roomId,
        }),
      );
      await Promise.all(emitPromises);
    }
    console.log(`User ${currentUser.id_user} is calling User ${userId}`);
  }

  @SubscribeMessage('callFamily')
  @UseGuards(WsJwtAuthGuard)
  async handleCallFamily(
    @WsCurrentUser() currentUser,
    @MessageBody() data: { familyId: number; roomId: string },
  ) {
    const { familyId, roomId } = data;
    const listReceiverId = await this.chatService.getListReceiverId(
      currentUser.id_user,
      familyId,
    );
    await Promise.all(
      listReceiverId.map(async (receiverId) => {
        const receiverSocketIds: string[] =
          (await this.cacheManager.get(receiverId)) || [];
        receiverSocketIds.forEach((socketId) => {
          this.server.to(socketId).emit('incomingFamilyCall', {
            from: currentUser,
            roomId,
          });
        });
      }),
    );
    console.log(`User ${currentUser.id_user} is calling Family ${familyId}`);
  }

  @SubscribeMessage('acceptCall')
  @UseGuards(WsJwtAuthGuard)
  async handleAcceptCall(
    @WsCurrentUser() currentUser,
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // client.join(roomId);
    this.server
      .to(roomId)
      .emit('callAccepted', { clientId: client.id, user: currentUser });
    // console.log(
    //   `User ${currentUser.id_user} (${currentUser.firstname} ${currentUser.lastname}) accepted call and joined room ${roomId}`,
    // );
    // const room = this.server.in(roomId);
    // const roomSockets = await room.fetchSockets();
    // console.log(
    //   'Accept and join room',
    //   roomSockets.map((socket: any) => socket.user.id_user),
    // );
  }

  @SubscribeMessage('rejectCall')
  @UseGuards(WsJwtAuthGuard)
  async handleRejectCall(
    @WsCurrentUser() currentUser,
    @MessageBody() data: { callerId: string; roomId: string },
    // @ConnectedSocket() client: Socket,
  ) {
    const { callerId, roomId } = data;
    const callerSocketIds: string[] = await this.cacheManager.get(callerId);
    if (callerSocketIds) {
      const emitPromises = callerSocketIds.map((socketId) =>
        this.server.to(socketId).emit('callRejected', {
          from: currentUser,
          roomId,
        }),
      );
      await Promise.all(emitPromises);
    }
    console.log(
      `User ${currentUser.id_user} (${currentUser.firstname} ${currentUser.lastname}) rejected call from User ${callerId}`,
    );
  }
}
