import { HttpStatus, Injectable } from '@nestjs/common';
import { Brackets, EntityManager, Like, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { StorageService } from './storage/storage.service';
import {
  Family,
  FamilyExtraPackages,
  FamilyRoles,
  MemberFamily,
  PackageExtra,
  UploadFileRequest,
  Users,
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
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
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
      console.log(id_user, id_family);
      const memberFamily = await this.memberFamilyRepository.findOne({
        where: { id_user, id_family },
      });
      console.log(memberFamily);
      return !!memberFamily;
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getFamily(id_user: string, id_family: any) {
    try {
      const family = await this.familyRepository.findOne({
        where: { id_family },
        relations: ['users'],
      });
      return family;
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

  async getAllMember(id_user: string, id_family: number, search: string) {
    try {
      const query = this.memberFamilyRepository
        .createQueryBuilder('member')
        .leftJoinAndSelect('member.user', 'user')
        .leftJoinAndSelect('member.familyRoles', 'familyRoles')
        .where('member.id_family = :id_family', { id_family });

      if (search) {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('LOWER(user.firstname) ILIKE LOWER(:search)', {
              search: `%${search}%`,
            })
              .orWhere('LOWER(user.lastname) ILIKE LOWER(:search)', {
                search: `%${search}%`,
              })
              .orWhere('LOWER(user.email) ILIKE LOWER(:search)', {
                search: `%${search}%`,
              });
          }),
        );
      }

      const members = await query.getMany();

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

  async addMember(
    id_user: string,
    dto: { id_family: number; phone: string; gmail: string; role: number },
  ) {
    try {
      const { id_family, phone, gmail, role } = dto;
      const user = await this.usersRepository.findOne({
        where: { phone, email: gmail },
      });
      if (!user) {
        throw new RpcException({
          message: 'User not found or they are not verified phone and email',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const memberFamily = await this.memberFamilyRepository.findOne({
        where: { id_user: user.id_user, id_family },
      });
      if (memberFamily) {
        throw new RpcException({
          message: 'Member already in family',
          statusCode: HttpStatus.CONFLICT,
        });
      }
      const newMember = this.memberFamilyRepository.create({
        id_user: user.id_user,
        id_family,
        id_family_role: role,
      });
      await this.memberFamilyRepository.save(newMember);
      return {
        data: newMember,
        message: 'Member added',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateFamily(
    id_user: string,
    dto: { id_family: number; name: string; description: string },
  ) {
    try {
      const { id_family, name, description } = dto;
      const family = await this.familyRepository.findOne({
        where: { id_family },
      });
      if (!family) {
        throw new RpcException({
          message: 'Family not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (name) family.name = name;
      if (description) family.description = description;
      await this.familyRepository.save(family);
      return {
        message: 'Family updated',
        data: family,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteMember(none: string, member: any) {
    try {
      const { id_family, id_user } = member;
      const memberFamily = await this.memberFamilyRepository.findOne({
        where: { id_family, id_user },
      });
      if (!memberFamily) {
        throw new RpcException({
          message: 'Member not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.memberFamilyRepository.remove(memberFamily);
      return {
        message: 'Member deleted',
        data: true,
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
      const data = await this.memberFamilyRepository.find({
        where: { id_family },
        select: ['id_user'],
      });
      const ids = data.map((row) => row.id_user);
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
      const family = await this.familyRepository.findOne({
        where: { id_family },
      });
      if (family.owner_id === id_user) {
        throw new RpcException({
          message: 'Owner cannot leave family',
          statusCode: HttpStatus.FORBIDDEN,
        });
      }
      const memberFamily = await this.memberFamilyRepository.findOne({
        where: { id_user, id_family },
      });
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
      const [family, memberFamily] = await Promise.all([
        this.familyRepository.findOne({
          where: { id_family },
        }),
        this.memberFamilyRepository.findOne({
          where: { id_user: id_user_kick, id_family },
        }),
      ]);
      if (family.owner_id !== id_user) {
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

  async getAllRole(
    page: number,
    itemsPerPage: number,
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ) {
    const option = {
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
    };
    if (search) {
      option['where'] = [
        { role_name_vn: Like(`%${search}%`) },
        { role_name_en: Like(`%${search}%`) },
      ];
    }
    if (sortBy && sortDesc) {
      option['order'] = { [sortBy]: sortDesc ? 'DESC' : 'ASC' };
    }
    const [data, total] = await this.familyRolesRepository.findAndCount(option);
    return {
      data,
      total,
      message: 'Get roles successfully',
    };
  }

  async createRole(dto: { role_name_vn: string; role_name_en: string }) {
    try {
      const { role_name_vn, role_name_en } = dto;
      const newRole = this.familyRolesRepository.create({
        role_name_vn,
        role_name_en,
      });
      const data = await this.familyRolesRepository.save(newRole);
      return {
        message: 'Role created',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateRole(dto: {
    id_family_role: number;
    role_name_vn: string;
    role_name_en: string;
  }) {
    try {
      const { id_family_role, role_name_vn, role_name_en } = dto;
      const role = await this.familyRolesRepository.findOne({
        where: { id_family_role },
      });
      if (!role) {
        throw new RpcException({
          message: 'Role not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (dto.role_name_vn) role.role_name_vn = role_name_vn;
      if (dto.role_name_en) role.role_name_en = role_name_en;
      const data = await this.familyRolesRepository.save(role);
      return {
        message: 'Role updated',
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
