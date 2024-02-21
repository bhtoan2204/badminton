import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity'; // Giả sử bạn đã định nghĩa entity User

@Entity('refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  refresh_token: string;

  @ManyToOne(() => User)
  @Column('uuid')
  id_user: string;

  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp')
  expired_at: Date;
}
