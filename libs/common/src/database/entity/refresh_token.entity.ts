import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity'; // Giả sử bạn đã định nghĩa entity User

@Entity('refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { select: false })
  refresh_token: string;

  @Column('uuid')
  id_user: string;

  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp')
  expired_at: Date;

  @ManyToOne(() => Users, (user) => user.refreshTokens, { nullable: false })
  @JoinColumn({ name: 'id_user' })
  user: Users;
}
