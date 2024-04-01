import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Users } from './users.entity'; // Giả sử bạn đã định nghĩa entity User

@Entity('refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  refresh_token: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'id_user' })
  id_user: Users;

  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp')
  expired_at: Date;
}
