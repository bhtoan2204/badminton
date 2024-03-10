import { OnModuleInit, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { WsJwtAuthGuard } from "./guard/ws-jwt.auth.guard";
import { WsCurrentUser } from "../utils/decorator/ws-current-user.decorator";
import { ConfigService } from "@nestjs/config";
import { ChatService } from "./chat.service";
import { NewMessageDto } from "./dto/newMessage.dto";

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
        return socketId;
      }
      catch (error) {
        console.error('Error handling connection:', error.message);
        socket.disconnect(true);
      }
    });
  }

  async handleDisconnect(client: Socket) {
    try {
        const token = client.handshake.headers.authorization.split(' ')[1];
        if (!token) throw new UnauthorizedException('Token not found');
        const payload = await this.jwtService.verifyAsync(token) as TokenPayload;
        if (!payload) throw new UnauthorizedException('Token not found');
        const socketId = client.id;
        if (this.socketMap.has(payload.id_user)) {
            const socketIds = this.socketMap.get(payload.id_user);
            const index = socketIds.indexOf(socketId);
            if (index > -1) {
                socketIds.splice(index, 1);
            }
            this.socketMap.set(payload.id_user, socketIds);
        }

    }
    catch (error) {
        console.error('Error handling disconnection:', error.message);
        client.disconnect(true);
    }
}

  @SubscribeMessage('newMessage')
  @UseGuards(WsJwtAuthGuard)
  async emitNotification(@ConnectedSocket() client: Socket, @WsCurrentUser() user, @MessageBody() message: NewMessageDto) {
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
}
