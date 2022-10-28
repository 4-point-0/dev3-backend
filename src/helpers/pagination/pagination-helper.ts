import { PaginatedDto } from '../../common/pagination/paginated-dto';

export const toPage = async <TModel>(
  query: any,
  queryCount: any,
  offset?: number,
  limit?: number,
): Promise<PaginatedDto<TModel>> => {
  const _offset = offset && offset > 0 ? offset : 0;
  const _limit = limit && limit > 0 ? limit : 0;

  const items = await query.populate('owner').skip(offset).limit(limit).exec();

  return {
    total: await queryCount.exec(),
    offset: _offset,
    limit: _limit,
    results: items,
  };
};
