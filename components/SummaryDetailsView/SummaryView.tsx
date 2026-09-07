import ChipView from "@/components/ChipView";
import MaskView from "@/components/MaskView";
import LinkButton from "@/components/Others/LinkButton";
import { dateFormat } from "@/utils/helpers/date";
import { SummaryViewEnum, SummaryViewProps } from "./index.type";

function SummaryView<T extends object>({
  mapKey,
  text,
  data,
  render,
  onAction,
  ...summaryViewData
}: SummaryViewProps<T>): React.ReactNode {
  if (!text) return "-";

  switch (summaryViewData.type) {
    case SummaryViewEnum.NUMBER:
      return (typeof text === "number" ? text : Number(text)).toLocaleString();
    case SummaryViewEnum.DATE:
      return dateFormat(String(text), summaryViewData.format);
    case SummaryViewEnum.BOOLEAN:
      const { labelTrue = "Yes", labelFalse = "No" } = summaryViewData;
      return (typeof text === "boolean" ? text : Boolean(text)) ? labelTrue : labelFalse;
    case SummaryViewEnum.MASK:
      return <MaskView text={String(text)} maskPattern={summaryViewData.maskPattern} />;
    case SummaryViewEnum.CHIP:
      return <ChipView text={String(text)} optionsMap={summaryViewData.optionsMap} />;
    case SummaryViewEnum.LINK:
      if (!onAction) return String(text);
      return <LinkButton onClick={() => onAction(mapKey)}>{String(text)}</LinkButton>;
    default: {
      if (render) return render(text, data);
      return String(text);
    }
  }
}

export default SummaryView;
