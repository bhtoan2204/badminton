import {
  EducationProgress,
  EducationStatus,
  GetUserRequest,
  GetUserResponse,
  Subjects,
} from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { UserService } from './user/user.service';

@Injectable()
export class EducationService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(EducationProgress)
    private educationProgressRepository: Repository<EducationProgress>,
    @InjectRepository(Subjects)
    private subjectsRepository: Repository<Subjects>,
    private readonly userService: UserService,
  ) {}

  async createEducationProgress(owner_id_user: string, dto: any) {
    try {
      const { id_family, id_user, title, progress_notes, school_info } = dto;
      const userReq: GetUserRequest = { idUser: id_user };
      const user: GetUserResponse = await this.userService.findOne(userReq);
      if (!user) {
        throw new RpcException({
          message: 'User not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }

      const newEducationProgress = new EducationProgress();
      newEducationProgress.id_family = id_family;
      newEducationProgress.id_user = id_user;
      newEducationProgress.title = title;
      newEducationProgress.progress_notes = progress_notes;
      newEducationProgress.school_info = school_info;
      await this.entityManager.save(newEducationProgress);
      return {
        message: 'Success',
        data: newEducationProgress,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllEducationProgress(none: string, dto: any) {
    try {
      const {
        page,
        itemsPerPage,
        search,
        id_family,
        id_user,
        sortBy,
        sortDirection,
      } = dto;
      const queryBuilder = this.educationProgressRepository
        .createQueryBuilder('educationProgress')
        .leftJoinAndSelect('educationProgress.subjects', 'subjects')
        .where('educationProgress.id_family = :id_family', { id_family })
        .skip((page - 1) * itemsPerPage)
        .take(itemsPerPage);
      if (search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('educationProgress.title LIKE :search', {
              search: `%${search}%`,
            })
              .orWhere('educationProgress.progress_notes LIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('educationProgress.school_info LIKE :search', {
                search: `%${search}%`,
              });
          }),
        );
      }
      if (id_user) {
        queryBuilder.andWhere('educationProgress.id_user = :member_id', {
          id_user,
        });
      }

      if (sortBy && sortDirection) {
        queryBuilder.orderBy(
          `educationProgress.${sortBy}`,
          sortDirection.toUpperCase() as 'ASC' | 'DESC',
        );
      }

      const [data, total] = await queryBuilder.getManyAndCount();
      const userIds = data.map((item) => item.id_user);
      const users = await this.userService.findByIds({ idUsers: userIds });
      const userEducationMap = {};
      users.users.forEach((user) => {
        userEducationMap[user.idUser] = user;
      });
      return {
        message: 'Success',
        data: data.map((item) => {
          const user = userEducationMap[item.id_user];
          let totalTargetScore = 0;
          let totalScore = 0;
          let totalMaximumScore = 0;
          let successfulSubjects = 0;
          const totalSubject = item.subjects.length;
          item.subjects.reduce((acc, curr) => {
            if (curr.component_scores) {
              curr.component_scores.forEach((component) => {
                totalTargetScore = acc + component.target_score;
                totalScore = acc + component.score;
                totalMaximumScore = acc + (component.maximum_score || 0);
                if (curr.status === EducationStatus.completed) {
                  successfulSubjects++;
                }
              });
            }
            return acc;
          }, 0);

          return {
            ...item,
            users: user,
            total_successful_subject: successfulSubjects,
            total_subjects: totalSubject,
            total_score: totalScore,
            total_target_score: totalTargetScore,
            total_maximum_score: totalMaximumScore,
          };
        }),
        total: total,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getDetailEducationProgress(
    id_user: string,
    id_family: number,
    id_education_progress: number,
  ) {
    try {
      const data = await this.educationProgressRepository.findOne({
        where: {
          id_family: id_family,
          id_education_progress: id_education_progress,
        },
        relations: ['subjects'],
      });

      if (!data) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      const userReq: GetUserRequest = { idUser: data.id_user };
      const user: GetUserResponse = await this.userService.findOne(userReq);
      data['users'] = {
        id_user: user.idUser,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
      };
      let totalTargetScore = 0;
      let totalScore = 0;
      let totalMaximumScore = 0;
      let successfulSubjects = 0;
      const totalSubject = data.subjects.length;
      data.subjects.reduce((acc, curr) => {
        if (curr.component_scores) {
          curr.component_scores.forEach((component) => {
            totalTargetScore = acc + component.target_score;
            totalScore = acc + component.score;
            totalMaximumScore = acc + (component.maximum_score || 0);
            if (curr.status === EducationStatus.completed) {
              successfulSubjects++;
            }
          });
        }
        return acc;
      }, 0);

      return {
        message: 'Success',
        data: data,
        total_subject: totalSubject,
        total_successful_subject: successfulSubjects,
        total_score: totalScore,
        total_target_score: totalTargetScore,
        total_maximum_score: totalMaximumScore,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateDetailEducationProgress(id_user: string, dto: any) {
    try {
      const {
        id_education_progress,
        id_family,
        title,
        progress_notes,
        school_info,
      } = dto;
      const educationProgress = await this.educationProgressRepository.findOne({
        where: {
          id_education_progress: id_education_progress,
          id_family: id_family,
        },
      });
      if (!educationProgress) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      if (title) {
        educationProgress.title = title;
      }
      if (progress_notes) {
        educationProgress.progress_notes = progress_notes;
      }
      if (school_info) {
        educationProgress.school_info = school_info;
      }
      const updatedData = await this.entityManager.save(educationProgress);
      return {
        message: 'Success',
        data: updatedData,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteEducationProgress(
    id_user: string,
    id_family: number,
    id_education_progress: number,
  ) {
    try {
      const educationProgress = await this.educationProgressRepository.findOne({
        where: {
          id_education_progress: id_education_progress,
          id_family: id_family,
        },
      });
      if (!educationProgress) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      await this.entityManager.remove(educationProgress);
      return {
        message: 'Success',
        data: true,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createSubject(id_user: string, dto: any) {
    try {
      const { id_education_progress, id_family, subject_name, description } =
        dto;
      const educationProgress = await this.educationProgressRepository.findOne({
        where: {
          id_education_progress: id_education_progress,
          id_family: id_family,
        },
      });
      if (!educationProgress) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }

      const newSubject = new Subjects();
      newSubject.id_education_progress = id_education_progress;
      newSubject.subject_name = subject_name;
      newSubject.description = description;
      const data = await this.entityManager.save(newSubject);

      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getDetailSubject(
    id_user: string,
    id_family: number,
    id_education_progress: number,
    id_subject: number,
  ) {
    try {
      const educationProgress = await this.educationProgressRepository.findOne({
        where: {
          id_family: id_family,
          id_education_progress: id_education_progress,
        },
      });
      if (!educationProgress) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      const data = await this.subjectsRepository.findOne({
        where: {
          id_subject: id_subject,
          id_education_progress: id_education_progress,
        },
      });
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateDetailSubject(id_user: string, dto: any) {
    try {
      const {
        id_subject,
        id_education_progress,
        id_family,
        subject_name,
        description,
      } = dto;
      const educationProgress = await this.educationProgressRepository.findOne({
        where: {
          id_family: id_family,
          id_education_progress: id_education_progress,
        },
      });
      if (!educationProgress) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      const subject = await this.subjectsRepository.findOne({
        where: {
          id_subject: id_subject,
          id_education_progress: id_education_progress,
        },
      });
      if (!subject) {
        throw new RpcException({
          message: 'Subject not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      if (subject_name) {
        subject.subject_name = subject_name;
      }
      if (description) {
        subject.description = description;
      }
      const data = await this.entityManager.save(subject);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteSubject(
    id_user: string,
    id_family: number,
    id_education_progress: number,
    id_subject: number,
  ) {
    try {
      const educationProgress = await this.educationProgressRepository.findOne({
        where: {
          id_family: id_family,
          id_education_progress: id_education_progress,
        },
      });
      if (!educationProgress) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      const subject = await this.subjectsRepository.findOne({
        where: {
          id_subject: id_subject,
          id_education_progress: id_education_progress,
        },
      });
      if (!subject) {
        throw new RpcException({
          message: 'Subject not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      await this.entityManager.remove(subject);
      return {
        message: 'Success',
        data: true,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async addComponentScore(
    id_user: string,
    dto: {
      id_subject: number;
      id_education_progress: number;
      id_family: number;
      component_scores: {
        id_subject: number;
        id_education_progress: number;
        id_family: number;
        component_name: string;
        score: number;
        target_score: number;
        maximum_score: number;
      }[];
    },
  ) {
    const { id_subject, id_education_progress, id_family, component_scores } =
      dto;
    try {
      const education_progress = await this.educationProgressRepository.findOne(
        {
          where: {
            id_family: id_family,
            id_education_progress: id_education_progress,
          },
        },
      );
      if (!education_progress) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      const subject = await this.subjectsRepository.findOne({
        where: {
          id_subject: id_subject,
          id_education_progress: id_education_progress,
        },
      });
      if (!subject) {
        throw new RpcException({
          message: 'Subject not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      const component_scores_arr = component_scores.map((item) => {
        return {
          component_name: item.component_name,
          score: item.score | 0,
          target_score: item.target_score,
          maximum_score: item.maximum_score,
          created_at: new Date(),
          updated_at: new Date(),
        };
      });
      if (component_scores_arr.length > 0) {
        if (subject.component_scores === null) {
          subject.component_scores = component_scores_arr;
        } else {
          subject.component_scores =
            subject.component_scores.concat(component_scores_arr);
        }
      }
      const data = await this.entityManager.save(subject);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async insertComponentScore(id_user: string, dto: any) {
    const {
      id_subject,
      id_education_progress,
      id_family,
      component_name,
      score,
      target_score,
      maximum_score,
      index,
    } = dto;
    try {
      const education_progress = await this.educationProgressRepository.findOne(
        {
          where: {
            id_family: id_family,
            id_education_progress: id_education_progress,
          },
        },
      );
      if (!education_progress) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      const subject = await this.subjectsRepository.findOne({
        where: {
          id_subject: id_subject,
          id_education_progress: id_education_progress,
        },
      });
      if (!subject) {
        throw new RpcException({
          message: 'Subject not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      const component_scores = {
        component_name: component_name,
        score: score | 0,
        target_score: target_score,
        maximum_score: maximum_score,
        created_at: new Date(),
        updated_at: new Date(),
      };

      if (index < 0 || index > subject.component_scores.length) {
        throw new RpcException({
          message: 'Index out of range',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      if (subject.component_scores === null) {
        subject.component_scores = [component_scores];
      } else subject.component_scores.splice(index, 0, component_scores);

      const data = await this.entityManager.save(subject);

      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateComponentScore(id_user: string, dto: any) {
    const {
      index,
      id_subject,
      id_education_progress,
      id_family,
      component_name,
      score,
      target_score,
      maximum_score,
    } = dto;
    try {
      const education_progress = await this.educationProgressRepository.findOne(
        {
          where: {
            id_family: id_family,
            id_education_progress: id_education_progress,
          },
        },
      );
      if (!education_progress) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      const subject = await this.subjectsRepository.findOne({
        where: {
          id_subject: id_subject,
          id_education_progress: id_education_progress,
        },
      });
      if (!subject) {
        throw new RpcException({
          message: 'Subject not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      if (subject.component_scores === null) {
        throw new RpcException({
          message: 'Component scores not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      if (index < 0 || index >= subject.component_scores.length) {
        throw new RpcException({
          message: 'Index out of range',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      subject.component_scores[index] = {
        component_name:
          component_name || subject.component_scores[index].component_name,
        score: score || subject.component_scores[index].score,
        target_score: target_score,
        maximum_score:
          maximum_score || subject.component_scores[index].maximum_score,
        created_at: subject.component_scores[index].created_at,
        updated_at: new Date(),
      };
      const data = await this.entityManager.save(subject);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteComponentScore(id_user: string, dto: any) {
    const { id_subject, id_family, id_education_progress, index } = dto;
    try {
      const education_progress = await this.educationProgressRepository.findOne(
        {
          where: {
            id_family: id_family,
            id_education_progress: id_education_progress,
          },
        },
      );
      if (!education_progress) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      const subject = await this.subjectsRepository.findOne({
        where: {
          id_subject: id_subject,
          id_education_progress: id_education_progress,
        },
      });
      if (!subject) {
        throw new RpcException({
          message: 'Subject not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      if (subject.component_scores === null) {
        throw new RpcException({
          message: 'Component scores not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      if (index < 0 || index >= subject.component_scores.length) {
        throw new RpcException({
          message: 'Index out of range',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      subject.component_scores.splice(index, 1);
      const data = await this.entityManager.save(subject);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async changeStatus(id_user: string, dto: any) {
    const { id_subject, id_education_progress, id_family, status } = dto;
    try {
      const education_progress = await this.educationProgressRepository.findOne(
        {
          where: {
            id_family: id_family,
            id_education_progress: id_education_progress,
          },
        },
      );
      if (!education_progress) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      const subject = await this.subjectsRepository.findOne({
        where: {
          id_subject: id_subject,
          id_education_progress: id_education_progress,
        },
      });
      if (!subject) {
        throw new RpcException({
          message: 'Subject not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      subject.status = status;
      const data = await this.entityManager.save(subject);
      return {
        message: 'Success',
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
