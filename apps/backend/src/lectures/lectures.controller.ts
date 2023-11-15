import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  Req,
} from '@nestjs/common';
import { Ability } from '@casl/ability';
import { Request } from 'express';

import { BaseApiResponse } from '@backend/dtos';
import { PoliciesGuard } from '@backend/guards';
import { CheckPolicies } from '@backend/decorators';
import LecturesService from './lectures.service';
import {
  CreateLectureDto,
  FindManyLecturesDto,
  UpdateLectureDto,
} from './dtos';

@Controller('/api/lectures')
export default class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can('create', 'lectures'))
  async create(
    @Req() req: Request,
    @Body() createLectureDto: CreateLectureDto,
  ) {
    try {
      createLectureDto.author_id = req['user_payload']['sub'];

      const lecture = await this.lecturesService.create(createLectureDto);

      return new BaseApiResponse({
        status: true,
        data: lecture,
        errors: null,
        message: 'Lecture created successfully',
        pagination: null,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':lecture_id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can('read', 'lectures'))
  async findOne(@Param('lecture_id') lecture_id: string) {
    try {
      const lecture = await this.lecturesService.findOne({ lecture_id });

      return new BaseApiResponse({
        status: true,
        data: lecture,
        errors: null,
        message: 'Lecture retrieved successfully',
        pagination: null,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can('read', 'lectures'))
  async findMany(@Query() dto: FindManyLecturesDto) {
    try {
      const { items, ...pagination } = await this.lecturesService.findMany(dto);

      return new BaseApiResponse({
        pagination,
        data: items,
        status: true,
        errors: null,
        message: 'Lectures retrieved successfully',
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':lecture_id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can('update', 'lectures'))
  async update(
    @Param('lecture_id') lecture_id: string,
    @Body() updateLectureDto: UpdateLectureDto,
  ) {
    try {
      const updated = await this.lecturesService.update(
        lecture_id,
        updateLectureDto,
      );

      return new BaseApiResponse({
        data: updated,
        status: true,
        message: 'Lecture updated successfully',
        errors: null,
        pagination: null,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete(':lecture_id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can('delete', 'lectures'))
  async remove(@Param('lecture_id') lecture_id: string) {
    try {
      const _ = await this.lecturesService.remove(lecture_id);

      return new BaseApiResponse({
        data: null,
        status: true,
        message: `Lecture ${lecture_id} removed successfully`,
        errors: null,
        pagination: null,
      });
    } catch (error) {
      throw error;
    }
  }
}
