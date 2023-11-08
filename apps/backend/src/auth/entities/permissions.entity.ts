import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  ResourcesEntity,
  RolesPermissionsEntity,
} from '@backend/auth/entities';

@Entity('permissions')
export default class PermissionsEntity {
  @PrimaryGeneratedColumn('increment')
  permission_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  action: string;

  @Column({ type: 'int', nullable: true })
  resource_id: number;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'bool', nullable: false })
  is_active: boolean;

  @OneToMany(() => RolesPermissionsEntity, (rp) => rp.permission)
  role_permissions: RolesPermissionsEntity[];

  @ManyToOne(() => ResourcesEntity, (res) => res.permissions)
  resource: ResourcesEntity;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_at: Date | string;
}
