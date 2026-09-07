// export type PageSizeType = 10 | 20 | 50;

export interface PaginationParamsType {
  page?: number;
  pageSize?: number;
}

export const defaultPageSize: NonNullable<PaginationParamsType["pageSize"]> = 12;

export const calculatePaginationRange = (
  page: PaginationParamsType["page"] = 1,
  pageSize: PaginationParamsType["pageSize"] = defaultPageSize,
): [number, number] => [(page - 1) * pageSize, page * pageSize - 1];
