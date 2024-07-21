import { EducationProgress, Subjects } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, Repository } from 'typeorm';

@Injectable()
export class EducationService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(EducationProgress)
    private educationProgressRepository: Repository<EducationProgress>,
    @InjectRepository(Subjects)
    private subjectsRepository: Repository<Subjects>,
  ) {}

  async createEducationProgress(owner_id_user: string, dto: any) {
    try {
      const { id_family, id_user, title, progress_notes, school_info } = dto;
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

  async getAllEducationProgress(
    id_user: string,
    pageNumber: number,
    itemsPerPage: number,
    id_family: number,
    search: string,
    member_id: string,
  ) {
    try {
      const queryBuilder = this.educationProgressRepository
        .createQueryBuilder('educationProgress')
        .leftJoinAndSelect('educationProgress.subjects', 'subjects')
        .leftJoinAndSelect('educationProgress.user', 'user')
        .where('educationProgress.id_family = :id_family', { id_family })
        .skip((pageNumber - 1) * itemsPerPage)
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
      if (member_id) {
        queryBuilder.andWhere('educationProgress.id_user = :member_id', {
          member_id,
        });
      }

      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        message: 'Success',
        data: data,
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
        relations: ['subjects', 'user'],
      });

      if (!data) {
        throw new RpcException({
          message: 'Education progress not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
      data.subjects.sort((a, b) => a.id_subject - b.id_subject);
      const [successfulSubjects, totalSubject] = data.subjects.reduce(
        (acc, curr) => {
          if (curr.status === 'successful') {
            acc[0]++;
          }
          acc[1]++;
          return acc;
        },
        [0, 0],
      );

      return {
        message: 'Success',
        data: data,
        total_subject: totalSubject,
        successful_subject: successfulSubjects,
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

  async addComponentScore(id_user: string, dto: any) {
    const {
      id_subject,
      id_education_progress,
      id_family,
      component_name,
      score,
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
        score: score,
      };
      if (subject.component_scores === null) {
        subject.component_scores = [component_scores];
      } else {
        subject.component_scores.push(component_scores);
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
        score: score,
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
        component_name: component_name,
        score: score,
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

  async modifyScore(id_user: string, dto: any) {
    const {
      id_subject,
      id_education_progress,
      id_family,
      midterm_score,
      final_score,
      bonus_score,
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

      if (midterm_score) {
        subject.midterm_score = midterm_score;
      }
      if (final_score) {
        subject.final_score = final_score;
      }
      if (bonus_score) {
        subject.bonus_score = bonus_score;
      }
      const data = await this.entityManager.save(subject);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async removeScore(id_user: string, dto: any) {
    const { id_subject, id_family, id_education_progress, score_name } = dto;
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
      if (score_name === 'midterm_score') {
        subject.midterm_score = null;
      } else if (score_name === 'final_score') {
        subject.final_score = null;
      } else if (score_name === 'bonus_score') {
        subject.bonus_score = null;
      } else {
        throw new RpcException({
          message: 'Score name not found',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
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
