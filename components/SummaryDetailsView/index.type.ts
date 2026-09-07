import { DescriptionsProps } from "antd";

import { ChipOptionsMapType } from "@/components/ChipView";
import { MaskPatternType } from "@/components/MaskView";
import { MaybePromiseReturnType } from "@/types/common.type";
import { DateFormatType } from "@/utils/helpers/date";

export type DescriptionItemProps = Omit<
  NonNullable<DescriptionsProps["items"]>[number],
  "children"
>;

export type SummaryContentType<T extends object> = T[keyof T] | string | number | boolean;

export const enum SummaryViewEnum {
  TEXT = "text",
  MASK = "mask",
  NUMBER = "number",
  DATE = "date",
  BOOLEAN = "boolean",
  CHIP = "chip",
  LINK = "link",
}

export interface CommonSummaryViewDataType {
  type: SummaryViewEnum;
}

export interface TextSummaryViewDataType extends CommonSummaryViewDataType {
  type: SummaryViewEnum.TEXT;
}

export interface NumberSummaryViewDataType extends CommonSummaryViewDataType {
  type: SummaryViewEnum.NUMBER;
  showDecimals?: boolean | { decimalsUpto: number };
}

export interface DateSummaryViewDataType extends CommonSummaryViewDataType {
  type: SummaryViewEnum.DATE;
  format?: DateFormatType;
}

export interface BooleanSummaryViewDataType extends CommonSummaryViewDataType {
  type: SummaryViewEnum.BOOLEAN;
  labelTrue?: string;
  labelFalse?: string;
}

export interface MaskSummaryViewDataType extends CommonSummaryViewDataType {
  type: SummaryViewEnum.MASK;
  maskPattern?: MaskPatternType;
}

export interface ChipSummaryViewDataType extends CommonSummaryViewDataType {
  type: SummaryViewEnum.CHIP;
  optionsMap: ChipOptionsMapType<string>;
}

export interface LinkSummaryViewDataType extends CommonSummaryViewDataType {
  type: SummaryViewEnum.LINK;
}

export type SummaryViewDataType =
  | TextSummaryViewDataType
  | NumberSummaryViewDataType
  | DateSummaryViewDataType
  | BooleanSummaryViewDataType
  | MaskSummaryViewDataType
  | ChipSummaryViewDataType
  | LinkSummaryViewDataType;

export type LinkActionEventType<T extends object> = (mapKey: keyof T) => MaybePromiseReturnType;

export type SummaryViewProps<T extends object> = SummaryViewDataType & {
  mapKey: keyof T;
  text: SummaryContentType<T>;
  data: T;
  render?: (text: SummaryContentType<T>, data: T) => React.ReactNode;
  onAction?: LinkActionEventType<T>;
};

export type SummaryViewType<T extends object> = DescriptionItemProps & {
  summaryViewData?: SummaryViewDataType;
  mapKey: keyof T;
  render?: (text: SummaryContentType<T>, data: T) => React.ReactNode;
};

export interface SummaryDetailsViewProps<T extends object> {
  data: T;
  items: SummaryViewType<T>[];
  onAction?: LinkActionEventType<T>;
}
