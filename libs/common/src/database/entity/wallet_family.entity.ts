import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wallet_family')
export class WalletFamily {
  @PrimaryGeneratedColumn()
  id_wallet: number;

  @Column('varchar', { nullable: true })
  name: string;

  @Column('money', { nullable: true })
  money: string;
}
