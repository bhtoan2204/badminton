import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { StorageService } from './storage/storage.service';
import {
  Family,
  FamilyExtraPackages,
  FamilyRole,
  FamilyRoles,
  MemberFamily,
  PackageExtra,
  UploadFileRequest,
} from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FamilyService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly storageService: StorageService,
    @InjectRepository(Family) private familyRepository: Repository<Family>,
    @InjectRepository(PackageExtra)
    private packageExtraRepository: Repository<PackageExtra>,
    @InjectRepository(FamilyExtraPackages)
    private familyExtraPackagesRepository: Repository<FamilyExtraPackages>,
    @InjectRepository(MemberFamily)
    private memberFamilyRepository: Repository<MemberFamily>,
    @InjectRepository(FamilyRoles)
    private familyRolesRepository: Repository<FamilyRoles>,
  ) {}

  async checkExtraPackage(
    id_family: number,
    permissions: string[],
  ): Promise<boolean> {
    try {
      const family = await this.familyRepository.findOne({
        where: { id_family },
      });

      if (!family) {
        throw new RpcException({
          message: 'Family not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const familyExtraPackages = await this.familyExtraPackagesRepository.find(
        {
          where: { family: { id_family } },
          relations: ['extra_package'],
        },
      );

      const extraPackageNames = familyExtraPackages.map(
        (fep) => fep.extra_package.name,
      );

      const hasAllPermissions = permissions.every((permission) =>
        extraPackageNames.includes(permission),
      );
      return hasAllPermissions;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async checkIsMember(id_user: string, id_family: number): Promise<boolean> {
    try {
      const q2 = 'select * from f_is_user_member_of_family($1, $2)';
      const param = [id_user, id_family];
      const data = await this.entityManager.query(q2, param);
      return data[0].f_is_user_member_of_family;
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getFamily(id_user: string, id_family: any) {
    try {
      const q2 = 'select * from f_getfamily($1, $2)';
      const param = [id_user, id_family];
      const data = await this.entityManager.query(q2, param);
      return data;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getMember(id_user: string) {
    try {
      const data = await this.memberFamilyRepository.findOne({
        where: { id_user },
        relations: ['familyRoles', 'user'],
      });
      return {
        data: data,
        message: 'Member found',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllMember(id_user: string, id_family: number) {
    try {
      const members = await this.memberFamilyRepository.find({
        where: { id_family },
        relations: ['user', 'familyRoles'],
      });

      return {
        data: members,
        message: 'All members of family',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllFamily(id_user: string) {
    try {
      const memberFamilies = await this.memberFamilyRepository.find({
        where: { id_user },
        relations: ['family'],
      });
      const families = memberFamilies.map(
        (memberFamily) => memberFamily.family,
      );
      return families;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async addMember(id_user: string, memberFamilyDto: any) {
    try {
      const { id_family, phone, gmail, role } = memberFamilyDto;
      const q2 = 'select * from f_add_member($1,$2,$3,$4,$5)';
      const param = [id_user, id_family, phone, gmail, role];
      const data = await this.entityManager.query(q2, param);
      return {
        data: data[0]['f_add_member'],
        message: 'Member added',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createFamily(id_user: string, createFamilyDto) {
    try {
      const { description, name, id_order } = createFamilyDto;
      const Query = 'SELECT * FROM f_create_family($1, $2, $3, $4)';
      const params = [id_user, description, name, id_order];
      const data = await this.entityManager.query(Query, params);
      return {
        data: data[0]['f_create_family'],
        message: 'Family created',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateFamily(id_user: string, UpdateFamilyDTO) {
    try {
      const { id_family, description, name } = UpdateFamilyDTO;
      const Query = 'select * from f_update_family($1,$2,$3,$4)';
      const param = [id_user, id_family, name, description];
      const data = await this.entityManager.query(Query, param);
      return data;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteFamily(id_user: string, id_family: any) {
    try {
      const Query = 'select * from f_delete_family($1, $2)';
      const param = [id_user, id_family];
      const data = await this.entityManager.query(Query, param);
      return {
        data: data[0]['f_delete_family'],
        message: 'Family deleted',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteMember(id_user: string, member: any) {
    try {
      const { id_family, id_user } = member;

      const Query = 'select * from f_delete_member($1, $2, $3)';
      const param = [id_user, id_user, id_family];
      const data = await this.entityManager.query(Query, param);
      return {
        data: data[0]['f_delete_member'],
        message: 'Member deleted',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getIdsMember(id_user: string, id_family: number) {
    try {
      const Query = 'select * from f_get_ids_member($1, $2)';
      const param = [id_user, id_family];
      const data = await this.entityManager.query(Query, param);
      const ids = data.map((row) => row.f_get_ids_member);
      return ids;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async changeAvatar(id_user: string, id_family: number, file: any) {
    try {
      const filename =
        'avatar_family_' + id_user + '_' + Date.now() + '_' + file.originalname;
      const params: UploadFileRequest = {
        fileName: filename,
        file: new Uint8Array(file.buffer.data),
      };
      const uploadImageData = await this.storageService.uploadFile(params);
      const fileUrl = uploadImageData.fileUrl;

      const family = await this.familyRepository.findOne({
        where: { id_family },
      });
      if (!family) {
        throw new RpcException({
          message: 'Family not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      family.avatar = fileUrl;
      await this.familyRepository.save(family);
      return {
        message: file.size + ' bytes uploaded successfully',
        data: fileUrl,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async leaveFamily(id_user: string, id_family: number) {
    try {
      const memberFamily = await this.memberFamilyRepository.findOne({
        where: { id_user, id_family },
      });
      if (!memberFamily) {
        throw new RpcException({
          message: 'Member not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.memberFamilyRepository.remove(memberFamily);
      return {
        message: 'Member left family',
        data: true,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async kickMember(id_user: string, id_user_kick: string, id_family: number) {
    try {
      const [roleOfKicker, memberFamily] = await Promise.all([
        this.memberFamilyRepository.findOne({
          where: { id_user, id_family },
        }),
        this.memberFamilyRepository.findOne({
          where: { id_user: id_user_kick, id_family },
        }),
      ]);
      if (!roleOfKicker || roleOfKicker.role !== FamilyRole.OWNER) {
        throw new RpcException({
          message: 'Only owner can kick member',
          statusCode: HttpStatus.FORBIDDEN,
        });
      }
      if (!memberFamily) {
        throw new RpcException({
          message: 'Member not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.memberFamilyRepository.remove(memberFamily);
      return {
        message: 'Member kicked',
        data: true,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async termCheck(id_family: number) {
    try {
      const family = await this.familyRepository.findOne({
        where: { id_family },
      });
      if (!family) {
        throw new RpcException({
          message: 'Family not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const currentDate = new Date();
      const expiredDate = family.expired_at;
      console.log(currentDate, expiredDate);
      return currentDate < expiredDate;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getFamilyRoles() {
    try {
      const familyRoles = await this.familyRolesRepository.find();
      return familyRoles;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async assignFamilyRole(dto: {
    id_user: string;
    id_family: number;
    id_family_role: number;
  }) {
    try {
      const { id_user, id_family, id_family_role } = dto;
      const memberFamily = await this.memberFamilyRepository.findOne({
        where: { id_user, id_family },
      });
      if (!memberFamily) {
        throw new RpcException({
          message: 'Member not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      memberFamily.id_family_role = id_family_role;

      const data = await this.memberFamilyRepository.save(memberFamily);
      return {
        message: 'Role assigned',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
