import { MaybePromiseReturnType } from "@/types/common.type";
import { DateFormatType } from "@/utils/helpers/date";
import { ChipOptionsMapType } from "../ChipView";
import { MaskPatternType } from "../MaskView";

export type TimelineItemContentType<T extends object> = T[keyof T] | string | number | boolean;

export const enum TimelineItemViewEnum {
  TEXT = "text",
  MASK = "mask",
  NUMBER = "number",
  DATE = "date",
  BOOLEAN = "boolean",
  CHIP = "chip",
  LINK = "link",
}

export interface CommonTimelineItemViewDataType {
  type: TimelineItemViewEnum;
}

export interface TextTimelineItemViewDataType extends CommonTimelineItemViewDataType {
  type: TimelineItemViewEnum.TEXT;
}

export interface NumberTimelineItemViewDataType extends CommonTimelineItemViewDataType {
  type: TimelineItemViewEnum.NUMBER;
  showDecimals?: boolean | { decimalsUpto: number };
}

export interface DateTimelineItemViewDataType extends CommonTimelineItemViewDataType {
  type: TimelineItemViewEnum.DATE;
  format?: DateFormatType;
}

export interface BooleanTimelineItemViewDataType extends CommonTimelineItemViewDataType {
  type: TimelineItemViewEnum.BOOLEAN;
  labelTrue?: string;
  labelFalse?: string;
}

export interface MaskTimelineItemViewDataType extends CommonTimelineItemViewDataType {
  type: TimelineItemViewEnum.MASK;
  maskPattern?: MaskPatternType;
}

export interface ChipTimelineItemViewDataType extends CommonTimelineItemViewDataType {
  type: TimelineItemViewEnum.CHIP;
  optionsMap: ChipOptionsMapType<string>;
}

export interface LinkTimelineItemViewDataType extends CommonTimelineItemViewDataType {
  type: TimelineItemViewEnum.LINK;
  underline?: boolean;
}

export type TimelineItemViewDataType =
  | TextTimelineItemViewDataType
  | NumberTimelineItemViewDataType
  | DateTimelineItemViewDataType
  | BooleanTimelineItemViewDataType
  | MaskTimelineItemViewDataType
  | ChipTimelineItemViewDataType
  | LinkTimelineItemViewDataType;

export type LinkActionEventType<T extends object> = (mapKey: keyof T) => MaybePromiseReturnType;

export type TimelineItemViewProps<T extends object> = TimelineItemViewDataType & {
  mapKey: keyof T;
  text: TimelineItemContentType<T>;
  data: T;
  render?: (text: TimelineItemContentType<T>, data: T) => React.ReactNode;
  onAction?: LinkActionEventType<T>;
};

export interface TimelineItemViewType<T extends object> {
  timelineItemViewData?: TimelineItemViewDataType;
  mapKey: keyof T;
  render?: (text: TimelineItemContentType<T>, data: T) => React.ReactNode;
}

export interface TimelineViewProps<T extends object> {
  loading?: boolean;
  data: T[];
  total?: number | null;
  titleItemData: TimelineItemViewType<T>;
  items: TimelineItemViewType<T>[];
  emptyText?: string;
  onLoadNext?: () => void;
  onAction?: LinkActionEventType<T>;
}
