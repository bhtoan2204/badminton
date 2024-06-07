import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { EntityManager } from "typeorm";
import * as uuid from 'uuid';

@Injectable()
export class InvitationService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

  async getInvitationCode(id_user: string, id_family: number) {
    try {
      const query = 'SELECT * FROM f_get_invitation_code($1, $2)';
      const params = [id_user, id_family];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data[0]
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async generateInvitation(id_user: string, id_family: number) {
    try {
      const code = uuid.v4();
      const query = 'SELECT * FROM f_generate_invitation($1, $2, $3)';
      const params = [id_user, id_family, code];
      await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: {
          id_family: id_family,
          code: code
        }
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async handleInvitation(id_user: string, id_family: number, code: string) {
    try {
      const query = 'SELECT * FROM f_handle_invitation($1, $2, $3)';
      const params = [id_user, id_family, code];
      const data = await this.entityManager.query(query, params);
      return {
        message: data[0].f_handle_invitation || 'Error',
        data: {
          id_family: id_family,
          code: code
        }
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}