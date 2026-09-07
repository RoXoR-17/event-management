import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { defaultPageSize } from "@/utils/helpers/pagination";
import { CellActionTypeEnum, CellViewEnum, TableCardColumnType } from "./index.type";

export const paginatedIndexColumnData = {
  title: "#",
  dataIndex: "id",
  key: "id",
  align: "center",
  width: 80,
  cellViewData: {
    type: CellViewEnum.PAGINATED_INDEX,
    paginationParams: { page: 1, pageSize: defaultPageSize },
  },
} as const satisfies TableCardColumnType<{ id: string }>;

export const actionsColumnData = {
  title: "Action",
  dataIndex: "id",
  key: "action",
  align: "center",
  width: 120,
  cellViewData: {
    type: CellViewEnum.ACTIONS,
    actions: [
      { type: CellActionTypeEnum.EDIT, icon: <EditOutlined /> },
      { type: CellActionTypeEnum.DELETE, icon: <DeleteOutlined /> },
    ],
  },
} as const satisfies TableCardColumnType<{ id: string }>;

export const emptyData = Array.from({ length: 3 }).map((_, index) => ({ id: index }));
