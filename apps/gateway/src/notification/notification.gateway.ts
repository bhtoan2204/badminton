import { OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { NotificationService } from "./notification.service";
import { Server, Socket } from "socket.io";

interface TokenPayload {
  id_user: string;
}

@WebSocketGateway({
  namespace: 'notification',
  cors: { origin: '*', },
})
export class NotificationGateway implements OnModuleInit {
  @WebSocketServer() server: Server;
  socketMap = new Map<string, string[]>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService
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
}