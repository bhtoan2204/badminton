import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RoleService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager
  ) { }

  async getrole(user, family) {
    try {
      const q2 = 'select * from f_get_role_member($1, $2)';
      const param = [user, family];

      const data = await this.entityManager.query(q2, param);
      return data;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    };
  }

  async getallrole() {
    try {
      const q2 = 'select * from v_get_role';
      const data = await this.entityManager.query(q2);
      return data;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    };
  }
}
