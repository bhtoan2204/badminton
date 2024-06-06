import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { EntityManager } from 'typeorm';

@Injectable()
export class DataStatsService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async getPostgresqlStat() {
    try {
      const [table_size, active_sessions] = await Promise.all([
        this.entityManager.query(
          `SELECT * FROM analyze_and_query_table_sizes()`,
        ),
        this.entityManager.query(
          'SELECT * FROM get_active_sessions_defaultdb()',
        ),
      ]);

      return {
        table_size: table_size,
        active_sessions: active_sessions,
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Failed to retrieve database statistics: ${error.message}`,
      });
    }
  }

  async getMongooseStat() {
    try {
      const db = this.connection.db;
      const collectionStats = [];
      const collections = await db.collections();
      for (const collectionInfo of collections) {
        const stats = await db.command({
          collStats: collectionInfo.collectionName,
          scale: 1,
          verbose: false,
        });
        delete stats.indexDetails;
        collectionStats.push(stats);
      }

      return collectionStats;
    } catch (error) {
      throw new RpcException({
        status: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || `Failed to retrieve database statistics`,
      });
    }
  }
}
