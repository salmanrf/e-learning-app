import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionsEntity } from '@backend/auth/entities';

@Entity('resources')
export default class ResourcesEntity {
  @PrimaryGeneratedColumn('increment')
  resource_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @ManyToOne(() => PermissionsEntity, (p) => p.resource)
  permissions: PermissionsEntity[];

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_at: Date | string;
}
