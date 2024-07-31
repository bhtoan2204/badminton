import { GetUserResponse, GetUsersResponse, Users } from '@app/common';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class UserGrpcService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async findById(id: string): Promise<GetUserResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { id_user: id },
      });
      return {
        idUser: user.id_user,
        email: user.email,
        phone: user.phone,
        firstname: user.firstname,
        lastname: user.lastname,
        genre: user.genre,
        avatar: user.avatar,
        birthdate: user.birthdate.toISOString(),
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString(),
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findByIds(ids: string[]): Promise<GetUsersResponse> {
    try {
      if (ids === undefined) {
        return {
          users: [],
        };
      }
      const users = await this.userRepository.find({
        where: { id_user: In(ids) },
      });
      console.log(users);
      if (!users) {
        throw new RpcException({
          message: 'Users not found',
          statusCode: 404,
        });
      }
      return {
        users: users.map((user) => ({
          idUser: user.id_user,
          email: user.email,
          phone: user.phone,
          firstname: user.firstname,
          lastname: user.lastname,
          genre: user.genre,
          avatar: user.avatar,
          birthdate: user.birthdate.toISOString(),
          createdAt: user.created_at.toISOString(),
          updatedAt: user.updated_at.toISOString(),
        })),
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
