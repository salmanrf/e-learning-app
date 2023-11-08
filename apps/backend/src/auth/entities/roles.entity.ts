import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolesPermissionsEntity } from '.';

@Entity('roles')
export default class RolesEntity {
  @PrimaryGeneratedColumn('increment')
  role_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'bool', nullable: false })
  is_active: boolean;

  @OneToMany(() => RolesPermissionsEntity, (rp) => rp.role)
  role_permissions: RolesPermissionsEntity[];

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_at: Date | string;
}
