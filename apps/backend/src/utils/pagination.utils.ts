import { PaginationDto } from '@backend/dtos';

export function getPaginationParams(dto: PaginationDto) {
  const { page_number, page_size } = dto;

  const limit = +page_size;
  const offset = (+page_number < 1 ? 1 : page_number - 1) * page_size;

  return { limit, offset };
}

export function getPaginatedData<T>(
  findManyResults: [T[], number],
  pagination: PaginationDto,
): PaginationDto & { items: T[]; total_items: number } {
  const [items, count] = findManyResults;
  const { page_number, page_size, sort_field, sort_order } = pagination;

  return {
    total_items: count,
    page_number: +page_number,
    page_size: +page_size,
    items,
    sort_field,
    sort_order,
  };
}
