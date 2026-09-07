import { TableColumnType } from "antd";

import { ChipOptionsMapType } from "@/components/ChipView";
import { MaybePromiseReturnType } from "@/types/common.type";
import { DateFormatType } from "@/utils/helpers/date";
import { PaginationParamsType } from "@/utils/helpers/pagination";
import { QueryParamsType } from "@/utils/hooks/ApiCall";

export type CellContentType<T extends object> = T[keyof T] | string | number | boolean;

export const enum CellViewEnum {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  BOOLEAN = "boolean",
  CHIP = "chip",
  PAGINATED_INDEX = "paginatedIndex",
  ACTIONS = "actions",
}

export interface CommonCellViewDataType {
  type: CellViewEnum;
}

export interface TextCellViewDataType extends CommonCellViewDataType {
  type: CellViewEnum.TEXT;
}

export interface NumberCellViewDataType extends CommonCellViewDataType {
  type: CellViewEnum.NUMBER;
  showDecimals?: boolean | { decimalsUpto: number };
}

export interface DateCellViewDataType extends CommonCellViewDataType {
  type: CellViewEnum.DATE;
  format?: DateFormatType;
}

export interface BooleanCellViewDataType extends CommonCellViewDataType {
  type: CellViewEnum.BOOLEAN;
  labelTrue?: string;
  labelFalse?: string;
}

export interface ChipCellViewDataType extends CommonCellViewDataType {
  type: CellViewEnum.CHIP;
  optionsMap: ChipOptionsMapType<string>;
}

export interface PaginatedIndexCellViewDataType extends CommonCellViewDataType {
  type: CellViewEnum.PAGINATED_INDEX;
  paginationParams: Required<PaginationParamsType>;
}

export const enum CellActionTypeEnum {
  VIEW = "view",
  EDIT = "edit",
  DELETE = "delete",
}

export interface ActionsCellViewDataType extends CommonCellViewDataType {
  type: CellViewEnum.ACTIONS;
  actions?: { type: CellActionTypeEnum; icon: React.ReactNode }[];
}

export type CellViewDataType =
  | TextCellViewDataType
  | NumberCellViewDataType
  | DateCellViewDataType
  | BooleanCellViewDataType
  | ChipCellViewDataType
  | PaginatedIndexCellViewDataType
  | ActionsCellViewDataType;

export type CellActionEventType<T extends object> = (
  type: CellActionTypeEnum,
  record: T,
  index: number,
) => MaybePromiseReturnType;

export type CellViewProps<T extends object> = CellViewDataType & {
  loading?: boolean;
  text: CellContentType<T>;
  record: T;
  index: number;
  render?: (text: CellContentType<T>, record: T, index: number) => React.ReactNode;
  onAction?: CellActionEventType<T>;
};

export const enum ButtonActionTypeEnum {
  ADD = "add",
  IMPORT = "import",
  EXPORT = "export",
}

export interface TableButtonType {
  type: ButtonActionTypeEnum;
  label: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export type ButtonActionEventType = (type: ButtonActionTypeEnum) => MaybePromiseReturnType;

export interface TableButtonProps extends TableButtonType {
  onAction?: ButtonActionEventType;
}

// export type TableButtonLoadingType = Partial<Record<ButtonActionTypeEnum, boolean>>;

export type TableCardColumnType<T extends object> = TableColumnType<T> & {
  cellViewData?: CellViewDataType;
};

export const enum TableActionTypeEnum {
  PAGINATE = "paginate",
  SEARCH = "search",
  FILTER = "filter",
  SORT = "sort",
}

export type TableActionEventType<T extends object> = (
  type: TableActionTypeEnum,
  params: QueryParamsType<T>,
) => MaybePromiseReturnType;

export interface TableCardProps<T extends object> {
  title: string;
  buttonList?: TableButtonType[];
  onButtonAction?: ButtonActionEventType;
  columns: TableCardColumnType<T>[];
  loading?: boolean;
  data: T[];
  total?: number | null;
  searchPlaceholder?: string;
  params: QueryParamsType<T>;
  onTableAction?: TableActionEventType<T>;
  onCellAction?: CellActionEventType<T>;
}
