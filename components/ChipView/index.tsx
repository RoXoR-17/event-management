import { Tag, TagProps } from "antd";

export interface ChipDataType {
  label: string;
  color: TagProps["color"];
}

export type ChipOptionsMapType<T extends string> = Record<T, ChipDataType>;

export interface ChipViewProps<T extends string> {
  optionsMap: ChipOptionsMapType<T>;
  text: T;
}

function ChipView<T extends string>({ optionsMap, text }: ChipViewProps<T>) {
  const { color, label } = optionsMap[text] ?? {};
  return <Tag color={color}>{label}</Tag>;
}

export default ChipView;
