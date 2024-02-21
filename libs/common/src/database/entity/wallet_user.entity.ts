import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wallet_user')
export class WalletUser {
  @PrimaryGeneratedColumn()
  id_wallet: number;

  @Column('varchar', { nullable: true })
  name: string;

  @Column('money', { nullable: true })
  money: string;
}
