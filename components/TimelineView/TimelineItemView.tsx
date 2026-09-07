import LinkButton from "@/components/Others/LinkButton";
import { dateFormat } from "@/utils/helpers/date";
import ChipView from "../ChipView";
import MaskView from "../MaskView";
import { TimelineItemViewEnum, TimelineItemViewProps } from "./index.type";

function TimelineItemView<T extends object>({
  mapKey,
  text,
  data,
  render,
  onAction,
  ...timelineItemViewData
}: TimelineItemViewProps<T>) {
  switch (timelineItemViewData.type) {
    case TimelineItemViewEnum.NUMBER:
      return (typeof text === "number" ? text : Number(text)).toLocaleString();
    case TimelineItemViewEnum.DATE:
      return !text ? "-" : dateFormat(String(text), timelineItemViewData.format);
    case TimelineItemViewEnum.BOOLEAN:
      const { labelTrue = "Yes", labelFalse = "No" } = timelineItemViewData;
      return (typeof text === "boolean" ? text : Boolean(text)) ? labelTrue : labelFalse;
    case TimelineItemViewEnum.MASK:
      return <MaskView text={String(text)} maskPattern={timelineItemViewData.maskPattern} />;
    case TimelineItemViewEnum.CHIP:
      return <ChipView text={String(text)} optionsMap={timelineItemViewData.optionsMap} />;
    case TimelineItemViewEnum.LINK:
      if (!onAction) return String(text);
      return (
        <LinkButton underline={timelineItemViewData.underline} onClick={() => onAction(mapKey)}>
          {String(text)}
        </LinkButton>
      );
    default: {
      if (render) return render(text, data);
      return String(text);
    }
  }
}

export default TimelineItemView;
