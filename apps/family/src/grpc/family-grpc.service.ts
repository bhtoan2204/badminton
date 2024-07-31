import {
  Family,
  GerUserIdsRequest,
  GerUserIdsResponse,
  GetFamiliesRequest,
  GetFamiliesResponse,
  GetFamilyRequest,
  GetFamilyResponse,
  MemberFamily,
} from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class FamilyGrpcService {
  constructor(
    @InjectRepository(Family) private familyRepository: Repository<Family>,
    @InjectRepository(MemberFamily)
    private memberFamilyRepository: Repository<MemberFamily>,
  ) {}

  async getFamilyById(req: GetFamilyRequest): Promise<GetFamilyResponse> {
    try {
      const family = await this.familyRepository.findOne({
        where: { id_family: req.idFamily },
      });
      if (!family) {
        throw new RpcException({
          message: 'Family not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return {
        idFamily: family.id_family,
        quantity: family.quantity,
        name: family.name,
        description: family.description,
        ownerId: family.owner_id,
        createdAt: family.created_at.toISOString(),
        updatedAt: family.updated_at.toISOString(),
        expiredAt: family.expired_at.toISOString(),
        avatar: family.avatar,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getFamilyByIds(req: GetFamiliesRequest): Promise<GetFamiliesResponse> {
    try {
      const families = await this.familyRepository.find({
        where: { id_family: In(req.idFamilies) },
      });
      const getFamilyResponses: GetFamilyResponse[] = families.map(
        (family) => ({
          idFamily: family.id_family,
          quantity: family.quantity,
          name: family.name,
          description: family.description,
          ownerId: family.owner_id,
          createdAt: family.created_at.toISOString(),
          updatedAt: family.updated_at.toISOString(),
          expiredAt: family.expired_at.toISOString(),
          avatar: family.avatar,
        }),
      );
      return {
        families: getFamilyResponses,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getIdsUserInFamily(
    req: GerUserIdsRequest,
  ): Promise<GerUserIdsResponse> {
    try {
      const userIds = await this.memberFamilyRepository.find({
        where: { id_family: req.idFamily },
      });
      if (!userIds) {
        throw new RpcException({
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return {
        idUser: userIds.map((memberFamily) => memberFamily.id_user),
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
