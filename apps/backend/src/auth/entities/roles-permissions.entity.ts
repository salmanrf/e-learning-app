import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { PermissionsEntity, RolesEntity } from '@backend/auth/entities';

@Entity('roles_permissions')
export default class RolesPermissionsEntity {
  @PrimaryColumn({ type: 'int', nullable: false })
  role_id: number;

  @PrimaryColumn({ type: 'int', nullable: false })
  permission_id: number;

  @ManyToOne(() => RolesEntity, (r) => r.role_permissions)
  @JoinColumn({ name: 'role_id' })
  role: RolesEntity;

  @ManyToOne(() => PermissionsEntity, (r) => r.role_permissions)
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionsEntity;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date | string;
}
