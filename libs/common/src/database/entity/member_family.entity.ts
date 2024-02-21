import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity'; // Giả sử bạn đã định nghĩa entity này
import { Family } from './family.entity';

@Entity('member_family')
export class MemberFamily {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @Column('uuid')
  id_user: string;

  @ManyToOne(() => Family)
  @Column({ type: 'integer' })
  id_family: number;

  @Column('varchar', { nullable: true })
  role: string;
}
