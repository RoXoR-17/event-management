import dayjs, { Dayjs } from "dayjs";

export type WithDateType<T extends object, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] | Dayjs;
};

export const parseDate = (date: string | Date) => dayjs(date);

export enum DateFormatBaseType {
  Y = "YYYY",
  Mo = "MM",
  MON = "MMM",
  MONTH = "MMMM",
  D = "DD",
  DAY = "Do",
  H = "hh",
  M = "mm",
  S = "ss",
  A = "A",
}

export enum DateFormatType {
  YYYY_MM_DD = `${DateFormatBaseType.Y}-${DateFormatBaseType.Mo}-${DateFormatBaseType.D}`,
  DD_MM_YYYY = `${DateFormatBaseType.D}-${DateFormatBaseType.Mo}-${DateFormatBaseType.Y}`,
  DAY_MON_YYYY = `${DateFormatBaseType.DAY} ${DateFormatBaseType.MON}, ${DateFormatBaseType.Y}`,
  H_M_A = `${DateFormatBaseType.H}:${DateFormatBaseType.M} ${DateFormatBaseType.A}`,
  DAY_MON_YYYY_H_M_A = `${DateFormatBaseType.DAY} ${DateFormatBaseType.MON}, ${DateFormatBaseType.Y} ${DateFormatBaseType.H}:${DateFormatBaseType.M} ${DateFormatBaseType.A}`,
}

export const dateFormat = (date: string | Date, format?: DateFormatType): string =>
  parseDate(date).format(format ?? DateFormatType.DAY_MON_YYYY_H_M_A);
