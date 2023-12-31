import { RolesEntity } from '@backend/auth/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export default class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'int', nullable: false })
  role_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  full_name: string;

  @ManyToOne(() => RolesEntity, (r) => r.role_id)
  @JoinColumn({ name: 'role_id' })
  role: RolesEntity;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_at: Date | string;
}
