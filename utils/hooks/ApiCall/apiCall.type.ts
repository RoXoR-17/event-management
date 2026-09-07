import { PaginationParamsType } from "@/utils/helpers/pagination";
import { SortOrder } from "antd/es/table/interface";

export type FilterParamsType<T extends object> = Partial<Record<keyof T, string[]>>;

export type SortParamsType<T extends object> = Partial<Record<keyof T, NonNullable<SortOrder>>>;

export interface QueryParamsType<T extends object> extends PaginationParamsType {
  searchValue?: string;
  filters?: FilterParamsType<T>;
  sorts?: SortParamsType<T>;
}

export type QueryResponseType<T extends object> = Promise<{
  total: number | null;
  data: T[];
}>;

export type DeleteQueryParamsType<T extends object = object> = T & {
  id: string;
};
