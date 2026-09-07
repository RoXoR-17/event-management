import { Card, Flex, Spin, Timeline, Typography } from "antd";
import { Fragment, useRef } from "react";

import { TimelineItemViewEnum, TimelineViewProps } from "./index.type";
import TimelineItemView from "./TimelineItemView";

function TimelineView<T extends object>({
  loading,
  data,
  total,
  titleItemData,
  items,
  emptyText = "No timeline items to display.",
  onLoadNext,
}: TimelineViewProps<T>) {
  const observer = useRef<IntersectionObserver>(null);

  const lastItemRef = (node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && onLoadNext && !loading) onLoadNext();
    });
    if (node) observer.current.observe(node);
  };

  if (!data.length && !loading) {
    return <Typography.Text>{emptyText}</Typography.Text>;
  }

  return (
    <Fragment>
      <Timeline
        style={{ paddingLeft: 8 }}
        items={data.map((eachData, index) => ({
          dot: (
            <div
              style={{
                marginTop: -4,
                marginBottom: -24,
                height: "1.6rem",
                width: "1.6rem",
                minWidth: "1.6rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--rs-color-link)",
                color: "var(--rs-color-white)",
                fontSize: "0.75rem",
                lineHeight: "1.5",
              }}
            >
              {(total ?? 0) - index}
            </div>
          ),
          children: (
            <Card
              variant="outlined"
              size="small"
              hoverable
              style={{ cursor: "auto", padding: "0.5rem 0.75rem" }}
              ref={!total || index + 1 < data.length ? null : lastItemRef}
            >
              <TimelineItemView
                data={eachData}
                text={eachData[titleItemData.mapKey]}
                {...titleItemData}
                {...(titleItemData.timelineItemViewData ?? { type: TimelineItemViewEnum.TEXT })}
              />
              <Flex style={{ marginTop: "0.5rem" }} gap="0.5rem" wrap="wrap">
                {items.map((itemData) => (
                  <TimelineItemView
                    key={String(itemData.mapKey)}
                    data={eachData}
                    text={eachData[itemData.mapKey]}
                    {...itemData}
                    {...(itemData.timelineItemViewData ?? { type: TimelineItemViewEnum.TEXT })}
                  />
                ))}
              </Flex>
            </Card>
          ),
        }))}
      />
      {loading && (
        <div style={{ padding: "1rem", textAlign: "center" }}>
          <Spin />
        </div>
      )}
    </Fragment>
  );
}

export default TimelineView;
