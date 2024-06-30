import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('family_roles')
export class FamilyRoles {
  @PrimaryGeneratedColumn()
  id_family_role: number;

  @Column({ nullable: false })
  role_name_vn: string;

  @Column({ nullable: false })
  role_name_en: string;
}
