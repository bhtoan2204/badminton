import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Family } from './family.entity'; // Giả sử bạn đã định nghĩa entity Family

@Entity('calendar')
export class Calendar {
  @PrimaryGeneratedColumn()
  id_calendar: number;

  @Column({ type: 'timestamp' })
  datetime: Date;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ManyToOne(() => Family)
  @JoinColumn({ name: 'id_family' }) // Đặt tên cột khóa ngoại là id_wallet
  id_family: Family;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
