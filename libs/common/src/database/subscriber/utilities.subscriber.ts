import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  Repository,
  // InsertEvent,
  // UpdateEvent,
} from 'typeorm';
import { Utilities } from '../entity/utilities.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { FinanceExpenditure } from '../entity/finance_expenditure.entity';
import { FinanceExpenditureType } from '../entity/finance_expenditure_type.entity';

@Injectable()
@EventSubscriber()
export class UtilitiesSubscriber
  implements EntitySubscriberInterface<Utilities>
{
  expenditureRepository: Repository<FinanceExpenditure>;
  expenditureTypeRepository: Repository<FinanceExpenditureType>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
    this.expenditureRepository =
      this.dataSource.getRepository(FinanceExpenditure);
    this.expenditureTypeRepository = this.dataSource.getRepository(
      FinanceExpenditureType,
    );
  }

  listenTo() {
    return Utilities;
  }

  // async afterInsert(event: InsertEvent<Utilities>): Promise<any> {
  //   const { entity, manager } = event;
  //   if (entity) {
  //     const queryRunner = manager.connection.createQueryRunner();
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();

  //     try {
  //       const expenditureType = await this.expenditureTypeRepository.findOne({
  //         where: {
  //           expense_type_name: 'Utilities',
  //           id_family: entity.id_family,
  //         },
  //       });

  //       if (!expenditureType) {
  //         throw new Error('Expenditure type "Utilities" not found');
  //       }

  //       const newExpenditure = this.expenditureRepository.create({
  //         id_family: entity.id_family,
  //         id_expenditure_type: expenditureType.id_expenditure_type,
  //         amount: entity.value,
  //         image_url: entity.image_url,
  //         description: entity.description,
  //         expenditure_date: entity.created_at,
  //         id_utility: entity.id_utility,
  //       });

  //       const savedExpenditure = await queryRunner.manager.save(newExpenditure);
  //       entity.id_expenditure = savedExpenditure.id_expenditure;

  //       await queryRunner.manager.save(entity);
  //       await queryRunner.commitTransaction();
  //     } catch (error) {
  //       await queryRunner.rollbackTransaction();
  //       throw error;
  //     } finally {
  //       await queryRunner.release();
  //     }
  //   }
  // }

  // async afterUpdate(event: UpdateEvent<Utilities>): Promise<any> {
  //   const { entity, databaseEntity, manager } = event;
  //   if (entity && databaseEntity) {
  //     const queryRunner = manager.connection.createQueryRunner();
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();

  //     try {
  //       const expenditure = await this.expenditureRepository.findOne({
  //         where: { id_expenditure: entity.id_expenditure },
  //       });

  //       if (expenditure) {
  //         expenditure.amount = entity.value;
  //         expenditure.image_url = entity.image_url;
  //         expenditure.description = entity.description;
  //         expenditure.expenditure_date = entity.created_at;

  //         await queryRunner.manager.save(expenditure);
  //       } else {
  //         const expenditureType = await this.expenditureTypeRepository.findOne({
  //           where: {
  //             expense_type_name: 'Utilities',
  //             id_family: entity.id_family,
  //           },
  //         });

  //         if (!expenditureType) {
  //           throw new Error('Expenditure type "Utilities" not found');
  //         }

  //         const newExpenditure = this.expenditureRepository.create({
  //           id_family: entity.id_family,
  //           id_expenditure_type: expenditureType.id_expenditure_type,
  //           amount: entity.value,
  //           image_url: entity.image_url,
  //           description: entity.description,
  //           expenditure_date: new Date(),
  //         });

  //         const savedExpenditure =
  //           await queryRunner.manager.save(newExpenditure);
  //         entity.id_expenditure = savedExpenditure.id_expenditure;

  //         await queryRunner.manager.save(entity);
  //       }

  //       await queryRunner.commitTransaction();
  //     } catch (error) {
  //       await queryRunner.rollbackTransaction();
  //       throw error;
  //     } finally {
  //       await queryRunner.release();
  //     }
  //   }
  // }
}
