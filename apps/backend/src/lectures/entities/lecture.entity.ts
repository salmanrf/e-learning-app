import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('lectures')
export default class Lecture {
  @PrimaryGeneratedColumn('uuid')
  lecture_id: string;

  @Column({ type: 'uuid', nullable: false })
  author_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 25, nullable: false })
  type: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_at: Date | string;

  @DeleteDateColumn({ type: 'timestamp without time zone' })
  deleted_at: Date | string;
}
