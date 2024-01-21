import { User } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async registerUser(user: any): Promise<User> {
    return await this.prisma.user.create({
      data: user
    });
  }
}