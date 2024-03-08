import { OnModuleInit, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { WsJwtAuthGuard } from "./guard/ws-jwt.auth.guard";
import { WsCurrentUser } from "../utils/decorator/ws-current-user.decorator";
import { ConfigService } from "@nestjs/config";
import { ChatService } from "./chat.service";

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
  ) {}

  async onModuleInit() {
    this.server.on('connection', (socket) => {
      this.handleConnection(socket).catch(error => {
        console.error('Error handling connection:', error.message);
        socket.disconnect(true);
      });
    });
  }

  async handleConnection(socket: Socket) {
    const token = this.getTokenFromSocket(socket);
    const payload = await this.verifyToken(token);
    this.addSocketIdToUser(payload.id_user, socket.id);
  }

  async handleDisconnect(client: Socket) {
    try {
      const token = this.getTokenFromSocket(client);
      const payload = await this.verifyToken(token);
      this.removeSocketIdFromUser(payload.id_user, client.id);
    } catch (error) {
      console.error('Error handling disconnection:', error.message);
    }
  }

  getTokenFromSocket(socket: Socket): string {
    const token = socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token not found');
    return token;
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync(token, { secret: this.configService.get<string>("JWT_SECRET") }) as Promise<TokenPayload>;
  }

  addSocketIdToUser(userId: string, socketId: string) {
    const socketIds = this.socketMap.get(userId) || [];
    socketIds.push(socketId);
    this.socketMap.set(userId, socketIds);
  }

  removeSocketIdFromUser(userId: string, socketId: string) {
    const socketIds = this.socketMap.get(userId);
    if (!socketIds) return;
    const index = socketIds.indexOf(socketId);
    if (index > -1) {
      socketIds.splice(index, 1);
      this.socketMap.set(userId, socketIds);
    }
  }

  @SubscribeMessage('newMessage')
  @UseGuards(WsJwtAuthGuard)
  async emitNotification(@ConnectedSocket() client: Socket, @WsCurrentUser() user, @MessageBody() message: string) {
    try {
      await this.chatService.saveMessage(user.id_user, message);
      console.log("Emitting message to user:", user);
      // Note: You may need actual logic here to emit to specific users or rooms
      return "Message sent";
    } catch (error) {
      console.error('Error emitting message:', error.message);
      // Note: Consider whether you want to disconnect the client in case of message emission failure
    }
  }
}
