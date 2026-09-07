import { DatePickerProps, FormItemProps, FormProps, SelectProps } from "antd";

import { DateFormatType } from "@/utils/helpers/date";

export enum FieldTypeEnum {
  TEXT_INPUT = "textInput",
  NUMBER_INPUT = "numberInput",
  SELECT = "select",
  DATE = "date",
}

export interface CommonFieldDataType {
  type: FieldTypeEnum;
}

export interface InputFieldDataType extends CommonFieldDataType {
  type: FieldTypeEnum.TEXT_INPUT;
  placeholder?: string;
  multiline?: boolean;
}

export interface NumberFieldDataType extends CommonFieldDataType {
  type: FieldTypeEnum.NUMBER_INPUT;
  placeholder?: string;
}

export interface SelectFieldDataType extends CommonFieldDataType {
  type: FieldTypeEnum.SELECT;
  options: NonNullable<SelectProps["options"]>;
  placeholder?: string;
  extraOption?: React.ReactNode;
}

export interface DateFieldDataType extends CommonFieldDataType {
  type: FieldTypeEnum.DATE;
  format?: DateFormatType;
  placeholder?: string;
  showTime?: { minuteStep: DatePickerProps["minuteStep"] };
}

export type FieldDataType =
  InputFieldDataType | NumberFieldDataType | SelectFieldDataType | DateFieldDataType;

export type FieldViewType<T extends object> = {
  mapKey: keyof T;
  label: string;
  optional?: boolean;
  rules?: FormItemProps["rules"];
  render?: (mapKey: keyof T) => React.ReactNode;
};

export type FieldViewProps<T extends object> = FieldDataType & FieldViewType<T>;

export type FieldType<T extends object> = FieldViewType<T> & {
  fieldData?: FieldDataType;
};

export interface FormViewProps<T extends object> extends Omit<FormProps, "children" | "fields"> {
  fields: FieldType<T>[];
}
