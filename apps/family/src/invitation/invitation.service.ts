import { FamilyInvitation, MemberFamily } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as uuid from 'uuid';

@Injectable()
export class InvitationService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(FamilyInvitation)
    private readonly familyInvitationRepository: Repository<FamilyInvitation>,
    @InjectRepository(MemberFamily)
    private readonly memberFamilyRepository: Repository<MemberFamily>,
  ) {}

  async getInvitationCode(id_user: string, id_family: number) {
    try {
      const data = await this.familyInvitationRepository.findOne({
        where: { id_family },
      });
      if (!data) {
        throw new RpcException({
          message: 'No invitation code found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async generateInvitation(id_user: string, id_family: number) {
    try {
      const code = uuid.v4();
      const oldData = await this.familyInvitationRepository.findOne({
        where: { id_family },
      });
      if (oldData) {
        await this.familyInvitationRepository.delete({
          id_family: id_family,
        });
      }
      const data = await this.familyInvitationRepository.save({
        id_family: id_family,
        code: code,
      });
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async handleInvitation(id_user: string, id_family: number, code: string) {
    try {
      const memberFamily = await this.memberFamilyRepository.findOne({
        where: { id_user, id_family },
      });
      if (memberFamily) {
        throw new RpcException({
          message: 'You are already a member of this family',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      const memberCount = await this.memberFamilyRepository.count({
        where: { id_family },
      });
      if (memberCount >= 20) {
        throw new RpcException({
          message: 'Family is full',
          statusCode: HttpStatus.CONFLICT,
        });
      }
      const invitation = await this.familyInvitationRepository.find({
        where: { id_family, code },
      });
      if (!invitation.length) {
        throw new RpcException({
          message: 'Invalid code',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      const data = await this.memberFamilyRepository.save({
        id_user: id_user,
        id_family: id_family,
      });
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
