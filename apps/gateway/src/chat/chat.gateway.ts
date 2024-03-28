import { OnModuleInit, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { WsCurrentUser, WsJwtAuthGuard } from "../utils";
import { ConfigService } from "@nestjs/config";
import { ChatService } from "./chat.service";
import { NewMessageDto } from "./dto/newMessage.dto";
import { NewFamilyMessageDto } from "./dto/newFamilyMessage.dto";
import { NewImageMessageDto } from "./dto/newImageMessage.dto";

interface TokenPayload {
  id_user: string;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*', },
})
export class ChatGateway implements OnModuleInit {
  @WebSocketServer() server: Server;
  socketMap = new Map<string, string[]>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService
  ) { }

  async onModuleInit() {
    this.server.on('connection', async (socket) => {
      try {
        const token = socket.handshake.headers.authorization.split(' ')[1];
        if (!token) throw new UnauthorizedException('Token not found');
        const payload = await this.jwtService.verify(token, { secret: this.configService.get<string>("JWT_SECRET") }) as TokenPayload;
        if (!payload) throw new UnauthorizedException('Token not found');
        const socketId = socket.id;
        if (this.socketMap.has(payload.id_user)) {
          const socketIds = this.socketMap.get(payload.id_user);
          socketIds.push(socketId);
          this.socketMap.set(payload.id_user, socketIds);
        }
        else {
          this.socketMap.set(payload.id_user, [socketId]);
        }
        console.log('User ', payload.id_user, 'connected with socketId: ', socketId);
        return socketId;
      }
      catch (error) {
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
        const updatedSocketIds = this.socketMap.get(userId).filter(socketId => socketId !== client.id);
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

  @SubscribeMessage('newMessage')
  @UseGuards(WsJwtAuthGuard)
  async emitMessage(@ConnectedSocket() client: Socket, @WsCurrentUser() user, @MessageBody() message: NewMessageDto) {
    try {
      const receiverMessage = await this.chatService.saveMessage(user.id_user, message);
      const receiverSocketIds = this.socketMap.get(message.receiverId);
      if (receiverSocketIds) {
        for (const socketId of receiverSocketIds) {
          client.to(socketId).emit('onNewMessage', receiverMessage);
        }
      }
      return "Message sent";
    } catch (error) {
      console.error('Error emitting message:', error.message);
    }
  }

  @SubscribeMessage('newFamilyMessage')
  @UseGuards(WsJwtAuthGuard)
  async emitFamilyMessage(@ConnectedSocket() client: Socket, @WsCurrentUser() user, @MessageBody() message: NewFamilyMessageDto) {
    try {
      const receiverMessage = await this.chatService.saveFamilyMessage(user.id_user, message);
      const listReceiverId = await this.chatService.getListReceiverId(user.id_user, message.familyId);
      await Promise.all(listReceiverId.map(async (receiverId) => {
        const receiverSocketIds = this.socketMap.get(receiverId) || [];
        receiverSocketIds.forEach(socketId => {
          client.to(socketId).emit('onNewFamilyMessage', receiverMessage);
        });
      }));
      return "Message sent";
    } catch (error) {
      console.error('Error emitting message:', error.message);
    }
  }

  @SubscribeMessage('newImageMessage')
  @UseGuards(WsJwtAuthGuard)
  async emitImageMessage(@ConnectedSocket() client: Socket, @WsCurrentUser() user, @MessageBody() message: NewImageMessageDto) {
    try {
      const receiverMessage = await this.chatService.saveImageMessage(user.id_user, message);
      const receiverSocketIds = this.socketMap.get(message.receiverId);
      if (receiverSocketIds) {
        for (const socketId of receiverSocketIds) {
          client.to(socketId).emit('onNewImageMessage', receiverMessage);
        }
      }
      return "Message sent";
    }
    catch (error) {
      console.error('Error emitting message:', error.message);
    }
  }

  @SubscribeMessage('join_room')
  @UseGuards(WsJwtAuthGuard)
  async joinRoom( @MessageBody() roomName: string, @ConnectedSocket() socket: Socket, @WsCurrentUser() user ) {
    const room = this.server.in(roomName);

    const roomSockets = await room.fetchSockets();
    const numberOfPeopleInRoom = roomSockets.length;
    console.log('Number of people in room: ', numberOfPeopleInRoom);

    if (numberOfPeopleInRoom > 1) {
      room.emit('too_many_people', 'Too many people in the room');
      return;
    }

    socket.data.userId = user.id;

    socket.join(roomName);
  }

  @SubscribeMessage('send_connection_offer')
  @UseGuards(WsJwtAuthGuard)
  async sendConnectionOffer(@MessageBody() { offer, roomName, }: { offer: RTCSessionDescriptionInit; roomName: string; }, @ConnectedSocket() socket: Socket, ) {
    const userId = socket.data.userId;
    console.log(offer);
    this.server.in(roomName).except(socket.id).emit('send_connection_offer', { offer, roomName, userId });
  }

  @SubscribeMessage('send_candidate')
  @UseGuards(WsJwtAuthGuard)
  async sendCandidate(@MessageBody() { candidate, roomName}: { candidate: unknown; roomName: string; }, @ConnectedSocket() socket: Socket) {
    const userId = socket.data.userId;
    console.log('Candidate: ', candidate);
    this.server.in(roomName).except(socket.id).emit('send_candidate', { candidate, roomName, userId, });
  }

  @SubscribeMessage('answer')
  @UseGuards(WsJwtAuthGuard)
  async answer( @MessageBody() { answer, roomName, }: { answer: RTCSessionDescriptionInit; roomName: string; }, @ConnectedSocket() socket: Socket) {
    const userId = socket.data.userId;
    console.log(answer);
    this.server.in(roomName).except(socket.id).emit('answer', { answer, roomName, userId, });
  }
}
