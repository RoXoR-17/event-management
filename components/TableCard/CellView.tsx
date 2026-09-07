import { Button, Skeleton } from "antd";

import ChipView from "@/components/ChipView";
import { dateFormat } from "@/utils/helpers/date";
import styles from "./index.module.css";
import { CellActionTypeEnum, CellViewEnum, CellViewProps } from "./index.type";

function CellView<T extends object>({
  loading,
  text,
  record,
  index,
  render,
  onAction,
  ...cellViewData
}: CellViewProps<T>): React.ReactNode {
  if (loading) return <Skeleton.Button active block size="small" />;
  else if (!text) return "-";

  switch (cellViewData.type) {
    case CellViewEnum.NUMBER:
      return (typeof text === "number" ? text : Number(text)).toLocaleString();
    case CellViewEnum.DATE:
      return dateFormat(String(text), cellViewData.format);
    case CellViewEnum.BOOLEAN:
      const { labelTrue = "Yes", labelFalse = "No" } = cellViewData;
      return (typeof text === "boolean" ? text : Boolean(text)) ? labelTrue : labelFalse;
    case CellViewEnum.CHIP:
      return <ChipView text={`${text}`} optionsMap={cellViewData.optionsMap} />;
    case CellViewEnum.PAGINATED_INDEX:
      const { page, pageSize } = cellViewData.paginationParams;
      return (page - 1) * pageSize + index + 1;
    case CellViewEnum.ACTIONS:
      return (
        <div className={styles.table_actions_cell}>
          {cellViewData.actions?.map(({ type, icon }, index) => (
            <Button
              key={index}
              icon={icon}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onAction) onAction(type, record, index);
              }}
              danger={type === CellActionTypeEnum.DELETE}
              type="default"
              shape="circle"
              size="small"
            />
          ))}
        </div>
      );
    default: {
      if (render) return render(text, record, index);
      return String(text);
    }
  }
}

export default CellView;
