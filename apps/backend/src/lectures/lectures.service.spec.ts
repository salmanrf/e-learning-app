import { Test, TestingModule } from '@nestjs/testing';
import LecturesService from './lectures.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LecturesEntity } from '@backend/lectures/entities';
import {
  CreateLectureDto,
  FindManyLecturesDto,
  UpdateLectureDto,
} from '@backend/lectures/dtos';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedData } from '@backend/dtos';
import {
  getPaginatedData,
  getPaginationParams,
} from '@backend/utils/pagination.utils';

jest.mock('@backend/utils/pagination.utils', () => ({
  __esModule: true,
  getPaginatedData: jest.fn(),
  getPaginationParams: jest.fn(),
}));

describe('Lectures Service', () => {
  describe('Create Lecture', () => {
    let lecturesService: LecturesService;
    let mockLecturesRepo: Record<string, jest.Mock> = {};

    beforeEach(async () => {
      mockLecturesRepo = {
        save: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          LecturesService,
          {
            provide: getRepositoryToken(LecturesEntity),
            useValue: mockLecturesRepo,
          },
        ],
      }).compile();

      lecturesService = module.get<LecturesService>(LecturesService);
    });

    it('Should return a lecture when succeeded', async () => {
      // * Arrange
      const lecture: LecturesEntity = {
        author_id: '123',
        lecture_id: '456',
        title: 'How to cook',
        content: 'Lorem Ipsum',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        type: 'lecture',
      };

      const dto: CreateLectureDto = {
        author_id: '123',
        title: 'How to cook',
        content: 'Lorem Ipsum',
        type: 'lecture',
      };

      mockLecturesRepo.save.mockResolvedValueOnce(lecture);

      // * Act
      const created = await lecturesService.create(dto);

      // * Assert
      expect(created).toStrictEqual(lecture);
    });

    it('Should throw 500 error when unexpected error is encountered', async () => {
      // * Arrange
      mockLecturesRepo.save.mockRejectedValue(new Error('Unexpected error'));

      const dto = {} as CreateLectureDto;

      // * Act
      const createLecture = async () => await lecturesService.create(dto);

      // * Assert
      expect(createLecture).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      expect(createLecture).rejects.toStrictEqual(
        new InternalServerErrorException('Internal server error'),
      );
    });
  });

  describe('Find One', () => {
    let lecturesService: LecturesService;
    let mockLecturesRepo: Record<string, jest.Mock> = {};

    beforeEach(async () => {
      mockLecturesRepo = {
        findOne: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          LecturesService,
          {
            provide: getRepositoryToken(LecturesEntity),
            useValue: mockLecturesRepo,
          },
        ],
      }).compile();

      lecturesService = module.get<LecturesService>(LecturesService);
    });

    it('Should return a lecture if found', async () => {
      const lecture: LecturesEntity = {
        author_id: '123',
        lecture_id: '456',
        title: 'How to cook',
        content: 'Lorem Ipsum',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        type: 'lecture',
      };

      const criteria = { lecture_id: '456' };

      mockLecturesRepo.findOne.mockResolvedValueOnce(lecture);

      const found = await lecturesService.findOne(criteria);

      expect(found).toBe(lecture);
    });

    it('Should return null if no lecture is found', async () => {
      mockLecturesRepo.findOne.mockResolvedValueOnce(null);

      const found = await lecturesService.findOne({});

      expect(found).toBeNull();
    });

    it('Should throw 500 error when unexpected error is encountered', async () => {
      // * Arrange
      mockLecturesRepo.findOne.mockRejectedValue(new Error('Unexpected error'));

      // * Act
      const findOne = async () => await lecturesService.findOne({});

      // * Assert
      expect(findOne).rejects.toBeInstanceOf(InternalServerErrorException);
      expect(findOne).rejects.toStrictEqual(
        new InternalServerErrorException('Internal server error'),
      );
    });
  });

  describe('Find Many', () => {
    let lecturesService: LecturesService;
    let mockLecturesRepo: Record<string, jest.Mock> = {};
    let getManyAndCountMock: jest.Mock;
    let andWhereMock: jest.Mock;
    let orderByMock: jest.Mock;
    let takeMock: jest.Mock;
    let skipMock: jest.Mock;

    beforeEach(async () => {
      mockLecturesRepo = {
        createQueryBuilder: jest.fn(),
      };

      getManyAndCountMock = jest.fn();
      andWhereMock = jest.fn();
      orderByMock = jest.fn();
      takeMock = jest.fn();
      skipMock = jest.fn();

      mockLecturesRepo.createQueryBuilder.mockImplementationOnce(function () {
        this.andWhere = andWhereMock.mockReturnThis();
        this.take = takeMock;
        this.skip = skipMock;
        this.orderBy = orderByMock;
        this.getManyAndCount = getManyAndCountMock;

        return this;
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          LecturesService,
          {
            provide: getRepositoryToken(LecturesEntity),
            useValue: mockLecturesRepo,
          },
        ],
      }).compile();

      lecturesService = module.get<LecturesService>(LecturesService);
    });

    it('Should return results from paginated data', async () => {
      const results: [Partial<LecturesEntity>[], number] = [
        [{ lecture_id: '123' }, { lecture_id: '456' }, { lecture_id: '789' }],
        10,
      ];

      getManyAndCountMock.mockResolvedValueOnce(results);

      const dto: FindManyLecturesDto = {
        title: 'How to cook',
        author_id: '123',
        page_number: 1,
        page_size: 10,
        sort_field: 'created_at',
        sort_order: 'DESC',
      };

      const paginatedResult = {} as PaginatedData<any>;

      (getPaginationParams as jest.Mock).mockReturnValueOnce({
        limit: 10,
        offset: 0,
      });
      (getPaginatedData as jest.Mock).mockReturnValueOnce(paginatedResult);

      const result = await lecturesService.findMany(dto);

      expect(result).toStrictEqual(paginatedResult);
    });

    it('Should use search parameters correctly 1/3', async () => {
      const dto: FindManyLecturesDto = {
        title: 'How to cook',
        author_id: '123',
        page_number: 1,
        page_size: 10,
        sort_field: 'created_at',
        sort_order: 'DESC',
      };

      getManyAndCountMock.mockResolvedValueOnce('ok');
      (getPaginationParams as jest.Mock).mockReturnValueOnce({});
      (getPaginatedData as jest.Mock).mockReturnValueOnce('ok');

      const result = await lecturesService.findMany(dto);

      expect(result).toBe('ok');
      expect(andWhereMock).toHaveBeenCalledWith('l.author_id != :author_id', {
        author_id: dto.author_id,
      });
      expect(andWhereMock).toHaveBeenCalledWith('l.title ILIKE :title', {
        title: `%${dto.title}%`,
      });
    });

    it('Should use search parameters correctly 2/3', async () => {
      const dto = {
        content: 'To cook or not to cook',
        page_number: 1,
        page_size: 10,
      } as FindManyLecturesDto;

      getManyAndCountMock.mockResolvedValueOnce('ok');
      (getPaginationParams as jest.Mock).mockReturnValueOnce({});
      (getPaginatedData as jest.Mock).mockReturnValueOnce('ok');

      const result = await lecturesService.findMany(dto);

      expect(result).toBe('ok');
      expect(andWhereMock).toHaveBeenCalledWith('l.content ILIKE :content', {
        content: `%${dto.content}%`,
      });
      expect(orderByMock).toHaveBeenCalledWith('l.created_at', 'DESC');
    });

    it('Should use search parameters correctly 3/3', async () => {
      const dto = {
        sort_field: 'title',
      } as FindManyLecturesDto;

      getManyAndCountMock.mockResolvedValueOnce('ok');
      (getPaginationParams as jest.Mock).mockReturnValueOnce({});
      (getPaginatedData as jest.Mock).mockReturnValueOnce('ok');

      const result = await lecturesService.findMany(dto);

      expect(result).toBe('ok');
      expect(orderByMock).toHaveBeenCalledWith('l.title', 'DESC');
      expect(takeMock).toHaveBeenCalledWith(undefined);
      expect(skipMock).toHaveBeenCalledWith(undefined);
    });

    it('Should throw 500 error when unexpected error is encountered', async () => {
      getManyAndCountMock.mockRejectedValue(new Error('Unexpected error'));

      const findMany = async () =>
        await lecturesService.findMany({} as FindManyLecturesDto);

      // * Assert
      expect(findMany).rejects.toBeInstanceOf(InternalServerErrorException);
      expect(findMany).rejects.toStrictEqual(
        new InternalServerErrorException('Internal server error'),
      );
    });
  });

  describe('Update One', () => {
    let lecturesService: LecturesService;
    let lecturesRepoMock: Record<string, jest.Mock>;
    let findOneMock: jest.Mock;
    let saveMock: jest.Mock;

    beforeEach(async () => {
      saveMock = jest.fn();
      findOneMock = jest.fn();

      lecturesRepoMock = {
        save: saveMock,
      };

      const module = await Test.createTestingModule({
        providers: [
          LecturesService,
          {
            provide: getRepositoryToken(LecturesEntity),
            useValue: lecturesRepoMock,
          },
        ],
      }).compile();

      lecturesService = module.get<LecturesService>(LecturesService);
    });

    it('Should update the lecture with provided values', async () => {
      const lecture: Partial<LecturesEntity> = {
        author_id: '123',
        lecture_id: '456',
        title: 'How to eat',
        type: 'text',
        content: 'To cook or not to cook',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const dto = {
        title: 'How to cook',
        type: 'video',
      };

      const expectedUpdate = {
        ...lecture,
        title: dto.title,
        type: dto.type,
      };

      findOneMock.mockResolvedValueOnce(lecture);
      saveMock.mockResolvedValueOnce('ok');

      lecturesService.findOne = findOneMock;

      const updated = await lecturesService.update('456', dto);

      expect(updated).toBe('ok');
      expect(saveMock).toHaveBeenCalledWith(expectedUpdate);
    });

    it('Should update only allowed properties', async () => {
      const lecture: Partial<LecturesEntity> = {
        author_id: '123',
        lecture_id: '456',
        title: 'How to eat',
        type: 'text',
        content: 'To cook or not to cook',
      };

      const dto = {
        lecture_id: '999999',
        created_at: new Date(),
      };

      const expectedUpdate = {
        ...lecture,
      };

      findOneMock.mockResolvedValueOnce(lecture);
      saveMock.mockResolvedValueOnce('ok');

      lecturesService.findOne = findOneMock;

      const updated = await lecturesService.update(
        '456',
        dto as UpdateLectureDto,
      );

      expect(updated).toBe('ok');
      expect(saveMock).toHaveBeenCalledWith(expectedUpdate);
    });

    it('Should throw 404 Error when lecture is not found', async () => {
      const lecture_id = '123';
      const expectedError = new NotFoundException(
        `Can't find lecture with id: ${lecture_id}`,
      );

      findOneMock.mockResolvedValueOnce(null);

      lecturesService.findOne = findOneMock;

      const updateOne = async () =>
        await lecturesService.update('123', {} as UpdateLectureDto);

      expect(updateOne).rejects.toBeInstanceOf(NotFoundException);
      expect(updateOne).rejects.toStrictEqual(expectedError);
    });

    it('Should throw 500 error when unexpected error is encountered', async () => {
      const expectedError = new InternalServerErrorException(
        `Internal server error`,
      );

      findOneMock.mockRejectedValue(new Error('Unexpected error'));

      lecturesService.findOne = findOneMock;

      const updateOne = async () =>
        await lecturesService.update('123', {} as UpdateLectureDto);

      expect(updateOne).rejects.toBeInstanceOf(InternalServerErrorException);
      expect(updateOne).rejects.toStrictEqual(expectedError);
    });
  });

  describe('Remove One', () => {
    let lecturesService: LecturesService;
    let lecturesRepoMock: Record<string, jest.Mock>;
    let softDeleteMock: jest.Mock;

    beforeEach(async () => {
      softDeleteMock = jest.fn();

      lecturesRepoMock = {
        softDelete: softDeleteMock,
      };

      const module = await Test.createTestingModule({
        providers: [
          LecturesService,
          {
            provide: getRepositoryToken(LecturesEntity),
            useValue: lecturesRepoMock,
          },
        ],
      }).compile();

      lecturesService = module.get<LecturesService>(LecturesService);
    });

    it("Should return with lecture's id if successful", async () => {
      const expected = '123';

      softDeleteMock.mockResolvedValueOnce({});

      const removed = await lecturesService.remove('123');

      expect(removed).toBe(expected);
      expect(softDeleteMock).toHaveBeenCalledWith({ lecture_id: expected });
    });

    it('Should throw 500 error when unexpected error is encountered', async () => {
      const expectedError = new InternalServerErrorException(
        `Internal server error`,
      );

      softDeleteMock.mockRejectedValue(new Error('Unexpected error'));

      const updateOne = async () => await lecturesService.remove('123');

      expect(updateOne).rejects.toBeInstanceOf(InternalServerErrorException);
      expect(updateOne).rejects.toStrictEqual(expectedError);
    });
  });
});
