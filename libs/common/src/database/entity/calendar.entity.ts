import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Family } from './family.entity'; // Giả sử bạn đã định nghĩa entity Family

@Entity('calendar')
export class Calendar {
  @PrimaryGeneratedColumn()
  id_calendar: number;

  @Column('timestamp')
  datetime: Date;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => Family, (family) => family.id_family)
  @Column({ type: 'integer' })
  id_family: number;
}
