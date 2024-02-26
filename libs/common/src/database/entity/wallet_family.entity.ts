import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('wallet_family')
export class WalletFamily {
  @PrimaryGeneratedColumn()
  id_wallet: number;

  @Column('varchar', { nullable: true })
  name: string;

  @Column('money', { nullable: true })
  money: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
