import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { getPaginatedData, getPaginationParams } from '@backend/utils';
import {
  CreateLectureDto,
  FindManyLecturesDto,
  UpdateLectureDto,
} from './dtos';
import { LecturesEntity } from './entities';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export default class LecturesService {
  constructor(
    @InjectRepository(LecturesEntity)
    private readonly lecturesRepo: Repository<LecturesEntity>,
  ) {}

  async create(createLectureDto: CreateLectureDto) {
    try {
      const newLecture = await this.lecturesRepo.save(createLectureDto);

      return newLecture;
    } catch (error) {
      throw error;
    }
  }

  async findOne(criteria: FindOptionsWhere<LecturesEntity>) {
    try {
      const lecture = await this.lecturesRepo.findOne({ where: criteria });

      return lecture;
    } catch (error) {
      throw error;
    }
  }

  async findMany(dto: FindManyLecturesDto) {
    try {
      const { author_id, content, title, ...pagination } = dto;

      const { limit, offset } = getPaginationParams(pagination);

      const lectureQb = this.lecturesRepo.createQueryBuilder('l');

      if (author_id) {
        lectureQb.andWhere('l.author_id != :author_id', { author_id });
      }

      if (title) {
        lectureQb.andWhere('l.title ILIKE :title', { title: `%${title}%` });
      }

      if (content) {
        lectureQb.andWhere('l.content ILIKE :content', {
          content: `%${content}%`,
        });
      }

      let { sort_field, sort_order } = pagination;

      if (!sort_field) {
        sort_field = 'l.created_at';
      } else {
        sort_field = 'l.' + sort_field;
      }

      if (!['DESC', 'ASC'].includes(sort_order)) {
        sort_order = 'DESC';
      }

      lectureQb.take(limit);
      lectureQb.skip(offset);
      lectureQb.orderBy(sort_field, sort_order);

      const results = await lectureQb.getManyAndCount();

      const data = getPaginatedData(results, {
        ...pagination,
        sort_field,
        sort_order,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async update(lecture_id: string, updateLectureDto: UpdateLectureDto) {
    try {
      const lecture = await this.findOne({ lecture_id });

      if (!lecture) {
        throw new NotFoundException(
          `Can't find lecture with id: ${lecture_id}`,
        );
      }

      const { title, type, content } = updateLectureDto;

      if (title != null) {
        lecture.title = title;
      }

      if (type != null) {
        lecture.type = type;
      }

      if (content != null) {
        lecture.content = content;
      }

      const updatedLecture = await this.lecturesRepo.save(lecture);

      return updatedLecture;
    } catch (error) {
      throw error;
    }
  }

  async remove(lecture_id: string) {
    try {
      const _ = await this.lecturesRepo.softDelete({ lecture_id });

      return lecture_id;
    } catch (error) {
      throw error;
    }
  }
}
