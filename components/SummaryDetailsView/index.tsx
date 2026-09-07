import { Descriptions } from "antd";
import { DescriptionsItemProps } from "antd/es/descriptions/Item";

import { SummaryContentType, SummaryDetailsViewProps, SummaryViewEnum } from "./index.type";
import SummaryView from "./SummaryView";

function SummaryDetailsView<T extends object>({
  data,
  items,
  onAction,
}: SummaryDetailsViewProps<T>) {
  const ITEMS: DescriptionsItemProps[] = items.map(({ summaryViewData, mapKey, ...item }) => ({
    ...item,
    children: (
      <SummaryView
        type={SummaryViewEnum.TEXT}
        mapKey={mapKey}
        text={data[mapKey] as SummaryContentType<T>}
        data={data}
        {...summaryViewData}
        onAction={onAction}
      />
    ),
  }));

  return <Descriptions column={1} size="small" bordered items={ITEMS} />;
}

export default SummaryDetailsView;
